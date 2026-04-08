# Love Wall Scroll Animation & Design Upgrade TODO

## Plan Status: ✅ Approved by User

### 1. **Enhance Animations & Styles** [✅]
   - Update `app/globals.css`
     - Add `wall-shrink` keyframe ✓
     - Add `grid-stagger-reveal` for cells ✓
     - Enhance `.wall-expanded` with blur/glow ✓
     - Add hearts burst & particles ✓

### 2. **Core Logic: WallGrid.tsx** [✅]
   - Add scroll detection state (`isExpanded`, `animationPhase`) ✓
   - IntersectionObserver or scroll listener ✓
   - Full-screen canvas resize & class toggle ✓
   - Bidirectional animations (expand/shrink) ✓
   - Body scroll lock/unlock ✓
   - Hearts burst integration ✓ (trigger state ready)

### 3. **Integrate to page.tsx** [✅]
   - Add scroll trigger wrapper around WallGrid section ✓ (#wall-section + teaser)

### 4. **Polish Components** [ ]
   - Enhance `FloatingHearts.tsx` burst prop
   - Update `app/layout.tsx` smooth scroll

### 5. **Test & Demo** [ ]
   - `npm run dev`
   - Browser test scroll animations
   - Screenshots & refinements

### 6. **Complete** [ ]
   - attempt_completion

*Updated: [Current step]*
