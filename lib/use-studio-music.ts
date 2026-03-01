'use client'

import { useRef, useEffect } from 'react'

const SOURCES = [
  'https://cdn.pixabay.com/audio/2024/11/28/audio_3a88886f1d.mp3',
  'https://cdn.pixabay.com/audio/2022/10/12/audio_860740b4b4.mp3',
]

export function useStudioMusic(active: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (!active) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
      return
    }

    const audio = new Audio()
    audio.loop = true
    audio.volume = 0.3
    audio.src = SOURCES[Math.floor(Math.random() * SOURCES.length)]
    audioRef.current = audio
    audio.play().catch(() => {})

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [active])
}
