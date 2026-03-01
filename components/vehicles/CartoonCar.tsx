'use client'

const STROKE = '#2d2d3a'

export function CartoonCar({
  color = '#4a90d9',
  showPassenger = false,
}: {
  color?: string
  showPassenger?: boolean
}) {
  return (
    <div className="cartoon-car">
      <svg width="110" height="52" viewBox="0 0 110 52" fill="none">
        {/* Lower body */}
        <path
          d="M 8 24 Q 4 24 4 28 L 4 38 Q 4 42 8 42 L 100 42 Q 106 42 106 38 L 106 28 Q 106 24 100 24 Z"
          fill={color}
          stroke={STROKE}
          strokeWidth="2"
        />

        {/* Upper cabin */}
        <path
          d="M 28 24 L 34 12 Q 36 8 40 8 L 72 8 Q 76 8 78 12 L 86 24"
          fill={color}
          stroke={STROKE}
          strokeWidth="2"
        />
        <path
          d="M 28 24 L 34 12 Q 36 8 40 8 L 72 8 Q 76 8 78 12 L 86 24 Z"
          fill={color}
        />

        {/* Windshield */}
        <path
          d="M 30 24 L 36 13 Q 37 10 40 10 L 56 10 L 56 24 Z"
          fill="#bfdbfe"
          stroke={STROKE}
          strokeWidth="1.2"
        />

        {/* Rear window */}
        <path
          d="M 56 10 L 72 10 Q 75 10 76 13 L 84 24 L 56 24 Z"
          fill="#bfdbfe"
          stroke={STROKE}
          strokeWidth="1.2"
        />

        {/* A-pillar divider */}
        <line x1="56" y1="10" x2="56" y2="24" stroke={STROKE} strokeWidth="1.5" />

        {/* Driver */}
        <circle cx="46" cy="16" r="4.5" fill="#ffdfc4" stroke={STROKE} strokeWidth="1" />
        <circle cx="44" cy="15" r="0.8" fill={STROKE} />
        <circle cx="48" cy="15" r="0.8" fill={STROKE} />

        {showPassenger && (
          <>
            <circle cx="66" cy="16" r="4" fill="#ffdfc4" stroke={STROKE} strokeWidth="1" />
            <circle cx="64.5" cy="15" r="0.7" fill={STROKE} />
            <circle cx="67.5" cy="15" r="0.7" fill={STROKE} />
          </>
        )}

        {/* Hood line */}
        <line x1="12" y1="26" x2="28" y2="26" stroke={STROKE} strokeWidth="1" opacity="0.3" />

        {/* Trunk line */}
        <line x1="86" y1="26" x2="100" y2="26" stroke={STROKE} strokeWidth="1" opacity="0.3" />

        {/* Side trim line */}
        <line x1="10" y1="34" x2="102" y2="34" stroke={STROKE} strokeWidth="0.8" opacity="0.2" />

        {/* Headlights */}
        <rect x="100" y="28" width="6" height="5" rx="1.5" fill="#fef9c3" stroke={STROKE} strokeWidth="1" />

        {/* Tail lights */}
        <rect x="4" y="28" width="5" height="5" rx="1.5" fill="#ef4444" stroke={STROKE} strokeWidth="1" />

        {/* Side mirror */}
        <ellipse cx="29" cy="22" rx="3" ry="2" fill={color} stroke={STROKE} strokeWidth="1" />

        {/* Wheels with rims */}
        <circle cx="28" cy="44" r="8" fill="#1e293b" stroke={STROKE} strokeWidth="1.5" />
        <circle cx="28" cy="44" r="4" fill="#64748b" stroke="#475569" strokeWidth="1" />
        <circle cx="82" cy="44" r="8" fill="#1e293b" stroke={STROKE} strokeWidth="1.5" />
        <circle cx="82" cy="44" r="4" fill="#64748b" stroke="#475569" strokeWidth="1" />

        {/* Wheel arches */}
        <path d="M 18 42 Q 18 35 28 35 Q 38 35 38 42" fill="none" stroke={STROKE} strokeWidth="1.5" />
        <path d="M 72 42 Q 72 35 82 35 Q 92 35 92 42" fill="none" stroke={STROKE} strokeWidth="1.5" />

        {/* Front bumper detail */}
        <rect x="100" y="36" width="4" height="2" rx="1" fill="#94a3b8" />
      </svg>
    </div>
  )
}
