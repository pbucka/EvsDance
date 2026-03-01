export type SkinTone = 'light' | 'medium' | 'tan' | 'dark'
export type HairStyle = 'long' | 'bob' | 'bun' | 'pigtails' | 'wavy'

const SKIN_COLORS: Record<SkinTone, string> = {
  light: '#ffdfc4',
  medium: '#e8c4a0',
  tan: '#c99a6e',
  dark: '#8d5524',
}

const STROKE = '#2d2d3a'

export interface CartoonPersonProps {
  label?: string
  skinTone?: SkinTone
  hairStyle?: HairStyle
  hairColor?: string
  topColor?: string
  bottomColor?: string
  armLeftAngle?: number
  armRightAngle?: number
  legLeftAngle?: number
  legRightAngle?: number
}

function HairLong({ color }: { color: string }) {
  return (
    <>
      {/* Hair cap */}
      <path
        d="M 16 10 Q 20 2 34 2 Q 48 2 52 10 L 52 22 L 16 22 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="2"
      />
      {/* Left side flowing to shoulder */}
      <path
        d="M 16 18 L 14 34 Q 13 42 16 44 Q 18 43 18 38 L 18 22"
        fill={color}
        stroke={STROKE}
        strokeWidth="1.5"
      />
      {/* Right side flowing to shoulder */}
      <path
        d="M 52 18 L 54 34 Q 55 42 52 44 Q 50 43 50 38 L 50 22"
        fill={color}
        stroke={STROKE}
        strokeWidth="1.5"
      />
      <path d="M 22 12 Q 34 9 46 12" stroke={STROKE} strokeWidth="1" fill="none" opacity="0.3" />
    </>
  )
}

function HairBob({ color }: { color: string }) {
  return (
    <path
      d="M 16 12 Q 34 6 52 12 L 50 38 L 18 38 Z"
      fill={color}
      stroke={STROKE}
      strokeWidth="2"
    />
  )
}

function HairBun({ color }: { color: string }) {
  return (
    <>
      <circle cx="34" cy="4" r="10" fill={color} stroke={STROKE} strokeWidth="2" />
      <path d="M 14 18 Q 34 24 54 18" fill={color} stroke={STROKE} strokeWidth="2" />
    </>
  )
}

function HairPigtails({ color }: { color: string }) {
  return (
    <>
      {/* Hair cap */}
      <path
        d="M 16 10 Q 20 2 34 2 Q 48 2 52 10 L 52 20 L 16 20 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="2"
      />
      {/* Left pigtail — small tail at side of head */}
      <path
        d="M 16 16 L 10 22 Q 8 28 10 32 L 12 34"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M 16 16 L 10 22 Q 8 28 10 32 L 12 34" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <circle cx="12" cy="35" r="4" fill={color} stroke={STROKE} strokeWidth="1.2" />
      {/* Right pigtail */}
      <path
        d="M 52 16 L 58 22 Q 60 28 58 32 L 56 34"
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M 52 16 L 58 22 Q 60 28 58 32 L 56 34" fill="none" stroke={STROKE} strokeWidth="1.2" />
      <circle cx="56" cy="35" r="4" fill={color} stroke={STROKE} strokeWidth="1.2" />
    </>
  )
}

function HairWavy({ color }: { color: string }) {
  return (
    <>
      {/* Hair cap with wavy bottom edge */}
      <path
        d="M 16 12 Q 20 4 34 4 Q 48 4 52 12 L 52 22 Q 48 28 44 24 Q 40 30 34 26 Q 28 30 24 24 Q 20 28 16 22 Z"
        fill={color}
        stroke={STROKE}
        strokeWidth="2"
      />
      <path d="M 24 14 Q 34 10 44 14" stroke={STROKE} strokeWidth="0.8" fill="none" opacity="0.25" />
    </>
  )
}

const HAIR_COMPONENTS: Record<HairStyle, React.FC<{ color: string }>> = {
  long: HairLong,
  bob: HairBob,
  bun: HairBun,
  pigtails: HairPigtails,
  wavy: HairWavy,
}

export function CartoonPerson({
  label,
  skinTone = 'light',
  hairStyle = 'long',
  hairColor = '#5c4033',
  topColor = '#a78bfa',
  bottomColor = '#7c3aed',
  armLeftAngle = 0,
  armRightAngle = 0,
  legLeftAngle = 0,
  legRightAngle = 0,
}: CartoonPersonProps) {
  const skin = SKIN_COLORS[skinTone]
  const HairComponent = HAIR_COMPONENTS[hairStyle]

  return (
    <div className="cartoon-person toca-style" title={label}>
      <svg width="68" height="92" viewBox="0 0 68 92" fill="none" xmlns="http://www.w3.org/2000/svg">
        <HairComponent color={hairColor} />

        {/* Head */}
        <circle cx="34" cy="26" r="18" fill={skin} stroke={STROKE} strokeWidth="2" />

        {/* Torso */}
        <path
          d="M 18 48 Q 18 44 22 42 L 46 42 Q 50 44 50 48 L 50 66 Q 50 70 46 72 L 22 72 Q 18 70 18 66 Z"
          fill={topColor}
          stroke={STROKE}
          strokeWidth="2"
        />

        {/* Waistband */}
        <path
          d="M 18 66 L 18 70 L 26 70 L 30 70 L 38 70 L 42 70 L 50 70 L 50 66 Z"
          fill={bottomColor}
          stroke={STROKE}
          strokeWidth="2"
        />

        {/* Arms */}
        <g transform={`rotate(${armLeftAngle} 18 50)`}>
          <path d="M 18 48 L 6 64 L 4 68" stroke={skin} strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>
        <g transform={`rotate(${armRightAngle} 50 50)`}>
          <path d="M 50 48 L 62 64 L 64 68" stroke={skin} strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>

        {/* Legs */}
        <g transform={`rotate(${legLeftAngle} 26 70)`}>
          <path d="M 24 70 L 20 86 L 18 90" stroke={bottomColor} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>
        <g transform={`rotate(${legRightAngle} 42 70)`}>
          <path d="M 44 70 L 48 86 L 50 90" stroke={bottomColor} strokeWidth="6" strokeLinecap="round" fill="none" />
        </g>

        {/* Feet */}
        <ellipse cx="20" cy="90" rx="9" ry="4" fill="#4b5563" stroke={STROKE} strokeWidth="1.5" />
        <ellipse cx="48" cy="90" rx="9" ry="4" fill="#4b5563" stroke={STROKE} strokeWidth="1.5" />

        {/* Face */}
        <circle cx="26" cy="24" r="3.5" fill={STROKE} />
        <circle cx="42" cy="24" r="3.5" fill={STROKE} />
        <path d="M 26 32 Q 34 38 42 32" stroke={STROKE} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}
