import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Loader2, ArrowRight, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { C, accentBar } from '../theme';

interface FieldProps {
  id: string; label: string; type?: string; placeholder?: string; required?: boolean;
  value: string;
  error?: string;
  autoComplete?: string;
  inputMode?: 'text' | 'tel' | 'email' | 'numeric' | 'decimal' | 'search' | 'url';
  max?: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

function Field({ id, label, type = 'text', placeholder = '', required = false, value, error, autoComplete, inputMode, max, onChange }: FieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const effectiveType = isPassword && show ? 'text' : type;
  return (
    <div>
      <label htmlFor={id} style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: C.text, marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: C.active }}> *</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input id={id} name={id} type={effectiveType}
          value={value} onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          max={max}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          style={{
            width: '100%', padding: '9px 12px', fontSize: '0.82rem',
            paddingRight: isPassword ? 38 : 12,
            background: C.surfaceAlt, border: `1px solid ${error ? C.active : C.border}`,
            color: C.text, outline: 'none', borderRadius: 2, boxSizing: 'border-box',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => e.target.style.borderColor = C.primary}
          onBlur={e => e.target.style.borderColor = error ? C.active : C.border}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(s => !s)}
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.muted, padding: 0 }}>
            {show ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
          </button>
        )}
      </div>
      {error && <p id={`${id}-error`} role="alert" style={{ fontSize: '0.7rem', color: C.active, marginTop: 3 }}>{error}</p>}
    </div>
  );
}

const todayIso = () => new Date().toISOString().slice(0, 10);

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
    const next = { ...formData, [e.target.name]: e.target.value };
    setFormData(next);
    const cleared = { ...errors };
    if (cleared[e.target.name]) cleared[e.target.name] = '';
    if (cleared.general) cleared.general = '';
    if ((e.target.name === 'password' || e.target.name === 'confirmPassword') && next.confirmPassword && next.password !== next.confirmPassword) {
      cleared.confirmPassword = 'Las contraseñas no coinciden';
    } else if (e.target.name === 'password' || e.target.name === 'confirmPassword') {
      cleared.confirmPassword = '';
    }
    setErrors(cleared);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.nombre) errs.nombre = 'El nombre es requerido';
    if (!formData.apellido) errs.apellido = 'El apellido es requerido';
    if (!formData.documento) errs.documento = 'El documento es requerido';
    if (!formData.email) errs.email = 'El correo es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Correo no válido';
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
    } catch (err: any) {
      setErrors({ general: err?.message ?? 'Error al registrar. Intenta nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  const F = (
    id: string,
    label: string,
    type = 'text',
    placeholder = '',
    required = false,
    extra: { autoComplete?: string; inputMode?: FieldProps['inputMode']; max?: string } = {}
  ) => (
    <Field id={id} label={label} type={type} placeholder={placeholder} required={required}
      value={(formData as any)[id]} error={errors[id]} onChange={handleChange}
      autoComplete={extra.autoComplete} inputMode={extra.inputMode} max={extra.max} />
  );

  const sections = [
    {
      num: '01', title: 'Información Personal', color: C.primary,
      fields: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ flex: '1 1 200px' }}>{F('nombre', 'Nombre', 'text', '', true, { autoComplete: 'given-name' })}</div>
          <div style={{ flex: '1 1 200px' }}>{F('apellido', 'Apellido', 'text', '', true, { autoComplete: 'family-name' })}</div>
          <div style={{ flex: '1 1 200px' }}>{F('documento', 'Documento de Identidad', 'text', '1234567890', true, { inputMode: 'numeric' })}</div>
          <div style={{ flex: '1 1 200px' }}>{F('fechaNacimiento', 'Fecha de Nacimiento', 'date', '', false, { max: todayIso() })}</div>
        </div>
      ),
    },
    {
      num: '02', title: 'Información de Contacto', color: C.gold,
      fields: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ flex: '1 1 100%' }}>{F('email', 'Correo Electrónico', 'email', 'tu@email.com', true, { autoComplete: 'email' })}</div>
          <div style={{ flex: '1 1 200px' }}>{F('telefono', 'Teléfono', 'tel', '320 123 4567', false, { autoComplete: 'tel', inputMode: 'tel' })}</div>
          <div style={{ flex: '1 1 200px' }}>{F('direccion', 'Dirección', 'text', 'Calle 10 #20-30', false, { autoComplete: 'street-address' })}</div>
        </div>
      ),
    },
    {
      num: '03', title: 'Información del Acudiente', color: C.muted,
      fields: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ flex: '1 1 200px' }}>{F('acudiente', 'Nombre del Acudiente')}</div>
          <div style={{ flex: '1 1 200px' }}>{F('telefonoAcudiente', 'Teléfono del Acudiente', 'tel', '315 123 4567', false, { inputMode: 'tel' })}</div>
        </div>
      ),
    },
    {
      num: '04', title: 'Seguridad', color: C.active,
      fields: (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ flex: '1 1 200px' }}>{F('password', 'Contraseña', 'password', '••••••••', true, { autoComplete: 'new-password' })}</div>
          <div style={{ flex: '1 1 200px' }}>{F('confirmPassword', 'Confirmar Contraseña', 'password', '••••••••', true, { autoComplete: 'new-password' })}</div>
        </div>
      ),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif", padding: '40px 24px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Brand + back */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <BookOpen style={{ width: 12, height: 12, color: '#fff' }} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>Plataforma Lucy Tejada</span>
          </Link>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: C.muted, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = C.text}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = C.muted}>
            <ArrowLeft style={{ width: 13, height: 13 }} /> Volver al inicio
          </Link>
        </div>

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
