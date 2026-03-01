'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshReflectorMaterial, Environment } from '@react-three/drei'
import { useStudioMusic } from '@/lib/use-studio-music'
import { createDanceTimeline, createGroupTimeline } from '@/lib/gsap-dance'
import { CartoonPerson, type SkinTone, type HairStyle } from '@/components/characters/CartoonPerson'
import type { Pose } from '@/lib/poses'
import * as THREE from 'three'

/* ------------------------------------------------------------------
   Dancer definitions (ported from original)
   ------------------------------------------------------------------ */

interface DancerDef {
  skinTone: SkinTone
  hairStyle: HairStyle
  hairColor: string
  topColor: string
  bottomColor: string
  armLeftAngle: number
  armRightAngle: number
  legLeftAngle?: number
  legRightAngle?: number
}

const BALLET_DANCERS: DancerDef[] = [
  { skinTone: 'light', hairStyle: 'bun', hairColor: '#f5d076', topColor: '#fce7f3', bottomColor: '#ec4899', armLeftAngle: -60, armRightAngle: 40, legLeftAngle: -15, legRightAngle: 10 },
  { skinTone: 'medium', hairStyle: 'bun', hairColor: '#1a1a2e', topColor: '#e0e7ff', bottomColor: '#8b5cf6', armLeftAngle: 30, armRightAngle: -55, legRightAngle: 20 },
  { skinTone: 'tan', hairStyle: 'bun', hairColor: '#5c4033', topColor: '#fce7f3', bottomColor: '#f472b6', armLeftAngle: -35, armRightAngle: 60, legLeftAngle: 12 },
  { skinTone: 'light', hairStyle: 'long', hairColor: '#c084fc', topColor: '#fff', bottomColor: '#ec4899', armLeftAngle: -45, armRightAngle: 55, legRightAngle: -10 },
  { skinTone: 'medium', hairStyle: 'bun', hairColor: '#92400e', topColor: '#fce7f3', bottomColor: '#a855f7', armLeftAngle: 50, armRightAngle: -40, legLeftAngle: -8, legRightAngle: 15 },
  { skinTone: 'light', hairStyle: 'bun', hairColor: '#f5d076', topColor: '#ddd6fe', bottomColor: '#ec4899', armLeftAngle: -30, armRightAngle: 65, legLeftAngle: 10 },
  { skinTone: 'tan', hairStyle: 'long', hairColor: '#1a1a2e', topColor: '#fce7f3', bottomColor: '#f472b6', armLeftAngle: 40, armRightAngle: -50, legRightAngle: 18 },
  { skinTone: 'light', hairStyle: 'bun', hairColor: '#5c4033', topColor: '#e0e7ff', bottomColor: '#ec4899', armLeftAngle: -55, armRightAngle: 35, legLeftAngle: -12 },
]

const HIPHOP_DANCERS: DancerDef[] = [
  { skinTone: 'dark', hairStyle: 'bob', hairColor: '#1a1a2e', topColor: '#fef08a', bottomColor: '#1e293b', armLeftAngle: -65, armRightAngle: 30, legLeftAngle: -20, legRightAngle: 10 },
  { skinTone: 'light', hairStyle: 'wavy', hairColor: '#c084fc', topColor: '#a78bfa', bottomColor: '#374151', armLeftAngle: 45, armRightAngle: -50, legLeftAngle: 10, legRightAngle: -15 },
  { skinTone: 'medium', hairStyle: 'bob', hairColor: '#f5d076', topColor: '#fb923c', bottomColor: '#1e293b', armLeftAngle: -40, armRightAngle: 55, legRightAngle: 25 },
  { skinTone: 'tan', hairStyle: 'long', hairColor: '#1a1a2e', topColor: '#f472b6', bottomColor: '#374151', armLeftAngle: 55, armRightAngle: -35, legLeftAngle: -18 },
  { skinTone: 'light', hairStyle: 'wavy', hairColor: '#f5d076', topColor: '#38bdf8', bottomColor: '#1e293b', armLeftAngle: -50, armRightAngle: 45, legRightAngle: 12 },
  { skinTone: 'dark', hairStyle: 'bob', hairColor: '#5c4033', topColor: '#fbbf24', bottomColor: '#374151', armLeftAngle: 35, armRightAngle: -60, legLeftAngle: 14 },
  { skinTone: 'medium', hairStyle: 'long', hairColor: '#c084fc', topColor: '#f97316', bottomColor: '#1e293b', armLeftAngle: -45, armRightAngle: 40, legRightAngle: -10, legLeftAngle: 8 },
  { skinTone: 'light', hairStyle: 'bob', hairColor: '#1a1a2e', topColor: '#34d399', bottomColor: '#374151', armLeftAngle: 50, armRightAngle: -45, legLeftAngle: -15 },
]

