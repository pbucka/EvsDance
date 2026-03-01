import { useState, useCallback, useRef, useEffect } from 'react'
import { Draggable } from './Draggable'
import { CartoonPerson } from './CartoonPerson'
import { CartoonCar } from './CartoonCar'
import { MinivanWithFamily } from './MinivanWithFamily'
import { DanceStudioDoors } from './DanceStudioDoors'
import { StoreFront } from './StoreFront'
import { Neighborhood } from './Neighborhood'
import { DanceStudioInterior } from './DanceStudioInterior'
import { StoreInterior } from './StoreInterior'
import './CityScene.css'

const WORLD_WIDTH = 6200
const VIEWPORT_CENTER_OFFSET = 420
const STUDIO_VIEW_SCROLL_THRESHOLD = 4400
const STUDIO_ZONE_LEFT = 4580

const CITY_LEFT = 3000
const STORE_START = CITY_LEFT + 20
const STORE_WIDTH = 160
const STORE_GAP = 24

const STORES = [
  { sign: 'BURGER', signClass: 'sign-burger', facadeClass: 'store-burger' },
  { sign: 'TARGET', signClass: 'sign-target', facadeClass: 'store-target' },
  { sign: 'HARDWARE', signClass: 'sign-hardware', facadeClass: 'store-hardware' },
  { sign: 'COFFEE', signClass: 'sign-coffee', facadeClass: 'store-coffee' },
  { sign: 'PHARMACY', signClass: 'sign-pharmacy', facadeClass: 'store-pharmacy' },
  { sign: 'PIZZA', signClass: 'sign-pizza', facadeClass: 'store-pizza' },
  { sign: 'BAKERY', signClass: 'sign-bakery', facadeClass: 'store-bakery' },
] as const

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

const PARKED_CARS = [
  { color: '#4b5563', left: '6%', top: '18%' },
  { color: '#1e40af', left: '30%', top: '18%' },
  { color: '#b91c1c', left: '54%', top: '18%' },
  { color: '#15803d', left: '78%', top: '18%' },
  { color: '#c2410c', left: '18%', top: '56%' },
  { color: '#7e22ce', left: '66%', top: '56%' },
] as const

const PARKING_SPOT_COUNT = 8

type TransitionPhase = 'idle' | 'in' | 'hold' | 'out'

interface Position {
  x: number
  y: number
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
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

function useTransition(trigger: boolean, label: string) {
  const [phase, setPhase] = useState<TransitionPhase>('idle')
  const wasTriggedRef = useRef(false)
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => {
    const clearAll = () => {
      timeoutsRef.current.forEach(clearTimeout)
      timeoutsRef.current = []
    }

    if (trigger && !wasTriggedRef.current) {
      wasTriggedRef.current = true
      clearAll()
      const id = setTimeout(() => {
        setPhase('in')
        const t1 = setTimeout(() => setPhase('hold'), 350)
        const t2 = setTimeout(() => setPhase('out'), 850)
        const t3 = setTimeout(() => setPhase('idle'), 1350)
        timeoutsRef.current = [t1, t2, t3]
      }, 0)
      timeoutsRef.current.push(id)
    } else if (!trigger) {
      wasTriggedRef.current = false
    }

    return clearAll
  }, [trigger, label])

  return phase
}

