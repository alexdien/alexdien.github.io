# Fairway — a playable personal portfolio

A fullscreen React + TypeScript portfolio built with Vite. The proportional SVG world has a clubhouse, tournament green, driving range, and café terrace. Golden-hour lighting, long shadows, pond reflections, detailed planting, and non-interactive foreground branches add depth without raster assets. All portfolio content is semantic HTML, with fixed navigation and native scorecard dialogs.

## Preview and build

From this directory:

```sh
npm install
npm run dev
npm test
npm run build
```

Open the localhost URL printed by Vite. `npm run build` checks TypeScript and writes `dist/`; `npm run preview` serves that production bundle. Deploy `dist/` to any static host. Route tests use Node 22.6+ with built-in TypeScript stripping.

## Explore

- Click an open fairway or path to send the golf cart there. The route planner avoids the putting greens (including clearance for the full cart), pond, buildings, and trees. Green artwork and collision geometry share one source. A new destination replaces the current route.
- Click and drag, or drag with a finger, to pan. Open Explore in the bottom navigation for zoom and reset controls. The camera keeps the map edges inside the viewport.
- Click or keyboard-activate “Practice swing” beside the golfer at the driving range to play a short iron shot.
- Focus the course with the keyboard, then use arrow keys to pan, +/− to zoom, or Home to reset. The “Take the cart for a spin” button in Explore is a keyboard-accessible cart trip.
- Open Explore and choose a named landmark to center it. On narrow screens, the world keeps its original proportions and starts near the clubhouse.
- Hover, focus, or tap a project trophy to preview its project. “Explore this project” opens its entry in the scorecard. Escape closes a preview or scorecard.
- Exploration collapses the introduction; the + button expands it again. Fixed bottom navigation always opens portfolio content immediately. The introduction and navigation are the only persistent interface overlays; cart messages appear briefly after an action and then disappear.

No game completion is required. Scorecards keep keyboard focus within the panel and restore it on close. Reduced-motion preferences disable camera transitions and environmental animations; the cart jumps directly to its destination. No audio is used.

## Replace your content

Edit `src/content.ts` for your name, role, compact opening introduction (`shortIntroduction`), full introduction, biography, location, interests, featured projects, skills, experience, education, email, and social links. Confirmed portfolio content is filled in; unconfirmed project details are omitted.

Each project supports:

- `image`: a path such as `/project-one.webp` (put the file in `public/`), or an HTTPS image URL.
- `imageAlt`: a useful description of the screenshot.
- `url`: the real project or case-study URL.

Empty or failed images are omitted. The same image appears in the on-course preview and project scorecard. Empty URLs and unconfirmed skills/job descriptions are omitted. A real email enables a mail link. Update the title and description in `index.html` before publishing.

## Main files

- `src/Course.tsx`: landmarks, project trophies, camera, and pointer interactions.
- `src/CourseScenery.tsx`: memoized foliage, shadows, reflections, planting, window details, and foreground framing.
- `src/useCart.ts`: cart movement, direction, tracks, and motion preferences.
- `src/navigation.ts`: obstacle boundaries and route planning.
- `src/greens.ts`: shared putting-green artwork coordinates and collision clearances.
- `src/Golfer.tsx`: pixel golfer, iron, bag, and practice-shot artwork.
- `src/ProjectArtwork.tsx`: shared project image rendering with missing-image omission.
- `src/App.tsx`: floating interface and accessible scorecards.
- `src/styles.css`: palette, responsive layout, and animation.
- `tests/navigation.test.mjs`: route clearance, forbidden destinations, and rerouting checks.

## Scope

This is a local static website, not a published deployment. Contact uses an email link, not a form or backend. RateMyGolfCourse is the sole confirmed featured project. Its features, stack, year, public URL, and screenshot await confirmation; two additional projects and the skills shortlist remain unpublished. The cart uses conservative obstacle clearances, so some tight spaces are intentionally unavailable. The interface uses Cormorant Garamond for club-style headings, DM Sans for body text, and Pixelify Sans for small game details. Google Fonts supplies these families, with local fallback fonts when unavailable.

## Hosting

GitHub Actions tests and builds pushes to `main`, then deploys `dist/` to https://alexdien.github.io/. The previous portfolio is preserved on `gh-pages` and the `portfolio-before-golf-2026-10-30` tag.
