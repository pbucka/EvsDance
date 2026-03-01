'use client'

import { useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CartoonPerson } from '@/components/characters/CartoonPerson'

type AreaName = 'sanctuary' | 'lobby'

interface AreaDef {
  name: string
  wallColor: string
  floorColor: string
  floorPattern?: string
  accentColor: string
  people: { x: number; y: number; label: string; skinTone: 'light' | 'medium' | 'tan' | 'dark'; hairStyle: 'long' | 'bob' | 'bun' | 'pigtails' | 'wavy'; hairColor: string; topColor: string; bottomColor: string }[]
}

const AREAS: Record<AreaName, AreaDef> = {
  sanctuary: {
    name: 'Sanctuary',
    wallColor: '#fefce8',
    floorColor: '#b87333',
    floorPattern: '#a0643a',
    accentColor: '#92400e',
    people: [
      { x: 44, y: 32, label: 'Pastor', skinTone: 'light', hairStyle: 'bob', hairColor: '#1a1a2e', topColor: '#1e293b', bottomColor: '#1e293b' },
      { x: 25, y: 55, label: 'Member', skinTone: 'medium', hairStyle: 'bun', hairColor: '#5c4033', topColor: '#7c3aed', bottomColor: '#1e293b' },
      { x: 60, y: 57, label: 'Member', skinTone: 'dark', hairStyle: 'long', hairColor: '#1a1a2e', topColor: '#dc2626', bottomColor: '#374151' },
      { x: 35, y: 62, label: 'Member', skinTone: 'tan', hairStyle: 'wavy', hairColor: '#5c4033', topColor: '#3b82f6', bottomColor: '#1e293b' },
      { x: 72, y: 60, label: 'Member', skinTone: 'light', hairStyle: 'bob', hairColor: '#f5d076', topColor: '#22c55e', bottomColor: '#374151' },
    ],
  },
  lobby: {
    name: 'Lobby & Fellowship Hall',
    wallColor: '#fff7ed',
    floorColor: '#d1c4a8',
    floorPattern: '#c0b393',
    accentColor: '#b45309',
    people: [
      { x: 30, y: 55, label: 'Greeter', skinTone: 'light', hairStyle: 'bun', hairColor: '#5c4033', topColor: '#f59e0b', bottomColor: '#1e293b' },
      { x: 65, y: 58, label: 'Member', skinTone: 'dark', hairStyle: 'wavy', hairColor: '#1a1a2e', topColor: '#ec4899', bottomColor: '#374151' },
    ],
  },
}

const AREA_ORDER: AreaName[] = ['sanctuary', 'lobby']

const S = 2.5
const O = '#2d2d3a'
const SW = 3

