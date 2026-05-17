import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, Calendar, User, ArrowRight, CheckCircle } from 'lucide-react';
import { C } from '../../theme';
import { programsService, Program } from '../../services/programsService';
import { useAuth } from '../../context/AuthContext';

export const MyPrograms = () => {
  const { user } = useAuth();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    programsService.getStudentId(user.id).then(sid => {
      if (!sid) { setLoading(false); return; }
      programsService.getMyEnrollments(sid).then(setPrograms).finally(() => setLoading(false));
    });
  }, [user]);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Estudiante</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mis Programas</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Gestiona tus inscripciones</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        {loading ? (
          <p style={{ fontSize: '0.82rem', color: C.muted }}>Cargando tus programas...</p>
        ) : programs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <BookOpen style={{ width: 40, height: 40, color: C.border, margin: '0 auto 16px' }} />
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1rem', color: C.text, marginBottom: 8 }}>Aún no tienes inscripciones</p>
            <p style={{ fontSize: '0.82rem', color: C.muted, marginBottom: 24 }}>Explora el catálogo y encuentra un programa que te interese.</p>
            <Link to="/estudiante/programas">
              <button style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                Explorar programas <ArrowRight style={{ width: 13, height: 13 }} />
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: '0.75rem', color: C.subtle, marginBottom: 16 }}>{programs.length} programa(s) activo(s)</p>
            {programs.map((p, i, arr) => (
              <div key={p.id}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: i * 0.1 }}
                  style={{ display: 'flex', gap: 20, padding: '20px 0', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                >
                  <div style={{ width: 100, height: 80, flexShrink: 0, overflow: 'hidden', borderRadius: 2, background: C.tint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {p.image
                      ? <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <BookOpen style={{ width: 24, height: 24, color: C.primary }} />
                    }
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.95rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.72rem', color: C.muted, marginTop: 2 }}>{p.category}</p>
                      </div>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.active, border: `1px solid ${C.active}44`, padding: '2px 8px', borderRadius: 2 }}>
                        <CheckCircle style={{ width: 10, height: 10, display: 'inline', marginRight: 4 }} />Inscrito
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                      {p.educator && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}><User style={{ width: 11, height: 11 }} /> {p.educator}</span>}
                      {p.schedule && <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}><Calendar style={{ width: 11, height: 11 }} /> {p.schedule}</span>}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Link to={`/estudiante/programa/${p.id}`}>
                      <button style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 2 }}>
                        Ver detalles <ArrowRight style={{ width: 12, height: 12 }} />
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
                  <BookOpen style={{ width: 13, height: 13 }} /> Explorar más programas
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
