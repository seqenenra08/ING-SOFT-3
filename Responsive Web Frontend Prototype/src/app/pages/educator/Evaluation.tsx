import { useState } from 'react';
import { motion } from 'motion/react';
import { Save, CheckCircle, Users, ChevronDown } from 'lucide-react';
import { C } from '../../theme';

const groupsData: Record<string, any> = {
  '1': { name: 'Ballet Clásico - Grupo A', program: 'Ballet Clásico', period: 'Técnica Básica', students: [
    { id: '1', name: 'Camila Rodríguez' },
    { id: '2', name: 'Valentina Torres' },
    { id: '3', name: 'Alejandro Herrera' },
    { id: '4', name: 'Isabella Gómez' },
  ]},
  '2': { name: 'Danza Folklórica - Grupo A', program: 'Danza Folklórica', period: 'Nivel Intermedio', students: [
    { id: '5', name: 'Juan David Pérez' },
    { id: '6', name: 'Daniela Castro' },
  ]},
};

export const Evaluation = () => {
  const [groupId, setGroupId] = useState('1');
  const group = groupsData[groupId];
  const students: { id: string; name: string }[] = group?.students ?? [];
  const [grades, setGrades] = useState<Record<string, string>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Educador</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Evaluaciones</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{group?.name} · {group?.period}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Group selector */}
            <div style={{ position: 'relative' }}>
              <select value={groupId} onChange={e => { setGroupId(e.target.value); setGrades({}); setComments({}); }}
                style={{ appearance: 'none', padding: '8px 36px 8px 12px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.8rem', outline: 'none', borderRadius: 2, cursor: 'pointer' }}>
                {Object.entries(groupsData).map(([id, g]) => (
                  <option key={id} value={id}>{g.name}</option>
                ))}
              </select>
              <ChevronDown style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: C.subtle, pointerEvents: 'none' }} />
            </div>
            <button onClick={handleSave} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '9px 20px', background: saved ? '#4b7a30' : C.primary,
              color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2, transition: 'background 0.2s',
            }}>
              {saved ? <><CheckCircle style={{ width: 14, height: 14 }} /> Guardado</> : <><Save style={{ width: 14, height: 14 }} /> Guardar Evaluaciones</>}
            </button>
          </div>
        </motion.div>
      </div>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '28px 40px' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.primary, borderRadius: 2 }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>REGISTRO DE CALIFICACIONES</span>
          </div>
          <div style={{ padding: '8px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 12 }}>
            <span style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estudiante</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 100 }}>Calificación</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', flex: 1 }}>Observaciones</span>
          </div>
          {students.map((s, i, arr) => (
            <div key={s.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px' }}>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 28, height: 28, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users style={{ width: 11, height: 11, color: C.primary }} />
                  </div>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 600, color: C.text, fontSize: '0.82rem' }}>{s.name}</p>
                </div>
                <input
                  type="number" min="0" max="5" step="0.1"
                  value={grades[s.id] ?? ''}
                  onChange={e => setGrades({ ...grades, [s.id]: e.target.value })}
                  placeholder="0.0"
                  style={{ width: 100, padding: '7px 10px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.85rem', outline: 'none', borderRadius: 2 }}
                  onFocus={e => e.target.style.borderColor = C.primary}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                <input
                  type="text"
                  value={comments[s.id] ?? ''}
                  onChange={e => setComments({ ...comments, [s.id]: e.target.value })}
                  placeholder="Observaciones..."
                  style={{ flex: 1, padding: '7px 10px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2 }}
                  onFocus={e => e.target.style.borderColor = C.primary}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