function Sanctuary() {
  return (
    <g>
      {/* Large stained glass window — center back wall */}
      <rect x={130 * S} y={148 * S} width={100 * S} height={70 * S} rx={4} fill="#fef3c7" stroke={O} strokeWidth={SW} />
      <rect x={135 * S} y={152 * S} width={90 * S} height={60 * S} rx={3} fill="none" stroke={O} strokeWidth={1.5} />
      {/* Stained glass panes */}
      <rect x={137 * S} y={154 * S} width={28 * S} height={28 * S} rx={2} fill="#ef4444" opacity={0.6} />
      <rect x={167 * S} y={154 * S} width={28 * S} height={28 * S} rx={2} fill="#3b82f6" opacity={0.6} />
      <rect x={197 * S} y={154 * S} width={26 * S} height={28 * S} rx={2} fill="#22c55e" opacity={0.6} />
      <rect x={137 * S} y={184 * S} width={28 * S} height={26 * S} rx={2} fill="#f59e0b" opacity={0.6} />
      <rect x={167 * S} y={184 * S} width={28 * S} height={26 * S} rx={2} fill="#8b5cf6" opacity={0.6} />
      <rect x={197 * S} y={184 * S} width={26 * S} height={26 * S} rx={2} fill="#ec4899" opacity={0.6} />
      {/* Cross in center of window */}
      <rect x={178 * S} y={155 * S} width={4 * S} height={55 * S} fill="#92400e" rx={2} />
      <rect x={160 * S} y={173 * S} width={40 * S} height={4 * S} fill="#92400e" rx={2} />

      {/* Pulpit / podium */}
      <rect x={155 * S} y={225 * S} width={50 * S} height={40 * S} rx={4} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      <rect x={160 * S} y={230 * S} width={40 * S} height={10 * S} rx={3} fill="#a0845c" stroke={O} strokeWidth={1.5} />
      {/* Bible on pulpit */}
      <rect x={168 * S} y={222 * S} width={24 * S} height={6 * S} rx={2} fill="#1e293b" stroke={O} strokeWidth={1.5} />
      <rect x={176 * S} y={220 * S} width={8 * S} height={4 * S} rx={1} fill="#fbbf24" stroke={O} strokeWidth={1} />

      {/* Pew rows */}
      {[270, 285, 300].map((y) => (
        <g key={y}>
          <rect x={60 * S} y={y * S} width={110 * S} height={10 * S} rx={3} fill="#92400e" stroke={O} strokeWidth={2} />
          <rect x={60 * S} y={(y - 6) * S} width={110 * S} height={8 * S} rx={3} fill="#a0845c" stroke={O} strokeWidth={2} />
          <rect x={195 * S} y={y * S} width={110 * S} height={10 * S} rx={3} fill="#92400e" stroke={O} strokeWidth={2} />
          <rect x={195 * S} y={(y - 6) * S} width={110 * S} height={8 * S} rx={3} fill="#a0845c" stroke={O} strokeWidth={2} />
        </g>
      ))}

      {/* Aisle carpet */}
      <rect x={173 * S} y={225 * S} width={16 * S} height={95 * S} rx={0} fill="#dc2626" opacity={0.3} />

      {/* Side stained glass windows */}
      <rect x={20 * S} y={170 * S} width={20 * S} height={40 * S} rx={10} fill="#60a5fa" stroke={O} strokeWidth={2} opacity={0.7} />
      <rect x={20 * S} y={188 * S} width={20 * S} height={2 * S} fill={O} opacity={0.4} />
      <rect x={320 * S} y={170 * S} width={20 * S} height={40 * S} rx={10} fill="#f59e0b" stroke={O} strokeWidth={2} opacity={0.7} />
      <rect x={320 * S} y={188 * S} width={20 * S} height={2 * S} fill={O} opacity={0.4} />

      {/* Chandelier / light */}
      <rect x={178 * S} y={140 * S} width={4 * S} height={12 * S} fill="#d4a76a" stroke={O} strokeWidth={1} />
      <ellipse cx={180 * S} cy={153 * S} rx={18 * S} ry={5 * S} fill="#fbbf24" stroke={O} strokeWidth={2} />
      <circle cx={170 * S} cy={154 * S} r={3 * S} fill="#fef08a" opacity={0.8} />
      <circle cx={180 * S} cy={155 * S} r={3 * S} fill="#fef08a" opacity={0.8} />
      <circle cx={190 * S} cy={154 * S} r={3 * S} fill="#fef08a" opacity={0.8} />

      {/* Cross on front wall above window */}
      <rect x={176 * S} y={132 * S} width={8 * S} height={20 * S} rx={2} fill="#92400e" stroke={O} strokeWidth={2} />
      <rect x={170 * S} y={138 * S} width={20 * S} height={6 * S} rx={2} fill="#92400e" stroke={O} strokeWidth={2} />
    </g>
  )
}

