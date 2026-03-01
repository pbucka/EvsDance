'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { MeshReflectorMaterial, Html } from '@react-three/drei'
import { CartoonPerson, type SkinTone, type HairStyle } from '@/components/characters/CartoonPerson'
import type { Pose } from '@/lib/poses'
import { createDanceTimeline } from '@/lib/gsap-dance'

/* ----------------------------------------------------------------
   Types
   ---------------------------------------------------------------- */

interface StoreInteriorProps {
  storeName: string
  onExit: () => void
}

interface PersonDef {
  label: string
  skinTone: SkinTone
  hairStyle: HairStyle
  hairColor: string
  topColor: string
  bottomColor: string
  x: number
  y: number
}

interface FixtureDef {
  type: 'counter' | 'shelf' | 'booth' | 'table' | 'oven' | 'display' | 'machine' | 'checkout'
  position: [number, number, number]
  size: [number, number, number]
  color: string
}

interface MenuDef {
  title: string
  items: string[]
  position: [number, number, number]
  color: string
  textColor: string
}

interface StoreConfig {
  title: string
  bgColor: string
  accentColor: string
  floorColor: string
  wallColor: string
  ceilingColor: string
  ambientIntensity: number
  lights: { position: [number, number, number]; color: string; intensity: number; angle?: number }[]
  fixtures: FixtureDef[]
  menus: MenuDef[]
  customers: PersonDef[]
  staff: PersonDef[]
}

/* ----------------------------------------------------------------
   Helper
   ---------------------------------------------------------------- */

function makeCustomers(
  defs: Omit<PersonDef, 'x' | 'y'>[],
  startX: number,
  startY: number,
): PersonDef[] {
  return defs.map((d, i) => ({
    ...d,
    x: startX + i * 80,
    y: startY + (i % 2) * 20,
  }))
}

/* ----------------------------------------------------------------
   Store configs
   ---------------------------------------------------------------- */

