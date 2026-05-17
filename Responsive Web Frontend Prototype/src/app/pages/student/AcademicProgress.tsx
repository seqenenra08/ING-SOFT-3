import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, BookOpen, Calendar, Users, Loader2 } from 'lucide-react';
import { C } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { programsService, Program } from '../../services/programsService';

export const AcademicProgress = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    programsService.getStudentId(user.id).then(sid => {
      if (!sid) { setLoading(false); return; }
      programsService.getMyEnrollments(sid).then(setPrograms).finally(() => setLoading(false));
    });
  }, [user]);

  const totalCapacity = programs.reduce((s, p) => s + (p.capacity ?? 0), 0);
  const totalEnrolled = programs.reduce((s, p) => s + (p.enrolled ?? 0), 0);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Estudiante</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mi Progreso Académico</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            {loading ? 'Cargando...' : `${programs.length} programa(s) activo(s)`}
          </p>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {[
          { label: 'Programas Inscritos', value: loading ? '...' : programs.length,  icon: BookOpen,   color: C.primary },
          { label: 'Categorías',          value: loading ? '...' : new Set(programs.map(p => p.category)).size, icon: TrendingUp, color: C.gold },
          { label: 'Compañeros',          value: loading ? '...' : totalEnrolled,    icon: Users,      color: C.active  },
          { label: 'Programas con horario', value: loading ? '...' : programs.filter(p => p.schedule).length, icon: Calendar, color: '#6b4040' },
        ].map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={k.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width: 32, height: 32, border: `1.5px solid ${k.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                <Icon style={{ width: 14, height: 14, color: k.color }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{k.value}</p>
                <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 2 }}>{k.label}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', gap: 20 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Programs list */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>MIS PROGRAMAS ACTIVOS</span>
            </div>

            {loading ? (
              <div style={{ padding: '32px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: C.muted, fontSize: '0.82rem' }}>
                <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} /> Cargando...
              </div>
            ) : programs.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                <BookOpen style={{ width: 36, height: 36, color: C.border, margin: '0 auto 12px' }} />
                <p style={{ color: C.muted, fontSize: '0.82rem' }}>No tienes programas inscritos aún.</p>
              </div>
            ) : programs.map((p, i, arr) => {
              const pct = p.capacity ? Math.round((p.enrolled / p.capacity) * 100) : 0;
              return (
                <div key={p.id}>
                  <div style={{ padding: '16px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.9rem' }}>{p.name}</p>
                        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                          <span style={{ fontSize: '0.72rem', color: C.muted }}>{p.category}</span>
                          {p.educator && <span style={{ fontSize: '0.72rem', color: C.subtle }}>· {p.educator}</span>}
                        </div>
                      </div>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.active, border: `1px solid ${C.active}44`, padding: '2px 8px', borderRadius: 2 }}>Inscrito</span>
                    </div>
                    {p.schedule && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <Calendar style={{ width: 11, height: 11, color: C.subtle }} />
                        <span style={{ fontSize: '0.72rem', color: C.subtle }}>{p.schedule}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: '0.68rem', color: C.subtle }}>Ocupación del grupo</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: C.primary }}>{p.enrolled}/{p.capacity} estudiantes</span>
                    </div>
                    <div style={{ height: 3, background: C.border, borderRadius: 2 }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(pct, 100)}%` }}
                        transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                        style={{ height: '100%', background: pct >= 90 ? C.active : C.primary, borderRadius: 2 }} />
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text, textTransform: 'uppercase' }}>Detalle por Programa</span>
            </div>

            {loading ? (
              <div style={{ padding: '24px 18px', color: C.muted, fontSize: '0.78rem' }}>Cargando...</div>
            ) : programs.length === 0 ? (
              <div style={{ padding: '24px 18px', color: C.muted, fontSize: '0.78rem' }}>Sin programas inscritos.</div>
            ) : programs.map((p, i, arr) => (
              <div key={p.id}>
                <div style={{ padding: '12px 18px' }}>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text, marginBottom: 4 }}>{p.name}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: '0.68rem', color: C.subtle }}>Estudiantes</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: C.gold }}>{p.enrolled}/{p.capacity}</span>
                  </div>
                  {p.level && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.68rem', color: C.subtle }}>Nivel</span>
                      <span style={{ fontSize: '0.72rem', color: C.muted }}>{p.level}</span>
                    </div>
                  )}
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
