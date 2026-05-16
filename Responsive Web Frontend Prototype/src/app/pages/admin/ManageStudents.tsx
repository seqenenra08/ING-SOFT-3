import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Users, X, Plus, Mail, Phone, MapPin, Calendar, User, BookOpen, Save } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../theme';
import { studentsService, type Student } from '../../services/studentsService';

const EMPTY_FORM = { nombre: '', apellido: '', email: '', documento: '', tipoDocumento: 'CC', telefono: '', direccion: '', fechaNacimiento: '', acudiente: '', telefonoAcudiente: '' };

export const ManageStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    studentsService.getAll()
      .then(setStudents)
      .catch(() => toast.error('Error al cargar estudiantes'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s => {
    const q = search.toLowerCase();
    const name = `${s.nombre ?? ''} ${s.apellido ?? ''}`.toLowerCase();
    return name.includes(q) || s.email?.toLowerCase().includes(q) || s.documento?.includes(q);
  });

  const handleSave = async () => {
    if (!form.nombre || !form.apellido || !form.email) {
      toast.error('Nombre, apellido y correo son obligatorios');
      return;
    }
    setSaving(true);
    try {
      const created = await studentsService.create({
        nombre: form.nombre, apellido: form.apellido,
        email: form.email, documento: form.documento,
        telefono: form.telefono, direccion: form.direccion,
        fechaNacimiento: form.fechaNacimiento,
        acudiente: form.acudiente, telefonoAcudiente: form.telefonoAcudiente,
        programas: [], estado: 'Activo',
      });
      setStudents(prev => [...prev, created]);
      setShowModal(false);
      setForm(EMPTY_FORM);
      toast.success('Estudiante registrado exitosamente');
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
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Administración</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Gestión de Estudiantes</h1>
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{students.length} estudiantes registrados</p>
          </div>
          <button onClick={() => setShowModal(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2 }}>
            <Plus style={{ width: 14, height: 14 }} /> Nuevo Estudiante
          </button>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px' }}>
        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 320px', maxWidth: 400 }}>
            <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: C.subtle }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre, correo o documento..."
              style={{ width: '100%', padding: '9px 12px 9px 36px', background: C.surface, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = C.primary}
              onBlur={e => e.target.style.borderColor = C.border}
            />
          </div>
          <p style={{ fontSize: '0.72rem', color: C.subtle }}>{filtered.length} resultado(s)</p>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          {/* Table */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            style={{ flex: 1, background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ padding: '10px 20px', background: C.surfaceAlt, borderBottom: `1px solid ${C.border}`, display: 'flex' }}>
              <span style={{ flex: 2, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Estudiante</span>
              <span style={{ flex: 1, fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Correo</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 80, textAlign: 'center' }}>Programas</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, color: C.subtle, textTransform: 'uppercase', letterSpacing: '0.06em', width: 80, textAlign: 'center' }}>Estado</span>
            </div>

            {loading && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>Cargando estudiantes...</div>
            )}
            {!loading && filtered.length === 0 && (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: C.subtle, fontSize: '0.82rem' }}>No se encontraron estudiantes.</div>
            )}

            {filtered.map((s, i, arr) => (
              <div key={s.id}>
                <div
                  style={{ display: 'flex', alignItems: 'center', padding: '13px 20px', cursor: 'pointer', transition: 'background 0.15s', background: selected?.id === s.id ? C.tint : 'transparent' }}
                  onClick={() => setSelected(selected?.id === s.id ? null : s)}
                  onMouseEnter={e => { if (selected?.id !== s.id) (e.currentTarget as HTMLDivElement).style.background = C.tint; }}
                  onMouseLeave={e => { if (selected?.id !== s.id) (e.currentTarget as HTMLDivElement).style.background = 'transparent'; }}
                >
                  <div style={{ flex: 2, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 30, height: 30, background: C.tint, border: `1px solid ${C.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Users style={{ width: 13, height: 13, color: C.primary }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.82rem' }}>{s.nombre} {s.apellido}</p>
                      <p style={{ fontSize: '0.68rem', color: C.subtle }}>{s.documento ?? 'CC no registrado'}</p>
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.75rem', color: C.muted }}>{s.email}</p>
                  </div>
                  <div style={{ width: 80, textAlign: 'center' }}>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.85rem' }}>
                      {(s.programas ?? []).length}
                    </span>
                  </div>
                  <div style={{ width: 80, textAlign: 'center' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: C.active, border: `1px solid ${C.active}44`, padding: '2px 6px', borderRadius: 2 }}>
                      {s.estado ?? 'Activo'}
                    </span>
                  </div>
                </div>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            ))}
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
                    <div style={{ width: 3, height: 14, background: C.active, borderRadius: 2 }} />
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.78rem', color: C.text }}>DETALLE DEL ESTUDIANTE</span>
                  </div>
                  <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <X style={{ width: 14, height: 14, color: C.subtle }} />
                  </button>
                </div>

                <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {/* Avatar + name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, background: `${C.primary}18`, border: `1px solid ${C.primary}33`, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User style={{ width: 20, height: 20, color: C.primary }} />
                    </div>
                    <div>
                      <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.9rem' }}>{selected.nombre} {selected.apellido}</p>
                      <p style={{ fontSize: '0.68rem', color: C.active, fontWeight: 600 }}>
                        {selected.estado ?? 'Activo'}
                      </p>
                    </div>
                  </div>

                  <div style={{ height: 1, background: C.border }} />

                  {/* Info */}
                  {[
                    { icon: Mail,     label: selected.email },
                    { icon: Phone,    label: selected.telefono ?? '—' },
                    { icon: MapPin,   label: selected.direccion ?? '—' },
                    { icon: Calendar, label: selected.fechaNacimiento ? `Nac. ${selected.fechaNacimiento}` : '—' },
                    { icon: User,     label: `Doc: ${selected.documento ?? '—'}` },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Icon style={{ width: 12, height: 12, color: C.subtle, flexShrink: 0 }} />
                      <p style={{ fontSize: '0.73rem', color: C.muted }}>{label}</p>
                    </div>
                  ))}

                  <div style={{ height: 1, background: C.border }} />

                  {/* Acudiente */}
                  {selected.acudiente && (
                    <div>
                      <p style={{ fontSize: '0.65rem', fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Acudiente</p>
                      <p style={{ fontSize: '0.73rem', color: C.muted }}>{selected.acudiente}</p>
                      {selected.telefonoAcudiente && <p style={{ fontSize: '0.73rem', color: C.muted }}>{selected.telefonoAcudiente}</p>}
                    </div>
                  )}

                  {/* Programas */}
                  <div>
                    <p style={{ fontSize: '0.65rem', fontWeight: 600, color: C.text, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <BookOpen style={{ width: 11, height: 11 }} /> Programas inscritos ({(selected.programas ?? []).length})
                    </p>
                    {(selected.programas ?? []).length === 0
                      ? <p style={{ fontSize: '0.72rem', color: C.subtle }}>Sin programas activos</p>
                      : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                          {(selected.programas as any[]).map((p: any) => (
                            <div key={typeof p === 'string' ? p : p.id} style={{ padding: '5px 10px', background: C.tint, border: `1px solid ${C.border}`, fontSize: '0.72rem', color: C.primary, borderRadius: 2 }}>
                              {typeof p === 'string' ? p : (p.name ?? p)}
                            </div>
                          ))}
                        </div>
                      )
                    }
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal: Nuevo Estudiante */}
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
                  <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: C.text }}>NUEVO ESTUDIANTE</span>
                </div>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X style={{ width: 16, height: 16, color: C.subtle }} />
                </button>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { key: 'nombre',     label: 'Nombre *',              placeholder: 'Ej: Camila' },
                  { key: 'apellido',   label: 'Apellido *',            placeholder: 'Ej: Rodríguez' },
                  { key: 'email',      label: 'Correo electrónico *',  placeholder: 'correo@email.com' },
                  { key: 'documento',  label: 'Documento',             placeholder: 'Número de documento' },
                  { key: 'telefono',   label: 'Teléfono',              placeholder: '300 000 0000' },
                  { key: 'direccion',  label: 'Dirección',             placeholder: 'Calle 10 #5-20, Pereira' },
                  { key: 'fechaNacimiento', label: 'Fecha de nacimiento', placeholder: '' },
                  { key: 'acudiente', label: 'Acudiente',              placeholder: 'Nombre del acudiente' },
                  { key: 'telefonoAcudiente', label: 'Teléfono acudiente', placeholder: '300 000 0000' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>{f.label}</label>
                    <input
                      type={f.key === 'fechaNacimiento' ? 'date' : 'text'}
                      value={(form as any)[f.key]}
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      style={{ width: '100%', padding: '9px 12px', background: C.surfaceAlt, border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
                      onFocus={e => e.target.style.borderColor = C.primary}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                ))}

                <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                  <button onClick={() => setShowModal(false)}
                    style={{ flex: 1, padding: '9px', background: 'transparent', border: `1px solid ${C.border}`, color: C.muted, fontSize: '0.82rem', cursor: 'pointer', borderRadius: 2 }}>
                    Cancelar
                  </button>
                  <button onClick={handleSave} disabled={saving}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '9px', background: saving ? C.border : C.primary, color: '#fff', fontWeight: 600, fontSize: '0.82rem', border: 'none', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 2 }}>
                    <Save style={{ width: 14, height: 14 }} />
                    {saving ? 'Guardando...' : 'Registrar Estudiante'}
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