function getStoreConfig(name: string): StoreConfig {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700

  switch (name) {
    case 'BURGER':
      return {
        title: 'Burger Joint',
        bgColor: '#2d1a0e',
        accentColor: '#dc2626',
        floorColor: '#5c2a0e',
        wallColor: '#8b4513',
        ceilingColor: '#3d1f0e',
        ambientIntensity: 0.3,
        lights: [
          { position: [0, 3.8, 0], color: '#ff9944', intensity: 60, angle: 0.6 },
          { position: [-3, 3.8, -1], color: '#ffaa55', intensity: 40, angle: 0.5 },
          { position: [3, 3.8, -1], color: '#ff8833', intensity: 40, angle: 0.5 },
        ],
        fixtures: [
          { type: 'counter', position: [-3, 0.5, -3], size: [3, 1, 0.8], color: '#7c3a1a' },
          { type: 'shelf', position: [-3, 1.6, -3.8], size: [3, 0.8, 0.3], color: '#4a2a0a' },
          { type: 'booth', position: [2, 0.4, -2], size: [1.2, 0.8, 0.8], color: '#dc2626' },
          { type: 'booth', position: [2, 0.4, 0], size: [1.2, 0.8, 0.8], color: '#dc2626' },
          { type: 'booth', position: [2, 0.4, 2], size: [1.2, 0.8, 0.8], color: '#dc2626' },
        ],
        menus: [
          {
            title: 'MENU',
            items: ['Classic Burger . . . $8.99', 'Cheeseburger . . . $9.99', 'Fries . . . . . . . $3.99', 'Milkshake . . . . . $5.99', 'Combo Meal . . . . $12.99'],
            position: [-3, 2.8, -3.9],
            color: '#1a0a00',
            textColor: '#ffd700',
          },
        ],
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'light', hairStyle: 'bob', hairColor: '#f5d076', topColor: '#3b82f6', bottomColor: '#1e293b' },
          { label: 'Customer', skinTone: 'dark', hairStyle: 'wavy', hairColor: '#1a1a2e', topColor: '#ef4444', bottomColor: '#374151' },
          { label: 'Customer', skinTone: 'tan', hairStyle: 'long', hairColor: '#5c4033', topColor: '#22c55e', bottomColor: '#1e293b' },
        ], vw * 0.5, vh * 0.55),
        staff: [
          { label: 'Cashier', skinTone: 'medium', hairStyle: 'bun', hairColor: '#1a1a2e', topColor: '#dc2626', bottomColor: '#1e293b', x: vw * 0.18, y: vh * 0.25 },
          { label: 'Cook', skinTone: 'light', hairStyle: 'bob', hairColor: '#92400e', topColor: '#fff', bottomColor: '#1e293b', x: vw * 0.08, y: vh * 0.25 },
        ],
      }

    case 'COFFEE':
      return {
        title: 'Coffee House',
        bgColor: '#1a120e',
        accentColor: '#92400e',
        floorColor: '#5c3a1e',
        wallColor: '#6b4226',
        ceilingColor: '#3a2415',
        ambientIntensity: 0.25,
        lights: [
          { position: [0, 3.8, 0], color: '#ffcc77', intensity: 45, angle: 0.5 },
          { position: [-2, 3.8, 1], color: '#ffbb66', intensity: 30, angle: 0.4 },
          { position: [2, 3.8, -2], color: '#ffaa55', intensity: 30, angle: 0.4 },
        ],
        fixtures: [
          { type: 'counter', position: [-3, 0.5, -3], size: [3, 1, 0.8], color: '#5c3a1e' },
          { type: 'machine', position: [-3.5, 1.2, -3.5], size: [0.5, 0.6, 0.4], color: '#888' },
          { type: 'table', position: [1, 0.35, -1], size: [0.6, 0.7, 0.6], color: '#8b5e3c' },
          { type: 'table', position: [2.5, 0.35, 1], size: [0.6, 0.7, 0.6], color: '#8b5e3c' },
          { type: 'table', position: [0, 0.35, 2], size: [0.6, 0.7, 0.6], color: '#8b5e3c' },
        ],
        menus: [
          {
            title: 'COFFEE',
            items: ['Espresso . . . . . $3.50', 'Latte . . . . . . . $5.00', 'Cappuccino . . . . $4.75', 'Mocha . . . . . . . $5.50', 'Pastry . . . . . . $3.25'],
            position: [-3, 2.8, -3.9],
            color: '#2d1a0e',
            textColor: '#f5deb3',
          },
        ],
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'light', hairStyle: 'long', hairColor: '#c084fc', topColor: '#f5f3ff', bottomColor: '#6366f1' },
          { label: 'Customer', skinTone: 'medium', hairStyle: 'bob', hairColor: '#1a1a2e', topColor: '#fbbf24', bottomColor: '#1e293b' },
        ], vw * 0.55, vh * 0.55),
        staff: [
          { label: 'Barista', skinTone: 'tan', hairStyle: 'bun', hairColor: '#5c4033', topColor: '#166534', bottomColor: '#1e293b', x: vw * 0.15, y: vh * 0.25 },
        ],
      }

    case 'TARGET':
      return {
        title: 'Target',
        bgColor: '#1a0e0e',
        accentColor: '#dc2626',
        floorColor: '#e8e8e8',
        wallColor: '#f5f5f5',
        ceilingColor: '#d4d4d4',
        ambientIntensity: 0.5,
        lights: [
          { position: [0, 3.8, 0], color: '#ffffff', intensity: 80, angle: 0.7 },
          { position: [-3, 3.8, 0], color: '#ffffff', intensity: 50, angle: 0.6 },
          { position: [3, 3.8, 0], color: '#ffffff', intensity: 50, angle: 0.6 },
        ],
        fixtures: [
          { type: 'shelf', position: [-2, 1, -2], size: [1, 2, 0.5], color: '#bbb' },
          { type: 'shelf', position: [-2, 1, 0], size: [1, 2, 0.5], color: '#bbb' },
          { type: 'shelf', position: [0, 1, -2], size: [1, 2, 0.5], color: '#bbb' },
          { type: 'shelf', position: [0, 1, 0], size: [1, 2, 0.5], color: '#bbb' },
          { type: 'shelf', position: [2, 1, -2], size: [1, 2, 0.5], color: '#bbb' },
          { type: 'shelf', position: [2, 1, 0], size: [1, 2, 0.5], color: '#bbb' },
          { type: 'checkout', position: [-3, 0.5, 3], size: [2, 1, 0.6], color: '#dc2626' },
        ],
        menus: [],
        customers: makeCustomers([
          { label: 'Shopper', skinTone: 'light', hairStyle: 'pigtails', hairColor: '#f5d076', topColor: '#ec4899', bottomColor: '#1e293b' },
          { label: 'Shopper', skinTone: 'dark', hairStyle: 'bob', hairColor: '#1a1a2e', topColor: '#2563eb', bottomColor: '#374151' },
          { label: 'Shopper', skinTone: 'medium', hairStyle: 'long', hairColor: '#5c4033', topColor: '#16a34a', bottomColor: '#1e293b' },
        ], vw * 0.45, vh * 0.55),
        staff: [
          { label: 'Cashier', skinTone: 'light', hairStyle: 'bob', hairColor: '#92400e', topColor: '#dc2626', bottomColor: '#1e293b', x: vw * 0.12, y: vh * 0.3 },
        ],
      }

    case 'HARDWARE':
      return {
        title: 'Hardware Store',
        bgColor: '#1a1a0e',
        accentColor: '#f59e0b',
        floorColor: '#888888',
        wallColor: '#9ca3af',
        ceilingColor: '#6b7280',
        ambientIntensity: 0.35,
        lights: [
          { position: [0, 3.8, 0], color: '#ffe4a0', intensity: 70, angle: 0.7 },
          { position: [-3, 3.8, -1], color: '#ffd080', intensity: 45, angle: 0.5 },
          { position: [3, 3.8, 1], color: '#ffd080', intensity: 45, angle: 0.5 },
        ],
        fixtures: [
          { type: 'shelf', position: [-2, 1, -2], size: [1, 2, 0.6], color: '#d97706' },
          { type: 'shelf', position: [-2, 1, 0], size: [1, 2, 0.6], color: '#d97706' },
          { type: 'shelf', position: [0, 1, -2], size: [1, 2, 0.6], color: '#92400e' },
          { type: 'shelf', position: [0, 1, 0], size: [1, 2, 0.6], color: '#92400e' },
          { type: 'shelf', position: [2, 1.2, -3], size: [1.5, 2.4, 0.4], color: '#4b5563' },
          { type: 'checkout', position: [-3.5, 0.5, 3], size: [1.5, 1, 0.5], color: '#f59e0b' },
        ],
        menus: [],
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'tan', hairStyle: 'bob', hairColor: '#5c4033', topColor: '#f97316', bottomColor: '#374151' },
          { label: 'Customer', skinTone: 'light', hairStyle: 'wavy', hairColor: '#92400e', topColor: '#3b82f6', bottomColor: '#1e293b' },
        ], vw * 0.5, vh * 0.55),
        staff: [
          { label: 'Associate', skinTone: 'medium', hairStyle: 'bob', hairColor: '#1a1a2e', topColor: '#f59e0b', bottomColor: '#1e293b', x: vw * 0.14, y: vh * 0.28 },
        ],
      }

    case 'PHARMACY':
      return {
        title: 'Pharmacy',
        bgColor: '#0e1a1a',
        accentColor: '#0ea5e9',
        floorColor: '#e0e8ef',
        wallColor: '#d0e0f0',
        ceilingColor: '#f0f4f8',
        ambientIntensity: 0.5,
        lights: [
          { position: [0, 3.8, 0], color: '#ffffff', intensity: 80, angle: 0.7 },
          { position: [-2, 3.8, -2], color: '#e0f0ff', intensity: 50, angle: 0.5 },
          { position: [2, 3.8, 2], color: '#e0f0ff', intensity: 50, angle: 0.5 },
        ],
        fixtures: [
          { type: 'counter', position: [-3, 0.5, -3], size: [3, 1, 0.8], color: '#f0f4f8' },
          { type: 'shelf', position: [-3.2, 1.5, -3.8], size: [2.5, 1.5, 0.3], color: '#c0d0e0' },
          { type: 'shelf', position: [0, 1, -2], size: [1, 2, 0.5], color: '#c0d8e8' },
          { type: 'shelf', position: [0, 1, 0], size: [1, 2, 0.5], color: '#c0d8e8' },
          { type: 'shelf', position: [2, 1, -2], size: [1, 2, 0.5], color: '#c0d8e8' },
          { type: 'shelf', position: [2, 1, 0], size: [1, 2, 0.5], color: '#c0d8e8' },
        ],
        menus: [
          {
            title: 'Rx',
            items: [],
            position: [-3, 2.6, -3.9],
            color: '#0ea5e9',
            textColor: '#ffffff',
          },
        ],
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'light', hairStyle: 'long', hairColor: '#f5d076', topColor: '#f9a8d4', bottomColor: '#1e293b' },
          { label: 'Customer', skinTone: 'dark', hairStyle: 'bun', hairColor: '#1a1a2e', topColor: '#60a5fa', bottomColor: '#374151' },
        ], vw * 0.5, vh * 0.55),
        staff: [
          { label: 'Pharmacist', skinTone: 'light', hairStyle: 'bun', hairColor: '#5c4033', topColor: '#fff', bottomColor: '#0ea5e9', x: vw * 0.15, y: vh * 0.22 },
        ],
      }

    case 'PIZZA':
      return {
        title: 'Pizza Place',
        bgColor: '#1a0e0a',
        accentColor: '#ea580c',
        floorColor: '#6b3a20',
        wallColor: '#a0522d',
        ceilingColor: '#3d2010',
        ambientIntensity: 0.3,
        lights: [
          { position: [0, 3.8, 0], color: '#ffaa55', intensity: 55, angle: 0.6 },
          { position: [-3, 3.8, -2], color: '#ff8833', intensity: 40, angle: 0.5 },
          { position: [2, 3.8, 1], color: '#ffbb66', intensity: 35, angle: 0.4 },
        ],
        fixtures: [
          { type: 'counter', position: [-3, 0.5, -3], size: [3, 1, 0.8], color: '#8b5a2b' },
          { type: 'display', position: [-2.5, 1.1, -3.2], size: [2, 0.15, 0.5], color: '#d4a574' },
          { type: 'oven', position: [-4, 1, -3.5], size: [0.8, 1.2, 0.8], color: '#444' },
          { type: 'booth', position: [2, 0.4, -2], size: [1.2, 0.8, 0.8], color: '#ea580c' },
          { type: 'booth', position: [2, 0.4, 0.5], size: [1.2, 0.8, 0.8], color: '#ea580c' },
          { type: 'booth', position: [2, 0.4, 3], size: [1.2, 0.8, 0.8], color: '#ea580c' },
        ],
        menus: [
          {
            title: 'PIZZA',
            items: ['Cheese . . . . . . $10.99', 'Pepperoni . . . . $12.99', 'Supreme . . . . . $14.99', 'Slice . . . . . . . $3.50'],
            position: [-3, 2.8, -3.9],
            color: '#2d1400',
            textColor: '#ffd700',
          },
        ],
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'medium', hairStyle: 'wavy', hairColor: '#1a1a2e', topColor: '#a855f7', bottomColor: '#1e293b' },
          { label: 'Customer', skinTone: 'light', hairStyle: 'pigtails', hairColor: '#f5d076', topColor: '#ec4899', bottomColor: '#374151' },
          { label: 'Customer', skinTone: 'tan', hairStyle: 'bob', hairColor: '#5c4033', topColor: '#34d399', bottomColor: '#1e293b' },
        ], vw * 0.5, vh * 0.55),
        staff: [
          { label: 'Chef', skinTone: 'tan', hairStyle: 'bun', hairColor: '#1a1a2e', topColor: '#fff', bottomColor: '#1e293b', x: vw * 0.1, y: vh * 0.22 },
          { label: 'Cashier', skinTone: 'light', hairStyle: 'long', hairColor: '#92400e', topColor: '#ea580c', bottomColor: '#1e293b', x: vw * 0.22, y: vh * 0.26 },
        ],
      }

    case 'BAKERY':
    default:
      return {
        title: 'Bakery',
        bgColor: '#1a150e',
        accentColor: '#d97706',
        floorColor: '#6b4f3a',
        wallColor: '#a08060',
        ceilingColor: '#4a3828',
        ambientIntensity: 0.3,
        lights: [
          { position: [0, 3.8, 0], color: '#ffcc88', intensity: 50, angle: 0.5 },
          { position: [-2, 3.8, -1], color: '#ffbb77', intensity: 35, angle: 0.4 },
          { position: [2, 3.8, 1], color: '#ffddaa', intensity: 30, angle: 0.4 },
        ],
        fixtures: [
          { type: 'counter', position: [-3, 0.5, -3], size: [3, 1, 0.8], color: '#8b6f47' },
          { type: 'display', position: [-2.5, 1.05, -3.2], size: [2.2, 0.6, 0.5], color: '#f5e6d3' },
          { type: 'table', position: [1.5, 0.35, 0], size: [0.6, 0.7, 0.6], color: '#8b6f47' },
          { type: 'table', position: [3, 0.35, 2], size: [0.6, 0.7, 0.6], color: '#8b6f47' },
        ],
        menus: [
          {
            title: 'FRESH BAKED',
            items: ['Croissant . . . . . $3.50', 'Muffin . . . . . . $2.99', 'Cake Slice . . . . $5.50', 'Cookie . . . . . . $1.99'],
            position: [-3, 2.8, -3.9],
            color: '#2d1a0a',
            textColor: '#f5deb3',
          },
        ],
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'light', hairStyle: 'long', hairColor: '#c084fc', topColor: '#fce7f3', bottomColor: '#8b5cf6' },
          { label: 'Customer', skinTone: 'medium', hairStyle: 'pigtails', hairColor: '#f5d076', topColor: '#fef08a', bottomColor: '#1e293b' },
        ], vw * 0.5, vh * 0.55),
        staff: [
          { label: 'Baker', skinTone: 'light', hairStyle: 'bun', hairColor: '#92400e', topColor: '#fff', bottomColor: '#d97706', x: vw * 0.14, y: vh * 0.24 },
        ],
      }
  }
}

