'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CartoonPerson } from '@/components/characters/CartoonPerson'

type RoomName = 'living-room' | 'kitchen' | 'bedroom-1' | 'bedroom-2' | 'bathroom' | 'dining-room'

interface PersonDef {
  x: number
  y: number
  label: string
  skinTone: 'light' | 'medium' | 'tan' | 'dark'
  hairStyle: 'long' | 'bob' | 'bun' | 'pigtails' | 'wavy'
  hairColor: string
  topColor: string
  bottomColor: string
}

interface RoomDef {
  name: string
  wallColor: string
  floorColor: string
  floorPattern?: string
  accentColor: string
  people: PersonDef[]
}

const ROOMS: Record<RoomName, RoomDef> = {
  'living-room': {
    name: 'Living Room',
    wallColor: '#fff4cc',
    floorColor: '#d4a76a',
    floorPattern: '#c49355',
    accentColor: '#d97706',
    people: [
      { x: 60, y: 55, label: 'Dad', skinTone: 'light', hairStyle: 'bob', hairColor: '#5c4033', topColor: '#3b82f6', bottomColor: '#1e293b' },
    ],
  },
  kitchen: {
    name: 'Kitchen',
    wallColor: '#e8ffd4',
    floorColor: '#c8c8c8',
    floorPattern: '#b8b8b8',
    accentColor: '#16a34a',
    people: [
      { x: 50, y: 58, label: 'Mom', skinTone: 'light', hairStyle: 'long', hairColor: '#5c4033', topColor: '#e0e7ff', bottomColor: '#6366f1' },
    ],
  },
  'bedroom-1': {
    name: 'Master Bedroom',
    wallColor: '#ede2ff',
    floorColor: '#d4c49a',
    accentColor: '#7c3aed',
    people: [],
  },
  'bedroom-2': {
    name: "Kids' Bedroom",
    wallColor: '#ffe8f5',
    floorColor: '#d4c49a',
    accentColor: '#ec4899',
    people: [
      { x: 25, y: 55, label: 'Girl', skinTone: 'light', hairStyle: 'pigtails', hairColor: '#f5d076', topColor: '#fce7f3', bottomColor: '#ec4899' },
      { x: 65, y: 57, label: 'Girl', skinTone: 'light', hairStyle: 'long', hairColor: '#c084fc', topColor: '#f5f3ff', bottomColor: '#8b5cf6' },
    ],
  },
  bathroom: {
    name: 'Bathroom',
    wallColor: '#d4f0ff',
    floorColor: '#e0e0e0',
    floorPattern: '#cce0ff',
    accentColor: '#0284c7',
    people: [],
  },
  'dining-room': {
    name: 'Dining Room',
    wallColor: '#fff4cc',
    floorColor: '#d4a76a',
    floorPattern: '#c49355',
    accentColor: '#b45309',
    people: [],
  },
}

const ROOM_ORDER: RoomName[] = ['living-room', 'kitchen', 'dining-room', 'bedroom-1', 'bedroom-2', 'bathroom']

const S = 2.5
const O = '#2d2d3a'
const SW = 3

