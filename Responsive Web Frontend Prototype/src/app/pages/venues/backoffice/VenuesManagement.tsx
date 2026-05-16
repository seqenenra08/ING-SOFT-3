import { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Search, Plus, Check, X, Filter, Edit2, Mic2, Theater, School, Building2, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';
import { venues } from '../../../data/venuesData';

const typeLabel: Record<string, string> = {
  auditorio:      'Auditorio',
  teatro:         'Teatro',
  salon_cultural: 'Salón Cultural',
  sala:           'Sala',
  espacio_abierto:'Espacio Abierto',
};
const typeIcon: Record<string, any> = {
  auditorio:      Mic2,
  teatro:         Theater,
  salon_cultural: School,
  sala:           Building2,
  espacio_abierto: Building2,
};
const typeColor: Record<string, string> = {
  auditorio:       C.primary,
  teatro:          C.gold,
  salon_cultural:  '#4b7a30',
  sala:            '#6b4040',
  espacio_abierto: C.muted,
};

export function VenuesManagement() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAvailable, setFilterAvailable] = useState('all');
  const [selected, setSelected] = useState<any>(null);

  const types = ['all', ...Array.from(new Set(venues.map(v => v.type)))];

  const filtered = venues.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.address.toLowerCase().includes(search.toLowerCase()) ||
      v.neighborhood.toLowerCase().includes(search.toLowerCase());
    const matchType  = filterType === 'all' || v.type === filterType;
    const matchAvail = filterAvailable === 'all' ||
      (filterAvailable === 'available' ? v.available : !v.available);
    return matchSearch && matchType && matchAvail;
  });

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: '1px solid #2a1212', position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Backoffice Escenarios</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Escenarios</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{venues.length} escenarios registrados</p>
          </div>
          <button onClick={() => toast.info('Alta de escenario disponible con backend conectado')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Plus style={{ width: 14, height: 14 }} /> Nuevo Escenario
          </button>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {[
          { label: 'Total escenarios', value: venues.length,                                         color: C.primary, icon: Building2 },
          { label: 'Disponibles',      value: venues.filter(v => v.available).length,                color: '#4b7a30', icon: Check     },
          { label: 'No disponibles',   value: venues.filter(v => !v.available).length,               color: C.active,  icon: X         },
          { label: 'Capacidad total',  value: venues.reduce((a, v) => a + v.capacity, 0) + ' pers.', color: C.gold,    icon: Users     },
        ].map((k, i, arr) => {
          const Icon = k.icon;
          return (
            <div key={k.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 24px', borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width: 36, height: 36, background: `${k.color}15`, border: `1px solid ${k.color}30`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon style={{ width: 16, height: 16, color: k.color }} />
              </div>
              <div>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
                <p style={{ fontSize: '0.65rem', color: C.subtle, marginTop: 3 }}>{k.label}</p>
              </div>
            </div>
          );
        })}
      </motion.div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        {/* Filters row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', maxWidth: 380 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, dirección, barrio..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: '#fff', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter style={{ width: 13, height: 13, color: C.subtle }} />
            <select value={filterType} onChange={e => setFilterType(e.target.value)}
              style={{ padding: '8px 12px', background: '#fff', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.8rem', cursor: 'pointer', borderRadius: 2, outline: 'none' }}>
              <option value="all">Todos los tipos</option>
              {types.filter(t => t !== 'all').map(t => <option key={t} value={t}>{typeLabel[t] ?? t}</option>)}
            </select>
          </div>
          <select value={filterAvailable} onChange={e => setFilterAvailable(e.target.value)}
            style={{ padding: '8px 12px', background: '#fff', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.8rem', cursor: 'pointer', borderRadius: 2, outline: 'none' }}>
            <option value="all">Todos los estados</option>
            <option value="available">Disponibles</option>
            <option value="unavailable">No disponibles</option>
          </select>
          <p style={{ fontSize: '0.72rem', color: C.subtle, marginLeft: 4 }}>{filtered.length} resultado(s)</p>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Grid/table */}
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
            {filtered.map((v, i) => {
              const color = typeColor[v.type] ?? C.primary;
              const Icon  = typeIcon[v.type] ?? Building2;
              return (
                <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}
                  onClick={() => setSelected(selected?.id === v.id ? null : v)}
                  style={{ background: '#fff', border: `1px solid ${selected?.id === v.id ? color : C.border}`, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                  onMouseEnter={el => { if (selected?.id !== v.id) (el.currentTarget as HTMLDivElement).style.borderColor = `${color}88`; }}
                  onMouseLeave={el => { if (selected?.id !== v.id) (el.currentTarget as HTMLDivElement).style.borderColor = C.border; }}>
                  {/* Top color bar */}
                  <div style={{ height: 3, background: color }} />
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon style={{ width: 15, height: 15, color }} />
                        </div>
                        <div>
                          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.85rem', lineHeight: 1.3 }}>{v.name}</p>
                          <p style={{ fontSize: '0.68rem', color, marginTop: 1, fontWeight: 600 }}>{typeLabel[v.type] ?? v.type}</p>
                        </div>
                      </div>
                      <span style={{ padding: '3px 9px', background: v.available ? '#22c55e18' : `${C.active}15`, border: `1px solid ${v.available ? '#22c55e33' : C.active + '33'}`, fontSize: '0.65rem', fontWeight: 600, color: v.available ? '#22c55e' : C.active, flexShrink: 0 }}>
                        {v.available ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                      <MapPin style={{ width: 11, height: 11, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.7rem', color: C.muted }}>{v.address} · {v.neighborhood}</p>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Users style={{ width: 11, height: 11, color: C.subtle }} />
                        <span style={{ fontSize: '0.7rem', color: C.muted }}>{v.capacity} pers.</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <DollarSign style={{ width: 11, height: 11, color: C.subtle }} />
                        <span style={{ fontSize: '0.7rem', color: C.muted }}>{fmt(v.hourlyRate)}/h</span>
                      </div>
                    </div>

                    {/* Feature pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {v.features.hasAC        && <span style={{ padding: '2px 7px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.62rem', color: C.muted }}>A/C</span>}
                      {v.features.hasParking   && <span style={{ padding: '2px 7px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.62rem', color: C.muted }}>Parqueadero</span>}
                      {v.features.hasSoundSystem&&<span style={{ padding: '2px 7px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.62rem', color: C.muted }}>Sonido</span>}
                      {v.features.hasProjector && <span style={{ padding: '2px 7px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.62rem', color: C.muted }}>Proyector</span>}
                      {v.features.hasStage     && <span style={{ padding: '2px 7px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.62rem', color: C.muted }}>Escenario</span>}
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                      <button onClick={ev => { ev.stopPropagation(); toast.info('Editar escenario (requiere backend)'); }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                        <Edit2 style={{ width: 11, height: 11 }} /> Editar
                      </button>
                      <button onClick={ev => { ev.stopPropagation(); toast.info(`Estado cambiado (requiere backend)`); }}
                        style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', background: v.available ? `${C.active}15` : '#22c55e18', border: `1px solid ${v.available ? C.active + '33' : '#22c55e33'}`, color: v.available ? C.active : '#22c55e', fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                        {v.available ? <><X style={{ width: 11, height: 11 }} /> Deshabilitar</> : <><Check style={{ width: 11, height: 11 }} /> Habilitar</>}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filtered.length === 0 && (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: C.subtle }}>
                <Building2 style={{ width: 28, height: 28, margin: '0 auto 10px', opacity: 0.3 }} />
                <p style={{ fontSize: '0.85rem' }}>No se encontraron escenarios</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
