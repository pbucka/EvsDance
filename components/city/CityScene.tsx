'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'

gsap.registerPlugin(useGSAP)

import { Neighborhood } from '@/components/city/Neighborhood'
import { StoreFront } from '@/components/city/StoreFront'
import { CartoonCar } from '@/components/vehicles/CartoonCar'
import { MinivanWithFamily } from '@/components/vehicles/MinivanWithFamily'
import { CartoonPerson } from '@/components/characters/CartoonPerson'
import { Draggable } from '@/components/characters/Draggable'

import './CityScene.css'

const DanceStudioInterior = dynamic(
  () =>
    import('@/components/studio/DanceStudioInterior').then((m) => ({
      default: m.DanceStudioInterior,
    })),
  { ssr: false },
)

const StoreInterior = dynamic(
  () =>
    import('@/components/store/StoreInterior').then((m) => ({
      default: m.StoreInterior,
    })),
  { ssr: false },
)

const HouseInterior = dynamic(
  () =>
    import('@/components/city/HouseInterior').then((m) => ({
      default: m.HouseInterior,
    })),
  { ssr: false },
)

const ChurchInterior = dynamic(
  () =>
    import('@/components/city/ChurchInterior').then((m) => ({
      default: m.ChurchInterior,
    })),
  { ssr: false },
)

const AIRPORT_OFFSET = 800
const WORLD_WIDTH = 7000
const VIEWPORT_CENTER_OFFSET = 420
const STUDIO_VIEW_SCROLL_THRESHOLD = 4400 + AIRPORT_OFFSET
const STUDIO_ZONE_LEFT = 4580 + AIRPORT_OFFSET

const NEIGHBORHOOD_LEFT = 200 + AIRPORT_OFFSET
const NEIGHBORHOOD_RIGHT = 2800 + AIRPORT_OFFSET
const BUILDING_COUNT = 8
const BUILDING_SPACING = (NEIGHBORHOOD_RIGHT - NEIGHBORHOOD_LEFT) / BUILDING_COUNT
const CHURCH_SLOT = 4

const HOUSE_COLORS = [
  '#f5deb3', '#faf5ff', '#93c5fd', '#d4a574',
  '#86efac', '#94a3b8', '#fed7aa',
]

const CITY_LEFT = 3000 + AIRPORT_OFFSET
const STORE_START = CITY_LEFT + 20
const STORE_WIDTH = 160
const STORE_GAP = 24
const PARKING_SPOT_COUNT = 8

const STORES = [
  { sign: 'BURGER', signClass: 'sign-burger', facadeClass: 'store-burger' },
  { sign: 'TARGET', signClass: 'sign-target', facadeClass: 'store-target' },
  { sign: 'HARDWARE', signClass: 'sign-hardware', facadeClass: 'store-hardware' },
  { sign: 'COFFEE', signClass: 'sign-coffee', facadeClass: 'store-coffee' },
  { sign: 'PHARMACY', signClass: 'sign-pharmacy', facadeClass: 'store-pharmacy' },
  { sign: 'PIZZA', signClass: 'sign-pizza', facadeClass: 'store-pizza' },
  { sign: 'BAKERY', signClass: 'sign-bakery', facadeClass: 'store-bakery' },
] as const

const PARKED_CARS = [
  { color: '#4b5563', left: '6%', top: '18%' },
  { color: '#1e40af', left: '30%', top: '18%' },
  { color: '#b91c1c', left: '54%', top: '18%' },
  { color: '#15803d', left: '78%', top: '18%' },
  { color: '#c2410c', left: '18%', top: '56%' },
  { color: '#7e22ce', left: '66%', top: '56%' },
] as const