/* ----------------------------------------------------------------
   3D Scene components
   ---------------------------------------------------------------- */

function StoreFloor({ color }: { color: string }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[12, 12]} />
      <MeshReflectorMaterial
        color={color}
        blur={[300, 100]}
        resolution={512}
        mixBlur={0.8}
        mixStrength={0.3}
        roughness={0.7}
        depthScale={0.5}
        mirror={0.4}
      />
    </mesh>
  )
}

function StoreWalls({ wallColor, ceilingColor }: { wallColor: string; ceilingColor: string }) {
  return (
    <>
      {/* Back wall */}
      <mesh position={[0, 2, -4]} receiveShadow>
        <planeGeometry args={[12, 4]} />
        <meshStandardMaterial color={wallColor} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-6, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color={wallColor} opacity={0.85} transparent />
      </mesh>
      {/* Right wall */}
      <mesh position={[6, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 4]} />
        <meshStandardMaterial color={wallColor} opacity={0.85} transparent />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color={ceilingColor} />
      </mesh>
    </>
  )
}

function StoreLighting({
  ambientIntensity,
  lights,
}: {
  ambientIntensity: number
  lights: StoreConfig['lights']
}) {
  return (
    <>
      <ambientLight intensity={ambientIntensity} />
      {lights.map((light, i) => (
        <spotLight
          key={i}
          position={light.position}
          color={light.color}
          intensity={light.intensity}
          angle={light.angle ?? 0.5}
          penumbra={0.6}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
        />
      ))}
    </>
  )
}

