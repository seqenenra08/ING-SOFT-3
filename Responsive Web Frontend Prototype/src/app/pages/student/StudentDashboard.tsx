import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  BookOpen, Calendar, TrendingUp, Bell, Clock,
  Users, ArrowRight, MapPin, ChevronRight,
} from 'lucide-react';
import imgBallet  from '../../../imports/image.png';
import imgPintura from '../../../imports/image-1.png';
import imgHero    from '../../../imports/image-2.png';

/* ── Palette ─────────────────────────────────────────────── */
const C = {
  bg:        '#f5f1ee',
  surface:   '#ffffff',
  surfaceAlt:'#faf7f5',
  primary:   '#8b1a1a',
  active:    '#c0392b',
  gold:      '#a16207',
  text:      '#1a0808',
  muted:     '#7a5050',
  subtle:    '#b09898',
  border:    '#e2d5d0',
  tint:      '#fdf0f0',
  dark:      '#0c0202',
};

/* ── Data ────────────────────────────────────────────────── */
const kpis = [
  { label: 'Programas Activos', value: '2',   sub: 'inscritos',     icon: BookOpen,   color: C.primary },
  { label: 'Asistencia',        value: '94 %', sub: 'promedio',      icon: TrendingUp, color: C.gold    },
  { label: 'Próximas Clases',   value: '2',   sub: 'esta semana',   icon: Calendar,   color: C.active  },
  { label: 'Horas Cursadas',    value: '48',  sub: 'acumuladas',    icon: Clock,      color: '#6b4040' },
];

const programs = [
  { name: 'Ballet Clásico',   teacher: 'Diana Vargas',         group: 'Grupo A', progress: 65, img: imgBallet,  sessions: 18, next: 'Hoy 4:00 PM' },
  { name: 'Pintura al Óleo',  teacher: 'Luis Fernando Torres', group: 'Grupo A', progress: 42, img: imgPintura, sessions: 11, next: 'Mañana 2:00 PM' },
];

const sessions = [
  { program: 'Ballet Clásico',  date: 'Hoy',    time: '4:00 PM', location: 'Sala Principal', urgent: true  },
  { program: 'Pintura al Óleo', date: 'Mañana', time: '2:00 PM', location: 'Taller 2',       urgent: false },
];

const notifications = [
  { title: 'Nueva evaluación disponible',  time: 'Hace 2 horas', type: 'info'    },
  { title: 'Recordatorio: Clase mañana',   time: 'Hace 5 horas', type: 'warning' },
  { title: 'Calificaciones publicadas',    time: 'Ayer',         type: 'info'    },
];

/* ── Divider ─────────────────────────────────────────────── */
const Divider = () => (
  <div style={{ height: 1, background: C.border, margin: '0' }} />
);

