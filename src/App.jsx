import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, Github,
  Code2, Download, ExternalLink, FileJson, GraduationCap,
  HeartHandshake, Layers3, Mail, MapPin, Menu, MessageCircle, Pencil, Plus,
  Send, Sparkles, Trash2, X, Upload, Globe, Linkedin, Phone, Save, RotateCcw, LogIn, LogOut, LockKeyhole, ShieldCheck,
} from 'lucide-react';
import { starterData } from './data.js';
import { jsPDF } from 'jspdf';

const STORAGE_KEY = 'isaac-okubi-portfolio-v1';
// This static portfolio has no server-side identity provider. These browser-only credentials
// gate the editor UI on this device; they are not a substitute for server-side authentication.
const ADMIN_CONFIG_KEY = 'isaac-okubi-portfolio-admin-v1';
const DEFAULT_ADMIN_EMAIL = 'izobrack3@gmail.com';
const DEFAULT_ADMIN_PASSWORD_HASH = 'a22e21530e72a903329e4b265ba8d3a815a6a0ded071495c6d20fec843417fe2';
function loadAdminConfig() {
  try {
    const saved = JSON.parse(localStorage.getItem(ADMIN_CONFIG_KEY) || 'null');
    if (saved?.email && saved?.passwordHash) return saved;
  } catch { /* Start with the default account if saved settings are unreadable. */ }
  return { email: DEFAULT_ADMIN_EMAIL, passwordHash: DEFAULT_ADMIN_PASSWORD_HASH };
}
async function hashPassword(password) {
  const digest = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
const emptyEntry = {
  skills: { name: '', level: 'Intermediate', group: 'General' },
  projects: { title: '', category: 'Web application', description: '', stack: '', demo: '', image: '', featured: false },
  education: { qualification: '', institution: '', start: '', end: '', status: 'Completed', details: '' },
  experience: { role: '', company: '', start: '', end: '', location: '', details: '' },
  certifications: { name: '', issuer: '', date: '', credential: '' },
  services: { title: '', description: '', image: '' },
};
const sectionLabels = {
  skills: 'Skills', projects: 'Projects', education: 'Education',
  experience: 'Experience', certifications: 'Certifications', services: 'Services',
};
const cx = (...classes) => classes.filter(Boolean).join(' ');

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return starterData;
    const parsed = JSON.parse(saved);
    return {
      ...starterData, ...parsed,
      profile: { ...starterData.profile, ...(parsed.profile || {}) },
      links: { ...starterData.links, ...(parsed.links || {}) },
      projects: (Array.isArray(parsed.projects) ? parsed.projects : starterData.projects).map(({ link, ...project }) => project),
    };
  } catch {
    return starterData;
  }
}


