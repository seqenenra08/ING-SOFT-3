import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { C } from '../../../theme';

const payments = [
  { id: 'p1', ref: 'PAG-2026-001', client: 'Colectivo Pacífico Visual',   amount: '$2.800.000', method: 'Transferencia', date: '2026-04-12', status: 'confirmado' },
  { id: 'p2', ref: 'PAG-2026-002', client: 'Cía. Danza Contemporánea',   amount: '$8.500.000', method: 'PSE',           date: '2026-03-27', status: 'confirmado' },
  { id: 'p3', ref: 'PAG-2026-003', client: 'Universidad del Valle',       amount: '$1.200.000', method: 'Efectivo',      date: '2026-04-18', status: 'pendiente'  },
  { id: 'p4', ref: 'PAG-2026-004', client: 'Fundación Arte Pereira',         amount: '$12.000.000',method: 'Transferencia', date: '2026-04-19', status: 'en_proceso' },
  { id: 'p5', ref: 'PAG-2026-005', client: 'Teatro Popular',               amount: '$3.400.000', method: 'PSE',           date: '2026-04-15', status: 'rechazado'  },
];

const kpiData = [
  { label: 'Total confirmado', value: '$11.3M',  color: '#4b7a30' },
  { label: 'Pendiente',        value: '$13.2M',  color: C.gold    },
  { label: 'Rechazado',        value: '$3.4M',   color: C.active  },
];

const statusStyle: Record<string, { label: string; color: string; icon: any }> = {
  confirmado: { label: 'Confirmado', color: '#4b7a30', icon: CheckCircle     },
  pendiente:  { label: 'Pendiente',  color: C.gold,    icon: Clock           },
  en_proceso: { label: 'En proceso', color: C.primary, icon: Clock           },
  rechazado:  { label: 'Rechazado',  color: C.active,  icon: AlertTriangle   },
};

export function PaymentsManagement() {
  const [search, setSearch] = useState('');
  const filtered = payments.filter(p =>
    p.ref.toLowerCase().includes(search.toLowerCase()) ||
    p.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Backoffice</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Pagos</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{payments.length} registros de pago</p>
        </motion.div>
      </div>

      {/* KPI */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {kpiData.map((k, i) => (
          <div key={k.label} style={{ flex: 1, padding: '16px 24px', borderRight: i < kpiData.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.3rem', fontWeight: 700, color: C.text, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 2 }}>{k.label}</p>
            <div style={{ height: 2, background: k.color, marginTop: 8, width: 24, borderRadius: 1 }} />
          </div>
        ))}
      </motion.div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px' }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ position: 'relative', maxWidth: 360 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar referencia o cliente..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
            {['Referencia / Cliente', 'Monto', 'Método', 'Fecha', 'Estado'].map((h, i) => (
              <span key={i} style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>
          {filtered.map((p, i, arr) => {
            const ss = statusStyle[p.status] ?? statusStyle.pendiente;
            const Icon = ss.icon;
            return (
              <div key={p.id}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', transition: 'background 0.15s', borderLeft: `3px solid ${ss.color}33` }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <DollarSign style={{ width: 11, height: 11, color: C.gold }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.8rem' }}>{p.ref}</p>
                        <p style={{ fontSize: '0.7rem', color: C.muted }}>{p.client}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}><p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text }}>{p.amount}</p></div>
                  <div style={{ flex: 1 }}><p style={{ fontSize: '0.75rem', color: C.muted }}>{p.method}</p></div>
                  <div style={{ flex: 1 }}><p style={{ fontSize: '0.75rem', color: C.muted }}>{p.date}</p></div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Icon style={{ width: 12, height: 12, color: ss.color }} />
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: ss.color }}>{ss.label}</span>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
