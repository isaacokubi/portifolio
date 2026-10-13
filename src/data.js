// Starter content shown on a fresh browser before the owner saves custom editor changes.
export const starterData = {
  // Personal identity and the text displayed in the hero, About, and contact sections.
  profile: {
    name: 'Isaac Okubi', // Name shown in the site header and résumé.
    role: 'Software Developer', // Main professional title.
    location: 'Kenya', // Location shown beside contact details.
    email: 'izobrack3@gmail.com', // Default contact email used when no public link overrides it.
    phone: '', // Optional phone number; leave blank to hide it.
    headline: 'I turn ideas into reliable digital products.', // Short hero statement.
    about: "I'm a software developer focused on building modern websites, practical business systems, and mobile experiences. I enjoy solving real problems with thoughtful user experiences, maintainable code, and technology that helps people work smarter.", // Longer biography paragraph.
    availability: 'Open to opportunities', // Availability badge text.
    yearsExperience: 'Early-career developer', // Experience summary label.
    resumeUrl: '', // Optional external résumé URL.
    portraitUrl: '', // Optional profile image URL or browser-saved image data.
  },
  // Public profile/contact destinations used by social icons and contact actions.
  links: {
    linkedin: '', // LinkedIn profile URL; empty values are not displayed.
    github: 'https://github.com/isaacokubi', // GitHub profile URL.
    website: '', // Optional personal website URL.
    email: 'izobrack3@gmail.com', // Public email link used by contact actions.
  },
  // Skills are grouped for display; each entry supplies a label, confidence level, and category.
  skills: [
    { name: 'JavaScript', level: 'Advanced', group: 'Languages' },
    { name: 'HTML & CSS', level: 'Advanced', group: 'Frontend' },
    { name: 'React', level: 'Intermediate', group: 'Frontend' },
    { name: 'Tailwind CSS', level: 'Intermediate', group: 'Frontend' },
    { name: 'Node.js & Express', level: 'Intermediate', group: 'Backend' },
    { name: 'MongoDB', level: 'Intermediate', group: 'Database' },
    { name: 'PHP & Laravel', level: 'Intermediate', group: 'Backend' },
    { name: 'Vue.js', level: 'Intermediate', group: 'Frontend' },
    { name: 'Flutter & Dart', level: 'Intermediate', group: 'Mobile' },
    { name: 'Git & GitHub', level: 'Intermediate', group: 'Tools' },
    { name: 'REST APIs', level: 'Intermediate', group: 'Backend' },
    { name: 'M-Pesa integration', level: 'Learning', group: 'Integrations' },
  ],
  // Project cards display these descriptions, technology stacks, and live-demo URLs when available.
  projects: [
    { title: 'Coherent Tours', category: 'Business platform', description: 'A tour operations management platform concept covering tour catalogues, bookings, team assignments, finance workflows, and multi-tenant business operations.', stack: 'React, Node.js, Express, MongoDB', demo: 'https://hussein-mboya-tours.vercel.app', image: '', featured: true },
    { title: 'Chatify', category: 'Communication app', description: 'A real-time communication app concept focused on conversations, context-aware memories, and message expiry, with a Flutter client and API backend.', stack: 'Flutter, Dart, Node.js, Socket.IO, MongoDB', demo: '', image: '', featured: true },
    { title: 'BookHub', category: 'Book marketplace', description: 'A book discovery and selling platform concept with store experiences, product browsing, cart and order flows, reviews, and M-Pesa payment workflows.', stack: 'JavaScript, React, Node.js, MongoDB', demo: 'https://bookhub-swart.vercel.app', image: '', featured: true },
  ],
  // Education history used by the Journey section and generated résumé.
  education: [
    { qualification: 'Diploma in Software Development', institution: 'IST, Kenya', start: '', end: '', status: 'Completed', details: 'Coursework included web development, JavaScript, React, MERN stack, PHP, Laravel, Vue.js, and Flutter/Dart.' },
  ],
  // Work and project experience, including independent work, displayed as timeline entries.
  experience: [
    { role: 'Independent Software Developer', company: 'Personal projects', start: '', end: 'Present', location: 'Kenya / Remote', details: 'Designing and developing web applications, business workflows, REST APIs, and mobile app features. Building portfolio projects and improving delivery, testing, and deployment practices.' },
  ],
  // Keep this array empty until there are real certificates to list.
  certifications: [],
  // Service cards describe the kinds of software work offered to potential clients.
  services: [
    { title: 'Website development', image: '', description: 'Responsive business websites and landing pages designed to turn visitors into enquiries.' },
    { title: 'Business systems', image: '', description: 'Admin dashboards and workflows for managing customers, records, operations, and reports.' },
    { title: 'Payments & integrations', image: '', description: 'API integrations and payment-flow implementation, including M-Pesa where provider access is available.' },
    { title: 'E-commerce platforms', image: '', description: 'Product catalogues, store experiences, carts, and order management.' },
    { title: 'Mobile applications', image: '', description: 'Cross-platform mobile app interfaces and API-connected features with Flutter.' },
    { title: 'Maintenance & support', image: '', description: 'Bug fixes, usability improvements, deployment assistance, and ongoing updates.' },
  ],
};
