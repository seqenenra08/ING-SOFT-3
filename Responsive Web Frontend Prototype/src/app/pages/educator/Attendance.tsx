import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Save, Users, ArrowLeft, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../theme';
import { programsService, Program } from '../../services/programsService';

const todayKey = (programId: string) =>
  `attendance_taken_${programId}_${new Date().toISOString().split('T')[0]}`;

export const Attendance = () => {
  const { id } = useParams<{ id: string }>();
  const [program, setProgram] = useState<Program | null>(null);
  const [students, setStudents] = useState<{ id: string; name: string }[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  useEffect(() => {
    if (!id) return;
    setAlreadyTaken(!!localStorage.getItem(todayKey(id)));
    Promise.all([
      programsService.getById(id),
      programsService.getEnrolledStudents(id),
    ]).then(([prog, studs]) => {
      setProgram(prog);
      setStudents(studs);
    }).catch(() => toast.error('No se pudo cargar la información'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggle = (sid: string) => {
    if (alreadyTaken) return;
    setAttendance(prev => ({ ...prev, [sid]: !prev[sid] }));
  };

  const handleSave = () => {
    if (!id) return;
    localStorage.setItem(todayKey(id), new Date().toISOString());
    setAlreadyTaken(true);
    setSaved(true);
    toast.success('Asistencia guardada correctamente');
    setTimeout(() => setSaved(false), 2000);
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <Link to="/educador/grupos" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginBottom: 10, textDecoration: 'none' }}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Volver a mis grupos
            </Link>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Registro de Asistencia</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>
              {loading ? 'Cargando...' : (program?.name ?? 'Programa')}
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
              {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
              {!loading && ` · ${presentCount}/${students.length} presentes`}
            </p>
          </div>
          {!loading && !alreadyTaken && (
            <button onClick={handleSave} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', background: saved ? '#4b7a30' : C.primary,
              color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'background 0.2s',
            }}>
              {saved ? <><CheckCircle style={{ width: 14, height: 14 }} /> Guardado</> : <><Save style={{ width: 14, height: 14 }} /> Guardar</>}
            </button>
          )}
          {!loading && alreadyTaken && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: `${C.gold}18`, border: `1px solid ${C.gold}55`, borderRadius: 2 }}>
              <CheckCircle style={{ width: 14, height: 14, color: C.gold }} />
              <span style={{ fontSize: '0.78rem', color: C.gold, fontWeight: 600 }}>Asistencia ya tomada hoy</span>
            </div>
          )}
        </motion.div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 40px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>LISTADO DE ESTUDIANTES</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: C.muted }}>
              {loading ? '...' : `${students.length} estudiantes`}
            </span>
          </div>

          {alreadyTaken && !loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: `${C.gold}10`, borderBottom: `1px solid ${C.gold}33` }}>
              <AlertTriangle style={{ width: 14, height: 14, color: C.gold, flexShrink: 0 }} />
              <p style={{ fontSize: '0.78rem', color: C.gold }}>
                La asistencia de hoy ya fue registrada. Puedes consultarla pero no modificarla.
              </p>
            </div>
          )}
          {loading ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: C.muted, fontSize: '0.82rem' }}>Cargando estudiantes...</div>
          ) : students.length === 0 ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: C.muted, fontSize: '0.82rem' }}>
              No hay estudiantes inscritos en este programa.
            </div>
          ) : (
            <>
              {/* Header row */}
              <div style={{ display: 'flex', padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}` }}>
                <span style={{ flex: 1, fontSize: '0.68rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estudiante</span>
                <span style={{ fontSize: '0.68rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 80, textAlign: 'center' }}>Hoy</span>
              </div>

              {students.map((s, i, arr) => {
                const present = attendance[s.id] ?? false;
                return (
                  <div key={s.id}>
                    <div style={{
                      display: 'flex', alignItems: 'center', padding: '14px 20px',
                      borderLeft: present ? `3px solid ${C.primary}` : '3px solid transparent',
                      transition: 'background 0.15s',
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Users style={{ width: 13, height: 13, color: C.primary }} />
                        </div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, color: C.text, fontSize: '0.85rem' }}>{s.name}</p>
                      </div>
                      <div style={{ width: 80, display: 'flex', justifyContent: 'center' }}>
                        <button onClick={() => toggle(s.id)} style={{
                          width: 36, height: 36, background: present ? C.primary : C.surfaceAlt,
                          border: `1.5px solid ${present ? C.primary : C.border}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', borderRadius: 2, transition: 'all 0.15s',
                        }}>
                          {present
                            ? <CheckCircle style={{ width: 16, height: 16, color: '#fff' }} />
                            : <XCircle style={{ width: 16, height: 16, color: C.subtle }} />
                          }
                        </button>
                      </div>
                    </div>
                    {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                  </div>
                );
              })}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};
