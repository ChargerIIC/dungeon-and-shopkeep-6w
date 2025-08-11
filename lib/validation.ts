/**
 * Input validation utilities for the shop creator application
 * Provides comprehensive validation for all user inputs to prevent security vulnerabilities
 */

// Validation result type
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// Shop validation constraints
export const VALIDATION_CONSTRAINTS = {
  shopTitle: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-'.&!()]+$/,
    description: "Shop title must be 1-100 characters and contain only letters, numbers, spaces, and basic punctuation",
  },
  ownerName: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z\s\-'.]+$/,
    description:
      "Owner name must be 1-100 characters and contain only letters, spaces, hyphens, apostrophes, and periods",
  },
  itemName: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-'.&!()]+$/,
    description: "Item name must be 1-50 characters and contain only letters, numbers, spaces, and basic punctuation",
  },
  itemPrice: {
    min: 0,
    max: 999999,
    description: "Price must be between 0 and 999,999",
  },
  itemCategory: {
    allowedValues: ["Weapon", "MartialWeapon", "Armor", "Potions", "Gear", "Scroll", "Misc"],
    description: "Category must be one of the predefined values",
  },
  itemCurrency: {
    allowedValues: ["GP", "SP", "CP", "PP"],
    description: "Currency must be GP, SP, CP, or PP",
  },
  theme: {
    allowedValues: ["parchment", "tavern", "arcane", "forest", "dungeon"],
    description: "Theme must be one of the predefined values",
  },
} as const

// NPC validation constraints
export const NPC_VALIDATION_CONSTRAINTS = {
  npcName: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-'.&!()]+$/,
    description: "NPC name must be 1-100 characters and contain only letters, numbers, spaces, and basic punctuation",
  },
  profession: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-'.&!()]+$/,
    description: "Profession must be 1-50 characters and contain only letters, spaces, and basic punctuation",
  },
  description: {
    minLength: 0,
    maxLength: 1000,
    pattern: /^[a-zA-Z0-9\s\-'.&!(),;:?"\n\r]+$/,
    description:
      "Description must be no more than 1000 characters and contain only letters, numbers, spaces, and basic punctuation",
  },
} as const

/**
 * Sanitizes a string for real-time input (less aggressive, preserves spaces during typing)
 */
export function sanitizeInputString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove HTML brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+=/gi, "") // Remove event handlers
    .replace(/alert\s*$$[^)]*$$/gi, "") // Remove JavaScript alert commands
    .slice(0, 1000) // Limit length as a safety measure
}

/**
 * Sanitizes a string by removing or escaping potentially dangerous characters (for final processing)
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove HTML brackets
    .replace(/javascript:/gi, "") // Remove javascript: protocols
    .replace(/on\w+=/gi, "") // Remove event handlers
    .replace(/alert\s*$$[^)]*$$/gi, "") // Remove JavaScript alert commands
    .trim() // Remove leading/trailing whitespace
    .slice(0, 1000) // Limit length as a safety measure
}

/**
 * Validates a string field with length and pattern constraints
 */
