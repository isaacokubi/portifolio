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
- Individual project cards support live-demo and direct GitHub source-code links, plus multiple uploaded application screenshots.
- The editor accepts up to 8 JPG, PNG, or WebP screenshots per project, compresses them in the browser, previews them, and lets you remove or replace them. The first screenshot becomes the project cover; additional screenshots appear in a scrollable gallery.
- The profile editor uploads one PDF CV (up to 4 MB) to Vercel Blob storage, stores its public URL with the profile, and provides replace/remove controls. The uploaded PDF becomes the public Download CV link; the profile-generated PDF remains available separately.
- Project screenshots are still browser-local. To publish them, save the editor changes, export the portfolio JSON backup, then commit the exported screenshot data through `src/data.js` and redeploy.
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

The built-in editor saves portfolio text, links, and project screenshots in `localStorage` in the current browser; those edits do **not** automatically update GitHub or publish. CV files are different: they are uploaded to Vercel Blob and their public HTTPS URL is saved with the profile, so visitors on other devices can download the file once the profile changes are saved.

### Configure persistent CV uploads on Vercel

1. In the Vercel project, create a Blob store under **Storage** and connect it to this portfolio project. Vercel supplies `BLOB_READ_WRITE_TOKEN` to the deployment environment.
2. Add an environment variable named `PORTFOLIO_CV_UPLOAD_SECRET` with a long, random secret (at least 32 random characters). Keep it private; do not commit the value to GitHub.
3. Redeploy the project so the `/api/cv` function receives both environment variables.
4. Open the portfolio editor, go to Profile, enter the same secret in **CV upload key**, choose the PDF, and save the profile changes. The uploaded file is stored in Blob and the public URL is shown as Download CV to all visitors.

The upload API checks the secret server-side, accepts PDF files only, verifies the PDF signature, and enforces a 4 MB limit. The secret is held only in the editor component's active session and is not written to portfolio data. Replacing a CV uploads a new file and updates the profile link; old versions can be removed from the Vercel Blob dashboard. Project screenshot uploads remain browser-local until deliberately published through the source data and redeployed. To publish a permanent update to portfolio content, edit `src/data.js`, commit and push the change to `main`, then allow Vercel to rebuild the site.

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

- The site has no full backend CMS or cross-device editor synchronization. CV file storage uses a Vercel serverless endpoint and Blob storage; other editor content remains browser-local.
- The editor's login is client-side only.
- There is no automated test suite configured yet; the CI workflow currently verifies that the Vite production build succeeds.
- Public demo availability and live payment acceptance must be verified independently; a repository link or successful build does not prove production operation.