function LivingRoom() {
  return (
    <g>
      {/* Sofa */}
      <rect x={60 * S} y={200 * S} width={140 * S} height={55 * S} rx={12} fill="#7c8a99" stroke={O} strokeWidth={SW} />
      <rect x={55 * S} y={190 * S} width={150 * S} height={20 * S} rx={10} fill="#8b9aab" stroke={O} strokeWidth={SW} />
      <rect x={55 * S} y={195 * S} width={25 * S} height={55 * S} rx={8} fill="#8b9aab" stroke={O} strokeWidth={SW} />
      <rect x={180 * S} y={195 * S} width={25 * S} height={55 * S} rx={8} fill="#8b9aab" stroke={O} strokeWidth={SW} />
      {/* Sofa cushions */}
      <rect x={85 * S} y={205 * S} width={38 * S} height={35 * S} rx={6} fill="#ff9f6b" stroke={O} strokeWidth={2} />
      <rect x={132 * S} y={205 * S} width={38 * S} height={35 * S} rx={6} fill="#6bd4ff" stroke={O} strokeWidth={2} />

      {/* Coffee table */}
      <rect x={100 * S} y={270 * S} width={70 * S} height={30 * S} rx={5} fill="#b87333" stroke={O} strokeWidth={SW} />
      <rect x={108 * S} y={265 * S} width={18 * S} height={6 * S} rx={3} fill="#48bb78" stroke={O} strokeWidth={2} />
      <circle cx={155 * S} cy={278 * S} r={7 * S} fill="#ffd166" stroke={O} strokeWidth={2} />

      {/* TV */}
      <rect x={280 * S} y={170 * S} width={70 * S} height={50 * S} rx={5} fill="#2d3748" stroke={O} strokeWidth={SW} />
      <rect x={284 * S} y={174 * S} width={62 * S} height={38 * S} rx={2} fill="#4a90d9" stroke="none" />
      <rect x={300 * S} y={220 * S} width={40 * S} height={8 * S} rx={3} fill="#4a5568" stroke={O} strokeWidth={2} />
      <rect x={310 * S} y={228 * S} width={20 * S} height={30 * S} rx={0} fill="#8b6f47" stroke={O} strokeWidth={2} />

      {/* Bookshelf */}
      <rect x={10 * S} y={160 * S} width={40 * S} height={100 * S} rx={3} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      <rect x={14 * S} y={168 * S} width={32 * S} height={4 * S} fill="#7a5f3a" />
      <rect x={14 * S} y={192 * S} width={32 * S} height={4 * S} fill="#7a5f3a" />
      <rect x={14 * S} y={216 * S} width={32 * S} height={4 * S} fill="#7a5f3a" />
      {/* Books */}
      <rect x={16 * S} y={173 * S} width={6 * S} height={18 * S} rx={1} fill="#ef4444" stroke={O} strokeWidth={1} />
      <rect x={23 * S} y={175 * S} width={5 * S} height={16 * S} rx={1} fill="#3b82f6" stroke={O} strokeWidth={1} />
      <rect x={29 * S} y={174 * S} width={7 * S} height={17 * S} rx={1} fill="#22c55e" stroke={O} strokeWidth={1} />
      <rect x={37 * S} y={176 * S} width={5 * S} height={15 * S} rx={1} fill="#f59e0b" stroke={O} strokeWidth={1} />
      <rect x={16 * S} y={197 * S} width={8 * S} height={18 * S} rx={1} fill="#ec4899" stroke={O} strokeWidth={1} />
      <rect x={25 * S} y={199 * S} width={6 * S} height={16 * S} rx={1} fill="#8b5cf6" stroke={O} strokeWidth={1} />

      {/* Lamp */}
      <rect x={258 * S} y={250 * S} width={4 * S} height={40 * S} fill="#d4a76a" stroke={O} strokeWidth={2} />
      <ellipse cx={260 * S} cy={245 * S} rx={16 * S} ry={12 * S} fill="#fef08a" stroke={O} strokeWidth={2} />
      <circle cx={260 * S} cy={243 * S} r={3 * S} fill="#fff" opacity={0.6} />

      {/* Rug */}
      <ellipse cx={175 * S} cy={290 * S} rx={80 * S} ry={20 * S} fill="#e76f51" stroke={O} strokeWidth={SW} opacity={0.7} />
      <ellipse cx={175 * S} cy={290 * S} rx={55 * S} ry={13 * S} fill="#f4a261" stroke="none" opacity={0.5} />

      {/* Picture frame */}
      <rect x={130 * S} y={155 * S} width={30 * S} height={25 * S} rx={2} fill="#fbbf24" stroke={O} strokeWidth={SW} />
      <rect x={133 * S} y={158 * S} width={24 * S} height={19 * S} rx={1} fill="#86efac" stroke="none" />
      <circle cx={140 * S} cy={165 * S} r={4 * S} fill="#fde047" />
      <path d={`M ${133 * S} ${172 * S} L ${140 * S} ${165 * S} L ${148 * S} ${170 * S} L ${157 * S} ${167 * S} L ${157 * S} ${177 * S} L ${133 * S} ${177 * S} Z`} fill="#22c55e" />
    </g>
  )
}

