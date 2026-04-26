import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Shield, CheckCircle, Clock, FileText, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';

const cases = [
  { id: 'j1', ref: 'JUR-2026-001', client: 'Colectivo Pacífico Visual',   type: 'Revisión contrato estándar', priority: 'normal', status: 'pendiente',  date: '2026-04-18' },
  { id: 'j2', ref: 'JUR-2026-002', client: 'Cía. Danza Contemporánea',   type: 'Clausulas especiales',       priority: 'alta',   status: 'en_revision', date: '2026-04-17' },
  { id: 'j3', ref: 'JUR-2026-003', client: 'Universidad del Valle',       type: 'Revisión contrato estándar', priority: 'normal', status: 'aprobado',   date: '2026-04-10' },
  { id: 'j4', ref: 'JUR-2026-004', client: 'Fundación Arte Pereira',         type: 'Evento especial – clausulas',priority: 'alta',   status: 'pendiente',  date: '2026-04-19' },
];

const statusStyle: Record<string, { label: string; color: string }> = {
  pendiente:   { label: 'Pendiente',    color: C.gold    },
  en_revision: { label: 'En revisión',  color: C.primary },
  aprobado:    { label: 'Aprobado',     color: '#4b7a30' },
  rechazado:   { label: 'Rechazado',    color: C.active  },
};

export function LegalReview() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const filtered = cases.filter(c =>
    c.ref.toLowerCase().includes(search.toLowerCase()) ||
    c.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Backoffice</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Revisión Jurídica</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            {cases.filter(c => c.status === 'pendiente' || c.status === 'en_revision').length} casos en revisión
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ position: 'relative', maxWidth: 360 }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar caso..."
                style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = C.primary}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
              {['Referencia / Cliente', 'Tipo', 'Prioridad', 'Estado', ''].map((h, i) => (
                <span key={i} style={{ flex: i === 0 ? 2 : 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>
            {filtered.map((c, i, arr) => {
              const ss = statusStyle[c.status] ?? statusStyle.pendiente;
              return (
                <div key={c.id}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', cursor: 'pointer', transition: 'background 0.15s', borderLeft: selected?.id === c.id ? `3px solid ${C.active}` : '3px solid transparent' }}
                    onClick={() => setSelected(c)}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = selected?.id === c.id ? C.tint : 'transparent'}>
                    <div style={{ flex: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Shield style={{ width: 11, height: 11, color: C.primary }} />
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.8rem' }}>{c.ref}</p>
                          <p style={{ fontSize: '0.7rem', color: C.muted }}>{c.client}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontSize: '0.72rem', color: C.muted }}>{c.type}</p></div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: c.priority === 'alta' ? C.active : C.muted, border: `1px solid ${c.priority === 'alta' ? C.active : C.border}44`, padding: '2px 6px', borderRadius: 2 }}>
                        {c.priority === 'alta' ? 'Alta' : 'Normal'}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: ss.color, border: `1px solid ${ss.color}44`, padding: '2px 6px', borderRadius: 2 }}>{ss.label}</span>
                    </div>
                    <div style={{ flex: 1, textAlign: 'right' }}>
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
        </div>

        {/* Detail */}
        {selected && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
            style={{ width: 280, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text }}>DETALLE</span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.subtle, fontSize: '0.75rem' }}>✕</button>
            </div>
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Referencia', value: selected.ref      },
                { label: 'Cliente',    value: selected.client   },
                { label: 'Tipo',       value: selected.type     },
                { label: 'Fecha',      value: selected.date     },
                { label: 'Prioridad',  value: selected.priority === 'alta' ? 'Alta' : 'Normal' },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: '0.65rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginTop: 1 }}>{item.value}</p>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                <button onClick={() => { toast.success('Revisión aprobada'); setSelected(null); }}
                  style={{ flex: 1, padding: '8px 0', background: C.primary, color: '#fff', fontSize: '0.72rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                  Aprobar
                </button>
                <button onClick={() => { toast.error('Revisión rechazada'); setSelected(null); }}
                  style={{ flex: 1, padding: '8px 0', background: 'transparent', color: C.active, fontSize: '0.72rem', fontWeight: 600, border: `1px solid ${C.active}55`, cursor: 'pointer', borderRadius: 2 }}>
                  Rechazar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
