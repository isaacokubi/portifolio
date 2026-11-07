# Isaac Baraka Ogubi — Full-Stack Software Developer Portfolio

Personal portfolio for **Isaac Baraka Ogubi**, a Kenya-based full-stack software developer. The site presents selected software projects, technical skills, education, experience, services, contact details, and a downloadable PDF résumé.

## Featured projects

| Project | What it demonstrates | Live demo | Source |
|---|---|---|---|
| Chatify | Flutter mobile client, Node.js/Express API, Socket.IO real-time messaging, conversational memory and message expiry | [Live demo](https://chatify-mobile.vercel.app/) | [GitHub](https://github.com/isaacokubi/chatify) |
| Hussein Mboya Tours | Multi-tenant travel operations, bookings, tenant workspaces, finance and payment workflows | [Live site](https://hussein-mboya-tours.vercel.app/) | [GitHub](https://github.com/isaacokubi/hussein-mboya-tours) |
| BookHub | Book discovery and marketplace workflows, catalogue, cart and orders | [Live demo](https://bookhub-swart.vercel.app/) | [GitHub](https://github.com/isaacokubi/bookhub) |
| AngelsHome | School management workflows covering learners, administration, staff, academics, parent communication and fees | [Live demo](https://angelshome.vercel.app/) | [GitHub](https://github.com/isaacokubi/angelshome) |

Project descriptions are summaries, not claims that every feature or third-party payment flow has passed live production acceptance. Refer to each project's repository documentation for current implementation and verification status.

## Technology

- React 18 and JavaScript
- Vite 6
- Tailwind CSS 4
- Lucide React icons
- jsPDF for browser-generated résumé PDFs

## Features

- Responsive portfolio sections for About, Skills, Projects, Education, Experience, Certifications, Services and Contact.
- Individual project cards support both live-demo and direct GitHub source-code links.
- Downloadable PDF résumé generated in the browser from the displayed profile data.
- Browser-local portfolio editor with JSON import/export backup.
- Basic SEO metadata, social preview metadata, keyboard focus styles, skip navigation and reduced-motion support.

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The production build is written to `dist/`. Vercel should use the repository root as the project root, `npm run build` as the build command, and `dist` as the output directory.

## Editing and publishing content

The built-in editor saves portfolio changes to `localStorage` in the current browser only. It does **not** update GitHub, synchronize to other browsers, or publish changes to the live website. To publish a permanent update, edit `src/data.js`, commit and push the change to `main`, then allow the connected deployment platform to rebuild the site.

The editor's browser-side login is only a convenience gate for the local editor UI. It is **not server-side authentication** and must not be used to protect confidential information or administrative services.

Use the JSON export function to back up locally edited content before clearing browser data. Do not store secrets, API keys, private customer information, or payment credentials in portfolio content.

## Personalisation checklist before sharing with employers

- Add a real, professional profile photograph.
- Add the correct LinkedIn profile URL and any public professional contact details.
- Add real screenshots from each application; do not use generic mockups as evidence of shipped features.
- Verify each live demo and label unavailable demos honestly.
- Add project-specific case studies, test evidence and architecture diagrams as they become available.
- Keep skills and proficiency labels accurate and defensible in an interview.
- Keep the CV PDF current and check its layout after every major profile update.

## Current limitations

- The site is a static frontend; there is no backend CMS or cross-device editor synchronization.
- The editor's login is client-side only.
- There is no automated test suite configured yet; the CI workflow currently verifies that the Vite production build succeeds.
- Public demo availability and live payment acceptance must be verified independently; a repository link or successful build does not prove production operation.
