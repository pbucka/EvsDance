'use client'

import { useRef, useEffect, useCallback } from 'react'

const CLICK_THRESHOLD = 5

interface DragOptions {
  x: number
  y: number
  onMove?: (x: number, y: number) => void
  onMoveDelta?: (dx: number, dy: number) => void
  onTap?: () => void
}

export function useDrag(opts: DragOptions) {
  const ref = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const moved = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const lastClient = useRef({ x: 0, y: 0 })
  const start = useRef({ x: 0, y: 0 })
  const optsRef = useRef(opts)

  useEffect(() => {
    optsRef.current = opts
  })

  const onPointerDown = useCallback((e: PointerEvent) => {
    e.stopPropagation()
    dragging.current = true
    moved.current = false
    offset.current = { x: e.clientX - optsRef.current.x, y: e.clientY - optsRef.current.y }
    lastClient.current = { x: e.clientX, y: e.clientY }
    start.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    if (Math.abs(dx) > CLICK_THRESHOLD || Math.abs(dy) > CLICK_THRESHOLD) {
      moved.current = true
    }
    if (optsRef.current.onMoveDelta) {
      const ddx = e.clientX - lastClient.current.x
      const ddy = e.clientY - lastClient.current.y
      lastClient.current = { x: e.clientX, y: e.clientY }
      optsRef.current.onMoveDelta(ddx, ddy)
    } else if (optsRef.current.onMove) {
      optsRef.current.onMove(e.clientX - offset.current.x, e.clientY - offset.current.y)
    }
  }, [])

  const onPointerUp = useCallback((e: PointerEvent) => {
    const was = dragging.current
    dragging.current = false
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    if (was && !moved.current && optsRef.current.onTap) {
      optsRef.current.onTap()
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', onPointerUp)
    el.addEventListener('pointerleave', onPointerUp)
    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', onPointerUp)
      el.removeEventListener('pointerleave', onPointerUp)
    }
  }, [onPointerDown, onPointerMove, onPointerUp])

  return ref
}
