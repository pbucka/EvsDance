'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const MUSIC_URL = process.env.NEXT_PUBLIC_MUSIC_URL || '/music/background.mp3'
const VOLUME = 0.22

export function BackgroundMusic() {
  const [playing, setPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = new Audio()
    audio.loop = true
    audio.volume = VOLUME
    audio.preload = 'auto'

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => setError('Add public/music/background.mp3 or set NEXT_PUBLIC_MUSIC_URL')

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    audioRef.current = audio
    audio.src = MUSIC_URL

    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audio.src = ''
    }
  }, [])

  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    setError(null)
    try {
      if (playing) {
        audio.pause()
      } else {
        await audio.play()
      }
    } catch {
      setError('Playback failed')
      setPlaying(false)
    }
  }, [playing])

  const label = error
    ? '🔇 Music unavailable'
    : playing
      ? '🔊 Music on'
      : '🔇 Play music'

  return (
    <button
      type="button"
      className="music-toggle"
      onClick={toggle}
      aria-label={playing ? 'Pause background music' : 'Play background music'}
      title={error || (playing ? 'Pause music' : 'Play music')}
    >
      {label}
    </button>
  )
}
