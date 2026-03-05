# Future Fade Barbershop - Website Redesign Context

## Overview

A full redesign of [futurefade.com](https://futurefade.com/) -- a barbershop in Vancouver, BC. The original site was built with Canva's website builder, which had poor SEO (no meta tags, no semantic HTML, no structured data) and an unprofessional layout. This redesign is a single `index.html` file with inline CSS/JS. External dependencies: Three.js (CDN) and self-hosted fonts.

## Business Info

- **Name:** Future Fade Barbershop
- **Address:** 2239 Granville St, Vancouver, BC (Granville & 7th)
- **Phone:** 236-479-0838
- **Team:** Narie (Barber & Owner), Shannon (Barber & Owner), Ajay (Barber)
- **Booking:** [Squire](https://getsquire.com/discover/barbershop/future-fade-barbershop-inc-vancouver) (external link -- Squire blocks iframe embedding)
- **Socials:** Instagram (@futurefadebarbershop), Facebook, TikTok (@futurefadebarbers), X (@van_futurefade)

### Hours

| Day       | Hours         |
|-----------|---------------|
| Monday    | 10 AM - 7 PM  |
| Tuesday   | 9 AM - 7 PM   |
| Wednesday | 9 AM - 7 PM   |
| Thursday  | 9 AM - 7 PM   |
| Friday    | 9 AM - 7 PM   |
| Saturday  | 9 AM - 7 PM   |
| Sunday    | 10 AM - 6 PM  |

## Tech Stack

- **Single file:** `index.html` with all CSS and JS inline
- **Fonts:** PP Neue Machina Ultrabold (headings), HK Grotesk Medium (body) -- self-hosted via `@font-face`, requires `.woff2` files in `/fonts`
- **Maps:** Google Maps Embed API iframe with CSS dark-mode filter (`grayscale(0.6) invert(0.92) contrast(1.1)`)
- **Hero background:** Three.js WebGL liquid gradient shader (from [CodePen by cameronknight](https://codepen.io/cameronknight/pen/ogxWmBP)), mouse/touch-reactive with ripple distortion
- **External dependency:** Three.js r128 via CDN (`cdnjs.cloudflare.com`)

## File Structure

```
futurefade/
  index.html
  future-fade-barbershop-vancouver-hero.jpeg    (hero image, 3:4 ratio)
  barber-narie-future-fade-vancouver.jpg        (team photo)
  barber-shannon-future-fade-vancouver.jpg      (team photo)
  barber-ajay-future-fade-vancouver.jpg         (team photo)
  fonts/
    PPNeueMachina-Ultrabold.woff2               (heading font - must be added)
    HKGrotesk-Medium.woff2                      (body font - must be added)
  CONTEXT.md                                    (this file)
```

Image filenames are SEO-optimized with keywords (barbershop, Vancouver, barber name).

## Design Decisions

### Color Palette (CSS custom properties)

| Variable          | Value                      | Usage               |
|-------------------|----------------------------|----------------------|
| `--bg-primary`    | `#0a0a0f`                  | Page background      |
| `--bg-secondary`  | `#111118`                  | Alternating sections |
| `--bg-card`       | `#16161f`                  | Cards, badges        |
| `--accent`        | `#6c63ff`                  | Buttons, links, CTA  |
| `--accent-glow`   | `rgba(108, 99, 255, 0.3)`  | Hover glow effects   |
| `--text-primary`  | `#f0f0f5`                  | Headings, body       |
| `--text-secondary`| `#9898a6`                  | Subtext              |
| `--text-muted`    | `#5a5a6e`                  | Subtle labels        |
| `--gold`          | `#c9a96e`                  | Accents, phone #     |

### Typography

- **Headings:** PP Neue Machina Ultrabold -- geometric, futuristic sans-serif from Pangram Pangram (commercial font, self-hosted). Fallback: `Arial Black, sans-serif`
- **Body:** HK Grotesk Medium -- clean, modern sans-serif (open source, self-hosted). Fallback: `-apple-system, sans-serif`
- The hero word "Fade" uses a barber-pole shimmer effect: a slow 8-second CSS gradient animation cycling through gold, red, and blue tones via `background-clip: text`

### Hero - Three.js Liquid Gradient

The hero section features an interactive WebGL background based on a [CodePen by cameronknight](https://codepen.io/cameronknight/pen/ogxWmBP). Key implementation details:

- **Shader:** Custom GLSL fragment shader with 12 animated gradient centers, radial overlays, film grain, and colour shifting
- **Mouse/touch interaction:** `TouchTexture` class tracks cursor movement and generates a distortion texture. Moving the mouse over the hero creates liquid ripple effects
- **Colours:** Tuned to site palette -- accent purple (`#6c63ff`), gold (`#c9a96e`), deep purple, and dark navy (`#0a0a0f`)
- **Performance:** IntersectionObserver pauses rendering when hero scrolls out of view; pixel ratio capped at 2x; animation loop uses `requestAnimationFrame` with delta clamping
- **Scoped to hero:** Canvas is sized/positioned to the hero section only, not full-page. Mouse coordinates are mapped from page-space to hero-local UV coordinates
- **Text readability:** Hero content panel has a dark frosted-glass overlay (`rgba(10,10,15,0.55)` + `backdrop-filter: blur(8px)`) to ensure text remains readable over the animated gradient
- **What was stripped from the CodePen:** Color scheme buttons, color picker/adjuster panel, custom cursor, export functionality, footer. Only the core `TouchTexture`, shader, and `App` rendering loop were kept

### Layout & Sections

1. **Nav** -- Fixed, blurred backdrop, shrinks on scroll. Hamburger menu on mobile (<768px). Active section highlighted in accent colour via IntersectionObserver
2. **Hero** -- Three.js liquid gradient background. Two-column grid: headline + CTA (in frosted dark panel) on left, 3:4 image frame on right with overlay stat badges ("Est. 2022 / Granville & 7th" and "Book Online / 3 Barbers Available")
3. **Services** -- 3-column card grid (Haircuts & Fades, Grooming & Shaves, Colour & Chemical). Cards have a top-edge accent line on hover
4. **Team** -- 3-column cards with 4:5 aspect ratio photos and `object-fit: cover`. Narie and Shannon labelled "Barber & Owner", Ajay labelled "Barber"
5. **About** -- Two-column: text + features grid on left, Google Maps embed (dark-mode filtered) on right
6. **Hours** -- Two-column: hours table on left (today's row auto-highlights in gold via JS), booking CTA card on right
7. **CTA** -- Centered final call to action with Squire link and phone number
8. **Footer** -- 4-column grid: brand + socials, quick links, contact, booking

### Responsive Breakpoints

- **768px:** Nav collapses to hamburger, all grids go single-column, hero stat badges stack vertically, hours grid stacks
- **480px:** Footer goes single-column, about features stack

### Interactive Features (JS)

- Three.js liquid gradient with mouse/touch distortion (hero only)
- Mobile nav hamburger toggle
- Nav padding shrinks on scroll (18px -> 10px)
- Active nav link highlights based on visible section (IntersectionObserver)
- Today's day auto-highlighted in gold in the hours table
- Mobile menu closes when a link is clicked

## SEO Implementation

### Meta Tags

- `<title>` with primary keywords: "Future Fade Barbershop | Premium Haircuts & Grooming in Vancouver, BC"
- `<meta description>` targeting local search intent
- `<meta keywords>` with Vancouver barbershop terms
- Canonical URL pointing to `https://futurefade.com/`
- Open Graph tags (og:title, og:description, og:url, og:site_name, og:locale)
- Twitter Card tags (summary_large_image)

### Structured Data (JSON-LD)

Schema.org `BarberShop` type with:
- Name, URL, phone
- Full postal address
- Geo coordinates (49.2656851, -123.1387203)
- Social media `sameAs` links (Instagram, Facebook, TikTok, X)
- Full `openingHoursSpecification` for all 7 days
- Price range (`$$`)

### Semantic HTML

- Single `<h1>` (hero headline), `<h2>` for section titles
- `<nav>`, `<section>`, `<footer>` elements
- Descriptive `alt` text on all images with location keywords
- `aria-label` on icon-only links (social media)
- `rel="noopener"` on all external links

## What Was Tried and Rejected

- **Squire iframe embed:** Attempted embedding the Squire booking flow directly in a booking section. Squire blocks iframe loading via headers, so it was reverted to an outbound CTA link
- **"Vancouver's Community Barbershop" headline:** Tested as an alternative to "The Future of Your Fade" -- felt too generic, reverted to original
- **Animated barber pole stripes on text:** First version used fast-spinning diagonal red/white/blue stripes on the word "Barbershop" -- too aggressive. Replaced with a slow shimmer gradient on the word "Fade"
- **Custom SVG map pin:** Added a purple/gold SVG pin overlay on the Google Maps embed -- removed per user preference, then pulse animation also removed
- **Google Fonts (Playfair Display + Inter):** Original font choices, replaced with PP Neue Machina + HK Grotesk to match the original futurefade.com branding
- **Dark-mode map removed then restored:** Map filter was removed briefly, then restored at user's request

## Hosting

Currently hosted on GitHub Pages. To deploy:
1. Push all files (including `/fonts` directory) to a GitHub repo
2. Settings > Pages > Deploy from branch (main, root `/`)
3. Live at `https://<username>.github.io/<repo-name>/`

For a custom domain, configure DNS and add the domain in GitHub Pages settings.

## Font Setup

PP Neue Machina is a commercial font from [Pangram Pangram](https://pangrampangram.com/). HK Grotesk is open source. Both must be self-hosted:

1. Obtain `PPNeueMachina-Ultrabold.woff2` (from Pangram Pangram license)
2. Obtain `HKGrotesk-Medium.woff2` (free download)
3. Place both in `futurefade/fonts/`
4. The `@font-face` declarations in `index.html` reference these paths

Until the font files are added, the site falls back to `Arial Black` (headings) and system sans-serif (body).
