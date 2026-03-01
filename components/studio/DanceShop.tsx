'use client'

import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

/* ------------------------------------------------------------------
   Shop item data
   ------------------------------------------------------------------ */

interface ShopItem {
  id: string
  name: string
  price: number
  category: string
  colors: string[]
  sizes: string[]
  icon: React.ReactNode
}

const SHOP_ITEMS: ShopItem[] = [
  {
    id: 'leotard-classic', name: 'Classic Leotard', price: 28, category: 'Leotards',
    colors: ['#ec4899', '#312e81', '#c4b5fd', '#e11d48', '#1e293b'],
    sizes: ['XS', 'S', 'M', 'L'],
    icon: <svg width="40" height="56" viewBox="0 0 40 56" fill="none"><path d="M 10 8 L 10 36 Q 10 40 14 40 L 26 40 Q 30 40 30 36 L 30 8 Q 28 2 20 2 Q 12 2 10 8 Z" fill="currentColor" stroke="#1e293b" strokeWidth="1.5" /><path d="M 10 8 L 4 18" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" /><path d="M 30 8 L 36 18" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" /></svg>,
  },
  {
    id: 'leotard-wrap', name: 'Wrap-Front Leotard', price: 32, category: 'Leotards',
    colors: ['#f9a8d4', '#a78bfa', '#fff', '#fbbf24'],
    sizes: ['XS', 'S', 'M', 'L'],
    icon: <svg width="40" height="56" viewBox="0 0 40 56" fill="none"><path d="M 10 8 L 10 36 Q 10 40 14 40 L 26 40 Q 30 40 30 36 L 30 8 Q 28 2 20 2 Q 12 2 10 8 Z" fill="currentColor" stroke="#1e293b" strokeWidth="1.5" /><path d="M 14 8 L 20 20 L 26 8" stroke="#1e293b" strokeWidth="1" fill="none" opacity="0.3" /></svg>,
  },
  {
    id: 'tutu-classic', name: 'Classic Tutu', price: 35, category: 'Tutus',
    colors: ['#fce7f3', '#f8fafc', '#ddd6fe', '#fbbf24'],
    sizes: ['S', 'M', 'L'],
    icon: <svg width="44" height="50" viewBox="0 0 44 50" fill="none"><rect x="16" y="2" width="12" height="18" rx="3" fill="currentColor" stroke="#1e293b" strokeWidth="1.5" /><ellipse cx="22" cy="24" rx="20" ry="10" fill="currentColor" stroke="#1e293b" strokeWidth="1.5" opacity="0.8" /><ellipse cx="22" cy="24" rx="15" ry="7" fill="currentColor" opacity="0.5" /></svg>,
  },
  {
    id: 'tutu-romantic', name: 'Romantic Tutu', price: 38, category: 'Tutus',
    colors: ['#fbcfe8', '#e9d5ff', '#fef3c7'],
    sizes: ['S', 'M', 'L'],
    icon: <svg width="44" height="50" viewBox="0 0 44 50" fill="none"><rect x="16" y="2" width="12" height="18" rx="3" fill="currentColor" stroke="#1e293b" strokeWidth="1.5" /><ellipse cx="22" cy="26" rx="20" ry="14" fill="currentColor" stroke="#1e293b" strokeWidth="1.5" opacity="0.6" /><ellipse cx="22" cy="28" rx="18" ry="12" fill="currentColor" opacity="0.4" /></svg>,
  },
  {
    id: 'ballet-shoes', name: 'Ballet Slippers', price: 22, category: 'Shoes',
    colors: ['#fde68a', '#fce7f3', '#fff'],
    sizes: ['1', '2', '3', '4', '5'],
    icon: <svg width="44" height="36" viewBox="0 0 44 36" fill="none"><path d="M 6 22 Q 4 12 8 8 Q 12 4 16 8 L 18 16 Q 20 22 16 24 L 6 24 Z" fill="currentColor" stroke="#1e293b" strokeWidth="1.2" /><path d="M 26 22 Q 24 12 28 8 Q 32 4 36 8 L 38 16 Q 40 22 36 24 L 26 24 Z" fill="currentColor" stroke="#1e293b" strokeWidth="1.2" /></svg>,
  },
  {
    id: 'jazz-shoes', name: 'Jazz Shoes', price: 38, category: 'Shoes',
    colors: ['#1e293b', '#78350f', '#dc2626'],
    sizes: ['1', '2', '3', '4', '5'],
    icon: <svg width="44" height="36" viewBox="0 0 44 36" fill="none"><path d="M 4 20 L 6 10 Q 8 4 14 4 L 20 4 Q 22 4 22 8 L 22 20 Q 20 26 12 26 L 4 26 Z" fill="currentColor" stroke="#1e293b" strokeWidth="1.2" /><rect x="4" y="24" width="20" height="4" rx="2" fill="#1e293b" opacity="0.3" /></svg>,
  },
  {
    id: 'pointe-shoes', name: 'Pointe Shoes', price: 48, category: 'Shoes',
    colors: ['#fde68a', '#fce7f3'],
    sizes: ['2', '3', '4', '5'],
    icon: <svg width="44" height="44" viewBox="0 0 44 44" fill="none"><path d="M 10 30 L 12 10 Q 14 2 22 2 Q 30 2 32 10 L 34 30" fill="currentColor" stroke="#1e293b" strokeWidth="1.2" /><rect x="8" y="28" width="28" height="6" rx="3" fill="currentColor" stroke="#1e293b" strokeWidth="1.2" /><path d="M 16 10 Q 22 6 28 10" stroke="#1e293b" strokeWidth="0.8" fill="none" opacity="0.3" /></svg>,
  },
  {
    id: 'dance-bag', name: "Ev's Dance Bag", price: 22, category: 'Accessories',
    colors: ['#a78bfa', '#ec4899', '#1e293b'],
    sizes: ['One Size'],
    icon: <svg width="40" height="44" viewBox="0 0 40 44" fill="none"><path d="M 10 14 Q 10 4 20 4 Q 30 4 30 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><rect x="4" y="14" width="32" height="24" rx="4" fill="currentColor" stroke="#1e293b" strokeWidth="1.5" /></svg>,
  },
  {
    id: 'hair-kit', name: 'Hair Accessories Kit', price: 12, category: 'Accessories',
    colors: ['#ec4899', '#a78bfa', '#fbbf24'],
    sizes: ['One Size'],
    icon: <svg width="40" height="36" viewBox="0 0 40 36" fill="none"><circle cx="12" cy="12" r="6" fill="currentColor" stroke="#1e293b" strokeWidth="1.2" /><circle cx="28" cy="12" r="6" fill="currentColor" stroke="#1e293b" strokeWidth="1.2" /><rect x="8" y="24" width="24" height="6" rx="3" fill="currentColor" stroke="#1e293b" strokeWidth="1.2" /></svg>,
  },
  {
    id: 'water-bottle', name: "Ev's Water Bottle", price: 15, category: 'Accessories',
    colors: ['#7c3aed', '#ec4899', '#22c55e'],
    sizes: ['One Size'],
    icon: <svg width="30" height="48" viewBox="0 0 30 48" fill="none"><rect x="8" y="10" width="14" height="32" rx="4" fill="currentColor" stroke="#1e293b" strokeWidth="1.5" /><rect x="10" y="4" width="10" height="8" rx="2" fill="#94a3b8" stroke="#1e293b" strokeWidth="1.2" /></svg>,
  },
]

