const STROKE = '#2d2d3a'

export function MinivanWithFamily({ familyInside = true }: { familyInside?: boolean }) {
  return (
    <div className="minivan-with-family">
      <svg width="140" height="78" viewBox="0 0 140 78" fill="none">
        {/* Main body */}
        <rect x="4" y="20" width="132" height="42" rx="6" fill="#6b7280" stroke={STROKE} strokeWidth="2" />

        {/* Front cabin */}
        <path d="M 36 20 L 42 8 L 98 8 L 104 20 Z" fill="#9ca3af" stroke={STROKE} strokeWidth="2" />

        {/* Windshield */}
        <path d="M 38 20 L 43 11 L 97 11 L 102 20 Z" fill="#93c5fd" stroke={STROKE} strokeWidth="1" />

        {/* Sliding door line */}
        <path d="M 70 22 L 70 58" stroke="#4b5563" strokeWidth="2" strokeDasharray="4 3" />

        {/* Side windows */}
        <rect x="42" y="24" width="24" height="22" rx="2" fill="#93c5fd" stroke={STROKE} strokeWidth="1" />
        <rect x="74" y="24" width="28" height="22" rx="2" fill="#93c5fd" stroke={STROKE} strokeWidth="1" />
        <rect x="108" y="24" width="24" height="22" rx="2" fill="#93c5fd" stroke={STROKE} strokeWidth="1" />

        {/* Rear end */}
        <rect x="132" y="24" width="6" height="36" fill="#5a6575" stroke={STROKE} strokeWidth="1" />

        {/* Family visible through windows */}
        {familyInside && (
          <>
            {/* Mom */}
            <circle cx="54" cy="34" r="7" fill="#ffdfc4" stroke={STROKE} strokeWidth="1" />
            <circle cx="51" cy="33" r="1.2" fill={STROKE} />
            <circle cx="57" cy="33" r="1.2" fill={STROKE} />

            {/* Girl 1 */}
            <circle cx="88" cy="34" r="6" fill="#ffdfc4" stroke={STROKE} strokeWidth="1" />
            <circle cx="85.5" cy="33" r="1" fill={STROKE} />
            <circle cx="90.5" cy="33" r="1" fill={STROKE} />

            {/* Girl 2 */}
            <circle cx="120" cy="34" r="6" fill="#ffdfc4" stroke={STROKE} strokeWidth="1" />
            <circle cx="117.5" cy="33" r="1" fill={STROKE} />
            <circle cx="122.5" cy="33" r="1" fill={STROKE} />
          </>
        )}

        {/* Wheels */}
        <circle cx="32" cy="62" r="10" fill="#374151" stroke={STROKE} strokeWidth="1" />
        <circle cx="108" cy="62" r="10" fill="#374151" stroke={STROKE} strokeWidth="1" />

        {/* Roof rack */}
        <path d="M 44 10 L 96 10" stroke="#5a6575" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}
