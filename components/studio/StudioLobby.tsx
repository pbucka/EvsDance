'use client'

import { useRef, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, MeshReflectorMaterial, Environment } from '@react-three/drei'
import { useStudioMusic } from '@/lib/use-studio-music'
import { CartoonPerson } from '@/components/characters/CartoonPerson'
import * as THREE from 'three'

/* ------------------------------------------------------------------
   Draggable overlay person (positioned over the 3D canvas)
   ------------------------------------------------------------------ */

function DraggableOverlayPerson({
  children,
  initialX,
  initialY,
}: {
  children: React.ReactNode
  initialX: number
  initialY: number
}) {
  const [pos, setPos] = useState({ x: initialX, y: initialY })
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation()
      dragging.current = true
      offset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [pos],
  )

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    setPos({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    })
  }, [])

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    dragging.current = false
    ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }, [])

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
        zIndex: 20,
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------
   Animated ceiling light that pulses
   ------------------------------------------------------------------ */

function CeilingLight({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.8 + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.3
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[0.5, 0.08, 0.15]} />
      <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.8} />
    </mesh>
  )
}

/* ------------------------------------------------------------------
   The 3D Lobby Scene
   ------------------------------------------------------------------ */

function LobbyScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[-3, 3, 2]} intensity={1.2} color="#f3e8ff" />
      <pointLight position={[3, 3, 2]} intensity={0.8} color="#fef08a" />
      <pointLight position={[0, 2, -2]} intensity={0.6} color="#e879f9" />

      <Environment preset="apartment" />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[14, 10]} />
        <MeshReflectorMaterial
          mirror={0.3}
          blur={[300, 100]}
          mixBlur={0.8}
          color="#e8ddd0"
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2, -4]}>
        <planeGeometry args={[14, 5]} />
        <meshStandardMaterial color="#ede9fe" />
      </mesh>
      <Html position={[0, 3, -3.95]} center transform>
        <div style={{
          fontFamily: 'sans-serif',
          fontWeight: 700,
          fontSize: 28,
          color: '#e879f9',
          textShadow: '0 0 20px rgba(232,121,249,0.6), 0 0 40px rgba(232,121,249,0.3)',
          letterSpacing: '0.06em',
          pointerEvents: 'none',
        }}>
          Dance Shop
        </div>
      </Html>

      {/* Left wall */}
      <mesh position={[-7, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#f3e8ff" />
      </mesh>
      <Html position={[-6.9, 2.5, 0]} center transform rotation={[0, Math.PI / 2, 0]}>
        <div style={{
          fontFamily: 'sans-serif',
          fontWeight: 800,
          fontSize: 32,
          color: '#7c3aed',
          textShadow: '0 2px 8px rgba(124,58,237,0.2)',
          letterSpacing: '0.05em',
          pointerEvents: 'none',
        }}>
          Ev&apos;s Dance
        </div>
      </Html>

      {/* Right wall */}
      <mesh position={[7, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[10, 5]} />
        <meshStandardMaterial color="#f3e8ff" />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, 0]}>
        <planeGeometry args={[14, 10]} />
        <meshStandardMaterial color="#1e1b4b" />
      </mesh>

      {/* Ceiling lights */}
      <CeilingLight position={[-3, 4.4, -1]} />
      <CeilingLight position={[-1, 4.4, -1]} />
      <CeilingLight position={[1, 4.4, -1]} />
      <CeilingLight position={[3, 4.4, -1]} />

      {/* Welcome desk */}
      <mesh position={[-3, 0.5, 1]}>
        <boxGeometry args={[1.8, 1, 0.8]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      <mesh position={[-3, 1.05, 0.9]}>
        <boxGeometry args={[1.6, 0.1, 0.6]} />
        <meshStandardMaterial color="#b45309" />
      </mesh>
      <Html position={[-3, 1.6, 1]} center>
        <div style={{ transform: 'scale(0.6)', pointerEvents: 'none' }}>
          <CartoonPerson
            label="Receptionist"
            skinTone="medium"
            hairStyle="bun"
            hairColor="#1a1a2e"
            topColor="#7c3aed"
            bottomColor="#1e293b"
          />
        </div>
      </Html>
      <Html position={[-3, 2.6, 1]} center>
        <div style={{
          background: '#fff',
          border: '2px solid #c4b5fd',
          borderRadius: 10,
          padding: '4px 10px',
          fontFamily: 'sans-serif',
          fontSize: 10,
          fontWeight: 600,
          color: '#1e293b',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
        }}>
          Welcome to Ev&apos;s Dance!
        </div>
      </Html>

      {/* Shop display boxes */}
      <mesh position={[-0.8, 0.5, -3]}>
        <boxGeometry args={[0.8, 1, 0.6]} />
        <meshStandardMaterial color="#fce7f3" />
      </mesh>
      <Html position={[-0.8, 1.2, -3]} center>
        <div style={{ fontFamily: 'sans-serif', fontSize: 8, fontWeight: 700, color: '#e9d5ff', pointerEvents: 'none' }}>Leotards</div>
      </Html>

      <mesh position={[0.5, 0.5, -3]}>
        <boxGeometry args={[0.8, 1, 0.6]} />
        <meshStandardMaterial color="#ddd6fe" />
      </mesh>
      <Html position={[0.5, 1.2, -3]} center>
        <div style={{ fontFamily: 'sans-serif', fontSize: 8, fontWeight: 700, color: '#e9d5ff', pointerEvents: 'none' }}>Tutus</div>
      </Html>

      <mesh position={[1.8, 0.4, -3]}>
        <boxGeometry args={[0.8, 0.8, 0.6]} />
        <meshStandardMaterial color="#e0e7ff" />
      </mesh>
      <Html position={[1.8, 1, -3]} center>
        <div style={{ fontFamily: 'sans-serif', fontSize: 8, fontWeight: 700, color: '#e9d5ff', pointerEvents: 'none' }}>Shoes</div>
      </Html>

      {/* Studio doors */}
      <mesh position={[4.5, 1.2, -1]}>
        <boxGeometry args={[1.2, 2.4, 0.2]} />
        <meshStandardMaterial color="#92400e" />
      </mesh>
      <Html position={[4.5, 2.6, -0.85]} center>
        <div style={{
          background: '#ec4899',
          color: '#fff',
          fontFamily: 'sans-serif',
          fontWeight: 700,
          fontSize: 10,
          padding: '2px 8px',
          borderRadius: 4,
          pointerEvents: 'none',
        }}>
          Studio A
        </div>
      </Html>

      <mesh position={[4.5, 1.2, 1.5]}>
        <boxGeometry args={[1.2, 2.4, 0.2]} />
        <meshStandardMaterial color="#4a3728" />
      </mesh>
      <Html position={[4.5, 2.6, 1.65]} center>
        <div style={{
          background: '#f59e0b',
          color: '#fff',
          fontFamily: 'sans-serif',
          fontWeight: 700,
          fontSize: 10,
          padding: '2px 8px',
          borderRadius: 4,
          pointerEvents: 'none',
        }}>
          Studio B
        </div>
      </Html>
    </>
  )
}

