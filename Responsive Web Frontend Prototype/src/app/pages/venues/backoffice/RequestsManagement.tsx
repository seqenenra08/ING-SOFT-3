import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Eye, CheckCircle, XCircle, Clock, FileText } from 'lucide-react';
import { rentalRequests } from '../../../data/venuesData';
import { toast } from 'sonner';
import { C } from '../../../theme';

const statusStyle: Record<string, { label: string; color: string }> = {
  pagada:      { label: 'Pagada',       color: '#4b7a30' },
  en_revision: { label: 'En revisión',  color: C.gold    },
  enviada:     { label: 'Enviada',      color: C.primary },
  aprobada:    { label: 'Aprobada',     color: '#4b7a30' },
  rechazada:   { label: 'Rechazada',    color: C.active  },
  en_proceso:  { label: 'En proceso',   color: C.muted   },
};

const statuses = ['all', 'enviada', 'en_revision', 'aprobada', 'pagada', 'rechazada'];

export function RequestsManagement() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<any>(null);

  const filtered = rentalRequests.filter((r: any) => {
    const matchSearch = r.requestNumber?.toLowerCase().includes(search.toLowerCase()) || r.clientName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleApprove = () => { toast.success('Solicitud aprobada exitosamente'); setSelected(null); };
  const handleReject  = () => { toast.error('Solicitud rechazada');              setSelected(null); };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Backoffice</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Solicitudes</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{rentalRequests.length} solicitudes en el sistema</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 360 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Número de solicitud o cliente..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {statuses.map(s => (
              <button key={s} onClick={() => setStatusFilter(s)} style={{
                padding: '6px 12px', background: statusFilter === s ? C.primary : C.surface,
                color: statusFilter === s ? '#fff' : C.muted, border: `1px solid ${statusFilter === s ? C.primary : C.border}`,
                fontSize: '0.72rem', fontWeight: statusFilter === s ? 600 : 400,
                cursor: 'pointer', borderRadius: 2,
              }}>
                {s === 'all' ? 'Todas' : statusStyle[s]?.label ?? s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
              <span style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Solicitud / Cliente</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 140 }}>Escenario</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 80, textAlign: 'center' }}>Estado</span>
              <span style={{ width: 80 }} />
            </div>
            {filtered.map((r: any, i: number, arr: any[]) => {
              const ss = statusStyle[r.status] ?? statusStyle.enviada;
              return (
                <div key={r.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 20px', cursor: 'pointer', transition: 'background 0.15s', borderLeft: selected?.id === r.id ? `3px solid ${C.active}` : '3px solid transparent' }}
                    onClick={() => setSelected(r)}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = selected?.id === r.id ? C.tint : 'transparent'}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{r.requestNumber}</p>
                      <p style={{ fontSize: '0.7rem', color: C.muted, marginTop: 1 }}>{r.clientName} · {r.requestDate}</p>
                    </div>
                    <div style={{ width: 140 }}><p style={{ fontSize: '0.72rem', color: C.muted }}>{r.venueName}</p></div>
                    <div style={{ width: 80, textAlign: 'center' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: ss.color, border: `1px solid ${ss.color}44`, padding: '2px 6px', borderRadius: 2 }}>{ss.label}</span>
                    </div>
                    <div style={{ width: 80, textAlign: 'right' }}>
                      <button style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.7rem', cursor: 'pointer', borderRadius: 2 }}>
                        <Eye style={{ width: 11, height: 11 }} /> Ver
                      </button>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              );
            })}
          </motion.div>

          {/* Detail panel */}
          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              style={{ width: 300, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text }}>DETALLE</span>
                </div>
                <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.subtle, fontSize: '0.75rem' }}>✕</button>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'N° Solicitud', value: selected.requestNumber },
                  { label: 'Cliente',      value: selected.clientName    },
                  { label: 'Escenario',    value: selected.venueName     },
                  { label: 'Fecha',        value: selected.requestDate   },
                  { label: 'Estado',       value: statusStyle[selected.status]?.label ?? selected.status },
                ].map(item => (
                  <div key={item.label}>
                    <p style={{ fontSize: '0.65rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginTop: 1 }}>{item.value}</p>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <button onClick={handleApprove} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 0', background: C.primary, color: '#fff', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                    <CheckCircle style={{ width: 12, height: 12 }} /> Aprobar
                  </button>
                  <button onClick={handleReject} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px 0', background: 'transparent', color: C.active, fontSize: '0.75rem', fontWeight: 600, border: `1px solid ${C.active}55`, cursor: 'pointer', borderRadius: 2 }}>
                    <XCircle style={{ width: 12, height: 12 }} /> Rechazar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
