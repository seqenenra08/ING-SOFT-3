import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Building2, Calendar, FileText, Shield, Search, MapPin, ArrowRight } from 'lucide-react';
import { C } from '../../theme';

const steps = [
  { num: '01', icon: Search,   title: 'Explora',    desc: 'Busca el espacio ideal según capacidad, ubicación y tipo de evento' },
  { num: '02', icon: Calendar, title: 'Solicita',   desc: 'Completa la solicitud en línea con los datos de tu evento' },
  { num: '03', icon: FileText, title: 'Aprobación', desc: 'Revisión administrativa y jurídica de tu solicitud' },
  { num: '04', icon: Shield,   title: 'Realiza',    desc: 'Paga, firma el contrato y disfruta tu evento' },
];

const stats = [
  { value: '12',   label: 'Escenarios disponibles' },
  { value: '2.5K+',label: 'Personas capacidad total' },
  { value: '150+', label: 'Eventos este año' },
  { value: '98%',  label: 'Satisfacción usuarios' },
];

const VC = {
  ...C,
  primary: '#7a1a1a',
  active:  '#b83228',
  gold:    '#8b5e07',
};

export function VenuesLanding() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* Accent top */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${VC.primary}, ${VC.active}, ${VC.gold})` }} />

      {/* Header */}
      <header style={{ background: C.dark, borderBottom: `1px solid #2a1212`, position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 30, height: 30, background: VC.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <Building2 style={{ width: 13, height: 13, color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#f5f0ef', fontSize: '0.82rem', lineHeight: 1.2 }}>
                Sistema de Gestión de Escenarios Culturales
              </p>
              <p style={{ fontSize: '0.6rem', color: '#a08888', letterSpacing: '0.08em' }}>Secretaría de Cultura · Alcaldía de Pereira</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to="/escenarios/seguimiento">
              <button style={{ padding: '6px 14px', background: 'transparent', border: `1px solid #2a1212`, color: '#a08888', fontSize: '0.78rem', cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = VC.primary; (e.currentTarget as HTMLButtonElement).style.color = '#f5f0ef'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#2a1212'; (e.currentTarget as HTMLButtonElement).style.color = '#a08888'; }}>
                Seguir mi solicitud
              </button>
            </Link>
            <Link to="/escenarios/backoffice/login">
              <button style={{ padding: '6px 14px', background: VC.primary, color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', border: 'none', borderRadius: 2 }}>
                Acceso funcionarios
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section style={{ background: C.dark, padding: '80px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: VC.active }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 64, alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} style={{ flex: 1 }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: VC.active, marginBottom: 16 }}>
              Alcaldía de Santiago de Pereira
            </p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}>
              Espacios culturales<br /><span style={{ color: VC.active }}>para tu evento</span>
            </h1>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 520, marginBottom: 32 }}>
              Alquila auditorios, teatros, salas y espacios culturales del municipio. Proceso 100% digital, transparente y seguro.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/escenarios/catalogo">
                <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 24px', background: VC.primary, color: '#fff', fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer', borderRadius: 3 }}>
                  <Search style={{ width: 14, height: 14 }} /> Explorar escenarios
                </button>
              </Link>
              <Link to="/escenarios/catalogo">
                <button style={{ padding: '10px 24px', background: 'transparent', color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', borderRadius: 3, transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = VC.primary; (e.currentTarget as HTMLButtonElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'; }}>
                  Ver disponibilidad
                </button>
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 28, marginTop: 40, paddingTop: 28, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              {stats.map(s => (
                <div key={s.label}>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden lg:block" style={{ width: 400, flexShrink: 0 }}>
            <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=540&fit=crop"
              alt="Escenarios" style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 2, opacity: 0.65 }} />
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '72px 32px', background: C.surface }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: VC.active, marginBottom: 8 }}>Proceso simple</p>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, color: C.text }}>¿Cómo funciona?</h2>
          </div>
          <div style={{ display: 'flex', gap: 1, background: C.border }}>
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={s.num}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                  style={{
                    flex: 1, background: C.surface, padding: '28px 24px',
                    borderLeft: i === 0 ? `3px solid ${VC.active}` : 'none',
                    cursor: 'default', transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = C.surface}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 36, height: 36, background: C.tint, border: `1.5px solid ${VC.active}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                      <Icon style={{ width: 15, height: 15, color: VC.primary }} />
                    </div>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.1em', color: VC.active }}>{s.num}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.9rem', marginBottom: 6 }}>{s.title}</h3>
                  <p style={{ fontSize: '0.78rem', color: C.muted, lineHeight: 1.6 }}>{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 32px', background: C.bg }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 44, height: 44, background: VC.primary, borderRadius: 2, marginBottom: 20 }}>
              <MapPin style={{ width: 20, height: 20, color: '#fff' }} />
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.7rem', fontWeight: 700, color: C.text, marginBottom: 12 }}>¿Listo para comenzar?</h2>
            <p style={{ fontSize: '0.85rem', color: C.muted, lineHeight: 1.7, marginBottom: 24 }}>Explora el catálogo y encuentra el espacio perfecto para tu evento cultural.</p>
            <Link to="/escenarios/catalogo">
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 28px', background: VC.primary, color: '#fff', fontWeight: 600, fontSize: '0.88rem', border: 'none', cursor: 'pointer', borderRadius: 3 }}>
                Ver catálogo completo <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: C.dark, padding: '36px 32px', borderTop: `1px solid #2a1212` }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 32, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 26, height: 26, background: VC.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                <Building2 style={{ width: 11, height: 11, color: '#fff' }} />
              </div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#f5f0ef', fontSize: '0.82rem' }}>Sistema de Gestión de Escenarios</p>
            </div>
            <p style={{ fontSize: '0.72rem', color: '#5a3030' }}>Secretaría de Cultura · Alcaldía de Santiago de Pereira</p>
          </div>
          <div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#f5f0ef', fontSize: '0.8rem', marginBottom: 10 }}>Contacto</p>
            <p style={{ fontSize: '0.72rem', color: '#5a3030' }}>Teléfono: (602) 885 6173</p>
            <p style={{ fontSize: '0.72rem', color: '#5a3030', marginTop: 3 }}>Email: cultura@Pereira.gov.co</p>
            <p style={{ fontSize: '0.72rem', color: '#5a3030', marginTop: 3 }}>Lunes a viernes, 8AM – 5PM</p>
          </div>
          <p style={{ fontSize: '0.68rem', color: '#3a1a1a', alignSelf: 'flex-end' }}>© 2026 Alcaldía de Santiago de Pereira.</p>
        </div>
      </footer>
    </div>
  );
}
