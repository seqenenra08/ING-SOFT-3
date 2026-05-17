import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Bell, CheckCircle, BookOpen, Calendar } from 'lucide-react';
import { C } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { programsService, Program } from '../../services/programsService';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'success' | 'info' | 'warning';
  read: boolean;
}

const typeConfig = {
  success: { icon: CheckCircle, color: '#4b7a30' },
  info:    { icon: BookOpen,    color: C.primary  },
  warning: { icon: Calendar,   color: C.gold     },
};

function programsToNotifications(programs: Program[]): Notification[] {
  const notifs: Notification[] = [];
  programs.forEach((p, i) => {
    notifs.push({
      id: `enroll-${p.id}`,
      title: `Inscrito en ${p.name}`,
      body: `Estás activamente inscrito en este programa de ${p.category}.${p.educator ? ` Educador: ${p.educator}.` : ''}`,
      type: 'success',
      read: i > 0,
    });
    if (p.schedule) {
      notifs.push({
        id: `sched-${p.id}`,
        title: `Horario: ${p.name}`,
        body: `Tus clases de ${p.name} son: ${p.schedule}.`,
        type: 'info',
        read: true,
      });
    }
    const libre = (p.capacity ?? 0) - (p.enrolled ?? 0);
    if (libre <= 3 && libre >= 0) {
      notifs.push({
        id: `cap-${p.id}`,
        title: `¡Programa casi lleno!`,
        body: `${p.name} solo tiene ${libre} cupo(s) restante(s). Comparte con tus amigos.`,
        type: 'warning',
        read: true,
      });
    }
  });
  return notifs;
}

export const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    programsService.getStudentId(user.id).then(sid => {
      if (!sid) { setLoading(false); return; }
      programsService.getMyEnrollments(sid).then(progs => {
        setNotifications(programsToNotifications(progs));
      }).finally(() => setLoading(false));
    });
  }, [user]);

  const [read, setRead] = useState<Set<string>>(new Set());
  const markAllRead = () => setRead(new Set(notifications.map(n => n.id)));
  const isRead = (n: Notification) => n.read || read.has(n.id);
  const unread = notifications.filter(n => !isRead(n)).length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Estudiante</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Notificaciones</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            {loading ? 'Cargando...' : unread > 0 ? `${unread} sin leer` : 'Todo leído'}
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
            {unread > 0 && (
              <span onClick={markAllRead} style={{ fontSize: '0.7rem', color: C.active, cursor: 'pointer', fontWeight: 600 }}>
                Marcar todas como leídas
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ padding: '32px 20px', textAlign: 'center', color: C.muted, fontSize: '0.82rem' }}>Cargando notificaciones...</div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '40px 20px', textAlign: 'center' }}>
              <Bell style={{ width: 32, height: 32, color: C.border, margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ color: C.muted, fontSize: '0.82rem' }}>No tienes notificaciones aún.</p>
              <p style={{ color: C.subtle, fontSize: '0.75rem', marginTop: 4 }}>Inscríbete a un programa para recibir notificaciones.</p>
            </div>
          ) : notifications.map((n, i, arr) => {
            const Cfg = typeConfig[n.type];
            const Icon = Cfg.icon;
            const read = isRead(n);
            return (
              <div key={n.id}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.2 + i * 0.05 }}
                  onClick={() => setRead(prev => new Set([...prev, n.id]))}
                  style={{
                    display: 'flex', gap: 14, padding: '16px 20px',
                    borderLeft: !read ? `3px solid ${Cfg.color}` : '3px solid transparent',
                    background: !read ? C.tint : 'transparent',
                    cursor: !read ? 'pointer' : 'default',
                    transition: 'background 0.15s',
                  }}>
                  <div style={{ width: 32, height: 32, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${Cfg.color}14`, border: `1px solid ${Cfg.color}33`, borderRadius: 2 }}>
                    <Icon style={{ width: 14, height: 14, color: Cfg.color }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: read ? 600 : 700, color: C.text, fontSize: '0.85rem', marginBottom: 3 }}>{n.title}</p>
                    <p style={{ fontSize: '0.75rem', color: C.muted, lineHeight: 1.5 }}>{n.body}</p>
                  </div>
                  {!read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: Cfg.color, flexShrink: 0, marginTop: 4 }} />}
                </motion.div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
