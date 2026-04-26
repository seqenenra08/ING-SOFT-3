import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, Calendar, ClipboardCheck, AlertCircle, TrendingUp, ArrowRight, MapPin, Clock } from 'lucide-react';
import { C } from '../../theme';

const todaySessions = [
  { time: '4:00 PM - 6:00 PM', program: 'Ballet Clásico', group: 'Grupo A', students: 12, location: 'Sala Principal' },
];

const pendingTasks = [
  { task: 'Registrar asistencia - Ballet Clásico (15 Abr)', priority: 'high' },
  { task: 'Completar evaluación - Camila Rodríguez', priority: 'medium' },
];

const kpis = [
  { label: 'Mis Grupos',        value: '4',   color: C.primary },
  { label: 'Total Estudiantes', value: '42',  color: C.gold    },
  { label: 'Clases Hoy',        value: '1',   color: C.active  },
  { label: 'Asistencia Prom.',  value: '91%', color: '#6b4040' },
];

const groups = [
  { name: 'Ballet Clásico - Grupo A',   students: 12, attendance: 94, id: 1 },
  { name: 'Danza Folklórica - Grupo A', students: 18, attendance: 89, id: 2 },
];

export const EducatorDashboard = () => (
  <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>

    {/* Hero */}
    <div style={{ background: C.dark, padding: '32px 40px', borderBottom: `1px solid #2a1212`, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
      <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
        style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 8 }}>
          Panel del Educador
        </p>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>
          Bienvenido, Carlos Martínez
        </h1>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>
          {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </motion.div>
    </div>

    {/* KPI strip */}
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
      style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
      {kpis.map((k, i) => (
        <div key={k.label} style={{
          flex: 1, padding: '16px 20px',
          borderRight: i < kpis.length - 1 ? `1px solid ${C.border}` : 'none',
        }}>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{k.value}</p>
          <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 3 }}>{k.label}</p>
          <div style={{ height: 2, background: k.color, marginTop: 8, width: 24, borderRadius: 1 }} />
        </div>
      ))}
    </motion.div>

    {/* Body */}
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>

      {/* Main */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Today sessions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text, letterSpacing: '0.01em' }}>CLASES DE HOY</span>
            </div>
            <Link to="/educador/horario">
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: C.active, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Ver horario <ArrowRight style={{ width: 11, height: 11 }} />
              </span>
            </Link>
          </div>
          {todaySessions.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderLeft: `3px solid ${C.active}` }}>
              <div style={{ width: 40, height: 40, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, flexShrink: 0 }}>
                <Calendar style={{ width: 17, height: 17, color: '#fff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{s.program}</p>
                <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}>
                    <Users style={{ width: 11, height: 11 }} /> {s.group} · {s.students} estudiantes
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}>
                    <Clock style={{ width: 11, height: 11 }} /> {s.time}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.72rem', color: C.subtle }}>
                    <MapPin style={{ width: 11, height: 11 }} /> {s.location}
                  </span>
                </div>
              </div>
              <Link to={`/educador/asistencia/${i}`}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '7px 14px', background: C.primary, color: '#fff',
                  fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2,
                }}>
                  <ClipboardCheck style={{ width: 13, height: 13 }} /> Asistencia
                </button>
              </Link>
            </div>
          ))}
        </motion.div>

        {/* Groups */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.primary, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>MIS GRUPOS</span>
            </div>
            <Link to="/educador/grupos">
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: C.active, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                Ver todos <ArrowRight style={{ width: 11, height: 11 }} />
              </span>
            </Link>
          </div>
          {groups.map((g, i, arr) => (
            <div key={g.id}>
              <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{g.name}</p>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.active, border: `1px solid ${C.active}44`, padding: '2px 8px', borderRadius: 2 }}>Activo</span>
                  </div>
                  <p style={{ fontSize: '0.72rem', color: C.muted, marginBottom: 8 }}>{g.students} estudiantes</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                    <span style={{ fontSize: '0.68rem', color: C.subtle }}>Asistencia promedio</span>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: C.primary }}>{g.attendance}%</span>
                  </div>
                  <div style={{ height: 2, background: C.border }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${g.attendance}%` }}
                      transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                      style={{ height: '100%', background: C.primary }} />
                  </div>
                </div>
                <Link to={`/educador/grupo/${g.id}`}>
                  <button style={{ padding: '6px 14px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 2 }}>
                    Ver Grupo
                  </button>
                </Link>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Sidebar */}
      <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Pending tasks */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text, textTransform: 'uppercase' }}>Tareas Pendientes</span>
            </div>
            <Link to="/educador/alertas">
              <span style={{ fontSize: '0.68rem', fontWeight: 600, color: C.active, cursor: 'pointer' }}>Ver todas</span>
            </Link>
          </div>
          {pendingTasks.map((t, i, arr) => (
            <div key={i}>
              <div style={{ display: 'flex', gap: 10, padding: '11px 16px', borderLeft: `3px solid ${t.priority === 'high' ? C.active : C.gold}` }}>
                <AlertCircle style={{ width: 13, height: 13, flexShrink: 0, marginTop: 1, color: t.priority === 'high' ? C.active : C.gold }} />
                <p style={{ fontSize: '0.75rem', color: C.text, lineHeight: 1.4 }}>{t.task}</p>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
            </div>
          ))}
        </motion.div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.42 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderBottom: `1px solid ${C.border}` }}>
            <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text, textTransform: 'uppercase' }}>Acciones</span>
          </div>
          {[
            { to: '/educador/grupos',  icon: Users,       label: 'Ver Mis Grupos' },
            { to: '/educador/horario', icon: Calendar,    label: 'Ver Horario'    },
            { to: '/educador/alertas', icon: AlertCircle, label: 'Ver Alertas'    },
          ].map((a, i, arr) => {
            const Icon = a.icon;
            return (
              <div key={a.to}>
                <Link to={a.to}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                    <Icon style={{ width: 13, height: 13, color: C.muted, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.78rem', color: C.text, flex: 1 }}>{a.label}</span>
                    <ArrowRight style={{ width: 11, height: 11, color: C.border }} />
                  </div>
                </Link>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  </div>
);
