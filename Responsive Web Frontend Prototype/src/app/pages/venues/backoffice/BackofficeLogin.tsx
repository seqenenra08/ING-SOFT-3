import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Building2, Lock, Mail, ArrowRight, Loader2, ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../context/AuthContext';
import { C } from '../../../theme';

const accentBar = `linear-gradient(90deg, ${C.primary}, ${C.active}, ${C.gold})`;

export function BackofficeLogin() {
  const navigate = useNavigate();
  const { login, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError('Ingresa tu correo y contraseña'); return; }
    setError('');
    setLoading(true);
    try {
      const role = await login(email, password);
      if (role !== 'administrador') {
        // Login funcionó pero el rol no es válido para el backoffice: revertimos
        logout();
        setError('Esta cuenta no tiene acceso al backoffice. Solo administradores pueden ingresar.');
        setLoading(false);
        return;
      }
      toast.success('Bienvenido');
      navigate('/escenarios/backoffice/dashboard');
    } catch {
      setError('Correo o contraseña incorrectos.');
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px 10px 40px', fontSize: '0.82rem',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
    color: '#f5f0ef', outline: 'none', borderRadius: 2, boxSizing: 'border-box',
    caretColor: C.active, transition: 'border-color 0.15s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: C.dark, fontFamily: "'Inter', sans-serif" }}>
      {/* Accent left bar */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: accentBar }} />

      {/* Left info panel */}
      <div style={{ width: '40%', flexShrink: 0, flexDirection: 'column', justifyContent: 'space-between', padding: '48px 48px', borderRight: `1px solid #2a1212`, display: 'flex' }}
        className="hidden lg:flex">
        <div>
          <Link to="/escenarios" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
            <div style={{ width: 30, height: 30, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <Building2 style={{ width: 13, height: 13, color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#f5f0ef' }}>Sistema de Gestión</p>
              <p style={{ fontSize: '0.58rem', color: '#5a3030', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Escenarios Culturales</p>
            </div>
          </Link>
          <Link to="/escenarios"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginTop: 16, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#f5f0ef'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'}>
            <ArrowLeft style={{ width: 12, height: 12 }} /> Volver al portal público
          </Link>
        </div>
        <div>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 16 }}>Acceso Institucional</p>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.4rem,2.5vw,2rem)', fontWeight: 700, color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
            Secretaría de Cultura<br />Alcaldía de Pereira
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.3)', lineHeight: 1.7 }}>
            Plataforma interna para la gestión de solicitudes, contratos, pagos y mantenimiento de escenarios culturales del municipio.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ShieldCheck style={{ width: 14, height: 14, color: '#5a3030' }} />
          <p style={{ fontSize: '0.72rem', color: '#5a3030' }}>Acceso restringido a funcionarios autorizados</p>
        </div>
      </div>

      {/* Right form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
        <motion.div style={{ width: '100%', maxWidth: 380 }}
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Top accent */}
          <div style={{ height: 3, background: accentBar, marginBottom: 28 }} />

          {/* Mobile brand */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 24 }}>
            <Link to="/escenarios" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                <Building2 style={{ width: 12, height: 12, color: '#fff' }} />
              </div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#f5f0ef' }}>Sistema de Gestión de Escenarios</p>
            </Link>
          </div>

          {/* Back link (always visible above title) */}
          <Link to="/escenarios"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: 16, transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.color = '#f5f0ef'}
            onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.4)'}>
            <ArrowLeft style={{ width: 12, height: 12 }} /> Volver al portal público
          </Link>

          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 8 }}>Acceso Interno</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>Iniciar Sesión</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>Secretaría de Cultura · Backoffice</p>

          {error && (
            <div style={{ marginBottom: 16, padding: '10px 14px', background: `${C.active}18`, border: `1px solid ${C.active}44`, borderRadius: 2 }}>
              <p style={{ fontSize: '0.75rem', color: C.active }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                Correo electrónico
              </label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.2)' }} />
                <input type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="correo@pereira.gov.co" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = `${C.primary}99`}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                Contraseña
              </label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.2)' }} />
                <input type={showPass ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" style={{ ...inputStyle, paddingRight: 40 }}
                  onFocus={e => e.target.style.borderColor = `${C.primary}99`}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', padding: 4, display: 'flex', alignItems: 'center' }}>
                  {showPass ? <EyeOff style={{ width: 14, height: 14 }} /> : <Eye style={{ width: 14, height: 14 }} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              padding: '11px 0', background: loading ? C.muted : C.primary,
              color: '#fff', fontWeight: 600, fontSize: '0.85rem',
              border: 'none', cursor: loading ? 'default' : 'pointer', borderRadius: 2, marginTop: 4,
            }}>
              {loading
                ? <><Loader2 style={{ width: 15, height: 15 }} className="animate-spin" /> Verificando...</>
                : <>Ingresar al sistema <ArrowRight style={{ width: 14, height: 14 }} /></>
              }
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'rgba(255,255,255,0.15)', marginTop: 20 }}>
            Solo cuentas con rol de administrador pueden acceder.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
