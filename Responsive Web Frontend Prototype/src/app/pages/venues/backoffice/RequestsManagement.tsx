import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Eye, CheckCircle, XCircle, FileText, X, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';
import { venuesService } from '../../../services/venuesService';
import type { RentalRequest } from '../../../data/venuesData';

const statusStyle: Record<string, { label: string; color: string }> = {
  pagada:             { label: 'Pagada',             color: '#4b7a30' },
  en_revision:        { label: 'En revisión',         color: C.gold    },
  enviada:            { label: 'Enviada',             color: C.primary },
  aprobada:           { label: 'Aprobada',            color: '#4b7a30' },
  rechazada:          { label: 'Rechazada',           color: C.active  },
  contrato_generado:  { label: 'Contrato generado',   color: '#4b7a30' },
  cancelada:          { label: 'Cancelada',           color: C.muted   },
  pendiente_pago:     { label: 'Pendiente pago',      color: C.gold    },
  evento_programado:  { label: 'Evento programado',   color: C.primary },
  completado:         { label: 'Completado',          color: '#4b7a30' },
};

const statuses = ['all', 'enviada', 'en_revision', 'aprobada', 'pagada', 'rechazada'];

// Transiciones permitidas desde cada estado (siguiendo el enum request_status del schema).
// Si un estado no aparece, se considera terminal (sin transiciones).
const allowedTransitions: Record<string, string[]> = {
  enviada:           ['en_revision', 'aprobada', 'rechazada', 'cancelada'],
  en_revision:       ['aprobada', 'rechazada', 'enviada', 'cancelada'],
  aprobada:          ['contrato_generado', 'cancelada', 'en_revision'],
  contrato_generado: ['pagada', 'cancelada'],
  pagada:            ['cancelada'],
  rechazada:         ['en_revision'],
  cancelada:         [],
};

const STATUSES_NEEDING_REASON = new Set(['rechazada', 'cancelada']);

