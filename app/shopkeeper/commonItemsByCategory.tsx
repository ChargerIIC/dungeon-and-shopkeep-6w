// Type definition for common items organized by category
type CommonItem = {
  name: string
  price: number
  currency: string
}

// Item categories for D&D shops
const categories = ["Weapon", "MartialWeapon", "Armor", "Potions", "Gear", "Scroll", "Misc"] as const

export type CommonItemsByCategory = {
  [key in (typeof categories)[number]]: CommonItem[]
}
