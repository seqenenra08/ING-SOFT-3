import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Building2, Lock, User, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../../theme';

export function BackofficeLogin() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      setLoading(true);
      toast.success('Acceso autorizado');
      setTimeout(() => navigate('/escenarios/backoffice/dashboard'), 900);
    } else {
      toast.error('Ingresa usuario y contraseña');
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
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg, ${C.primary}, ${C.active})` }} />

      {/* Left info panel */}
      <div className="hidden lg:flex" style={{ width: '40%', flexShrink: 0, flexDirection: 'column', justifyContent: 'space-between', padding: '48px 48px', borderRight: `1px solid #2a1212` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 30, height: 30, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
            <Building2 style={{ width: 13, height: 13, color: '#fff' }} />
          </div>
          <div>
            <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#f5f0ef' }}>Sistema de Gestión</p>
            <p style={{ fontSize: '0.58rem', color: '#5a3030', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Escenarios Culturales</p>
          </div>
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
          <div style={{ height: 3, background: `linear-gradient(90deg, ${C.primary}, ${C.active}, ${C.gold})`, marginBottom: 28 }} />

          {/* Mobile brand */}
          <div className="lg:hidden" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 28, height: 28, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <Building2 style={{ width: 12, height: 12, color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#f5f0ef' }}>Sistema de Gestión de Escenarios</p>
            </div>
          </div>

          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 8 }}>Acceso Interno</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.5rem', fontWeight: 700, color: '#fff', marginBottom: 6 }}>Iniciar Sesión</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>Secretaría de Cultura · Backoffice</p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 6 }}>
                Usuario
              </label>
              <div style={{ position: 'relative' }}>
                <User style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 14, height: 14, color: 'rgba(255,255,255,0.2)' }} />
                <input type="text" value={credentials.username}
                  onChange={e => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Ingresa tu usuario" style={inputStyle}
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
                <input type="password" value={credentials.password}
                  onChange={e => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="••••••••" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = `${C.primary}99`}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.09)'}
                />
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
            Acepta cualquier usuario y contraseña (modo demo)
          </p>
        </motion.div>
      </div>
    </div>
  );
}
