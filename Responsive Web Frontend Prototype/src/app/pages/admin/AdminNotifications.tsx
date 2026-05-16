import { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../theme';
import { notificationsData } from '../../data/mockData';

type NotiType = 'all' | 'success' | 'info' | 'warning' | 'error';

const typeConfig: Record<string, { icon: any; color: string; bg: string; label: string }> = {
  success: { icon: CheckCircle,   color: '#22c55e', bg: '#22c55e18', label: 'Éxito'      },
  info:    { icon: Info,          color: C.primary, bg: C.tint,      label: 'Información' },
  warning: { icon: AlertTriangle, color: C.gold,    bg: '#fef9c318', label: 'Advertencia' },
  error:   { icon: XCircle,       color: C.active,  bg: `${C.active}15`, label: 'Error' },
};

export const AdminNotifications = () => {
  const [filter, setFilter] = useState<NotiType>('all');
  const [notifications, setNotifications] = useState<any[]>(
    [
      ...notificationsData,
      { id: '4', type: 'warning', title: 'Cupo por agotarse', message: 'Ballet Clásico tiene 2 cupos restantes de 15.', date: '2026-04-12 09:15', read: false },
      { id: '5', type: 'info',    title: 'Nuevo educador registrado', message: 'Se ha agregado a Patricia Moreno al sistema.', date: '2026-04-11 14:00', read: true },
      { id: '6', type: 'success', title: 'Reporte generado', message: 'El reporte mensual de asistencia fue generado.', date: '2026-04-10 11:30', read: true },
    ]
  );

  const filtered = notifications.filter(n => filter === 'all' || n.type === filter);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success('Todas las notificaciones marcadas como leídas');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success('Notificación eliminada');
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filters: { key: NotiType; label: string }[] = [
    { key: 'all',     label: 'Todas' },
    { key: 'info',    label: 'Información' },
    { key: 'success', label: 'Éxito' },
    { key: 'warning', label: 'Advertencia' },
    { key: 'error',   label: 'Error' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Administración</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Notificaciones</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
              {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo leído'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: 'transparent', border: `1px solid rgba(255,255,255,0.2)`, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', cursor: 'pointer', borderRadius: 2 }}>
              <CheckCheck style={{ width: 14, height: 14 }} /> Marcar todas como leídas
            </button>
          )}
        </motion.div>
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, padding: '0 40px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 0 }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              style={{ padding: '12px 20px', background: 'transparent', border: 'none', borderBottom: filter === f.key ? `2px solid ${C.primary}` : '2px solid transparent', color: filter === f.key ? C.primary : C.muted, fontWeight: filter === f.key ? 600 : 400, fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s', outline: 'none' }}>
              {f.label}
              {f.key !== 'all' && (
                <span style={{ marginLeft: 6, fontSize: '0.65rem', background: filter === f.key ? `${C.primary}18` : C.tint, color: filter === f.key ? C.primary : C.subtle, padding: '1px 6px', borderRadius: 10 }}>
                  {notifications.filter(n => n.type === f.key).length}
                </span>
              )}
              {f.key === 'all' && (
                <span style={{ marginLeft: 6, fontSize: '0.65rem', background: filter === f.key ? `${C.primary}18` : C.tint, color: filter === f.key ? C.primary : C.subtle, padding: '1px 6px', borderRadius: 10 }}>
                  {notifications.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: C.subtle }}>
            <Bell style={{ width: 32, height: 32, margin: '0 auto 12px', opacity: 0.3 }} />
            <p style={{ fontSize: '0.9rem' }}>No hay notificaciones de este tipo</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map((n, i) => {
            const cfg = typeConfig[n.type] ?? typeConfig.info;
            const Icon = cfg.icon;
            return (
              <motion.div key={n.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.04 }}
                onClick={() => markRead(n.id)}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '14px 18px', background: n.read ? '#fff' : `${cfg.bg}`, border: `1px solid ${n.read ? C.border : cfg.color + '33'}`, cursor: n.read ? 'default' : 'pointer', transition: 'background 0.2s' }}>
                {!n.read && (
                  <div style={{ position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: cfg.color, marginTop: 2 }} />
                )}
                <div style={{ width: 34, height: 34, borderRadius: 2, background: cfg.bg, border: `1px solid ${cfg.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  <Icon style={{ width: 15, height: 15, color: cfg.color }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: n.read ? 600 : 700, color: C.text, fontSize: '0.84rem' }}>{n.title}</p>
                    {!n.read && <span style={{ padding: '1px 7px', background: cfg.color, color: '#fff', fontSize: '0.6rem', fontWeight: 700, borderRadius: 10 }}>NUEVA</span>}
                  </div>
                  <p style={{ fontSize: '0.77rem', color: C.muted, marginBottom: 4 }}>{n.message}</p>
                  <p style={{ fontSize: '0.68rem', color: C.subtle }}>{n.date}</p>
                </div>
                <button onClick={ev => { ev.stopPropagation(); deleteNotification(n.id); }}
                  style={{ background: 'transparent', border: 'none', color: C.subtle, cursor: 'pointer', padding: 4, borderRadius: 2, display: 'flex', alignItems: 'center' }}
                  title="Eliminar notificación">
                  <Trash2 style={{ width: 14, height: 14 }} />
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
