# Isaac Okubi — Developer Portfolio

A responsive personal portfolio built with React, JavaScript, Vite, and Tailwind CSS. Source files include explanatory comments for learning and maintenance.

## Code map

- `index.html`: browser document metadata, social preview tags, font loading, and the React mounting element.
- `src/main.jsx`: imports the root component and stylesheet, then mounts React into the HTML document.
- `src/App.jsx`: portfolio UI, browser-local editor, account form, image processing, JSON import/export, and PDF résumé generation.
- `src/data.js`: default profile, links, skills, projects, education, experience, certifications, and services.
- `src/styles.css`: theme variables, component styles, responsive layouts, editor styles, and accessibility preferences.
- `vite.config.js`: Vite plugin configuration for React and Tailwind CSS.
- `package.json`: project metadata, dependency versions, and npm scripts. JSON does not permit comments, so the purpose of each script is documented below instead of adding invalid comment syntax to this file.

## Features

- Responsive portfolio with About, Skills, Projects, Education, Experience, Certifications, Services, and Contact sections.
- Built-in portfolio editor: use **Edit portfolio** to update your profile and add, edit, or remove entries.
- Editor changes are stored in this browser using localStorage; they are not published or synced to other visitors automatically.
- Export and import portfolio content as JSON for backups or moving your profile to another browser.
- Downloadable PDF résumé and direct email/contact links.
- No backend or database is required to run the portfolio.

## Run locally

```bash
npm install
npm run dev
```

- `npm install` installs the dependencies declared in `package.json`.
- `npm run dev` starts Vite's local development server.

## Production build

```bash
npm run build
npm run preview
```

- `npm run build` compiles and bundles the app into the `dist` directory.
- `npm run preview` serves the built output locally so you can check the production version.

## Editing your portfolio

1. Open the website and select **Edit portfolio** in the navigation.
2. Update your profile, links, skills, projects, education, experience, certifications, and services.
3. Changes save in the current browser only. They do not automatically sync to other devices, GitHub, or the deployed public site.
4. Use **Export JSON** to download a backup, or **Import JSON** to restore it in another browser.

## Important implementation notes

- The editor is browser-local and is not a secure server-side authentication system. Do not use its local password gate as protection for sensitive data.
- Uploaded images are validated and resized in the browser before being stored with the saved portfolio data.
- The PDF résumé is generated in the browser using jsPDF and includes the portfolio's current data.
- Project cards display live demos only; the GitHub profile link remains available separately in the contact/social links.

## Personalise before publishing

Review all contact details, demo URLs, dates, qualifications, and descriptions before sharing with employers. Remove claims you cannot substantiate, add your GitHub and LinkedIn profile URLs, upload a professional portrait and real project screenshots, and verify each live demo. The built-in editor is local-only; to publish content changes, update the repository and redeploy.

## Deploy

The project can be deployed to Vercel, Netlify, or any static host. Use `npm run build`; the output directory is `dist`.
