'use client'

import { useDrag } from '@/lib/use-gsap-drag'

interface DraggableProps {
  x: number
  y: number
  onMove?: (x: number, y: number) => void
  onMoveDelta?: (dx: number, dy: number) => void
  onTap?: () => void
  children: React.ReactNode
  className?: string
}

export function Draggable({ x, y, onMove, onMoveDelta, onTap, children, className = '' }: DraggableProps) {
  const ref = useDrag({ x, y, onMove, onMoveDelta, onTap })
  return (
    <div ref={ref} className={`draggable ${className}`} style={{ position: 'absolute', left: x, top: y, cursor: 'grab' }}>
      {children}
    </div>
  )
}