export function RequestsManagement() {
  const [requests, setRequests]       = useState<RentalRequest[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected]       = useState<RentalRequest | null>(null);
  // pendingStatus: cuando una transición exige motivo, abrimos un modal mostrando ese estado
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [reasonInput, setReasonInput] = useState('');
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    venuesService.getRequests()
      .then(setRequests)
      .catch(() => toast.error('Error al cargar solicitudes'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = requests.filter((r: any) => {
    const matchSearch = (r.requestNumber ?? r.id)?.toLowerCase().includes(search.toLowerCase()) ||
      r.clientName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  /**
   * Aplica un cambio de estado. Si requiere motivo (rechazada/cancelada) y no
   * tenemos uno todavía, abre el modal para pedirlo.
   */
  const applyStatusChange = async (nextStatus: string, reason?: string) => {
    if (!selected) return;
    if (STATUSES_NEEDING_REASON.has(nextStatus) && !reason?.trim()) {
      setPendingStatus(nextStatus);
      setReasonInput('');
      return;
    }
    setSaving(true);
    try {
      const updated = await venuesService.updateRequestStatus(selected.id, nextStatus, { reason });
      setRequests(prev => prev.map(r => r.id === selected.id ? updated : r));
      setSelected(updated);
      toast.success(`Estado actualizado: ${statusStyle[nextStatus]?.label ?? nextStatus}`);
      setPendingStatus(null);
      setReasonInput('');
    } catch (e: any) {
      toast.error(e.message ?? 'Error al actualizar el estado');
    } finally {
      setSaving(false);
    }
  };

  const confirmPendingChange = () => {
    if (!pendingStatus) return;
    if (!reasonInput.trim()) { toast.error('Ingresa un motivo'); return; }
    applyStatusChange(pendingStatus, reasonInput.trim());
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto' }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Backoffice</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Solicitudes</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{requests.length} solicitudes en el sistema</p>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {[
          { label: 'Enviadas',    value: requests.filter(r => r.status === 'enviada').length,    color: C.primary },
          { label: 'En revisión', value: requests.filter(r => r.status === 'en_revision').length, color: C.gold    },
          { label: 'Aprobadas',  value: requests.filter(r => r.status === 'aprobada').length,    color: '#4b7a30' },
          { label: 'Rechazadas', value: requests.filter(r => r.status === 'rechazada').length,   color: C.active  },
        ].map((k, i) => (
          <div key={k.label} style={{ flex: 1, padding: '14px 24px', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 3 }}>{k.label}</p>
          </div>
        ))}
      </motion.div>

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
                fontSize: '0.72rem', fontWeight: statusFilter === s ? 600 : 400, cursor: 'pointer', borderRadius: 2,
              }}>
                {s === 'all' ? 'Todas' : statusStyle[s]?.label ?? s}
              </button>
            ))}
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '40px', color: C.subtle }}>Cargando solicitudes...</div>}

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
              <span style={{ flex: 2, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Solicitud / Cliente</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 160 }}>Escenario</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 110, textAlign: 'center' }}>Estado</span>
              <span style={{ width: 60 }} />
            </div>

            {!loading && filtered.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>No se encontraron solicitudes.</div>
            )}

            {filtered.map((r: any, i, arr) => {
              const ss = statusStyle[r.status] ?? statusStyle.enviada;
              return (
                <div key={r.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 20px', cursor: 'pointer', transition: 'background 0.15s', borderLeft: selected?.id === r.id ? `3px solid ${C.primary}` : '3px solid transparent', background: selected?.id === r.id ? C.tint : 'transparent' }}
                    onClick={() => setSelected(selected?.id === r.id ? null : r)}
                    onMouseEnter={e => { if (selected?.id !== r.id) (e.currentTarget as HTMLDivElement).style.background = C.tint; }}
                    onMouseLeave={e => { if (selected?.id !== r.id) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <FileText style={{ width: 11, height: 11, color: C.primary }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{r.requestNumber ?? r.id}</p>
                        <p style={{ fontSize: '0.7rem', color: C.muted, marginTop: 1 }}>{r.clientName} · {r.submittedAt ? new Date(r.submittedAt).toLocaleDateString('es-CO') : r.requestDate ?? '—'}</p>
                      </div>
                    </div>
                    <div style={{ width: 160 }}><p style={{ fontSize: '0.72rem', color: C.muted }}>{r.venueName}</p></div>
                    <div style={{ width: 110, textAlign: 'center' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: ss.color, border: `1px solid ${ss.color}44`, padding: '2px 6px', borderRadius: 2 }}>{ss.label}</span>
                    </div>
                    <div style={{ width: 60, textAlign: 'right' }}>
                      <button onClick={e => { e.stopPropagation(); setSelected(r); }}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.7rem', cursor: 'pointer', borderRadius: 2 }}>
                        <Eye style={{ width: 11, height: 11 }} />
                      </button>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
                </div>
              );
            })}
          </motion.div>

          {/* Detail panel */}
          <AnimatePresence>
            {selected && (
              <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}
                style={{ width: 300, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}` }}>
                <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text }}>DETALLE</span>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <X style={{ width: 14, height: 14, color: C.subtle }} />
                  </button>
                </div>
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {([
                    { label: 'N° Solicitud', value: (selected as any).requestNumber ?? selected.id },
                    { label: 'Cliente',      value: selected.clientName },
                    { label: 'Email',        value: selected.clientEmail ?? '—' },
                    { label: 'Teléfono',     value: selected.clientPhone ?? '—' },
                    { label: 'Escenario',    value: selected.venueName },
                    { label: 'Evento',       value: selected.eventName ?? '—' },
                    { label: 'Tipo evento',  value: selected.eventType ?? '—' },
                    { label: 'Fecha',        value: (selected as any).eventDate ?? (selected as any).requestDate ?? '—' },
                    { label: 'Horario',      value: `${selected.startTime ?? '—'} - ${selected.endTime ?? '—'}` },
                    { label: 'Asistentes',   value: selected.attendees ? `${selected.attendees} personas` : '—' },
                    { label: 'Estado',       value: statusStyle[selected.status]?.label ?? selected.status },
                  ] as { label: string; value: any }[]).map(item => (
                    <div key={item.label}>
                      <p style={{ fontSize: '0.62rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, marginTop: 1 }}>{item.value}</p>
                    </div>
                  ))}

                  {selected.notes && (
                    <div>
                      <p style={{ fontSize: '0.62rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Notas</p>
                      <p style={{ fontSize: '0.72rem', color: C.muted, marginTop: 1 }}>{selected.notes}</p>
                    </div>
                  )}

                  {selected.status === 'rechazada' && selected.rejectionReason && (
                    <div style={{ padding: '8px 12px', background: `${C.active}10`, border: `1px solid ${C.active}33`, borderRadius: 2 }}>
                      <p style={{ fontSize: '0.65rem', color: C.active, fontWeight: 600 }}>Motivo de rechazo</p>
                      <p style={{ fontSize: '0.72rem', color: C.muted, marginTop: 2 }}>{selected.rejectionReason}</p>
                    </div>
                  )}

                  {/* Transiciones de estado: botones para cada destino permitido */}
                  {(() => {
                    const options = allowedTransitions[selected.status] ?? [];
                    if (options.length === 0) {
                      return (
                        <div style={{ padding: '10px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 2, textAlign: 'center' }}>
                          <p style={{ fontSize: '0.72rem', color: C.muted }}>Estado final — no hay más cambios posibles.</p>
                        </div>
                      );
                    }
                    return (
                      <div style={{ paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                        <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.subtle, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                          <RefreshCw style={{ width: 10, height: 10 }} /> Cambiar estado a
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {options.map(s => {
                            const cfg = statusStyle[s] ?? { label: s, color: C.primary };
                            const danger = STATUSES_NEEDING_REASON.has(s);
                            const Icon = danger ? XCircle : CheckCircle;
                            return (
                              <button
                                key={s}
                                onClick={() => applyStatusChange(s)}
                                disabled={saving}
                                type="button"
                                style={{
                                  display: 'flex', alignItems: 'center', gap: 8,
                                  padding: '8px 12px',
                                  background: danger ? 'transparent' : `${cfg.color}14`,
                                  color: cfg.color,
                                  border: `1px solid ${cfg.color}55`,
                                  fontSize: '0.78rem', fontWeight: 600,
                                  cursor: saving ? 'not-allowed' : 'pointer',
                                  borderRadius: 2,
                                  opacity: saving ? 0.6 : 1,
                                  transition: 'background 0.15s',
                                }}>
                                <Icon style={{ width: 12, height: 12 }} />
                                <span style={{ flex: 1, textAlign: 'left' }}>{cfg.label}</span>
                                {danger && <span style={{ fontSize: '0.65rem', color: C.subtle, fontWeight: 400 }}>requiere motivo</span>}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal: Motivo (rechazo o cancelación) */}
      <AnimatePresence>
        {pendingStatus && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => !saving && setPendingStatus(null)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, width: '100%', maxWidth: 420 }}
              onClick={e => e.stopPropagation()}
              role="dialog" aria-modal="true" aria-label={`Confirmar cambio a ${statusStyle[pendingStatus]?.label ?? pendingStatus}`}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>
                    {pendingStatus === 'rechazada' ? 'MOTIVO DE RECHAZO' : 'MOTIVO DE CANCELACIÓN'}
                  </span>
                </div>
                <button onClick={() => !saving && setPendingStatus(null)} aria-label="Cerrar"
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Motivo *</label>
                  <textarea value={reasonInput} onChange={e => setReasonInput(e.target.value)} rows={4}
                    autoFocus
                    placeholder={pendingStatus === 'rechazada'
                      ? 'Explica por qué se rechaza la solicitud...'
                      : 'Explica por qué se cancela la solicitud...'}
                    style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box', resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = C.active}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setPendingStatus(null)} disabled={saving}
                    style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
                    Cancelar
                  </button>
                  <button onClick={confirmPendingChange} disabled={saving}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: saving ? C.border : C.active, color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saving ? 'Guardando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
