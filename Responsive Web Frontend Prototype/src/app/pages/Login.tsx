import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Loader2, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { C, accentBar } from '../theme';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      if (email.includes('estudiante')) navigate('/estudiante/dashboard');
      else if (email.includes('educador')) navigate('/educador/dashboard');
      else if (email.includes('admin')) navigate('/admin/dashboard');
    } catch {
      setError('Credenciales incorrectas. Verifica tu usuario y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (focused: boolean): React.CSSProperties => ({
    width: '100%', padding: '10px 14px', fontSize: '0.85rem',
    background: C.surfaceAlt, border: `1px solid ${focused ? C.primary : C.border}`,
    color: C.text, outline: 'none', borderRadius: 2,
    transition: 'border-color 0.15s',
    boxSizing: 'border-box',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left panel ──────────────────────── */}
      <div className="hidden lg:flex" style={{
        width: '45%', flexShrink: 0,
        background: C.dark, flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px',
        borderRight: `1px solid ${C.darkBorder}`, position: 'relative', overflow: 'hidden',
      }}>
        {/* Accent line */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: accentBar.replace('linear-gradient(90deg,', 'linear-gradient(180deg,').replace(')', ')') }} />

        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)' }}>
            <BookOpen style={{ width: 14, height: 14, color: '#fff' }} />
          </div>
          <div>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.88rem', color: '#f5f0ef', letterSpacing: '0.02em' }}>LUCY TEJADA</span>
            <span style={{ display: 'block', fontSize: '0.58rem', color: '#a08888', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: -2 }}>Centro Cultural</span>
          </div>
        </Link>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 16 }}>
            Portal Educativo
          </p>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.6rem,3vw,2.4rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
            Bienvenido al<br />Centro Cultural
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.7, marginBottom: 40 }}>
            Donde el arte y la educación se encuentran para transformar vidas en Pereira.
          </p>
          <div style={{ display: 'flex', gap: 20, paddingTop: 28, borderTop: `1px solid ${C.darkBorder}` }}>
            {[['500+', 'Estudiantes'], ['8', 'Disciplinas'], ['15+', 'Educadores']].map(([n, l]) => (
              <div key={l}>
                <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.4rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>{n}</p>
                <p style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)', marginTop: 3 }}>{l}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bottom image strip */}
        <div style={{ display: 'flex', gap: 6, opacity: 0.4 }}>
          {[
            'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?w=300&h=140&fit=crop',
            'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=300&h=140&fit=crop',
            'https://images.unsplash.com/photo-1547153760-18fc86324498?w=300&h=140&fit=crop',
          ].map((src, i) => (
            <img key={i} src={src} alt="" style={{ flex: 1, height: 72, objectFit: 'cover', borderRadius: 2 }} />
          ))}
        </div>
      </div>

      {/* ── Right panel (form) ──────────────── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px', background: C.bg }}>
        <motion.div
          style={{ width: '100%', maxWidth: 400 }}
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile brand */}
          <Link to="/" className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 }}>
            <div style={{ width: 28, height: 28, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <BookOpen style={{ width: 12, height: 12, color: '#fff' }} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>Plataforma Lucy Tejada</span>
          </Link>

          {/* Top accent */}
          <div style={{ height: 3, background: accentBar, marginBottom: 28 }} />

          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 8 }}>Portal educativo</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: C.text, marginBottom: 6 }}>Iniciar Sesión</h1>
          <p style={{ fontSize: '0.8rem', color: C.muted, marginBottom: 28 }}>Ingresa a tu cuenta para continuar</p>

          {error && (
            <div style={{ marginBottom: 20, padding: '10px 14px', background: C.tint, border: `1px solid ${C.active}55`, borderLeft: `3px solid ${C.active}`, fontSize: '0.8rem', color: C.active }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: C.text, marginBottom: 6, letterSpacing: '0.02em' }}>
                CORREO ELECTRÓNICO
              </label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                style={inputStyle(false)}
                onFocus={e => e.target.style.borderColor = C.primary}
                onBlur={e => e.target.style.borderColor = C.border}
              />
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: C.text, letterSpacing: '0.02em' }}>CONTRASEÑA</label>
                <Link to="/recuperar-contrasena" style={{ fontSize: '0.72rem', color: C.active }}>¿Olvidaste?</Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{ ...inputStyle(false), paddingRight: 40 }}
                  onFocus={e => e.target.style.borderColor = C.primary}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: C.subtle }}>
                  {showPass ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 0', background: loading ? C.muted : C.primary,
              color: '#fff', fontWeight: 600, fontSize: '0.85rem', border: 'none',
              cursor: loading ? 'default' : 'pointer', borderRadius: 2,
              transition: 'background 0.15s',
            }}>
              {loading ? <><Loader2 style={{ width: 15, height: 15 }} className="animate-spin" /> Iniciando sesión...</> : <>Iniciar Sesión <ArrowRight style={{ width: 14, height: 14 }} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.8rem', color: C.muted, marginTop: 20 }}>
            ¿No tienes cuenta?{' '}
            <Link to="/registro" style={{ fontWeight: 600, color: C.active }}>Regístrate aquí</Link>
          </p>

          {/* Demo credentials */}
          <div style={{ marginTop: 28, padding: '14px 16px', background: C.surfaceAlt, border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.primary}` }}>
            <p style={{ fontSize: '0.7rem', fontWeight: 700, color: C.primary, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Credenciales de prueba
            </p>
            <div style={{ fontSize: '0.72rem', color: C.muted, display: 'flex', flexDirection: 'column', gap: 3 }}>
              <p><strong style={{ color: C.primary }}>Estudiante:</strong> estudiante@demo.com / password</p>
              <p><strong style={{ color: C.primary }}>Educador:</strong> educador@demo.com / password</p>
              <p><strong style={{ color: C.primary }}>Admin:</strong> admin@demo.com / password</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
