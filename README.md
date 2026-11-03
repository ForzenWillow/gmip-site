# GMIP — Landing page

Static landing page for **GMIP (Grocery Map for Impaired People)**, aimed at supermarkets and grocery chains.

## Open it
- **Locally:** double-click `index.html`. No install or server needed (fonts are embedded).
- **Online:** push this folder to a GitHub repository and turn on GitHub Pages (Settings → Pages → deploy from the main branch, root folder).

## Link the prototype
Open `js/main.js` and paste the prototype's public URL into the first setting:

```js
const PROTOTYPE_URL = "https://your-prototype-link";
```

Every "Try the prototype" button on the page will then open it in a new tab. While it is empty, the buttons show a "coming soon" message.

## Animations
- Hero animates in on load; the map route draws itself and the phone "buzzes" when the shopper reaches the shelf
- Sections and cards fade/slide in while scrolling (`revealGroups` list in `js/main.js` controls what animates)
- Stats count up, "How it works" steps pop in along a drawing line
- Header shows a scroll progress bar and highlights the section in view; a back-to-top button appears after the hero
- Hover effects on cards, icons and buttons
- All motion switches off automatically for visitors with "reduce motion" enabled, and the page still works without JavaScript

## Contact form
The site is static, so the form has no server. It checks the fields and then opens the visitor's email app with the request filled in, addressed to `CONTACT_EMAIL` in `js/main.js` (currently `hello@gmip.fi`).

## Placeholders to replace
- Email `hello@gmip.fi` and phone `+358 40 123 4567` (in `index.html` and `js/main.js`)
- Testimonials are sample content (marked as illustrative on the page)
- Store pricing ("Custom") and setup timelines: to be agreed by the team before adding

## Files
- `index.html` — page content
- `css/styles.css` — layout and colours (palette from the Opportunity Brief)
- `css/fonts.css` — embedded Anton + Inter fonts
- `js/main.js` — prototype link, mobile menu, sticky header
- `assets/favicon.svg` — browser tab icon

## Sections
Header · Hero · Key facts · Problem (Ahmed before/after) · Solution · How it works · Benefits for stores · Partnership model · Testimonials · Team · Contact · Footer
