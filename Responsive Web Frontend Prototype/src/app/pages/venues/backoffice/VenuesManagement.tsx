import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Search, Plus, Check, X, Filter, Edit2, Mic2, Theater, School, Building2, Users, DollarSign, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';
import { venuesService } from '../../../services/venuesService';
import type { Venue } from '../../../data/venuesData';

const typeLabel: Record<string, string> = {
  auditorio:       'Auditorio',
  teatro:          'Teatro',
  salon_cultural:  'Salón Cultural',
  sala:            'Sala',
  sala_exposiciones:'Sala Exposiciones',
  espacio_abierto: 'Espacio Abierto',
};
const typeIcon: Record<string, any> = {
  auditorio:        Mic2,
  teatro:           Theater,
  salon_cultural:   School,
  sala:             Building2,
  sala_exposiciones:Building2,
  espacio_abierto:  Building2,
};
const typeColor: Record<string, string> = {
  auditorio:        C.primary,
  teatro:           C.gold,
  salon_cultural:   '#4b7a30',
  sala:             '#6b4040',
  sala_exposiciones:'#6b4040',
  espacio_abierto:  C.muted,
};

const EMPTY_FORM = {
  name: '', type: 'auditorio', address: '', neighborhood: '', zone: '',
  capacity: '', area: '', hourlyRate: '', dailyRate: '', description: '',
  hasAC: false, hasParking: false, hasKitchen: false, hasSoundSystem: false, hasProjector: false, hasStage: false, accessibility: false,
};

