import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Users, ArrowRight } from 'lucide-react';
import { C } from '../../theme';
import { studentsData as students } from '../../data/mockData';

export const ManageStudents = () => {
  const [search, setSearch] = useState('');
  const filtered = (students as any[]).filter((s: any) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) ||
    s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Administración</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Estudiantes</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{(students as any[]).length} estudiantes registrados</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 400 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre o correo..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <p style={{ fontSize: '0.72rem', color: C.subtle }}>{filtered.length} resultado(s)</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
            <span style={{ flex: 2, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estudiante</span>
            <span style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Correo</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 80, textAlign: 'center' }}>Estado</span>
            <span style={{ width: 80 }} />
          </div>
          {filtered.map((s: any, i: number, arr: any[]) => (
            <div key={s.id}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', transition: 'background 0.15s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 30, height: 30, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Users style={{ width: 13, height: 13, color: C.primary }} />
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{s.name}</p>
                    <p style={{ fontSize: '0.68rem', color: C.subtle }}>{s.document ?? 'CC no registrado'}</p>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.75rem', color: C.muted }}>{s.email}</p>
                </div>
                <div style={{ width: 80, textAlign: 'center' }}>
                  <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.active, border: `1px solid ${C.active}44`, padding: '2px 6px', borderRadius: 2 }}>
                    {s.status ?? 'Activo'}
                  </span>
                </div>
                <div style={{ width: 80, textAlign: 'right' }}>
                  <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                    Ver <ArrowRight style={{ width: 10, height: 10 }} />
                  </button>
                </div>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