function Kitchen() {
  return (
    <g>
      {/* Counter */}
      <rect x={20 * S} y={200 * S} width={200 * S} height={55 * S} rx={4} fill="#f5ebe0" stroke={O} strokeWidth={SW} />
      <rect x={20 * S} y={195 * S} width={200 * S} height={10 * S} rx={3} fill="#a78b6e" stroke={O} strokeWidth={SW} />
      {/* Cabinet doors */}
      <rect x={30 * S} y={210 * S} width={35 * S} height={40 * S} rx={3} fill="#e8d5bf" stroke={O} strokeWidth={2} />
      <circle cx={58 * S} cy={230 * S} r={2 * S} fill={O} />
      <rect x={75 * S} y={210 * S} width={35 * S} height={40 * S} rx={3} fill="#e8d5bf" stroke={O} strokeWidth={2} />
      <circle cx={103 * S} cy={230 * S} r={2 * S} fill={O} />
      <rect x={120 * S} y={210 * S} width={35 * S} height={40 * S} rx={3} fill="#e8d5bf" stroke={O} strokeWidth={2} />
      <circle cx={148 * S} cy={230 * S} r={2 * S} fill={O} />

      {/* Stove */}
      <rect x={170 * S} y={200 * S} width={45 * S} height={55 * S} rx={3} fill="#4a5568" stroke={O} strokeWidth={SW} />
      <circle cx={182 * S} cy={210 * S} r={8 * S} fill="#718096" stroke={O} strokeWidth={2} />
      <circle cx={205 * S} cy={210 * S} r={8 * S} fill="#718096" stroke={O} strokeWidth={2} />
      <circle cx={182 * S} cy={210 * S} r={4 * S} fill="#ef4444" opacity={0.6} />
      {/* Pan */}
      <ellipse cx={205 * S} cy={208 * S} rx={9 * S} ry={5 * S} fill="#2d3748" stroke={O} strokeWidth={2} />
      <rect x={213 * S} y={205 * S} width={15 * S} height={4 * S} rx={2} fill="#4a5568" stroke={O} strokeWidth={1.5} />

      {/* Fridge */}
      <rect x={290 * S} y={155 * S} width={55 * S} height={105 * S} rx={5} fill="#e2e8f0" stroke={O} strokeWidth={SW} />
      <rect x={290 * S} y={155 * S} width={55 * S} height={40 * S} rx={5} fill="#cbd5e1" stroke={O} strokeWidth={SW} />
      <rect x={335 * S} y={170 * S} width={4 * S} height={18 * S} rx={2} fill="#94a3b8" stroke={O} strokeWidth={1.5} />
      <rect x={335 * S} y={210 * S} width={4 * S} height={40 * S} rx={2} fill="#94a3b8" stroke={O} strokeWidth={1.5} />
      {/* Fridge magnets */}
      <circle cx={302 * S} cy={165 * S} r={3 * S} fill="#ef4444" stroke={O} strokeWidth={1} />
      <circle cx={312 * S} cy={162 * S} r={3 * S} fill="#3b82f6" stroke={O} strokeWidth={1} />
      <rect x={298 * S} y={172 * S} width={18 * S} height={12 * S} rx={1} fill="#fef08a" stroke={O} strokeWidth={1} />

      {/* Kitchen island / table */}
      <rect x={120 * S} y={275 * S} width={80 * S} height={30 * S} rx={5} fill="#b87333" stroke={O} strokeWidth={SW} />
      <rect x={130 * S} y={272 * S} width={12 * S} height={5 * S} rx={2} fill="#ef4444" stroke={O} strokeWidth={1.5} />
      <circle cx={175 * S} cy={280 * S} r={8 * S} fill="#fef08a" stroke={O} strokeWidth={1.5} />

      {/* Hanging pots */}
      <ellipse cx={100 * S} cy={160 * S} rx={12 * S} ry={7 * S} fill="#8b6f47" stroke={O} strokeWidth={2} />
      <rect x={96 * S} y={148 * S} width={3 * S} height={12 * S} fill="#718096" />
      <ellipse cx={130 * S} cy={155 * S} rx={10 * S} ry={6 * S} fill="#c87533" stroke={O} strokeWidth={2} />
      <rect x={127 * S} y={145 * S} width={3 * S} height={10 * S} fill="#718096" />

      {/* Window */}
      <rect x={240 * S} y={160 * S} width={40 * S} height={35 * S} rx={3} fill="#87ceeb" stroke={O} strokeWidth={SW} />
      <rect x={259 * S} y={160 * S} width={2 * S} height={35 * S} fill={O} />
      <rect x={240 * S} y={176 * S} width={40 * S} height={2 * S} fill={O} />
      {/* Curtains */}
      <path d={`M ${240 * S} ${158 * S} Q ${248 * S} ${168 * S} ${240 * S} ${178 * S}`} fill="#fca5a5" stroke={O} strokeWidth={1.5} />
      <path d={`M ${280 * S} ${158 * S} Q ${272 * S} ${168 * S} ${280 * S} ${178 * S}`} fill="#fca5a5" stroke={O} strokeWidth={1.5} />
    </g>
  )
}

