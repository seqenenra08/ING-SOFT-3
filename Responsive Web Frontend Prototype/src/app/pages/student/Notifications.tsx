import { motion } from 'motion/react';
import { Bell, Info, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { C } from '../../theme';

const notifications = [
  { id: 1, title: 'Nueva evaluación disponible',        body: 'Se ha publicado una nueva evaluación para el programa Ballet Clásico.',    time: 'Hace 2 horas',  type: 'info',    read: false },
  { id: 2, title: 'Recordatorio: Clase mañana',         body: 'Tienes clase de Pintura al Óleo mañana a las 2:00 PM en el Taller 2.',     time: 'Hace 5 horas',  type: 'warning', read: false },
  { id: 3, title: 'Calificaciones publicadas',          body: 'Se han publicado las calificaciones del período anterior en Ballet.',       time: 'Ayer',          type: 'success', read: true  },
  { id: 4, title: 'Horario actualizado',                body: 'El horario de Ballet Clásico ha cambiado para la próxima semana.',          time: 'Hace 3 días',   type: 'info',    read: true  },
  { id: 5, title: 'Pago de matrícula pendiente',        body: 'Recuerda que tienes un pago pendiente para el siguiente período.',         time: 'Hace 1 semana', type: 'warning', read: true  },
];

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  info:    { icon: Info,          color: C.primary },
  warning: { icon: AlertTriangle, color: C.gold    },
  success: { icon: CheckCircle,   color: '#4b7a30' },
};

export const Notifications = () => (
  <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
    <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Estudiante</p>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Notificaciones</h1>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
          {notifications.filter(n => !n.read).length} sin leer
        </p>
      </motion.div>
    </div>

    <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 40px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>TODAS LAS NOTIFICACIONES</span>
          </div>
          <span style={{ fontSize: '0.7rem', color: C.active, cursor: 'pointer', fontWeight: 600 }}>Marcar todas como leídas</span>
        </div>

        {notifications.map((n, i, arr) => {
          const Cfg = typeConfig[n.type] ?? typeConfig.info;
          const Icon = Cfg.icon;
          return (
            <div key={n.id}>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                style={{
                  display: 'flex', gap: 14, padding: '16px 20px',
                  borderLeft: !n.read ? `3px solid ${Cfg.color}` : '3px solid transparent',
                  background: !n.read ? C.tint : 'transparent',
                  transition: 'background 0.15s',
                }}>
                <div style={{ width: 32, height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${Cfg.color}14`, border: `1px solid ${Cfg.color}33`, borderRadius: 2 }}>
                  <Icon style={{ width: 14, height: 14, color: Cfg.color }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.85rem', marginBottom: 3 }}>{n.title}</p>
                  <p style={{ fontSize: '0.75rem', color: C.muted, lineHeight: 1.5 }}>{n.body}</p>
                  <p style={{ fontSize: '0.68rem', color: C.subtle, marginTop: 4 }}>{n.time}</p>
                </div>
                {!n.read && (
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: Cfg.color, flexShrink: 0, marginTop: 4 }} />
                )}
              </motion.div>
              {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
            </div>
          );
        })}
      </motion.div>
    </div>
  </div>
);