/* ------------------------------------------------------------------
   Draggable person wrapper for overlay
   ------------------------------------------------------------------ */

function DraggablePerson({
  children,
  initialX,
  initialY,
  onTap,
}: {
  children: React.ReactNode
  initialX: number
  initialY: number
  onTap?: () => void
}) {
  const [pos, setPos] = useState({ x: initialX, y: initialY })
  const dragging = useRef(false)
  const moved = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const start = useRef({ x: 0, y: 0 })

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      dragging.current = true
      moved.current = false
      offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
      start.current = { x: e.clientX, y: e.clientY }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [pos],
  )

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - start.current.x
    const dy = e.clientY - start.current.y
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) moved.current = true
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    })
  }, [])

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const wasDragging = dragging.current
      dragging.current = false
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
      if (wasDragging && !moved.current && onTap) onTap()
    },
    [onTap],
  )

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        cursor: 'grab',
        touchAction: 'none',
        userSelect: 'none',
        pointerEvents: 'auto',
      }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------
   Animated spotlight mesh
   ------------------------------------------------------------------ */

function AnimatedSpot({ position, color }: { position: [number, number, number]; color: string }) {
  const ref = useRef<THREE.SpotLight>(null)

  useFrame((state) => {
    if (ref.current) {
      ref.current.intensity = 3 + Math.sin(state.clock.elapsedTime * 1.5 + position[0] * 2) * 1.5
    }
  })

  return <spotLight ref={ref} position={position} color={color} angle={0.5} penumbra={0.5} intensity={3} />
}

/* ------------------------------------------------------------------
   3D Room Scene
   ------------------------------------------------------------------ */

function RoomScene({ theme }: { theme: 'ballet' | 'hiphop' }) {
  const isBallet = theme === 'ballet'

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 3, 0]} intensity={0.8} color={isBallet ? '#fce7f3' : '#334155'} />

      <AnimatedSpot position={[-2, 4, 1]} color={isBallet ? '#ec4899' : '#6366f1'} />
      <AnimatedSpot position={[2, 4, 1]} color={isBallet ? '#f9a8d4' : '#f59e0b'} />
      <AnimatedSpot position={[0, 4, -1]} color={isBallet ? '#c084fc' : '#22c55e'} />

      <Environment preset="apartment" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <MeshReflectorMaterial
          mirror={0.35}
          blur={[300, 100]}
          mixBlur={0.7}
          color={isBallet ? '#deb887' : '#1f2937'}
          metalness={0.15}
          roughness={isBallet ? 0.6 : 0.4}
        />
      </mesh>

      {/* Back wall — window wall with glass effect */}
      <mesh position={[0, 2, -4]}>
        <planeGeometry args={[14, 5]} />
        <meshStandardMaterial
          color="#bae6fd"
          transparent
          opacity={0.7}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {/* Window panes */}
      {[-2.5, -1.5, -0.5, 0.5, 1.5, 2.5].map((x) => (
        <mesh key={x} position={[x * 2, 2, -3.98]}>
          <planeGeometry args={[1.8, 4]} />
          <meshStandardMaterial
            color="#e0f2fe"
            transparent
            opacity={0.5}
            metalness={0.3}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Barre running across back wall */}
      <mesh position={[0, 1.2, -3.8]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 12, 16]} />
        <meshStandardMaterial color="#d4d4d8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Left wall — mirror wall */}
      <mesh position={[-7, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <MeshReflectorMaterial
          mirror={0.6}
          blur={[200, 80]}
          mixBlur={0.5}
          color={isBallet ? '#fce7f3' : '#1e1b4b'}
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>

      {/* Right wall — mirror wall */}
      <mesh position={[7, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <MeshReflectorMaterial
          mirror={0.6}
          blur={[200, 80]}
          mixBlur={0.5}
          color={isBallet ? '#fce7f3' : '#1e1b4b'}
          metalness={0.3}
          roughness={0.3}
        />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color={isBallet ? '#be185d' : '#1e293b'} />
      </mesh>

      {/* Ceiling spotlights */}
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={x} position={[x, 4.4, -0.5]}>
          <boxGeometry args={[0.5, 0.08, 0.15]} />
          <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
        </mesh>
      ))}
    </>
  )
}

