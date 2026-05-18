import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, X, Plus, Calendar, Users, Clock, BarChart3, Save, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../theme';
import { programsService, type Program } from '../../services/programsService';
import { educatorsService, type Educator } from '../../services/educatorsService';

const CATEGORIES = ['Danza', 'Música', 'Teatro', 'Artes Visuales', 'Otro'];
const LEVELS = ['Principiante', 'Intermedio', 'Avanzado', 'Todos los niveles', 'Niños'];
const EMPTY_FORM: Partial<Program> = { name: '', category: 'Danza', description: '', level: 'Principiante', capacity: 15, schedule: '', educator: '', startDate: '', endDate: '' };

const categoryColor: Record<string, string> = {
  Danza: C.primary, Música: C.gold, Teatro: '#4b7a30', 'Artes Visuales': '#6b4040',
};

export const ManagePrograms = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [educators, setEducators] = useState<Educator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Program | null>(null);
  const [modal, setModal] = useState<null | 'create' | 'edit'>(null);
  const [form, setForm] = useState<Partial<Program>>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      programsService.getAll(),
      educatorsService.getAll(),
    ]).then(([progs, edus]) => {
      setPrograms(progs);
      setEducators(edus);
    }).catch(() => toast.error('Error al cargar programas'))
      .finally(() => setLoading(false));
  }, []);

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setForm(EMPTY_FORM);
  };

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !saving) closeModal(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal, saving]);

  const filtered = programs.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.educator?.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => { setForm(EMPTY_FORM); setModal('create'); };
  const openEdit = (p: Program, e: React.MouseEvent) => {
    e.stopPropagation();
    // Pre-populate educatorId by matching educator name to the loaded list
    const matchedEdu = educators.find(ed =>
      `${ed.nombre ?? ''} ${ed.apellido ?? ''}`.trim() === p.educator
    );
    setForm({ ...p, educatorId: matchedEdu?.id ?? p.educatorId });
    setModal('edit');
  };

  const handleDelete = async (p: Program, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`¿Eliminar el programa "${p.name}"? Esta acción no se puede deshacer.`)) return;
    try {
      await programsService.remove(p.id);
      setPrograms(prev => prev.filter(x => x.id !== p.id));
      if (selected?.id === p.id) setSelected(null);
      toast.success('Programa eliminado');
    } catch {
      toast.error('Error al eliminar el programa');
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.category) { toast.error('Nombre y categoría son obligatorios'); return; }
    setSaving(true);
    try {
      if (modal === 'create') {
        const created = await programsService.create(form as Omit<Program, 'id'>);
        setPrograms(prev => [...prev, created]);
        toast.success('Programa creado exitosamente');
      } else if (modal === 'edit' && form.id) {
        const updated = await programsService.update(form.id, form);
        setPrograms(prev => prev.map(p => p.id === updated.id ? updated : p));
        if (selected?.id === updated.id) setSelected(updated);
        toast.success('Programa actualizado');
      }
      setModal(null);
      setForm(EMPTY_FORM);
    } catch (e: any) {
      toast.error(e.message ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.gold }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.gold, marginBottom: 6 }}>Administración</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Programas</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{programs.length} programas en el sistema</p>
          </div>
          <button onClick={openCreate}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Plus style={{ width: 14, height: 14 }} /> Nuevo Programa
          </button>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 400 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nombre, categoría o educador..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <p style={{ fontSize: '0.72rem', color: C.subtle, alignSelf: 'center' }}>{filtered.length} resultado(s)</p>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
              <span style={{ flex: 2, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Programa</span>
              <span style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Categoría</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 110, textAlign: 'center' }}>Educador</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 70, textAlign: 'center' }}>Cupo</span>
              <span style={{ width: 80 }} />
            </div>

            {loading && <div style={{ padding: '40px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>Cargando programas...</div>}
            {!loading && filtered.length === 0 && <div style={{ padding: '40px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>No se encontraron programas.</div>}

            {filtered.map((p, i, arr) => {
              const color = categoryColor[p.category] ?? C.muted;
              return (
                <div key={p.id}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', cursor: 'pointer', transition: 'background 0.15s', background: selected?.id === p.id ? C.tint : 'transparent' }}
                    onClick={() => setSelected(selected?.id === p.id ? null : p)}
                    onMouseEnter={e => { if (selected?.id !== p.id) (e.currentTarget as HTMLDivElement).style.background = C.tint; }}
                    onMouseLeave={e => { if (selected?.id !== p.id) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                  >
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 30, height: 30, background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <BookOpen style={{ width: 12, height: 12, color }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.68rem', color: C.subtle }}>{p.level}</p>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ padding: '3px 8px', background: `${color}15`, border: `1px solid ${color}33`, fontSize: '0.68rem', color, fontWeight: 600, borderRadius: 2 }}>
                        {p.category}
                      </span>
                    </div>
                    <div style={{ width: 110, textAlign: 'center' }}><p style={{ fontSize: '0.72rem', color: C.muted }}>{p.educator ?? '—'}</p></div>
                    <div style={{ width: 70, textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.85rem' }}>
                        {p.enrolled ?? 0}/{p.capacity ?? 0}
                      </p>
                    </div>
                    <div style={{ width: 80, display: 'flex', justifyContent: 'flex-end' }}>
                      <button onClick={e => openEdit(p, e)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                        <Pencil style={{ width: 10, height: 10 }} /> Editar
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
              <motion.div
                key="detail"
                initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 24 }}
                transition={{ duration: 0.25 }}
                style={{ width: 300, flexShrink: 0, background: C.surface, border: `1px solid ${C.border}` }}
              >
                <div style={{ padding: '12px 16px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text }}>DETALLE DEL PROGRAMA</span>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X style={{ width: 14, height: 14, color: C.subtle }} />
                  </button>
                </div>

                {selected.image && (
                  <img src={selected.image} alt={selected.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
                )}

                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div>
                    <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.92rem', marginBottom: 4 }}>{selected.name}</p>
                    <span style={{ padding: '3px 8px', background: `${categoryColor[selected.category] ?? C.muted}15`, border: `1px solid ${categoryColor[selected.category] ?? C.muted}33`, fontSize: '0.68rem', color: categoryColor[selected.category] ?? C.muted, fontWeight: 600, borderRadius: 2 }}>
                      {selected.category}
                    </span>
                  </div>

                  {selected.description && (
                    <p style={{ fontSize: '0.73rem', color: C.muted, lineHeight: 1.5 }}>{selected.description}</p>
                  )}

                  <div style={{ height: 1, background: C.border }} />

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ flex: 1, padding: '10px', background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.primary }}>{selected.enrolled ?? 0}</p>
                      <p style={{ fontSize: '0.62rem', color: C.subtle }}>Inscritos</p>
                    </div>
                    <div style={{ flex: 1, padding: '10px', background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.gold }}>{selected.capacity ?? 0}</p>
                      <p style={{ fontSize: '0.62rem', color: C.subtle }}>Capacidad</p>
                    </div>
                  </div>

                  {[
                    { icon: Users,    label: `Educador: ${selected.educator ?? '—'}` },
                    { icon: BarChart3, label: `Nivel: ${selected.level ?? '—'}` },
                    { icon: Clock,    label: selected.schedule ?? '—' },
                    { icon: Calendar, label: `${selected.startDate ?? '?'} → ${selected.endDate ?? '?'}` },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon style={{ width: 12, height: 12, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.73rem', color: C.muted }}>{label}</p>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                    <button onClick={e => openEdit(selected, e)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
                      <Pencil style={{ width: 13, height: 13 }} /> Editar
                    </button>
                    <button onClick={e => handleDelete(selected, e)}
                      aria-label="Eliminar programa" title="Eliminar"
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px 12px', background: 'transparent', color: C.active, fontWeight: 600, fontSize: '0.8rem', border: `1px solid ${C.active}55`, cursor: 'pointer', borderRadius: 2 }}>
                      <Trash2 style={{ width: 13, height: 13 }} />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal: Crear / Editar Programa */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={closeModal}
            role="dialog" aria-modal="true" aria-label={modal === 'create' ? 'Nuevo programa' : 'Editar programa'}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, width: '100%', maxWidth: 540, maxHeight: '85vh', overflow: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: C.gold, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>
                    {modal === 'create' ? 'NUEVO PROGRAMA' : 'EDITAR PROGRAMA'}
                  </span>
                </div>
                <button onClick={closeModal} aria-label="Cerrar" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Nombre del programa *</label>
                  <input value={form.name ?? ''} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ej: Ballet Clásico"
                    style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>

                {/* Category & Level row */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Categoría *</label>
                    <select value={form.category ?? ''} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box', cursor: 'pointer' }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Nivel</label>
                    <select value={form.level ?? ''} onChange={e => setForm(p => ({ ...p, level: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box', cursor: 'pointer' }}>
                      {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Descripción</label>
                  <textarea value={form.description ?? ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
                    placeholder="Describe el programa..."
                    style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box', resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>

                {/* Educator & Capacity */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 2 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Educador</label>
                    <select
                      value={form.educatorId ?? ''}
                      onChange={e => {
                        const edu = educators.find(ed => ed.id === e.target.value);
                        setForm(p => ({
                          ...p,
                          educatorId: e.target.value || undefined,
                          educator: edu ? `${edu.nombre ?? ''} ${edu.apellido ?? ''}`.trim() : '',
                        }));
                      }}
                      style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box', cursor: 'pointer' }}
                    >
                      <option value="">— Sin educador asignado —</option>
                      {educators.map(ed => (
                        <option key={ed.id} value={ed.id}>
                          {`${ed.nombre ?? ''} ${ed.apellido ?? ''}`.trim()} {ed.especialidad ? `· ${ed.especialidad}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Capacidad</label>
                    <input type="number" inputMode="numeric" min={Math.max(1, (form.enrolled ?? 0))} value={form.capacity ?? 15} onChange={e => setForm(p => ({ ...p, capacity: +e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                    />
                    {(form.enrolled ?? 0) > 0 && <p style={{ fontSize: '0.65rem', color: C.subtle, marginTop: 3 }}>Mínimo: {form.enrolled} (inscritos actuales)</p>}
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Horario</label>
                  <input value={form.schedule ?? ''} onChange={e => setForm(p => ({ ...p, schedule: e.target.value }))} placeholder="Ej: Martes y Jueves 4:00 PM - 6:00 PM"
                    style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>

                {/* Dates */}
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Fecha inicio</label>
                    <input type="date" value={form.startDate ?? ''} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Fecha fin</label>
                    <input type="date" min={form.startDate || undefined} value={form.endDate ?? ''} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
                      style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = C.primary} onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button onClick={closeModal}
                    style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', cursor: 'pointer', borderRadius: 2 }}>
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: saving ? C.border : C.primary, color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saving ? 'Guardando...' : modal === 'create' ? 'Crear Programa' : 'Guardar Cambios'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