function MasterBedroom() {
  return (
    <g>
      {/* Bed */}
      <rect x={80 * S} y={210 * S} width={130 * S} height={70 * S} rx={5} fill="#e9d5ff" stroke={O} strokeWidth={SW} />
      <rect x={75 * S} y={200 * S} width={140 * S} height={18 * S} rx={8} fill="#c4b5fd" stroke={O} strokeWidth={SW} />
      {/* Pillows */}
      <ellipse cx={115 * S} cy={215 * S} rx={20 * S} ry={10 * S} fill="#fff" stroke={O} strokeWidth={2} />
      <ellipse cx={175 * S} cy={215 * S} rx={20 * S} ry={10 * S} fill="#fff" stroke={O} strokeWidth={2} />
      {/* Blanket */}
      <rect x={85 * S} y={240 * S} width={120 * S} height={35 * S} rx={4} fill="#a78bfa" stroke={O} strokeWidth={2} />
      <path d={`M ${85 * S} ${255 * S} Q ${145 * S} ${248 * S} ${205 * S} ${255 * S}`} fill="#8b5cf6" stroke="none" opacity={0.3} />

      {/* Nightstands */}
      <rect x={40 * S} y={230 * S} width={30 * S} height={35 * S} rx={3} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      <rect x={220 * S} y={230 * S} width={30 * S} height={35 * S} rx={3} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      {/* Lamps */}
      <rect x={52 * S} y={218 * S} width={4 * S} height={14 * S} fill="#d4a76a" stroke={O} strokeWidth={1.5} />
      <ellipse cx={54 * S} cy={214 * S} rx={10 * S} ry={7 * S} fill="#fef08a" stroke={O} strokeWidth={2} />
      <rect x={232 * S} y={218 * S} width={4 * S} height={14 * S} fill="#d4a76a" stroke={O} strokeWidth={1.5} />
      <ellipse cx={234 * S} cy={214 * S} rx={10 * S} ry={7 * S} fill="#fef08a" stroke={O} strokeWidth={2} />

      {/* Wardrobe */}
      <rect x={290 * S} y={170 * S} width={55 * S} height={95 * S} rx={4} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      <rect x={292 * S} y={175 * S} width={24 * S} height={85 * S} rx={2} fill="#a0845c" stroke={O} strokeWidth={2} />
      <rect x={318 * S} y={175 * S} width={24 * S} height={85 * S} rx={2} fill="#a0845c" stroke={O} strokeWidth={2} />
      <circle cx={314 * S} cy={220 * S} r={2 * S} fill={O} />
      <circle cx={320 * S} cy={220 * S} r={2 * S} fill={O} />

      {/* Dresser */}
      <rect x={10 * S} y={210 * S} width={25 * S} height={55 * S} rx={3} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      <rect x={12 * S} y={215 * S} width={21 * S} height={10 * S} rx={2} fill="#a0845c" stroke={O} strokeWidth={1.5} />
      <rect x={12 * S} y={228 * S} width={21 * S} height={10 * S} rx={2} fill="#a0845c" stroke={O} strokeWidth={1.5} />
      <rect x={12 * S} y={241 * S} width={21 * S} height={10 * S} rx={2} fill="#a0845c" stroke={O} strokeWidth={1.5} />
      {/* Mirror */}
      <ellipse cx={22 * S} cy={190 * S} rx={14 * S} ry={20 * S} fill="#bfdbfe" stroke={O} strokeWidth={SW} />
      <ellipse cx={22 * S} cy={190 * S} rx={10 * S} ry={16 * S} fill="#dbeafe" stroke="none" opacity={0.5} />

      {/* Rug */}
      <ellipse cx={145 * S} cy={290 * S} rx={70 * S} ry={16 * S} fill="#c4b5fd" stroke={O} strokeWidth={2} opacity={0.6} />

      {/* Picture */}
      <rect x={120 * S} y={160 * S} width={50 * S} height={30 * S} rx={2} fill="#fbbf24" stroke={O} strokeWidth={SW} />
      <circle cx={135 * S} cy={170 * S} r={5 * S} fill="#f87171" />
      <circle cx={155 * S} cy={172 * S} r={4 * S} fill="#60a5fa" />
    </g>
  )
}

