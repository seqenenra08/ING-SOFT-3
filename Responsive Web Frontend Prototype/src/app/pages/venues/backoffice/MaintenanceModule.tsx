import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Wrench, AlertTriangle, CheckCircle, Clock, Plus, X, Save, Search } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';
import { venuesService } from '../../../services/venuesService';
import type { MaintenanceTicket } from '../../../data/venuesData';

const statusStyle: Record<string, { label: string; color: string; icon: any }> = {
  abierto:     { label: 'Abierto',     color: C.active,  icon: AlertTriangle },
  en_proceso:  { label: 'En proceso',  color: C.gold,    icon: Clock         },
  en_progreso: { label: 'En proceso',  color: C.gold,    icon: Clock         },
  cerrado:     { label: 'Cerrado',     color: '#4b7a30', icon: CheckCircle   },
  resuelto:    { label: 'Resuelto',    color: '#4b7a30', icon: CheckCircle   },
};

const priorityColor: Record<string, string> = {
  critica: '#dc2626', alta: C.active, media: C.gold, normal: C.gold, baja: C.muted,
};
const priorityLabel: Record<string, string> = {
  critica: 'Crítica', alta: 'Alta', media: 'Media', normal: 'Normal', baja: 'Baja',
};

const EMPTY_FORM = {
  venueId: '', venueName: '', type: 'correctivo' as 'preventivo'|'correctivo',
  priority: 'media' as 'baja'|'media'|'alta'|'critica',
  title: '', description: '', reportedBy: '', assignedTo: '',
};
const EMPTY_RESOLVE = { notes: '', cost: '' };