function Lobby() {
  return (
    <g>
      {/* Welcome sign */}
      <rect x={120 * S} y={150 * S} width={120 * S} height={28 * S} rx={5} fill="#fef3c7" stroke={O} strokeWidth={SW} />
      <text x={180 * S} y={168 * S} textAnchor="middle" fontSize={8 * S} fontWeight="bold" fill="#92400e" fontFamily="Georgia, serif">Welcome to Woodridge</text>

      {/* Donut table */}
      <rect x={220 * S} y={220 * S} width={100 * S} height={35 * S} rx={5} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      <rect x={220 * S} y={215 * S} width={100 * S} height={8 * S} rx={4} fill="#a0845c" stroke={O} strokeWidth={2} />
      {/* Table legs */}
      <rect x={228 * S} y={255 * S} width={5 * S} height={20 * S} fill="#7a5f3a" stroke={O} strokeWidth={1.5} />
      <rect x={307 * S} y={255 * S} width={5 * S} height={20 * S} fill="#7a5f3a" stroke={O} strokeWidth={1.5} />

      {/* "Donuts" sign on table */}
      <rect x={245 * S} y={207 * S} width={50 * S} height={10 * S} rx={3} fill="#fbbf24" stroke={O} strokeWidth={1.5} />
      <text x={270 * S} y={215 * S} textAnchor="middle" fontSize={5 * S} fontWeight="bold" fill={O} fontFamily="sans-serif">DONUTS!</text>

      {/* Donut tray */}
      <rect x={232 * S} y={217 * S} width={76 * S} height={5 * S} rx={2} fill="#e5e7eb" stroke={O} strokeWidth={1.5} />

      {/* Donuts row 1 */}
      <circle cx={245 * S} cy={228 * S} r={7 * S} fill="#f59e0b" stroke={O} strokeWidth={2} />
      <circle cx={245 * S} cy={228 * S} r={3 * S} fill="#fef3c7" />
      <circle cx={262 * S} cy={228 * S} r={7 * S} fill="#ec4899" stroke={O} strokeWidth={2} />
      <circle cx={262 * S} cy={228 * S} r={3 * S} fill="#fce7f3" />
      <rect x={256 * S} y={223 * S} width={12 * S} height={2 * S} rx={1} fill="#fff" opacity={0.5} />
      <circle cx={279 * S} cy={228 * S} r={7 * S} fill="#92400e" stroke={O} strokeWidth={2} />
      <circle cx={279 * S} cy={228 * S} r={3 * S} fill="#d4a76a" />
      <circle cx={296 * S} cy={228 * S} r={7 * S} fill="#8b5cf6" stroke={O} strokeWidth={2} />
      <circle cx={296 * S} cy={228 * S} r={3 * S} fill="#e9d5ff" />
      <rect x={290 * S} y={223 * S} width={12 * S} height={2 * S} rx={1} fill="#fff" opacity={0.5} />

      {/* Donuts row 2 */}
      <circle cx={253 * S} cy={242 * S} r={7 * S} fill="#22c55e" stroke={O} strokeWidth={2} />
      <circle cx={253 * S} cy={242 * S} r={3 * S} fill="#bbf7d0" />
      <circle cx={270 * S} cy={242 * S} r={7 * S} fill="#f59e0b" stroke={O} strokeWidth={2} />
      <circle cx={270 * S} cy={242 * S} r={3 * S} fill="#fef3c7" />
      <circle cx={287 * S} cy={242 * S} r={7 * S} fill="#ef4444" stroke={O} strokeWidth={2} />
      <circle cx={287 * S} cy={242 * S} r={3 * S} fill="#fecaca" />

      {/* Coffee station */}
      <rect x={30 * S} y={220 * S} width={50 * S} height={35 * S} rx={4} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      {/* Coffee pot */}
      <rect x={40 * S} y={210 * S} width={15 * S} height={12 * S} rx={3} fill="#4a5568" stroke={O} strokeWidth={2} />
      <rect x={45 * S} y={206 * S} width={5 * S} height={5 * S} rx={2} fill="#718096" stroke={O} strokeWidth={1} />
      <rect x={42 * S} y={216 * S} width={3 * S} height={6 * S} fill="#ef4444" />
      {/* Coffee cups */}
      <rect x={62 * S} y={214 * S} width={8 * S} height={8 * S} rx={2} fill="#fff" stroke={O} strokeWidth={1.5} />
      <rect x={64 * S} y={212 * S} width={4 * S} height={3 * S} rx={1} fill="#d4a76a" />

      {/* Brochure rack */}
      <rect x={100 * S} y={230 * S} width={30 * S} height={40 * S} rx={3} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      <rect x={103 * S} y={234 * S} width={24 * S} height={8 * S} rx={1} fill="#bfdbfe" stroke={O} strokeWidth={1} />
      <rect x={103 * S} y={245 * S} width={24 * S} height={8 * S} rx={1} fill="#fecaca" stroke={O} strokeWidth={1} />
      <rect x={103 * S} y={256 * S} width={24 * S} height={8 * S} rx={1} fill="#bbf7d0" stroke={O} strokeWidth={1} />

      {/* Coat hooks on wall */}
      {[160, 175, 190].map((x) => (
        <g key={x}>
          <circle cx={x * S} cy={190 * S} r={2 * S} fill="#94a3b8" stroke={O} strokeWidth={1} />
        </g>
      ))}

      {/* Floor mat */}
      <rect x={140 * S} y={285 * S} width={80 * S} height={15 * S} rx={3} fill="#92400e" stroke={O} strokeWidth={2} opacity={0.5} />
      <text x={180 * S} y={296 * S} textAnchor="middle" fontSize={4.5 * S} fill="#fef3c7" fontWeight="bold" fontFamily="sans-serif">WELCOME</text>
    </g>
  )
}

const AREA_RENDERERS: Record<AreaName, () => JSX.Element> = {
  sanctuary: Sanctuary,
  lobby: Lobby,
}

