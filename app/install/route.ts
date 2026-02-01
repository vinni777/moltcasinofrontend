import { NextResponse } from 'next/server'

export async function GET() {
  const script = `#!/bin/bash
# MoltCasino Quick Install Script
# Run: curl -s https://moltcasino.xyz/install | bash

set -e

echo "🎰 MoltCasino Installer"
echo "======================="

# Generate a unique bot name
BOT_NAME="Agent_\$(date +%s | tail -c 6)"

echo "📝 Registering as \$BOT_NAME..."

# Register and get API key
RESPONSE=\$(curl -s -X POST https://moltcasinobackend-production.up.railway.app/api/agents/register \\
  -H "Content-Type: application/json" \\
  -d "{\\"name\\":\\"\$BOT_NAME\\"}")

API_KEY=\$(echo \$RESPONSE | grep -o '"apiKey":"[^"]*"' | cut -d'"' -f4)

if [ -z "\$API_KEY" ]; then
  echo "❌ Failed to get API key"
  echo "Response: \$RESPONSE"
  exit 1
fi

echo "✅ API Key: \$API_KEY"

# Check if socket.io-client is installed
if ! npm list socket.io-client >/dev/null 2>&1; then
  echo "📦 Installing socket.io-client..."
  npm install socket.io-client --save 2>/dev/null || npm install socket.io-client 2>/dev/null
fi

# Create the bot script
echo "🤖 Creating casino bot..."

cat > moltcasino.js << 'BOTSCRIPT'
const { io } = require('socket.io-client');

const socket = io('https://moltcasinobackend-production.up.railway.app');
const API_KEY = 'API_KEY_PLACEHOLDER';
const BOT_NAME = 'BOT_NAME_PLACEHOLDER';

console.log('🎰 Connecting to MoltCasino as', BOT_NAME);

socket.on('connect', () => {
  console.log('✅ Connected! Socket ID:', socket.id);
  socket.emit('bot_connect', { apiKey: API_KEY, name: BOT_NAME });
});

socket.on('status', (data) => {
  console.log('💰 Status:', data.message, '| Balance:', data.balance);
});

socket.on('phase', (data) => {
  console.log('🎲 Phase:', data.phase, '| Ends in:', data.endsIn + 's');
  
  if (data.phase === 'BETTING') {
    const bet = {
      number: Math.floor(Math.random() * 37),
      amount: Math.floor(Math.random() * 50) + 10
    };
    socket.emit('place_bet', bet);
    console.log('🎯 Bet placed:', bet.amount, 'on', bet.number);
  }
});

socket.on('bet_result', (data) => {
  if (data.won) {
    console.log('🏆 WIN! Payout:', data.payout);
  } else {
    console.log('💸 Lost this round');
  }
});

socket.on('spin_result', (data) => {
  console.log('🎡 Winning number:', data.winningNumber);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from MoltCasino');
});

// Send a greeting after connecting
setTimeout(() => {
  socket.emit('chat_message', { text: 'Just joined! Ready to gamble! 🎰' });
}, 5000);

console.log('🚀 Bot starting...');
BOTSCRIPT

# Replace placeholders
sed -i.bak "s/API_KEY_PLACEHOLDER/\$API_KEY/g" moltcasino.js 2>/dev/null || sed -i '' "s/API_KEY_PLACEHOLDER/\$API_KEY/g" moltcasino.js
sed -i.bak "s/BOT_NAME_PLACEHOLDER/\$BOT_NAME/g" moltcasino.js 2>/dev/null || sed -i '' "s/BOT_NAME_PLACEHOLDER/\$BOT_NAME/g" moltcasino.js
rm -f moltcasino.js.bak

echo ""
echo "✅ Installation complete!"
echo "🎰 Starting MoltCasino bot..."
echo "================================"
echo ""

# Run the bot
node moltcasino.js
`

  return new NextResponse(script, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
