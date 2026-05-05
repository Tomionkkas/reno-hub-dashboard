# Dashboard Constellation Explorer — Design Spec

**Date:** 2026-05-05  
**Status:** Approved for implementation

---

## Problem

The `/dashboard` page currently shows subscription management UI, pricing plans, and active subscription counts. No apps have live subscriptions yet, so showing this to real users creates confusion and sets wrong expectations. The page needs to be hidden behind something that is both beautiful and useful.

## Solution

Replace the dashboard content with a full-viewport interactive experience called the **Constellation Explorer** — shown only when the logged-in user has no active subscriptions. When subscriptions go live, the condition flips and the real dashboard renders as normal.

The Constellation Explorer teaches users about the three RenoHub apps through interaction, then funnels them to the lead magnet: `/kalkulator-remontu`.

---

## Rendering Condition

In `Dashboard.tsx`, wrap the existing dashboard JSX in a condition:

```
if (user has no active subscriptions) → render <ConstellationExplorer />
else → render existing dashboard content
```

The existing dashboard code is **not deleted** — just conditionally hidden. Condition source: `user.subscriptions` array from `AuthContext`.

---

## ConstellationExplorer Component

### Layout

Full-viewport (`100dvh`), dark background (`#080c14` — matches homepage). Three layers stacked:

1. **Star field** — fixed background, subtle mouse parallax on desktop
2. **Constellation** — centered cluster of nodes connected by animated SVG lines
3. **UI layer** — headline text, progress pips, reveal card, CTA button (nav bar is rendered by the existing app layout, not by this component)

### Entry Animation (GSAP)

Staggered on mount:
1. Stars fade in (0–0.6s)
2. SVG constellation lines draw using `stroke-dashoffset` (0.4–1s)
3. App nodes scale in with spring bounce, staggered 0.15s apart (0.8–1.3s)
4. Headline text fades up (1s)

### Star Field

- 80–100 randomly placed `div` elements, 1–3px, white, varying opacity
- CSS `twinkle` keyframe per star, randomised duration (2–5s) and delay
- On `mousemove` (desktop only): star layer translates by ±1.5% of cursor offset (parallax)
- On mobile: no parallax, static star field

### Constellation Nodes

Three app nodes positioned around a central RenoHub hub node:

| Node | App | Icon | Position |
|---|---|---|---|
| Hub | RenoHub | Existing brand mark SVG | Center |
| 1 | CalcReno | Existing CalcReno SVG icon | Top-left |
| 2 | RenoTimeline | Existing RenoTimeline SVG icon | Top-right |
| 3 | RenoScout | Existing RenoScout SVG icon | Bottom-center |

Node sizing: `88px` on desktop, `72px` on mobile.  
Nodes have a slow `bob` animation (translateY ±8px, 4s ease-in-out, staggered delays).  
SVG lines connecting each app node to the hub: dashed, animated `stroke-dashoffset`, gradient stroke (`#6366f1` → `#ec4899`).

### Unlock Interaction

When user clicks an app node (one at a time, in any order):

1. Full-frame **glitch flash** — brief rgba overlay, 300ms, eases out
2. Node ring brightens to solid `#6366f1`, checkmark badge appears
3. **Reveal card** slides up near the top of the frame (below nav), shows:
   - App icon + name + category tag
   - One-sentence description (Polish)
   - One bold benefit line (Polish)
   - Auto-dismisses after 3.5s or on next node click
4. Corresponding **progress pip** fills with gradient

Clicking an already-unlocked node does nothing.

### App Copy (Polish)

**CalcReno**  
Tag: Kalkulator materiałów  
Desc: Oblicz dokładny kosztorys remontu — materiały, robocizna, rezerwy. Koniec z niespodziankami na budowie.  
Benefit: ✦ Oszczędź średnio 3 000 zł dzięki precyzyjnej wycenie

**RenoTimeline**  
Tag: Harmonogram prac  
Desc: Zarządzaj całym projektem remontowym. Etapy, ekipy, terminy — wszystko w jednym miejscu.  
Benefit: ✦ Redukuj opóźnienia o 60% dzięki inteligentnemu harmonogramowaniu

**RenoScout**  
Tag: AI · Wkrótce  
Desc: Sztuczna inteligencja analizuje okazje inwestycyjne w nieruchomościach. Znajdź perełki zanim zrobi to konkurencja.  
Benefit: ✦ AI skanuje tysiące ofert — Ty dostajesz tylko najlepsze

### CTA Reveal (after all 3 unlocked)

- Headline text fades out (0.4s)
- CTA button materialises from center with scale bounce (GSAP spring)
- Button: gradient background (`#6366f1` → `#ec4899`), pill shape, full-width on mobile, auto-width on desktop
- Button text: **"Zacznij od liczb — kalkulator remontu →"**
- Continuous pulse animation on button (`box-shadow` breathe, 2s loop)
- On click: full-frame fade out (0.5s) → `navigate('/kalkulator-remontu')` via React Router `useNavigate`

### Progress Pips

Three horizontal pill indicators, bottom-center of frame.  
Empty state: `rgba(255,255,255,0.08)`.  
Filled state: gradient `#6366f1` → `#818cf8`, transition 0.4s.

---

## Mobile Layout

- Nodes arranged vertically (column stack) instead of triangular cluster
- SVG lines hidden on mobile (too cramped)
- Node size: 72px
- Reveal card: full-width, slides up from bottom (like a bottom sheet), 80% height max
- CTA button: full-width, fixed to bottom of viewport with safe-area padding
- No mouse parallax

---

## File Structure

```
src/
  components/
    dashboard/
      ConstellationExplorer.tsx   ← new component
      ConstellationExplorer.css   ← keyframe animations (twinkle, bob, glitch, dashmove)
  pages/
    Dashboard.tsx                 ← conditionally renders ConstellationExplorer
```

---

## What Is Not Changing

- The existing dashboard JSX and logic — it stays, just conditionally hidden
- Auth context, subscription checks, routing — unchanged
- The `/kalkulator-remontu` page — unchanged
- The nav bar — reused as-is inside ConstellationExplorer
