import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { C, accentBar } from '../theme';

export const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', documento: '', email: '', telefono: '',
    fechaNacimiento: '', direccion: '', acudiente: '', telefonoAcudiente: '',
    password: '', confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.nombre) errs.nombre = 'El nombre es requerido';
    if (!formData.apellido) errs.apellido = 'El apellido es requerido';
    if (!formData.documento) errs.documento = 'El documento es requerido';
    if (!formData.email) errs.email = 'El correo es requerido';
    if (!formData.password) errs.password = 'La contraseña es requerida';
    if (formData.password && formData.password.length < 6) errs.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(formData);
      navigate('/onboarding');
    } catch {
      setErrors({ general: 'Error al registrar. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ id, label, type = 'text', placeholder = '', required = false }: {
    id: string; label: string; type?: string; placeholder?: string; required?: boolean;
  }) => (
    <div>
      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: C.text, marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: C.active }}> *</span>}
      </label>
      <input id={id} name={id} type={type}
        value={(formData as any)[id]} onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '9px 12px', fontSize: '0.82rem',
          background: C.surfaceAlt, border: `1px solid ${errors[id] ? C.active : C.border}`,
          color: C.text, outline: 'none', borderRadius: 2, boxSizing: 'border-box',
          transition: 'border-color 0.15s',
        }}
        onFocus={e => e.target.style.borderColor = C.primary}
        onBlur={e => e.target.style.borderColor = errors[id] ? C.active : C.border}
      />
      {errors[id] && <p style={{ fontSize: '0.7rem', color: C.active, marginTop: 3 }}>{errors[id]}</p>}
    </div>
  );

  const sections = [
    {
      num: '01', title: 'Información Personal', color: C.primary,
      fields: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ flex: '1 1 200px' }}><Field id="nombre" label="Nombre" required /></div>
          <div style={{ flex: '1 1 200px' }}><Field id="apellido" label="Apellido" required /></div>
          <div style={{ flex: '1 1 200px' }}><Field id="documento" label="Documento de Identidad" required placeholder="1234567890" /></div>
          <div style={{ flex: '1 1 200px' }}><Field id="fechaNacimiento" label="Fecha de Nacimiento" type="date" /></div>
        </div>
      ),
    },
    {
      num: '02', title: 'Información de Contacto', color: C.gold,
      fields: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ flex: '1 1 100%' }}><Field id="email" label="Correo Electrónico" type="email" required placeholder="tu@email.com" /></div>
          <div style={{ flex: '1 1 200px' }}><Field id="telefono" label="Teléfono" placeholder="320 123 4567" /></div>
          <div style={{ flex: '1 1 200px' }}><Field id="direccion" label="Dirección" placeholder="Calle 10 #20-30" /></div>
        </div>
      ),
    },
    {
      num: '03', title: 'Información del Acudiente', color: C.muted,
      fields: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ flex: '1 1 200px' }}><Field id="acudiente" label="Nombre del Acudiente" /></div>
          <div style={{ flex: '1 1 200px' }}><Field id="telefonoAcudiente" label="Teléfono del Acudiente" placeholder="315 123 4567" /></div>
        </div>
      ),
    },
    {
      num: '04', title: 'Seguridad', color: C.active,
      fields: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ flex: '1 1 200px' }}><Field id="password" label="Contraseña" type="password" required placeholder="••••••••" /></div>
          <div style={{ flex: '1 1 200px' }}><Field id="confirmPassword" label="Confirmar Contraseña" type="password" required placeholder="••••••••" /></div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif", padding: '40px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Brand */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 28, height: 28, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
            <BookOpen style={{ width: 12, height: 12, color: '#fff' }} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>Plataforma Lucy Tejada</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ background: C.surface, border: `1px solid ${C.border}`, overflow: 'hidden' }}
        >
          {/* Accent bar */}
          <div style={{ height: 3, background: accentBar }} />

          <div style={{ padding: '32px 36px' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ width: 40, height: 40, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                <BookOpen style={{ width: 18, height: 18, color: '#fff' }} />
              </div>
              <div>
                <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: C.text }}>
                  Registro de Estudiante
                </h1>
                <p style={{ fontSize: '0.78rem', color: C.muted, marginTop: 2 }}>Completa el formulario para crear tu cuenta</p>
              </div>
            </div>

            {errors.general && (
              <div style={{ marginBottom: 24, padding: '10px 14px', background: C.tint, borderLeft: `3px solid ${C.active}`, fontSize: '0.8rem', color: C.active }}>
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {sections.map((s, i) => (
                <div key={s.num} style={{ paddingBottom: 28, marginBottom: 28, borderBottom: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                    <div style={{ width: 4, height: 16, background: s.color, borderRadius: 2 }} />
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.muted }}>{s.num}</span>
                    <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>{s.title}</h3>
                  </div>
                  {s.fields}
                </div>
              ))}

              {/* Submit */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8 }}>
                <Link to="/login" style={{ fontSize: '0.8rem', color: C.active, fontWeight: 500 }}>
                  ¿Ya tienes cuenta? Inicia sesión
                </Link>
                <button type="submit" disabled={loading} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 24px', background: loading ? C.muted : C.primary,
                  color: '#fff', fontWeight: 600, fontSize: '0.85rem',
                  border: 'none', cursor: loading ? 'default' : 'pointer', borderRadius: 2,
                }}>
                  {loading
                    ? <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Registrando...</>
                    : <><CheckCircle2 style={{ width: 14, height: 14 }} /> Crear Cuenta <ArrowRight style={{ width: 13, height: 13 }} /></>
                  }
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
