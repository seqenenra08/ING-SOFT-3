import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Shield, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';
import { venuesService } from '../../../services/venuesService';
import type { Contract } from '../../../data/venuesData';

const statusStyle: Record<string, { label: string; color: string }> = {
  pendiente:        { label: 'Pendiente',    color: C.gold    },
  en_revision:      { label: 'En revisión',  color: C.primary },
  revision_juridica:{ label: 'En revisión',  color: C.primary },
  aprobado:         { label: 'Aprobado',     color: '#4b7a30' },
  firmado:          { label: 'Firmado',      color: '#4b7a30' },
  rechazado:        { label: 'Rechazado',    color: C.active  },
};

export function LegalReview() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Contract | null>(null);
  const [rejecting, setRejecting] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');

  useEffect(() => {
    venuesService.getContracts()
      .then(setContracts)
      .catch(() => toast.error('Error al cargar contratos'))
      .finally(() => setLoading(false));
  }, []);

  const pending = contracts.filter(c => c.status === 'revision_juridica' || c.status === 'pendiente' || c.status === 'en_revision');

  const filtered = contracts.filter(c =>
    c.contractNumber?.toLowerCase().includes(search.toLowerCase()) ||
    c.clientName?.toLowerCase().includes(search.toLowerCase()) ||
    c.venueName?.toLowerCase().includes(search.toLowerCase())
  );

  const handleApprove = async () => {
    if (!selected) return;
    try {
      const updated = await venuesService.legalReview(selected.id, 'aprobado', 'Aprobado por revisión jurídica');
      setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelected(null);
      toast.success('Contrato aprobado jurídicamente');
    } catch {
      toast.error('Error al aprobar contrato');
    }
  };

  const handleReject = async () => {
    if (!selected || !rejectNotes.trim()) { toast.error('Ingresa el motivo del rechazo'); return; }
    try {
      const updated = await venuesService.legalReview(selected.id, 'rechazado', rejectNotes);
      setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
      setSelected(null);
      setRejecting(false);
      setRejectNotes('');
      toast.success('Revisión jurídica rechazada');
    } catch {
      toast.error('Error al rechazar contrato');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Backoffice</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Revisión Jurídica</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
            {loading ? 'Cargando...' : `${pending.length} contratos en revisión`}
          </p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ position: 'relative', maxWidth: 360 }}>
              <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por contrato, cliente o escenario..."
                style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = C.primary}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
              {['Contrato / Cliente', 'Escenario', 'Monto', 'Estado', ''].map((h, i) => (
                <span key={i} style={{ flex: i === 0 ? 2 : 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {loading && <div style={{ padding: '40px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>Cargando contratos...</div>}
            {!loading && filtered.length === 0 && <div style={{ padding: '40px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>No se encontraron contratos.</div>}

            {filtered.map((c, i, arr) => {
              const ss = statusStyle[c.status as string] ?? statusStyle.pendiente;
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
                          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.8rem' }}>{c.contractNumber}</p>
                          <p style={{ fontSize: '0.7rem', color: C.muted }}>{c.clientName}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}><p style={{ fontSize: '0.72rem', color: C.muted }}>{c.venueName}</p></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.78rem' }}>
                        {c.totalAmount ? `$${Number(c.totalAmount).toLocaleString('es-CO')}` : '—'}
                      </p>
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
            style={{ width: 300, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text }}>DETALLE</span>
              </div>
              <button onClick={() => { setSelected(null); setRejecting(false); setRejectNotes(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.subtle, fontSize: '0.75rem' }}>✕</button>
            </div>
            <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Contrato',  value: selected.contractNumber },
                { label: 'Cliente',   value: selected.clientName     },
                { label: 'Escenario', value: selected.venueName      },
                { label: 'Monto',     value: selected.totalAmount ? `$${Number(selected.totalAmount).toLocaleString('es-CO')} COP` : '—' },
                { label: 'Inicio',    value: selected.startDate      },
                { label: 'Fin',       value: selected.endDate        },
              ].map(item => (
                <div key={item.label}>
                  <p style={{ fontSize: '0.65rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginTop: 1 }}>{item.value ?? '—'}</p>
                </div>
              ))}

              {rejecting ? (
                <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Motivo del rechazo *</label>
                  <textarea value={rejectNotes} onChange={e => setRejectNotes(e.target.value)} rows={3}
                    style={{ width: '100%', padding: '8px 10px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.78rem', outline: 'none', borderRadius: 2, resize: 'vertical', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                    <button onClick={() => { setRejecting(false); setRejectNotes(''); }}
                      style={{ flex: 1, padding: '7px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                      Cancelar
                    </button>
                    <button onClick={handleReject}
                      style={{ flex: 1, padding: '7px', background: C.active, color: '#fff', fontSize: '0.72rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                      Confirmar
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 6, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                  <button onClick={handleApprove}
                    style={{ flex: 1, padding: '8px 0', background: C.primary, color: '#fff', fontSize: '0.72rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                    Aprobar
                  </button>
                  <button onClick={() => setRejecting(true)}
                    style={{ flex: 1, padding: '8px 0', background: 'transparent', color: C.active, fontSize: '0.72rem', fontWeight: 600, border: `1px solid ${C.active}55`, cursor: 'pointer', borderRadius: 2 }}>
                    Rechazar
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
