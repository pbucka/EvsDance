import { useState, useCallback } from 'react'

export function DanceStudioDoors() {
  const [doorsOpen, setDoorsOpen] = useState(false)

  const toggle = useCallback(() => setDoorsOpen((prev) => !prev), [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        toggle()
      }
    },
    [toggle],
  )

  return (
    <div className="building dance-studio">
      <div className="roof roof-studio-black" />
      <div className="facade studio-facade">
        <div className="studio-sign">Ev's Dance</div>
        <div className="studio-windows-row">
          <div className="studio-window" />
          <div className="studio-window" />
        </div>
        <div
          className="studio-doors-container"
          onClick={toggle}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label={doorsOpen ? 'Close studio doors' : 'Open studio doors'}
        >
          <div className={`studio-door studio-door-left ${doorsOpen ? 'open' : ''}`} />
          <div className={`studio-door studio-door-right ${doorsOpen ? 'open' : ''}`} />
        </div>
        {doorsOpen && <div className="studio-doorway" aria-hidden />}
      </div>
    </div>
  )
}
