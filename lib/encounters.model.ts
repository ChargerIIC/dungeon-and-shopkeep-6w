export interface EncounterNPC {
  id: string
  name: string
  role: string
  notes: string
  initiative?: number
  currentHp?: number
  maxHp?: number
  status?: string
}

export interface TreasureItem {
  id: string
  name: string
  type: string
  value: string
  description: string
}

export interface MapAttachment {
  id: string
  name: string
  url: string
}

export interface Encounter {
  id?: string
  title: string
  description: string
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly'
  environment: string
  partyLevel: number
  partySize: number
  npcs: EncounterNPC[]
  treasures: TreasureItem[]
  maps: MapAttachment[]
  notes: string
  creatorId: string
  createdAt: Date
  updatedAt: Date
}