function KidsBedroom() {
  return (
    <g>
      {/* Bed 1 — pink */}
      <rect x={30 * S} y={210 * S} width={90 * S} height={55 * S} rx={5} fill="#fce7f3" stroke={O} strokeWidth={SW} />
      <rect x={25 * S} y={200 * S} width={100 * S} height={16 * S} rx={8} fill="#f9a8d4" stroke={O} strokeWidth={SW} />
      <ellipse cx={55 * S} cy={212 * S} rx={16 * S} ry={8 * S} fill="#fff" stroke={O} strokeWidth={2} />
      <rect x={35 * S} y={230 * S} width={80 * S} height={30 * S} rx={3} fill="#ec4899" stroke={O} strokeWidth={2} />
      {/* Stars on blanket */}
      <text x={55 * S} y={250 * S} fontSize={14 * S} fill="#fce7f3">★</text>
      <text x={80 * S} y={248 * S} fontSize={10 * S} fill="#fce7f3">★</text>

      {/* Bed 2 — purple */}
      <rect x={230 * S} y={210 * S} width={90 * S} height={55 * S} rx={5} fill="#f5f3ff" stroke={O} strokeWidth={SW} />
      <rect x={225 * S} y={200 * S} width={100 * S} height={16 * S} rx={8} fill="#c4b5fd" stroke={O} strokeWidth={SW} />
      <ellipse cx={255 * S} cy={212 * S} rx={16 * S} ry={8 * S} fill="#fff" stroke={O} strokeWidth={2} />
      <rect x={235 * S} y={230 * S} width={80 * S} height={30 * S} rx={3} fill="#8b5cf6" stroke={O} strokeWidth={2} />
      <text x={260 * S} y={250 * S} fontSize={12 * S} fill="#e9d5ff">♥</text>
      <text x={285 * S} y={248 * S} fontSize={10 * S} fill="#e9d5ff">♥</text>

      {/* Toy box */}
      <rect x={150 * S} y={270 * S} width={50 * S} height={30 * S} rx={5} fill="#fbbf24" stroke={O} strokeWidth={SW} />
      <rect x={150 * S} y={265 * S} width={50 * S} height={10 * S} rx={5} fill="#f59e0b" stroke={O} strokeWidth={SW} />
      <text x={162 * S} y={290 * S} fontSize={8 * S} fill={O} fontWeight="bold" fontFamily="sans-serif">TOYS</text>

      {/* Stuffed animals */}
      <circle cx={135 * S} cy={268 * S} r={8 * S} fill="#fca5a5" stroke={O} strokeWidth={2} />
      <circle cx={132 * S} cy={264 * S} r={3 * S} fill="#fca5a5" stroke={O} strokeWidth={1} />
      <circle cx={138 * S} cy={264 * S} r={3 * S} fill="#fca5a5" stroke={O} strokeWidth={1} />
      <circle cx={133 * S} cy={267 * S} r={1.5 * S} fill={O} />
      <circle cx={137 * S} cy={267 * S} r={1.5 * S} fill={O} />

      {/* Bookshelf */}
      <rect x={5 * S} y={180 * S} width={18 * S} height={80 * S} rx={2} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      <rect x={7 * S} y={185 * S} width={14 * S} height={3 * S} fill="#7a5f3a" />
      <rect x={7 * S} y={205 * S} width={14 * S} height={3 * S} fill="#7a5f3a" />
      <rect x={8 * S} y={189 * S} width={4 * S} height={15 * S} rx={1} fill="#ef4444" stroke={O} strokeWidth={0.8} />
      <rect x={13 * S} y={190 * S} width={4 * S} height={14 * S} rx={1} fill="#3b82f6" stroke={O} strokeWidth={0.8} />

      {/* Poster on wall */}
      <rect x={150 * S} y={160 * S} width={50 * S} height={35 * S} rx={3} fill="#bfdbfe" stroke={O} strokeWidth={SW} />
      <circle cx={175 * S} cy={172 * S} r={8 * S} fill="#fde047" stroke={O} strokeWidth={1.5} />
      <text x={164 * S} y={192 * S} fontSize={5 * S} fill={O} fontWeight="bold" fontFamily="sans-serif">DREAM BIG</text>

      {/* Rug */}
      <ellipse cx={175 * S} cy={295 * S} rx={65 * S} ry={12 * S} fill="#f9a8d4" stroke={O} strokeWidth={2} opacity={0.5} />
    </g>
  )
}

