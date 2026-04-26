import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, Calendar, User, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { C } from '../../theme';
import imgBallet from '../../../imports/image.png';
import imgPintura from '../../../imports/image-1.png';

const active = [
  { id: '1',   name: 'Ballet Clásico',  category: 'Danza',          educator: 'Diana Vargas',         group: 'Grupo A', schedule: 'Mar y Jue 4:00 PM - 6:00 PM', progress: 65, next: 'Mañana, 4:00 PM',          img: imgBallet  },
  { id: '7',   name: 'Pintura al Óleo', category: 'Artes Visuales', educator: 'Luis Fernando Torres', group: 'Grupo A', schedule: 'Mar 2:00 PM - 5:00 PM',       progress: 42, next: 'Mar 16 Abr, 2:00 PM',      img: imgPintura },
];
const completed = [
  { id: '100', name: 'Introducción a la Danza', category: 'Danza', educator: 'Diana Vargas', completedDate: 'Diciembre 2025', img: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=400&h=300&fit=crop' },
];

export const MyPrograms = () => {
  const [tab, setTab] = useState<'active' | 'completed'>('active');

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* Banner */}
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Estudiante</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mis Programas</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Gestiona tus inscripciones y revisa tu historial académico</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, marginBottom: 24 }}>
          {(['active', 'completed'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '0.82rem', fontWeight: tab === t ? 700 : 400,
              color: tab === t ? C.primary : C.muted,
              borderBottom: tab === t ? `2px solid ${C.primary}` : '2px solid transparent',
              marginBottom: -1, transition: 'all 0.15s',
            }}>
              {t === 'active' ? `Activos (${active.length})` : `Completados (${completed.length})`}
            </button>
          ))}
        </div>

        {tab === 'active' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {active.map((p, i, arr) => (
              <div key={p.id}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{ display: 'flex', gap: 20, padding: '20px 0', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <div style={{ width: 100, height: 80, flexShrink: 0, overflow: 'hidden', borderRadius: 2 }}>
                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.95rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.72rem', color: C.muted, marginTop: 2 }}>{p.category}</p>
                      </div>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.active, border: `1px solid ${C.active}44`, padding: '2px 8px', borderRadius: 2 }}>Activo</span>
                    </div>
                    <div style={{ display: 'flex', gap: 20, marginBottom: 10 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}><User style={{ width: 11, height: 11 }} /> {p.educator}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}><BookOpen style={{ width: 11, height: 11 }} /> {p.group}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}><Calendar style={{ width: 11, height: 11 }} /> {p.schedule}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: '0.68rem', color: C.subtle }}>Progreso</span>
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, color: C.primary }}>{p.progress}%</span>
                        </div>
                        <div style={{ height: 2, background: C.border }}>
                          <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 1, delay: 0.3 }}
                            style={{ height: '100%', background: C.primary }} />
                        </div>
                      </div>
                      <div style={{ padding: '5px 10px', background: C.tint, border: `1px solid ${C.active}22` }}>
                        <p style={{ fontSize: '0.62rem', color: C.muted, lineHeight: 1 }}>Próxima clase</p>
                        <p style={{ fontSize: '0.72rem', fontWeight: 600, color: C.primary, lineHeight: 1, marginTop: 2 }}>{p.next}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                    <Link to={`/estudiante/programa/${p.id}`}>
                      <button style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 2, whiteSpace: 'nowrap' }}>
                        Ver Detalles
                      </button>
                    </Link>
                    <Link to="/estudiante/progreso">
                      <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px', background: C.primary, color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: 'none', borderRadius: 2, whiteSpace: 'nowrap' }}>
                        <TrendingUp style={{ width: 12, height: 12 }} /> Progreso
                      </button>
                    </Link>
                  </div>
                </motion.div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            ))}
            <div style={{ paddingTop: 20, textAlign: 'center' }}>
              <Link to="/estudiante/programas">
                <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.8rem', cursor: 'pointer', borderRadius: 2 }}>
                  <BookOpen style={{ width: 13, height: 13 }} /> Explorar Más Programas
                </button>
              </Link>
            </div>
          </div>
        )}

        {tab === 'completed' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {completed.map((p, i, arr) => (
              <div key={p.id}>
                <div style={{ display: 'flex', gap: 20, padding: '20px 0' }}>
                  <div style={{ width: 100, height: 80, flexShrink: 0, overflow: 'hidden', borderRadius: 2 }}>
                    <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(30%)' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.95rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.72rem', color: C.muted, marginTop: 2 }}>{p.category}</p>
                      </div>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.subtle, border: `1px solid ${C.border}`, padding: '2px 8px', borderRadius: 2 }}>Completado</span>
                    </div>
                    <p style={{ fontSize: '0.72rem', color: C.subtle }}>Educador: {p.educator}</p>
                    <p style={{ fontSize: '0.72rem', color: C.subtle }}>Completado en: {p.completedDate}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                      <CheckCircle style={{ width: 12, height: 12, color: C.gold }} />
                      <p style={{ fontSize: '0.72rem', fontWeight: 600, color: C.gold }}>Aprobado</p>
                    </div>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
