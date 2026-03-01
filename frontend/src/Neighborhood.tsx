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
  // Small 2-story colonial — beige
  { stories: 2, garageCars: 2, bodyColor: '#f5deb3', roofColor: '#8b4513', doorColor: '#92400e', garageLeft: false, hasChimney: true },
  // Large 2-story mansion — lavender white
  { stories: 2, garageCars: 3, bodyColor: '#faf5ff', roofColor: '#581c87', doorColor: '#78350f', garageLeft: true, hasChimney: true },
  // Small 1-story ranch — sky blue
  { stories: 1, garageCars: 2, bodyColor: '#93c5fd', roofColor: '#1e3a5f', doorColor: '#78350f', garageLeft: true, hasChimney: false },
  // Large 2-story Tudor — warm brown
  { stories: 2, garageCars: 3, bodyColor: '#d4a574', roofColor: '#3f2305', doorColor: '#1e293b', garageLeft: false, hasChimney: true },
  // Small 1-story cottage — mint green
  { stories: 1, garageCars: 2, bodyColor: '#86efac', roofColor: '#166534', doorColor: '#78350f', garageLeft: false, hasChimney: false },
  // Large 1-story estate ranch — stone gray
  { stories: 1, garageCars: 3, bodyColor: '#e2e8f0', roofColor: '#475569', doorColor: '#78350f', garageLeft: true, hasChimney: false },
  // Small 2-story modern — slate gray
  { stories: 2, garageCars: 2, bodyColor: '#94a3b8', roofColor: '#334155', doorColor: '#1e293b', garageLeft: true, hasChimney: true },
  // Large 2-story Mediterranean — terracotta
  { stories: 2, garageCars: 3, bodyColor: '#fed7aa', roofColor: '#c2410c', doorColor: '#92400e', garageLeft: false, hasChimney: true },
  // Small 1-story bungalow — warm yellow
  { stories: 1, garageCars: 2, bodyColor: '#fde68a', roofColor: '#92400e', doorColor: '#78350f', garageLeft: false, hasChimney: false },
  // Large 2-story manor — slate blue
  { stories: 2, garageCars: 3, bodyColor: '#bfdbfe', roofColor: '#1e3a5f', doorColor: '#78350f', garageLeft: true, hasChimney: true },
]

const TREE_AFTER_INDICES = [1, 4, 7]

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

export function Neighborhood() {
  const items: React.ReactNode[] = []

  HOUSES.forEach((house, i) => {
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
