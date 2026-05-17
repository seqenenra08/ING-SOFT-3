import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { C } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { educatorsService } from '../../services/educatorsService';
import { programsService, Program } from '../../services/programsService';

export const MyGroups = () => {
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

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Educador</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mis Grupos</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            {loading ? 'Cargando...' : `${programs.length} grupo(s) asignado(s)`}
          </p>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {[
          { label: 'Total Grupos',      value: loading ? '...' : programs.length },
          { label: 'Total Estudiantes', value: loading ? '...' : totalStudents   },
          { label: 'Categorías',        value: loading ? '...' : new Set(programs.map(p => p.category)).size },
        ].map((k, i) => (
          <div key={k.label} style={{ flex: 1, padding: '16px 24px', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 3 }}>{k.label}</p>
          </div>
        ))}
      </motion.div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>LISTADO DE GRUPOS</span>
          </div>

          {loading ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: C.muted, fontSize: '0.82rem' }}>Cargando grupos...</div>
          ) : programs.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center' }}>
              <BookOpen style={{ width: 36, height: 36, color: C.border, margin: '0 auto 12px' }} />
              <p style={{ color: C.muted, fontSize: '0.82rem' }}>No tienes programas asignados aún.</p>
            </div>
          ) : programs.map((p, i, arr) => (
            <div key={p.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                <div style={{ width: 40, height: 40, flexShrink: 0, background: C.tint, border: `1px solid ${C.active}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                  <Users style={{ width: 16, height: 16, color: C.primary }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{p.name}</p>
                  <div style={{ display: 'flex', gap: 16, marginTop: 3 }}>
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
                <span style={{ fontSize: '0.68rem', color: C.muted, marginRight: 8 }}>{p.category}</span>
                <Link to={`/educador/grupo/${p.id}`}>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 2 }}>
                    Ver <ArrowRight style={{ width: 11, height: 11 }} />
                  </button>
                </Link>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
