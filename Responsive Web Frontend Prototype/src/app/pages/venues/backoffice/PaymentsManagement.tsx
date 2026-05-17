import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, DollarSign, CheckCircle, Clock, AlertTriangle, Plus, X, Save } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';
import { venuesService } from '../../../services/venuesService';
import type { Payment } from '../../../data/venuesData';

const statusStyle: Record<string, { label: string; color: string; icon: any }> = {
  completado: { label: 'Completado', color: '#4b7a30', icon: CheckCircle   },
  parcial:    { label: 'Parcial',    color: C.gold,    icon: Clock         },
  pendiente:  { label: 'Pendiente',  color: C.active,  icon: AlertTriangle },
};

const METHODS = ['efectivo', 'transferencia', 'tarjeta', 'cheque'] as const;
const EMPTY_FORM = {
  contractId: '', contractNumber: '', clientName: '',
  amount: '', paymentMethod: 'transferencia' as typeof METHODS[number],
  paymentDate: new Date().toISOString().split('T')[0],
  receiptNumber: '', notes: '', status: 'completado' as 'pendiente'|'parcial'|'completado',
};

export function PaymentsManagement() {
  const [payments, setPayments]   = useState<Payment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    venuesService.getPayments()
      .then(setPayments)
      .catch(() => toast.error('Error al cargar pagos'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter((p: any) =>
    (p.paymentNumber ?? p.ref ?? p.id)?.toLowerCase().includes(search.toLowerCase()) ||
    (p.clientName ?? p.client ?? '')?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCompletado = payments.filter(p => p.status === 'completado').reduce((s, p) => s + (p.amount ?? 0), 0);
  const totalPendiente  = payments.filter(p => p.status === 'pendiente').reduce((s, p) => s + (p.amount ?? 0), 0);
  const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  const handleSave = async () => {
    if (!form.clientName || !form.amount) { toast.error('Cliente y monto son obligatorios'); return; }
    setSaving(true);
    try {
      const payload: any = {
        contractId:    form.contractId || 'manual',
        contractNumber:form.contractNumber || 'MANUAL',
        clientName:    form.clientName,
        amount:        Number(form.amount),
        paymentMethod: form.paymentMethod,
        paymentDate:   form.paymentDate,
        receiptNumber: form.receiptNumber,
        notes:         form.notes,
        status:        form.status,
        registeredBy:  'backoffice',
      };
      const created = await venuesService.registerPayment(payload);
      setPayments(prev => [...prev, created]);
      setShowModal(false);
      setForm(EMPTY_FORM);
      toast.success('Pago registrado exitosamente');
    } catch (e: any) {
      toast.error(e.message ?? 'Error al registrar pago');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', background: C.surfaceAlt,
    border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem',
    outline: 'none', borderRadius: 2, boxSizing: 'border-box',
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Backoffice</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Pagos</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{payments.length} registros de pago</p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Plus style={{ width: 14, height: 14 }} /> Registrar Pago
          </button>
        </motion.div>
      </div>

      {/* KPI */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {[
          { label: 'Total completado', value: fmt(totalCompletado), color: '#4b7a30' },
          { label: 'Pendiente',        value: fmt(totalPendiente),  color: C.active  },
          { label: 'Registros',        value: String(payments.length), color: C.primary },
        ].map((k, i) => (
          <div key={k.label} style={{ flex: 1, padding: '16px 24px', borderRight: i < 2 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.2rem', fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
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

        {loading && <div style={{ textAlign: 'center', padding: '40px', color: C.subtle }}>Cargando pagos...</div>}

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
            {['Referencia / Cliente', 'Monto', 'Método', 'Fecha', 'Estado'].map((h, i) => (
              <span key={i} style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
            ))}
          </div>

          {!loading && filtered.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>No hay pagos registrados.</div>
          )}

          {filtered.map((p: any, i, arr) => {
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
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.8rem' }}>{p.paymentNumber ?? p.ref ?? p.id}</p>
                        <p style={{ fontSize: '0.7rem', color: C.muted }}>{p.clientName ?? p.client}</p>
                      </div>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.8rem', color: C.text }}>
                      {typeof p.amount === 'number' ? fmt(p.amount) : (p.amount ?? '—')}
                    </p>
                  </div>
                  <div style={{ flex: 1 }}><p style={{ fontSize: '0.75rem', color: C.muted }}>{p.paymentMethod ?? p.method ?? '—'}</p></div>
                  <div style={{ flex: 1 }}><p style={{ fontSize: '0.75rem', color: C.muted }}>{p.paymentDate ?? p.date ?? '—'}</p></div>
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

      {/* Modal: Registrar Pago */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, width: '100%', maxWidth: 500, maxHeight: '85vh', overflow: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>REGISTRAR PAGO</span>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

                {[
                  { key: 'clientName',     label: 'Nombre del cliente *', placeholder: 'Nombre completo o razón social' },
                  { key: 'contractNumber', label: 'N° Contrato',          placeholder: 'CTR-2026-XXX (opcional)' },
                  { key: 'amount',         label: 'Monto (COP) *',        placeholder: '2800000', type: 'number' },
                  { key: 'paymentDate',    label: 'Fecha de pago',        placeholder: '', type: 'date' },
                  { key: 'receiptNumber',  label: 'N° Recibo/Factura',    placeholder: 'REC-001' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>{f.label}</label>
                    <input
                      type={f.type ?? 'text'}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Método de pago</label>
                    <select value={form.paymentMethod} onChange={e => setForm(p => ({ ...p, paymentMethod: e.target.value as any }))} style={inputStyle}>
                      {METHODS.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Estado</label>
                    <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as any }))} style={inputStyle}>
                      <option value="completado">Completado</option>
                      <option value="parcial">Parcial</option>
                      <option value="pendiente">Pendiente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Notas</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={2}
                    placeholder="Observaciones adicionales..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = C.primary}
                    onBlur={e => e.target.style.borderColor = C.border} />
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button onClick={() => setShowModal(false)}
                    style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', cursor: 'pointer', borderRadius: 2 }}>
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: saving ? C.border : C.primary, color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saving ? 'Guardando...' : 'Registrar Pago'}
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
