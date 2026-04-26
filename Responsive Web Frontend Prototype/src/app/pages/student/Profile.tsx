import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react';
import { C } from '../../theme';

export const Profile = () => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    nombre: 'Camila', apellido: 'Rodríguez', email: 'camila@estudiante.com',
    telefono: '315 234 5678', direccion: 'Cra 15 #32-10, Pereira',
    fechaNacimiento: '2005-03-14', documento: '1002345678',
    acudiente: 'María Rodríguez', telefonoAcudiente: '311 987 6543',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', fontSize: '0.82rem',
    background: editing ? C.surfaceAlt : 'transparent',
    border: editing ? `1px solid ${C.border}` : `1px solid transparent`,
    color: C.text, outline: 'none', borderRadius: 2, boxSizing: 'border-box',
    transition: 'all 0.15s',
  };

  const Field = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, color: C.subtle, marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </label>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon style={{ width: 13, height: 13, color: C.subtle, flexShrink: 0 }} />
        <input name={id} value={(form as any)[id]} onChange={handleChange}
          readOnly={!editing} style={inputStyle}
          onFocus={e => { if (editing) e.target.style.borderColor = C.primary; }}
          onBlur={e => { if (editing) e.target.style.borderColor = C.border; }}
        />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
          style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Estudiante</p>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Mi Perfil</h1>
          </div>
          <button onClick={() => setEditing(!editing)} style={{
            padding: '8px 20px', background: editing ? C.gold : C.primary,
            color: '#fff', fontWeight: 600, fontSize: '0.8rem', border: 'none', cursor: 'pointer', borderRadius: 2,
          }}>
            {editing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </motion.div>
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '28px 40px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Avatar block */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
          style={{ background: C.surface, border: `1px solid ${C.border}`, padding: '24px 28px', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 64, background: C.primary, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User style={{ width: 28, height: 28, color: '#fff' }} />
          </div>
          <div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.1rem', color: C.text }}>{form.nombre} {form.apellido}</p>
            <p style={{ fontSize: '0.75rem', color: C.muted, marginTop: 2 }}>Estudiante activo · CC {form.documento}</p>
            <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.active, border: `1px solid ${C.active}44`, padding: '2px 8px', borderRadius: 2, display: 'inline-block', marginTop: 6 }}>Activo</span>
          </div>
        </motion.div>

        {/* Personal info */}
        {[
          {
            title: 'Información Personal', color: C.primary,
            fields: [
              { id: 'nombre',          label: 'Nombre',                icon: User     },
              { id: 'apellido',        label: 'Apellido',              icon: User     },
              { id: 'documento',       label: 'Documento',             icon: User     },
              { id: 'fechaNacimiento', label: 'Fecha de Nacimiento',   icon: Calendar },
            ],
          },
          {
            title: 'Información de Contacto', color: C.gold,
            fields: [
              { id: 'email',     label: 'Correo Electrónico', icon: Mail   },
              { id: 'telefono',  label: 'Teléfono',           icon: Phone  },
              { id: 'direccion', label: 'Dirección',          icon: MapPin },
            ],
          },
          {
            title: 'Información del Acudiente', color: C.muted,
            fields: [
              { id: 'acudiente',         label: 'Nombre del Acudiente',   icon: User  },
              { id: 'telefonoAcudiente', label: 'Teléfono del Acudiente', icon: Phone },
            ],
          },
        ].map((section, si) => (
          <motion.div key={section.title}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + si * 0.08 }}
            style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 20px', borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 3, height: 16, background: section.color, borderRadius: 2 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: C.text, textTransform: 'uppercase' }}>{section.title}</span>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              {section.fields.map(f => (
                <div key={f.id} style={{ flex: '1 1 220px' }}>
                  <Field id={f.id} label={f.label} icon={f.icon} />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        {editing && (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={() => setEditing(false)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 24px', background: C.primary, color: '#fff',
              fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer', borderRadius: 2,
            }}>
              <Save style={{ width: 14, height: 14 }} /> Guardar Cambios
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
