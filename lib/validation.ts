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

// Encounter validation constraints
export const ENCOUNTER_VALIDATION_CONSTRAINTS = {
  encounterTitle: {
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9\s\-'.&!()]+$/,
    description:
      "Encounter title must be 1-100 characters and contain only letters, numbers, spaces, and basic punctuation",
  },
  encounterDescription: {
    minLength: 0,
    maxLength: 2000,
    pattern: /^[a-zA-Z0-9\s\-'.&!(),;:?"\n\r]*$/,
    description:
      "Description must be no more than 2000 characters and contain only letters, numbers, spaces, and basic punctuation",
  },
  npcName: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-'.&!()]+$/,
    description: "NPC name must be 1-50 characters and contain only letters, numbers, spaces, and basic punctuation",
  },
  npcRole: {
    minLength: 0,
    maxLength: 50,
    pattern: /^[a-zA-Z\s\-'.&!()]*$/,
    description: "NPC role must be no more than 50 characters and contain only letters, spaces, and basic punctuation",
  },
  treasureName: {
    minLength: 1,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-'.&!()]+$/,
    description:
      "Treasure name must be 1-50 characters and contain only letters, numbers, spaces, and basic punctuation",
  },
  treasureValue: {
    minLength: 0,
    maxLength: 20,
    pattern: /^[a-zA-Z0-9\s\-'.]*$/,
    description: "Treasure value must be no more than 20 characters",
  },
  encounterNotes: {
    minLength: 0,
    maxLength: 5000,
    pattern: /^[a-zA-Z0-9\s\-'.&!(),;:?"\n\r]*$/,
    description:
      "Notes must be no more than 5000 characters and contain only letters, numbers, spaces, and basic punctuation",
  },
  difficulty: {
    allowedValues: ["Easy", "Medium", "Hard", "Deadly"],
    description: "Difficulty must be Easy, Medium, Hard, or Deadly",
  },
  environment: {
    allowedValues: [
      "Dungeon",
      "Forest",
      "Mountain",
      "Desert",
      "Swamp",
      "Urban",
      "Coastal",
      "Underground",
      "Planar",
      "Arctic",
      "Grassland",
      "Hills",
      "Ruins",
      "Temple",
      "Castle",
    ],
    description: "Environment must be one of the predefined values",
  },
  treasureType: {
    allowedValues: ["Coins", "Gems", "Art Objects", "Magic Items", "Equipment", "Consumables"],
    description: "Treasure type must be one of the predefined values",
  },
  partyLevel: {
    min: 1,
    max: 20,
    description: "Party level must be between 1 and 20",
  },
  partySize: {
    min: 1,
    max: 10,
    description: "Party size must be between 1 and 10",
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
  const sanitized = input
    .replace(/^javascript:.*/gi, "") // Remove entire javascript: URLs
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/on\w+\s*=\s*[^>\s]+/gi, "") // Remove event handlers
    .trim()

  return sanitized.substring(0, 1000) // Limit to 1000 characters
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

  // Validate shop title
  const titleResult = validateShopTitle(shop.title)
  allErrors.push(...titleResult.errors)

  // Validate owner name
  const ownerResult = validateOwnerName(shop.owner)
  allErrors.push(...ownerResult.errors)

  // Validate theme
  const themeResult = validateTheme(shop.theme)
  allErrors.push(...themeResult.errors)

  //Validate number of items
  if (shop.items?.length > 100) {
    allErrors.push(`Shop can only have a maximum of 100 items.`)
  }

  // Validate each item
  for (let i = 0; i < shop.items.length; i++) {
    const itemResult = validateItem(shop.items[i])
    if (!itemResult.isValid) {
      allErrors.push(`Item #${i + 1}: ${itemResult.errors.join(", ")}`)
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  }
}

/**
 * Validates encounter title
 */
export function validateEncounterTitle(title: string): ValidationResult {
  return validateStringField(title, "Encounter title", ENCOUNTER_VALIDATION_CONSTRAINTS.encounterTitle)
}

/**
 * Validates encounter description
 */
export function validateEncounterDescription(description: string): ValidationResult {
  return validateStringField(
    description,
    "Encounter description",
    ENCOUNTER_VALIDATION_CONSTRAINTS.encounterDescription,
  )
}

/**
 * Validates NPC name
 */
export function validateNPCName(name: string): ValidationResult {
  return validateStringField(name, "NPC name", ENCOUNTER_VALIDATION_CONSTRAINTS.npcName)
}

/**
 * Validates NPC role
 */
export function validateNPCRole(role: string): ValidationResult {
  if (role.trim() === "") {
    return { isValid: true, errors: [] } // Role is optional
  }
  return validateStringField(role, "NPC role", ENCOUNTER_VALIDATION_CONSTRAINTS.npcRole)
}

/**
 * Validates treasure name
 */
export function validateTreasureName(name: string): ValidationResult {
  return validateStringField(name, "Treasure name", ENCOUNTER_VALIDATION_CONSTRAINTS.treasureName)
}

/**
 * Validates treasure value
 */
export function validateTreasureValue(value: string): ValidationResult {
  if (value.trim() === "") {
    return { isValid: true, errors: [] } // Value is optional
  }
  return validateStringField(value, "Treasure value", ENCOUNTER_VALIDATION_CONSTRAINTS.treasureValue)
}

/**
 * Validates encounter notes
 */
export function validateEncounterNotes(notes: string): ValidationResult {
  if (notes.trim() === "") {
    return { isValid: true, errors: [] } // Notes are optional
  }
  return validateStringField(notes, "Encounter notes", ENCOUNTER_VALIDATION_CONSTRAINTS.encounterNotes)
}

/**
 * Validates difficulty
 */
export function validateDifficulty(difficulty: string): ValidationResult {
  return validateEnumField(difficulty, "Difficulty", ENCOUNTER_VALIDATION_CONSTRAINTS.difficulty)
}

/**
 * Validates environment
 */
export function validateEnvironment(environment: string): ValidationResult {
  return validateEnumField(environment, "Environment", ENCOUNTER_VALIDATION_CONSTRAINTS.environment)
}

/**
 * Validates treasure type
 */
export function validateTreasureType(type: string): ValidationResult {
  return validateEnumField(type, "Treasure type", ENCOUNTER_VALIDATION_CONSTRAINTS.treasureType)
}

/**
 * Validates party level
 */
export function validatePartyLevel(level: number): ValidationResult {
  return validateNumericField(level, "Party level", ENCOUNTER_VALIDATION_CONSTRAINTS.partyLevel)
}

/**
 * Validates party size
 */
export function validatePartySize(size: number): ValidationResult {
  return validateNumericField(size, "Party size", ENCOUNTER_VALIDATION_CONSTRAINTS.partySize)
}

/**
 * Validates a complete encounter object
 */
export function validateEncounter(encounter: {
  title: string
  description: string
  difficulty: string
  environment: string
  partyLevel: number
  partySize: number
  npcs: Array<{ name: string; role: string }>
  treasures: Array<{ name: string; type: string; value: string }>
  notes: string
}): ValidationResult {
  const allErrors: string[] = []

  // Validate basic encounter fields
  const titleResult = validateEncounterTitle(encounter.title)
  const descriptionResult = validateEncounterDescription(encounter.description)
  const difficultyResult = validateDifficulty(encounter.difficulty)
  const environmentResult = validateEnvironment(encounter.environment)
  const partyLevelResult = validatePartyLevel(encounter.partyLevel)
  const partySizeResult = validatePartySize(encounter.partySize)
  const notesResult = validateEncounterNotes(encounter.notes)

  allErrors.push(...titleResult.errors)
  allErrors.push(...descriptionResult.errors)
  allErrors.push(...difficultyResult.errors)
  allErrors.push(...environmentResult.errors)
  allErrors.push(...partyLevelResult.errors)
  allErrors.push(...partySizeResult.errors)
  allErrors.push(...notesResult.errors)

  // Validate NPCs
  if (encounter.npcs.length > 50) {
    allErrors.push("Encounter can only have a maximum of 50 NPCs.")
  }

  for (let i = 0; i < encounter.npcs.length; i++) {
    const npc = encounter.npcs[i]
    const nameResult = validateNPCName(npc.name)
    const roleResult = validateNPCRole(npc.role)

    if (!nameResult.isValid) {
      allErrors.push(`NPC #${i + 1}: ${nameResult.errors.join(", ")}`)
    }
    if (!roleResult.isValid) {
      allErrors.push(`NPC #${i + 1} role: ${roleResult.errors.join(", ")}`)
    }
  }

  // Validate treasures
  if (encounter.treasures.length > 100) {
    allErrors.push("Encounter can only have a maximum of 100 treasure items.")
  }

  for (let i = 0; i < encounter.treasures.length; i++) {
    const treasure = encounter.treasures[i]
    const nameResult = validateTreasureName(treasure.name)
    const typeResult = validateTreasureType(treasure.type)
    const valueResult = validateTreasureValue(treasure.value)

    if (!nameResult.isValid) {
      allErrors.push(`Treasure #${i + 1}: ${nameResult.errors.join(", ")}`)
    }
    if (!typeResult.isValid) {
      allErrors.push(`Treasure #${i + 1} type: ${typeResult.errors.join(", ")}`)
    }
    if (!valueResult.isValid) {
      allErrors.push(`Treasure #${i + 1} value: ${valueResult.errors.join(", ")}`)
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  }
}