export function validateStringField(
  value: string,
  fieldName: string,
  constraints: {
    minLength: number
    maxLength: number
    pattern: RegExp
    description: string
  },
): ValidationResult {
  const errors: string[] = []
  const sanitizedValue = sanitizeString(value)

  // Check if empty
  if (!sanitizedValue || sanitizedValue.length === 0) {
    errors.push(`${fieldName} is required`)
    return { isValid: false, errors }
  }

  // Check length constraints
  if (sanitizedValue.length < constraints.minLength) {
    errors.push(`${fieldName} must be at least ${constraints.minLength} characters long`)
  }

  if (sanitizedValue.length > constraints.maxLength) {
    errors.push(`${fieldName} must be no more than ${constraints.maxLength} characters long`)
  }

  // Check pattern
  if (!constraints.pattern.test(sanitizedValue)) {
    errors.push(`${fieldName} contains invalid characters. ${constraints.description}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates a numeric field with min/max constraints
 */
export function validateNumericField(
  value: number,
  fieldName: string,
  constraints: {
    min: number
    max: number
    description: string
  },
): ValidationResult {
  const errors: string[] = []

  // Check if it's a valid number
  if (isNaN(value) || !isFinite(value)) {
    errors.push(`${fieldName} must be a valid number`)
    return { isValid: false, errors }
  }

  // Check range constraints
  if (value < constraints.min) {
    errors.push(`${fieldName} must be at least ${constraints.min}`)
  }

  if (value > constraints.max) {
    errors.push(`${fieldName} must be no more than ${constraints.max}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates a field against allowed values
 */
export function validateEnumField(
  value: string,
  fieldName: string,
  constraints: {
    allowedValues: readonly string[]
    description: string
  },
): ValidationResult {
  const errors: string[] = []

  if (!constraints.allowedValues.includes(value)) {
    errors.push(`${fieldName} must be one of: ${constraints.allowedValues.join(", ")}`)
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates shop title
 */
export function validateShopTitle(title: string): ValidationResult {
  return validateStringField(title, "Shop title", VALIDATION_CONSTRAINTS.shopTitle)
}

/**
 * Validates owner name
 */
export function validateOwnerName(name: string): ValidationResult {
  return validateStringField(name, "Owner name", VALIDATION_CONSTRAINTS.ownerName)
}

/**
 * Validates item name
 */
export function validateItemName(name: string): ValidationResult {
  return validateStringField(name, "Item name", VALIDATION_CONSTRAINTS.itemName)
}

/**
 * Validates item price
 */
export function validateItemPrice(price: number): ValidationResult {
  return validateNumericField(price, "Item price", VALIDATION_CONSTRAINTS.itemPrice)
}

/**
 * Validates item category
 */
export function validateItemCategory(category: string): ValidationResult {
  return validateEnumField(category, "Item category", VALIDATION_CONSTRAINTS.itemCategory)
}

/**
 * Validates item currency
 */
export function validateItemCurrency(currency: string): ValidationResult {
  return validateEnumField(currency, "Item currency", VALIDATION_CONSTRAINTS.itemCurrency)
}

/**
 * Validates theme
 */
export function validateTheme(theme: string): ValidationResult {
  return validateEnumField(theme, "Theme", VALIDATION_CONSTRAINTS.theme)
}

/**
 * Validates a complete item object
 */
export function validateItem(item: {
  name: string
  category: string
  price: number
  currency: string
}): ValidationResult {
  const allErrors: string[] = []

  const nameResult = validateItemName(item.name)
  const categoryResult = validateItemCategory(item.category)
  const priceResult = validateItemPrice(item.price)
  const currencyResult = validateItemCurrency(item.currency)

  allErrors.push(...nameResult.errors)
  allErrors.push(...categoryResult.errors)
  allErrors.push(...priceResult.errors)
  allErrors.push(...currencyResult.errors)

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  }
}

/**
 * Validates a complete shop object
 */
export function validateShop(shop: {
  title: string
  owner: string
  items: Array<{
    name: string
    category: string
    price: number
    currency: string
  }>
  theme: string
}): ValidationResult {
  const allErrors: string[] = []

  // Validate basic shop fields
  const titleResult = validateShopTitle(shop.title)
  const ownerResult = validateOwnerName(shop.owner)
  const themeResult = validateTheme(shop.theme)

  allErrors.push(...titleResult.errors)
  allErrors.push(...ownerResult.errors)
  allErrors.push(...themeResult.errors)

  // Validate items array
  if (!Array.isArray(shop.items)) {
    allErrors.push("Items must be an array")
  } else {
    // Check item count limit
    if (shop.items.length > 100) {
      allErrors.push("Shop cannot have more than 100 items")
    }

    // Validate each item
    shop.items.forEach((item, index) => {
      const itemResult = validateItem(item)
      if (!itemResult.isValid) {
        itemResult.errors.forEach((error) => {
          allErrors.push(`Item ${index + 1}: ${error}`)
        })
      }
    })
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  }
}

/**
 * Validates NPC name
 */
export function validateNPCName(name: string): ValidationResult {
  return validateStringField(name, "NPC name", NPC_VALIDATION_CONSTRAINTS.npcName)
}

/**
 * Validates NPC profession
 */
export function validateProfession(profession: string): ValidationResult {
  return validateStringField(profession, "Profession", NPC_VALIDATION_CONSTRAINTS.profession)
}

/**
 * Validates NPC description
 */
export function validateDescription(description: string): ValidationResult {
  const errors: string[] = []
  const sanitizedValue = sanitizeString(description)

  // Description can be empty, so only validate if it has content
  if (sanitizedValue.length > 0) {
    if (sanitizedValue.length > NPC_VALIDATION_CONSTRAINTS.description.maxLength) {
      errors.push(
        `Description must be no more than ${NPC_VALIDATION_CONSTRAINTS.description.maxLength} characters long`,
      )
    }

    if (!NPC_VALIDATION_CONSTRAINTS.description.pattern.test(sanitizedValue)) {
      errors.push(`Description contains invalid characters. ${NPC_VALIDATION_CONSTRAINTS.description.description}`)
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Validates a complete NPC object
 */
export function validateNPC(npc: {
  name: string
  profession: string
  description: string
  vocalNotes: string
  inventory: Array<{
    name: string
    description: string
  }>
  stats: {
    STR: number
    DEX: number
    CON: number
    INT: number
    WIS: number
    CHA: number
    armorClass: number
    hitPoints: number
    speed: number
    proficiencyBonus: number
  }
  theme: string
}): ValidationResult {
  const allErrors: string[] = []

  // Validate basic NPC fields
  const nameResult = validateNPCName(npc.name)
  const professionResult = validateProfession(npc.profession)
  const descriptionResult = validateDescription(npc.description)
  const vocalNotesResult = validateDescription(npc.vocalNotes) // Reuse description validation
  const themeResult = validateTheme(npc.theme)

  allErrors.push(...nameResult.errors)
  allErrors.push(...professionResult.errors)
  allErrors.push(...descriptionResult.errors)
  allErrors.push(...vocalNotesResult.errors)
  allErrors.push(...themeResult.errors)

  // Validate stats
  const statNames = ["STR", "DEX", "CON", "INT", "WIS", "CHA"] as const
  statNames.forEach((stat) => {
    const value = npc.stats[stat]
    if (isNaN(value) || value < 1 || value > 30) {
      allErrors.push(`${stat} must be between 1 and 30`)
    }
  })

  // Validate combat stats
  if (isNaN(npc.stats.armorClass) || npc.stats.armorClass < 1 || npc.stats.armorClass > 30) {
    allErrors.push("Armor Class must be between 1 and 30")
  }
  if (isNaN(npc.stats.hitPoints) || npc.stats.hitPoints < 1 || npc.stats.hitPoints > 999) {
    allErrors.push("Hit Points must be between 1 and 999")
  }
  if (isNaN(npc.stats.speed) || npc.stats.speed < 0 || npc.stats.speed > 120) {
    allErrors.push("Speed must be between 0 and 120")
  }
  if (isNaN(npc.stats.proficiencyBonus) || npc.stats.proficiencyBonus < 1 || npc.stats.proficiencyBonus > 6) {
    allErrors.push("Proficiency Bonus must be between 1 and 6")
  }

  // Validate inventory array
  if (!Array.isArray(npc.inventory)) {
    allErrors.push("Inventory must be an array")
  } else {
    // Check inventory item count limit
    if (npc.inventory.length > 50) {
      allErrors.push("NPC cannot have more than 50 inventory items")
    }

    // Validate each inventory item
    npc.inventory.forEach((item, index) => {
      const itemNameResult = validateNPCName(item.name) // Reuse NPC name validation
      const itemDescResult = validateDescription(item.description)

      if (!itemNameResult.isValid) {
        itemNameResult.errors.forEach((error) => {
          allErrors.push(`Inventory item ${index + 1} name: ${error}`)
        })
      }

      if (!itemDescResult.isValid) {
        itemDescResult.errors.forEach((error) => {
          allErrors.push(`Inventory item ${index + 1} description: ${error}`)
        })
      }
    })
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  }
}

/**
 * Higher-order function to create a debounced validator for real-time validation
 */
export function createDebouncedValidator<T>(validator: (value: T) => ValidationResult, delay = 300) {
  let timeoutId: NodeJS.Timeout | null = null

  return (value: T, callback: (result: ValidationResult) => void) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      const result = validator(value)
      callback(result)
    }, delay)
  }
}
