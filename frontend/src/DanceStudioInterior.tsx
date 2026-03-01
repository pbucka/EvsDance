import { useState, useCallback, useRef, useEffect } from 'react'
import { Draggable } from './Draggable'
import { CartoonPerson } from './CartoonPerson'
import './DanceStudioInterior.css'

/* ----------------------------------------------------------------
   Zone hit-testing (percentage of viewport)
   ---------------------------------------------------------------- */

interface ZoneBounds {
  left: number
  right: number
  top: number
  bottom: number
}

const ZONE_SHOP: ZoneBounds = { left: 30, right: 70, top: 40, bottom: 80 }
const ZONE_DOORS: ZoneBounds = { left: 65, right: 98, top: 60, bottom: 98 }

function inZone(
  pos: { x: number; y: number },
  zone: ZoneBounds,
  vw: number,
  vh: number,
): boolean {
  const px = (pos.x / vw) * 100
  const py = (pos.y / vh) * 100
  return px >= zone.left && px <= zone.right && py >= zone.top && py <= zone.bottom
}

function anyInZone(
  positions: { x: number; y: number }[],
  zone: ZoneBounds,
  vw: number,
  vh: number,
): boolean {
  return positions.some((p) => inZone(p, zone, vw, vh))
}

/* ----------------------------------------------------------------
   Types
   ---------------------------------------------------------------- */

interface Position {
  x: number
  y: number
}

type ActiveRoom = 'lobby' | 'studio-a' | 'studio-b'

interface DanceStudioInteriorProps {
  onExit: () => void
}

/* ----------------------------------------------------------------
   Studio Music Hook
   ---------------------------------------------------------------- */

function useStudioMusic(active: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!active) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      return
    }

    const audio = new Audio()
    audio.loop = true
    audio.volume = 0.3
    const sources = [
      'https://cdn.pixabay.com/audio/2024/11/28/audio_3a88886f1d.mp3',
      'https://cdn.pixabay.com/audio/2022/10/12/audio_860740b4b4.mp3',
    ]
    audio.src = sources[Math.floor(Math.random() * sources.length)]
    audioRef.current = audio
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [active])
}

/* ----------------------------------------------------------------
   Studio Room (3D) — redesigned with window wall + barre + dancers
   ---------------------------------------------------------------- */

