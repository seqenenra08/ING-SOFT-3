import { Link } from 'react-router';
import { motion } from 'motion/react';
import { GraduationCap, Music, Palette, Drama, Users, Award, Calendar, Building2, ArrowRight, BookOpen, Mic2 } from 'lucide-react';
import { C, accentBar } from '../theme';

const categories = [
  { icon: Users,   label: 'Danza',          desc: 'Ballet clásico, folklórica colombiana, contemporánea' },
  { icon: Music,   label: 'Música',         desc: 'Instrumentos, canto, coro, teoría musical' },
  { icon: Drama,   label: 'Teatro',         desc: 'Actuación, improvisación, expresión dramática' },
  { icon: Palette, label: 'Artes Visuales', desc: 'Pintura, dibujo, escultura, técnicas mixtas' },
];

const features = [
  { icon: Award,         title: 'Educadores Profesionales', desc: 'Artistas con amplia trayectoria y formación pedagógica especializada en su disciplina artística.' },
  { icon: Calendar,      title: 'Horarios Flexibles',       desc: 'Programas adaptados a tus necesidades, en jornadas mañana, tarde y fines de semana.' },
  { icon: GraduationCap, title: 'Certificación Oficial',    desc: 'Certificados oficiales al completar cada programa de formación artística.' },
];

const SectionHeader = ({ label, eyebrow }: { label: string; eyebrow: string }) => (
  <div style={{ marginBottom: 40 }}>
    <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 8 }}>
      {eyebrow}
    </p>
    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(1.5rem,3vw,2.2rem)', fontWeight: 700, color: C.text }}>
      {label}
    </h2>
  </div>
);