/* ── Component ───────────────────────────────────────────── */
export const StudentDashboard = () => (
  <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>

    {/* ═══ HERO BANNER ════════════════════════════════════════ */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{ position: 'relative', height: 200, overflow: 'hidden' }}
    >
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: '#000',
      }} />
      {/* Red accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 4, background: C.active,
      }} />
      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        padding: '28px 40px',
      }}>
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <p style={{
            fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
            color: C.active, fontWeight: 600, marginBottom: 6,
          }}>
            Portal del Estudiante
          </p>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 700,
            color: '#fff', lineHeight: 1.15, marginBottom: 6,
          }}>
            Bienvenida, Camila Rodríguez
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.55)' }}>
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </motion.div>
      </div>
    </motion.div>

    {/* ═══ KPI STRIP ══════════════════════════════════════════ */}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        background: C.surface,
        borderBottom: `1px solid ${C.border}`,
        display: 'flex',
      }}
    >
      {kpis.map((k, i) => {
        const Icon = k.icon;
        return (
          <div key={k.label} style={{
            flex: 1, display: 'flex', alignItems: 'center', gap: 14,
            padding: '18px 24px',
            borderRight: i < kpis.length - 1 ? `1px solid ${C.border}` : 'none',
          }}>
            <div style={{
              width: 36, height: 36, flexShrink: 0,
              border: `1.5px solid ${k.color}55`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 4,
            }}>
              <Icon style={{ width: 16, height: 16, color: k.color }} />
            </div>
            <div>
              <p style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.4rem', fontWeight: 700,
                color: C.text, lineHeight: 1,
              }}>
                {k.value}
              </p>
              <p style={{ fontSize: '0.7rem', color: C.muted, marginTop: 3, lineHeight: 1 }}>
                {k.label}
              </p>
            </div>
          </div>
        );
      })}
    </motion.div>

    {/* ═══ BODY ═══════════════════════════════════════════════ */}
    <div style={{
      maxWidth: 1280, margin: '0 auto',
      padding: '28px 32px',
      display: 'flex', gap: 24, alignItems: 'flex-start',
    }}>

      {/* ── LEFT MAIN COLUMN ─────────────────────────────────── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── PROGRAMAS ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          {/* Section header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 22px', borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '0.9rem', color: C.text, letterSpacing: '0.01em',
              }}>
                MIS PROGRAMAS
              </span>
            </div>
            <Link to="/estudiante/mis-programas">
              <span style={{
                fontSize: '0.72rem', fontWeight: 600, color: C.active,
                display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer',
              }}>
                Ver todos <ArrowRight style={{ width: 12, height: 12 }} />
              </span>
            </Link>
          </div>

          {/* Program rows */}
          {programs.map((p, i) => (
            <div key={p.name}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
                style={{
                  display: 'flex', alignItems: 'stretch',
                  padding: '18px 22px', gap: 18,
                  cursor: 'pointer', transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = C.tint)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Image */}
                <div style={{ width: 88, height: 72, flexShrink: 0, overflow: 'hidden', borderRadius: 2 }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div>
                      <p style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700, fontSize: '0.9rem', color: C.text,
                      }}>
                        {p.name}
                      </p>
                      <p style={{ fontSize: '0.75rem', color: C.muted, marginTop: 3 }}>
                        {p.teacher} &nbsp;·&nbsp; {p.group} &nbsp;·&nbsp; {p.sessions} sesiones
                      </p>
                    </div>
                    <span style={{
                      fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: C.active,
                      border: `1px solid ${C.active}55`, padding: '2px 8px',
                      borderRadius: 2,
                    }}>
                      Activo
                    </span>
                  </div>

                  {/* Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.68rem', color: C.subtle }}>Avance del programa</span>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: C.primary }}>{p.progress}%</span>
                    </div>
                    <div style={{ height: 3, background: C.border, borderRadius: 2 }}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${p.progress}%` }}
                        transition={{ duration: 1.2, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
                        style={{ height: '100%', background: C.primary, borderRadius: 2 }}
                      />
                    </div>
                    <p style={{ fontSize: '0.68rem', color: C.subtle, marginTop: 5 }}>
                      Próxima sesión: <strong style={{ color: C.muted }}>{p.next}</strong>
                    </p>
                  </div>
                </div>
              </motion.div>
              {i < programs.length - 1 && <Divider />}
            </div>
          ))}
        </motion.div>

        {/* ── PRÓXIMAS CLASES ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 22px', borderBottom: `1px solid ${C.border}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '0.9rem', color: C.text, letterSpacing: '0.01em',
              }}>
                PRÓXIMAS CLASES
              </span>
            </div>
            <Calendar style={{ width: 15, height: 15, color: C.subtle }} />
          </div>

          {sessions.map((s, i) => (
            <div key={i}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '15px 22px',
                  borderLeft: s.urgent ? `3px solid ${C.active}` : `3px solid transparent`,
                }}
              >
                {/* Date badge */}
                <div style={{
                  width: 48, flexShrink: 0, textAlign: 'center',
                  background: s.urgent ? C.primary : C.surfaceAlt,
                  border: `1px solid ${s.urgent ? C.primary : C.border}`,
                  padding: '6px 4px', borderRadius: 2,
                }}>
                  <p style={{
                    fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: s.urgent ? '#fff' : C.muted,
                  }}>
                    {s.date}
                  </p>
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 600, fontSize: '0.85rem', color: C.text,
                  }}>
                    {s.program}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 3 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}>
                      <Clock style={{ width: 11, height: 11 }} /> {s.time}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}>
                      <MapPin style={{ width: 11, height: 11 }} /> {s.location}
                    </span>
                  </div>
                </div>
                <ChevronRight style={{ width: 15, height: 15, color: C.border, flexShrink: 0 }} />
              </motion.div>
              {i < sessions.length - 1 && <Divider />}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── RIGHT SIDEBAR ────────────────────────────────────── */}
      <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* ── ACCIONES RÁPIDAS ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div style={{
            padding: '14px 18px', borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '0.8rem', color: C.text, letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>
              Acciones
            </span>
          </div>
          {[
            { to: '/estudiante/programas', icon: BookOpen,   label: 'Explorar Programas' },
            { to: '/estudiante/progreso',  icon: TrendingUp, label: 'Ver Mi Progreso'    },
            { to: '/estudiante/perfil',    icon: Users,      label: 'Editar Perfil'      },
          ].map((a, i, arr) => {
            const Icon = a.icon;
            return (
              <div key={a.to}>
                <Link to={a.to}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 18px', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = C.tint; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    <Icon style={{ width: 14, height: 14, color: C.muted, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', color: C.text, flex: 1 }}>{a.label}</span>
                    <ArrowRight style={{ width: 12, height: 12, color: C.border }} />
                  </div>
                </Link>
                {i < arr.length - 1 && <Divider />}
              </div>
            );
          })}
        </motion.div>

        {/* ── NOTIFICACIONES ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.42 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}
        >
          <div style={{
            padding: '14px 18px', borderBottom: `1px solid ${C.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700, fontSize: '0.8rem', color: C.text, letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}>
                Notificaciones
              </span>
            </div>
            <Link to="/estudiante/notificaciones">
              <span style={{ fontSize: '0.68rem', color: C.active, cursor: 'pointer', fontWeight: 600 }}>
                Ver todas
              </span>
            </Link>
          </div>

          {notifications.map((n, i, arr) => (
            <div key={i}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 10,
                padding: '11px 18px',
                borderLeft: n.type === 'info' ? `2px solid ${C.primary}33` : `2px solid ${C.gold}44`,
              }}>
                <Bell style={{
                  width: 13, height: 13, flexShrink: 0, marginTop: 1,
                  color: n.type === 'info' ? C.primary : C.gold,
                }} />
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '0.78rem', color: C.text, lineHeight: 1.35 }}>{n.title}</p>
                  <p style={{ fontSize: '0.68rem', color: C.subtle, marginTop: 3 }}>{n.time}</p>
                </div>
              </div>
              {i < arr.length - 1 && <Divider />}
            </div>
          ))}
        </motion.div>

        {/* ── RESUMEN SEMANAL ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          style={{
            background: C.dark,
            border: `1px solid #2a1212`,
            padding: '18px 18px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
            <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700, fontSize: '0.75rem', letterSpacing: '0.08em',
              textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
            }}>
              Resumen Semanal
            </span>
          </div>
          {[
            { label: 'Clases asistidas',    value: '4 / 4' },
            { label: 'Tareas pendientes',   value: '2'     },
            { label: 'Próxima evaluación',  value: '5 días' },
          ].map((item, i, arr) => (
            <div key={item.label}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 0',
              }}>
                <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.8rem', fontWeight: 700, color: '#fff',
                }}>
                  {item.value}
                </span>
              </div>
              {i < arr.length - 1 && (
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
              )}
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  </div>
);
