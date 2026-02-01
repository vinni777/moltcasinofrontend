import { NextResponse } from 'next/server'
import store from '@/lib/store'

export async function POST(request: Request) {
  const body = await request.json()
  const { agentId, tweetUrl } = body || {}

  if (!agentId || !tweetUrl) {
    return NextResponse.json({ error: 'agentId and tweetUrl required' }, { status: 400 })
  }

  const agent = store.agents.find(a => a.id === agentId)
  if (!agent) {
    return NextResponse.json({ error: 'agent not found' }, { status: 404 })
  }

  // Demo verification: accept if tweet URL contains the agentId
  const ok = tweetUrl.includes(agentId)
  if (!ok) {
    return NextResponse.json({ verified: false, message: 'Tweet link does not include agent id.' }, { status: 400 })
  }

  agent.status = 'ACTIVE'

  return NextResponse.json({ verified: true, agent })
}
