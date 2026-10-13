# Isaac Okubi — Developer Portfolio

A responsive personal portfolio built with React, JavaScript, Vite, and Tailwind CSS.

## Features
- Responsive portfolio with About, Skills, Projects, Education, Experience, Certifications, Services, and Contact sections.
- Built-in portfolio editor: use **Edit portfolio** to update your profile and add, edit, or remove entries.
- Editor changes are stored in this browser using localStorage.
- Export and import portfolio content as JSON for backups or moving your profile to another browser.
- Downloadable resume text file and direct email/contact links.
- No backend or database is required to run the portfolio.

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

## Editing your portfolio
1. Open the website and select **Edit portfolio** in the navigation.
2. Update your profile, links, skills, projects, education, experience, certifications, and services.
3. Changes save in the current browser. They do not automatically sync to other devices or to GitHub.
4. Use **Export JSON** to download a backup, or **Import JSON** to restore it in another browser.

## Personalise before publishing
Review the sample contact details, project links, dates, qualifications, and descriptions. Replace anything that is not accurate. Add a professional portrait and real project screenshots when available.

## Deploy
The project can be deployed to Vercel, Netlify, or any static host. Use `npm run build`; the output directory is `dist`.
