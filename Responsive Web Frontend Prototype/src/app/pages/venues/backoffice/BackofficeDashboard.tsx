import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { FileText, DollarSign, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { C } from '../../../theme';
import { venuesService } from '../../../services/venuesService';

const monthlyData = [
  { month: 'Ene', solicitudes: 12, eventos: 10 },
  { month: 'Feb', solicitudes: 15, eventos: 13 },
  { month: 'Mar', solicitudes: 18, eventos: 15 },
  { month: 'Abr', solicitudes: 8,  eventos: 5  },
];

const revenueData = [
  { month: 'Ene', ingresos: 28000000 },
  { month: 'Feb', ingresos: 35000000 },
  { month: 'Mar', ingresos: 42000000 },
  { month: 'Abr', ingresos: 18000000 },
];

const statusStyle: Record<string, { label: string; color: string }> = {
  pagada:      { label: 'Pagada',       color: '#4b7a30' },
  en_revision: { label: 'En revisión',  color: C.gold    },
  enviada:     { label: 'Enviada',      color: C.primary },
  aprobada:    { label: 'Aprobada',     color: '#4b7a30' },
  rechazada:   { label: 'Rechazada',    color: C.active  },
};

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: C.dark, border: `1px solid #2a1212`, padding: '8px 12px', fontSize: '0.72rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginBottom: 3 }}>{label}</p>
        {payload.map((p: any, i: number) => <p key={i} style={{ color: '#fff' }}>{p.name}: {p.value}</p>)}
      </div>
    );
  }
  return null;
};

export function BackofficeDashboard() {
  const [kpiData, setKpiData] = useState({ requests: 0, pending: 0, events: 0, revenue: 0, maintenance: 0 });
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      venuesService.getRequests(),
      venuesService.getEvents(),
      venuesService.getPayments(),
      venuesService.getMaintenanceTickets(),
    ]).then(([requests, events, payments, tickets]) => {
      const pending = requests.filter(r => r.status === 'enviada' || r.status === 'en_revision').length;
      const openTickets = tickets.filter(t => t.status !== 'cerrado' && t.status !== 'resuelto').length;
      const totalRevenue = payments
        .filter(p => p.status === 'completado' || p.status === 'pagado')
        .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);
      setKpiData({ requests: requests.length, pending, events: events.length, revenue: totalRevenue, maintenance: openTickets });
      setRecentRequests(requests.slice(0, 3));
    }).catch(() => {});
  }, []);

  const kpis = [
    { value: String(kpiData.requests), label: 'Solicitudes',         sub: `${kpiData.pending} pendientes`,  icon: FileText,     color: C.primary },
    { value: String(kpiData.events),   label: 'Eventos programados',  sub: 'En el sistema',                 icon: CheckCircle2, color: '#4b7a30' },
    { value: kpiData.revenue > 0 ? `$${(kpiData.revenue / 1000000).toFixed(0)}M` : '$0', label: 'Ingresos completados', sub: 'COP acumulado', icon: DollarSign, color: C.gold },
    { value: String(kpiData.maintenance), label: 'Mantenimiento',     sub: 'Tickets abiertos',              icon: AlertTriangle, color: C.active  },
    { value: '', label: '', sub: '', icon: TrendingUp, color: C.subtle },
  ].filter(k => k.label);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* Hero banner */}
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Backoffice</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.7rem', fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>Dashboard de Gestión</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Sistema de Gestión de Escenarios Culturales · Secretaría de Cultura</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>
              {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div key={k.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 20px', borderRight: i < kpis.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width: 32, height: 32, flexShrink: 0, border: `1.5px solid ${k.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                <Icon style={{ width: 14, height: 14, color: k.color }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.25rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{k.value}</p>
                <p style={{ fontSize: '0.65rem', color: C.muted, marginTop: 2 }}>{k.label}</p>
                <p style={{ fontSize: '0.62rem', color: k.color, marginTop: 1 }}>{k.sub}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Body */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', gap: 24 }}>

        {/* Charts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>SOLICITUDES Y EVENTOS MENSUALES</span>
            </div>
            <div style={{ padding: 20 }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="month" stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: `${C.primary}08` }} />
                  <Bar dataKey="solicitudes" fill={C.primary} radius={[2, 2, 0, 0]} name="Solicitudes" />
                  <Bar dataKey="eventos" fill={C.gold} radius={[2, 2, 0, 0]} name="Eventos" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>INGRESOS MENSUALES (COP)</span>
            </div>
            <div style={{ padding: 20 }}>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="month" stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${v / 1000000}M`} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="ingresos" stroke={C.gold} strokeWidth={2} dot={{ r: 3, fill: C.gold, stroke: '#fff', strokeWidth: 2 }} name="Ingresos" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div style={{ width: 300, flexShrink: 0 }}>
          {/* Recent requests */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            style={{ background: C.surface, border: `1px solid ${C.border}`, marginBottom: 16 }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text, textTransform: 'uppercase' }}>Solicitudes Recientes</span>
              </div>
              <Link to="/escenarios/backoffice/solicitudes">
                <span style={{ fontSize: '0.68rem', color: C.active, cursor: 'pointer', fontWeight: 600 }}>Ver todas</span>
              </Link>
            </div>
            {recentRequests.length === 0 && (
              <div style={{ padding: '20px 18px', textAlign: 'center', color: C.subtle, fontSize: '0.78rem' }}>Sin solicitudes recientes</div>
            )}
            {recentRequests.map((r, i, arr) => {
              const ss = statusStyle[r.status as string] ?? statusStyle.enviada;
              return (
                <div key={r.id}>
                  <div style={{ padding: '12px 18px', borderLeft: `3px solid ${ss.color}44` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 3 }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.75rem', color: C.text }}>{r.requestNumber ?? r.id}</p>
                      <span style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: ss.color, border: `1px solid ${ss.color}44`, padding: '1px 5px', borderRadius: 2 }}>
                        {ss.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.7rem', color: C.muted }}>{r.organizationName ?? r.clientName ?? '—'}</p>
                    <p style={{ fontSize: '0.68rem', color: C.subtle, marginTop: 2 }}>{r.venueName ?? '—'} · {r.submittedAt?.split('T')[0] ?? r.startDate ?? ''}</p>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              );
            })}
          </motion.div>

          {/* Quick nav */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.42 }}
            style={{ background: C.dark, border: `1px solid #2a1212` }}>
            <div style={{ padding: '12px 18px', borderBottom: `1px solid #2a1212`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>Módulos</span>
            </div>
            {[
              { to: '/escenarios/backoffice/solicitudes', label: 'Solicitudes' },
              { to: '/escenarios/backoffice/contratos',   label: 'Contratos'   },
              { to: '/escenarios/backoffice/pagos',       label: 'Pagos'       },
              { to: '/escenarios/backoffice/juridico',    label: 'Revisión Jurídica' },
              { to: '/escenarios/backoffice/mantenimiento',label: 'Mantenimiento' },
              { to: '/escenarios/backoffice/reportes',    label: 'Reportes'    },
            ].map((item, i, arr) => (
              <div key={item.to}>
                <Link to={item.to}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 18px', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(139,26,26,0.2)'}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                    <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)' }}>{item.label}</span>
                    <ArrowRight style={{ width: 11, height: 11, color: 'rgba(255,255,255,0.2)' }} />
                  </div>
                </Link>
                {i < arr.length - 1 && <div style={{ height: 1, background: '#2a1212' }} />}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
