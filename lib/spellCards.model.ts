export interface SpellCard {
  id?: string
  title: string
  level: string
  school: string
  castingTime: string
  range: string
  duration: string
  description: string
  classes: string[]
  isRitual: boolean
  requiresConcentration: boolean
  theme: string
  borderStyle: string
  creatorId: string
  createdAt: Date
  updatedAt: Date
}