function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) { reject(new Error('Choose a JPG, PNG, or WebP image.')); return; }
    if (file.size > 10 * 1024 * 1024) { reject(new Error('Choose an image smaller than 10 MB.')); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('The image could not be read.'));
    reader.onload = () => {
      const image = new Image();
      image.onerror = () => reject(new Error('That image could not be opened.'));
      image.onload = () => {
        const scale = Math.min(1, 1200 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext('2d');
        if (!context) { reject(new Error('Image processing is not available.')); return; }
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/webp', 0.78));
      };
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}
function ImageUploadField({ label, value, onChange, wide = false }) {
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const handleFile = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try { onChange(await compressImage(file)); setError(''); }
    catch (uploadError) { setError(uploadError.message || 'Could not upload this image.'); }
    event.target.value = '';
  };
  return <div className={cx('field image-upload-field', wide && 'field-wide')}>
    <span>{label}</span><div className="image-upload-control">
      <div className="image-upload-preview">{value ? <img src={value} alt="" /> : <span><Upload size={19} /><small>No image selected</small></span>}</div>
      <div className="image-upload-actions">
        <button type="button" className="button button-quiet" onClick={() => inputRef.current?.click()}><Upload size={15} /> {value ? 'Replace image' : 'Choose image'}</button>
        {value && <button type="button" className="button button-outline" onClick={() => { onChange(''); setError(''); }}>Remove</button>}
        <small>JPG, PNG, or WebP · max 10 MB before compression</small>{error && <small className="image-upload-error" role="alert">{error}</small>}
      </div><input ref={inputRef} className="sr-only" type="file" accept="image/*" onChange={handleFile} />
    </div>
  </div>;
}
function ProfileAvatar({ name }) {
  const initials = (name || 'Developer').trim().split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase();
  return <div className="avatar-illustration" role="img" aria-label={name + ' profile illustration'}>
    <div className="avatar-halo" /><svg viewBox="0 0 360 430" aria-hidden="true">
      <defs>
        <linearGradient id="avatarSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d9a17c" /><stop offset="1" stopColor="#8e573f" /></linearGradient>
        <linearGradient id="avatarJacket" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#253b61" /><stop offset="1" stopColor="#10182c" /></linearGradient>
        <linearGradient id="avatarShirt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d0f98b" /><stop offset="1" stopColor="#65d9df" /></linearGradient>
      </defs>
      <circle cx="180" cy="174" r="118" fill="#8e9bff" opacity=".07" />
      <path d="M70 430c9-89 47-135 110-135s101 46 110 135" fill="url(#avatarJacket)" /><path d="M145 282h70l-7 63h-56z" fill="url(#avatarSkin)" />
      <path d="M116 131c0-56 29-87 66-87 48 0 70 37 66 94l-12 66H125z" fill="#141525" /><ellipse cx="180" cy="166" rx="66" ry="82" fill="url(#avatarSkin)" />
      <path d="M114 151c-5-61 23-105 72-105 40 0 68 29 67 83-20-1-38-10-51-25-23 26-49 39-88 47z" fill="#111321" />
      <path d="M130 167c10-6 21-6 30 0M201 167c10-6 21-6 30 0" stroke="#33221f" strokeWidth="5" strokeLinecap="round" fill="none" /><path d="M166 201c10 7 20 7 30 0" stroke="#5c2f2a" strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M136 309l44 44 44-44 38 29-24 92H122l-24-92z" fill="url(#avatarJacket)" /><path d="M154 303l26 50 26-50-13-15h-26z" fill="url(#avatarShirt)" />
      <path d="M98 338l47-25 35 40-36 77H96zM262 338l-47-25-35 40 36 77h48z" fill="#18233c" />
      <circle cx="180" cy="386" r="25" fill="#c9f477" opacity=".08" /><text x="180" y="394" fontSize="19" textAnchor="middle" fill="#c9f477" fontWeight="700">{initials}</text>
    </svg><span className="avatar-caption"><span className="status-dot" /> DIGITAL CRAFTSMAN</span>
  </div>;
}
function IconLink({ href, label, children, className = '' }) {
  if (!href) return null;
  return <a href={href} aria-label={label} title={label} className={cx('icon-link', className)} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>{children}</a>;
}

function SectionHeading({ eyebrow, title, detail, number }) {
  return <div className="section-heading">
    <div><span className="eyebrow">{number} / {eyebrow}</span><h2>{title}</h2></div>
    {detail && <p>{detail}</p>}
  </div>;
}

function App() {
  const [data, setData] = useState(loadData);
  const [editing, setEditing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authView, setAuthView] = useState('');
  const [adminConfig, setAdminConfig] = useState(loadAdminConfig);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [accountForm, setAccountForm] = useState({ currentPassword: '', email: '', newPassword: '', confirmPassword: '' });
  const [mobileOpen, setMobileOpen] = useState(false);
  // Track the visible portfolio page so the navbar behaves like page navigation.
  const [currentPage, setCurrentPage] = useState('home');
  const [activeTab, setActiveTab] = useState('profile');
  const [draft, setDraft] = useState(null);
  const [newEntry, setNewEntry] = useState({});
  const [entryType, setEntryType] = useState('skills');
  const [editIndex, setEditIndex] = useState(null);
  const [notice, setNotice] = useState('');
  const fileInput = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Browser storage has a quota; keep the current session usable and tell the editor user.
      setNotice('Browser storage is full. Export your portfolio backup or remove some large images.');
    }
  }, [data]);

  const featuredProjects = useMemo(() => data.projects.filter(p => p.featured), [data.projects]);
  const allSkills = useMemo(() => [...new Set(data.skills.map(s => s.group || 'General'))], [data.skills]);

  const openEditor = () => {
    setDraft(JSON.parse(JSON.stringify(data)));
    setEditing(true);
    setNotice('');
  };
  const closeEditor = () => { setEditing(false); setDraft(null); setEditIndex(null); setNewEntry({}); };
  const openLogin = () => { setAuthView('login'); setAuthError(''); setLoginEmail(''); setLoginPassword(''); };
  const closeAuth = () => { setAuthView(''); setAuthError(''); setLoginPassword(''); setAccountForm({ currentPassword: '', email: adminConfig.email, newPassword: '', confirmPassword: '' }); };
  const handleLogin = async event => {
    event.preventDefault();
    try {
      const passwordHash = await hashPassword(loginPassword);
      if (loginEmail.trim().toLowerCase() !== adminConfig.email.toLowerCase() || passwordHash !== adminConfig.passwordHash) {
        setAuthError('The email or password is incorrect.');
        return;
      }
      setIsLoggedIn(true);
      closeAuth();
      setNotice('You are logged in. Portfolio editing is now available.');
    } catch {
      setAuthError('Secure password checking is unavailable in this browser. Use HTTPS or localhost.');
    }
  };
  const handleCredentialChange = async event => {
    event.preventDefault();
    setAuthError('');
    if (!accountForm.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accountForm.email.trim())) {
      setAuthError('Enter a valid email address.');
      return;
    }
    if (accountForm.newPassword.length < 10) {
      setAuthError('Choose a new password with at least 10 characters.');
      return;
    }
    if (accountForm.newPassword !== accountForm.confirmPassword) {
      setAuthError('The new passwords do not match.');
      return;
    }
    try {
      if (await hashPassword(accountForm.currentPassword) !== adminConfig.passwordHash) {
        setAuthError('Your current password is incorrect.');
        return;
      }
      const updated = { email: accountForm.email.trim(), passwordHash: await hashPassword(accountForm.newPassword) };
      localStorage.setItem(ADMIN_CONFIG_KEY, JSON.stringify(updated));
      setAdminConfig(updated);
      setAccountForm({ currentPassword: '', email: updated.email, newPassword: '', confirmPassword: '' });
      setAuthError('');
      setNotice('Login email and password updated on this browser.');
      setAuthView('');
    } catch {
      setAuthError('Could not update credentials in this browser.');
    }
  };
  const handleLogout = () => {
    closeEditor();
    setIsLoggedIn(false);
    closeAuth();
    setNotice('You have been logged out.');
  };
  const saveDraft = () => {
    setData(draft);
    setEditing(false);
    setDraft(null);
    setNotice('Changes saved in this browser. They are not published to other visitors automatically.');
    window.setTimeout(() => setNotice(''), 3500);
  };
  const updateProfile = (field, value) => setDraft(prev => ({ ...prev, profile: { ...prev.profile, [field]: value } }));
  const updateLink = (field, value) => setDraft(prev => ({ ...prev, links: { ...prev.links, [field]: value } }));
  const updateEntry = (type, index, field, value) => setDraft(prev => ({
    ...prev, [type]: prev[type].map((item, i) => i === index ? { ...item, [field]: value } : item),
  }));
  const addEntry = (type) => {
    const item = { ...emptyEntry[type], ...(newEntry[type] || {}) };
    const labelField = type === 'skills' ? 'name' : type === 'projects' ? 'title' : type === 'education' ? 'qualification' : type === 'experience' ? 'role' : 'title';
    if (!item[labelField] && !item.name) { setNotice('Add a name or title before saving this entry.'); return; }
    setDraft(prev => ({ ...prev, [type]: [...prev[type], item] }));
    setNewEntry(prev => ({ ...prev, [type]: { ...emptyEntry[type] } }));
    setNotice('Entry added. Remember to save your portfolio changes.');
  };
  const removeEntry = (type, index) => setDraft(prev => ({ ...prev, [type]: prev[type].filter((_, i) => i !== index) }));

  const exportData = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'isaac-okubi-portfolio.json'; a.click();
    URL.revokeObjectURL(url);
  };
  const importData = async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!parsed.profile || !Array.isArray(parsed.skills) || !Array.isArray(parsed.projects)) throw new Error('That file does not look like a portfolio backup.');
      setData({ ...starterData, ...parsed, profile: { ...starterData.profile, ...parsed.profile }, links: { ...starterData.links, ...(parsed.links || {}) }, projects: parsed.projects.map(({ link, ...project }) => project) });
      setNotice('Portfolio backup imported successfully.');
    } catch (error) { setNotice(error.message || 'Could not import that JSON file.'); }
    event.target.value = '';
  };
  // Build a readable, multi-page PDF resume from the currently published portfolio data.
  // The PDF is generated in the browser, so no profile details are sent to a third-party service.
  const downloadResume = () => {
    const profile = data.profile || {};
    const clean = value => String(value ?? '').trim();
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    const bottomLimit = pageHeight - 19;
    let y = 0;

    const ensureSpace = (height = 12) => {
      if (y + height <= bottomLimit) return;
      doc.addPage();
      y = 20;
    };
    const paragraph = (value, options = {}) => {
      const text = clean(value);
      if (!text) return;
      const fontSize = options.fontSize || 9.5;
      const lineHeight = options.lineHeight || fontSize * 0.48;
      doc.setFont('helvetica', options.bold ? 'bold' : 'normal');
      doc.setFontSize(fontSize);
      doc.setTextColor(...(options.color || [55, 67, 83]));
      const lines = doc.splitTextToSize(text, contentWidth - (options.indent || 0));
      ensureSpace(lines.length * lineHeight + (options.gapAfter ?? 2));
      doc.text(lines, margin + (options.indent || 0), y);
      y += lines.length * lineHeight + (options.gapAfter ?? 2);
    };
    const section = title => {
      ensureSpace(15);
      y += 3;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(19, 45, 63);
      doc.text(title.toUpperCase(), margin, y);
      y += 2.2;
      doc.setDrawColor(95, 211, 218);
      doc.setLineWidth(0.8);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;
    };
    const entry = (heading, subheading, date, details) => {
      ensureSpace(20);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(23, 39, 57);
      const headingLines = doc.splitTextToSize(clean(heading), contentWidth);
      doc.text(headingLines, margin, y);
      y += headingLines.length * 4.8;
      const meta = [clean(subheading), clean(date)].filter(Boolean).join('  |  ');
      if (meta) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(17, 132, 148);
        const metaLines = doc.splitTextToSize(meta, contentWidth);
        ensureSpace(metaLines.length * 4.2 + 2);
        doc.text(metaLines, margin, y);
        y += metaLines.length * 4.2 + 1.5;
      }
      if (clean(details)) paragraph(details, { fontSize: 9, lineHeight: 4.5, gapAfter: 3 });
    };

    // Cover header uses a restrained navy/cyan palette and keeps contact details easy to scan.
    doc.setFillColor(12, 26, 43);
    doc.rect(0, 0, pageWidth, 49, 'F');
    doc.setFillColor(215, 255, 101);
    doc.rect(0, 48, pageWidth, 1.5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(23);
    doc.setTextColor(250, 252, 255);
    doc.text(clean(profile.name) || 'Isaac Okubi', margin, 18);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(215, 255, 101);
    doc.text(clean(profile.role) || 'Software Developer', margin, 26);
    const contactLine = [profile.location, profile.email, profile.phone].map(clean).filter(Boolean).join('  |  ');
    doc.setFontSize(8.5);
    doc.setTextColor(220, 231, 242);
    const contactLines = doc.splitTextToSize(contactLine, contentWidth);
    doc.text(contactLines, margin, 35);
    y = 59;

    section('Professional Profile');
    paragraph(profile.headline, { fontSize: 10, bold: true, color: [28, 91, 105], gapAfter: 3 });
    paragraph(profile.about || 'Software developer focused on practical, user-centred digital products.', { fontSize: 9.5, lineHeight: 4.8, gapAfter: 2 });

    const skillGroups = (data.skills || []).reduce((groups, skill) => {
      const group = clean(skill.group) || 'Other';
      (groups[group] ||= []).push(clean(skill.name));
      return groups;
    }, {});
    if (Object.keys(skillGroups).length) {
      section('Technical Skills');
      Object.entries(skillGroups).forEach(([group, skills]) => {
        paragraph(group + ': ' + skills.filter(Boolean).join(', '), { fontSize: 9, lineHeight: 4.5, gapAfter: 2 });
      });
    }

    if ((data.projects || []).length) {
      section('Selected Projects');
      data.projects.forEach(project => {
        const stack = clean(project.stack);
        const links = project.demo ? 'Live demo: ' + clean(project.demo) : '';
        entry(project.title, project.category, '', [clean(project.description), stack ? 'Technology: ' + stack : '', links].filter(Boolean).join('\n'));
      });
    }

    if ((data.experience || []).length) {
      section('Experience');
      data.experience.forEach(item => {
        const date = [item.start, item.end].map(clean).filter(Boolean).join(' - ');
        entry(item.role, [item.company, item.location].map(clean).filter(Boolean).join(' | '), date, item.details);
      });
    }

    if ((data.education || []).length) {
      section('Education');
      data.education.forEach(item => {
        const date = [item.start, item.end || item.status].map(clean).filter(Boolean).join(' - ');
        entry(item.qualification, item.institution, date, item.details);
      });
    }

    if ((data.certifications || []).length) {
      section('Certifications');
      data.certifications.forEach(item => entry(item.name, item.issuer, item.date, item.details));
    }

    const links = Object.entries(data.links || {}).filter(([, value]) => clean(value));
    if (links.length || clean(profile.resumeUrl)) {
      section('Professional Links');
      links.forEach(([label, value]) => paragraph(label.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()) + ': ' + clean(value), { fontSize: 9, color: [17, 105, 124], gapAfter: 2 }));
      if (clean(profile.resumeUrl)) paragraph('Portfolio / resume: ' + clean(profile.resumeUrl), { fontSize: 9, color: [17, 105, 124], gapAfter: 2 });
    }

    // Add consistent page numbering after all pages have been laid out.
    const pageCount = doc.getNumberOfPages();
    for (let page = 1; page <= pageCount; page += 1) {
      doc.setPage(page);
      doc.setDrawColor(220, 228, 236);
      doc.setLineWidth(0.3);
      doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(112, 126, 142);
      doc.text((clean(profile.name) || 'Isaac Okubi') + '  |  Resume', margin, pageHeight - 8);
      doc.text('Page ' + page + ' of ' + pageCount, pageWidth - margin, pageHeight - 8, { align: 'right' });
    }

    const filename = (clean(profile.name) || 'isaac-okubi').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'isaac-okubi';
    doc.save(filename + '-resume.pdf');
  };

  const nav = [['Home', 'home'], ['About', 'about'], ['Skills', 'skills'], ['Projects', 'work'], ['Journey', 'journey'], ['Services', 'services'], ['Contact', 'contact']];
  const navigateTo = (page) => { setCurrentPage(page); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const p = data.profile;
  const email = data.links.email || p.email;
  const contactHref = email ? `mailto:${email}` : '#contact';

  return <div className="app-shell">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="site-header">
      <a className="brand" href="#home" onClick={event => { event.preventDefault(); navigateTo('home'); }} aria-label="Go to home"><span className="brand-mark">io.</span><span className="brand-label">PORTFOLIO<small>SOFTWARE DEVELOPER</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(([label, page]) => <a key={label} href={`#${page}`} className={currentPage === page ? 'nav-active' : ''} aria-current={currentPage === page ? 'page' : undefined} onClick={event => { event.preventDefault(); navigateTo(page); }}>{label}</a>)}</nav>
      <div className="header-actions">
        {isLoggedIn ? <>
          <button className="button button-quiet header-edit" onClick={openEditor}><Pencil size={15} /> Edit portfolio</button>
          <button className="button button-quiet account-settings-button" onClick={() => { setAccountForm({ currentPassword: '', email: adminConfig.email, newPassword: '', confirmPassword: '' }); setAuthError(''); setAuthView('settings'); }}><ShieldCheck size={15} /> Account</button>
          <button className="button button-quiet account-logout-button" onClick={handleLogout}><LogOut size={15} /> Log out</button>
        </> : <button className="button button-quiet login-button" onClick={openLogin}><LogIn size={15} /> Login</button>}
        <a className="button button-primary header-contact" href={contactHref} onClick={event => { if (!email) { event.preventDefault(); navigateTo("contact"); } }}>Let's talk <ArrowUpRight size={16} /></a>
        <button className="mobile-menu" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}>{mobileOpen ? <X /> : <Menu />}</button>
      </div>
      {mobileOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{nav.map(([label, page]) => <a key={label} href={`#${page}`} className={currentPage === page ? 'nav-active' : ''} aria-current={currentPage === page ? 'page' : undefined} onClick={event => { event.preventDefault(); navigateTo(page); }}>{label}</a>)}{isLoggedIn ? <><button onClick={() => { setMobileOpen(false); openEditor(); }}>Edit portfolio</button><button onClick={() => { setMobileOpen(false); setAccountForm({ currentPassword: '', email: adminConfig.email, newPassword: '', confirmPassword: '' }); setAuthView('settings'); }}>Account settings</button><button onClick={handleLogout}>Log out</button></> : <button onClick={() => { setMobileOpen(false); openLogin(); }}><LogIn size={15} /> Login</button>}</nav>}
    </header>

    {notice && !editing && <div className="toast" role="status"><Check size={16} />{notice}</div>}

    <main id="main-content">
      <section id="home" className={cx('hero section-wrap', currentPage !== 'home' && 'page-hidden')}>
        <div className="star-field hero-star-field" aria-hidden="true">
          {Array.from({ length: 190 }, (_, i) => <span key={i} className={i % 7 === 0 ? 'falling-star' : 'twinkle-star'} style={{ '--star-left': String((i * 37 + 11) % 100) + '%', '--star-top': String((i * 23 + 7) % 100) + '%', '--star-delay': String(-(i % 17) * 1.1) + 's', '--star-duration': String(4 + (i % 8)) + 's' }} />)}
        </div>
        <div className="hero-copy">
          <div className="availability"><span className="status-dot" />{p.availability || 'Open to opportunities'}<span className="availability-line" /></div>
          <p className="hero-kicker">HELLO, I'M {p.name.toUpperCase()}</p>
          <h1>I build digital<br /><span className="gradient-text">things that matter.</span></h1>
          <p className="hero-description">{p.headline || p.about}</p>
          <div className="hero-actions">
            <a className="button button-primary button-large" href="#work" onClick={event => { event.preventDefault(); navigateTo("work"); }}>Explore my work <ArrowDownRight size={18} /></a>
            <a className="button button-outline button-large" href={contactHref} onClick={event => { if (!email) { event.preventDefault(); navigateTo("contact"); } }}><Mail size={17} /> Get in touch</a>
          </div>
          <div className="hero-meta"><span><MapPin size={15} /> {p.location || 'Available worldwide'}</span><span><Code2 size={15} /> {p.yearsExperience || 'Software development'}</span></div>
        </div>
        <div className="hero-visual portrait-visual">
