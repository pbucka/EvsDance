'use client'

import dynamic from 'next/dynamic'

const CityScene = dynamic(() => import('@/components/city/CityScene').then(m => ({ default: m.CityScene })), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#87ceeb', color: '#1e293b', fontFamily: 'var(--font-sans)', fontSize: '1.5rem', fontWeight: 700 }}>
      Loading Ev&apos;s Dance...
    </div>
  ),
})

export default function Home() {
  return <CityScene />
}
