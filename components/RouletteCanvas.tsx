"use client"

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

type SpinResult = { number: number; color: 'red' | 'black' | 'green' }

type Props = {
  size?: number
  onSpinComplete?: (result: SpinResult) => void
}

export type RouletteCanvasRef = {
  spin: (targetNumber?: number) => void
}

const SEQ = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26]
const RED_SET = new Set([1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36])

function getColor(n: number): 'red' | 'black' | 'green' {
  if (n === 0) return 'green'
  return RED_SET.has(n) ? 'red' : 'black'
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function normalizeAngle(angle: number) {
  const twoPi = Math.PI * 2
  return ((angle % twoPi) + twoPi) % twoPi
}

const RouletteCanvas = forwardRef<RouletteCanvasRef, Props>(({ size = 220, onSpinComplete }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rotationRef = useRef(0)
  const spinningRef = useRef(false)

  useEffect(() => {
    draw()
  }, [])

  useImperativeHandle(ref, () => ({
    spin: (targetNumber?: number) => {
      if (spinningRef.current) return
      spinningRef.current = true

      const SEGMENT_ANGLE = (2 * Math.PI) / SEQ.length
      const POINTER_ANGLE = -Math.PI / 2 // 12 o'clock in canvas coords

      // Pre-determined winner
      const winningIndex = typeof targetNumber === 'number'
        ? SEQ.indexOf(targetNumber)
        : Math.floor(Math.random() * SEQ.length)
      const target = SEQ[winningIndex]

      // Align winner segment to pointer
      const targetAngle = POINTER_ANGLE - (winningIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2)

      const start = rotationRef.current
      const distanceToTarget = normalizeAngle(targetAngle - start)
      const fullSpins = 5 // fixed full rotations for consistent speed
      const finalAngle = start + (Math.PI * 2 * fullSpins) + distanceToTarget
      const duration = 5000
      const startTime = performance.now()

      const animate = (now: number) => {
        const t = Math.min((now - startTime) / duration, 1)
        const eased = easeOutCubic(t)
        rotationRef.current = start + (finalAngle - start) * eased
        draw()
        if (t < 1) {
          requestAnimationFrame(animate)
        } else {
          spinningRef.current = false
          const result = { number: target, color: getColor(target) }
          onSpinComplete?.(result)
        }
      }

      requestAnimationFrame(animate)
    }
  }))

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const cy = H / 2
    const radius = W / 2 - 24
    const rimWidth = 16
    const segAngle = (2 * Math.PI) / SEQ.length

    ctx.clearRect(0, 0, W, H)

    // outer rim
    const grad = ctx.createRadialGradient(cx, cy, radius + rimWidth, cx, cy, radius - 2)
    grad.addColorStop(0, '#d4af37')
    grad.addColorStop(0.5, '#f5d36c')
    grad.addColorStop(1, '#9b7a1d')
    ctx.beginPath()
    ctx.arc(cx, cy, radius + rimWidth, 0, Math.PI * 2)
    ctx.fillStyle = grad
    ctx.fill()

    // segments
    for (let i = 0; i < SEQ.length; i++) {
      const start = rotationRef.current + i * segAngle
      const end = start + segAngle
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, radius, start, end)
      ctx.closePath()
      const color = getColor(SEQ[i])
      ctx.fillStyle = color === 'green' ? '#008000' : color === 'red' ? '#ff0000' : '#000000'
      ctx.fill()

      // numbers (use transforms for clean alignment)
      const angle = start
      const textRadius = radius * 0.85
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(angle + segAngle / 2)
      ctx.translate(textRadius, 0)
      ctx.rotate(Math.PI / 2)
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 11px Arial'
      ctx.fillText(String(SEQ[i]), 0, 0)
      ctx.restore()
    }

    // inner circle
    ctx.beginPath()
    ctx.arc(cx, cy, radius * 0.58, 0, Math.PI * 2)
    ctx.fillStyle = '#111111'
    ctx.fill()

    // pointer (triangle) overlapping the rim
    const tipY = cy - radius - 10
    const baseY = cy - radius + 15
    const halfWidth = 10
    ctx.save()
    ctx.shadowColor = 'rgba(0,0,0,0.5)'
    ctx.shadowBlur = 6
    ctx.fillStyle = '#FF0000'
    ctx.beginPath()
    ctx.moveTo(cx, baseY)
    ctx.lineTo(cx - halfWidth, tipY)
    ctx.lineTo(cx + halfWidth, tipY)
    ctx.closePath()
    ctx.fill()
    ctx.restore()
  }

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <canvas ref={canvasRef} width={size} height={size} />
    </div>
  )
})

RouletteCanvas.displayName = 'RouletteCanvas'

export default RouletteCanvas
