# 🏙️ Minecity Roleplay — Wiki & Encyclopedia

Official documentation for **Minecity Roleplay** — Paper 1.21.x · Java 21 · MinecitySuite v1.0.0.

🌐 **Live wiki:** https://TU-USUARIO.github.io/minecity-wiki/

## Contents

| Section | Pages |
| --- | --- |
| **Start Here** | Home, Getting Started |
| **City Life** | Communication & Emotes, Phone & GPS, Economy & Banking, Houses & Apartments, Vehicles & Traffic, Weapons & Ballistics, Hydration & Hunger, Pets, Citizen Levels |
| **Public Services** | Police Department, EMS & Hospital |
| **Underworld** | Crime, Drugs & Gangs |
| **Work & Leisure** | Jobs, Mines & Fishing · Leisure & Casino |
| **Reference** | Command Dictionary, Permission Matrix, Placeholder Guide |

## Features

- Full-text search with `Ctrl + K`
- Dark and light theme
- Responsive layout for phone and desktop
- Click any command to copy it
- No build step, no dependencies — plain HTML, CSS and JavaScript

## Project structure

```
index.html            landing page
*.html                one file per article (19 pages)
assets/style.css      design system
assets/app.js         search, theme, mobile nav, copy-to-clipboard
assets/search.js      prebuilt search index
404.html              not-found page
.nojekyll             serve files as-is on GitHub Pages
```

## Editing

The site is static. Either edit the HTML directly, or regenerate it from the
source project with `python build.py`.

## Publishing

**Settings → Pages → Source: Deploy from a branch → `main` / `(root)`.**

The site is served at `https://TU-USUARIO.github.io/minecity-wiki/`.

---

*Minecity Roleplay — built for the community.*
