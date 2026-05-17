import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, Calendar, ClipboardCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { C } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { educatorsService } from '../../services/educatorsService';
import { programsService, Program } from '../../services/programsService';

export const EducatorDashboard = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    educatorsService.getEducatorId(user.id).then(eid => {
      if (!eid) { setLoading(false); return; }
      programsService.getByEducatorId(eid).then(setPrograms).finally(() => setLoading(false));
    });
  }, [user]);

  const totalStudents = programs.reduce((s, p) => s + (p.enrolled ?? 0), 0);

  const kpis = [
    { label: 'Mis Grupos',        value: loading ? '...' : programs.length, color: C.primary },
    { label: 'Total Estudiantes', value: loading ? '...' : totalStudents,   color: C.gold    },
    { label: 'Programas Activos', value: loading ? '...' : programs.length, color: C.active  },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* Hero */}
      <div style={{ background: C.dark, padding: '32px 40px', borderBottom: `1px solid #2a1212`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 8 }}>
            Panel del Educador
          </p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>
            Bienvenido, {user?.name ?? 'Educador'}
          </h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
            {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {kpis.map((k, i) => (
          <div key={k.label} style={{ flex: 1, padding: '16px 20px', borderRight: i < kpis.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 3 }}>{k.label}</p>
            <div style={{ height: 2, background: k.color, marginTop: 8, width: 24, borderRadius: 1 }} />
          </div>
        ))}
      </motion.div>

      {/* Body */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Main */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 16, background: C.primary, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>MIS GRUPOS</span>
              </div>
              <Link to="/educador/grupos">
                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: C.active, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                  Ver todos <ArrowRight style={{ width: 11, height: 11 }} />
                </span>
              </Link>
            </div>

            {loading ? (
              <div style={{ padding: '24px 20px', color: C.muted, fontSize: '0.82rem' }}>Cargando programas...</div>
            ) : programs.length === 0 ? (
              <div style={{ padding: '24px 20px', color: C.muted, fontSize: '0.82rem' }}>No tienes programas asignados aún.</div>
            ) : programs.slice(0, 4).map((p, i, arr) => (
              <div key={p.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{p.name}</p>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.active, border: `1px solid ${C.active}44`, padding: '2px 8px', borderRadius: 2 }}>Activo</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}>
                        <Users style={{ width: 11, height: 11 }} /> {p.enrolled ?? 0} estudiantes
                      </span>
                      {p.schedule && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}>
                          <Calendar style={{ width: 11, height: 11 }} /> {p.schedule}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <Link to={`/educador/asistencia/${p.id}`}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: C.primary, color: '#fff', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                        <ClipboardCheck style={{ width: 13, height: 13 }} /> Asistencia
                      </button>
                    </Link>
                    <Link to={`/educador/grupo/${p.id}`}>
                      <button style={{ padding: '7px 14px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 2 }}>
                        Ver
                      </button>
                    </Link>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.42 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text, textTransform: 'uppercase' }}>Acciones</span>
            </div>
            {[
              { to: '/educador/grupos',  icon: Users,       label: 'Ver Mis Grupos' },
              { to: '/educador/horario', icon: Calendar,    label: 'Ver Horario'    },
              { to: '/educador/alertas', icon: AlertCircle, label: 'Ver Alertas'    },
            ].map((a, i, arr) => {
              const Icon = a.icon;
              return (
                <div key={a.to}>
                  <Link to={a.to}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                      <Icon style={{ width: 13, height: 13, color: C.muted, flexShrink: 0 }} />
                      <span style={{ fontSize: '0.78rem', color: C.text, flex: 1 }}>{a.label}</span>
                      <ArrowRight style={{ width: 11, height: 11, color: C.border }} />
                    </div>
                  </Link>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
