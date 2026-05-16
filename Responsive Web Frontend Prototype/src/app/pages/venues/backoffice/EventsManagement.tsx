import { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Search, Filter, CheckCircle2, PlayCircle, XCircle, AlertCircle, ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';
import { events } from '../../../data/venuesData';

type EventStatus = 'programado' | 'en_curso' | 'finalizado' | 'cancelado';

const statusCfg: Record<EventStatus, { label: string; color: string; bg: string; icon: any }> = {
  programado: { label: 'Programado', color: C.primary,  bg: `${C.primary}15`,  icon: Calendar     },
  en_curso:   { label: 'En curso',   color: C.gold,     bg: `${C.gold}15`,     icon: PlayCircle   },
  finalizado: { label: 'Finalizado', color: '#4b7a30',  bg: '#4b7a3015',       icon: CheckCircle2 },
  cancelado:  { label: 'Cancelado',  color: C.active,   bg: `${C.active}15`,   icon: XCircle      },
};

export function EventsManagement() {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState<EventStatus | 'all'>('all');
  const [selected, setSelected] = useState<any>(null);

  const filtered = events.filter(e => {
    const matchSearch = e.eventName.toLowerCase().includes(search.toLowerCase()) ||
      e.venueName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filter === 'all' || e.status === filter;
    return matchSearch && matchStatus;
  });

  const fmt = (date: string) => {
    const d = new Date(date + 'T00:00:00');
    return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const counts: Record<string, number> = {
    all:        events.length,
    programado: events.filter(e => e.status === 'programado').length,
    en_curso:   events.filter(e => e.status === 'en_curso').length,
    finalizado: events.filter(e => e.status === 'finalizado').length,
    cancelado:  events.filter(e => e.status === 'cancelado').length,
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
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{events.length} eventos registrados</p>
          </div>
          <button onClick={() => toast.info('Registro de evento disponible con backend conectado')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Calendar style={{ width: 14, height: 14 }} /> Nuevo Evento
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
              onClick={() => setFilter(key as EventStatus | 'all')}>
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
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre de evento o escenario..."
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
              {(Object.entries(statusCfg) as [EventStatus, typeof statusCfg[EventStatus]][]).map(([k, v]) => (
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
            {/* Table header */}
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', gap: 8 }}>
              {['Evento', 'Escenario', 'Fecha', 'Horario', 'Estado', 'Entrega/Devolución', ''].map((h, i) => (
                <span key={i} style={{ flex: [2,2,1,1,1,1,0.5][i], fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: i >= 4 ? 'center' : 'left' }}>{h}</span>
              ))}
            </div>

            {filtered.length === 0 && (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 20px', cursor: 'pointer', background: isSelected ? C.tint : 'transparent', transition: 'background 0.15s' }}
                    onClick={() => setSelected(isSelected ? null : e)}>
                    {/* Event */}
                    <div style={{ flex: 2 }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{e.eventName}</p>
                      <p style={{ fontSize: '0.68rem', color: C.subtle }}>#{e.requestId}</p>
                    </div>
                    {/* Venue */}
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin style={{ width: 11, height: 11, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.75rem', color: C.muted }}>{e.venueName}</p>
                    </div>
                    {/* Date */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar style={{ width: 11, height: 11, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.72rem', color: C.muted }}>{fmt(e.eventDate)}</p>
                    </div>
                    {/* Time */}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Clock style={{ width: 11, height: 11, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.72rem', color: C.muted }}>{e.startTime} – {e.endTime}</p>
                    </div>
                    {/* Status */}
                    <div style={{ flex: 1, textAlign: 'center' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 9px', background: cfg?.bg, border: `1px solid ${cfg?.color}33`, fontSize: '0.67rem', fontWeight: 600, color: cfg?.color }}>
                        <StatusIcon style={{ width: 10, height: 10 }} />
                        {cfg?.label ?? e.status}
                      </span>
                    </div>
                    {/* Handover/return */}
                    <div style={{ flex: 1, display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <span title="Entrega" style={{ padding: '3px 8px', background: e.handoverCompleted ? '#22c55e18' : C.tint, border: `1px solid ${e.handoverCompleted ? '#22c55e33' : C.border}`, fontSize: '0.6rem', color: e.handoverCompleted ? '#22c55e' : C.subtle }}>
                        Ent: {e.handoverCompleted ? '✓' : '—'}
                      </span>
                      <span title="Devolución" style={{ padding: '3px 8px', background: e.returnCompleted ? '#22c55e18' : C.tint, border: `1px solid ${e.returnCompleted ? '#22c55e33' : C.border}`, fontSize: '0.6rem', color: e.returnCompleted ? '#22c55e' : C.subtle }}>
                        Dev: {e.returnCompleted ? '✓' : '—'}
                      </span>
                    </div>
                    {/* Actions */}
                    <div style={{ flex: 0.5, display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={ev => { ev.stopPropagation(); setSelected(isSelected ? null : e); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                        <ClipboardList style={{ width: 11, height: 11 }} />
                      </button>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: C.border, margin: '0 20px' }} />}
                </div>
              );
            })}
          </motion.div>

          {/* Detail panel */}
          {selected && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
              style={{ width: 280, flexShrink: 0, background: '#fff', border: `1px solid ${C.border}` }}>
              <div style={{ padding: '14px 16px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text }}>DETALLE DEL EVENTO</span>
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
                        { label: 'Escenario',    value: selected.venueName },
                        { label: 'Fecha',        value: fmt(selected.eventDate) },
                        { label: 'Horario',      value: `${selected.startTime} – ${selected.endTime}` },
                        { label: 'Solicitud',    value: `#${selected.requestId}` },
                        { label: 'Contrato',     value: `#${selected.contractId}` },
                      ].map(row => (
                        <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: `1px solid ${C.border}` }}>
                          <span style={{ fontSize: '0.72rem', color: C.subtle }}>{row.label}</span>
                          <span style={{ fontSize: '0.75rem', color: C.text, fontWeight: 600 }}>{row.value}</span>
                        </div>
                      ))}

                      {/* Handover section */}
                      <div style={{ marginTop: 14 }}>
                        <p style={{ fontSize: '0.65rem', fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Entrega / Devolución</p>
                        {[
                          { label: 'Entrega completada', done: selected.handoverCompleted, date: selected.handoverDate, notes: selected.handoverNotes },
                          { label: 'Devolución completada', done: selected.returnCompleted, date: selected.returnDate, notes: selected.returnNotes },
                        ].map(row => (
                          <div key={row.label} style={{ marginBottom: 8, padding: '8px 10px', background: row.done ? '#22c55e18' : C.tint, border: `1px solid ${row.done ? '#22c55e33' : C.border}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: row.done ? 4 : 0 }}>
                              <div style={{ width: 14, height: 14, borderRadius: '50%', background: row.done ? '#22c55e' : C.border, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {row.done && <span style={{ color: '#fff', fontSize: '0.55rem', fontWeight: 700 }}>✓</span>}
                              </div>
                              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: row.done ? '#4b7a30' : C.muted }}>{row.label}</span>
                            </div>
                            {row.done && row.date && <p style={{ fontSize: '0.68rem', color: C.subtle, marginLeft: 20 }}>{fmt(row.date)}</p>}
                            {row.done && row.notes && <p style={{ fontSize: '0.68rem', color: C.muted, marginLeft: 20, marginTop: 2 }}>{row.notes}</p>}
                          </div>
                        ))}
                      </div>

                      {selected.incidents && selected.incidents.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <p style={{ fontSize: '0.65rem', fontWeight: 600, color: C.active, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>⚠ Incidencias</p>
                          {selected.incidents.map((inc: string, i: number) => (
                            <p key={i} style={{ fontSize: '0.72rem', color: C.muted, padding: '4px 8px', background: `${C.active}10`, border: `1px solid ${C.active}20`, marginBottom: 4 }}>• {inc}</p>
                          ))}
                        </div>
                      )}

                      <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <button onClick={() => toast.info('Registro de entrega/devolución disponible con backend')}
                          style={{ padding: '8px 12px', background: C.primary, color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
                          Registrar Entrega/Dev.
                        </button>
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
        </div>
      </div>
    </div>
  );
}
