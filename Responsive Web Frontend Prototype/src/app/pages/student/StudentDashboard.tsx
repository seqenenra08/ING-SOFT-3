import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import {
  BookOpen, Calendar, Bell,
  Users, ArrowRight, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { programsService } from '../../services/programsService';

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


/* ── Divider ─────────────────────────────────────────────── */
const Divider = () => (
  <div style={{ height: 1, background: C.border, margin: '0' }} />
);

/* ── Component ───────────────────────────────────────────── */
export const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledPrograms, setEnrolledPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      programsService.getStudentId(user.id).then(sid => {
        if (sid) programsService.getMyEnrollments(sid).then(setEnrolledPrograms).finally(() => setLoading(false));
        else setLoading(false);
      });
    }
  }, [user]);

  const kpis = [
    { label: 'Programas Activos', value: enrolledPrograms.length, sub: 'inscritos', icon: BookOpen, color: C.primary },
  ];

  return (
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
              Bienvenido/a, {user?.name ?? 'Estudiante'}
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
                  {loading ? '—' : k.value}
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
            {loading ? (
              <div style={{ padding: '24px 22px', fontSize: '0.82rem', color: C.subtle }}>Cargando programas...</div>
            ) : enrolledPrograms.length === 0 ? (
              <div style={{ padding: '24px 22px', fontSize: '0.82rem', color: C.muted }}>
                No tienes programas inscritos.{' '}
                <Link to="/estudiante/programas" style={{ color: C.active, fontWeight: 600 }}>Explorar programas</Link>
              </div>
            ) : (
              enrolledPrograms.map((p, i) => (
                <div key={p.id ?? i}>
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
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontWeight: 700, fontSize: '0.9rem', color: C.text,
                          }}>
                            {p.name}
                          </p>
                          <p style={{ fontSize: '0.75rem', color: C.muted, marginTop: 3 }}>
                            {p.educator} {p.category ? `· ${p.category}` : ''}
                          </p>
                        </div>
                        <span style={{
                          fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.08em',
                          textTransform: 'uppercase', color: C.active,
                          border: `1px solid ${C.active}55`, padding: '2px 8px',
                          borderRadius: 2, flexShrink: 0,
                        }}>
                          Activo
                        </span>
                      </div>
                    </div>
                    <ChevronRight style={{ width: 15, height: 15, color: C.border, flexShrink: 0, alignSelf: 'center' }} />
                  </motion.div>
                  {i < enrolledPrograms.length - 1 && <Divider />}
                </div>
              ))
            )}
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
            <div style={{ padding: '20px 22px', fontSize: '0.82rem', color: C.muted }}>
              Consulta tu horario con tu educador
            </div>
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
              { to: '/estudiante/programas', icon: BookOpen, label: 'Explorar Programas' },
              { to: '/estudiante/perfil',    icon: Users,    label: 'Editar Perfil'      },
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

            {loading ? (
              <div style={{ padding: '11px 18px', fontSize: '0.78rem', color: C.subtle }}>Cargando...</div>
            ) : enrolledPrograms.length === 0 ? (
              <div style={{ padding: '11px 18px', fontSize: '0.78rem', color: C.subtle }}>Sin notificaciones.</div>
            ) : enrolledPrograms.slice(0, 3).map((p: any, i: number, arr: any[]) => (
              <div key={p.id ?? i}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                  padding: '11px 18px',
                  borderLeft: `2px solid ${C.primary}33`,
                }}>
                  <Bell style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1, color: C.primary }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: '0.78rem', color: C.text, lineHeight: 1.35 }}>Inscrito en {p.name}</p>
                    <p style={{ fontSize: '0.68rem', color: C.subtle, marginTop: 3 }}>{p.category}{p.schedule ? ` · ${p.schedule}` : ''}</p>
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
              { label: 'Programas activos',    value: loading ? '...' : enrolledPrograms.length },
              { label: 'Con horario asignado', value: loading ? '...' : enrolledPrograms.filter((p: any) => p.schedule).length },
              { label: 'Categorías distintas', value: loading ? '...' : new Set(enrolledPrograms.map((p: any) => p.category)).size },
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
};
