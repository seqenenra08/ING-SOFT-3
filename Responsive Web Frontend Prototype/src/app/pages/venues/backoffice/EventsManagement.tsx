import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, Search, Filter, CheckCircle2, PlayCircle, XCircle, AlertCircle, ClipboardList, Plus, X, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';
import { venuesService } from '../../../services/venuesService';
import type { Event, Venue } from '../../../data/venuesData';

type EventStatus = 'programado' | 'en_curso' | 'finalizado' | 'cancelado';

const statusCfg: Record<EventStatus, { label: string; color: string; bg: string; icon: any }> = {
  programado: { label: 'Programado', color: C.primary, bg: `${C.primary}15`, icon: Calendar     },
  en_curso:   { label: 'En curso',   color: C.gold,    bg: `${C.gold}15`,    icon: PlayCircle   },
  finalizado: { label: 'Finalizado', color: '#4b7a30', bg: '#4b7a3015',      icon: CheckCircle2 },
  cancelado:  { label: 'Cancelado',  color: C.active,  bg: `${C.active}15`,  icon: XCircle      },
};

const EMPTY_FORM = { venueId: '', venueName: '', eventName: '', eventDate: '', startTime: '08:00', endTime: '18:00', status: 'programado' };

export function EventsManagement() {
  const [events, setEvents]         = useState<Event[]>([]);
  const [venues, setVenues]         = useState<Venue[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState<EventStatus | 'all'>('all');
  const [selected, setSelected]     = useState<Event | null>(null);
  const [modal, setModal]           = useState<null | 'create' | 'handover' | 'return'>(null);
  const [form, setForm]             = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [actionNotes, setActionNotes] = useState('');
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    Promise.all([
      venuesService.getEvents(),
      venuesService.getVenues(),
    ])
      .then(([e, v]) => { setEvents(e); setVenues(v); })
      .catch(() => toast.error('Error al cargar datos'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e: any) => {
    const matchSearch = (e.eventName ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (e.venueName ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || e.status === filter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all:        events.length,
    programado: events.filter((e: any) => e.status === 'programado').length,
    en_curso:   events.filter((e: any) => e.status === 'en_curso').length,
    finalizado: events.filter((e: any) => e.status === 'finalizado').length,
    cancelado:  events.filter((e: any) => e.status === 'cancelado').length,
  };

  const fmt = (date: string) => {
    if (!date) return '—';
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const openCreate = () => { setForm(EMPTY_FORM); setModal('create'); };

  const handleCreate = async () => {
    if (!form.eventName) { toast.error('Nombre del evento es obligatorio'); return; }
    if (!form.venueId)   { toast.error('Selecciona un escenario'); return; }
    setSaving(true);
    try {
      const created = await venuesService.createEvent({
        eventName: form.eventName,
        venueName: form.venueName,
        eventDate: form.eventDate,
        startTime: form.startTime,
        endTime:   form.endTime,
        status:    form.status as EventStatus,
      });
      setEvents(prev => [created, ...prev]);
      setModal(null);
      toast.success('Evento creado exitosamente');
    } catch (e: any) {
      toast.error(e.message ?? 'Error al crear evento');
    } finally {
      setSaving(false);
    }
  };

  const handleHandover = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await venuesService.registerHandover(selected.id, actionNotes);
      setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
      setSelected(updated);
      setModal(null);
      setActionNotes('');
      toast.success('Entrega registrada correctamente');
    } catch (e: any) {
      toast.error(e.message ?? 'Error al registrar entrega');
    } finally {
      setSaving(false);
    }
  };

  const handleReturn = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const updated = await venuesService.registerReturn(selected.id, actionNotes);
      setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
      setSelected(updated);
      setModal(null);
      setActionNotes('');
      toast.success('Devolución registrada correctamente');
    } catch (e: any) {
      toast.error(e.message ?? 'Error al registrar devolución');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: Event, ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (!window.confirm(`¿Eliminar el evento "${e.eventName}"?`)) return;
    try {
      await venuesService.deleteEvent(e.id);
      setEvents(prev => prev.filter(x => x.id !== e.id));
      if (selected?.id === e.id) setSelected(null);
      toast.success('Evento eliminado');
    } catch (err: any) {
      toast.error(err.message ?? 'Error al eliminar');
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
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: '1px solid #2a1212', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Backoffice Escenarios</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Control de Eventos</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{loading ? 'Cargando...' : `${events.length} eventos registrados`}</p>
          </div>
          <button onClick={openCreate}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Plus style={{ width: 14, height: 14 }} /> Nuevo Evento
          </button>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {(Object.entries(statusCfg) as [EventStatus, typeof statusCfg[EventStatus]][]).map(([key, cfg], i, arr) => {
          const Icon = cfg.icon;
          return (
            <div key={key} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 22px', borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none', cursor: 'pointer', background: filter === key ? C.tint : 'transparent', transition: 'background 0.15s' }}
              onClick={() => setFilter(filter === key ? 'all' : key)}>
              <div style={{ width: 34, height: 34, background: cfg.bg, border: `1px solid ${cfg.color}30`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon style={{ width: 15, height: 15, color: cfg.color }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.3rem', color: cfg.color, lineHeight: 1 }}>{counts[key]}</p>
                <p style={{ fontSize: '0.63rem', color: C.subtle, marginTop: 3 }}>{cfg.label}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        {/* Filters */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 380 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por evento o escenario..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: '#fff', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter style={{ width: 13, height: 13, color: C.subtle }} />
            <select value={filter} onChange={e => setFilter(e.target.value as EventStatus | 'all')}
              style={{ padding: '8px 12px', background: '#fff', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.8rem', cursor: 'pointer', borderRadius: 2, outline: 'none' }}>
              <option value="all">Todos los estados</option>
              {(Object.entries(statusCfg) as [EventStatus, any][]).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </div>
          <p style={{ fontSize: '0.72rem', color: C.subtle, marginLeft: 4 }}>{filtered.length} evento(s)</p>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Events list */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
            style={{ flex: 1, background: '#fff', border: `1px solid ${C.border}` }}>
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
              {['Evento', 'Escenario', 'Fecha', 'Horario', 'Estado', 'Ent/Dev', ''].map((h, i) => (
                <span key={i} style={{ flex: [2,2,1,1,1,1,0.5][i], fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</span>
              ))}
            </div>

            {loading && <div style={{ padding: '40px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>Cargando eventos...</div>}

            {!loading && filtered.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: C.subtle }}>
                <Calendar style={{ width: 24, height: 24, margin: '0 auto 10px', opacity: 0.3 }} />
                <p style={{ fontSize: '0.82rem' }}>No hay eventos con ese filtro</p>
              </div>
            )}

            {filtered.map((e: any, i: number, arr: any[]) => {
              const cfg = statusCfg[e.status as EventStatus];
              const StatusIcon = cfg?.icon ?? AlertCircle;
              const isSelected = selected?.id === e.id;
              return (
                <div key={e.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 20px', cursor: 'pointer', background: isSelected ? C.tint : 'transparent', transition: 'background 0.15s', borderLeft: isSelected ? `3px solid ${C.primary}` : '3px solid transparent' }}
                    onClick={() => setSelected(isSelected ? null : e)}>
                    <div style={{ flex: 2 }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{e.eventName}</p>
                    </div>
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin style={{ width: 11, height: 11, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.75rem', color: C.muted }}>{e.venueName}</p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar style={{ width: 11, height: 11, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.72rem', color: C.muted }}>{fmt(e.eventDate)}</p>
                    </div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock style={{ width: 11, height: 11, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.72rem', color: C.muted }}>{e.startTime} – {e.endTime}</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: cfg?.bg, border: `1px solid ${cfg?.color}33`, fontSize: '0.67rem', fontWeight: 600, color: cfg?.color }}>
                        <StatusIcon style={{ width: 10, height: 10 }} />
                        {cfg?.label ?? e.status}
                      </span>
                    </div>
                    <div style={{ flex: 1, display: 'flex', gap: 5 }}>
                      <span style={{ padding: '3px 7px', background: e.handoverCompleted ? '#22c55e18' : C.tint, border: `1px solid ${e.handoverCompleted ? '#22c55e33' : C.border}`, fontSize: '0.6rem', color: e.handoverCompleted ? '#22c55e' : C.subtle }}>
                        Ent {e.handoverCompleted ? '✓' : '—'}
                      </span>
                      <span style={{ padding: '3px 7px', background: e.returnCompleted ? '#22c55e18' : C.tint, border: `1px solid ${e.returnCompleted ? '#22c55e33' : C.border}`, fontSize: '0.6rem', color: e.returnCompleted ? '#22c55e' : C.subtle }}>
                        Dev {e.returnCompleted ? '✓' : '—'}
                      </span>
                    </div>
                    <div style={{ flex: 0.5, display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                      <button onClick={ev => { ev.stopPropagation(); setSelected(isSelected ? null : e); }}
                        style={{ padding: '5px 8px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                        <ClipboardList style={{ width: 11, height: 11 }} />
                      </button>
                      <button onClick={ev => handleDelete(e, ev)}
                        style={{ padding: '5px 8px', background: 'transparent', border: `1px solid ${C.active}33`, color: C.active, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                        <Trash2 style={{ width: 11, height: 11 }} />
                      </button>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border, margin: '0 20px' }} />}
                </div>
              );
            })}
          </motion.div>

          {/* Detail panel */}
          <AnimatePresence>
            {selected && (
              <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.25 }}
                style={{ width: 280, flexShrink: 0, background: '#fff', border: `1px solid ${C.border}` }}>
                <div style={{ padding: '14px 16px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text }}>DETALLE DEL EVENTO</span>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X style={{ width: 14, height: 14, color: C.subtle }} />
                  </button>
                </div>
                <div style={{ padding: 16 }}>
                  {(() => {
                    const cfg = statusCfg[selected.status as EventStatus];
                    return (
                      <>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.95rem', color: C.text, marginBottom: 4 }}>{selected.eventName}</p>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: cfg?.bg, border: `1px solid ${cfg?.color}33`, fontSize: '0.67rem', fontWeight: 600, color: cfg?.color, marginBottom: 14 }}>
                          {cfg?.label ?? selected.status}
                        </span>

                        {[
                          { label: 'Escenario', value: selected.venueName },
                          { label: 'Fecha',     value: fmt(selected.eventDate) },
                          { label: 'Horario',   value: `${selected.startTime} – ${selected.endTime}` },
                        ].map(row => (
                          <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ fontSize: '0.72rem', color: C.subtle }}>{row.label}</span>
                            <span style={{ fontSize: '0.75rem', color: C.text, fontWeight: 600 }}>{row.value}</span>
                          </div>
                        ))}

                        {/* Handover/Return status */}
                        <div style={{ marginTop: 14 }}>
                          <p style={{ fontSize: '0.65rem', fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Entrega / Devolución</p>
                          {[
                            { label: 'Entrega', done: selected.handoverCompleted, date: selected.handoverDate, notes: selected.handoverNotes },
                            { label: 'Devolución', done: selected.returnCompleted, date: selected.returnDate, notes: selected.returnNotes },
                          ].map(row => (
                            <div key={row.label} style={{ marginBottom: 8, padding: '8px 10px', background: row.done ? '#22c55e18' : C.tint, border: `1px solid ${row.done ? '#22c55e33' : C.border}` }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 14, height: 14, borderRadius: '50%', background: row.done ? '#22c55e' : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  {row.done && <span style={{ color: '#fff', fontSize: '0.55rem', fontWeight: 700 }}>✓</span>}
                                </div>
                                <span style={{ fontSize: '0.72rem', fontWeight: 600, color: row.done ? '#4b7a30' : C.muted }}>{row.label}</span>
                              </div>
                              {row.done && row.date && <p style={{ fontSize: '0.68rem', color: C.subtle, marginLeft: 20, marginTop: 2 }}>{fmt(row.date)}</p>}
                              {row.done && row.notes && <p style={{ fontSize: '0.68rem', color: C.muted, marginLeft: 20, marginTop: 1 }}>{row.notes}</p>}
                            </div>
                          ))}
                        </div>

                        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                          {!selected.handoverCompleted && (
                            <button onClick={() => { setActionNotes(''); setModal('handover'); }}
                              style={{ padding: '8px 12px', background: C.primary, color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
                              Registrar Entrega
                            </button>
                          )}
                          {selected.handoverCompleted && !selected.returnCompleted && (
                            <button onClick={() => { setActionNotes(''); setModal('return'); }}
                              style={{ padding: '8px 12px', background: C.gold, color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
                              Registrar Devolución
                            </button>
                          )}
                          <button onClick={() => setSelected(null)}
                            style={{ padding: '8px 12px', background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 2 }}>
                            Cerrar
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal: Nuevo Evento */}
      <AnimatePresence>
        {modal === 'create' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setModal(null)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, width: '100%', maxWidth: 480 }}
              onClick={e => e.stopPropagation()}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>NUEVO EVENTO</span>
                </div>
                <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Nombre del evento *</label>
                  <input value={form.eventName} onChange={e => setForm(p => ({ ...p, eventName: e.target.value }))}
                    placeholder="Ej: Festival de Danza 2026" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Escenario *</label>
                  {venues.length === 0 ? (
                    <div style={{ padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, fontSize: '0.78rem', color: C.subtle, borderRadius: 2 }}>
                      No hay escenarios registrados. Crea uno en "Gestión de Escenarios" primero.
                    </div>
                  ) : (
                    <select
                      value={form.venueId}
                      onChange={e => {
                        const v = venues.find(v => v.id === e.target.value);
                        setForm(p => ({ ...p, venueId: e.target.value, venueName: v?.name ?? '' }));
                      }}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      <option value="">— Selecciona un escenario —</option>
                      {venues.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Fecha del evento</label>
                  <input type="date" value={form.eventDate} onChange={e => setForm(p => ({ ...p, eventDate: e.target.value }))}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Hora inicio</label>
                    <input type="time" value={form.startTime} onChange={e => setForm(p => ({ ...p, startTime: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Hora fin</label>
                    <input type="time" value={form.endTime} onChange={e => setForm(p => ({ ...p, endTime: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Estado inicial</label>
                  <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} style={inputStyle}>
                    <option value="programado">Programado</option>
                    <option value="en_curso">En curso</option>
                    <option value="finalizado">Finalizado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button onClick={() => setModal(null)}
                    style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', cursor: 'pointer', borderRadius: 2 }}>
                    Cancelar
                  </button>
                  <button onClick={handleCreate} disabled={saving}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: saving ? C.border : C.primary, color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saving ? 'Guardando...' : 'Crear Evento'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Modal: Registrar Entrega */}
        {(modal === 'handover' || modal === 'return') && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setModal(null)}>
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, width: '100%', maxWidth: 420 }}
              onClick={e => e.stopPropagation()}>
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: modal === 'handover' ? C.primary : C.gold, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>
                    {modal === 'handover' ? 'REGISTRAR ENTREGA' : 'REGISTRAR DEVOLUCIÓN'}
                  </span>
                </div>
                <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>
              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                <p style={{ fontSize: '0.8rem', color: C.muted }}>
                  Evento: <strong style={{ color: C.text }}>{selected?.eventName}</strong>
                </p>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Notas / observaciones</label>
                  <textarea value={actionNotes} onChange={e => setActionNotes(e.target.value)} rows={3}
                    placeholder={modal === 'handover' ? 'Estado del escenario al momento de la entrega...' : 'Estado del escenario al momento de la devolución...'}
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button onClick={() => setModal(null)}
                    style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', cursor: 'pointer', borderRadius: 2 }}>
                    Cancelar
                  </button>
                  <button onClick={modal === 'handover' ? handleHandover : handleReturn} disabled={saving}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: saving ? C.border : (modal === 'handover' ? C.primary : C.gold), color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
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
