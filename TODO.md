# TODO — ScribeSpace Blue Wellness Theme Refactor

- [ ] Update `frontend/src/constants/ui.js` to replace all lavender/violet/purple gradient/glow/border/shadow tokens with centralized blue wellness tokens (btnGradient, card variants, heroSection, input focus rings, iconWrap, headings).
- [x] Update `frontend/src/utils/moodStorage.js` to swap mood-driven gradients/badges/rings from violet/purple into the new calm blue palette.

- [x] Update `frontend/src/utils/focusStorage.js` to swap focus mode gradients/badges into the new midnight blues.
- [x] Update `frontend/src/styles/global.css` + `frontend/src/index.css` to centralize CSS variables for dark/light themes (background, hero glow, text harmony) using the provided palette.

- [ ] Update Tailwind config (`frontend/tailwind.config.js`) to add a small theme extension for color tokens used by existing classes (if needed) without breaking existing Tailwind usage.
- [ ] Run a build/lint check (`npm test` / `npm run build` / `npm run lint` if available) and ensure no functionality break.

