import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, TrendingUp, ArrowRight } from 'lucide-react';
import { C } from '../../theme';

const groups = [
  { id: 1, name: 'Ballet Clásico - Grupo A',   students: 12, attendance: 94, program: 'Ballet Clásico',  schedule: 'Mar y Jue 4:00 PM' },
  { id: 2, name: 'Danza Folklórica - Grupo A', students: 18, attendance: 89, program: 'Danza Folklórica',schedule: 'Lun y Mié 5:00 PM' },
  { id: 3, name: 'Ballet Clásico - Grupo B',   students: 10, attendance: 97, program: 'Ballet Clásico',  schedule: 'Vie 3:00 PM' },
  { id: 4, name: 'Danza Contemporánea',        students: 15, attendance: 85, program: 'Danza Contemporánea', schedule: 'Sáb 9:00 AM' },
];

export const MyGroups = () => (
  <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
    <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Educador</p>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mis Grupos</h1>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{groups.length} grupos asignados</p>
      </motion.div>
    </div>

    {/* KPI */}
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
      style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
      {[
        { label: 'Total Grupos',     value: groups.length },
        { label: 'Total Estudiantes',value: groups.reduce((s, g) => s + g.students, 0) },
        { label: 'Asist. Promedio',  value: `${Math.round(groups.reduce((s, g) => s + g.attendance, 0) / groups.length)}%` },
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
        {groups.map((g, i, arr) => (
          <div key={g.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
              <div style={{ width: 40, height: 40, flexShrink: 0, background: C.tint, border: `1px solid ${C.active}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                <Users style={{ width: 16, height: 16, color: C.primary }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{g.name}</p>
                <p style={{ fontSize: '0.72rem', color: C.muted, marginTop: 2 }}>{g.students} estudiantes · {g.schedule}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <TrendingUp style={{ width: 13, height: 13, color: C.gold }} />
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.gold }}>{g.attendance}%</span>
              </div>
              <div style={{ width: 80 }}>
                <div style={{ height: 2, background: C.border }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${g.attendance}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                    style={{ height: '100%', background: C.primary }} />
                </div>
              </div>
              <Link to={`/educador/grupo/${g.id}`}>
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