export function VenuesManagement() {
  const [venues, setVenues]         = useState<Venue[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterAvailable, setFilterAvailable] = useState('all');
  const [selected, setSelected]     = useState<Venue | null>(null);
  const [modal, setModal]           = useState<null | 'create' | 'edit'>(null);
  const [form, setForm]             = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    venuesService.getVenues()
      .then(setVenues)
      .catch(() => toast.error('Error al cargar escenarios'))
      .finally(() => setLoading(false));
  }, []);

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

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModal('create');
  };

  const openEdit = (v: Venue, ev: React.MouseEvent) => {
    ev.stopPropagation();
    setEditingId(v.id);
    setForm({
      name: v.name, type: v.type, address: v.address,
      neighborhood: v.neighborhood, zone: v.zone ?? '',
      capacity: String(v.capacity), area: String(v.area ?? ''),
      hourlyRate: String(v.hourlyRate), dailyRate: String(v.dailyRate),
      description: v.description ?? '',
      hasAC:         v.features?.hasAC         ?? false,
      hasParking:    v.features?.hasParking     ?? false,
      hasKitchen:    v.features?.hasKitchen     ?? false,
      hasSoundSystem:v.features?.hasSoundSystem ?? false,
      hasProjector:  v.features?.hasProjector   ?? false,
      hasStage:      v.features?.hasStage       ?? false,
      accessibility: v.features?.accessibility  ?? false,
    });
    setModal('edit');
  };

  const handleSave = async () => {
    if (!form.name || !form.address) { toast.error('Nombre y dirección son obligatorios'); return; }
    setSaving(true);
    try {
      const payload: any = {
        name: form.name, type: form.type, address: form.address,
        neighborhood: form.neighborhood, zone: form.zone,
        capacity: Number(form.capacity) || 0,
        area: Number(form.area) || 0,
        hourlyRate: Number(form.hourlyRate) || 0,
        dailyRate: Number(form.dailyRate) || 0,
        description: form.description,
        available: true,
        amenities: [], rules: [], images: [],
        features: {
          hasAC:         form.hasAC,
          hasParking:    form.hasParking,
          hasKitchen:    form.hasKitchen,
          hasSoundSystem:form.hasSoundSystem,
          hasProjector:  form.hasProjector,
          hasStage:      form.hasStage,
          accessibility: form.accessibility,
        },
      };
      if (modal === 'create') {
        const created = await venuesService.createVenue(payload);
        setVenues(prev => [...prev, created]);
        toast.success('Escenario creado exitosamente');
      } else if (modal === 'edit' && editingId) {
        const updated = await venuesService.updateVenue(editingId, payload);
        setVenues(prev => prev.map(v => v.id === editingId ? updated : v));
        if (selected?.id === editingId) setSelected(updated);
        toast.success('Escenario actualizado');
      }
      setModal(null);
    } catch (e: any) {
      toast.error(e.message ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (v: Venue, ev: React.MouseEvent) => {
    ev.stopPropagation();
    try {
      const updated = await venuesService.toggleAvailability(v.id);
      setVenues(prev => prev.map(vn => vn.id === v.id ? updated : vn));
      if (selected?.id === v.id) setSelected(updated);
      toast.success(`Escenario ${updated.available ? 'habilitado' : 'deshabilitado'}`);
    } catch (e: any) {
      toast.error(e.message ?? 'Error al cambiar estado');
    }
  };

  const handleDelete = async (v: Venue, ev: React.MouseEvent) => {
    ev.stopPropagation();
    if (!window.confirm(`¿Eliminar "${v.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await venuesService.updateVenue(v.id, { available: false } as any);
      setVenues(prev => prev.filter(vn => vn.id !== v.id));
      if (selected?.id === v.id) setSelected(null);
      toast.success('Escenario eliminado');
    } catch (e: any) {
      toast.error(e.message ?? 'Error al eliminar');
    }
  };

  const boolField = (key: keyof typeof EMPTY_FORM, label: string) => (
    <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: '0.75rem', color: C.muted }}>
      <input
        type="checkbox"
        checked={Boolean(form[key])}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
        style={{ cursor: 'pointer' }}
      />
      {label}
    </label>
  );

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
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Escenarios</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{venues.length} escenarios registrados</p>
          </div>
          <button onClick={openCreate}
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
        {/* Filters */}
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

        {loading && <div style={{ textAlign: 'center', padding: '40px 0', color: C.subtle, fontSize: '0.85rem' }}>Cargando escenarios...</div>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14 }}>
          {filtered.map((v, i) => {
            const color = typeColor[v.type] ?? C.primary;
            const Icon  = typeIcon[v.type]  ?? Building2;
            return (
              <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: i * 0.05 }}
                onClick={() => setSelected(selected?.id === v.id ? null : v)}
                style={{ background: '#fff', border: `1px solid ${selected?.id === v.id ? color : C.border}`, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden' }}
                onMouseEnter={el => { if (selected?.id !== v.id) (el.currentTarget as HTMLDivElement).style.borderColor = `${color}88`; }}
                onMouseLeave={el => { if (selected?.id !== v.id) (el.currentTarget as HTMLDivElement).style.borderColor = C.border; }}>
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

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
                    {v.features?.hasAC         && <span style={{ padding: '2px 7px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.62rem', color: C.muted }}>A/C</span>}
                    {v.features?.hasParking    && <span style={{ padding: '2px 7px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.62rem', color: C.muted }}>Parqueadero</span>}
                    {v.features?.hasSoundSystem&& <span style={{ padding: '2px 7px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.62rem', color: C.muted }}>Sonido</span>}
                    {v.features?.hasProjector  && <span style={{ padding: '2px 7px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.62rem', color: C.muted }}>Proyector</span>}
                    {v.features?.hasStage      && <span style={{ padding: '2px 7px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.62rem', color: C.muted }}>Escenario</span>}
                  </div>

                  <div style={{ display: 'flex', gap: 6, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                    <button onClick={ev => openEdit(v, ev)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                      <Edit2 style={{ width: 11, height: 11 }} /> Editar
                    </button>
                    <button onClick={ev => handleToggle(v, ev)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '7px 0', background: v.available ? `${C.active}15` : '#22c55e18', border: `1px solid ${v.available ? C.active + '33' : '#22c55e33'}`, color: v.available ? C.active : '#22c55e', fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                      {v.available
                        ? <><X style={{ width: 11, height: 11 }} /> Deshabilitar</>
                        : <><Check style={{ width: 11, height: 11 }} /> Habilitar</>}
                    </button>
                    <button onClick={ev => handleDelete(v, ev)}
                      style={{ width: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '7px', background: 'transparent', border: `1px solid ${C.active}33`, color: C.active, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                      <Trash2 style={{ width: 12, height: 12 }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {!loading && filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px 0', color: C.subtle }}>
              <Building2 style={{ width: 28, height: 28, margin: '0 auto 10px', opacity: 0.3 }} />
              <p style={{ fontSize: '0.85rem' }}>No se encontraron escenarios</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Crear / Editar */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: C.surface, zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>
                    {modal === 'create' ? 'NUEVO ESCENARIO' : 'EDITAR ESCENARIO'}
                  </span>
                </div>
                <button onClick={() => setModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Nombre */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Nombre del escenario *</label>
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    placeholder="Ej: Auditorio Principal" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                </div>

                {/* Tipo */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Tipo</label>
                  <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} style={inputStyle}>
                    {Object.entries(typeLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                </div>

                {/* Dirección y Barrio */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Dirección *</label>
                    <input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))}
                      placeholder="Calle 10 #5-20" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Barrio</label>
                    <input value={form.neighborhood} onChange={e => setForm(p => ({ ...p, neighborhood: e.target.value }))}
                      placeholder="Centro" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                </div>

                {/* Capacidad y Área */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Capacidad (personas)</label>
                    <input type="number" min="1" value={form.capacity} onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))}
                      placeholder="200" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Área (m²)</label>
                    <input type="number" min="0" value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))}
                      placeholder="420" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                </div>

                {/* Tarifas */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Tarifa/hora (COP)</label>
                    <input type="number" min="0" value={form.hourlyRate} onChange={e => setForm(p => ({ ...p, hourlyRate: e.target.value }))}
                      placeholder="280000" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Tarifa/día (COP)</label>
                    <input type="number" min="0" value={form.dailyRate} onChange={e => setForm(p => ({ ...p, dailyRate: e.target.value }))}
                      placeholder="1800000" style={inputStyle}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Descripción</label>
                  <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                    placeholder="Describe el escenario..."
                    style={{ ...inputStyle, resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border} />
                </div>

                {/* Features */}
                <div>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 8 }}>Características</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {boolField('hasAC',         'Aire acondicionado')}
                    {boolField('hasParking',    'Parqueadero')}
                    {boolField('hasKitchen',    'Cocina')}
                    {boolField('hasSoundSystem','Sistema de sonido')}
                    {boolField('hasProjector',  'Proyector')}
                    {boolField('hasStage',      'Escenario/Tarima')}
                    {boolField('accessibility', 'Accesibilidad')}
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
                    {saving ? 'Guardando...' : modal === 'create' ? 'Crear Escenario' : 'Guardar Cambios'}
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
