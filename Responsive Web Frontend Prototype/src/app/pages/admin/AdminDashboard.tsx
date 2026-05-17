import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Users, BookOpen, TrendingUp, UserCog, Download, ArrowRight } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { C, accentBar } from '../../theme';
import { studentsService } from '../../services/studentsService';
import { educatorsService } from '../../services/educatorsService';
import { programsService } from '../../services/programsService';

const monthlyEnrollment = [
  { month: 'Ene', students: 42 },
  { month: 'Feb', students: 55 },
  { month: 'Mar', students: 48 },
  { month: 'Abr', students: 63 },
  { month: 'May', students: 71 },
  { month: 'Jun', students: 58 },
  { month: 'Jul', students: 67 },
  { month: 'Ago', students: 74 },
  { month: 'Sep', students: 82 },
  { month: 'Oct', students: 79 },
  { month: 'Nov', students: 88 },
  { month: 'Dic', students: 91 },
];

const attendanceTrend = [
  { week: 'S1', rate: 88 },
  { week: 'S2', rate: 91 },
  { week: 'S3', rate: 87 },
  { week: 'S4', rate: 93 },
  { week: 'S5', rate: 90 },
  { week: 'S6', rate: 95 },
  { week: 'S7', rate: 92 },
  { week: 'S8', rate: 96 },
];

const categoryColors: Record<string, string> = {
  'Danza': '#8b1a1a',
  'Música': '#a16207',
  'Teatro': '#4b7a30',
  'Artes Visuales': '#6b4040',
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: C.dark, border: `1px solid ${C.darkBorder}`, padding: '8px 14px', fontSize: '0.75rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: '#fff' }}>{p.name ?? p.dataKey}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

const SectionBlock = ({ title, children, delay = 0 }: { title: string; children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    style={{ background: C.surface, border: `1px solid ${C.border}` }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
      <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text, letterSpacing: '0.02em' }}>
        {title}
      </span>
    </div>
    <div style={{ padding: '20px' }}>{children}</div>
  </motion.div>
);

export const AdminDashboard = () => {
  const [counts, setCounts] = useState({ students: 0, educators: 0, programs: 0, enrollments: 0 });
  const [enrollmentByCategory, setEnrollmentByCategory] = useState<{ name: string; value: number; color: string }[]>([]);

  useEffect(() => {
    Promise.all([
      studentsService.getAll(),
      educatorsService.getAll(),
      programsService.getAll(),
    ]).then(([students, educators, programs]) => {
      const enrollments = programs.reduce((a: number, p: any) => a + (p.enrolled || 0), 0);
      setCounts({
        students: students.length,
        educators: educators.length,
        programs: programs.length,
        enrollments,
      });

      const byCategory = programs.reduce((acc: Record<string, number>, p: any) => {
        acc[p.category] = (acc[p.category] || 0) + (p.enrolled || 0);
        return acc;
      }, {});

      setEnrollmentByCategory(
        Object.entries(byCategory).map(([name, value]) => ({
          name,
          value: value as number,
          color: categoryColors[name] ?? '#8b1a1a',
        }))
      );
    });
  }, []);

  const kpis = [
    { label: 'Estudiantes',      value: counts.students,    sub: 'registrados',    icon: Users,      color: C.primary  },
    { label: 'Programas Activos',value: counts.programs,    sub: 'disponibles',    icon: BookOpen,   color: C.gold     },
    { label: 'Educadores',       value: counts.educators,   sub: 'Personal activo',icon: UserCog,    color: C.active   },
    { label: 'Inscripciones',    value: counts.enrollments, sub: 'activas',        icon: TrendingUp, color: '#6b4040'  },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* Hero banner */}
      <div style={{ background: C.dark, padding: '32px 40px', borderBottom: `1px solid ${C.darkBorder}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: 1280, margin: '0 auto' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 8 }}>
              Administración
            </p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.3rem,2.5vw,1.8rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 4 }}>
              Dashboard Administrativo
            </h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)' }}>Centro Cultural Lucy Tejada</p>
          </div>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '9px 20px', background: C.primary, color: '#fff',
            fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2,
          }}>
            <Download style={{ width: 14, height: 14 }} /> Exportar Reporte
          </button>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={k.label} style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 20px',
              borderRight: i < kpis.length - 1 ? `1px solid ${C.border}` : 'none',
            }}>
              <div style={{ width: 32, height: 32, flexShrink: 0, border: `1.5px solid ${k.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                <Icon style={{ width: 14, height: 14, color: k.color }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{k.value}</p>
                <p style={{ fontSize: '0.65rem', color: C.muted, marginTop: 2 }}>{k.label}</p>
                <p style={{ fontSize: '0.62rem', color: k.color, marginTop: 1 }}>{k.sub}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Body */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 32px', display: 'flex', gap: 20, flexDirection: 'column' }}>

        {/* Charts row */}
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <SectionBlock title="INSCRIPCIONES POR CATEGORÍA" delay={0.25}>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={enrollmentByCategory} cx="50%" cy="50%" outerRadius={90} dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                    {enrollmentByCategory.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </SectionBlock>
          </div>
          <div style={{ flex: 1 }}>
            <SectionBlock title="INSCRIPCIONES MENSUALES" delay={0.3}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={monthlyEnrollment}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="month" stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: `${C.primary}08` }} />
                  <Bar dataKey="students" fill={C.primary} radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </SectionBlock>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1 }}>
            <SectionBlock title="TENDENCIA DE ASISTENCIA" delay={0.35}>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={attendanceTrend}>
                  <defs>
                    <linearGradient id="attendGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.primary} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={C.primary} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="week" stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis domain={[80, 100]} stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="monotone" dataKey="rate" stroke={C.primary} strokeWidth={2}
                    fill="url(#attendGrad)" dot={{ r: 3, fill: C.primary, stroke: '#fff', strokeWidth: 2 }} name="Asistencia %" />
                </AreaChart>
              </ResponsiveContainer>
            </SectionBlock>
          </div>

          {/* Quick Actions */}
          <div style={{ width: 280, flexShrink: 0 }}>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
                <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>ACCIONES RÁPIDAS</span>
              </div>
              {[
                { to: '/admin/estudiantes', icon: Users,    label: 'Gestionar Estudiantes' },
                { to: '/admin/educadores',  icon: UserCog,  label: 'Gestionar Educadores'  },
                { to: '/admin/programas',   icon: BookOpen, label: 'Gestionar Programas'   },
                { to: '/admin/reportes',    icon: Download, label: 'Generar Reportes'      },
              ].map((a, i, arr) => {
                const Icon = a.icon;
                return (
                  <div key={a.to}>
                    <Link to={a.to}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px',
                        cursor: 'pointer', transition: 'background 0.15s',
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                        onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
                      >
                        <Icon style={{ width: 14, height: 14, color: C.muted, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.8rem', color: C.text, flex: 1 }}>{a.label}</span>
                        <ArrowRight style={{ width: 12, height: 12, color: C.border }} />
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
    </div>
  );
};
