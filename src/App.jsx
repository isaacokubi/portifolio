import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BriefcaseBusiness, Check,
  Code2, Download, ExternalLink, FileJson, GraduationCap,
  HeartHandshake, Layers3, Mail, MapPin, Menu, MessageCircle, Pencil, Plus,
  Send, Sparkles, Trash2, X, Upload, Globe, Linkedin, Phone, Save, RotateCcw,
} from 'lucide-react';
import { starterData } from './data.js';

const STORAGE_KEY = 'isaac-okubi-portfolio-v1';
const emptyEntry = {
  skills: { name: '', level: 'Intermediate', group: 'General' },
  projects: { title: '', category: 'Web application', description: '', stack: '', link: '', demo: '', featured: false },
  education: { qualification: '', institution: '', start: '', end: '', status: 'Completed', details: '' },
  experience: { role: '', company: '', start: '', end: '', location: '', details: '' },
  certifications: { name: '', issuer: '', date: '', credential: '' },
  services: { title: '', description: '' },
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const featuredProjects = useMemo(() => data.projects.filter(p => p.featured), [data.projects]);
  const allSkills = useMemo(() => [...new Set(data.skills.map(s => s.group || 'General'))], [data.skills]);

  const openEditor = () => {
    setDraft(JSON.parse(JSON.stringify(data)));
    setEditing(true);
    setNotice('');
  };
  const closeEditor = () => { setEditing(false); setDraft(null); setEditIndex(null); setNewEntry({}); };
  const saveDraft = () => {
    setData(draft);
    setEditing(false);
    setDraft(null);
    setNotice('Portfolio changes saved in this browser.');
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
  const downloadResume = () => {
    const p = data.profile;
    const text = [
      p.name, p.role, p.location, p.email, p.phone, '',
      'PROFILE', p.about, '', 'SKILLS', ...data.skills.map(s => `- ${s.name} (${s.group}; ${s.level})`),
      '', 'EDUCATION', ...data.education.map(e => `- ${e.qualification} — ${e.institution} (${e.start}–${e.end || e.status})\n  ${e.details}`),
      '', 'EXPERIENCE', ...data.experience.map(e => `- ${e.role} — ${e.company} (${e.start}–${e.end})\n  ${e.details}`),
      '', 'PROJECTS', ...data.projects.map(project => `- ${project.title}: ${project.description}\n  Stack: ${project.stack}\n  Live demo: ${project.demo || 'Not available'}`),
      '', 'CERTIFICATIONS', ...data.certifications.map(c => `- ${c.name} — ${c.issuer} (${c.date})`),
      '', 'LINKS', ...Object.entries(data.links).map(([k, v]) => `${k}: ${v}`),
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = `${p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-resume.txt`; a.click(); URL.revokeObjectURL(url);
  };

  const nav = [['Home', 'home'], ['About', 'about'], ['Skills', 'skills'], ['Projects', 'work'], ['Journey', 'journey'], ['Services', 'services'], ['Contact', 'contact']];
  const navigateTo = (page) => { setCurrentPage(page); setMobileOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const p = data.profile;
  const email = data.links.email || p.email;
  const contactHref = email ? `mailto:${email}` : '#contact';

  return <div className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="site-header">
      <a className="brand" href="#home" onClick={event => { event.preventDefault(); navigateTo('home'); }} aria-label="Go to home"><span className="brand-mark">io.</span><span>{p.name}<small>SOFTWARE DEVELOPER</small></span></a>
      <nav className="desktop-nav" aria-label="Main navigation">{nav.map(([label, page]) => <a key={label} href={`#${page}`} className={currentPage === page ? 'nav-active' : ''} aria-current={currentPage === page ? 'page' : undefined} onClick={event => { event.preventDefault(); navigateTo(page); }}>{label}</a>)}</nav>
      <div className="header-actions">
        <button className="button button-quiet header-edit" onClick={openEditor}><Pencil size={15} /> Edit portfolio</button>
        <a className="button button-primary header-contact" href={contactHref} onClick={event => { if (!email) { event.preventDefault(); navigateTo("contact"); } }}>Let's talk <ArrowUpRight size={16} /></a>
        <button className="mobile-menu" aria-label="Toggle navigation" aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}>{mobileOpen ? <X /> : <Menu />}</button>
      </div>
      {mobileOpen && <nav className="mobile-nav" aria-label="Mobile navigation">{nav.map(([label, page]) => <a key={label} href={`#${page}`} className={currentPage === page ? 'nav-active' : ''} aria-current={currentPage === page ? 'page' : undefined} onClick={event => { event.preventDefault(); navigateTo(page); }}>{label}</a>)}<button onClick={() => { setMobileOpen(false); openEditor(); }}>Edit portfolio</button></nav>}
    </header>

    {notice && !editing && <div className="toast" role="status"><Check size={16} />{notice}</div>}

    <main>
      <section id="home" className={cx('hero section-wrap', currentPage !== 'home' && 'page-hidden')}>
        <div className="hero-copy">
          <div className="availability"><span className="status-dot" />{p.availability || 'Open to opportunities'}<span className="availability-line" /></div>
          <p className="hero-kicker">HELLO, I'M {p.name.toUpperCase()}</p>
          <h1>I build digital<br /><span className="gradient-text">things that matter.</span></h1>
          <p className="hero-description">{p.headline} {p.about}</p>
          <div className="hero-actions">
            <a className="button button-primary button-large" href="#work" onClick={event => { event.preventDefault(); navigateTo("work"); }}>Explore my work <ArrowDownRight size={18} /></a>
            <a className="button button-outline button-large" href={contactHref} onClick={event => { if (!email) { event.preventDefault(); navigateTo("contact"); } }}><Mail size={17} /> Get in touch</a>
          </div>
          <div className="hero-meta"><span><MapPin size={15} /> {p.location || 'Available worldwide'}</span><span><Code2 size={15} /> {p.yearsExperience || 'Software development'}</span></div>
        </div>
        <div className="hero-visual">
          <div className="visual-topline"><span>BUILD / LEARN / REPEAT</span><span className="mono">001—∞</span></div>
          <div className="code-window">
            <div className="window-bar"><span /><span /><span /><p>developer.js</p></div>
            <pre><code><span className="code-purple">const</span> <span className="code-blue">developer</span> = {'{'}{ '\n' }  name: <span className="code-green">'{p.name}'</span>,{ '\n' }  focus: <span className="code-green">'Useful products'</span>,{ '\n' }  mindset: <span className="code-green">'Keep learning'</span>,{ '\n' }  build: <span className="code-purple">async</span> () =&gt; {'{'}{ '\n' }    <span className="code-purple">return</span> <span className="code-green">'Make it work. Make it better.'</span>;{ '\n' }  {'}'}{ '\n'}{'}'};</code></pre>
            <div className="code-footer"><span><span className="status-dot" /> Ready to build</span><span>UTF-8&nbsp; · &nbsp;JavaScript</span></div>
          </div>
          <div className="floating-card card-top"><Sparkles size={16} /><span>Curiosity-driven</span></div>
          <div className="floating-card card-bottom"><span className="mini-bars"><i /><i /><i /><i /><i /></span><span>Ideas → Impact</span></div>
          <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
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
          <div className={cx('project-art', `project-art-${index % 3}`)}><div className="project-art-top"><span>0{index + 1} / PROJECT</span><span className="art-spark"><ArrowUpRight size={20} /></span></div><div className="project-graphic"><div className="graphic-window"><div className="graphic-lines"><i /><i /><i /></div><div className="graphic-panel"><span /><span /><span /></div><div className="graphic-base" /></div><div className="graphic-orb" /></div><span className="project-category">{project.category}</span></div>
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
        <div className="services-grid">{data.services.map((service, i) => <article className="service-card" key={service.title}><span className="service-number">0{i + 1}</span><span className="service-arrow"><ArrowUpRight size={19} /></span><h3>{service.title}</h3><p>{service.description}</p></article>)}</div>
      </section>

      <section id="contact" className={cx('section-wrap contact-section', currentPage !== 'contact' && 'page-hidden')}>
        <div className="contact-glow" />
        <div className="contact-content"><span className="eyebrow">06 / YOUR NEXT IDEA STARTS HERE</span><h2>Have a good problem?<br /><span className="gradient-text">Let's solve it.</span></h2><p>Have a project, opportunity, or collaboration in mind? Tell me what you're working on and let's talk through the possibilities.</p><div className="contact-actions"><a className="button button-primary button-large" href={contactHref}><Mail size={17} /> Send me an email <ArrowUpRight size={17} /></a><button className="button button-outline button-large" onClick={downloadResume}><Download size={17} /> Export resume (TXT)</button></div><div className="contact-details">{p.email && <span><Mail size={15} /> {p.email}</span>}{p.phone && <span><Phone size={15} /> {p.phone}</span>}<span><MapPin size={15} /> {p.location}</span></div></div>
        <div className="contact-side"><div className="contact-orbit"><div className="orbit-core"><Code2 size={36} /></div><span className="orbit-label orbit-label-one">IDEA</span><span className="orbit-label orbit-label-two">BUILD</span><span className="orbit-label orbit-label-three">IMPACT</span></div><div className="social-links"><IconLink href={data.links.linkedin} label="LinkedIn"><Linkedin /></IconLink><IconLink href={data.links.website} label="Website"><Globe /></IconLink><IconLink href={contactHref} label="Email"><Mail /></IconLink></div></div>
      </section>
    </main>

    <footer className="site-footer"><a className="footer-brand" href="#home" onClick={event => { event.preventDefault(); navigateTo("home"); }}>io.</a><p>Designed with curiosity. Built with care.</p><span>© {new Date().getFullYear()} {p.name}. All rights reserved.</span><a href="#home" className="back-top" onClick={event => { event.preventDefault(); navigateTo("home"); }}>Back to top <ArrowUpRight size={14} /></a></footer>

    {editing && draft && <div className="editor-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) closeEditor(); }}>
      <section className="editor-panel" role="dialog" aria-modal="true" aria-labelledby="editor-title">
        <div className="editor-header"><div><span className="eyebrow">YOUR PERSONAL BRAND</span><h2 id="editor-title">Portfolio editor</h2><p>Edit your details here. Save when you're ready to publish the changes in this browser.</p></div><button className="editor-close" onClick={closeEditor} aria-label="Close editor"><X /></button></div>
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
            <Field label="Portrait image URL (optional)" value={draft.profile.portraitUrl} onChange={v => updateProfile('portraitUrl', v)} />
            <Field label="Resume URL (optional)" value={draft.profile.resumeUrl} onChange={v => updateProfile('resumeUrl', v)} />
            <Field label="Short headline" value={draft.profile.headline} onChange={v => updateProfile('headline', v)} wide />
            <Field label="About me" value={draft.profile.about} onChange={v => updateProfile('about', v)} multiline wide />
          </div>}
          {activeTab === 'links' && <div className="editor-form-grid">{[['linkedin','LinkedIn URL'],['website','Personal website URL'],['email','Public contact email']].map(([key, label]) => <Field key={key} label={label} value={draft.links[key] || ''} onChange={v => updateLink(key, v)} />)}<p className="editor-help wide">Use full https:// URLs for your LinkedIn or personal website. Project cards only show live-demo links; source-code links are not displayed.</p></div>}
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
    projects: [['title','Project title'],['category','Category'],['description','Description','textarea'],['stack','Tech stack (comma separated)'],['demo','Live demo URL (optional)'],['featured','Show on portfolio','checkbox']],
    education: [['qualification','Qualification'],['institution','Institution'],['start','Start date/year'],['end','End date/year'],['status','Status'],['details','Details','textarea']],
    experience: [['role','Role / position'],['company','Company / organisation'],['start','Start date/year'],['end','End date/year or Present'],['location','Location'],['details','Responsibilities / achievements','textarea']],
    certifications: [['name','Certificate / course name'],['issuer','Issuing organisation'],['date','Date earned'],['credential','Credential URL']],
    services: [['title','Service title'],['description','Description','textarea']],
  }[type] || [];
  return <div className="entry-form">{fields.map(([key, label, kind]) => <label className={cx('field', (kind === 'textarea' || key === 'description') && 'field-wide')} key={key}><span>{label}</span>{kind === 'textarea' ? <textarea rows={3} value={value[key] || ''} onChange={e => onChange({ ...value, [key]: e.target.value })} /> : kind === 'checkbox' ? <input type="checkbox" checked={Boolean(value[key])} onChange={e => onChange({ ...value, [key]: e.target.checked })} /> : <input value={value[key] || ''} onChange={e => onChange({ ...value, [key]: e.target.value })} />}</label>)}<div className="entry-form-actions"><button className="button button-quiet" onClick={onCancel}>Cancel</button><button className="button button-primary" onClick={onSave}><Check size={15} /> Done</button></div></div>;
}

export default App;
