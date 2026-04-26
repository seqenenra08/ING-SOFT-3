import { motion } from 'motion/react';
import { AlertTriangle, Info, CheckCircle, Clock } from 'lucide-react';
import { C } from '../../theme';

const alerts = [
  { id: 1, title: 'Registrar asistencia - Ballet Clásico (15 Abr)', type: 'high',   status: 'pending', group: 'Grupo A',  date: 'Hoy' },
  { id: 2, title: 'Completar evaluación - Camila Rodríguez',        type: 'medium', status: 'pending', group: 'Grupo A',  date: 'Mañana' },
  { id: 3, title: 'Entrega de notas - Período 1',                   type: 'high',   status: 'pending', group: 'Todos',    date: '20 Abr' },
  { id: 4, title: 'Reunión de educadores',                          type: 'info',   status: 'pending', group: 'Docentes', date: '22 Abr' },
  { id: 5, title: 'Asistencia registrada - 10 Abr',                 type: 'success',status: 'done',    group: 'Grupo A',  date: '10 Abr' },
  { id: 6, title: 'Evaluación enviada - Valentina Torres',          type: 'success',status: 'done',    group: 'Grupo A',  date: '08 Abr' },
];

const typeConfig: Record<string, { icon: typeof AlertTriangle; color: string; label: string }> = {
  high:    { icon: AlertTriangle, color: C.active,  label: 'Alta prioridad' },
  medium:  { icon: Clock,         color: C.gold,    label: 'Media prioridad' },
  info:    { icon: Info,          color: C.primary, label: 'Informativo' },
  success: { icon: CheckCircle,   color: '#4b7a30', label: 'Completado' },
};

export const Alerts = () => (
  <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
    <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Educador</p>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Alertas y Tareas</h1>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
          {alerts.filter(a => a.status === 'pending').length} tareas pendientes
        </p>
      </motion.div>
    </div>

    <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {['pending', 'done'].map(status => {
        const list = alerts.filter(a => a.status === status);
        return (
          <motion.div key={status}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: status === 'pending' ? 0.15 : 0.3 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: status === 'pending' ? C.active : C.border, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>
                {status === 'pending' ? 'PENDIENTES' : 'COMPLETADAS'}
              </span>
            </div>
            {list.map((a, i, arr) => {
              const Cfg = typeConfig[a.type];
              const Icon = Cfg.icon;
              return (
                <div key={a.id}>
                  <div style={{
                    display: 'flex', gap: 14, padding: '14px 20px',
                    borderLeft: status === 'pending' ? `3px solid ${Cfg.color}` : '3px solid transparent',
                    opacity: status === 'done' ? 0.6 : 1,
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
      })}
    </div>
  </div>
);