/* ------------------------------------------------------------------
   Main StudioLobby component
   ------------------------------------------------------------------ */

/* ------------------------------------------------------------------
   Shopping bag SVG that appears on characters after purchase
   ------------------------------------------------------------------ */

function ShoppingBagIcon({ count }: { count: number }) {
  return (
    <div style={{
      position: 'absolute',
      bottom: -2,
      right: -14,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      pointerEvents: 'none',
      filter: 'drop-shadow(1px 1px 0 #1e293b)',
    }}>
      <svg width="22" height="26" viewBox="0 0 22 26" fill="none">
        <path d="M 5 8 Q 5 2 11 2 Q 17 2 17 8" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" />
        <rect x="2" y="8" width="18" height="16" rx="3" fill="#c084fc" stroke="#7c3aed" strokeWidth="1.2" />
        <text x="11" y="19" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="8" fontWeight="800">
          Ev&apos;s
        </text>
      </svg>
      {count > 1 && (
        <span style={{
          position: 'absolute',
          top: -3,
          right: -6,
          background: '#ec4899',
          color: '#fff',
          fontFamily: 'sans-serif',
          fontSize: 7,
          fontWeight: 800,
          padding: '0 3px',
          borderRadius: 6,
          lineHeight: '12px',
          minWidth: 12,
          textAlign: 'center',
        }}>
          {count}
        </span>
      )}
    </div>
  )
}