function Bathroom() {
  return (
    <g>
      {/* Bathtub */}
      <ellipse cx={90 * S} cy={230 * S} rx={65 * S} ry={30 * S} fill="#fff" stroke={O} strokeWidth={SW} />
      <ellipse cx={90 * S} cy={225 * S} rx={55 * S} ry={22 * S} fill="#bfdbfe" stroke="none" />
      {/* Bubbles */}
      <circle cx={60 * S} cy={215 * S} r={6 * S} fill="#fff" stroke="#93c5fd" strokeWidth={1} opacity={0.8} />
      <circle cx={75 * S} cy={208 * S} r={8 * S} fill="#fff" stroke="#93c5fd" strokeWidth={1} opacity={0.8} />
      <circle cx={95 * S} cy={212 * S} r={5 * S} fill="#fff" stroke="#93c5fd" strokeWidth={1} opacity={0.8} />
      <circle cx={110 * S} cy={206 * S} r={7 * S} fill="#fff" stroke="#93c5fd" strokeWidth={1} opacity={0.8} />
      <circle cx={83 * S} cy={200 * S} r={4 * S} fill="#fff" stroke="#93c5fd" strokeWidth={1} opacity={0.6} />
      {/* Faucet */}
      <rect x={30 * S} y={205 * S} width={6 * S} height={20 * S} rx={3} fill="#c0c0c0" stroke={O} strokeWidth={2} />
      <rect x={25 * S} y={200 * S} width={16 * S} height={8 * S} rx={4} fill="#d4d4d8" stroke={O} strokeWidth={2} />

      {/* Sink */}
      <rect x={250 * S} y={200 * S} width={60 * S} height={45 * S} rx={5} fill="#f5f5f5" stroke={O} strokeWidth={SW} />
      <ellipse cx={280 * S} cy={220 * S} rx={20 * S} ry={12 * S} fill="#e0f2fe" stroke={O} strokeWidth={2} />
      <rect x={277 * S} y={195 * S} width={6 * S} height={12 * S} rx={3} fill="#c0c0c0" stroke={O} strokeWidth={1.5} />
      {/* Mirror */}
      <ellipse cx={280 * S} cy={175 * S} rx={22 * S} ry={28 * S} fill="#bfdbfe" stroke={O} strokeWidth={SW} />
      <ellipse cx={280 * S} cy={175 * S} rx={17 * S} ry={22 * S} fill="#dbeafe" stroke="none" opacity={0.5} />

      {/* Toilet */}
      <ellipse cx={340 * S} cy={238 * S} rx={16 * S} ry={20 * S} fill="#fff" stroke={O} strokeWidth={SW} />
      <rect x={326 * S} y={210 * S} width={28 * S} height={15 * S} rx={5} fill="#f5f5f5" stroke={O} strokeWidth={SW} />
      <rect x={332 * S} y={205 * S} width={16 * S} height={8 * S} rx={3} fill="#e2e8f0" stroke={O} strokeWidth={2} />

      {/* Towel rack */}
      <rect x={190 * S} y={175 * S} width={40 * S} height={3 * S} rx={1.5} fill="#94a3b8" stroke={O} strokeWidth={1.5} />
      <rect x={195 * S} y={178 * S} width={30 * S} height={25 * S} rx={2} fill="#fca5a5" stroke={O} strokeWidth={2} />

      {/* Bath mat */}
      <ellipse cx={90 * S} cy={268 * S} rx={40 * S} ry={8 * S} fill="#86efac" stroke={O} strokeWidth={2} />

      {/* Rubber duck */}
      <circle cx={120 * S} cy={215 * S} r={5 * S} fill="#fde047" stroke={O} strokeWidth={1.5} />
      <circle cx={123 * S} cy={212 * S} r={3 * S} fill="#fde047" stroke={O} strokeWidth={1} />
      <circle cx={124 * S} cy={211 * S} r={1 * S} fill={O} />
      <rect x={124 * S} y={212 * S} width={4 * S} height={2 * S} rx={1} fill="#f97316" stroke={O} strokeWidth={0.8} />
    </g>
  )
}

