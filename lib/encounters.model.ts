export interface Encounter {
  id?: string
  name: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly'
  creatures: EncounterCreature[]
  environment: string
  notes: string
  creatorId: string
  createdAt?: Date
  updatedAt?: Date
}

export interface EncounterCreature {
  id: string
  name: string
  quantity: number
  initiative?: number
  currentHp?: number
  maxHp: number
  status?: string
}