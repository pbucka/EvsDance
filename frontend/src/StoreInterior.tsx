import { useState, useCallback } from 'react'
import { Draggable } from './Draggable'
import { CartoonPerson, type SkinTone, type HairStyle } from './CartoonPerson'
import './StoreInterior.css'

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

function makeCustomers(defs: Omit<PersonDef, 'x' | 'y'>[], startX: number, startY: number): PersonDef[] {
  return defs.map((d, i) => ({
    ...d,
    x: startX + i * 80,
    y: startY + (i % 2) * 20,
  }))
}

/* ----------------------------------------------------------------
   Themed store configs
   ---------------------------------------------------------------- */

interface StoreConfig {
  title: string
  bgColor: string
  accentColor: string
  floorStyle: string
  wallStyle: string
  ceilingStyle: string
  renderContent: (vw: number, vh: number) => React.ReactNode
  customers: PersonDef[]
  staff: PersonDef[]
}

function getStoreConfig(name: string, vw: number, vh: number): StoreConfig {
  switch (name) {
    case 'BURGER':
      return {
        title: "Burger Joint",
        bgColor: '#2d1a0e',
        accentColor: '#dc2626',
        floorStyle: 'store-floor-tile-red',
        wallStyle: 'store-wall-warm',
        ceilingStyle: 'store-ceiling-dark',
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'light', hairStyle: 'bob', hairColor: '#f5d076', topColor: '#3b82f6', bottomColor: '#1e293b' },
          { label: 'Customer', skinTone: 'dark', hairStyle: 'wavy', hairColor: '#1a1a2e', topColor: '#ef4444', bottomColor: '#374151' },
          { label: 'Customer', skinTone: 'tan', hairStyle: 'long', hairColor: '#5c4033', topColor: '#22c55e', bottomColor: '#1e293b' },
        ], vw * 0.5, vh * 0.55),
        staff: [
          { label: 'Cashier', skinTone: 'medium', hairStyle: 'bun', hairColor: '#1a1a2e', topColor: '#dc2626', bottomColor: '#1e293b', x: vw * 0.18, y: vh * 0.25 },
          { label: 'Cook', skinTone: 'light', hairStyle: 'bob', hairColor: '#92400e', topColor: '#fff', bottomColor: '#1e293b', x: vw * 0.08, y: vh * 0.25 },
        ],
        renderContent: () => (
          <>
            <div className="si-counter si-burger-counter">
              <div className="si-counter-top" />
              <div className="si-register" />
              <div className="si-menu-board">
                <div className="si-menu-title">MENU</div>
                <div className="si-menu-item">Classic Burger . . . $8.99</div>
                <div className="si-menu-item">Cheeseburger . . . $9.99</div>
                <div className="si-menu-item">Fries . . . . . . . $3.99</div>
                <div className="si-menu-item">Milkshake . . . . . $5.99</div>
                <div className="si-menu-item">Combo Meal . . . . $12.99</div>
              </div>
            </div>
            <div className="si-seating">
              <div className="si-booth si-booth-1" />
              <div className="si-booth si-booth-2" />
              <div className="si-booth si-booth-3" />
              <div className="si-booth si-booth-4" />
            </div>
          </>
        ),
      }

    case 'COFFEE':
      return {
        title: "Coffee House",
        bgColor: '#1a120e',
        accentColor: '#92400e',
        floorStyle: 'store-floor-wood',
        wallStyle: 'store-wall-coffee',
        ceilingStyle: 'store-ceiling-exposed',
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'light', hairStyle: 'long', hairColor: '#c084fc', topColor: '#f5f3ff', bottomColor: '#6366f1' },
          { label: 'Customer', skinTone: 'medium', hairStyle: 'bob', hairColor: '#1a1a2e', topColor: '#fbbf24', bottomColor: '#1e293b' },
        ], vw * 0.55, vh * 0.55),
        staff: [
          { label: 'Barista', skinTone: 'tan', hairStyle: 'bun', hairColor: '#5c4033', topColor: '#166534', bottomColor: '#1e293b', x: vw * 0.15, y: vh * 0.25 },
        ],
        renderContent: () => (
          <>
            <div className="si-counter si-coffee-counter">
              <div className="si-counter-top" />
              <div className="si-espresso-machine" />
              <div className="si-coffee-menu">
                <div className="si-menu-title">COFFEE</div>
                <div className="si-menu-item">Espresso . . . . . $3.50</div>
                <div className="si-menu-item">Latte . . . . . . . $5.00</div>
                <div className="si-menu-item">Cappuccino . . . . $4.75</div>
                <div className="si-menu-item">Mocha . . . . . . . $5.50</div>
                <div className="si-menu-item">Pastry . . . . . . $3.25</div>
              </div>
            </div>
            <div className="si-seating si-coffee-seating">
              <div className="si-cafe-table si-table-1" />
              <div className="si-cafe-table si-table-2" />
              <div className="si-cafe-table si-table-3" />
            </div>
          </>
        ),
      }

    case 'TARGET':
      return {
        title: "Target",
        bgColor: '#1a0e0e',
        accentColor: '#dc2626',
        floorStyle: 'store-floor-tile-white',
        wallStyle: 'store-wall-target',
        ceilingStyle: 'store-ceiling-warehouse',
        customers: makeCustomers([
          { label: 'Shopper', skinTone: 'light', hairStyle: 'pigtails', hairColor: '#f5d076', topColor: '#ec4899', bottomColor: '#1e293b' },
          { label: 'Shopper', skinTone: 'dark', hairStyle: 'bob', hairColor: '#1a1a2e', topColor: '#2563eb', bottomColor: '#374151' },
          { label: 'Shopper', skinTone: 'medium', hairStyle: 'long', hairColor: '#5c4033', topColor: '#16a34a', bottomColor: '#1e293b' },
        ], vw * 0.45, vh * 0.55),
        staff: [
          { label: 'Cashier', skinTone: 'light', hairStyle: 'bob', hairColor: '#92400e', topColor: '#dc2626', bottomColor: '#1e293b', x: vw * 0.12, y: vh * 0.3 },
        ],
        renderContent: () => (
          <>
            <div className="si-aisles">
              <div className="si-aisle">
                <div className="si-aisle-sign">Electronics</div>
                <div className="si-shelf" /><div className="si-shelf" /><div className="si-shelf" />
              </div>
              <div className="si-aisle">
                <div className="si-aisle-sign">Clothing</div>
                <div className="si-shelf" /><div className="si-shelf" /><div className="si-shelf" />
              </div>
              <div className="si-aisle">
                <div className="si-aisle-sign">Home</div>
                <div className="si-shelf" /><div className="si-shelf" /><div className="si-shelf" />
              </div>
            </div>
            <div className="si-checkout">
              <div className="si-checkout-lane" />
              <div className="si-checkout-lane" />
              <div className="si-register" />
            </div>
          </>
        ),
      }

    case 'HARDWARE':
      return {
        title: "Hardware Store",
        bgColor: '#1a1a0e',
        accentColor: '#f59e0b',
        floorStyle: 'store-floor-concrete',
        wallStyle: 'store-wall-hardware',
        ceilingStyle: 'store-ceiling-warehouse',
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'tan', hairStyle: 'bob', hairColor: '#5c4033', topColor: '#f97316', bottomColor: '#374151' },
          { label: 'Customer', skinTone: 'light', hairStyle: 'wavy', hairColor: '#92400e', topColor: '#3b82f6', bottomColor: '#1e293b' },
        ], vw * 0.5, vh * 0.55),
        staff: [
          { label: 'Associate', skinTone: 'medium', hairStyle: 'bob', hairColor: '#1a1a2e', topColor: '#f59e0b', bottomColor: '#1e293b', x: vw * 0.14, y: vh * 0.28 },
        ],
        renderContent: () => (
          <>
            <div className="si-aisles si-hw-aisles">
              <div className="si-aisle">
                <div className="si-aisle-sign">Tools</div>
                <div className="si-shelf" /><div className="si-shelf" /><div className="si-shelf" />
              </div>
              <div className="si-aisle">
                <div className="si-aisle-sign">Paint</div>
                <div className="si-shelf si-paint-shelf" /><div className="si-shelf si-paint-shelf" />
              </div>
              <div className="si-aisle">
                <div className="si-aisle-sign">Lumber</div>
                <div className="si-shelf" /><div className="si-shelf" />
              </div>
            </div>
            <div className="si-checkout">
              <div className="si-checkout-lane" />
              <div className="si-register" />
            </div>
          </>
        ),
      }

    case 'PHARMACY':
      return {
        title: "Pharmacy",
        bgColor: '#0e1a1a',
        accentColor: '#0ea5e9',
        floorStyle: 'store-floor-tile-white',
        wallStyle: 'store-wall-pharmacy',
        ceilingStyle: 'store-ceiling-bright',
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'light', hairStyle: 'long', hairColor: '#f5d076', topColor: '#f9a8d4', bottomColor: '#1e293b' },
          { label: 'Customer', skinTone: 'dark', hairStyle: 'bun', hairColor: '#1a1a2e', topColor: '#60a5fa', bottomColor: '#374151' },
        ], vw * 0.5, vh * 0.55),
        staff: [
          { label: 'Pharmacist', skinTone: 'light', hairStyle: 'bun', hairColor: '#5c4033', topColor: '#fff', bottomColor: '#0ea5e9', x: vw * 0.15, y: vh * 0.22 },
        ],
        renderContent: () => (
          <>
            <div className="si-counter si-pharmacy-counter">
              <div className="si-counter-top" />
              <div className="si-rx-sign">Rx</div>
              <div className="si-pharmacy-shelves">
                <div className="si-rx-shelf" /><div className="si-rx-shelf" /><div className="si-rx-shelf" />
              </div>
            </div>
            <div className="si-aisles si-pharm-aisles">
              <div className="si-aisle">
                <div className="si-aisle-sign">Health</div>
                <div className="si-shelf" /><div className="si-shelf" />
              </div>
              <div className="si-aisle">
                <div className="si-aisle-sign">Beauty</div>
                <div className="si-shelf" /><div className="si-shelf" />
              </div>
            </div>
          </>
        ),
      }

    case 'PIZZA':
      return {
        title: "Pizza Place",
        bgColor: '#1a0e0a',
        accentColor: '#ea580c',
        floorStyle: 'store-floor-tile-red',
        wallStyle: 'store-wall-pizza',
        ceilingStyle: 'store-ceiling-dark',
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'medium', hairStyle: 'wavy', hairColor: '#1a1a2e', topColor: '#a855f7', bottomColor: '#1e293b' },
          { label: 'Customer', skinTone: 'light', hairStyle: 'pigtails', hairColor: '#f5d076', topColor: '#ec4899', bottomColor: '#374151' },
          { label: 'Customer', skinTone: 'tan', hairStyle: 'bob', hairColor: '#5c4033', topColor: '#34d399', bottomColor: '#1e293b' },
        ], vw * 0.5, vh * 0.55),
        staff: [
          { label: 'Chef', skinTone: 'tan', hairStyle: 'bun', hairColor: '#1a1a2e', topColor: '#fff', bottomColor: '#1e293b', x: vw * 0.1, y: vh * 0.22 },
          { label: 'Cashier', skinTone: 'light', hairStyle: 'long', hairColor: '#92400e', topColor: '#ea580c', bottomColor: '#1e293b', x: vw * 0.22, y: vh * 0.26 },
        ],
        renderContent: () => (
          <>
            <div className="si-counter si-pizza-counter">
              <div className="si-counter-top" />
              <div className="si-pizza-display">
                <div className="si-pizza" /><div className="si-pizza" /><div className="si-pizza" />
              </div>
              <div className="si-pizza-oven" />
              <div className="si-menu-board si-pizza-menu">
                <div className="si-menu-title">PIZZA</div>
                <div className="si-menu-item">Cheese . . . . . . $10.99</div>
                <div className="si-menu-item">Pepperoni . . . . $12.99</div>
                <div className="si-menu-item">Supreme . . . . . $14.99</div>
                <div className="si-menu-item">Slice . . . . . . . $3.50</div>
              </div>
            </div>
            <div className="si-seating">
              <div className="si-booth si-booth-1" />
              <div className="si-booth si-booth-2" />
              <div className="si-booth si-booth-3" />
            </div>
          </>
        ),
      }

    case 'BAKERY':
    default:
      return {
        title: "Bakery",
        bgColor: '#1a150e',
        accentColor: '#d97706',
        floorStyle: 'store-floor-wood',
        wallStyle: 'store-wall-bakery',
        ceilingStyle: 'store-ceiling-cozy',
        customers: makeCustomers([
          { label: 'Customer', skinTone: 'light', hairStyle: 'long', hairColor: '#c084fc', topColor: '#fce7f3', bottomColor: '#8b5cf6' },
          { label: 'Customer', skinTone: 'medium', hairStyle: 'pigtails', hairColor: '#f5d076', topColor: '#fef08a', bottomColor: '#1e293b' },
        ], vw * 0.5, vh * 0.55),
        staff: [
          { label: 'Baker', skinTone: 'light', hairStyle: 'bun', hairColor: '#92400e', topColor: '#fff', bottomColor: '#d97706', x: vw * 0.14, y: vh * 0.24 },
        ],
        renderContent: () => (
          <>
            <div className="si-counter si-bakery-counter">
              <div className="si-counter-top" />
              <div className="si-display-case">
                <div className="si-pastry si-pastry-1" />
                <div className="si-pastry si-pastry-2" />
                <div className="si-pastry si-pastry-3" />
                <div className="si-pastry si-pastry-4" />
              </div>
              <div className="si-menu-board si-bakery-menu">
                <div className="si-menu-title">FRESH BAKED</div>
                <div className="si-menu-item">Croissant . . . . . $3.50</div>
                <div className="si-menu-item">Muffin . . . . . . $2.99</div>
                <div className="si-menu-item">Cake Slice . . . . $5.50</div>
                <div className="si-menu-item">Cookie . . . . . . $1.99</div>
              </div>
            </div>
            <div className="si-seating si-cafe-seating">
              <div className="si-cafe-table si-table-1" />
              <div className="si-cafe-table si-table-2" />
            </div>
          </>
        ),
      }
  }
}