function Fixture({ fixture }: { fixture: FixtureDef }) {
  return (
    <mesh position={fixture.position} castShadow receiveShadow>
      <boxGeometry args={fixture.size} />
      <meshStandardMaterial color={fixture.color} roughness={0.6} />
    </mesh>
  )
}

function MenuBoard({ menu }: { menu: MenuDef }) {
  return (
    <mesh position={menu.position}>
      <planeGeometry args={[2, 1.4]} />
      <meshStandardMaterial color={menu.color} />
      <Html
        transform
        occlude
        position={[0, 0, 0.01]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          style={{
            width: 180,
            padding: '8px 10px',
            fontFamily: 'monospace',
            color: menu.textColor,
            textAlign: 'center',
            fontSize: 11,
            lineHeight: 1.5,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 6, letterSpacing: 2 }}>
            {menu.title}
          </div>
          {menu.items.map((item, i) => (
            <div key={i}>{item}</div>
          ))}
        </div>
      </Html>
    </mesh>
  )
}

/* ----------------------------------------------------------------
   DraggablePerson overlay
   ---------------------------------------------------------------- */

interface DraggablePersonProps {
  person: PersonDef
  x: number
  y: number
  isStaff: boolean
  onMove: (x: number, y: number) => void
  onTap: () => void
  pose?: Pose
}

function DraggablePerson({ person, x, y, isStaff, onMove, onTap, pose }: DraggablePersonProps) {
  const dragging = useRef(false)
  const offset = useRef({ x: 0, y: 0 })
  const moved = useRef(false)

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      dragging.current = true
      moved.current = false
      offset.current = { x: e.clientX - x, y: e.clientY - y }
      ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
    },
    [x, y],
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return
      moved.current = true
      onMove(e.clientX - offset.current.x, e.clientY - offset.current.y)
    },
    [onMove],
  )

  const handlePointerUp = useCallback(() => {
    dragging.current = false
    if (!moved.current) onTap()
  }, [onTap])

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        cursor: 'grab',
        pointerEvents: 'auto',
        touchAction: 'none',
        filter: isStaff ? 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        transform: 'translate(-34px, -50px)',
      }}
    >
      <CartoonPerson
        label={person.label}
        skinTone={person.skinTone}
        hairStyle={person.hairStyle}
        hairColor={person.hairColor}
        topColor={person.topColor}
        bottomColor={person.bottomColor}
        pose={pose}
      />
      <div
        style={{
          textAlign: 'center',
          fontSize: 10,
          color: '#fff',
          textShadow: '0 1px 3px rgba(0,0,0,0.8)',
          marginTop: -4,
          fontWeight: 600,
        }}
      >
        {person.label}
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------
   Main Component
   ---------------------------------------------------------------- */

