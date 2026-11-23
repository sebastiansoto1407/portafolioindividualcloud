import { useEffect, useState } from 'react';
import { getPortfolio, sendContactMessage } from './api.js';
import { formatCertificationDate, getProjectLink, uniqueNonBlankItems } from './presentation.js';

const portraitUrl = 'https://sebastiansoto1407.github.io/portafoliodevida/fotoyo1.jpeg';

function Header() {
  return (
    <header className="site-header">
      <nav className="nav container" aria-label="Navegación principal">
        <a className="brand" href="#inicio" aria-label="Volver al inicio">AS<span>SA</span></a>
        <div className="nav-links">
          <a href="#inicio">Inicio</a>
          <a href="#habilidades">Habilidades</a>
          <a href="#certificaciones">Certificaciones</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto">Contacto</a>
        </div>
      </nav>
    </header>
  );
}

function Hero({ profile }) {
  return (
    <section className="hero" id="inicio">
      <div className="hero-glow" aria-hidden="true" />
      <div className="container hero-content">
        <div className="portrait-wrap">
          <img src={profile.photo_url || portraitUrl} alt={`Foto de ${profile.full_name}`} />
        </div>
        <p className="eyebrow">PORTAFOLIO PERSONAL</p>
        <h1>Hola, soy <span>{profile.full_name}</span></h1>
        <p className="subtitle">{profile.headline}</p>
        {profile.highlight && <p className="honor">✦ {profile.highlight}</p>}
        <p className="intro">{profile.bio}</p>
        <div className="hero-actions">
          <a className="button primary" href="#proyectos">Explorar proyectos <span aria-hidden="true">↗</span></a>
          <a className="button secondary" href="#contacto">Contáctame <span aria-hidden="true">↗</span></a>
          <a className="button secondary" href="https://github.com/sebastiansoto1407" target="_blank" rel="noreferrer">GitHub <span aria-hidden="true">↗</span></a>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, children }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{children}</h2></div>;
}

function Skills({ skills }) {
  return (
    <section className="section" id="habilidades">
      <div className="container">
        <SectionHeading eyebrow="LO QUE HAGO">Perfil técnico</SectionHeading>
        <div className="skills-grid">
          {skills.map((skill) => (
            <article className="card skill-card" key={skill.id}>
              <span className="card-icon" aria-hidden="true">{skill.icon || '◈'}</span>
              <h3>{skill.category}</h3>
              <div className="chips">{uniqueNonBlankItems(skill.items).map((item) => <span className="chip" key={item}>{item}</span>)}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certifications({ certifications }) {
  return (
    <section className="section section-alt" id="certificaciones">
      <div className="container">
        <SectionHeading eyebrow="APRENDIZAJE CONTINUO">Educación & certificaciones</SectionHeading>
        <div className="cert-grid">
          {certifications.map((certificate) => (
            <article className="card cert-card" key={certificate.id}>
              <div className="cert-mark" aria-hidden="true">✦</div>
              <div>
                <h3>{certificate.title}</h3>
                <p>{certificate.issuer}</p>
                <time dateTime={certificate.issued_on}>{formatCertificationDate(certificate.issued_on)}</time>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects({ projects }) {
  return (
    <section className="section" id="proyectos">
      <div className="container">
        <SectionHeading eyebrow="TRABAJO SELECCIONADO">Portafolio de proyectos</SectionHeading>
        <div className="projects-grid">
          {projects.map((project) => (
            <article className="card project-card" key={project.id}>
              <div className="project-top"><span className="project-type">{project.category}</span><span className="project-arrow" aria-hidden="true">↗</span></div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="chips project-tags">{project.tags.map((tag) => <span className="chip" key={tag}>{tag}</span>)}</div>
              {getProjectLink(project.link_url) && <a className="project-link" href={getProjectLink(project.link_url)} target="_blank" rel="noreferrer">{project.link_label || 'Ver proyecto'} <span aria-hidden="true">↗</span></a>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const emptyContact = { name: '', email: '', message: '' };

function ContactForm() {
  const [contact, setContact] = useState(emptyContact);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState(null);

  function updateField(event) {
    const { name, value } = event.target;
    setContact((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setSending(true);
    setFeedback(null);
    try {
      await sendContactMessage(contact);
      setContact(emptyContact);
      setFeedback({ success: true, text: '¡Gracias! Tu mensaje fue guardado. Te responderé por correo.' });
    } catch (error) {
      setFeedback({ success: false, text: error.message });
    } finally {
      setSending(false);
    }
  }

  return (
    <section className="section section-alt" id="contacto">
      <div className="container">
        <SectionHeading eyebrow="HABLEMOS">Contáctame</SectionHeading>
        <div className="contact-layout">
          <div className="contact-copy">
            <h3>¿Tienes una idea o quieres colaborar?</h3>
            <p>Déjame tu nombre, correo y mensaje. Lo recibiré de forma privada y podré responderte.</p>
          </div>
          <form className="card contact-form" onSubmit={submit}>
            <label htmlFor="contact-name">Tu nombre</label>
            <input id="contact-name" name="name" type="text" autoComplete="name" required minLength={2} maxLength={80} value={contact.name} onChange={updateField} placeholder="¿Cómo te llamas?" />
            <label htmlFor="contact-email">Tu correo</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" required maxLength={254} value={contact.email} onChange={updateField} placeholder="nombre@ejemplo.com" />
            <label htmlFor="contact-message">Tu mensaje</label>
            <textarea id="contact-message" name="message" required minLength={10} maxLength={2000} rows={6} value={contact.message} onChange={updateField} placeholder="Cuéntame en qué puedo ayudarte…" />
            <button className="button primary contact-submit" type="submit" disabled={sending}>{sending ? 'Enviando…' : 'Enviar mensaje'}</button>
            {feedback && <p className={feedback.success ? 'contact-feedback success' : 'contact-feedback error'} role={feedback.success ? 'status' : 'alert'}>{feedback.text}</p>}
          </form>
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getPortfolio().then((result) => { if (active) setData(result); }).catch((cause) => { if (active) setError(cause.message); });
    return () => { active = false; };
  }, []);

  return (
    <>
      <Header />
      {error && <main className="container state-message" role="alert"><h1>No se pudo cargar el portafolio</h1><p>{error}</p><p>Revisa que el backend esté iniciado y que Supabase esté configurado.</p></main>}
      {!error && !data && <main className="container state-message" role="status"><p>Cargando portafolio…</p></main>}
      {data && <main><Hero profile={data.profile} /><Skills skills={data.skills} /><Certifications certifications={data.certifications} /><Projects projects={data.projects} /><ContactForm /></main>}
      <footer className="footer"><div className="container"><strong>AS<span>SA</span></strong><p>© 2026 Andres Sebastian Soto Astete. Sistemas & Desarrollo.</p></div></footer>
    </>
  );
}

