import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, UserCog, BookOpen, Mail, Phone, ArrowRight, Plus, X, Save, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../theme';
import { educatorsService, type Educator } from '../../services/educatorsService';

const EMPTY_FORM = { nombre: '', apellido: '', email: '', especialidad: '', telefono: '', bio: '' };

const specialtyColor: Record<string, string> = {
  'Danza Clásica': C.primary,
  'Música':        C.gold,
  'Teatro':        '#4b7a30',
  'Danza':         C.primary,
  'Artes Visuales':'#6b4040',
};

export const ManageEducators = () => {
  const [educators, setEducators] = useState<Educator[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Educator | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    educatorsService.getAll()
      .then(setEducators)
      .catch(() => toast.error('Error al cargar educadores'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = educators.filter(e => {
    const fullName = `${e.nombre ?? ''} ${e.apellido ?? ''}`.toLowerCase();
    const q = search.toLowerCase();
    return fullName.includes(q) || e.email?.toLowerCase().includes(q) || e.especialidad?.toLowerCase().includes(q);
  });

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const openEdit = (e: Educator, ev?: React.MouseEvent) => {
    ev?.stopPropagation();
    setEditingId(e.id);
    setForm({
      nombre: e.nombre ?? '',
      apellido: e.apellido ?? '',
      email: e.email ?? '',
      especialidad: e.especialidad ?? '',
      telefono: e.telefono ?? '',
      bio: e.bio ?? '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.nombre || !form.apellido || !form.email) {
      toast.error('Nombre, apellido y correo son obligatorios');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        especialidad: form.especialidad,
        telefono: form.telefono,
        bio: form.bio,
      };

      if (editingId) {
        const updated = await educatorsService.update(editingId, payload);
        setEducators(prev => prev.map(e => e.id === editingId ? updated : e));
        if (selected?.id === editingId) setSelected(updated);
        toast.success('Educador actualizado exitosamente');
      } else {
        const created = await educatorsService.create({ ...payload, programas: [], grupos: 0, estudiantes: 0 });
        setEducators(prev => [...prev, created]);
        toast.success('Educador registrado exitosamente');
      }
      setShowModal(false);
      setForm(EMPTY_FORM);
      setEditingId(null);
    } catch (e: any) {
      toast.error(e.message ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (e: Educator) => {
    if (!window.confirm(`¿Eliminar a ${e.nombre} ${e.apellido}? Esta acción no se puede deshacer.`)) return;
    try {
      await educatorsService.remove(e.id);
      setEducators(prev => prev.filter(ed => ed.id !== e.id));
      setSelected(null);
      toast.success('Educador eliminado');
    } catch (err: any) {
      toast.error(err.message ?? 'Error al eliminar');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Administración</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Educadores</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{educators.length} educadores registrados</p>
          </div>
          <button onClick={openCreate}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Plus style={{ width: 14, height: 14 }} /> Nuevo Educador
          </button>
        </motion.div>
      </div>

      {/* KPI strip */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
        style={{ background: '#fff', borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
        {[
          { label: 'Total educadores', value: educators.length, color: C.primary },
          { label: 'Total programas activos', value: educators.reduce((a, e) => a + (e.grupos ?? 0), 0), color: C.gold },
          { label: 'Total estudiantes', value: educators.reduce((a, e) => a + (e.estudiantes ?? 0), 0), color: '#4b7a30' },
          { label: 'Especialidades', value: new Set(educators.map(e => e.especialidad)).size, color: C.active },
        ].map((k, i, arr) => (
          <div key={k.label} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, padding: '16px 28px', borderRight: i < arr.length - 1 ? `1px solid ${C.border}` : 'none' }}>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: k.color, lineHeight: 1 }}>{k.value}</p>
              <p style={{ fontSize: '0.65rem', color: C.subtle, marginTop: 3 }}>{k.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 400 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, correo o especialidad..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: '#fff', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <p style={{ fontSize: '0.72rem', color: C.subtle }}>{filtered.length} resultado(s)</p>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ flex: 1, background: '#fff', border: `1px solid ${C.border}` }}>
            {/* Header row */}
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
              <span style={{ flex: 2, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Educador</span>
              <span style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Especialidad</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 80, textAlign: 'center' }}>Grupos</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 90, textAlign: 'center' }}>Estudiantes</span>
              <span style={{ width: 110 }} />
            </div>

            {loading && (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>Cargando educadores...</div>
            )}
            {!loading && filtered.length === 0 && (
              <div style={{ padding: '32px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>
                No se encontraron educadores con esa búsqueda.
              </div>
            )}

            {filtered.map((e, i, arr) => {
              const color = specialtyColor[e.especialidad] ?? C.muted;
              return (
                <div key={e.id}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={el => (el.currentTarget as HTMLDivElement).style.background = C.tint}
                    onMouseLeave={el => (el.currentTarget as HTMLDivElement).style.background = 'transparent'}
                    onClick={() => setSelected(selected?.id === e.id ? null : e)}>
                    <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 30, height: 30, background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <UserCog style={{ width: 13, height: 13, color }} />
                      </div>
                      <div>
                        <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{e.nombre} {e.apellido}</p>
                        <p style={{ fontSize: '0.68rem', color: C.subtle }}>{e.email}</p>
                      </div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <span style={{ padding: '3px 10px', background: `${color}15`, border: `1px solid ${color}33`, fontSize: '0.68rem', color, fontWeight: 600, borderRadius: 2 }}>
                        {e.especialidad}
                      </span>
                    </div>
                    <div style={{ width: 80, textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.85rem' }}>{e.grupos ?? 0}</p>
                    </div>
                    <div style={{ width: 90, textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.85rem' }}>{e.estudiantes ?? 0}</p>
                    </div>
                    <div style={{ width: 110, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                      <button onClick={ev => openEdit(e, ev)}
                        style={{ padding: '4px 6px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, cursor: 'pointer', borderRadius: 2, display: 'flex', alignItems: 'center' }}>
                        <Edit2 style={{ width: 11, height: 11 }} />
                      </button>
                      <button onClick={ev => { ev.stopPropagation(); setSelected(selected?.id === e.id ? null : e); }}
                        style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.72rem', cursor: 'pointer', borderRadius: 2 }}>
                        Ver <ArrowRight style={{ width: 11, height: 11 }} />
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
              <motion.div key="detail" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}
                style={{ width: 280, flexShrink: 0, background: '#fff', border: `1px solid ${C.border}` }}>
                <div style={{ padding: '14px 16px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text }}>DETALLE DEL EDUCADOR</span>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <X style={{ width: 14, height: 14, color: C.subtle }} />
                  </button>
                </div>
                <div style={{ padding: 16 }}>
                  {/* Avatar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 2, background: `${specialtyColor[selected.especialidad] ?? C.primary}15`, border: `1px solid ${specialtyColor[selected.especialidad] ?? C.primary}33`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <UserCog style={{ width: 20, height: 20, color: specialtyColor[selected.especialidad] ?? C.primary }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{selected.nombre} {selected.apellido}</p>
                      <p style={{ fontSize: '0.68rem', color: C.active, fontWeight: 600 }}>{selected.especialidad}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Mail style={{ width: 12, height: 12, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.72rem', color: C.muted }}>{selected.email}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Phone style={{ width: 12, height: 12, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.72rem', color: C.muted }}>{selected.telefono}</p>
                    </div>
                  </div>

                  {selected.bio && (
                    <div style={{ marginBottom: 16 }}>
                      <p style={{ fontSize: '0.65rem', fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>Bio</p>
                      <p style={{ fontSize: '0.72rem', color: C.muted, lineHeight: 1.5 }}>{selected.bio}</p>
                    </div>
                  )}

                  {/* Stats */}
                  <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                    <div style={{ flex: 1, padding: '10px 12px', background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.primary }}>{selected.grupos ?? 0}</p>
                      <p style={{ fontSize: '0.62rem', color: C.subtle, marginTop: 2 }}>Grupos</p>
                    </div>
                    <div style={{ flex: 1, padding: '10px 12px', background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, textAlign: 'center' }}>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.primary }}>{selected.estudiantes ?? 0}</p>
                      <p style={{ fontSize: '0.62rem', color: C.subtle, marginTop: 2 }}>Estudiantes</p>
                    </div>
                  </div>

                  {/* Programs */}
                  <div style={{ marginBottom: 16 }}>
                    <p style={{ fontSize: '0.65rem', fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <BookOpen style={{ width: 11, height: 11 }} /> Programas asignados
                    </p>
                    <div style={{ padding: '5px 10px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.72rem', color: C.primary, borderRadius: 2 }}>
                      {selected.grupos ?? 0} programa(s)
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button onClick={() => openEdit(selected)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', background: C.primary, color: '#fff', border: 'none', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
                      <Edit2 style={{ width: 13, height: 13 }} /> Editar Perfil
                    </button>
                    <button onClick={() => handleDelete(selected)}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '8px 12px', background: 'transparent', color: C.active, border: `1px solid ${C.active}44`, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 2 }}>
                      <Trash2 style={{ width: 13, height: 13 }} /> Eliminar
                    </button>
                    <button onClick={() => setSelected(null)}
                      style={{ padding: '8px 12px', background: 'transparent', color: C.muted, border: `1px solid ${C.border}`, fontSize: '0.75rem', cursor: 'pointer', borderRadius: 2 }}>
                      Cerrar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal: Nuevo / Editar Educador */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              style={{ background: C.surface, border: `1px solid ${C.border}`, width: '100%', maxWidth: 520, maxHeight: '85vh', overflow: 'auto' }}
              onClick={e => e.stopPropagation()}
            >
              <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 14, background: C.primary, borderRadius: 2 }} />
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>
                    {editingId ? 'EDITAR EDUCADOR' : 'NUEVO EDUCADOR'}
                  </span>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'nombre',      label: 'Nombre *',              placeholder: 'Ej: Diana' },
                  { key: 'apellido',    label: 'Apellido *',            placeholder: 'Ej: Vargas' },
                  { key: 'email',       label: 'Correo electrónico *',  placeholder: 'correo@lucytejada.edu.co' },
                  { key: 'especialidad',label: 'Especialidad',          placeholder: 'Ej: Danza Clásica' },
                  { key: 'telefono',    label: 'Teléfono',              placeholder: '318 000 0000' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>{f.label}</label>
                    <input
                      type="text"
                      value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = C.primary}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                ))}
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Descripción breve del educador..."
                    rows={3}
                    style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box', resize: 'vertical' }}
                    onFocus={e => e.target.style.borderColor = C.primary}
                    onBlur={e => e.target.style.borderColor = C.border}
                  />
                </div>

                {!editingId && (
                  <div style={{ padding: '10px 14px', background: `${C.gold}18`, border: `1px solid ${C.gold}44`, borderRadius: 2 }}>
                    <p style={{ fontSize: '0.72rem', color: C.text, fontWeight: 600, marginBottom: 3 }}>Contraseña inicial</p>
                    <p style={{ fontSize: '0.72rem', color: C.muted }}>
                      El educador podrá iniciar sesión con la contraseña: <strong style={{ color: C.gold, fontFamily: 'monospace' }}>password123</strong>
                    </p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button onClick={() => setShowModal(false)}
                    style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', cursor: 'pointer', borderRadius: 2 }}>
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: saving ? C.border : C.primary, color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saving ? 'Guardando...' : editingId ? 'Guardar Cambios' : 'Registrar Educador'}
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