export function StoreInterior({ storeName, onExit }: StoreInteriorProps) {
  const config = getStoreConfig(storeName)
  const allPeople = [...config.staff, ...config.customers]

  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>(() => {
    const map: Record<number, { x: number; y: number }> = {}
    allPeople.forEach((p, i) => {
      map[i] = { x: p.x, y: p.y }
    })
    return map
  })

  const [soloPoses, setSoloPoses] = useState<Record<number, Pose>>({})
  const timelinesRef = useRef<Record<number, gsap.core.Timeline>>({})

  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700

  const clampPerson = useCallback(
    (x: number, y: number) => ({
      x: Math.max(10, Math.min(vw - 50, x)),
      y: Math.max(52, Math.min(vh - 40, y)),
    }),
    [vw, vh],
  )

  const movePerson = useCallback(
    (idx: number, x: number, y: number) => {
      setPositions((prev) => ({ ...prev, [idx]: clampPerson(x, y) }))
    },
    [clampPerson],
  )

  const triggerDance = useCallback((idx: number) => {
    timelinesRef.current[idx]?.kill()
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
    timelinesRef.current[idx] = tl
  }, [])

  useEffect(() => {
    const tls = timelinesRef.current
    return () => {
      Object.values(tls).forEach((tl) => tl.kill())
    }
  }, [])

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: config.bgColor }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.6, 5], fov: 60 }}
        shadows
        style={{ position: 'absolute', inset: 0 }}
      >
        <StoreLighting ambientIntensity={config.ambientIntensity} lights={config.lights} />
        <StoreFloor color={config.floorColor} />
        <StoreWalls wallColor={config.wallColor} ceilingColor={config.ceilingColor} />
        {config.fixtures.map((f, i) => (
          <Fixture key={i} fixture={f} />
        ))}
        {config.menus.map((m, i) => (
          <MenuBoard key={i} menu={m} />
        ))}
      </Canvas>

      {/* Top bar overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 52,
          background: `linear-gradient(180deg, ${config.accentColor}ee 0%, ${config.accentColor}cc 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 10,
          boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
        }}
      >
        <button
          type="button"
          onClick={onExit}
          style={{
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.3)',
            color: '#fff',
            borderRadius: 8,
            padding: '6px 14px',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          &larr; Leave Store
        </button>
        <h1
          style={{
            color: '#fff',
            fontSize: 20,
            fontWeight: 700,
            margin: 0,
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            letterSpacing: 1,
          }}
        >
          {config.title}
        </h1>
        <p
          style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 12,
            margin: 0,
          }}
        >
          Drag people &bull; Tap to dance
        </p>
      </div>

      {/* Draggable people overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          top: 52,
          pointerEvents: 'none',
          zIndex: 5,
        }}
      >
        {allPeople.map((person, i) => {
          const pos = positions[i] ?? { x: person.x, y: person.y }
          return (
            <DraggablePerson
              key={`${storeName}-${i}`}
              person={person}
              x={pos.x}
              y={pos.y}
              isStaff={i < config.staff.length}
              onMove={(nx, ny) => movePerson(i, nx, ny)}
              onTap={() => triggerDance(i)}
              pose={soloPoses[i]}
            />
          )
        })}
      </div>

      {/* Back to City button */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={onExit}
          style={{
            background: `linear-gradient(135deg, ${config.accentColor}, ${config.accentColor}cc)`,
            border: '2px solid rgba(255,255,255,0.3)',
            color: '#fff',
            borderRadius: 24,
            padding: '10px 28px',
            cursor: 'pointer',
            fontSize: 16,
            fontWeight: 700,
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            letterSpacing: 0.5,
          }}
        >
          &larr; Back to City
        </button>
      </div>
    </div>
  )
}
