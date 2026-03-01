export interface Pose {
  armL: number
  armR: number
  legL: number
  legR: number
  bodyY: number
  bodyRotate: number
}

const IDLE: Pose = { armL: 0, armR: 0, legL: 0, legR: 0, bodyY: 0, bodyRotate: 0 }

export const POSES: Record<string, Pose> = {
  idle: IDLE,
  wave: { armL: 0, armR: -80, legL: 0, legR: 0, bodyY: 0, bodyRotate: 0 },
  cheer: { armL: -70, armR: -70, legL: 0, legR: 0, bodyY: -4, bodyRotate: 0 },
  jump: { armL: -60, armR: -60, legL: -20, legR: -20, bodyY: -18, bodyRotate: 0 },
  land: { armL: 20, armR: 20, legL: 10, legR: 10, bodyY: 4, bodyRotate: 0 },
  arabesque: { armL: -50, armR: 60, legL: 0, legR: -40, bodyY: -2, bodyRotate: -8 },
  plie: { armL: -30, armR: -30, legL: 20, legR: -20, bodyY: 6, bodyRotate: 0 },
  swayLeft: { armL: 20, armR: -30, legL: 5, legR: -5, bodyY: 0, bodyRotate: -12 },
  swayRight: { armL: -30, armR: 20, legL: -5, legR: 5, bodyY: 0, bodyRotate: 12 },
  spin1: { armL: -50, armR: -50, legL: 0, legR: 0, bodyY: -6, bodyRotate: 0 },
  spin2: { armL: -50, armR: -50, legL: 0, legR: 0, bodyY: -6, bodyRotate: 0 },
  kick: { armL: 10, armR: -40, legL: -35, legR: 0, bodyY: -2, bodyRotate: -5 },
  bow: { armL: 15, armR: 15, legL: 0, legR: 0, bodyY: 8, bodyRotate: 15 },
  hipHop1: { armL: -65, armR: 30, legL: -20, legR: 10, bodyY: -2, bodyRotate: -6 },
  hipHop2: { armL: 30, armR: -65, legL: 10, legR: -20, bodyY: -2, bodyRotate: 6 },
  funky1: { armL: -80, armR: 40, legL: 15, legR: -25, bodyY: -4, bodyRotate: -10 },
  funky2: { armL: 40, armR: -80, legL: -25, legR: 15, bodyY: -4, bodyRotate: 10 },
}

export const DANCE_SEQUENCES: Record<string, string[]> = {
  sway: ['idle', 'swayLeft', 'idle', 'swayRight', 'idle'],
  ballet: ['idle', 'plie', 'arabesque', 'cheer', 'idle'],
  jumpDance: ['idle', 'plie', 'jump', 'land', 'idle'],
  hipHop: ['idle', 'hipHop1', 'hipHop2', 'hipHop1', 'idle'],
  funky: ['idle', 'funky1', 'funky2', 'funky1', 'idle'],
  celebrate: ['idle', 'cheer', 'jump', 'land', 'wave', 'idle'],
  kickSpin: ['idle', 'kick', 'spin1', 'cheer', 'idle'],
}
