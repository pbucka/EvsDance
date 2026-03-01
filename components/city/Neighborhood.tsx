'use client'

import './Neighborhood.css'

interface HouseConfig {
  stories: 1 | 2
  garageCars: 2 | 3
  bodyColor: string
  roofColor: string
  doorColor: string
  garageLeft: boolean
  hasChimney: boolean
}

const HOUSES: HouseConfig[] = [
  { stories: 2, garageCars: 2, bodyColor: '#f5deb3', roofColor: '#8b4513', doorColor: '#92400e', garageLeft: false, hasChimney: true },
  { stories: 2, garageCars: 3, bodyColor: '#faf5ff', roofColor: '#581c87', doorColor: '#78350f', garageLeft: true, hasChimney: true },
  { stories: 1, garageCars: 2, bodyColor: '#93c5fd', roofColor: '#1e3a5f', doorColor: '#78350f', garageLeft: true, hasChimney: false },
  { stories: 2, garageCars: 3, bodyColor: '#d4a574', roofColor: '#3f2305', doorColor: '#1e293b', garageLeft: false, hasChimney: true },
  { stories: 1, garageCars: 2, bodyColor: '#86efac', roofColor: '#166534', doorColor: '#78350f', garageLeft: false, hasChimney: false },
  { stories: 2, garageCars: 2, bodyColor: '#94a3b8', roofColor: '#334155', doorColor: '#1e293b', garageLeft: true, hasChimney: true },
  { stories: 2, garageCars: 3, bodyColor: '#fed7aa', roofColor: '#c2410c', doorColor: '#92400e', garageLeft: false, hasChimney: true },
]

const CHURCH_AFTER_HOUSE = 3

const TREE_AFTER_INDICES = [1, 5]

function House({ config }: { config: HouseConfig }) {
  const { stories, garageCars, bodyColor, roofColor, doorColor, garageLeft, hasChimney } = config
  const isSmall = garageCars === 2

  const bodySizeClass = isSmall
    ? stories === 1 ? 'nh-body-small-1' : 'nh-body-small-2'
    : stories === 1 ? 'nh-body-large-1' : 'nh-body-large-2'

  const garageSizeClass = isSmall ? 'nh-garage-2' : 'nh-garage-3'
  const drivewaySizeClass = isSmall ? 'nh-driveway-2' : 'nh-driveway-3'

  const bodyWidth = isSmall ? 140 : 200
  const roofOverhang = 14
  const roofHalfBase = bodyWidth / 2 + roofOverhang
  const roofHeight = isSmall ? 32 : 40

  const windowCount = isSmall ? 2 : 3

  return (
    <div className="nh-house">
      <div className={`nh-compound ${garageLeft ? 'garage-left' : ''}`}>
        <div className={`nh-body ${bodySizeClass}`} style={{ background: bodyColor }}>
          <div
            className="nh-roof"
            style={{
              borderWidth: `0 ${roofHalfBase}px ${roofHeight}px ${roofHalfBase}px`,
              borderBottomColor: roofColor,
            }}
          />
          {hasChimney && <div className="nh-chimney" style={{ background: roofColor }} />}

          {stories === 2 && (
            <div className="nh-window-row">
              {Array.from({ length: windowCount }, (_, i) => (
                <div key={i} className="nh-window" />
              ))}
            </div>
          )}

          <div className="nh-window-row">
            {Array.from({ length: windowCount }, (_, i) => (
              <div key={i} className="nh-window" />
            ))}
          </div>

          <div className="nh-door" style={{ background: doorColor }}>
            <div className="nh-doorknob" />
          </div>
          <div className="nh-steps" />

          <div className={`nh-bush nh-bush-left`} />
          <div className={`nh-bush nh-bush-right`} />
          <div className={`nh-mailbox ${garageLeft ? 'nh-mailbox-right' : 'nh-mailbox-left'}`} />
        </div>

        <div className="nh-garage-section">
          <div className={`nh-garage ${garageSizeClass}`} style={{ background: bodyColor }}>
            <div className="nh-garage-roof" style={{ background: roofColor }} />
            {Array.from({ length: garageCars }, (_, i) => (
              <div key={i} className="nh-garage-door" />
            ))}
          </div>
          <div className={`nh-driveway ${drivewaySizeClass}`} />
        </div>
      </div>
      <div className="nh-lawn" />
    </div>
  )
}

function Tree() {
  return (
    <div className="nh-tree">
      <div className="nh-tree-top" />
      <div className="nh-tree-trunk" />
    </div>
  )
}

function Church() {
  return (
    <div className="nh-church">
      <div className="nh-church-body">
        <div className="nh-church-steeple">
          <div className="nh-church-cross" />
          <div className="nh-church-steeple-roof" />
        </div>
        <div className="nh-church-roof" />
        <div className="nh-church-sign">Woodridge Church</div>
        <div className="nh-church-window-row">
          <div className="nh-church-window-plain" />
          <div className="nh-church-window-plain" />
          <div className="nh-church-window-plain" />
        </div>
        <div className="nh-church-doors">
          <div className="nh-church-door" />
          <div className="nh-church-door" />
        </div>
        <div className="nh-church-steps" />
      </div>
      <div className="nh-lawn" />
    </div>
  )
}

export function Neighborhood() {
  const items: React.ReactNode[] = []

  HOUSES.forEach((house, i) => {
    if (i === CHURCH_AFTER_HOUSE) {
      items.push(<Church key="church" />)
    }
    items.push(<House key={`house-${i}`} config={house} />)
    if (TREE_AFTER_INDICES.includes(i)) {
      items.push(<Tree key={`tree-${i}`} />)
    }
  })

  return (
    <>
      <div className="scene-layer neighborhood-houses">
        {items}
      </div>
      <div className="neighborhood-entrance-sign">
        <span className="nh-sign-title">Maple Grove</span>
        <span className="nh-sign-subtitle">Est. 2024</span>
      </div>
    </>
  )
}
