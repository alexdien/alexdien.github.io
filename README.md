# Alex Dien's portfolio

A fullscreen pixel-art golf course portfolio built with React, TypeScript, and Vite. Visit https://alexdien.github.io/.

## Local development

Use Node 22.6 or newer.

```sh
npm ci
npm run dev
npm test
npm run build
```

Click the four flags or use the navigation dock to open the portfolio sections. Drag to explore the course, or click open grass to drive the cart. Keyboard controls and reduced-motion preferences are supported. Music is optional and loads only after a visitor requests the official Spotify player.

## Content

Edit `src/content.ts` for personal details, project content, links, and the résumé URL. `public/Resume.pdf` is the résumé linked from the introduction and contact panel. `public/ratemygolfcourse-preview.png` is the project screenshot.

RateMyGolfCourse is live at https://ratemygolfcourse.app/. Its source link is omitted while its repository is private.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml` (or the existing Pages workflow): install, navigation tests, production build, and GitHub Pages deployment. Build output is `dist/` and is not committed.

The cart uses eight-direction pixel sprites. Run `npm run sprites:cart` to regenerate sprite data after changing its source artwork. Navigation tests cover obstacle clearance, course connectivity, and rerouting.