interface Position {
  x: number
  y: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function getNearestBuilding(minivanX: number): { index: number; isChurch: boolean } {
  if (minivanX < NEIGHBORHOOD_LEFT - 100 || minivanX > NEIGHBORHOOD_RIGHT + 100) return { index: -1, isChurch: false }
  let closest = -1
  let minDist = Infinity
  for (let i = 0; i < BUILDING_COUNT; i++) {
    const center = NEIGHBORHOOD_LEFT + i * BUILDING_SPACING + BUILDING_SPACING / 2
    const dist = Math.abs(minivanX - center)
    if (dist < minDist) {
      minDist = dist
      closest = i
    }
  }
  if (minDist > 180) return { index: -1, isChurch: false }
  return { index: closest, isChurch: closest === CHURCH_SLOT }
}

function getNearestStore(minivanX: number): number {
  let closest = -1
  let minDist = Infinity
  for (let i = 0; i < STORES.length; i++) {
    const storeCenter = STORE_START + i * (STORE_WIDTH + STORE_GAP) + STORE_WIDTH / 2
    const dist = Math.abs(minivanX - storeCenter)
    if (dist < minDist) {
      minDist = dist
      closest = i
    }
  }
  return minDist < 200 ? closest : -1
}

function useViewportSize(ref: React.RefObject<HTMLDivElement | null>) {
  const [size, setSize] = useState({ width: 1200, height: 700 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      setSize({ width: el.offsetWidth, height: el.offsetHeight })
    })
    observer.observe(el)
    setSize({ width: el.offsetWidth, height: el.offsetHeight })
    return () => observer.disconnect()
  }, [ref])

  return size
}

