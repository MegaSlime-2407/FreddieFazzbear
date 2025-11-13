# My Tasty App — Frontend Demo

## Overview
My Tasty App is a responsive single-page experience for a fictional pizza brand inspired by Freddy Fazbear. The project demonstrates polished design, persistent theming, local-storage powered interactions, and enhanced JavaScript features without a backend dependency.

## Live Preview
Open `index.html` in any modern browser. No build tools are required.

## Key Features
- **Responsive UI with Dark Mode** – Sticky navigation, mobile drawer, and a theme toggle that persists via `localStorage`.
- **Auth Simulation** – Sign up / log in flows with profile page, password validation, and data stored client-side.
- **Menu Search & Filtering** – Autocomplete, highlighting, and local-storage caching.
- **Cart & Ratings Persistence** – Add-to-cart with toasts/sounds, rating storage for user feedback.
- **Interactive Enhancements** – Copy-to-clipboard tooltips, scroll progress bar, hover animations, and accessible accordions.
- **External Integration** – Embedded Google Maps location on `about.html` to showcase the flagship store.

## Tech Stack
- HTML5, CSS3 (custom responsive utility classes)
- Vanilla JavaScript + jQuery 3.7 (for targeted DOM helpers)
- Local Storage API
- Google Maps Embed

## Project Structure
- `index.html` – Landing page and hero.
- `menu.html` / `menu.js` – Product grid, search, cart interactions.
- `about.html` – Company story, FAQ, stats, Google Maps.
- `contacts.html` – Contact form with validation and modal.
- `auth.js`, `login.js`, `signup.js`, `profile.js` – Local-storage auth workflows.
- `styles.css` – Global design system, breakpoints, themes.
- `scripts.js`, `utils.js`, `mobile-nav.js`, `theme-switcher.js` – Shared utilities and UI behaviors.

## Getting Started
1. Clone the repository.
2. Open `index.html` with VS Code Live Server or double-click to launch in your browser.
3. For local storage demos, keep DevTools → Application → Local Storage open to observe saved data.

## Testing Checklist
- Toggle between light/dark themes on desktop and mobile.
- Complete sign-up and sign-in flows; verify profile data persists after refresh.
- Add menu items to the cart, confirm toast/sound feedback, and inspect stored cart data.
- Use menu search to filter items and confirm highlighting/autocomplete.
- Submit forms (contact, login, signup) with invalid data to see validation messages.
- Open the About page to view the Google Maps embed and FAQ accordion behavior.

## Contributors
- Yerkanat Marat
- Amangeldi Aldiyar
- Kenzhebayev Madiyar
- Oralov Alinur

## License
This project is for educational use only. Feel free to adapt it for your coursework or portfolio.