<div className="visual-topline"><span className="mono">001—∞</span></div>
          <div className="portrait-frame"><div className="portrait-glow" />
            <div className="portrait-image">{p.portraitUrl ? <img src={p.portraitUrl} alt={'Portrait of ' + p.name} /> : <ProfileAvatar name={p.name} />}</div>
            <div className="portrait-ring portrait-ring-one" /><div className="portrait-ring portrait-ring-two" /><span className="portrait-corner portrait-corner-tl" /><span className="portrait-corner portrait-corner-br" />
          </div>
          <div className="floating-card card-top"><Sparkles size={16} /><span>Curiosity-driven</span></div>
          <div className="floating-card card-bottom"><span className="mini-bars"><i /><i /><i /><i /><i /></span><span>Ideas → Impact</span></div>
        </div>
        <a href="#about" className="scroll-cue" onClick={event => { event.preventDefault(); navigateTo("about"); }}><span className="scroll-wheel" /> Scroll to explore <ArrowDown size={14} /></a>
      </section>

      <section id="about" className={cx('section-wrap section-block', currentPage !== 'about' && 'page-hidden')}>
        <SectionHeading number="01" eyebrow="A LITTLE ABOUT ME" title={<>Developer by craft.<br /><span className="muted-heading">Problem-solver by nature.</span></>} detail="I care about the details behind a great digital experience: useful features, clear interfaces, and software that people can depend on." />
        <div className="about-grid">
          <div className="about-note"><span className="quote-mark">“</span><p>{p.about}</p><div className="signature"><span className="signature-line" /> {p.name}</div></div>
          <div className="about-facts">
            <div className="fact-card"><span className="fact-icon"><Code2 /></span><span className="fact-label">WHAT I DO</span><h3>From concept to code</h3><p>Web apps, APIs, mobile experiences, and digital workflows.</p></div>
            <div className="fact-card"><span className="fact-icon"><HeartHandshake /></span><span className="fact-label">HOW I WORK</span><h3>Built around people</h3><p>Understand the problem first, then ship practical solutions.</p></div>
            <div className="fact-card"><span className="fact-icon"><Layers3 /></span><span className="fact-label">WHAT I VALUE</span><h3>Clarity & consistency</h3><p>Readable code, honest communication, and steady improvement.</p></div>
          </div>
        </div>
      </section>

      <section id="skills" className={cx('section-wrap section-block', currentPage !== 'skills' && 'page-hidden')}>
        <SectionHeading number="02" eyebrow="MY TOOLKIT" title={<>Skills that help ideas<br /><span className="muted-heading">become real.</span></>} detail="A growing set of languages, frameworks, and tools I use to build across the stack. Skill levels are editable—set them to reflect your current experience." />
        <div className="skills-layout">
          <div className="skills-intro"><span className="big-number">{String(data.skills.length).padStart(2, '0')}</span><span className="eyebrow">SKILLS & TECHNOLOGIES</span><p>I keep learning and choose tools based on the needs of the project, not just the trend.</p><div className="skills-legend"><span><i className="legend-dot dot-strong" /> Confident</span><span><i className="legend-dot dot-growing" /> Growing</span></div></div>
          <div className="skills-content">{allSkills.map(group => <div className="skill-group" key={group}><h3>{group}</h3><div className="skill-pills">{data.skills.filter(s => (s.group || 'General') === group).map((skill, index) => <div className="skill-pill" key={skill.name + index}><span>{skill.name}</span><small>{skill.level}</small></div>)}</div></div>)}</div>
        </div>
      </section>

      <section id="work" className={cx('section-wrap section-block', currentPage !== 'work' && 'page-hidden')}>
        <SectionHeading number="03" eyebrow="SELECTED PROJECTS" title={<>A few things I've<br /><span className="muted-heading">been building.</span></>} detail="Projects are where problem-solving meets practice. Open a live demo when one is available." />
        <div className="project-grid">{featuredProjects.map((project, index) => <article className={cx('project-card', index === 0 && 'project-featured')} key={project.title}>
          <div className={cx('project-art', `project-art-${index % 3}`)}>{project.image && <img className="project-cover-image" src={project.image} alt={project.title + ' project preview'} loading="lazy" />}<div className="project-art-top"><span>0{index + 1} / PROJECT</span><span className="art-spark"><ArrowUpRight size={20} /></span></div><div className="project-graphic"><div className="graphic-window"><div className="graphic-lines"><i /><i /><i /></div><div className="graphic-panel"><span /><span /><span /></div><div className="graphic-base" /></div><div className="graphic-orb" /></div><span className="project-category">{project.category}</span></div>
          <div className="project-info"><div className="project-title-row"><h3>{project.title}</h3><span className="project-index">0{index + 1}</span></div><p>{project.description}</p><div className="stack-list">{(project.stack || '').split(',').map(s => s.trim()).filter(Boolean).map(s => <span key={s}>{s}</span>)}</div><div className="project-links">{project.demo && <a href={project.demo} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Live demo <ArrowUpRight size={14} /></a>}</div></div>
        </article>)}
        {featuredProjects.length === 0 && <div className="empty-state">Your featured projects will appear here. Use <strong>Edit portfolio</strong> to add and feature projects.</div>}</div>
      </section>

      <section id="journey" className={cx('section-wrap section-block', currentPage !== 'journey' && 'page-hidden')}>
        <SectionHeading number="04" eyebrow="MY JOURNEY" title={<>Learning, building,<br /><span className="muted-heading">moving forward.</span></>} detail="Education gives me a foundation; hands-on projects help me turn knowledge into working software." />
        <div className="journey-grid">
          <div className="journey-column"><div className="column-heading"><span className="column-icon"><GraduationCap /></span><h3>Education</h3></div>{data.education.length ? <div className="timeline">{data.education.map((item, i) => <article className="timeline-item" key={item.qualification + i}><span className="timeline-dot" /><div className="timeline-date">{[item.start, item.end].filter(Boolean).join(' — ') || item.status}</div><h4>{item.qualification}</h4><p className="timeline-place">{item.institution}</p>{item.details && <p className="timeline-description">{item.details}</p>}</article>)}</div> : <p className="empty-inline">Add academic qualifications in the portfolio editor.</p>}</div>
          <div className="journey-column"><div className="column-heading"><span className="column-icon"><BriefcaseBusiness /></span><h3>Experience</h3></div>{data.experience.length ? <div className="timeline">{data.experience.map((item, i) => <article className="timeline-item" key={item.role + i}><span className="timeline-dot" /><div className="timeline-date">{[item.start, item.end].filter(Boolean).join(' — ') || 'Experience'}</div><h4>{item.role}</h4><p className="timeline-place">{item.company}{item.location ? ` · ${item.location}` : ''}</p>{item.details && <p className="timeline-description">{item.details}</p>}</article>)}</div> : <p className="empty-inline">Add work experience or internships in the editor.</p>}</div>
        </div>
        {data.certifications.length > 0 && <div className="certifications"><h3>Certifications & courses</h3><div className="cert-grid">{data.certifications.map((cert, i) => <div className="cert-card" key={cert.name + i}><span className="cert-icon"><Check size={17} /></span><div><strong>{cert.name}</strong><p>{cert.issuer}{cert.date ? ` · ${cert.date}` : ''}</p>{cert.credential && <a href={cert.credential} target="_blank" rel="noreferrer">View credential <ArrowUpRight size={13} /></a>}</div></div>)}</div></div>}
      </section>

      <section id="services" className={cx('section-wrap section-block', currentPage !== 'services' && 'page-hidden')}>
        <SectionHeading number="05" eyebrow="WAYS WE CAN WORK" title={<>Let's build something<br /><span className="muted-heading">useful together.</span></>} detail="From a first website to a workflow that saves your team time, I help turn business needs into digital tools." />
        <div className="services-grid">{data.services.map((service, i) => <article className={cx('service-card', service.image && 'service-card-with-image')} key={service.title}>{service.image && <img className="service-cover-image" src={service.image} alt="" loading="lazy" />}<span className="service-number">0{i + 1}</span><span className="service-arrow"><ArrowUpRight size={19} /></span><h3>{service.title}</h3><p>{service.description}</p></article>)}</div>
      </section>

      <section id="contact" className={cx('section-wrap contact-section', currentPage !== 'contact' && 'page-hidden')}>
        <div className="contact-glow" />
        <div className="contact-content"><span className="eyebrow">06 / YOUR NEXT IDEA STARTS HERE</span><h2>Have a good problem?<br /><span className="gradient-text">Let's solve it.</span></h2><p>Have a project, opportunity, or collaboration in mind? Tell me what you're working on and let's talk through the possibilities.</p><div className="contact-actions"><a className="button button-primary button-large" href={contactHref} onClick={event => { if (!email) { event.preventDefault(); openEditor(); } }}><Mail size={17} /> {email ? 'Send me an email' : 'Add contact email'} <ArrowUpRight size={17} /></a>{p.resumeUrl && <a className="button button-outline button-large" href={p.resumeUrl} target="_blank" rel="noreferrer"><ExternalLink size={17} /> View resume <ArrowUpRight size={17} /></a>}<button className="button button-outline button-large" onClick={downloadResume}><Download size={17} /> Download resume (PDF)</button></div><div className="contact-details">{p.email && <span><Mail size={15} /> {p.email}</span>}{p.phone && <span><Phone size={15} /> {p.phone}</span>}<span><MapPin size={15} /> {p.location}</span></div></div>
        <div className="contact-side"><div className="contact-orbit"><div className="orbit-core"><Code2 size={36} /></div><span className="orbit-label orbit-label-one">IDEA</span><span className="orbit-label orbit-label-two">BUILD</span><span className="orbit-label orbit-label-three">IMPACT</span></div><div className="social-links"><IconLink href={data.links.linkedin} label="LinkedIn"><Linkedin /></IconLink><IconLink href={data.links.github} label="GitHub profile"><Github /></IconLink><IconLink href={data.links.website} label="Website"><Globe /></IconLink><IconLink href={contactHref} label="Email"><Mail /></IconLink></div></div>
      </section>
    </main>

    <footer className="site-footer"><a className="footer-brand" href="#home" onClick={event => { event.preventDefault(); navigateTo("home"); }}>io.</a><p>Designed with curiosity. Built with care.</p><span>© {new Date().getFullYear()} {p.name}. All rights reserved.</span><a href="#home" className="back-top" onClick={event => { event.preventDefault(); navigateTo("home"); }}>Back to top <ArrowUpRight size={14} /></a></footer>

    {authView && <div className="editor-backdrop auth-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeAuth(); }}>
      <section className="auth-panel" role="dialog" aria-modal="true" aria-labelledby="auth-title">
        <div className="editor-header"><div><span className="eyebrow">PRIVATE PORTFOLIO ACCESS</span><h2 id="auth-title">{authView === 'login' ? 'Admin login' : 'Account settings'}</h2><p>{authView === 'login' ? 'Sign in to manage your portfolio.' : 'Change the email address and password used for this browser.'}</p></div><button className="editor-close" onClick={closeAuth} aria-label="Close dialog"><X /></button></div>
        {authError && <p className="auth-error" role="alert">{authError}</p>}
        {authView === 'login' ? <form className="auth-form" onSubmit={handleLogin}>
          <Field label="Email address" value={loginEmail} onChange={setLoginEmail} type="email" />
          <Field label="Password" value={loginPassword} onChange={setLoginPassword} type="password" />
          <button className="button button-primary auth-submit" type="submit"><LockKeyhole size={16} /> Login</button>
        </form> : <form className="auth-form" onSubmit={handleCredentialChange}>
          <Field label="Current password" value={accountForm.currentPassword} onChange={value => setAccountForm(prev => ({ ...prev, currentPassword: value }))} type="password" />
          <Field label="New login email" value={accountForm.email} onChange={value => setAccountForm(prev => ({ ...prev, email: value }))} type="email" />
          <Field label="New password (10+ characters)" value={accountForm.newPassword} onChange={value => setAccountForm(prev => ({ ...prev, newPassword: value }))} type="password" />
          <Field label="Confirm new password" value={accountForm.confirmPassword} onChange={value => setAccountForm(prev => ({ ...prev, confirmPassword: value }))} type="password" />
          <button className="button button-primary auth-submit" type="submit"><ShieldCheck size={16} /> Save login details</button>
          <p className="auth-security-note">Credentials are saved in this browser only. This static-site login hides the editor UI but is not server-side security.</p>
        </form>}
      </section>
    </div>}

    {editing && draft && <div className="editor-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) closeEditor(); }}>
      <section className="editor-panel" role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <div className="editor-header"><div><span className="eyebrow">YOUR PERSONAL BRAND</span><h2 id="editor-title">Portfolio editor</h2><p>Update your public-facing details and save a local draft. This static version stores changes only in this browser; it does not publish them for other visitors.</p></div><button className="editor-close" onClick={closeEditor} aria-label="Close editor"><X /></button></div>
        <div className="editor-toolbar"><div className="editor-tabs">{[['profile','Profile'],['links','Links'],['skills','Skills'],['projects','Projects'],['education','Education'],['experience','Experience'],['certifications','Certificates'],['services','Services']].map(([key, label]) => <button key={key} className={cx('editor-tab', activeTab === key && 'active')} onClick={() => { setActiveTab(key); setEditIndex(null); }}>{label}</button>)}</div></div>
        <div className="editor-body">
          {activeTab === 'profile' && <div className="editor-form-grid">
            <Field label="Full name" value={draft.profile.name} onChange={v => updateProfile('name', v)} />
            <Field label="Professional title" value={draft.profile.role} onChange={v => updateProfile('role', v)} />
            <Field label="Location" value={draft.profile.location} onChange={v => updateProfile('location', v)} />
            <Field label="Email address" value={draft.profile.email} onChange={v => updateProfile('email', v)} type="email" />
            <Field label="Phone (optional)" value={draft.profile.phone} onChange={v => updateProfile('phone', v)} />
            <Field label="Availability status" value={draft.profile.availability} onChange={v => updateProfile('availability', v)} />
            <Field label="Experience label" value={draft.profile.yearsExperience} onChange={v => updateProfile('yearsExperience', v)} />
            <ImageUploadField label="Homepage profile image" value={draft.profile.portraitUrl} onChange={v => updateProfile('portraitUrl', v)} wide />
            <Field label="Resume URL (optional)" value={draft.profile.resumeUrl} onChange={v => updateProfile('resumeUrl', v)} />
            <Field label="Short headline" value={draft.profile.headline} onChange={v => updateProfile('headline', v)} wide />
            <Field label="About me" value={draft.profile.about} onChange={v => updateProfile('about', v)} multiline wide />
          </div>}
          {activeTab === 'links' && <div className="editor-form-grid">{[['linkedin','LinkedIn URL'],['github','GitHub profile URL'],['website','Personal website URL'],['email','Public contact email']].map(([key, label]) => <Field key={key} label={label} value={draft.links[key] || ''} onChange={v => updateLink(key, v)} />)}<p className="editor-help wide">Use full https:// profile URLs. Your GitHub profile can help employers review your work; individual project cards display live demos only, never source-code links.</p></div>}
          {['skills','projects','education','experience','certifications','services'].includes(activeTab) && <div className="editor-list-area">
            <div className="editor-list-head"><div><h3>{sectionLabels[activeTab] || 'Certifications'}</h3><p>{draft[activeTab].length} saved {activeTab} entries</p></div><button className="button button-quiet" onClick={() => { setNewEntry(prev => ({ ...prev, [activeTab]: { ...emptyEntry[activeTab] } })); setEditIndex('new'); }}><Plus size={16} /> Add entry</button></div>
            {editIndex === 'new' && <EntryForm type={activeTab} value={newEntry[activeTab] || emptyEntry[activeTab]} onChange={v => setNewEntry(prev => ({ ...prev, [activeTab]: v }))} onSave={() => { addEntry(activeTab); setEditIndex(null); }} onCancel={() => setEditIndex(null)} />}
            <div className="editor-entry-list">{draft[activeTab].map((entry, index) => {
              const title = entry.name || entry.title || entry.qualification || entry.role || entry.issuer || 'Untitled entry';
              const subtitle = entry.institution || entry.company || entry.group || entry.category || entry.issuer || entry.level || '';
              return <div className="editor-entry" key={title + index}><div className="entry-summary"><span className="entry-count">{String(index + 1).padStart(2, '0')}</span><div><strong>{title}</strong><small>{subtitle}</small></div></div><div className="entry-actions"><button title="Edit entry" aria-label={`Edit ${title}`} onClick={() => setEditIndex(editIndex === index ? null : index)}><Pencil size={15} /></button><button title="Remove entry" aria-label={`Remove ${title}`} onClick={() => removeEntry(activeTab, index)}><Trash2 size={15} /></button></div>{editIndex === index && <EntryForm type={activeTab} value={entry} onChange={v => { const fields = Object.keys(v); fields.forEach(field => updateEntry(activeTab, index, field, v[field])); }} onSave={() => setEditIndex(null)} onCancel={() => setEditIndex(null)} />}</div>;
            })}</div>
          </div>}
        </div>
        <div className="editor-footer"><div className="editor-data-actions"><button className="button button-quiet" onClick={exportData}><Download size={15} /> Export JSON</button><button className="button button-quiet" onClick={() => fileInput.current?.click()}><Upload size={15} /> Import JSON</button><input ref={fileInput} className="sr-only" type="file" accept="application/json,.json" onChange={importData} /></div><div className="editor-save-actions"><button className="button button-outline" onClick={closeEditor}>Cancel</button><button className="button button-primary" onClick={saveDraft}><Save size={16} /> Save changes</button></div></div>
      </section>
    </div>}
  </div>;
}

function Field({ label, value, onChange, type = 'text', multiline = false, wide = false }) {
  return <label className={cx('field', wide && 'field-wide')}><span>{label}</span>{multiline ? <textarea rows={4} value={value ?? ''} onChange={e => onChange(e.target.value)} /> : <input type={type} value={value ?? ''} onChange={e => onChange(e.target.value)} />}</label>;
}

function EntryForm({ type, value, onChange, onSave, onCancel }) {
  const fields = {
    skills: [['name','Skill name'],['level','Level'],['group','Category']],
    projects: [['title','Project title'],['category','Category'],['description','Description','textarea'],['stack','Tech stack (comma separated)'],['demo','Live demo URL (optional)'],['image','Project cover image','image'],['featured','Show on portfolio','checkbox']],
    education: [['qualification','Qualification'],['institution','Institution'],['start','Start date/year'],['end','End date/year'],['status','Status'],['details','Details','textarea']],
    experience: [['role','Role / position'],['company','Company / organisation'],['start','Start date/year'],['end','End date/year or Present'],['location','Location'],['details','Responsibilities / achievements','textarea']],
    certifications: [['name','Certificate / course name'],['issuer','Issuing organisation'],['date','Date earned'],['credential','Credential URL']],
    services: [['title','Service title'],['description','Description','textarea'],['image','Service image','image']],
  }[type] || [];
  return <div className="entry-form">{fields.map(([key, label, kind]) => kind === 'image' ? <ImageUploadField key={key} label={label} value={value[key] || ''} onChange={image => onChange({ ...value, [key]: image })} wide /> : <label className={cx('field', (kind === 'textarea' || key === 'description') && 'field-wide')} key={key}><span>{label}</span>{kind === 'textarea' ? <textarea rows={3} value={value[key] || ''} onChange={e => onChange({ ...value, [key]: e.target.value })} /> : kind === 'checkbox' ? <input type="checkbox" checked={Boolean(value[key])} onChange={e => onChange({ ...value, [key]: e.target.checked })} /> : <input value={value[key] || ''} onChange={e => onChange({ ...value, [key]: e.target.value })} />}</label>)}<div className="entry-form-actions"><button className="button button-quiet" onClick={onCancel}>Cancel</button><button className="button button-primary" onClick={onSave}><Check size={15} /> Done</button></div></div>;
}

export default App;