function DiningRoom() {
  return (
    <g>
      {/* Table */}
      <rect x={100 * S} y={220 * S} width={150 * S} height={50 * S} rx={8} fill="#b87333" stroke={O} strokeWidth={SW} />
      {/* Table legs */}
      <rect x={110 * S} y={270 * S} width={6 * S} height={25 * S} fill="#a0845c" stroke={O} strokeWidth={1.5} />
      <rect x={234 * S} y={270 * S} width={6 * S} height={25 * S} fill="#a0845c" stroke={O} strokeWidth={1.5} />

      {/* Plates */}
      <ellipse cx={135 * S} cy={235 * S} rx={14 * S} ry={8 * S} fill="#fff" stroke={O} strokeWidth={1.5} />
      <ellipse cx={175 * S} cy={235 * S} rx={14 * S} ry={8 * S} fill="#fff" stroke={O} strokeWidth={1.5} />
      <ellipse cx={215 * S} cy={235 * S} rx={14 * S} ry={8 * S} fill="#fff" stroke={O} strokeWidth={1.5} />
      <ellipse cx={155 * S} cy={255 * S} rx={14 * S} ry={8 * S} fill="#fff" stroke={O} strokeWidth={1.5} />
      <ellipse cx={195 * S} cy={255 * S} rx={14 * S} ry={8 * S} fill="#fff" stroke={O} strokeWidth={1.5} />
      {/* Centerpiece */}
      <rect x={168 * S} y={240 * S} width={14 * S} height={8 * S} rx={3} fill="#86efac" stroke={O} strokeWidth={1.5} />
      <circle cx={172 * S} cy={236 * S} r={4 * S} fill="#ef4444" />
      <circle cx={178 * S} cy={234 * S} r={3 * S} fill="#fbbf24" />

      {/* Chairs — left side */}
      <rect x={85 * S} y={225 * S} width={15 * S} height={18 * S} rx={3} fill="#92400e" stroke={O} strokeWidth={2} />
      <rect x={85 * S} y={210 * S} width={15 * S} height={18 * S} rx={3} fill="#a0845c" stroke={O} strokeWidth={2} />
      {/* Chairs — right side */}
      <rect x={250 * S} y={225 * S} width={15 * S} height={18 * S} rx={3} fill="#92400e" stroke={O} strokeWidth={2} />
      <rect x={250 * S} y={210 * S} width={15 * S} height={18 * S} rx={3} fill="#a0845c" stroke={O} strokeWidth={2} />
      {/* Chairs — top */}
      <rect x={125 * S} y={205 * S} width={18 * S} height={15 * S} rx={3} fill="#92400e" stroke={O} strokeWidth={2} />
      <rect x={207 * S} y={205 * S} width={18 * S} height={15 * S} rx={3} fill="#92400e" stroke={O} strokeWidth={2} />

      {/* China cabinet */}
      <rect x={10 * S} y={165 * S} width={55 * S} height={100 * S} rx={4} fill="#8b6f47" stroke={O} strokeWidth={SW} />
      <rect x={14 * S} y={170 * S} width={47 * S} height={40 * S} rx={2} fill="#bfdbfe" stroke={O} strokeWidth={2} opacity={0.4} />
      {/* Dishes visible through glass */}
      <ellipse cx={27 * S} cy={182 * S} rx={8 * S} ry={3 * S} fill="#fff" stroke={O} strokeWidth={1} />
      <ellipse cx={48 * S} cy={182 * S} rx={8 * S} ry={3 * S} fill="#fff" stroke={O} strokeWidth={1} />
      <ellipse cx={37 * S} cy={196 * S} rx={8 * S} ry={3 * S} fill="#fef3c7" stroke={O} strokeWidth={1} />

      {/* Chandelier */}
      <rect x={170 * S} y={150 * S} width={4 * S} height={15 * S} fill="#d4a76a" stroke={O} strokeWidth={1} />
      <ellipse cx={172 * S} cy={166 * S} rx={20 * S} ry={6 * S} fill="#fbbf24" stroke={O} strokeWidth={2} />
      <circle cx={160 * S} cy={168 * S} r={3 * S} fill="#fef08a" opacity={0.8} />
      <circle cx={172 * S} cy={169 * S} r={3 * S} fill="#fef08a" opacity={0.8} />
      <circle cx={184 * S} cy={168 * S} r={3 * S} fill="#fef08a" opacity={0.8} />

      {/* Rug */}
      <ellipse cx={175 * S} cy={295 * S} rx={75 * S} ry={14 * S} fill="#d97706" stroke={O} strokeWidth={2} opacity={0.4} />
    </g>
  )
}

const ROOM_RENDERERS: Record<RoomName, () => JSX.Element> = {
  'living-room': LivingRoom,
  kitchen: Kitchen,
  'bedroom-1': MasterBedroom,
  'bedroom-2': KidsBedroom,
  bathroom: Bathroom,
  'dining-room': DiningRoom,
}

