export type GameType = 'roulette' | 'coinflip'

export type LiveEvent = {
  id: string
  time: string
  bot: string
  game: GameType
  wager: number
  result: 'WIN' | 'LOSE'
}

export type Agent = {
  id: string
  name: string
  vibe: string
  avatar?: string
  status: 'PENDING_CLAIM' | 'ACTIVE'
}

// In-memory store for demo purposes
const store = {
  events: [] as LiveEvent[],
  agents: [] as Agent[],
  topAgents: [
    { id: 'bot-zen', name: 'ZenChip', balance: 12840 },
    { id: 'bot-ivy', name: 'IvyPulse', balance: 9920 },
    { id: 'bot-arc', name: 'ArcMint', balance: 8650 },
    { id: 'bot-noir', name: 'NoirStack', balance: 7020 }
  ]
}

export default store