function CartoonArea({ area }: { area: AreaName }) {
  const config = AREAS[area]
  const Room = AREA_RENDERERS[area]
  const VB_W = 375 * S
  const VB_H = 320 * S

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} style={{ width: '100%', height: '100%', display: 'block' }} preserveAspectRatio="xMidYMid meet">
      <rect x={0} y={0} width={VB_W} height={VB_H * 0.6} fill={config.wallColor} />
      <rect x={0} y={VB_H * 0.58} width={VB_W} height={VB_H * 0.04} fill="#f5f0e6" stroke={O} strokeWidth={2} />
      <rect x={0} y={VB_H * 0.6} width={VB_W} height={VB_H * 0.4} fill={config.floorColor} />
      {config.floorPattern && (
        <g opacity={0.3}>
          {Array.from({ length: 8 }, (_, i) => (
            <line key={i} x1={0} y1={VB_H * 0.6 + (i + 1) * (VB_H * 0.4 / 9)} x2={VB_W} y2={VB_H * 0.6 + (i + 1) * (VB_H * 0.4 / 9)} stroke={config.floorPattern} strokeWidth={1.5} />
          ))}
        </g>
      )}
      <rect x={0} y={0} width={VB_W} height={4 * S} fill="#f5ebe0" stroke={O} strokeWidth={1} />
      <Room />
    </svg>
  )
}

function AreaTabs({ current, onChange, accentColor }: { current: AreaName; onChange: (a: AreaName) => void; accentColor: string }) {
  return (
    <div style={{ display: 'flex', gap: 6, padding: '10px 20px', flexWrap: 'wrap', background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)' }}>
      {AREA_ORDER.map((a) => {
        const active = a === current
        return (
          <button key={a} type="button" onClick={() => onChange(a)} style={{
            padding: '7px 16px', fontFamily: "'Georgia', serif",
            fontSize: '0.8rem', fontWeight: 700,
            color: active ? '#fff' : 'rgba(255,255,255,0.75)',
            background: active ? accentColor : 'rgba(255,255,255,0.1)',
            border: `3px solid ${active ? '#fff' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 20, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
            boxShadow: active ? '0 3px 10px rgba(0,0,0,0.3)' : 'none',
          }}>
            {AREAS[a].name}
          </button>
        )
      })}
    </div>
  )
}

interface ChurchInteriorProps {
  onExit: () => void
}

export function ChurchInterior({ onExit }: ChurchInteriorProps) {
  const [currentArea, setCurrentArea] = useState<AreaName>('sanctuary')
  const config = AREAS[currentArea]
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700

  const handleAreaChange = useCallback((a: AreaName) => setCurrentArea(a), [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#2d2d3a', overflow: 'hidden', zIndex: 200 }}>
      <AnimatePresence mode="wait">
        <motion.div key={currentArea} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CartoonArea area={currentArea} />
        </motion.div>
      </AnimatePresence>

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', gap: 14, padding: '10px 20px',
        background: `linear-gradient(180deg, ${config.accentColor}ee 0%, ${config.accentColor}cc 100%)`,
        backdropFilter: 'blur(10px)', boxShadow: '0 3px 20px rgba(0,0,0,0.3)',
      }}>
        <button type="button" onClick={onExit} style={{
          padding: '7px 14px', fontSize: '0.85rem', fontWeight: 700,
          fontFamily: "'Georgia', serif",
          color: config.accentColor, background: '#fff', border: '3px solid #fff',
          borderRadius: 12, cursor: 'pointer',
        }}>
          ← Leave Church
        </button>
        <h1 style={{
          margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#fff',
          fontFamily: "'Georgia', serif",
          textShadow: '2px 2px 0 rgba(0,0,0,0.2)',
        }}>
          ✝ Woodridge Church — {config.name}
        </h1>
      </div>

      {/* Area tabs */}
      <div style={{ position: 'absolute', top: 52, left: 0, right: 0, zIndex: 40 }}>
        <AreaTabs current={currentArea} onChange={handleAreaChange} accentColor={config.accentColor} />
      </div>

      {/* People overlay */}
      <div style={{ position: 'absolute', inset: 0, top: 100, pointerEvents: 'none', zIndex: 20 }}>
        {config.people.map((p, i) => (
          <div key={`${currentArea}-${i}`} style={{
            position: 'absolute', left: (p.x / 100) * vw, top: (p.y / 100) * vh,
            transform: 'scale(1.4)', filter: 'drop-shadow(3px 4px 0 #2d2d3a)',
            pointerEvents: 'auto', cursor: 'grab',
          }}>
            <CartoonPerson label={p.label} skinTone={p.skinTone} hairStyle={p.hairStyle} hairColor={p.hairColor} topColor={p.topColor} bottomColor={p.bottomColor} />
          </div>
        ))}
      </div>

      {/* Bottom back button */}
      <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 50 }}>
        <button type="button" onClick={onExit} style={{
          padding: '10px 24px', fontFamily: "'Georgia', serif",
          fontSize: '0.95rem', fontWeight: 700, color: '#fff',
          background: config.accentColor, border: '3px solid #fff',
          borderRadius: 16, cursor: 'pointer',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)', whiteSpace: 'nowrap',
        }}>
          ← Back to Neighborhood
        </button>
      </div>
    </div>
  )
}