interface PurchasedOutfit {
  name: string
  topColor: string
  bottomColor: string
}

interface StudioLobbyProps {
  onExit: () => void
  onEnterRoom: (room: string) => void
  purchasedBagCount?: number
  purchasedOutfits?: PurchasedOutfit[]
}

export function StudioLobby({ onExit, onEnterRoom, purchasedBagCount = 0, purchasedOutfits = [] }: StudioLobbyProps) {
  useStudioMusic(true)

  const [girl1Outfit, setGirl1Outfit] = useState({ topColor: '#fce7f3', bottomColor: '#ec4899' })
  const [girl2Outfit, setGirl2Outfit] = useState({ topColor: '#f5f3ff', bottomColor: '#8b5cf6' })
  const [outfitPicker, setOutfitPicker] = useState<'girl1' | 'girl2' | null>(null)

  const wearableOutfits = purchasedOutfits.filter((o) => o.topColor || o.bottomColor)

  const applyOutfit = useCallback((outfit: PurchasedOutfit) => {
    const setter = outfitPicker === 'girl1' ? setGirl1Outfit : setGirl2Outfit
    setter((prev) => ({
      topColor: outfit.topColor || prev.topColor,
      bottomColor: outfit.bottomColor || prev.bottomColor,
    }))
    setOutfitPicker(null)
  }, [outfitPicker])

  const btnBase: React.CSSProperties = {
    padding: '12px 24px',
    fontFamily: 'sans-serif',
    fontSize: '0.9rem',
    fontWeight: 800,
    color: '#fff',
    background: 'linear-gradient(135deg, #7c3aed, #a855f7, #ec4899)',
    backgroundSize: '200% 200%',
    border: '2px solid rgba(255,255,255,0.5)',
    borderRadius: 14,
    cursor: 'pointer',
    boxShadow: '0 4px 20px rgba(168,85,247,0.5)',
    transition: 'transform 0.15s, box-shadow 0.15s',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#1a1225', overflow: 'hidden' }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 60 }}
        style={{ position: 'absolute', inset: 0 }}
        gl={{ antialias: true, alpha: false }}
      >
        <LobbyScene />
      </Canvas>

      {/* Top bar overlay */}
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
          onClick={onExit}
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
          ← Leave Studio
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
        <p
          style={{
            margin: 0,
            fontSize: '0.75rem',
            color: 'rgba(255,255,255,0.8)',
            flex: 1,
            textAlign: 'right',
          }}
        >
          Drag Mom &amp; the girls to explore the lobby
        </p>
      </div>

      {/* Bottom action buttons */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
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
          onClick={() => onEnterRoom('shop')}
          style={btnBase}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(168,85,247,0.7)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(168,85,247,0.5)'
          }}
        >
          Enter Dance Shop
        </button>
        <button
          type="button"
          onClick={() => onEnterRoom('studio-a')}
          style={btnBase}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(168,85,247,0.7)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(168,85,247,0.5)'
          }}
        >
          Enter Studio A
        </button>
        <button
          type="button"
          onClick={() => onEnterRoom('studio-b')}
          style={btnBase}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 6px 28px rgba(168,85,247,0.7)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = ''
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(168,85,247,0.5)'
          }}
        >
          Enter Studio B
        </button>
      </div>

      {/* Draggable family characters overlay */}
      <div style={{ position: 'absolute', inset: 0, top: 52, pointerEvents: 'none', zIndex: 20 }}>
        <DraggableOverlayPerson initialX={240} initialY={420}>
          <div style={{ position: 'relative', transform: 'scale(1.3)', filter: 'drop-shadow(2px 3px 0 #1e293b)', pointerEvents: 'auto' }}>
            <CartoonPerson
              label="Mom"
              skinTone="light"
              hairStyle="long"
              hairColor="#5c4033"
              topColor="#e0e7ff"
              bottomColor="#6366f1"
            />
            {purchasedBagCount > 0 && <ShoppingBagIcon count={purchasedBagCount} />}
          </div>
        </DraggableOverlayPerson>

        <DraggableOverlayPerson initialX={320} initialY={440}>
          <div
            style={{ position: 'relative', transform: 'scale(1.3)', filter: 'drop-shadow(2px 3px 0 #1e293b)', pointerEvents: 'auto', cursor: wearableOutfits.length > 0 ? 'pointer' : 'grab' }}
            onClick={(e) => { if (wearableOutfits.length > 0) { e.stopPropagation(); setOutfitPicker(outfitPicker === 'girl1' ? null : 'girl1') } }}
          >
            <CartoonPerson
              label="Girl"
              skinTone="light"
              hairStyle="pigtails"
              hairColor="#f5d076"
              topColor={girl1Outfit.topColor}
              bottomColor={girl1Outfit.bottomColor}
            />
            {purchasedBagCount > 0 && <ShoppingBagIcon count={purchasedBagCount} />}
            {wearableOutfits.length > 0 && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#7c3aed', color: '#fff', fontFamily: 'sans-serif', fontSize: 7, fontWeight: 700, padding: '1px 5px', borderRadius: 4, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                Tap to change
              </div>
            )}
          </div>
        </DraggableOverlayPerson>

        <DraggableOverlayPerson initialX={400} initialY={430}>
          <div
            style={{ position: 'relative', transform: 'scale(1.3)', filter: 'drop-shadow(2px 3px 0 #1e293b)', pointerEvents: 'auto', cursor: wearableOutfits.length > 0 ? 'pointer' : 'grab' }}
            onClick={(e) => { if (wearableOutfits.length > 0) { e.stopPropagation(); setOutfitPicker(outfitPicker === 'girl2' ? null : 'girl2') } }}
          >
            <CartoonPerson
              label="Girl"
              skinTone="light"
              hairStyle="long"
              hairColor="#c084fc"
              topColor={girl2Outfit.topColor}
              bottomColor={girl2Outfit.bottomColor}
            />
            {purchasedBagCount > 0 && <ShoppingBagIcon count={purchasedBagCount} />}
            {wearableOutfits.length > 0 && (
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#7c3aed', color: '#fff', fontFamily: 'sans-serif', fontSize: 7, fontWeight: 700, padding: '1px 5px', borderRadius: 4, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
                Tap to change
              </div>
            )}
          </div>
        </DraggableOverlayPerson>
      </div>

      {/* Outfit picker popup */}
      {outfitPicker && wearableOutfits.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 100,
            background: 'rgba(30,27,75,0.96)',
            border: '2px solid #a855f7',
            borderRadius: 16,
            padding: '20px 24px',
            minWidth: 260,
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 40px rgba(124,58,237,0.5)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <h3 style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
              Choose Outfit for {outfitPicker === 'girl1' ? 'Girl 1' : 'Girl 2'}
            </h3>
            <button
              type="button"
              onClick={() => setOutfitPicker(null)}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', cursor: 'pointer', padding: '2px 6px' }}
            >
              ✕
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {wearableOutfits.map((outfit, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyOutfit(outfit)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '2px solid rgba(255,255,255,0.15)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(168,85,247,0.2)'
                  e.currentTarget.style.borderColor = '#a855f7'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
                }}
              >
                <div style={{ display: 'flex', gap: 4 }}>
                  {outfit.topColor && (
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: outfit.topColor, border: '2px solid rgba(255,255,255,0.3)' }} />
                  )}
                  {outfit.bottomColor && (
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: outfit.bottomColor, border: '2px solid rgba(255,255,255,0.3)' }} />
                  )}
                </div>
                <span style={{ fontFamily: 'sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                  {outfit.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
