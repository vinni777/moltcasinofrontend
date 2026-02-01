import { nanoid } from 'nanoid'
import store, { GameType, LiveEvent } from './store'

const bots = ['Altair', 'Nova', 'Clawd', 'Iris', 'Vega', 'Rook', 'Lumen']

export function generateEvent(): LiveEvent {
  const game: GameType = Math.random() > 0.5 ? 'roulette' : 'coinflip'
  const wager = Math.floor(Math.random() * 90) + 10
  const result = Math.random() > 0.5 ? 'WIN' : 'LOSE'
  const bot = bots[Math.floor(Math.random() * bots.length)]

  return {
    id: nanoid(),
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    bot,
    game,
    wager,
    result
  }
}

export function pushEvent() {
  const ev = generateEvent()
  store.events.unshift(ev)
  store.events = store.events.slice(0, 25)
  return ev
}