export const Landing = () => (
  <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>

    {/* ── Top accent ─────────────────────────── */}
    <div style={{ height: 3, background: accentBar }} />

    {/* ── Header ─────────────────────────────── */}
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: C.dark, borderBottom: `1px solid ${C.darkBorder}`,
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 30, height: 30, background: C.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          }}>
            <BookOpen style={{ width: 13, height: 13, color: '#fff' }} />
          </div>
          <div>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: '#f5f0ef', letterSpacing: '0.02em' }}>
              LUCY TEJADA
            </span>
            <span style={{ display: 'block', fontSize: '0.58rem', color: '#a08888', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: -2 }}>
              Centro Cultural
            </span>
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link to="/login">
            <button style={{
              padding: '6px 16px', background: 'transparent', border: `1px solid ${C.darkBorder}`,
              color: '#a08888', fontSize: '0.8rem', cursor: 'pointer', borderRadius: 3,
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.primary; (e.currentTarget as HTMLButtonElement).style.color = '#f5f0ef'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.darkBorder; (e.currentTarget as HTMLButtonElement).style.color = '#a08888'; }}
            >
              Iniciar Sesión
            </button>
          </Link>
          <Link to="/registro">
            <button style={{
              padding: '6px 16px', background: C.primary,
              color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', borderRadius: 3,
              border: 'none', transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = C.active}
              onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = C.primary}
            >
              Registrarse
            </button>
          </Link>
        </div>
      </div>
    </header>

    {/* ── Hero ───────────────────────────────── */}
    <section style={{ background: C.dark, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '80px 32px', display: 'flex', alignItems: 'center', gap: 64 }}>
        <motion.div
          initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={{ flex: 1, minWidth: 0 }}
        >
          <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 16 }}>
            Centro Cultural de Pereira
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
            Plataforma de Formación<br />
            <span style={{ color: C.active }}>Artística y Cultural</span>
          </h1>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, maxWidth: 520, marginBottom: 32 }}>
            Formación integral en danza, música, teatro y artes visuales. Descubre tu talento y crece con nosotros en el Centro Cultural Lucy Tejada de Santiago de Pereira.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/registro">
              <button style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '10px 24px', background: C.primary, color: '#fff',
                fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
                borderRadius: 3, transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.background = C.active}
                onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.background = C.primary}
              >
                Inscríbete Ahora <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </Link>
            <Link to="/login">
              <button style={{
                padding: '10px 24px', background: 'transparent',
                color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: '0.85rem',
                border: `1px solid rgba(255,255,255,0.15)`, cursor: 'pointer',
                borderRadius: 3, transition: 'all 0.15s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = C.primary; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'; }}
              >
                Acceder a mi Cuenta
              </button>
            </Link>
          </div>
          {/* Stats row */}
          <div style={{ display: 'flex', gap: 32, marginTop: 40, paddingTop: 32, borderTop: `1px solid rgba(255,255,255,0.07)` }}>
            {[['500+', 'Estudiantes'], ['8', 'Disciplinas'], ['15+', 'Educadores']].map(([n, l]) => (
              <div key={l}>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="hidden lg:block"
          style={{ width: 420, flexShrink: 0 }}
        >
          <div style={{ position: 'relative' }}>
            <img
              src="https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=800&h=600&fit=crop"
              alt="Arte y cultura"
              style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 2, display: 'block' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(12,2,2,0.8))' }} />
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: C.primary }} />
            <div style={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', gap: 6 }}>
              {categories.slice(0, 3).map(c => (
                <div key={c.label} style={{
                  flex: 1, padding: '6px 8px', textAlign: 'center',
                  background: 'rgba(12,2,2,0.7)', border: `1px solid ${C.darkBorder}`,
                  fontSize: '0.68rem', fontWeight: 600, color: 'rgba(255,255,255,0.6)',
                }}>
                  {c.label}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>

    {/* ── Categories ─────────────────────────── */}
    <section style={{ padding: '72px 32px', background: C.surface }}>
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <SectionHeader label="Programas para todas las edades" eyebrow="Áreas de Formación" />
        <div style={{ display: 'flex', gap: 1, background: C.border }}>
          {categories.map((c, i) => {
            const Icon = c.icon;
            return (
              <motion.div key={c.label}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{
                  flex: 1, background: C.surface, padding: '32px 24px',
                  borderLeft: i === 0 ? `3px solid ${C.active}` : 'none',
                  cursor: 'default', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = C.surface}
              >
                <div style={{
                  width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: C.tint, border: `1.5px solid ${C.active}33`, marginBottom: 16, borderRadius: 2,
                }}>
                  <Icon style={{ width: 18, height: 18, color: C.primary }} />
                </div>
                <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, marginBottom: 8, fontSize: '0.95rem' }}>{c.label}</h3>
                <p style={{ fontSize: '0.78rem', color: C.muted, lineHeight: 1.6 }}>{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── Features ───────────────────────────── */}
    <section style={{ padding: '72px 32px', background: C.bg }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'flex-start' }}>
        <div style={{ flex: '0 0 280px' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 8 }}>
            ¿Por qué elegirnos?
          </p>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, color: C.text, lineHeight: 1.2, marginBottom: 16 }}>
            Formación de excelencia
          </h2>
          <p style={{ fontSize: '0.82rem', color: C.muted, lineHeight: 1.7 }}>
            Más de 20 años formando artistas en el centro de Santiago de Pereira, con metodologías innovadoras y educadores de trayectoria nacional.
          </p>
          <Link to="/registro" style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', background: C.primary, color: '#fff',
              fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer',
              borderRadius: 3,
            }}>
              Inscríbete <ArrowRight style={{ width: 13, height: 13 }} />
            </button>
          </Link>
        </div>
        <div style={{ flex: 1, borderLeft: `1px solid ${C.border}` }}>
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  display: 'flex', gap: 20, padding: '28px 32px',
                  borderBottom: i < features.length - 1 ? `1px solid ${C.border}` : 'none',
                  borderLeft: `3px solid ${i === 0 ? C.active : 'transparent'}`,
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{
                  width: 36, height: 36, flexShrink: 0,
                  border: `1.5px solid ${C.primary}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2,
                }}>
                  <Icon style={{ width: 16, height: 16, color: C.primary }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.9rem', marginBottom: 6 }}>{f.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: C.muted, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* ── Venues Promo ───────────────────────── */}
    <section style={{ background: C.dark, padding: '72px 32px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ flex: 1 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{
              width: 36, height: 36, background: C.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2,
            }}>
              <Building2 style={{ width: 16, height: 16, color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#fff' }}>Alquiler de Escenarios</p>
              <p style={{ fontSize: '0.7rem', color: '#a08888' }}>Secretaría de Cultura</p>
            </div>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginBottom: 28, maxWidth: 460 }}>
            ¿Necesitas un espacio para tu evento cultural? Alquila auditorios, teatros y salas del municipio de forma fácil y transparente.
          </p>
          <div style={{ display: 'flex', gap: 24, marginBottom: 28 }}>
            {[['12+', 'Escenarios disponibles'], ['2,500+', 'Capacidad total']].map(([n, l]) => (
              <div key={l} style={{ padding: '12px 16px', border: `1px solid ${C.darkBorder}` }}>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: '0.7rem', color: '#a08888', marginTop: 3 }}>{l}</p>
              </div>
            ))}
          </div>
          <Link to="/escenarios">
            <button style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', background: C.gold, color: '#fff',
              fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer', borderRadius: 3,
            }}>
              Explorar escenarios culturales <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          className="hidden lg:block"
          style={{ width: 420, flexShrink: 0 }}
        >
          <img
            src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=480&fit=crop"
            alt="Escenarios culturales"
            style={{ width: '100%', height: 280, objectFit: 'cover', borderRadius: 2, display: 'block', opacity: 0.7 }}
          />
        </motion.div>
      </div>
    </section>

    {/* ── CTA ────────────────────────────────── */}
    <section style={{ padding: '72px 32px', background: C.surface }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 48, height: 48, background: C.primary, borderRadius: 2, marginBottom: 20,
          }}>
            <Mic2 style={{ width: 22, height: 22, color: '#fff' }} />
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, color: C.text, marginBottom: 12 }}>
            ¿Listo para comenzar tu viaje artístico?
          </h2>
          <p style={{ fontSize: '0.88rem', color: C.muted, lineHeight: 1.7, marginBottom: 28 }}>
            Únete a nuestra comunidad de más de 500 artistas en formación en el Centro Cultural Lucy Tejada.
          </p>
          <Link to="/registro">
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '11px 28px', background: C.primary, color: '#fff',
              fontWeight: 600, fontSize: '0.88rem', border: 'none', cursor: 'pointer', borderRadius: 3,
            }}>
              Registrarse Ahora <ArrowRight style={{ width: 14, height: 14 }} />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>

    {/* ── Footer ─────────────────────────────── */}
    <footer style={{ background: C.dark, padding: '40px 32px', borderTop: `1px solid ${C.darkBorder}` }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
            <BookOpen style={{ width: 12, height: 12, color: '#fff' }} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#f5f0ef', fontSize: '0.85rem' }}>
            Centro Cultural Lucy Tejada
          </span>
        </div>
        <p style={{ fontSize: '0.72rem', color: '#5a3030' }}>
          Pereira, Colombia · contacto@lucytejada.edu.co · (602) 123 4567
        </p>
        <p style={{ fontSize: '0.68rem', color: '#3a1a1a' }}>
          © 2026 Centro Cultural Lucy Tejada. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  </div>
);
