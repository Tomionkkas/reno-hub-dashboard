# Plan: Add RenoScout App Box to 'Nasze Aplikacje' Section

## Goal
Add a third app card for RenoScout to the 'Nasze Aplikacje' section on the main page, using the provided logo and a concise description based on the reference.

## Steps

1. **Locate the Apps Section**
   - File: `src/pages/Index.tsx`
   - Section: `<section aria-labelledby="apps-heading">` with the two existing app cards (CalcReno, RenoTimeline).

2. **Prepare Logo**
   - Use the file: `public/Renoscout logo.png` as the app icon.
   - Reference as `/Renoscout logo.png` in the `OptimizedImage` component.

3. **Create RenoScout Card**
   - Copy the structure of the existing cards (use `AnimatedCard`, `AnimatedCardHeader`, etc.).
   - Title: `RenoScout`
   - Description (suggested, can be tweaked):
     > "AI-powered platform for discovering and analyzing real estate investment opportunities in Poland. Automates property data collection, market analysis, and investment scoring."
   - Badges: `Web App`, `AI`, `Poland`

4. **Update Grid Layout**
   - Change the grid from `md:grid-cols-2` to `md:grid-cols-3` to fit three cards.
   - Adjust spacing if needed for visual balance.

5. **Test Responsiveness**
   - Ensure the new card displays well on all screen sizes.
   - Check for overflow or layout issues.

6. **Polish & Commit**
   - Review for consistency in style and animation.
   - Commit changes with a clear message.

---

**Optional:**
- Consider adding a hover effect or unique accent color for RenoScout.
- If the logo background looks off, tweak the card's background or padding. 