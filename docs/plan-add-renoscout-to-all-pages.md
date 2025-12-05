# Plan: Add RenoScout to All Main Pages (AdminPanel, Dashboard, etc.)

## Goal
Integrate RenoScout into all main app pages (AdminPanel, Dashboard, etc.) wherever CalcReno and RenoTimeline are shown, using the same UI patterns and mock data approach.

## Steps

1. **Identify All Relevant Pages**
   - AdminPanel (`src/pages/AdminPanel.tsx`)
   - Dashboard (`src/pages/Dashboard.tsx`)
   - Any other page where CalcReno/RenoTimeline are listed or managed

2. **Locate App Listing/Management Sections**
   - Find the sections/components that render app cards, tables, or lists for CalcReno and RenoTimeline.

3. **Add RenoScout to UI**
   - Duplicate the structure for CalcReno/RenoTimeline for RenoScout.
   - Use the same card/list/table style, badges, and icon (`/Renoscout logo.png`).
   - Use mock data for RenoScout (status, stats, etc.) as with the other apps.
   - Ensure the card/list item links to `/renoscout` or shows "Coming soon" if appropriate.

4. **Update Data Structures**
   - If there is a data array/object for apps, add a mock entry for RenoScout.
   - Example:
     ```js
     {
       id: 'renoscout',
       name: 'RenoScout',
       icon: '/Renoscout logo.png',
       type: 'Web App',
       status: 'coming_soon',
       ...otherMockFields
     }
     ```

5. **Test Responsiveness and Consistency**
   - Make sure RenoScout appears and behaves like the other apps on all screen sizes.
   - Check for hover, animation, and style consistency.

6. **Polish & Commit**
   - Review for visual and code consistency.
   - Commit with a clear message.

---

**Optional:**
- Add a tooltip or badge indicating "Coming soon" if not already present.
- If there are app-specific actions, disable or mock them for RenoScout. 