interface DancerDef {
  skinTone: 'light' | 'medium' | 'tan' | 'dark'
  hairStyle: 'long' | 'bob' | 'bun' | 'pigtails' | 'wavy'
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

function makeInitialPositions(vw: number, vh: number): Position[] {
  return [
    { x: vw * 0.10, y: vh * 0.58 },
    { x: vw * 0.25, y: vh * 0.56 },
    { x: vw * 0.58, y: vh * 0.57 },
    { x: vw * 0.78, y: vh * 0.59 },
    { x: vw * 0.06, y: vh * 0.72 },
    { x: vw * 0.24, y: vh * 0.75 },
    { x: vw * 0.56, y: vh * 0.73 },
    { x: vw * 0.80, y: vh * 0.76 },
  ]
}

const DANCE_ANIMS = ['vr-dance-sway', 'vr-dance-spin', 'vr-dance-jump']

function StudioRoom3D({
  name,
  theme,
  onBack,
}: {
  name: string
  theme: 'ballet' | 'hiphop'
  onBack: () => void
}) {
  const isBallet = theme === 'ballet'
  const dancers = isBallet ? BALLET_DANCERS : HIPHOP_DANCERS

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700

  const [performing, setPerforming] = useState(false)
  const [dancerPositions, setDancerPositions] = useState<Position[]>(() => makeInitialPositions(vw, vh))
  const [instructorPos, setInstructorPos] = useState<Position>({ x: vw * 0.44, y: vh * 0.48 })
  const [soloAnim, setSoloAnim] = useState<Record<number, string>>({})
  const performAudioRef = useRef<HTMLAudioElement | null>(null)

  useStudioMusic(true)

  const startPerformance = useCallback(() => {
    if (performing) return
    setPerforming(true)

    const audio = new Audio()
    audio.volume = 0.5
    const tracks = [
      'https://cdn.pixabay.com/audio/2024/11/28/audio_3a88886f1d.mp3',
      'https://cdn.pixabay.com/audio/2022/10/12/audio_860740b4b4.mp3',
    ]
    audio.src = tracks[Math.floor(Math.random() * tracks.length)]
    performAudioRef.current = audio
    audio.play().catch(() => {})

    setTimeout(() => {
      setPerforming(false)
      if (performAudioRef.current) {
        performAudioRef.current.pause()
        performAudioRef.current = null
      }
    }, 4000)
  }, [performing])

  const clampStudio = useCallback(
    (x: number, y: number): Position => ({
      x: Math.max(10, Math.min(vw - 50, x)),
      y: Math.max(vh * 0.40, Math.min(vh - 60, y)),
    }),
    [vw, vh],
  )

  const triggerSoloDance = useCallback((idx: number) => {
    const anim = DANCE_ANIMS[idx % DANCE_ANIMS.length]
    setSoloAnim((prev) => ({ ...prev, [idx]: anim }))
    setTimeout(() => setSoloAnim((prev) => { const next = { ...prev }; delete next[idx]; return next }), 1600)
  }, [])

  const moveDancer = useCallback(
    (idx: number, x: number, y: number) => {
      const clamped = clampStudio(x, y)
      setDancerPositions((prev) => {
        const next = [...prev]
        next[idx] = clamped
        return next
      })
    },
    [clampStudio],
  )

  const performClass = performing ? 'vr-group-perform' : ''

  return (
    <div className={`vr-interior vr-studio-room ${performClass}`}>
      <div className="vr-top-bar">
        <button type="button" className="vr-exit-btn" onClick={onBack}>
          &larr; Back to Lobby
        </button>
        <h1 className="vr-title">Ev's Dance</h1>
      </div>
      <div className="vr-studio-name">{name}</div>

      <div className="vr-room">
        <div className="vr-room-inner">
          {/* Ceiling */}
          <div className={`vr-ceiling ${isBallet ? 'vr-studio-ceiling-a' : 'vr-studio-ceiling-b'}`}>
            <div className="vr-track-light" />
            <div className="vr-track-light" />
            <div className="vr-track-light" />
            <div className="vr-track-light" />
          </div>

          {/* Floor */}
          <div className={`vr-floor ${isBallet ? 'vr-ballet-floor' : 'vr-hiphop-floor'}`} />

          {/* Back wall — full window wall with barre */}
          <div className="vr-back-wall vr-window-wall">
            <div className="vr-window-pane" />
            <div className="vr-window-pane" />
            <div className="vr-window-pane" />
            <div className="vr-window-pane" />
            <div className="vr-window-pane" />
            <div className="vr-window-pane" />
            <div className="vr-dance-barre" />
          </div>

          {/* Left wall */}
          <div className={`vr-left-wall ${isBallet ? 'vr-studio-left-wall' : 'vr-studio-left-wall-b'}`}>
            <div className="vr-wall-mirror" />
          </div>

          {/* Right wall */}
          <div className={`vr-right-wall ${isBallet ? 'vr-studio-right-wall' : 'vr-studio-right-wall-b'}`}>
            <div className="vr-wall-mirror" />
          </div>
        </div>
      </div>

      {/* Draggable instructor */}
      <div className="vr-studio-people-layer">
        <Draggable
          x={instructorPos.x}
          y={instructorPos.y}
          onMove={(x, y) => setInstructorPos(clampStudio(x, y))}
          className={`vr-studio-dancer vr-instructor-drag ${performing ? 'vr-group-lead' : ''}`}
        >
          <CartoonPerson
            label="Instructor"
            skinTone={isBallet ? 'medium' : 'dark'}
            hairStyle="bun"
            hairColor={isBallet ? '#1a1a2e' : '#5c4033'}
            topColor={isBallet ? '#ec4899' : '#f59e0b'}
            bottomColor={isBallet ? '#1e293b' : '#1e293b'}
            armLeftAngle={-50}
            armRightAngle={50}
          />
        </Draggable>

        {/* Draggable dancers */}
        {dancers.map((d, i) => (
          <Draggable
            key={i}
            x={dancerPositions[i]?.x ?? vw * 0.5}
            y={dancerPositions[i]?.y ?? vh * 0.5}
            onMove={(x, y) => moveDancer(i, x, y)}
            onTap={() => triggerSoloDance(i)}
            className={`vr-studio-dancer vr-dancer-drag ${performing ? `vr-group-dancer-${(i % 3) + 1}` : ''} ${soloAnim[i] ?? ''}`}
          >
            <CartoonPerson
              label="Dancer"
              skinTone={d.skinTone}
              hairStyle={d.hairStyle}
              hairColor={d.hairColor}
              topColor={d.topColor}
              bottomColor={d.bottomColor}
              armLeftAngle={d.armLeftAngle}
              armRightAngle={d.armRightAngle}
              legLeftAngle={d.legLeftAngle}
              legRightAngle={d.legRightAngle}
            />
          </Draggable>
        ))}
      </div>

      <div className="vr-studio-controls">
        <button type="button" className="vr-back-btn" onClick={onBack}>
          &larr; Return to Lobby
        </button>
        <button
          type="button"
          className={`vr-perform-btn ${performing ? 'performing' : ''}`}
          onClick={startPerformance}
          disabled={performing}
        >
          {performing ? 'Dancing!' : 'Perform a Dance Together'}
        </button>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------
   Main Interior Component — Lobby
   ---------------------------------------------------------------- */

export function DanceStudioInterior({ onExit }: DanceStudioInteriorProps) {
  const [activeRoom, setActiveRoom] = useState<ActiveRoom>('lobby')
  const [dancing, setDancing] = useState<Record<string, boolean>>({})

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700

  const [momPos, setMomPos] = useState<Position>({ x: vw * 0.35, y: vh * 0.78 })
  const [girl1Pos, setGirl1Pos] = useState<Position>({ x: vw * 0.42, y: vh * 0.80 })
  const [girl2Pos, setGirl2Pos] = useState<Position>({ x: vw * 0.49, y: vh * 0.79 })

  const isLobby = activeRoom === 'lobby'
  useStudioMusic(isLobby)

  const triggerDance = useCallback((id: string) => {
    setDancing((prev) => ({ ...prev, [id]: true }))
    setTimeout(() => setDancing((prev) => ({ ...prev, [id]: false })), 1600)
  }, [])

  const allPositions = [momPos, girl1Pos, girl2Pos]
  const atShop = anyInZone(allPositions, ZONE_SHOP, vw, vh)
  const atDoors = anyInZone(allPositions, ZONE_DOORS, vw, vh)

  const clampPerson = useCallback(
    (x: number, y: number): Position => ({
      x: Math.max(10, Math.min(vw - 40, x)),
      y: Math.max(vh * 0.35, Math.min(vh - 30, y)),
    }),
    [vw, vh],
  )

  if (activeRoom === 'studio-a') {
    return (
      <StudioRoom3D
        name="Studio A — Ballet & Contemporary"
        theme="ballet"
        onBack={() => setActiveRoom('lobby')}
      />
    )
  }

  if (activeRoom === 'studio-b') {
    return (
      <StudioRoom3D
        name="Studio B — Hip Hop & Jazz"
        theme="hiphop"
        onBack={() => setActiveRoom('lobby')}
      />
    )
  }

  return (
    <div className="vr-interior">
      {/* Top bar */}
      <div className="vr-top-bar">
        <button type="button" className="vr-exit-btn" onClick={onExit}>
          &larr; Leave Studio
        </button>
        <h1 className="vr-title">Ev's Dance</h1>
        <p className="vr-hint">Drag Mom &amp; the girls to explore the lobby</p>
      </div>

      {/* 3D Room */}
      <div className="vr-room">
        <div className="vr-room-inner">
          {/* Ceiling */}
          <div className="vr-ceiling">
            <div className="vr-track-light" />
            <div className="vr-track-light" />
            <div className="vr-track-light" />
            <div className="vr-track-light" />
          </div>

          {/* Floor */}
          <div className="vr-floor" />

          {/* Back wall — Dance Shop sign */}
          <div className="vr-back-wall">
            <div className={`vr-shop-neon ${atShop ? 'glow' : ''}`}>Dance Shop</div>
          </div>

          {/* Left wall — Ev's Dance logo */}
          <div className="vr-left-wall">
            <div className="vr-wall-logo">Ev's Dance</div>
          </div>

          {/* Right wall */}
          <div className="vr-right-wall" />
        </div>
      </div>

      {/* Dance Shop displays (2D overlay, bottom-center) */}
      <div className={`vr-floor-shop ${atShop ? 'shop-active' : ''}`}>
        {/* Mannequin with leotard */}
        <div className="vr-display-case">
          <div className="vr-mannequin">
            <svg width="44" height="70" viewBox="0 0 44 70" fill="none">
              <circle cx="22" cy="8" r="7" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
              <path d="M 14 18 L 14 42 Q 14 46 18 46 L 26 46 Q 30 46 30 42 L 30 18 Z" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
              <path d="M 14 46 L 10 64" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
              <path d="M 30 46 L 34 64" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            </svg>
          </div>
          <div className="vr-display-label">Leotards</div>
          <div className="vr-display-price">$28–$32</div>
        </div>

        {/* Tutu on stand */}
        <div className="vr-display-case">
          <div className="vr-tutu-stand">
            <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
              <rect x="22" y="30" width="6" height="28" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
              <rect x="15" y="56" width="20" height="4" rx="2" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
              <ellipse cx="25" cy="22" rx="18" ry="10" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="1.5" />
              <ellipse cx="25" cy="22" rx="14" ry="7" fill="#fbcfe8" stroke="#f9a8d4" strokeWidth="1" />
              <ellipse cx="25" cy="22" rx="10" ry="5" fill="#f9a8d4" />
              <rect x="20" y="8" width="10" height="16" rx="3" fill="#ddd6fe" stroke="#a78bfa" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="vr-display-label">Tutus</div>
          <div className="vr-display-price">$35–$38</div>
        </div>

        {/* Ballet shoes display */}
        <div className="vr-display-case">
          <div className="vr-shoe-display">
            <svg width="60" height="50" viewBox="0 0 60 50" fill="none">
              <rect x="5" y="28" width="50" height="18" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
              <path d="M 12 26 Q 10 16 14 12 Q 18 8 22 12 L 24 20 Q 26 26 22 28 L 12 28 Z" fill="#fde68a" stroke="#d97706" strokeWidth="1.2" />
              <path d="M 14 14 L 22 14" stroke="#d97706" strokeWidth="0.8" />
              <path d="M 34 26 Q 32 16 36 12 Q 40 8 44 12 L 46 20 Q 48 26 44 28 L 34 28 Z" fill="#1e293b" stroke="#475569" strokeWidth="1.2" />
              <path d="M 36 14 L 44 14" stroke="#475569" strokeWidth="0.8" />
            </svg>
          </div>
          <div className="vr-display-label">Ballet Shoes</div>
          <div className="vr-display-price">$22–$48</div>
        </div>

        {/* Dance bag */}
        <div className="vr-display-case">
          <div className="vr-bag-display">
            <svg width="44" height="50" viewBox="0 0 44 50" fill="none">
              <path d="M 12 18 Q 12 6 22 6 Q 32 6 32 18" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" />
              <rect x="6" y="18" width="32" height="26" rx="4" fill="#a78bfa" stroke="#7c3aed" strokeWidth="1.5" />
              <rect x="14" y="24" width="16" height="8" rx="2" fill="#7c3aed" />
              <text x="22" y="31" textAnchor="middle" fill="#fff" fontSize="5" fontWeight="bold">EV'S</text>
            </svg>
          </div>
          <div className="vr-display-label">Dance Bags</div>
          <div className="vr-display-price">$18–$25</div>
        </div>
      </div>

      {/* Welcome desk on the floor (2D overlay, bottom-left) */}
      <div className="vr-floor-desk">
        <div className="vr-desk-area">
          {/* Receptionist behind the desk — visible above it */}
          <div className="vr-desk-receptionist">
            <CartoonPerson
              label="Receptionist"
              skinTone="medium"
              hairStyle="bun"
              hairColor="#1a1a2e"
              topColor="#7c3aed"
              bottomColor="#1e293b"
            />
            {/* Phone headset */}
            <svg className="vr-headset" width="28" height="20" viewBox="0 0 28 20" fill="none">
              <path d="M 4 14 Q 4 4 14 4 Q 24 4 24 14" stroke="#374151" strokeWidth="2.5" fill="none" />
              <rect x="1" y="12" width="6" height="8" rx="2" fill="#374151" />
              <rect x="21" y="12" width="6" height="8" rx="2" fill="#374151" />
              <path d="M 7 16 Q 10 18 14 16" stroke="#374151" strokeWidth="1.5" fill="none" />
            </svg>
          </div>
          {/* Computer monitor on desk */}
          <div className="vr-desk-monitor">
            <div className="vr-monitor-screen" />
            <div className="vr-monitor-stand" />
          </div>
          {/* The physical desk surface */}
          <div className="vr-desk-surface">
            <span className="vr-desk-label">Welcome</span>
          </div>
        </div>
        {/* Speech bubble */}
        <div className="vr-desk-speech">Welcome to Ev's Dance!</div>
      </div>

      {/* Studio doors on the floor (2D overlay, bottom-right) */}
      <div className="vr-floor-doors">
        <div className="vr-floor-door-unit">
          <div className={`vr-floor-door-frame ${atDoors ? 'door-open' : ''}`}>
            <div className="vr-floor-door-panel vr-fdoor-a" />
            <div className="vr-floor-door-inside vr-fdinside-a" />
          </div>
          <div className="vr-floor-door-sign vr-sign-a">Studio A</div>
          <div className="vr-floor-door-sub">Ballet &amp; Contemporary</div>
          {atDoors && (
            <button
              type="button"
              className="vr-door-enter-btn"
              onClick={() => setActiveRoom('studio-a')}
            >
              Enter Studio A
            </button>
          )}
        </div>
        <div className="vr-floor-door-unit">
          <div className={`vr-floor-door-frame ${atDoors ? 'door-open' : ''}`}>
            <div className="vr-floor-door-panel vr-fdoor-b" />
            <div className="vr-floor-door-inside vr-fdinside-b" />
          </div>
          <div className="vr-floor-door-sign vr-sign-b">Studio B</div>
          <div className="vr-floor-door-sub">Hip Hop &amp; Jazz</div>
          {atDoors && (
            <button
              type="button"
              className="vr-door-enter-btn"
              onClick={() => setActiveRoom('studio-b')}
            >
              Enter Studio B
            </button>
          )}
        </div>
      </div>

      {/* Drop zones overlay — only shop and doors (no desk circle) */}
      <div className="vr-zones-overlay">
        <div className={`vr-zone vr-zone-shop ${atShop ? 'active' : ''}`}>
          <span className="vr-zone-label">Shop</span>
        </div>
        <div className={`vr-zone vr-zone-doors ${atDoors ? 'active' : ''}`}>
          <span className="vr-zone-label">Studios</span>
        </div>
      </div>

      {/* Draggable characters */}
      <div className="vr-characters">
        <Draggable
          x={momPos.x}
          y={momPos.y - 52}
          onMove={(x, y) => setMomPos(clampPerson(x, y + 52))}
          onTap={() => triggerDance('mom')}
          className={`vr-person ${dancing['mom'] ? 'vr-dancing vr-dance-sway' : ''}`}
        >
          <CartoonPerson
            label="Mom"
            skinTone="light"
            hairStyle="long"
            hairColor="#5c4033"
            topColor="#e0e7ff"
            bottomColor="#6366f1"
          />
        </Draggable>
        <Draggable
          x={girl1Pos.x}
          y={girl1Pos.y - 52}
          onMove={(x, y) => setGirl1Pos(clampPerson(x, y + 52))}
          onTap={() => triggerDance('girl1')}
          className={`vr-person ${dancing['girl1'] ? 'vr-dancing vr-dance-spin' : ''}`}
        >
          <CartoonPerson
            label="Girl"
            skinTone="light"
            hairStyle="pigtails"
            hairColor="#f5d076"
            topColor="#fce7f3"
            bottomColor="#ec4899"
          />
        </Draggable>
        <Draggable
          x={girl2Pos.x}
          y={girl2Pos.y - 52}
          onMove={(x, y) => setGirl2Pos(clampPerson(x, y + 52))}
          onTap={() => triggerDance('girl2')}
          className={`vr-person ${dancing['girl2'] ? 'vr-dancing vr-dance-jump' : ''}`}
        >
          <CartoonPerson
            label="Girl"
            skinTone="light"
            hairStyle="long"
            hairColor="#c084fc"
            topColor="#f5f3ff"
            bottomColor="#8b5cf6"
          />
        </Draggable>
      </div>
    </div>
  )
}
