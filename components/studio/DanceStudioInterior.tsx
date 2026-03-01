'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const StudioLobby = dynamic(
  () => import('./StudioLobby').then((m) => ({ default: m.StudioLobby })),
  { ssr: false },
)
const StudioRoom = dynamic(
  () => import('./StudioRoom').then((m) => ({ default: m.StudioRoom })),
  { ssr: false },
)
const DanceShop = dynamic(
  () => import('./DanceShop').then((m) => ({ default: m.DanceShop })),
  { ssr: false },
)

type ActiveRoom = 'lobby' | 'studio-a' | 'studio-b' | 'shop'

interface Props {
  onExit: () => void
}

interface PurchasedOutfit {
  name: string
  topColor: string
  bottomColor: string
}

export function DanceStudioInterior({ onExit }: Props) {
  const [activeRoom, setActiveRoom] = useState<ActiveRoom>('lobby')
  const [purchasedBagCount, setPurchasedBagCount] = useState(0)
  const [purchasedOutfits, setPurchasedOutfits] = useState<PurchasedOutfit[]>([])

  const handleCheckout = useCallback((itemCount: number, outfits: PurchasedOutfit[]) => {
    setPurchasedBagCount((prev) => prev + itemCount)
    setPurchasedOutfits((prev) => [...prev, ...outfits])
    setActiveRoom('lobby')
  }, [])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeRoom}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{ position: 'fixed', inset: 0, zIndex: 200 }}
      >
        {activeRoom === 'lobby' && (
          <StudioLobby
            onExit={onExit}
            onEnterRoom={(room: string) => setActiveRoom(room as ActiveRoom)}
            purchasedBagCount={purchasedBagCount}
            purchasedOutfits={purchasedOutfits}
          />
        )}
        {activeRoom === 'studio-a' && (
          <StudioRoom
            name="Studio A — Ballet & Contemporary"
            theme="ballet"
            onBack={() => setActiveRoom('lobby')}
          />
        )}
        {activeRoom === 'studio-b' && (
          <StudioRoom
            name="Studio B — Hip Hop & Jazz"
            theme="hiphop"
            onBack={() => setActiveRoom('lobby')}
          />
        )}
        {activeRoom === 'shop' && (
          <DanceShop onBack={() => setActiveRoom('lobby')} onCheckout={handleCheckout} />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