export function MaintenanceModule() {
  const [tickets, setTickets]         = useState<MaintenanceTicket[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');
  const [selected, setSelected]       = useState<MaintenanceTicket | null>(null);
  const [showCreate, setShowCreate]   = useState(false);
  const [showResolve, setShowResolve] = useState(false);
  const [form, setForm]               = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [resolveForm, setResolveForm] = useState<typeof EMPTY_RESOLVE>(EMPTY_RESOLVE);
  const [saving, setSaving]           = useState(false);

  useEffect(() => {
    venuesService.getMaintenanceTickets()
      .then(setTickets)
      .catch(() => toast.error('Error al cargar tickets'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = tickets.filter(t => {
    const matchFilter = filter === 'all' || t.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || (t.title ?? (t as any).issue ?? '').toLowerCase().includes(q) ||
      (t.venueName ?? '').toLowerCase().includes(q) ||
      ((t as any).ref ?? t.ticketNumber ?? '').toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const handleCreate = async () => {
    if (!form.title || !form.reportedBy) { toast.error('Título y reportado por son obligatorios'); return; }
    setSaving(true);
    try {
      const created = await venuesService.createTicket({
        venueId:     form.venueId || 'manual',
        venueName:   form.venueName || 'Sin especificar',
        type:        form.type,
        priority:    form.priority,
        title:       form.title,
        description: form.description,
        reportedBy:  form.reportedBy,
        assignedTo:  form.assignedTo || undefined,
      } as any);
      setTickets(prev => [...prev, created]);
      setShowCreate(false);
      setForm(EMPTY_FORM);
      toast.success('Ticket de mantenimiento creado');
    } catch (e: any) {
      toast.error(e.message ?? 'Error al crear ticket');
    } finally {
      setSaving(false);
    }
  };

  const handleResolve = async () => {
    if (!selected || !resolveForm.notes.trim()) { toast.error('Ingresa las notas de resolución'); return; }
    setSaving(true);
    try {
      const updated = await venuesService.resolveTicket(
        selected.id,
        resolveForm.notes,
        resolveForm.cost ? Number(resolveForm.cost) : undefined,
      );
      setTickets(prev => prev.map(t => t.id === selected.id ? updated : t));
      setSelected(updated);
      setShowResolve(false);
      setResolveForm(EMPTY_RESOLVE);
      toast.success('Ticket resuelto');
    } catch (e: any) {
      toast.error(e.message ?? 'Error al resolver ticket');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', background: C.surfaceAlt,
    border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem',
    outline: 'none', borderRadius: 2, boxSizing: 'border-box',
  };

  const openTickets = tickets.filter(t => t.status !== 'cerrado' && t.status !== 'resuelto').length;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.active }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Backoffice</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mantenimiento de Escenarios</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{openTickets} tickets abiertos</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Plus style={{ width: 14, height: 14 }} /> Nuevo Ticket
          </button>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {[
          { label: 'Abiertos',   value: tickets.filter(t => t.status === 'abierto').length,                        color: C.active  },
          { label: 'En proceso', value: tickets.filter(t => t.status === 'en_proceso' || t.status === 'en_progreso').length, color: C.gold },
          { label: 'Cerrados',   value: tickets.filter(t => t.status === 'cerrado' || t.status === 'resuelto').length, color: '#4b7a30' },
          { label: 'Total',      value: tickets.length,                                                             color: C.muted   },
        ].map((k, i) => (
          <div key={k.label} style={{ flex: 1, padding: '16px 24px', borderRight: i < 3 ? `1px solid ${C.border}` : 'none' }}>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
            <p style={{ fontSize: '0.68rem', color: C.muted, marginTop: 3 }}>{k.label}</p>
            <div style={{ height: 2, background: k.color, marginTop: 8, width: 24, borderRadius: 1 }} />
          </div>
        ))}
      </motion.div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 40px' }}>
        {/* Search + Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 360 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar ticket, escenario..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[['all', 'Todos'], ['abierto', 'Abiertos'], ['en_proceso', 'En proceso'], ['cerrado', 'Cerrados']].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)} style={{
                padding: '6px 14px', background: filter === v ? C.primary : C.surface,
                color: filter === v ? '#fff' : C.muted, border: `1px solid ${filter === v ? C.primary : C.border}`,
                fontSize: '0.75rem', fontWeight: filter === v ? 600 : 400, cursor: 'pointer', borderRadius: 2,
              }}>{l}</button>
            ))}
          </div>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '40px', color: C.subtle }}>Cargando tickets...</div>}

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
              {['Ticket / Escenario', 'Problema', 'Técnico', 'Prioridad', 'Estado'].map((h, i) => (
                <span key={i} style={{ flex: i < 2 ? 2 : 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {!loading && filtered.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>No hay tickets en esta categoría.</div>
            )}

            {filtered.map((t: any, i, arr) => {
              const ss = statusStyle[t.status] ?? statusStyle.abierto;
              const Icon = ss.icon;
              const prio = t.priority ?? t.prioridad ?? 'media';
              return (
                <div key={t.id}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '14px 20px', cursor: 'pointer', transition: 'background 0.15s', borderLeft: selected?.id === t.id ? `3px solid ${C.primary}` : `3px solid ${ss.color}44`, background: selected?.id === t.id ? C.tint : 'transparent' }}
                    onClick={() => setSelected(selected?.id === t.id ? null : t)}
                    onMouseEnter={e => { if (selected?.id !== t.id) (e.currentTarget as HTMLDivElement).style.background = C.tint; }}
                    onMouseLeave={e => { if (selected?.id !== t.id) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}>
                    <div style={{ flex: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Wrench style={{ width: 11, height: 11, color: C.primary }} />
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.8rem' }}>{t.ticketNumber ?? t.ref ?? t.id}</p>
                          <p style={{ fontSize: '0.7rem', color: C.muted }}>{t.venueName ?? t.venue}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{ flex: 2 }}><p style={{ fontSize: '0.72rem', color: C.muted }}>{t.title ?? t.issue}</p></div>
                    <div style={{ flex: 1 }}><p style={{ fontSize: '0.72rem', color: C.muted }}>{t.assignedTo ?? t.tech ?? 'Sin asignar'}</p></div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: priorityColor[prio] ?? C.muted, border: `1px solid ${priorityColor[prio] ?? C.muted}44`, padding: '2px 6px', borderRadius: 2 }}>
                        {priorityLabel[prio] ?? prio}
                      </span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Icon style={{ width: 12, height: 12, color: ss.color }} />
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: ss.color }}>{ss.label}</span>
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
                    <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text }}>DETALLE TICKET</span>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <X style={{ width: 14, height: 14, color: C.subtle }} />
                  </button>
                </div>
                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {([
                    { label: 'Ticket',      value: (selected as any).ticketNumber ?? (selected as any).ref ?? selected.id },
                    { label: 'Escenario',   value: selected.venueName ?? (selected as any).venue },
                    { label: 'Problema',    value: selected.title ?? (selected as any).issue },
                    { label: 'Tipo',        value: selected.type ?? '—' },
                    { label: 'Prioridad',   value: priorityLabel[selected.priority ?? (selected as any).prioridad] ?? selected.priority },
                    { label: 'Técnico',     value: selected.assignedTo ?? (selected as any).tech ?? 'Sin asignar' },
                    { label: 'Estado',      value: statusStyle[selected.status]?.label ?? selected.status },
                    { label: 'Reportado',   value: selected.reportedBy ?? '—' },
                  ] as { label: string; value: any }[]).map(item => (
                    <div key={item.label}>
                      <p style={{ fontSize: '0.62rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
                      <p style={{ fontSize: '0.78rem', fontWeight: 600, color: C.text, marginTop: 1 }}>{item.value}</p>
                    </div>
                  ))}

                  {selected.description && (
                    <div>
                      <p style={{ fontSize: '0.62rem', color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Descripción</p>
                      <p style={{ fontSize: '0.72rem', color: C.muted, marginTop: 1, lineHeight: 1.4 }}>{selected.description}</p>
                    </div>
                  )}

                  {selected.resolutionNotes && (
                    <div style={{ padding: '8px 12px', background: '#22c55e10', border: '1px solid #22c55e33', borderRadius: 2 }}>
                      <p style={{ fontSize: '0.62rem', color: '#22c55e', fontWeight: 600 }}>Resolución</p>
                      <p style={{ fontSize: '0.72rem', color: C.muted, marginTop: 2 }}>{selected.resolutionNotes}</p>
                      {selected.cost && <p style={{ fontSize: '0.72rem', color: C.text, marginTop: 2, fontWeight: 600 }}>Costo: {new Intl.NumberFormat('es-CO',{style:'currency',currency:'COP',minimumFractionDigits:0}).format(selected.cost)}</p>}
                    </div>
                  )}

                  {selected.status !== 'cerrado' && selected.status !== 'resuelto' && (
                    <button onClick={() => setShowResolve(true)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', background: '#22c55e', color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', borderRadius: 2, marginTop: 4 }}>
                      <CheckCircle style={{ width: 13, height: 13 }} /> Resolver Ticket
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal: Nuevo Ticket */}
      <AnimatePresence>
        {showCreate && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setShowCreate(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, width: '100%', maxWidth: 500, maxHeight: '85vh', overflow: 'auto' }}
              onClick={e => e.stopPropagation()}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>NUEVO TICKET DE MANTENIMIENTO</span>
                </div>
                <button onClick={() => setShowCreate(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Título del problema *</label>
                  <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Ej: Sistema de iluminación – falla en zona A" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Escenario</label>
                  <input value={form.venueName} onChange={e => setForm(p => ({ ...p, venueName: e.target.value }))}
                    placeholder="Nombre del escenario" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Tipo</label>
                    <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))} style={inputStyle}>
                      <option value="correctivo">Correctivo</option>
                      <option value="preventivo">Preventivo</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Prioridad</label>
                    <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value as any }))} style={inputStyle}>
                      <option value="baja">Baja</option>
                      <option value="media">Media</option>
                      <option value="alta">Alta</option>
                      <option value="critica">Crítica</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Descripción detallada</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                    placeholder="Describe el problema con detalle..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Reportado por *</label>
                    <input value={form.reportedBy} onChange={e => setForm(p => ({ ...p, reportedBy: e.target.value }))}
                      placeholder="Nombre del reportante" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Asignado a</label>
                    <input value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))}
                      placeholder="Técnico responsable" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button onClick={() => setShowCreate(false)}
                    style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', cursor: 'pointer', borderRadius: 2 }}>
                    Cancelar
                  </button>
                  <button onClick={handleCreate} disabled={saving}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: saving ? C.border : C.primary, color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saving ? 'Guardando...' : 'Crear Ticket'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal: Resolver Ticket */}
      <AnimatePresence>
        {showResolve && selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setShowResolve(false)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, width: '100%', maxWidth: 420 }}
              onClick={e => e.stopPropagation()}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: '#22c55e', borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>RESOLVER TICKET</span>
                </div>
                <button onClick={() => setShowResolve(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Notas de resolución *</label>
                  <textarea value={resolveForm.notes} onChange={e => setResolveForm(p => ({ ...p, notes: e.target.value }))} rows={4}
                    placeholder="Describe cómo se resolvió el problema..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = '#22c55e'} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Costo (COP)</label>
                  <input type="number" min="0" value={resolveForm.cost} onChange={e => setResolveForm(p => ({ ...p, cost: e.target.value }))}
                    placeholder="0" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => setShowResolve(false)}
                    style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', cursor: 'pointer', borderRadius: 2 }}>
                    Cancelar
                  </button>
                  <button onClick={handleResolve} disabled={saving}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: saving ? C.border : '#22c55e', color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
                    <CheckCircle style={{ width: 14, height: 14 }} />
                    {saving ? 'Guardando...' : 'Marcar como Resuelto'}
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
