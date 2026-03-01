'use client'

import gsap from 'gsap'
import { POSES, DANCE_SEQUENCES, type Pose } from './poses'

const BEAT = 0.4

export function createDanceTimeline(
  onPoseChange: (pose: Pose) => void,
  sequenceName?: string,
): gsap.core.Timeline {
  const names = Object.keys(DANCE_SEQUENCES)
  const name = sequenceName ?? names[Math.floor(Math.random() * names.length)]
  const seq = DANCE_SEQUENCES[name] ?? DANCE_SEQUENCES.sway

  const tl = gsap.timeline()
  seq.forEach((poseName) => {
    tl.call(() => onPoseChange(POSES[poseName] ?? POSES.idle), [], `+=${BEAT}`)
  })
  tl.call(() => onPoseChange(POSES.idle))
  return tl
}

export function createGroupTimeline(
  count: number,
  onPoseChange: (index: number, pose: Pose) => void,
): gsap.core.Timeline {
  const names = Object.keys(DANCE_SEQUENCES)
  const master = gsap.timeline()

  for (let i = 0; i < count; i++) {
    const seqName = names[Math.floor(Math.random() * names.length)]
    const seq = DANCE_SEQUENCES[seqName]
    const child = gsap.timeline()

    seq.forEach((poseName) => {
      child.call(() => onPoseChange(i, POSES[poseName] ?? POSES.idle), [], `+=${BEAT + (i % 3) * 0.06}`)
    })
    child.call(() => onPoseChange(i, POSES.idle))

    master.add(child, i * 0.08)
  }

  return master
}

export function pickRandomSequenceName(): string {
  const names = Object.keys(DANCE_SEQUENCES)
  return names[Math.floor(Math.random() * names.length)]
}