export function CityScene() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const worldRef = useRef<HTMLDivElement>(null)
  const { width: viewportWidth, height: viewportHeight } = useViewportSize(viewportRef)

  const roadTop = viewportHeight * 0.5
  const roadBottom = viewportHeight * 0.73

  const [car1, setCar1] = useState<Position>(() => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 700
    return { x: 3100 + AIRPORT_OFFSET, y: vh * 0.56 }
  })
  const [car2, setCar2] = useState<Position>(() => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 700
    return { x: 3800 + AIRPORT_OFFSET, y: vh * 0.56 }
  })
  const [minivan, setMinivan] = useState<Position>(() => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 700
    return { x: 3450 + AIRPORT_OFFSET, y: vh * 0.52 }
  })

  useEffect(() => {
    if (roadTop < 50) return
    const id = requestAnimationFrame(() => {
      setMinivan((prev) => ({ ...prev, y: clamp(prev.y, roadTop, roadBottom) }))
      setCar1((prev) => ({ ...prev, y: clamp(prev.y, roadTop, roadBottom) }))
      setCar2((prev) => ({ ...prev, y: clamp(prev.y, roadTop, roadBottom) }))
    })
    return () => cancelAnimationFrame(id)
  }, [roadTop, roadBottom])

  const [familyOut, setFamilyOut] = useState(false)
  const [momPos, setMomPos] = useState<Position>({ x: 0, y: 0 })
  const [girl1Pos, setGirl1Pos] = useState<Position>({ x: 0, y: 0 })
  const [girl2Pos, setGirl2Pos] = useState<Position>({ x: 0, y: 0 })
  const [insideStudio, setInsideStudio] = useState(false)
  const [insideStore, setInsideStore] = useState<string | null>(null)
  const [insideHouse, setInsideHouse] = useState<number | null>(null)
  const [insideChurch, setInsideChurch] = useState(false)

  const isInStudioZone = minivan.x >= STUDIO_ZONE_LEFT
  const nearStoreIdx = getNearestStore(minivan.x)
  const nearBuilding = getNearestBuilding(minivan.x)
  const isNearStore = nearStoreIdx >= 0
  const isNearHouse = nearBuilding.index >= 0 && !nearBuilding.isChurch
  const isNearChurch = nearBuilding.index >= 0 && nearBuilding.isChurch
  const canGetOut = isInStudioZone || isNearStore || isNearHouse || isNearChurch
  const canEnterStudio = familyOut && isInStudioZone
  const canEnterStore = familyOut && isNearStore && !isInStudioZone
  const canEnterHouse = familyOut && isNearHouse && !isInStudioZone && !isNearStore
  const canEnterChurch = familyOut && isNearChurch && !isInStudioZone && !isNearStore

  const maxScroll = Math.max(0, WORLD_WIDTH - viewportWidth)
  const scrollX = clamp(minivan.x - VIEWPORT_CENTER_OFFSET, 0, maxScroll)
  const isStudioView = scrollX > STUDIO_VIEW_SCROLL_THRESHOLD

  const [focusOnStudio, setFocusOnStudio] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setFocusOnStudio(isStudioView), 0)
    return () => clearTimeout(id)
  }, [isStudioView])

  // GSAP-driven horizontal scroll
  useGSAP(
    () => {
      if (!worldRef.current) return
      gsap.to(worldRef.current, {
        x: -scrollX,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      })
    },
    { dependencies: [scrollX] },
  )

  // GSAP cloud float animation
  useGSAP(
    () => {
      gsap.to('.cloud-1', {
        x: 30,
        duration: 12,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.cloud-2', {
        x: -20,
        duration: 16,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      gsap.to('.cloud-3', {
        x: 25,
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
    },
    { scope: worldRef },
  )

  const handleEnterStudio = useCallback(() => {
    setInsideStudio(true)
  }, [])

  const handleExitStudio = useCallback(() => {
    setInsideStudio(false)
    setMinivan((prev) => ({ ...prev, y: clamp(prev.y, roadTop, roadBottom) }))
  }, [roadTop, roadBottom])

  const handleEnterStore = useCallback((storeName: string) => {
    setInsideStore(storeName)
  }, [])

  const handleExitStore = useCallback(() => {
    setInsideStore(null)
    setMinivan((prev) => ({ ...prev, y: clamp(prev.y, roadTop, roadBottom) }))
  }, [roadTop, roadBottom])

  const handleEnterHouse = useCallback((buildingIdx: number) => {
    const houseIdx = buildingIdx < CHURCH_SLOT ? buildingIdx : buildingIdx - 1
    setInsideHouse(houseIdx)
  }, [])

  const handleExitHouse = useCallback(() => {
    setInsideHouse(null)
    setMinivan((prev) => ({ ...prev, y: clamp(prev.y, roadTop, roadBottom) }))
  }, [roadTop, roadBottom])

  const handleEnterChurch = useCallback(() => {
    setInsideChurch(true)
  }, [])

  const handleExitChurch = useCallback(() => {
    setInsideChurch(false)
    setMinivan((prev) => ({ ...prev, y: clamp(prev.y, roadTop, roadBottom) }))
  }, [roadTop, roadBottom])

  const handleGetOut = useCallback(() => {
    if (!familyOut && canGetOut) {
      setFamilyOut(true)
      setMomPos({ x: minivan.x + 30, y: minivan.y + 75 })
      setGirl1Pos({ x: minivan.x + 75, y: minivan.y + 80 })
      setGirl2Pos({ x: minivan.x + 120, y: minivan.y + 78 })
    }
  }, [familyOut, canGetOut, minivan.x, minivan.y])

  const handleGetIn = useCallback(() => {
    if (familyOut) setFamilyOut(false)
  }, [familyOut])

  const clampCity = useCallback(
    (x: number, y: number): Position => ({
      x: clamp(x, 0, WORLD_WIDTH - 80),
      y: clamp(y, roadTop, roadBottom),
    }),
    [roadTop, roadBottom],
  )

  const clampMinivan = useCallback(
    (x: number, y: number): Position => ({
      x: clamp(x, 0, WORLD_WIDTH - 80),
      y: clamp(y, roadTop - 10, roadBottom),
    }),
    [roadTop, roadBottom],
  )

  const clampFamily = useCallback(
    (x: number, y: number): Position => ({
      x: clamp(x, 0, WORLD_WIDTH - 60),
      y: clamp(y, 200, 650),
    }),
    [],
  )

  return (
    <AnimatePresence mode="wait">
      {insideStudio ? (
        <motion.div
          key="studio-interior"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <DanceStudioInterior onExit={handleExitStudio} />
        </motion.div>
      ) : insideStore ? (
        <motion.div
          key="store-interior"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <StoreInterior storeName={insideStore} onExit={handleExitStore} />
        </motion.div>
      ) : insideChurch ? (
        <motion.div
          key="church-interior"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ChurchInterior onExit={handleExitChurch} />
        </motion.div>
      ) : insideHouse !== null ? (
        <motion.div
          key={`house-interior-${insideHouse}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <HouseInterior
            houseIndex={insideHouse}
            houseColor={HOUSE_COLORS[insideHouse] ?? '#e5e7eb'}
            onExit={handleExitHouse}
          />
        </motion.div>
      ) : (
        <motion.div
          key="city"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className={`city-viewport ${focusOnStudio ? 'studio-focus-viewport' : ''}`}
            ref={viewportRef}
          >
            <div
              ref={worldRef}
              className={`city-world ${isStudioView ? 'studio-view' : ''}`}
              style={{ width: WORLD_WIDTH }}
            >
              {/* Sky */}
              <div className="scene-layer sky">
                <div className="sun" />
                <div className="cloud cloud-1" />
                <div className="cloud cloud-2" />
                <div className="cloud cloud-3" />
              </div>

              {/* Distant houses */}
              <div className="scene-layer distant-neighborhoods">
                {(['dh-left', 'dh-center', 'dh-right'] as const).map((pos) => (
                  <div key={pos} className={`distant-houses ${pos}`}>
                    <div className="mini-house" />
                    <div className="mini-house" />
                    <div className="mini-house" />
                  </div>
                ))}
              </div>

              {/* Road & sidewalk */}
              <div
                className={`scene-layer road-full ${focusOnStudio ? 'road-continues-into-lot' : ''}`}
              />
              <div
                className={`scene-layer sidewalk-full ${focusOnStudio ? 'sidewalk-full-hidden' : ''}`}
              />

              {/* Airport section */}
              <div className={`scene-section airport-section ${isStudioView ? 'airport-section-hidden' : ''}`}>
                <div className="airport-building">
                  <div className="airport-roof" />
                  <div className="airport-facade">
                    <div className="airport-sign">AIRPORT</div>
                    <div className="airport-windows-row">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="airport-window" />
                      ))}
                    </div>
                    <div className="airport-windows-row">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="airport-window" />
                      ))}
                    </div>
                    <div className="airport-entrance">
                      <div className="airport-door" />
                      <div className="airport-revolving-door" />
                      <div className="airport-door" />
                    </div>
                  </div>
                </div>
                <div className="airport-control-tower">
                  <div className="tower-antenna" />
                  <div className="tower-cab" />
                  <div className="tower-stem" />
                </div>
              </div>

              {/* Airplane taking off in the sky */}
              <div className={`airport-plane-flying ${isStudioView ? 'airport-section-hidden' : ''}`}>
                <svg width="180" height="70" viewBox="0 0 180 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 10 40 Q 10 28 30 25 L 140 25 Q 160 28 165 40 L 165 45 Q 165 50 155 50 L 20 50 Q 10 50 10 45 Z" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" />
                  <path d="M 60 25 L 50 5 L 95 5 L 85 25" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1" />
                  <circle cx="45" cy="33" r="4" fill="#bfdbfe" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="60" cy="33" r="4" fill="#bfdbfe" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="75" cy="33" r="4" fill="#bfdbfe" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="90" cy="33" r="4" fill="#bfdbfe" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="105" cy="33" r="4" fill="#bfdbfe" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="120" cy="33" r="4" fill="#bfdbfe" stroke="#94a3b8" strokeWidth="1" />
                  <circle cx="135" cy="33" r="4" fill="#bfdbfe" stroke="#94a3b8" strokeWidth="1" />
                  <rect x="155" y="32" width="25" height="8" rx="3" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1" />
                  <rect x="0" y="35" width="18" height="7" rx="3" fill="#60a5fa" stroke="#3b82f6" strokeWidth="1" />
                  <circle cx="25" cy="33" r="5" fill="#e0f2fe" stroke="#94a3b8" strokeWidth="1" />
                  <path d="M 40 50 L 30 62 L 55 62 L 45 50" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
                  <path d="M 110 50 L 100 62 L 125 62 L 115 50" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
                </svg>
              </div>

              {/* Neighborhood section */}
              <div
                className={`scene-section neighborhood-section ${isStudioView ? 'neighborhood-section-hidden' : ''}`}
              >
                <Neighborhood />
              </div>

              {/* City section (storefronts) */}
              <div
                className={`scene-section city-section ${isStudioView ? 'city-section-hidden' : ''}`}
              >
                <div className="scene-layer buildings city-buildings">
                  {STORES.map((store) => (
                    <StoreFront key={store.sign} {...store} />
                  ))}
                </div>
              </div>

              {/* Studio section */}
              <div
                className={`scene-section studio-section ${isStudioView ? 'studio-section-zoomed' : ''} ${focusOnStudio ? 'studio-focus-mode' : ''}`}
              >
                {focusOnStudio && <div className="studio-road-into-lot" aria-hidden />}

                <div className="scene-layer studio-parking-lot">
                  <div className="studio-parking-label">Ev&apos;s Dance Parking</div>
                  <div className="parking-spots-grid">
                    {Array.from({ length: PARKING_SPOT_COUNT }, (_, i) => (
                      <div key={i} className="parking-spot" />
                    ))}
                  </div>
                  <div className="studio-parking-cars">
                    {PARKED_CARS.map((car, i) => (
                      <div
                        key={i}
                        className="parking-car"
                        style={{ left: car.left, top: car.top }}
                      >
                        <CartoonCar color={car.color} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="studio-sidewalk-path" aria-hidden="true" />

                {/* Dance studio building facade */}
                <div className="studio-building-block">
                  <div className="scene-layer studio-buildings-row">
                    <div className="dance-studio">
                      <div className="studio-facade">
                        <div className="studio-roof" />
                        <div className="facade">
                          <div className="studio-sign">Ev&apos;s Dance Studio</div>
                          <div className="studio-windows-row">
                            <div className="studio-window" />
                            <div className="studio-window" />
                            <div className="studio-window" />
                          </div>
                          <div className="studio-doors-container">
                            <div className="studio-doorway" />
                            <div className="studio-door studio-door-left" />
                            <div className="studio-door studio-door-right" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Minivan (draggable, drives the world scroll) */}
              <div
                className="minivan-wrapper"
                style={{ position: 'absolute', left: minivan.x, top: minivan.y }}
              >
                <Draggable
                  x={0}
                  y={0}
                  onMoveDelta={(dx, dy) =>
                    setMinivan((prev) => clampMinivan(prev.x + dx, prev.y + dy))
                  }
                  className="minivan-draggable"
                >
                  <MinivanWithFamily familyInside={!familyOut} />
                </Draggable>

                {canGetOut && !familyOut && (
                  <button
                    type="button"
                    className="van-get-out-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGetOut()
                    }}
                  >
                    Get out
                  </button>
                )}

                {familyOut && (
                  <button
                    type="button"
                    className="van-get-out-btn van-get-in-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleGetIn()
                    }}
                  >
                    Get back in
                  </button>
                )}
              </div>

              {/* City cars */}
              <Draggable
                x={car1.x}
                y={car1.y}
                onMove={(x, y) => setCar1(clampCity(x, y))}
                className="car-draggable"
              >
                <CartoonCar color="#e11d48" showPassenger />
              </Draggable>
              <Draggable
                x={car2.x}
                y={car2.y}
                onMove={(x, y) => setCar2(clampCity(x, y))}
                className="car-draggable"
              >
                <CartoonCar color="#22c55e" />
              </Draggable>

              {/* Family members (visible after "Get out") */}
              {familyOut && (
                <>
                  <Draggable
                    x={momPos.x}
                    y={momPos.y}
                    onMove={(x, y) => setMomPos(clampFamily(x, y))}
                    className="person-draggable"
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
                    y={girl1Pos.y}
                    onMove={(x, y) => setGirl1Pos(clampFamily(x, y))}
                    className="person-draggable"
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
                    y={girl2Pos.y}
                    onMove={(x, y) => setGirl2Pos(clampFamily(x, y))}
                    className="person-draggable"
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
                </>
              )}
            </div>

            {/* Studio welcome overlay */}
            {focusOnStudio && (
              <div className="studio-welcome-overlay" aria-live="polite">
                <span className="studio-welcome-text">Welcome to Ev&apos;s Dance!</span>
              </div>
            )}

            {/* "Go Inside" buttons */}
            {canEnterStudio && (
              <button
                type="button"
                className="enter-btn enter-studio-btn"
                onClick={handleEnterStudio}
              >
                Go Inside Ev&apos;s Dance!
              </button>
            )}

            {canEnterStore && (
              <button
                type="button"
                className="enter-btn enter-store-btn"
                onClick={() => handleEnterStore(STORES[nearStoreIdx].sign)}
              >
                Go Inside{' '}
                {STORES[nearStoreIdx].sign.charAt(0) +
                  STORES[nearStoreIdx].sign.slice(1).toLowerCase()}
                !
              </button>
            )}

            {canEnterHouse && (
              <button
                type="button"
                className="enter-btn enter-house-btn"
                onClick={() => handleEnterHouse(nearBuilding.index)}
              >
                Go Inside House {(nearBuilding.index < CHURCH_SLOT ? nearBuilding.index : nearBuilding.index - 1) + 1}!
              </button>
            )}

            {canEnterChurch && (
              <button
                type="button"
                className="enter-btn enter-church-btn"
                onClick={handleEnterChurch}
              >
                ✝ Enter Woodridge Church!
              </button>
            )}

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
