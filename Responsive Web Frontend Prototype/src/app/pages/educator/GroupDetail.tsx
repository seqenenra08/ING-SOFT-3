import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, Calendar, ArrowLeft, ClipboardCheck, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../theme';
import { programsService, Program } from '../../services/programsService';

export const GroupDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      programsService.getById(id),
      programsService.getEnrolledStudents(id),
    ]).then(([prog, studs]) => {
      setProgram(prog);
      setStudents(studs);
    }).catch(() => toast.error('No se pudo cargar el grupo'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 28, height: 28, color: C.primary, animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  if (!program) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <BookOpen style={{ width: 36, height: 36, color: C.border, margin: '0 auto 12px' }} />
          <p style={{ color: C.muted, fontSize: '0.82rem' }}>Programa no encontrado.</p>
          <Link to="/educador/grupos" style={{ color: C.primary, fontSize: '0.82rem', textDecoration: 'none' }}>Volver a mis grupos</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <Link to="/educador/grupos" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: 10, textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 11, height: 11 }} /> Mis Grupos
          </Link>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Detalle de Grupo</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>{program.name}</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            {students.length} estudiantes
            {program.schedule && ` · ${program.schedule}`}
            {program.category && ` · ${program.category}`}
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>ESTUDIANTES INSCRITOS</span>
              </div>
              <Link to={`/educador/asistencia/${id}`}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: C.primary, color: '#fff', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                  <ClipboardCheck style={{ width: 12, height: 12 }} /> Tomar Asistencia
                </button>
              </Link>
            </div>

            {students.length === 0 ? (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: C.muted, fontSize: '0.82rem' }}>
                No hay estudiantes inscritos en este programa.
              </div>
            ) : (
              <>
                <div style={{ padding: '8px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
                  <span style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nombre</span>
                </div>
                {students.map((s, i, arr) => (
                  <div key={s.id}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 28, height: 28, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Users style={{ width: 11, height: 11, color: C.primary }} />
                        </div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, color: C.text, fontSize: '0.82rem' }}>{s.name}</p>
                      </div>
                    </div>
                    {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                  </div>
                ))}
              </>
            )}
          </motion.div>
        </div>

        <div style={{ width: 240, flexShrink: 0 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: C.dark, border: `1px solid #2a1212`, padding: '18px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>Resumen</span>
            </div>
            {[
              { label: 'Estudiantes',    value: students.length },
              { label: 'Capacidad',      value: program.capacity ?? '—' },
              { label: 'Cupos libres',   value: Math.max(0, (program.capacity ?? 0) - students.length) },
            ].map((item, i, arr) => (
              <div key={item.label}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{item.value}</span>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />}
              </div>
            ))}
            {program.schedule && (
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Calendar style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.3)' }} />
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Horario</span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{program.schedule}</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
