import { useState } from 'react';
import { useParams } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, XCircle, Save, Users } from 'lucide-react';
import { C } from '../../theme';

const students = [
  { id: '1', name: 'Camila Rodríguez',    attendance: 94 },
  { id: '2', name: 'Valentina Torres',    attendance: 88 },
  { id: '3', name: 'Alejandro Herrera',   attendance: 100 },
  { id: '4', name: 'Isabella Gómez',      attendance: 82 },
  { id: '5', name: 'Juan David Pérez',    attendance: 76 },
  { id: '6', name: 'Daniela Castro',      attendance: 97 },
];

export const Attendance = () => {
  const { groupId } = useParams();
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);

  const toggle = (id: string) => setAttendance(prev => ({ ...prev, [id]: !prev[id] }));
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const present = Object.values(attendance).filter(Boolean).length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Registro de Asistencia</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Grupo A – Ballet Clásico</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
              {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })} · {present}/{students.length} presentes
            </p>
          </div>
          <button onClick={handleSave} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 20px', background: saved ? '#4b7a30' : C.primary,
            color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'background 0.2s',
          }}>
            {saved ? <><CheckCircle style={{ width: 14, height: 14 }} /> Guardado</> : <><Save style={{ width: 14, height: 14 }} /> Guardar</>}
          </button>
        </motion.div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 40px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>LISTADO DE ESTUDIANTES</span>
            <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: C.muted }}>{students.length} estudiantes</span>
          </div>

          {/* Header row */}
          <div style={{ display: 'flex', padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}` }}>
            <span style={{ flex: 1, fontSize: '0.68rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estudiante</span>
            <span style={{ fontSize: '0.68rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 100, textAlign: 'center' }}>Asist. Hist.</span>
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
                  <div style={{ width: 100, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: s.attendance >= 90 ? C.primary : C.gold }}>{s.attendance}%</span>
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
        </motion.div>
      </div>
    </div>
  );
};
