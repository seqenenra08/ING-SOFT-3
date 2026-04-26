import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, TrendingUp, Calendar, ArrowLeft, ClipboardCheck } from 'lucide-react';
import { C } from '../../theme';

const groupsData: Record<string, any> = {
  '1': { name: 'Ballet Clásico - Grupo A',   program: 'Ballet Clásico', schedule: 'Mar y Jue 4:00 PM', location: 'Sala Principal', attendance: 94, students: [
    { id: '1', name: 'Camila Rodríguez',  attendance: 94, grade: 4.5 },
    { id: '2', name: 'Valentina Torres',  attendance: 88, grade: 4.2 },
    { id: '3', name: 'Alejandro Herrera', attendance: 100,grade: 4.8 },
    { id: '4', name: 'Isabella Gómez',    attendance: 82, grade: 3.9 },
  ]},
  '2': { name: 'Danza Folklórica - Grupo A', program: 'Danza Folklórica', schedule: 'Lun y Mié 5:00 PM', location: 'Sala 2', attendance: 89, students: [
    { id: '5', name: 'Juan David Pérez',  attendance: 76, grade: 3.7 },
    { id: '6', name: 'Daniela Castro',    attendance: 97, grade: 4.6 },
  ]},
};

export const GroupDetail = () => {
  const { id } = useParams();
  const group = groupsData[id ?? '1'] ?? groupsData['1'];

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
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>{group.name}</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{group.students.length} estudiantes · {group.schedule} · {group.location}</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>ESTUDIANTES</span>
              </div>
              <Link to={`/educador/asistencia/0`}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: C.primary, color: '#fff', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                  <ClipboardCheck style={{ width: 12, height: 12 }} /> Tomar Asistencia
                </button>
              </Link>
            </div>
            <div style={{ padding: '8px 20px 8px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
              <span style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Nombre</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 90, textAlign: 'center' }}>Asistencia</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 80, textAlign: 'center' }}>Calificación</span>
            </div>
            {group.students.map((s: any, i: number, arr: any[]) => (
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
                  <div style={{ width: 90, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: s.attendance >= 90 ? C.primary : C.gold }}>{s.attendance}%</span>
                  </div>
                  <div style={{ width: 80, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: C.text }}>{s.grade.toFixed(1)}</span>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            ))}
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
              { label: 'Estudiantes', value: group.students.length },
              { label: 'Asist. promedio', value: `${group.attendance}%` },
              { label: 'Calif. promedio', value: (group.students.reduce((s: number, st: any) => s + st.grade, 0) / group.students.length).toFixed(1) },
            ].map((item, i, arr) => (
              <div key={item.label}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' }}>
                  <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{item.label}</span>
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{item.value}</span>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
