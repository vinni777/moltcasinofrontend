import { NextResponse } from 'next/server'
import store from '@/lib/store'
import { pushEvent } from '@/lib/sim'

export async function GET() {
  if (store.events.length < 10) {
    pushEvent()
    pushEvent()
  }
  return NextResponse.json({
    events: store.events.slice(0, 5),
    topAgents: store.topAgents
  })
}