/* ----------------------------------------------------------------
   Main Component
   ---------------------------------------------------------------- */

export function StoreInterior({ storeName, onExit }: StoreInteriorProps) {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const vh = typeof window !== 'undefined' ? window.innerHeight : 700

  const config = getStoreConfig(storeName, vw, vh)

  const allPeople = [...config.staff, ...config.customers]
  const [positions, setPositions] = useState<Record<number, { x: number; y: number }>>(() => {
    const map: Record<number, { x: number; y: number }> = {}
    allPeople.forEach((p, i) => { map[i] = { x: p.x, y: p.y } })
    return map
  })

  const [dancing, setDancing] = useState<Record<number, boolean>>({})

  const clampPerson = useCallback(
    (x: number, y: number) => ({
      x: Math.max(10, Math.min(vw - 50, x)),
      y: Math.max(vh * 0.1, Math.min(vh - 40, y)),
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
    setDancing((prev) => ({ ...prev, [idx]: true }))
    setTimeout(() => setDancing((prev) => ({ ...prev, [idx]: false })), 1600)
  }, [])

  return (
    <div className="vr-interior si-interior" style={{ background: config.bgColor }}>
      <div className="vr-top-bar" style={{ background: `linear-gradient(180deg, ${config.accentColor}ee 0%, ${config.accentColor}cc 100%)` }}>
        <button type="button" className="vr-exit-btn" onClick={onExit}>
          &larr; Leave Store
        </button>
        <h1 className="vr-title">{config.title}</h1>
        <p className="vr-hint">Drag people around &bull; Click to make them dance</p>
      </div>

      <div className="vr-room" style={{ zIndex: 1 }}>
        <div className="vr-room-inner">
          <div className={`vr-ceiling ${config.ceilingStyle}`}>
            <div className="si-light" />
            <div className="si-light" />
            <div className="si-light" />
          </div>
          <div className={`vr-floor ${config.floorStyle}`} />
          <div className={`vr-back-wall ${config.wallStyle}`} />
          <div className="vr-left-wall si-left-wall" />
          <div className="vr-right-wall si-right-wall" />
        </div>
      </div>

      {/* Store-specific content (counters, menus, seating) */}
      <div className="si-content-layer">
        {config.renderContent(vw, vh)}
      </div>

      {/* Draggable people */}
      <div className="si-people-layer">
        {allPeople.map((person, i) => {
          const pos = positions[i] ?? { x: person.x, y: person.y }
          const isDancing = dancing[i]
          const animClass = isDancing ? ['si-dance-sway', 'si-dance-spin', 'si-dance-jump'][i % 3] : ''
          return (
            <Draggable
              key={`${storeName}-${i}`}
              x={pos.x}
              y={pos.y}
              onMove={(x, y) => movePerson(i, x, y)}
              onTap={() => triggerDance(i)}
              className={`si-person ${animClass} ${i < config.staff.length ? 'si-staff' : 'si-customer'}`}
            >
              <CartoonPerson
                label={person.label}
                skinTone={person.skinTone}
                hairStyle={person.hairStyle}
                hairColor={person.hairColor}
                topColor={person.topColor}
                bottomColor={person.bottomColor}
              />
            </Draggable>
          )
        })}
      </div>

      <button type="button" className="vr-back-btn si-back-btn" onClick={onExit}>
        &larr; Back to City
      </button>
    </div>
  )
}
