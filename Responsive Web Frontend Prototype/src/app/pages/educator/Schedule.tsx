import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Users, BookOpen } from 'lucide-react';
import { C } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { educatorsService } from '../../services/educatorsService';
import { programsService, Program } from '../../services/programsService';

export const Schedule = () => {
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

  const withSchedule = programs.filter(p => p.schedule);
  const withoutSchedule = programs.filter(p => !p.schedule);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Educador</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mi Horario</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            {loading ? 'Cargando...' : `${programs.length} programa(s) asignado(s)`}
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        {loading ? (
          <p style={{ color: C.muted, fontSize: '0.82rem' }}>Cargando horario...</p>
        ) : programs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <BookOpen style={{ width: 36, height: 36, color: C.border, margin: '0 auto 12px' }} />
            <p style={{ color: C.muted, fontSize: '0.82rem' }}>No tienes programas asignados aún.</p>
          </div>
        ) : (
          <>
            {withSchedule.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                style={{ background: C.surface, border: `1px solid ${C.border}`, marginBottom: 20 }}>
                <div style={{ padding: '12px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    PROGRAMAS CON HORARIO
                  </span>
                </div>
                {withSchedule.map((p, i, arr) => (
                  <div key={p.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderLeft: i === 0 ? `3px solid ${C.active}` : '3px solid transparent' }}>
                      <div style={{ width: 36, height: 36, flexShrink: 0, background: C.tint, border: `1px solid ${C.active}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                        <Calendar style={{ width: 14, height: 14, color: C.primary }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{p.name}</p>
                        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: C.subtle }}>
                            <Clock style={{ width: 11, height: 11 }} /> {p.schedule}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem', color: C.subtle }}>
                            <Users style={{ width: 11, height: 11 }} /> {p.enrolled ?? 0} estudiantes
                          </span>
                        </div>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: C.muted, padding: '2px 8px', border: `1px solid ${C.border}`, borderRadius: 2 }}>{p.category}</span>
                    </div>
                    {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                  </div>
                ))}
              </motion.div>
            )}

            {withoutSchedule.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div style={{ padding: '12px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    SIN HORARIO ASIGNADO
                  </span>
                </div>
                {withoutSchedule.map((p, i, arr) => (
                  <div key={p.id}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px' }}>
                      <div style={{ width: 36, height: 36, flexShrink: 0, background: C.tint, border: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                        <Calendar style={{ width: 14, height: 14, color: C.subtle }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{p.name}</p>
                        <span style={{ fontSize: '0.7rem', color: C.subtle }}>Horario por confirmar · {p.enrolled ?? 0} estudiantes</span>
                      </div>
                      <span style={{ fontSize: '0.68rem', color: C.muted, padding: '2px 8px', border: `1px solid ${C.border}`, borderRadius: 2 }}>{p.category}</span>
                    </div>
                    {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                  </div>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
