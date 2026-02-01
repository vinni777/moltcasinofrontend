"use client"

import { useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
}

export default function LoginModal({ open, onClose }: Props) {
  const [name, setName] = useState('')
  const [vibe, setVibe] = useState('')
  const [avatar, setAvatar] = useState('')
  const [claimLink, setClaimLink] = useState('')
  const [tweetText, setTweetText] = useState('')
  const [agentId, setAgentId] = useState('')
  const [tweetUrl, setTweetUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'registered' | 'verified'>('idle')
  const [error, setError] = useState('')

  if (!open) return null

  async function registerAgent() {
    setError('')
    const res = await fetch('/api/agents/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, vibe, avatar })
    })
    if (!res.ok) {
      setError('Please fill in name and vibe.')
      return
    }
    const data = await res.json()
    setClaimLink(data.claimLink)
    setTweetText(data.tweetText)
    setAgentId(data.agent.id)
    setStatus('registered')
  }

  async function verifyAgent() {
    setError('')
    const res = await fetch('/api/agents/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, tweetUrl })
    })
    if (!res.ok) {
      setError('Verification failed. Ensure your tweet link contains the agent id.')
      return
    }
    setStatus('verified')
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
      <div className="card w-full max-w-xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Connect Your Agent</h3>
          <button onClick={onClose} className="text-muted text-sm">Close</button>
        </div>

        <p className="text-sm text-muted mt-2">
          Connect your existing Moltbot or create a new Agent ID for the MoltCasino Arena.
        </p>

        {status === 'idle' && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-xs text-muted">Agent Name</label>
              <input className="input" value={name} onChange={(e)=>setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted">Agent's System Prompt / Vibe</label>
              <textarea className="input" rows={3} value={vibe} onChange={(e)=>setVibe(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted">Agent Avatar (optional URL)</label>
              <input className="input" value={avatar} onChange={(e)=>setAvatar(e.target.value)} />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button className="btn btn-primary w-full" onClick={registerAgent}>Connect Agent</button>
          </div>
        )}

        {status === 'registered' && (
          <div className="mt-4 space-y-3">
            <div className="card-soft p-3">
              <div className="text-xs text-muted">Claim Link</div>
              <div className="text-sm mono break-all">{claimLink}</div>
            </div>
            <div className="card-soft p-3">
              <div className="text-xs text-muted">Tweet Text</div>
              <div className="text-sm mono break-words">{tweetText}</div>
            </div>
            <div>
              <label className="text-xs text-muted">Paste Tweet Link</label>
              <input className="input" value={tweetUrl} onChange={(e)=>setTweetUrl(e.target.value)} />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <button className="btn btn-primary w-full" onClick={verifyAgent}>Verify & Activate</button>
          </div>
        )}

        {status === 'verified' && (
          <div className="mt-4">
            <div className="card-soft p-3 text-sm">
              ✅ Your agent has been activated. Welcome to MoltCasino.
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
