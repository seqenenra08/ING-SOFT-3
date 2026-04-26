import { motion } from 'motion/react';
import { TrendingUp, Calendar, CheckCircle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { C } from '../../theme';

const attendanceData = [
  { week: 'S1', ballet: 100, pintura: 100 },
  { week: 'S2', ballet: 100, pintura: 100 },
  { week: 'S3', ballet: 100, pintura:  50 },
  { week: 'S4', ballet: 100, pintura: 100 },
  { week: 'S5', ballet:  50, pintura: 100 },
  { week: 'S6', ballet: 100, pintura: 100 },
];

const progressData = [
  { month: 'Ene', progress: 10 },
  { month: 'Feb', progress: 25 },
  { month: 'Mar', progress: 42 },
  { month: 'Abr', progress: 65 },
];

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: C.dark, border: `1px solid #2a1212`, padding: '8px 12px', fontSize: '0.72rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: '#fff' }}>{p.dataKey}: {p.value}%</p>
        ))}
      </div>
    );
  }
  return null;
};

const kpis = [
  { label: 'Asistencia Global', value: '94%', icon: CheckCircle, color: C.primary },
  { label: 'Horas Completadas', value: '48h', icon: Clock,        color: C.gold    },
  { label: 'Evaluaciones',      value: '3/4', icon: TrendingUp,   color: C.active  },
  { label: 'Semanas Activas',   value: '6',   icon: Calendar,     color: '#6b4040' },
];

export const AcademicProgress = () => (
  <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
    <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
        style={{ maxWidth: 1280, margin: '0 auto' }}>
        <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Estudiante</p>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mi Progreso Académico</h1>
        <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Seguimiento de asistencia, avance y evaluaciones</p>
      </motion.div>
    </div>

    {/* KPI strip */}
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
      style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
      {kpis.map((k, i) => {
        const Icon = k.icon;
        return (
          <div key={k.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', borderRight: i < kpis.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div style={{ width: 32, height: 32, border: `1.5px solid ${k.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <Icon style={{ width: 14, height: 14, color: k.color }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{k.value}</p>
              <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 2 }}>{k.label}</p>
            </div>
          </div>
        );
      })}
    </motion.div>

    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', gap: 20 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Progress over time */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>AVANCE POR PROGRAMA</span>
          </div>
          <div style={{ padding: 20 }}>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={progressData}>
                <defs>
                  <linearGradient id="prog" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.primary} stopOpacity={0.12} />
                    <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="month" stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="progress" stroke={C.primary} strokeWidth={2}
                  fill="url(#prog)" dot={{ r: 3, fill: C.primary, stroke: '#fff', strokeWidth: 2 }} name="Progreso %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Attendance chart */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>ASISTENCIA SEMANAL</span>
          </div>
          <div style={{ padding: 20 }}>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                <XAxis dataKey="week" stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="ballet" stroke={C.primary} strokeWidth={2} dot={{ r: 3, fill: C.primary }} name="Ballet" />
                <Line type="monotone" dataKey="pintura" stroke={C.gold} strokeWidth={2} dot={{ r: 3, fill: C.gold }} name="Pintura" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Sidebar - evaluations */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text, textTransform: 'uppercase' }}>Evaluaciones</span>
          </div>
          {[
            { name: 'Técnica Básica – Ballet',    grade: '4.5 / 5.0', date: 'Mar 2026', status: 'passed' },
            { name: 'Expresión Corporal',          grade: '4.2 / 5.0', date: 'Feb 2026', status: 'passed' },
            { name: 'Composición – Pintura',       grade: '3.8 / 5.0', date: 'Ene 2026', status: 'passed' },
            { name: 'Evaluación final – Ballet',   grade: 'Pendiente', date: 'Abr 2026', status: 'pending' },
          ].map((ev, i, arr) => (
            <div key={ev.name}>
              <div style={{ padding: '12px 18px' }}>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text, marginBottom: 3 }}>{ev.name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.72rem', color: ev.status === 'passed' ? C.gold : C.subtle, fontWeight: 600 }}>{ev.grade}</span>
                  <span style={{ fontSize: '0.68rem', color: C.subtle }}>{ev.date}</span>
                </div>
              </div>
              {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </div>
);
