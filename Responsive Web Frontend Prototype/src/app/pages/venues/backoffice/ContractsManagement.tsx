import { useState } from 'react';
import { motion } from 'motion/react';
import { Search, FileText, Download, Eye } from 'lucide-react';
import { C } from '../../../theme';

const contracts = [
  { id: 'c1', number: 'CTR-2026-001', client: 'Colectivo Pacífico Visual',   venue: 'Sala Lucy Tejada',          date: '2026-04-10', value: '$2.800.000', status: 'vigente'    },
  { id: 'c2', number: 'CTR-2026-002', client: 'Cía. Danza Contemporánea',   venue: 'Teatro Jorge Isaacs',        date: '2026-03-25', value: '$8.500.000', status: 'vigente'    },
  { id: 'c3', number: 'CTR-2026-003', client: 'Universidad del Valle',       venue: 'Salón Belalcázar',          date: '2026-02-14', value: '$1.200.000', status: 'vencido'    },
  { id: 'c4', number: 'CTR-2026-004', client: 'Fundación Arte Pereira',         venue: 'Auditorio Mayor',           date: '2026-04-18', value: '$12.000.000',status: 'pendiente'  },
];

const statusStyle: Record<string, { label: string; color: string }> = {
  vigente:   { label: 'Vigente',   color: '#4b7a30' },
  vencido:   { label: 'Vencido',   color: C.muted   },
  pendiente: { label: 'Pendiente', color: C.gold    },
};

export function ContractsManagement() {
  const [search, setSearch] = useState('');
  const filtered = contracts.filter(c =>
    c.number.toLowerCase().includes(search.toLowerCase()) ||
    c.client.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Backoffice</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Contratos</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{contracts.length} contratos registrados</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 360 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar contrato o cliente..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <button style={{ padding: '9px 18px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            + Nuevo Contrato
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
            {['Contrato / Cliente', 'Escenario', 'Fecha', 'Valor', 'Estado', ''].map((h, i) => (
              <span key={i} style={{ flex: i === 0 ? 2 : 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: i > 3 ? 'center' : 'left' }}>{h}</span>
            ))}
          </div>
          {filtered.map((c, i, arr) => {
            const ss = statusStyle[c.status] ?? statusStyle.pendiente;
            return (
              <div key={c.id}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = C.tint}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}>
                  <div style={{ flex: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText style={{ width: 11, height: 11, color: C.primary }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.8rem' }}>{c.number}</p>
                        <p style={{ fontSize: '0.7rem', color: C.muted }}>{c.client}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}><p style={{ fontSize: '0.75rem', color: C.muted }}>{c.venue}</p></div>
                  <div style={{ flex: 1 }}><p style={{ fontSize: '0.75rem', color: C.muted }}>{c.date}</p></div>
                  <div style={{ flex: 1 }}><p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text }}>{c.value}</p></div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: ss.color, border: `1px solid ${ss.color}44`, padding: '2px 6px', borderRadius: 2 }}>{ss.label}</span>
                  </div>
                  <div style={{ flex: 1, display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                    <button style={{ padding: '5px 8px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.7rem', cursor: 'pointer', borderRadius: 2 }}>
                      <Eye style={{ width: 12, height: 12 }} />
                    </button>
                    <button style={{ padding: '5px 8px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.7rem', cursor: 'pointer', borderRadius: 2 }}>
                      <Download style={{ width: 12, height: 12 }} />
                    </button>
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
