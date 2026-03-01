# Ev's Dance

An interactive dance studio adventure built with Next.js, GSAP, Framer Motion, and React Three Fiber.

## Tech Stack

- **Next.js 16** (App Router) — Framework, routing, API routes, SSR/SSG
- **GSAP** (+ ScrollTrigger, @gsap/react) — Animation timelines, parallax scrolling, dance sequencing
- **Framer Motion** — Spring physics for character limbs, AnimatePresence transitions, layout animations
- **React Three Fiber** + **drei** — Real 3D studio/store interiors with lighting, reflections, and camera
- **Three.js** — 3D rendering engine (via R3F)
- **Tailwind CSS** — Utility styles
- **TypeScript** — Full type safety

## Features

- Scrollable city with neighborhood, storefronts, and dance studio
- Draggable cars and characters with smooth physics
- 10-house residential neighborhood
- 7 themed store interiors (Burger, Coffee, Target, Hardware, Pharmacy, Pizza, Bakery)
- Dance studio with 3D lobby, ballet studio, hip-hop studio
- Pose-based character animation with GSAP timelines
- Dance shop with product browsing, color/size selection, and shopping bag
- Background music in studio rooms

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

- `GET /api/health` — Health check
- `POST /api/claude/complete` — Claude AI completion (requires `EVS_ANTHROPIC_API_KEY`)

## Environment Variables

Create a `.env.local` file:

```env
EVS_ANTHROPIC_API_KEY=your-key-here
EVS_REDIS_HOST=localhost
EVS_REDIS_PORT=6379
EVS_REDIS_DB=0
```

## Project Structure

```
app/                    — Next.js App Router pages and API routes
components/
  city/                 — City scene, storefronts, neighborhood
  vehicles/             — Car and minivan SVGs
  characters/           — CartoonPerson (Framer Motion), Draggable
  studio/               — Dance studio (R3F 3D), lobby, shop
  store/                — Store interiors (R3F 3D)
  ui/                   — Shared UI components
lib/                    — Poses, GSAP dance timelines, hooks, API client
```