function CartoonRoom({ room }: { room: RoomName }) {
  const config = ROOMS[room]
  const Furniture = ROOM_RENDERERS[room]
  const VB_W = 375 * S
  const VB_H = 320 * S

  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ width: '100%', height: '100%', display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Wall */}
      <rect x={0} y={0} width={VB_W} height={VB_H * 0.6} fill={config.wallColor} />
      {/* Baseboard */}
      <rect x={0} y={VB_H * 0.58} width={VB_W} height={VB_H * 0.04} fill="#f5f0e6" stroke={O} strokeWidth={2} />
      {/* Floor */}
      <rect x={0} y={VB_H * 0.6} width={VB_W} height={VB_H * 0.4} fill={config.floorColor} />
      {/* Floor planks / tile lines */}
      {config.floorPattern && (
        <g opacity={0.3}>
          {Array.from({ length: 8 }, (_, i) => (
            <line
              key={i}
              x1={0}
              y1={VB_H * 0.6 + (i + 1) * (VB_H * 0.4 / 9)}
              x2={VB_W}
              y2={VB_H * 0.6 + (i + 1) * (VB_H * 0.4 / 9)}
              stroke={config.floorPattern}
              strokeWidth={1.5}
            />
          ))}
        </g>
      )}

      {/* Wall trim / crown molding */}
      <rect x={0} y={0} width={VB_W} height={4 * S} fill="#f5ebe0" stroke={O} strokeWidth={1} />

      <Furniture />
    </svg>
  )
}

function RoomTabs({ current, onChange, accentColor }: { current: RoomName; onChange: (r: RoomName) => void; accentColor: string }) {
  return (
    <div style={{
      display: 'flex', gap: 6, padding: '10px 20px', flexWrap: 'wrap',
      background: 'rgba(0,0,0,0.25)', backdropFilter: 'blur(6px)',
    }}>
      {ROOM_ORDER.map((r) => {
        const active = r === current
        return (
          <button key={r} type="button" onClick={() => onChange(r)} style={{
            padding: '7px 16px', fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
            fontSize: '0.8rem', fontWeight: 700,
            color: active ? '#fff' : 'rgba(255,255,255,0.75)',
            background: active ? accentColor : 'rgba(255,255,255,0.1)',
            border: `3px solid ${active ? '#fff' : 'rgba(255,255,255,0.2)'}`,
            borderRadius: 20, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
            boxShadow: active ? '0 3px 10px rgba(0,0,0,0.3)' : 'none',
          }}>
            {ROOMS[r].name}
          </button>
        )
      })}
    </div>
  )
}

interface HouseInteriorProps {
  houseIndex: number
  houseColor: string
  onExit: () => void
}

export function HouseInterior({ houseIndex, houseColor, onExit }: HouseInteriorProps) {
  const [currentRoom, setCurrentRoom] = useState<RoomName>('living-room')
  const config = ROOMS[currentRoom]
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700

  const handleRoomChange = useCallback((r: RoomName) => setCurrentRoom(r), [])

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#2d2d3a', overflow: 'hidden', zIndex: 200 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentRoom}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <CartoonRoom room={currentRoom} />
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
          fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
          color: config.accentColor, background: '#fff', border: '3px solid #fff',
          borderRadius: 12, cursor: 'pointer',
        }}>
          ← Leave House
        </button>
        <h1 style={{
          margin: 0, fontSize: '1.3rem', fontWeight: 700, color: '#fff',
          fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
          textShadow: '2px 2px 0 rgba(0,0,0,0.2)',
        }}>
          House {houseIndex + 1} — {config.name}
        </h1>
        <div style={{
          marginLeft: 'auto', width: 22, height: 22, borderRadius: 6,
          background: houseColor, border: '3px solid #fff',
        }} />
      </div>

      {/* Room tabs */}
      <div style={{ position: 'absolute', top: 52, left: 0, right: 0, zIndex: 40 }}>
        <RoomTabs current={currentRoom} onChange={handleRoomChange} accentColor={config.accentColor} />
      </div>

      {/* People overlay */}
      <div style={{ position: 'absolute', inset: 0, top: 100, pointerEvents: 'none', zIndex: 20 }}>
        {config.people.map((p, i) => (
          <div key={`${currentRoom}-${i}`} style={{
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
          padding: '10px 24px',
          fontFamily: "'Comic Sans MS', 'Chalkboard SE', cursive",
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
