import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, FileText, Download, Plus, X, Save, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';
import { venuesService } from '../../../services/venuesService';
import type { Contract } from '../../../data/venuesData';

const statusStyle: Record<string, { label: string; color: string }> = {
  activo:           { label: 'Vigente',       color: '#4b7a30' },
  vigente:          { label: 'Vigente',       color: '#4b7a30' },
  borrador:         { label: 'Borrador',      color: C.subtle  },
  enviado_firma:    { label: 'Env. firma',    color: C.gold    },
  firmado:          { label: 'Firmado',       color: '#4b7a30' },
  finalizado:       { label: 'Finalizado',    color: C.muted   },
  cancelado:        { label: 'Cancelado',     color: C.active  },
};

const STATUSES = ['borrador', 'enviado_firma', 'firmado', 'activo', 'finalizado', 'cancelado'];

const EMPTY_FORM = {
  clientName: '', clientDocument: '', venueName: '',
  startDate: '', endDate: '', totalAmount: '', status: 'borrador',
};

function downloadContractPDF(contract: Contract) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Contrato ${contract.contractNumber}</title>
  <style>
    body{font-family:Arial,sans-serif;padding:48px;color:#222;max-width:800px;margin:0 auto;}
    h1{font-size:1.4rem;border-bottom:2px solid #333;padding-bottom:8px;margin-bottom:24px;}
    .field{margin-bottom:12px;display:flex;gap:12px;}
    .label{font-size:.85rem;color:#666;width:140px;flex-shrink:0;}
    .value{font-size:.9rem;font-weight:600;}
    .footer{margin-top:48px;font-size:.75rem;color:#999;}
  </style></head><body>
  <h1>CONTRATO ${contract.contractNumber}</h1>
  <div class="field"><span class="label">Cliente</span><span class="value">${contract.clientName ?? '—'}</span></div>
  <div class="field"><span class="label">Documento</span><span class="value">${contract.clientDocument ?? '—'}</span></div>
  <div class="field"><span class="label">Escenario</span><span class="value">${contract.venueName ?? '—'}</span></div>
  <div class="field"><span class="label">Fecha inicio</span><span class="value">${contract.startDate ?? '—'}</span></div>
  <div class="field"><span class="label">Fecha fin</span><span class="value">${contract.endDate ?? '—'}</span></div>
  <div class="field"><span class="label">Valor total</span><span class="value">${typeof contract.totalAmount === 'number' ? fmt(contract.totalAmount) : (contract.totalAmount ?? '—')}</span></div>
  <div class="field"><span class="label">Estado</span><span class="value">${statusStyle[contract.status]?.label ?? contract.status}</span></div>
  ${(contract.clauses ?? []).length > 0 ? `<h2 style="margin-top:32px;">Cláusulas</h2>${(contract.clauses as string[]).map((c, i) => `<p>${i + 1}. ${c}</p>`).join('')}` : ''}
  <div class="footer">Generado: ${new Date().toLocaleDateString('es-CO')} · Sistema de Gestión de Escenarios · Secretaría de Cultura de Cali</div>
  </body></html>`;
  const w = window.open('', '_blank');
  if (w) { w.document.write(html); w.document.close(); w.print(); }
}

export function ContractsManagement() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState<Contract | null>(null);
  const [modal, setModal]         = useState<null | 'create' | 'edit'>(null);
  const [form, setForm]           = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    venuesService.getContracts()
      .then(setContracts)
      .catch(() => toast.error('Error al cargar contratos'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = contracts.filter(c =>
    (c.contractNumber ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.clientName ?? '').toLowerCase().includes(search.toLowerCase()) ||
    (c.venueName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModal('create');
  };

  const openEdit = (c: Contract, ev: React.MouseEvent) => {
    ev.stopPropagation();
    setEditingId(c.id);
    setForm({
      clientName:    c.clientName    ?? '',
      clientDocument:c.clientDocument ?? '',
      venueName:     c.venueName    ?? '',
      startDate:     c.startDate    ?? '',
      endDate:       c.endDate      ?? '',
      totalAmount:   String(c.totalAmount ?? ''),
      status:        c.status       ?? 'borrador',
    });
    setModal('edit');
  };

  const handleSave = async () => {
    if (!form.clientName || !form.venueName) {
      toast.error('Cliente y escenario son obligatorios');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        clientName:     form.clientName,
        clientDocument: form.clientDocument,
        venueName:      form.venueName,
        startDate:      form.startDate || undefined,
        endDate:        form.endDate   || undefined,
        totalAmount:    Number(form.totalAmount) || 0,
        status:         form.status as Contract['status'],
      };
      if (modal === 'create') {
        const created = await venuesService.createContract(payload);
        setContracts(prev => [created, ...prev]);
        toast.success('Contrato creado exitosamente');
      } else if (modal === 'edit' && editingId) {
        const updated = await venuesService.updateContract(editingId, payload);
        setContracts(prev => prev.map(c => c.id === editingId ? updated : c));
        if (selected?.id === editingId) setSelected(updated);
        toast.success('Contrato actualizado');
      }
      setModal(null);
    } catch (e: any) {
      toast.error(e.message ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c: Contract, ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (!window.confirm(`¿Eliminar contrato ${c.contractNumber}? Esta acción no se puede deshacer.`)) return;
    try {
      await venuesService.deleteContract(c.id);
      setContracts(prev => prev.filter(x => x.id !== c.id));
      if (selected?.id === c.id) setSelected(null);
      toast.success('Contrato eliminado');
    } catch (e: any) {
      toast.error(e.message ?? 'Error al eliminar');
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', background: C.surfaceAlt,
    border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem',
    outline: 'none', borderRadius: 2, boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Backoffice</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Contratos</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>
              {loading ? 'Cargando...' : `${contracts.length} contratos registrados`}
            </p>
          </div>
          <button onClick={openCreate}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Plus style={{ width: 14, height: 14 }} /> Nuevo Contrato
          </button>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px' }}>
        {/* KPI strip */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          {[
            { label: 'Total', value: contracts.length, color: C.primary },
            { label: 'Vigentes', value: contracts.filter(c => c.status === 'activo' || c.status === 'vigente' || c.status === 'firmado').length, color: '#4b7a30' },
            { label: 'Borradores', value: contracts.filter(c => c.status === 'borrador').length, color: C.subtle },
            { label: 'Finalizados', value: contracts.filter(c => c.status === 'finalizado' || c.status === 'cancelado').length, color: C.muted },
          ].map(k => (
            <div key={k.label} style={{ flex: 1, padding: '12px 16px', background: C.surface, border: `1px solid ${C.border}`, borderTop: `2px solid ${k.color}` }}>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
              <p style={{ fontSize: '0.65rem', color: C.subtle, marginTop: 4 }}>{k.label}</p>
            </div>
          ))}
        </motion.div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: 400 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por número, cliente o escenario..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <p style={{ fontSize: '0.72rem', color: C.subtle, alignSelf: 'center' }}>{filtered.length} resultado(s)</p>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '40px 0', color: C.subtle, fontSize: '0.85rem' }}>Cargando contratos...</div>}

        {!loading && (
          <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}` }}>
              <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
                {['Contrato / Cliente', 'Escenario', 'Inicio', 'Valor', 'Estado', ''].map((h, i) => (
                  <span key={i} style={{ flex: i === 0 ? 2 : 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
                ))}
              </div>

              {filtered.length === 0 && (
                <div style={{ padding: '32px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>No se encontraron contratos.</div>
              )}

              {filtered.map((c, i, arr) => {
                const ss = statusStyle[c.status] ?? statusStyle.borrador;
                return (
                  <div key={c.id}>
                    <div style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', cursor: 'pointer', transition: 'background 0.15s', background: selected?.id === c.id ? C.tint : 'transparent', borderLeft: selected?.id === c.id ? `3px solid ${C.gold}` : '3px solid transparent' }}
                      onClick={() => setSelected(selected?.id === c.id ? null : c)}
                      onMouseEnter={e => { if (selected?.id !== c.id) (e.currentTarget as HTMLDivElement).style.background = C.tint; }}
                      onMouseLeave={e => { if (selected?.id !== c.id) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                      <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <FileText style={{ width: 11, height: 11, color: C.gold }} />
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.8rem' }}>{c.contractNumber}</p>
                          <p style={{ fontSize: '0.7rem', color: C.muted }}>{c.clientName ?? '—'}</p>
                        </div>
                      </div>
                      <div style={{ flex: 1 }}><p style={{ fontSize: '0.75rem', color: C.muted }}>{c.venueName ?? '—'}</p></div>
                      <div style={{ flex: 1 }}><p style={{ fontSize: '0.75rem', color: C.muted }}>{c.startDate ?? '—'}</p></div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text }}>
                          {typeof c.totalAmount === 'number'
                            ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(c.totalAmount)
                            : '—'}
                        </p>
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: ss.color, border: `1px solid ${ss.color}44`, padding: '2px 6px', borderRadius: 2 }}>{ss.label}</span>
                      </div>
                      <div style={{ flex: 1, display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                        <button onClick={ev => openEdit(c, ev)}
                          style={{ padding: '5px 8px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.7rem', cursor: 'pointer', borderRadius: 2 }}>
                          <Pencil style={{ width: 11, height: 11 }} />
                        </button>
                        <button onClick={() => downloadContractPDF(c)}
                          style={{ padding: '5px 8px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.7rem', cursor: 'pointer', borderRadius: 2 }}>
                          <Download style={{ width: 11, height: 11 }} />
                        </button>
                        <button onClick={ev => handleDelete(c, ev)}
                          style={{ padding: '5px 8px', background: 'transparent', border: `1px solid ${C.active}33`, color: C.active, fontSize: '0.7rem', cursor: 'pointer', borderRadius: 2 }}>
                          <Trash2 style={{ width: 11, height: 11 }} />
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
                  style={{ width: 280, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}` }}>
                  <div style={{ padding: '12px 16px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
                      <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text }}>DETALLE</span>
                    </div>
                    <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                      <X style={{ width: 14, height: 14, color: C.subtle }} />
                    </button>
                  </div>
                  <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {[
                      { label: 'Número',    value: selected.contractNumber },
                      { label: 'Cliente',   value: selected.clientName },
                      { label: 'Documento', value: selected.clientDocument },
                      { label: 'Escenario', value: selected.venueName },
                      { label: 'Inicio',    value: selected.startDate },
                      { label: 'Fin',       value: selected.endDate },
                      { label: 'Valor',     value: typeof selected.totalAmount === 'number' ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(selected.totalAmount) : '—' },
                    ].map(item => (
                      <div key={item.label}>
                        <p style={{ fontSize: '0.65rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text, marginTop: 1 }}>{item.value ?? '—'}</p>
                      </div>
                    ))}
                    <div style={{ display: 'flex', gap: 6, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                      <button onClick={e => openEdit(selected, e)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', background: C.primary, color: '#fff', fontSize: '0.72rem', fontWeight: 600, border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                        <Pencil style={{ width: 12, height: 12 }} /> Editar
                      </button>
                      <button onClick={() => downloadContractPDF(selected)}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '8px', background: 'transparent', color: C.muted, fontSize: '0.72rem', fontWeight: 600, border: `1px solid ${C.border}`, cursor: 'pointer', borderRadius: 2 }}>
                        <Download style={{ width: 12, height: 12 }} /> PDF
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modal Crear / Editar */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setModal(null)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, width: '100%', maxWidth: 520, maxHeight: '85vh', overflow: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: C.surface, zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>
                    {modal === 'create' ? 'NUEVO CONTRATO' : 'EDITAR CONTRATO'}
                  </span>
                </div>
                <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Nombre del cliente *</label>
                    <input value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))}
                      placeholder="Organización o persona" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Documento</label>
                    <input value={form.clientDocument} onChange={e => setForm(p => ({ ...p, clientDocument: e.target.value }))}
                      placeholder="NIT / CC" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Escenario *</label>
                  <input value={form.venueName} onChange={e => setForm(p => ({ ...p, venueName: e.target.value }))}
                    placeholder="Nombre del escenario" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Fecha inicio</label>
                    <input type="date" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Fecha fin</label>
                    <input type="date" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Valor total (COP)</label>
                    <input type="number" min="0" value={form.totalAmount} onChange={e => setForm(p => ({ ...p, totalAmount: e.target.value }))}
                      placeholder="0" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Estado</label>
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                      {STATUSES.map(s => <option key={s} value={s}>{statusStyle[s]?.label ?? s}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button onClick={() => setModal(null)}
                    style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', cursor: 'pointer', borderRadius: 2 }}>
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: saving ? C.border : C.primary, color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saving ? 'Guardando...' : modal === 'create' ? 'Crear Contrato' : 'Guardar Cambios'}
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
