# Frontend TODO - Dashboard UI Refinement

- [ ] Refactor `src/pages/Dashboard.jsx`:
  - [ ] Replace current analytics + quote + feature navigation layout with new compact structure.
  - [ ] Create a responsive one-row analytics grid (6 cards: Journal Entries, Mood Streak, Today's Mood, Focus Hours, Wellness Score, Weekly Progress) using CSS Grid.
  - [ ] Ensure each analytics card is height-constrained (100–120px), showing icon + large metric + small label.
  - [ ] Remove large descriptions and “Open” links from analytics cards; use non-clickable or purely visual cards.
  - [ ] Add subtle hover effects (lift + glow + border highlight) consistent with dark luxury/blue glow.
  - [ ] Move Daily Quote into its own slim horizontal card directly below analytics row.
  - [ ] Move feature navigation cards (Journal, Mood, Focus, Future Letters) below analytics + quote.
  - [ ] Reduce overall vertical spacing to keep analytics + quote + feature shortcuts visible in first viewport.
- [ ] Verify computations/data exist in `src/utils/dashboardStats.js` (add any missing fields for new 6-card analytics: Focus Hours, Wellness Score, Weekly Progress).
- [ ] Run frontend lint/build/tests (or `npm run build`) to confirm no runtime errors.

