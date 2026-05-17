import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Calendar, Users, Clock, MapPin, ArrowLeft, BookOpen, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../theme';
import { programsService, Program } from '../../services/programsService';
import { useAuth } from '../../context/AuthContext';

export const ProgramDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    programsService.getById(id).then(setProgram).catch(() => toast.error('No se pudo cargar el programa'));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    if (!user) return;
    programsService.getStudentId(user.id).then(sid => {
      setStudentId(sid);
      if (sid && id) {
        programsService.isEnrolled(id, sid).then(setEnrolled);
      }
    });
  }, [user, id]);

  const handleEnroll = async () => {
    if (!program || !studentId) {
      toast.error('No se pudo identificar tu perfil de estudiante');
      return;
    }
    if ((program.enrolled ?? 0) >= (program.capacity ?? 0)) {
      toast.error('Este programa no tiene cupos disponibles');
      return;
    }
    setEnrolling(true);
    try {
      await programsService.enroll(program.id, studentId);
      setEnrolled(true);
      setProgram(prev => prev ? { ...prev, enrolled: (prev.enrolled ?? 0) + 1 } : prev);
      toast.success(`Te inscribiste en ${program.name}`);
    } catch (err: any) {
      toast.error(err.message ?? 'Error al inscribirse');
    } finally {
      setEnrolling(false);
    }
  };

  const handleUnenroll = async () => {
    if (!program || !studentId) return;
    if (!window.confirm('¿Seguro que quieres cancelar tu inscripción?')) return;
    setEnrolling(true);
    try {
      await programsService.unenroll(program.id, studentId);
      setEnrolled(false);
      setProgram(prev => prev ? { ...prev, enrolled: Math.max(0, (prev.enrolled ?? 0) - 1) } : prev);
      toast.success('Inscripción cancelada');
    } catch (err: any) {
      toast.error(err.message ?? 'Error al cancelar');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading || !program) {
    return (
      <div style={{ minHeight: '100vh', background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 style={{ width: 28, height: 28, color: C.primary, animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const cuposLibres = (program.capacity ?? 0) - (program.enrolled ?? 0);
  const lleno = cuposLibres <= 0;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        {program.image
          ? <img src={program.image} alt={program.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <div style={{ width: '100%', height: '100%', background: C.dark }} />
        }
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(90deg, ${C.dark}ee 0%, ${C.dark}99 50%, transparent 100%)` }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <div style={{ position: 'absolute', inset: 0, padding: '28px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
          <Link to="/estudiante/programas" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: 12, textDecoration: 'none' }}>
            <ArrowLeft style={{ width: 12, height: 12 }} /> Volver al catálogo
          </Link>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>{program.category}</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.8rem', fontWeight: 700, color: '#fff' }}>{program.name}</h1>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>DESCRIPCIÓN</span>
            </div>
            <div style={{ padding: '20px' }}>
              <p style={{ fontSize: '0.82rem', color: C.muted, lineHeight: 1.7 }}>
                {program.description ?? 'Programa de formación artística del Centro Cultural Lucy Tejada.'}
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.primary, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>CONTENIDO DEL PROGRAMA</span>
            </div>
            <div>
              {['Fundamentos técnicos y bases teóricas', 'Práctica supervisada y ejercicios guiados', 'Proyectos individuales y grupales', 'Evaluación y retroalimentación continua', 'Presentación final y certificación'].map((item, i, arr) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderLeft: i === 0 ? `3px solid ${C.active}` : '3px solid transparent' }}>
                    <div style={{ width: 20, height: 20, flexShrink: 0, background: C.tint, border: `1px solid ${C.active}33`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 700, color: C.primary }}>{i + 1}</div>
                    <span style={{ fontSize: '0.8rem', color: C.text }}>{item}</span>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div style={{ width: 280, flexShrink: 0 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: C.surface, border: `1px solid ${C.border}`, marginBottom: 16 }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text, textTransform: 'uppercase' }}>Información</span>
            </div>
            {[
              { icon: Users,    label: 'Educador',  value: program.educator || 'Por asignar'    },
              { icon: BookOpen, label: 'Nivel',     value: program.level || 'Todos los niveles' },
              { icon: Clock,    label: 'Duración',  value: program.duration ? `${program.duration} meses` : 'Por confirmar' },
              { icon: MapPin,   label: 'Ubicación', value: 'Sede Principal'                      },
              { icon: Calendar, label: 'Horario',   value: program.schedule || 'Por confirmar'  },
            ].map((item, i, arr) => {
              const Icon = item.icon;
              return (
                <div key={item.label}>
                  <div style={{ display: 'flex', gap: 12, padding: '11px 18px', alignItems: 'center' }}>
                    <Icon style={{ width: 13, height: 13, color: C.subtle, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: '0.65rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text }}>{item.value}</p>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              );
            })}
            <div style={{ padding: '12px 18px', borderTop: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: C.muted }}>Cupos disponibles</span>
                <span style={{ fontWeight: 700, color: lleno ? C.active : C.primary }}>{lleno ? 'Sin cupos' : `${cuposLibres} de ${program.capacity}`}</span>
              </div>
            </div>
          </motion.div>

          {enrolled ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ padding: '11px 16px', background: C.tint, border: `1px solid ${C.active}44`, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 style={{ width: 16, height: 16, color: C.active }} />
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: C.active }}>Ya estás inscrito</span>
              </div>
              <button onClick={handleUnenroll} disabled={enrolling} style={{ width: '100%', padding: '9px 0', background: 'transparent', color: C.muted, fontSize: '0.78rem', border: `1px solid ${C.border}`, cursor: enrolling ? 'default' : 'pointer', borderRadius: 2 }}>
                {enrolling ? 'Procesando...' : 'Cancelar inscripción'}
              </button>
            </div>
          ) : (
            <button onClick={handleEnroll} disabled={enrolling || lleno} style={{
              width: '100%', padding: '11px 0', background: lleno ? C.muted : C.primary,
              color: '#fff', fontWeight: 600, fontSize: '0.85rem', border: 'none',
              cursor: enrolling || lleno ? 'default' : 'pointer', borderRadius: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {enrolling ? <><Loader2 style={{ width: 15, height: 15, animation: 'spin 1s linear infinite' }} /> Inscribiendo...</> : lleno ? 'Sin cupos disponibles' : 'Inscribirse al Programa'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
