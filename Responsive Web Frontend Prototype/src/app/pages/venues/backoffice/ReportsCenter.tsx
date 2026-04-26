import { motion } from 'motion/react';
import { Download, BarChart3, DollarSign, FileText, Wrench, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { toast } from 'sonner';
import { C } from '../../../theme';

const monthlyData = [
  { month: 'Ene', solicitudes: 12, ingresos: 28 },
  { month: 'Feb', solicitudes: 15, ingresos: 35 },
  { month: 'Mar', solicitudes: 18, ingresos: 42 },
  { month: 'Abr', solicitudes: 8,  ingresos: 18 },
];

const reports = [
  { name: 'Reporte de Solicitudes', desc: 'Todas las solicitudes del período con estado y detalles', icon: FileText },
  { name: 'Reporte Financiero',     desc: 'Ingresos, pagos y cuentas por cobrar del período',       icon: DollarSign },
  { name: 'Reporte de Contratos',   desc: 'Contratos vigentes, vencidos y pendientes de firma',     icon: BarChart3 },
  { name: 'Reporte de Mantenimiento',desc: 'Tickets de mantenimiento y costos asociados',           icon: Wrench },
  { name: 'Reporte de Ocupación',   desc: 'Uso de escenarios por fecha, tipo y solicitante',       icon: TrendingUp },
];

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

export function ReportsCenter() {
  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Backoffice</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Centro de Reportes</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Visualiza y exporta datos de la gestión de escenarios</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', gap: 24 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.active, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>SOLICITUDES E INGRESOS MENSUALES</span>
            </div>
            <div style={{ padding: 20 }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="month" stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: `${C.primary}08` }} />
                  <Bar dataKey="solicitudes" fill={C.primary} radius={[2, 2, 0, 0]} name="Solicitudes" />
                  <Bar dataKey="ingresos" fill={C.gold} radius={[2, 2, 0, 0]} name="Ingresos (M COP)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 3, height: 16, background: C.gold, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.85rem', color: C.text }}>TENDENCIA DE INGRESOS (M COP)</span>
            </div>
            <div style={{ padding: 20 }}>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
                  <XAxis dataKey="month" stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={C.subtle} fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <Line type="monotone" dataKey="ingresos" stroke={C.gold} strokeWidth={2} dot={{ r: 3, fill: C.gold, stroke: '#fff', strokeWidth: 2 }} name="Ingresos" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div style={{ width: 280, flexShrink: 0 }}>
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text, textTransform: 'uppercase' }}>Exportar Reportes</span>
            </div>
            {reports.map((r, i, arr) => {
              const Icon = r.icon;
              return (
                <div key={r.name}>
                  <div style={{ display: 'flex', gap: 12, padding: '14px 18px', cursor: 'pointer', transition: 'background 0.15s' }}
                    onClick={() => toast.success(`Descargando: ${r.name}`)}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                    <div style={{ width: 28, height: 28, flexShrink: 0, background: C.tint, border: `1px solid ${C.active}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                      <Icon style={{ width: 12, height: 12, color: C.primary }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text, marginBottom: 2 }}>{r.name}</p>
                      <p style={{ fontSize: '0.68rem', color: C.subtle, lineHeight: 1.4 }}>{r.desc}</p>
                    </div>
                    <Download style={{ width: 12, height: 12, color: C.muted, flexShrink: 0, marginTop: 2 }} />
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
