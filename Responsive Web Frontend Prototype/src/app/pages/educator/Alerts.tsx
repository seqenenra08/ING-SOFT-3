import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertTriangle, Info, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { C } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { educatorsService } from '../../services/educatorsService';
import { programsService, Program } from '../../services/programsService';

interface Alert {
  id: string;
  title: string;
  type: 'high' | 'medium' | 'info' | 'success';
  status: 'pending' | 'done';
  group: string;
  date: string;
}

const typeConfig: Record<string, { icon: typeof AlertTriangle; color: string; label: string }> = {
  high:    { icon: AlertTriangle, color: C.active,  label: 'Alta prioridad'  },
  medium:  { icon: Clock,         color: C.gold,    label: 'Media prioridad' },
  info:    { icon: Info,          color: C.primary, label: 'Informativo'     },
  success: { icon: CheckCircle,   color: '#4b7a30', label: 'Completado'      },
};

function programsToAlerts(programs: Program[]): Alert[] {
  const alerts: Alert[] = [];

  programs.forEach(p => {
    const pct = p.capacity ? p.enrolled / p.capacity : 0;

    if ((p.enrolled ?? 0) === 0) {
      alerts.push({
        id: `empty-${p.id}`,
        title: `Sin inscripciones — ${p.name}`,
        type: 'high',
        status: 'pending',
        group: p.name,
        date: 'Ahora',
      });
    } else if (pct >= 0.9) {
      alerts.push({
        id: `full-${p.id}`,
        title: `Cupo casi agotado — ${p.name}`,
        type: 'medium',
        status: 'pending',
        group: p.name,
        date: 'Ahora',
      });
    } else {
      alerts.push({
        id: `ok-${p.id}`,
        title: `${p.name} — ${p.enrolled} estudiante(s) inscritos`,
        type: 'success',
        status: 'done',
        group: p.name,
        date: 'Activo',
      });
    }

    if (!p.schedule) {
      alerts.push({
        id: `sched-${p.id}`,
        title: `Sin horario asignado — ${p.name}`,
        type: 'info',
        status: 'pending',
        group: p.name,
        date: 'Pendiente',
      });
    }
  });

  return alerts;
}

export const Alerts = () => {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    educatorsService.getEducatorId(user.id).then(eid => {
      if (!eid) { setLoading(false); return; }
      programsService.getByEducatorId(eid).then(progs => {
        setAlerts(programsToAlerts(progs));
      }).finally(() => setLoading(false));
    });
  }, [user]);

  const pending = alerts.filter(a => a.status === 'pending');
  const done    = alerts.filter(a => a.status === 'done');

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Educador</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Alertas y Tareas</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            {loading ? 'Cargando...' : `${pending.length} tarea(s) pendiente(s)`}
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        {loading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: C.muted, fontSize: '0.82rem' }}>Cargando alertas...</div>
        ) : alerts.length === 0 ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <BookOpen style={{ width: 36, height: 36, color: C.border, margin: '0 auto 12px' }} />
            <p style={{ color: C.muted, fontSize: '0.82rem' }}>No tienes programas asignados aún.</p>
          </div>
        ) : (
          [{ key: 'pending' as const, list: pending }, { key: 'done' as const, list: done }].map(({ key, list }) => {
            if (list.length === 0) return null;
            return (
              <motion.div key={key}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: key === 'pending' ? 0.15 : 0.3 }}
                style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 3, height: 16, background: key === 'pending' ? C.active : C.border, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>
                    {key === 'pending' ? 'PENDIENTES' : 'COMPLETADAS'}
                  </span>
                  <span style={{ marginLeft: 'auto', fontSize: '0.72rem', color: C.subtle }}>{list.length}</span>
                </div>
                {list.map((a, i, arr) => {
                  const Cfg = typeConfig[a.type];
                  const Icon = Cfg.icon;
                  return (
                    <div key={a.id}>
                      <div style={{
                        display: 'flex', gap: 14, padding: '14px 20px',
                        borderLeft: key === 'pending' ? `3px solid ${Cfg.color}` : '3px solid transparent',
                        opacity: key === 'done' ? 0.6 : 1,
                      }}>
                        <div style={{ width: 30, height: 30, flexShrink: 0, background: `${Cfg.color}14`, border: `1px solid ${Cfg.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                          <Icon style={{ width: 13, height: 13, color: Cfg.color }} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{a.title}</p>
                          <div style={{ display: 'flex', gap: 12, marginTop: 3 }}>
                            <span style={{ fontSize: '0.68rem', color: C.subtle }}>{a.group}</span>
                            <span style={{ fontSize: '0.68rem', color: C.subtle }}>{a.date}</span>
                            <span style={{ fontSize: '0.68rem', color: Cfg.color, fontWeight: 600 }}>{Cfg.label}</span>
                          </div>
                        </div>
                      </div>
                      {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                    </div>
                  );
                })}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};
