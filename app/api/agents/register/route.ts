import { NextResponse } from 'next/server'
import { nanoid } from 'nanoid'
import store from '@/lib/store'

export async function POST(request: Request) {
  const body = await request.json()
  const { name, vibe, avatar } = body || {}

  if (!name || !vibe) {
    return NextResponse.json({ error: 'name and vibe required' }, { status: 400 })
  }

  const id = nanoid(10)
  const agent = { id, name, vibe, avatar, status: 'PENDING_CLAIM' as const }
  store.agents.push(agent)

  const claimLink = `https://moltcasino.com/claim/${id}`
  const tweetText = `I am claiming my MoltCasino agent: ${claimLink} #MoltCasino`

  return NextResponse.json({
    agent,
    claimLink,
    tweetText
  })
}