export function CityScene() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const { width: viewportWidth, height: viewportHeight } = useViewportSize(viewportRef)

  const roadTop = viewportHeight * 0.50
  const roadBottom = viewportHeight * 0.73
  const [car1, setCar1] = useState<Position>(() => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 700
    return { x: 3100, y: vh * 0.56 }
  })
  const [car2, setCar2] = useState<Position>(() => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 700
    return { x: 3800, y: vh * 0.56 }
  })
  const [minivan, setMinivan] = useState<Position>(() => {
    const vh = typeof window !== 'undefined' ? window.innerHeight : 700
    return { x: 3450, y: vh * 0.52 }
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
  const [enterTransition, setEnterTransition] = useState(false)

  const isInStudioZone = minivan.x >= STUDIO_ZONE_LEFT
  const nearStoreIdx = getNearestStore(minivan.x)
  const isNearStore = nearStoreIdx >= 0
  const canGetOut = isInStudioZone || isNearStore
  const canEnterStudio = familyOut && isInStudioZone
  const canEnterStore = familyOut && isNearStore && !isInStudioZone

  const handleEnterStudio = useCallback(() => {
    setEnterTransition(true)
    setTimeout(() => {
      setInsideStudio(true)
      setEnterTransition(false)
    }, 600)
  }, [])

  const handleExitStudio = useCallback(() => {
    setInsideStudio(false)
    setMinivan((prev) => ({ ...prev, y: clamp(prev.y, roadTop, roadBottom) }))
  }, [roadTop, roadBottom])

  const handleEnterStore = useCallback((storeName: string) => {
    setEnterTransition(true)
    setTimeout(() => {
      setInsideStore(storeName)
      setEnterTransition(false)
    }, 600)
  }, [])

  const handleExitStore = useCallback(() => {
    setInsideStore(null)
    setMinivan((prev) => ({ ...prev, y: clamp(prev.y, roadTop, roadBottom) }))
  }, [roadTop, roadBottom])
  const maxScroll = Math.max(0, WORLD_WIDTH - viewportWidth)
  const scrollX = clamp(minivan.x - VIEWPORT_CENTER_OFFSET, 0, maxScroll)
  const isStudioView = scrollX > STUDIO_VIEW_SCROLL_THRESHOLD

  const [focusOnStudio, setFocusOnStudio] = useState(false)
  const hadStudioViewRef = useRef(false)

  useEffect(() => {
    if (isStudioView) {
      hadStudioViewRef.current = true
      const id = setTimeout(() => setFocusOnStudio(true), 0)
      return () => clearTimeout(id)
    }

    const id = setTimeout(() => setFocusOnStudio(false), 0)
    return () => clearTimeout(id)
  }, [isStudioView])

  const studioTransitionPhase = useTransition(isStudioView, 'studio')

  const [showCityTransition, setShowCityTransition] = useState(false)
  const prevStudioViewRef = useRef(false)

  useEffect(() => {
    if (prevStudioViewRef.current && !isStudioView) {
      const id0 = setTimeout(() => setShowCityTransition(true), 0)
      const id1 = setTimeout(() => setShowCityTransition(false), 1400)
      return () => {
        clearTimeout(id0)
        clearTimeout(id1)
      }
    }
    prevStudioViewRef.current = isStudioView
  }, [isStudioView])

  const cityTransitionPhase = useTransition(showCityTransition, 'city')

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

  if (insideStudio) {
    return <DanceStudioInterior onExit={handleExitStudio} />
  }

  if (insideStore) {
    return <StoreInterior storeName={insideStore} onExit={handleExitStore} />
  }

  return (
    <div
      className={`city-scene-viewport ${focusOnStudio ? 'studio-focus-viewport' : ''}`}
      ref={viewportRef}
    >
      <div
        className={`city-scene-world ${isStudioView ? 'studio-view' : ''}`}
        style={{ width: WORLD_WIDTH, transform: `translateX(-${scrollX}px)` }}
      >
        {/* Sky */}
        <div className="scene-layer sky evening-sky">
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
          aria-hidden={false}
        />
        <div
          className={`scene-layer sidewalk-full ${focusOnStudio ? 'sidewalk-full-hidden' : ''}`}
          aria-hidden={focusOnStudio}
        />

        {/* Neighborhood section (left of city) */}
        <div className={`scene-section neighborhood-section ${isStudioView ? 'neighborhood-section-hidden' : ''}`}>
          <Neighborhood />
        </div>

        {/* City section */}
        <div className={`scene-section city-section ${isStudioView ? 'city-section-hidden' : ''}`}>
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
            <div className="studio-parking-label">Ev's Dance Parking</div>
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

          <div className="studio-building-block">
            <div className="scene-layer studio-buildings-row">
              <DanceStudioDoors />
            </div>
          </div>
        </div>

        {/* Minivan (draggable) */}
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
              title="Click to let Mom and the two girls get out"
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
              title="Click to put Mom and the kids back in the van"
            >
              Get back in
            </button>
          )}
        </div>

        {/* City cars (draggable) */}
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

        {/* Family members (draggable, appear after "Get out") */}
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

      {/* Studio transition overlay */}
      {focusOnStudio && (
        <div
          className={`studio-focus-transition studio-focus-transition-${studioTransitionPhase}`}
          aria-live="polite"
        >
          <span className="studio-focus-transition-text">Welcome to Ev's Dance!</span>
        </div>
      )}

      {/* City transition overlay */}
      {cityTransitionPhase !== 'idle' && (
        <div
          className={`studio-focus-transition city-transition city-transition-${cityTransitionPhase}`}
          aria-live="polite"
        >
          <span className="studio-focus-transition-text">Welcome to the dance city</span>
        </div>
      )}

      {/* "Go Inside" button when family is out at the studio */}
      {canEnterStudio && (
        <button
          type="button"
          className="enter-studio-btn"
          onClick={handleEnterStudio}
        >
          Go Inside Ev's Dance!
        </button>
      )}

      {/* "Go Inside" button when family is out near a store */}
      {canEnterStore && (
        <button
          type="button"
          className="enter-studio-btn enter-store-btn"
          onClick={() => handleEnterStore(STORES[nearStoreIdx].sign)}
        >
          Go Inside {STORES[nearStoreIdx].sign.charAt(0) + STORES[nearStoreIdx].sign.slice(1).toLowerCase()}!
        </button>
      )}

      {/* Door-opening transition */}
      {enterTransition && (
        <div className="enter-studio-transition" aria-live="polite">
          <span className="studio-focus-transition-text">Entering Ev's Dance...</span>
        </div>
      )}
    </div>
  )
}
