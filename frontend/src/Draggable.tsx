import { useRef, useCallback } from 'react'

const CLICK_THRESHOLD = 5

interface DraggableProps {
  x: number
  y: number
  onMove?: (x: number, y: number) => void
  onMoveDelta?: (deltaX: number, deltaY: number) => void
  onTap?: () => void
  children: React.ReactNode
  className?: string
}

export function Draggable({
  x,
  y,
  onMove,
  onMoveDelta,
  onTap,
  children,
  className = '',
}: DraggableProps) {
  const draggingRef = useRef(false)
  const movedRef = useRef(false)
  const offsetRef = useRef({ x: 0, y: 0 })
  const lastClientRef = useRef({ x: 0, y: 0 })
  const startRef = useRef({ x: 0, y: 0 })

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      draggingRef.current = true
      movedRef.current = false
      offsetRef.current = { x: e.clientX - x, y: e.clientY - y }
      lastClientRef.current = { x: e.clientX, y: e.clientY }
      startRef.current = { x: e.clientX, y: e.clientY }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [x, y],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!draggingRef.current) return

      const dx = e.clientX - startRef.current.x
      const dy = e.clientY - startRef.current.y
      if (Math.abs(dx) > CLICK_THRESHOLD || Math.abs(dy) > CLICK_THRESHOLD) {
        movedRef.current = true
      }

      if (onMoveDelta) {
        const ddx = e.clientX - lastClientRef.current.x
        const ddy = e.clientY - lastClientRef.current.y
        lastClientRef.current = { x: e.clientX, y: e.clientY }
        onMoveDelta(ddx, ddy)
      } else if (onMove) {
        onMove(e.clientX - offsetRef.current.x, e.clientY - offsetRef.current.y)
      }
    },
    [onMove, onMoveDelta],
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      const wasDragging = draggingRef.current
      draggingRef.current = false
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      if (wasDragging && !movedRef.current && onTap) {
        onTap()
      }
    },
    [onTap],
  )

  return (
    <div
      className={`draggable ${className}`}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        cursor: 'grab',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {children}
    </div>
  )
}