const CATEGORIES = ['All', 'Leotards', 'Tutus', 'Shoes', 'Accessories']

/* ------------------------------------------------------------------
   Styles (inline objects)
   ------------------------------------------------------------------ */

const styles = {
  container: {
    position: 'fixed' as const,
    inset: 0,
    zIndex: 200,
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #4c1d95 100%)',
    display: 'flex',
    flexDirection: 'column' as const,
  },
  topBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '10px 20px',
    background: 'linear-gradient(180deg, #7c3aedee 0%, #a855f7cc 100%)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)',
    flexShrink: 0,
  },
  backBtn: {
    padding: '7px 14px',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#7c3aed',
    background: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  title: {
    margin: 0,
    fontSize: '1.4rem',
    fontWeight: 700,
    color: '#fff',
    textShadow: '0 1px 4px rgba(0,0,0,0.2)',
  },
  bagBtn: {
    marginLeft: 'auto',
    padding: '6px 14px',
    fontFamily: 'sans-serif',
    fontSize: '0.85rem',
    fontWeight: 700,
    color: '#fff',
    background: 'rgba(255,255,255,0.15)',
    border: '2px solid rgba(255,255,255,0.4)',
    borderRadius: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  bagCount: {
    background: '#ec4899',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 800,
    padding: '1px 6px',
    borderRadius: 10,
    minWidth: 18,
    textAlign: 'center' as const,
  },
  categories: {
    display: 'flex',
    gap: 8,
    padding: '14px 20px',
    flexShrink: 0,
    flexWrap: 'wrap' as const,
  },
  catBtn: (active: boolean) => ({
    padding: '8px 18px',
    fontFamily: 'sans-serif',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: active ? '#fff' : 'rgba(255,255,255,0.7)',
    background: active ? '#7c3aed' : 'rgba(255,255,255,0.08)',
    border: `2px solid ${active ? '#a855f7' : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 20,
    cursor: 'pointer',
    transition: 'all 0.2s',
  }),
  grid: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '0 20px 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: 14,
    alignContent: 'start' as const,
  },
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 8,
    padding: '18px 12px',
    background: 'rgba(255,255,255,0.08)',
    border: '2px solid rgba(255,255,255,0.12)',
    borderRadius: 14,
    cursor: 'pointer',
    transition: 'transform 0.15s, background 0.2s, box-shadow 0.2s',
  },
  cardIcon: {
    width: 60,
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    fontFamily: 'sans-serif',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: '#fff',
    textAlign: 'center' as const,
  },
  cardPrice: {
    fontFamily: 'sans-serif',
    fontSize: '0.85rem',
    fontWeight: 800,
    color: '#a855f7',
  },
  detail: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '0 20px 20px',
  },
  detailBackBtn: {
    padding: '6px 14px',
    fontFamily: 'sans-serif',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'rgba(255,255,255,0.8)',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    cursor: 'pointer',
    marginBottom: 14,
  },
  detailBody: {
    display: 'flex',
    gap: 30,
    alignItems: 'flex-start' as const,
    flexWrap: 'wrap' as const,
  },
  detailPreview: (color: string) => ({
    width: 180,
    height: 180,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.06)',
    border: '2px solid rgba(255,255,255,0.1)',
    borderRadius: 16,
    flexShrink: 0,
    color,
  }),
  detailInfo: {
    flex: 1,
    minWidth: 200,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 14,
  },
  detailName: {
    margin: 0,
    fontFamily: 'sans-serif',
    fontSize: '1.4rem',
    fontWeight: 800,
    color: '#fff',
  },
  detailPrice: {
    fontFamily: 'sans-serif',
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#a855f7',
  },
  optionLabel: {
    fontFamily: 'sans-serif',
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'rgba(255,255,255,0.6)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.08em',
  },
  swatch: (color: string, active: boolean) => ({
    width: 30,
    height: 30,
    borderRadius: '50%',
    border: `3px solid ${active ? '#fff' : 'transparent'}`,
    background: color,
    cursor: 'pointer',
    transition: 'transform 0.15s, border-color 0.15s',
    boxShadow: active ? '0 0 12px rgba(255,255,255,0.4)' : 'none',
  }),
  sizeBtn: (active: boolean) => ({
    padding: '6px 14px',
    fontFamily: 'sans-serif',
    fontSize: '0.8rem',
    fontWeight: 700,
    color: active ? '#fff' : 'rgba(255,255,255,0.7)',
    background: active ? '#7c3aed' : 'rgba(255,255,255,0.08)',
    border: `2px solid ${active ? '#a855f7' : 'rgba(255,255,255,0.15)'}`,
    borderRadius: 8,
    cursor: 'pointer',
    transition: 'all 0.15s',
  }),
  addBtn: (added: boolean) => ({
    padding: '12px 28px',
    fontFamily: 'sans-serif',
    fontSize: '1rem',
    fontWeight: 800,
    color: '#fff',
    background: added
      ? 'linear-gradient(135deg, #16a34a, #22c55e)'
      : 'linear-gradient(135deg, #7c3aed, #a855f7)',
    border: `2px solid rgba(255,255,255,${added ? 0.4 : 0.3})`,
    borderRadius: 12,
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(124,58,237,0.4)',
    alignSelf: 'flex-start',
    transition: 'transform 0.15s, box-shadow 0.15s',
  }),
  bagPanel: {
    position: 'absolute' as const,
    top: 52,
    right: 0,
    width: 320,
    maxHeight: 'calc(100vh - 52px)',
    background: 'rgba(30,27,75,0.97)',
    borderLeft: '2px solid rgba(168,85,247,0.3)',
    backdropFilter: 'blur(12px)',
    zIndex: 60,
    display: 'flex',
    flexDirection: 'column' as const,
    overflowY: 'auto' as const,
  },
  bagHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  bagClose: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    fontSize: '1.1rem',
    cursor: 'pointer',
    padding: '4px 8px',
  },
  bagItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },
  bagItemSwatch: (color: string) => ({
    width: 18,
    height: 18,
    borderRadius: '50%',
    border: '2px solid rgba(255,255,255,0.3)',
    background: color,
    flexShrink: 0,
  }),
  bagTotal: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    borderTop: '2px solid rgba(255,255,255,0.1)',
    fontFamily: 'sans-serif',
    fontWeight: 700,
    color: '#fff',
  },
  checkoutBtn: {
    margin: '0 16px 16px',
    padding: 12,
    fontFamily: 'sans-serif',
    fontSize: '0.95rem',
    fontWeight: 800,
    color: '#fff',
    background: 'linear-gradient(135deg, #ec4899, #a855f7)',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: 12,
    cursor: 'pointer',
  },
}

/* ------------------------------------------------------------------
   Bag item type
   ------------------------------------------------------------------ */

interface BagItem {
  item: ShopItem
  color: string
  size: string
  qty: number
}

/* ------------------------------------------------------------------
   DanceShop component
   ------------------------------------------------------------------ */

export interface PurchasedOutfit {
  name: string
  topColor: string
  bottomColor: string
}

interface DanceShopProps {
  onBack: () => void
  onCheckout?: (itemCount: number, outfits: PurchasedOutfit[]) => void
}

export function DanceShop({ onBack, onCheckout }: DanceShopProps) {
  const [category, setCategory] = useState('All')
  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)
  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [bag, setBag] = useState<BagItem[]>([])
  const [showBag, setShowBag] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const filtered = category === 'All' ? SHOP_ITEMS : SHOP_ITEMS.filter((i) => i.category === category)

  const addToBag = useCallback(() => {
    if (!selectedItem || !selectedColor || !selectedSize) return
    setBag((prev) => {
      const exists = prev.find(
        (b) => b.item.id === selectedItem.id && b.color === selectedColor && b.size === selectedSize,
      )
      if (exists) return prev.map((b) => (b === exists ? { ...b, qty: b.qty + 1 } : b))
      return [...prev, { item: selectedItem, color: selectedColor, size: selectedSize, qty: 1 }]
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1500)
  }, [selectedItem, selectedColor, selectedSize])

  const removeFromBag = useCallback((idx: number) => {
    setBag((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const bagTotal = bag.reduce((sum, b) => sum + b.item.price * b.qty, 0)
  const bagCount = bag.reduce((sum, b) => sum + b.qty, 0)

  return (
    <div style={styles.container}>
      {/* Top bar */}
      <div style={styles.topBar}>
        <button type="button" style={styles.backBtn} onClick={onBack}>
          ← Back to Lobby
        </button>
        <h1 style={styles.title}>Ev&apos;s Dance Shop</h1>
        <button type="button" style={styles.bagBtn} onClick={() => setShowBag(!showBag)}>
          🛍️ Bag {bagCount > 0 && <span style={styles.bagCount}>{bagCount}</span>}
        </button>
      </div>

      {/* Category tabs */}
      <div style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            style={styles.catBtn(category === cat)}
            onClick={() => {
              setCategory(cat)
              setSelectedItem(null)
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid / detail with AnimatePresence */}
      <AnimatePresence mode="wait">
        {!selectedItem ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={styles.grid}
          >
            {filtered.map((item) => (
              <motion.button
                layout
                key={item.id}
                type="button"
                style={styles.card}
                onClick={() => {
                  setSelectedItem(item)
                  setSelectedColor(item.colors[0])
                  setSelectedSize(item.sizes[0])
                }}
                whileHover={{
                  y: -3,
                  background: 'rgba(255,255,255,0.14)',
                  boxShadow: '0 8px 24px rgba(124,58,237,0.3)',
                }}
              >
                <div style={{ ...styles.cardIcon, color: item.colors[0] }}>
                  {item.icon}
                </div>
                <div style={styles.cardName}>{item.name}</div>
                <div style={styles.cardPrice}>${item.price}</div>
              </motion.button>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            style={styles.detail}
          >
            <button
              type="button"
              style={styles.detailBackBtn}
              onClick={() => setSelectedItem(null)}
            >
              ← All {selectedItem.category}
            </button>
            <div style={styles.detailBody}>
              <div style={styles.detailPreview(selectedColor)}>
                <div style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedItem.icon}
                </div>
              </div>
              <div style={styles.detailInfo}>
                <h2 style={styles.detailName}>{selectedItem.name}</h2>
                <div style={styles.detailPrice}>${selectedItem.price}</div>

                {/* Color swatches */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={styles.optionLabel}>Color</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {selectedItem.colors.map((c) => (
                      <button
                        key={c}
                        type="button"
                        style={styles.swatch(c, selectedColor === c)}
                        onClick={() => setSelectedColor(c)}
                      />
                    ))}
                  </div>
                </div>

                {/* Size buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <span style={styles.optionLabel}>Size</span>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {selectedItem.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        style={styles.sizeBtn(selectedSize === s)}
                        onClick={() => setSelectedSize(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  style={styles.addBtn(justAdded)}
                  onClick={addToBag}
                >
                  {justAdded ? '✓ Added to Bag!' : 'Add to Bag'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Shopping bag side panel */}
      <AnimatePresence>
        {showBag && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={styles.bagPanel}
          >
            <div style={styles.bagHeader}>
              <h3 style={{ margin: 0, fontFamily: 'sans-serif', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>
                Shopping Bag
              </h3>
              <button type="button" style={styles.bagClose} onClick={() => setShowBag(false)}>
                ✕
              </button>
            </div>

            {bag.length === 0 ? (
              <p style={{ padding: '30px 16px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontFamily: 'sans-serif', fontSize: '0.85rem' }}>
                Your bag is empty
              </p>
            ) : (
              <>
                <div style={{ padding: '8px 0' }}>
                  {bag.map((b, i) => (
                    <div key={i} style={styles.bagItem}>
                      <div style={styles.bagItemSwatch(b.color)} />
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <span style={{ fontFamily: 'sans-serif', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                          {b.item.name}
                        </span>
                        <span style={{ fontFamily: 'sans-serif', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
                          Size {b.size} × {b.qty}
                        </span>
                      </div>
                      <span style={{ fontFamily: 'sans-serif', fontSize: '0.85rem', fontWeight: 800, color: '#a855f7', flexShrink: 0 }}>
                        ${b.item.price * b.qty}
                      </span>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', cursor: 'pointer', padding: '2px 6px' }}
                        onClick={() => removeFromBag(i)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                <div style={styles.bagTotal}>
                  <span>Total</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#a855f7' }}>
                    ${bagTotal}
                  </span>
                </div>
                <button
                  type="button"
                  style={styles.checkoutBtn}
                  onClick={() => {
                    if (onCheckout) {
                      const outfits: PurchasedOutfit[] = bag.map((b) => {
                        const isTop = b.item.category === 'Leotards'
                        const isBottom = b.item.category === 'Tutus'
                        return {
                          name: b.item.name,
                          topColor: isTop ? b.color : (isBottom ? '' : b.color),
                          bottomColor: isBottom ? b.color : '',
                        }
                      })
                      onCheckout(bagCount, outfits)
                      setBag([])
                      setShowBag(false)
                    }
                  }}
                >
                  Checkout
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