/* ------------------------------------------------------------------
   Dancer layout positions (viewport %)
   ------------------------------------------------------------------ */

function makeDancerPositions(): { x: number; y: number }[] {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700
  const cx = vw / 2
  const spacing = Math.min(vw * 0.1, 90)
  const row1Y = vh * 0.58
  const row2Y = vh * 0.72

  return [
    { x: cx - spacing * 1.5, y: row1Y },
    { x: cx - spacing * 0.5, y: row1Y },
    { x: cx + spacing * 0.5, y: row1Y },
    { x: cx + spacing * 1.5, y: row1Y },
    { x: cx - spacing * 1.5, y: row2Y },
    { x: cx - spacing * 0.5, y: row2Y },
    { x: cx + spacing * 0.5, y: row2Y },
    { x: cx + spacing * 1.5, y: row2Y },
  ]
}

/* ------------------------------------------------------------------
   StudioRoom component
   ------------------------------------------------------------------ */

interface StudioRoomProps {
  name: string
  theme: 'ballet' | 'hiphop'
  onBack: () => void
}

export function StudioRoom({ name, theme, onBack }: StudioRoomProps) {
  const isBallet = theme === 'ballet'
  const dancers = isBallet ? BALLET_DANCERS : HIPHOP_DANCERS
  const totalPeople = dancers.length + 1

  const [performing, setPerforming] = useState(false)
  const [groupPoses, setGroupPoses] = useState<Record<number, Pose>>({})
  const [soloPoses, setSoloPoses] = useState<Record<number, Pose>>({})
  const groupTlRef = useRef<gsap.core.Timeline | null>(null)

  useStudioMusic(true)

  const handlePerform = useCallback(() => {
    if (performing) return
    setPerforming(true)

    const tl = createGroupTimeline(totalPeople, (index, pose) => {
      setGroupPoses((prev) => ({ ...prev, [index]: pose }))
    })
    groupTlRef.current = tl

    setTimeout(() => {
      tl.kill()
      setPerforming(false)
      setGroupPoses({})
      groupTlRef.current = null
    }, 4000)
  }, [performing, totalPeople])

  const triggerSoloDance = useCallback((idx: number) => {
    if (performing) return
    const tl = createDanceTimeline((pose) => {
      setSoloPoses((prev) => ({ ...prev, [idx]: pose }))
    })

    tl.eventCallback('onComplete', () => {
      setSoloPoses((prev) => {
        const next = { ...prev }
        delete next[idx]
        return next
      })
    })
  }, [performing])

  useEffect(() => {
    return () => {
      groupTlRef.current?.kill()
    }
  }, [])

  const getPose = (groupIdx: number, dancerIdx: number): Pose | undefined => {
    if (performing && groupPoses[groupIdx]) return groupPoses[groupIdx]
    if (soloPoses[dancerIdx] !== undefined) return soloPoses[dancerIdx]
    return undefined
  }

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700
  const positions = makeDancerPositions()
  const instructorX = vw / 2 - 34
  const instructorY = vh * 0.48

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1a1225', overflow: 'hidden' }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.6, 4], fov: 60 }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true, alpha: false }}
      >
        <RoomScene theme={theme} />
      </Canvas>

      {/* Top bar */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '10px 20px',
          background: 'linear-gradient(180deg, rgba(124,58,237,0.92) 0%, rgba(124,58,237,0.8) 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '7px 14px',
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#7c3aed',
            background: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          ← Back to Lobby
        </button>
        <h1
          style={{
            margin: 0,
            fontSize: '1.4rem',
            fontWeight: 700,
            color: '#fff',
            textShadow: '0 1px 4px rgba(0,0,0,0.2)',
          }}
        >
          Ev&apos;s Dance
        </h1>
      </div>

      {/* Studio name banner */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          fontFamily: 'sans-serif',
          fontSize: '1.3rem',
          fontWeight: 700,
          color: '#fff',
          textShadow: '0 2px 12px rgba(0,0,0,0.4)',
          background: 'rgba(0,0,0,0.3)',
          padding: '8px 24px',
          borderRadius: 10,
          backdropFilter: 'blur(4px)',
          whiteSpace: 'nowrap',
        }}
      >
        {name}
      </div>

      {/* People layer (overlay) */}
      <div style={{ position: 'absolute', inset: 0, top: 52, pointerEvents: 'none', zIndex: 10 }}>
        {/* Instructor */}
        <DraggablePerson
          initialX={instructorX}
          initialY={instructorY}
          onTap={() => triggerSoloDance(-1)}
        >
          <div style={{ transform: 'scale(1.5)', filter: 'drop-shadow(1px 2px 0 #1e293b)' }}>
            <CartoonPerson
              label="Instructor"
              skinTone={isBallet ? 'medium' : 'dark'}
              hairStyle="bun"
              hairColor={isBallet ? '#1a1a2e' : '#5c4033'}
              topColor={isBallet ? '#ec4899' : '#f59e0b'}
              bottomColor="#1e293b"
              pose={getPose(0, -1)}
              armLeftAngle={-50}
              armRightAngle={50}
            />
          </div>
        </DraggablePerson>

        {/* Dancers */}
        {dancers.map((d, i) => (
          <DraggablePerson
            key={i}
            initialX={positions[i]?.x ?? vw * 0.5}
            initialY={positions[i]?.y ?? vh * 0.5}
            onTap={() => triggerSoloDance(i)}
          >
            <div style={{ transform: 'scale(1.2)', filter: 'drop-shadow(1px 2px 0 #1e293b)' }}>
              <CartoonPerson
                label="Dancer"
                skinTone={d.skinTone}
                hairStyle={d.hairStyle}
                hairColor={d.hairColor}
                topColor={d.topColor}
                bottomColor={d.bottomColor}
                pose={getPose(i + 1, i)}
                armLeftAngle={d.armLeftAngle}
                armRightAngle={d.armRightAngle}
                legLeftAngle={d.legLeftAngle}
                legRightAngle={d.legRightAngle}
              />
            </div>
          </DraggablePerson>
        ))}
      </div>

      {/* Controls */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          display: 'flex',
          gap: 14,
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={onBack}
          style={{
            padding: '10px 24px',
            fontFamily: 'sans-serif',
            fontSize: '0.9rem',
            fontWeight: 700,
            color: '#7c3aed',
            background: 'rgba(255,255,255,0.92)',
            border: '2px solid #c4b5fd',
            borderRadius: 12,
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap',
          }}
        >
          ← Return to Lobby
        </button>
        <button
          type="button"
          onClick={handlePerform}
          disabled={performing}
          style={{
            padding: '12px 28px',
            fontFamily: 'sans-serif',
            fontSize: '1rem',
            fontWeight: 800,
            color: '#fff',
            background: performing
              ? 'linear-gradient(135deg, #ec4899, #a855f7)'
              : 'linear-gradient(135deg, #ec4899, #a855f7, #6366f1)',
            backgroundSize: '200% 200%',
            border: '2px solid rgba(255,255,255,0.5)',
            borderRadius: 14,
            cursor: performing ? 'default' : 'pointer',
            backdropFilter: 'blur(6px)',
            boxShadow: performing
              ? '0 4px 30px rgba(236,72,153,0.6)'
              : '0 4px 20px rgba(168,85,247,0.4)',
            whiteSpace: 'nowrap',
            transition: 'transform 0.15s, box-shadow 0.15s',
            transform: performing ? 'scale(1.05)' : undefined,
          }}
        >
          {performing ? '💃 Dancing!' : '✨ Perform a Dance Together'}
        </button>
      </div>
    </div>
  )
}
