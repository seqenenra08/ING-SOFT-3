import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { BookOpen, Loader2, CheckCircle, ArrowLeft, Mail } from 'lucide-react';
import { C, accentBar } from '../theme';

export const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setSent(true);
    } catch {
      setError('No se pudo enviar el correo. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSent(false);
    setError('');
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '48px 24px', background: C.bg, fontFamily: "'Inter', sans-serif",
    }}>
      <motion.div
        style={{ width: '100%', maxWidth: 400 }}
        initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Brand */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div style={{ width: 28, height: 28, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
            <BookOpen style={{ width: 12, height: 12, color: '#fff' }} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: C.text, fontSize: '0.88rem' }}>Plataforma Lucy Tejada</span>
        </Link>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, overflow: 'hidden' }}>
          <div style={{ height: 3, background: accentBar }} />
          <div style={{ padding: '32px 28px' }}>

            {!sent ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 36, height: 36, background: C.tint, border: `1px solid ${C.active}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
                    <Mail style={{ width: 16, height: 16, color: C.primary }} />
                  </div>
                  <div>
                    <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.2rem', fontWeight: 700, color: C.text }}>
                      Recuperar Contraseña
                    </h2>
                    <p style={{ fontSize: '0.75rem', color: C.muted, marginTop: 2 }}>Te enviaremos un enlace de restablecimiento</p>
                  </div>
                </div>

                {error && (
                  <div role="alert" style={{ marginBottom: 14, padding: '10px 12px', background: C.tint, borderLeft: `3px solid ${C.active}`, fontSize: '0.78rem', color: C.active }}>
                    {error}
                  </div>
                )}
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <label htmlFor="recovery-email" style={{ display: 'block', fontSize: '0.7rem', fontWeight: 600, color: C.text, marginBottom: 5, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                      Correo Electrónico
                    </label>
                    <input id="recovery-email" name="email" type="email" autoComplete="email"
                      value={email} onChange={e => { setEmail(e.target.value); if (error) setError(''); }}
                      placeholder="tu@email.com" required disabled={loading}
                      style={{
                        width: '100%', padding: '9px 12px', fontSize: '0.82rem',
                        background: C.surfaceAlt, border: `1px solid ${C.border}`,
                        color: C.text, outline: 'none', borderRadius: 2, boxSizing: 'border-box',
                      }}
                      onFocus={e => e.target.style.borderColor = C.primary}
                      onBlur={e => e.target.style.borderColor = C.border}
                    />
                  </div>
                  <button type="submit" disabled={loading} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '10px 0', background: loading ? C.muted : C.primary,
                    color: '#fff', fontWeight: 600, fontSize: '0.85rem',
                    border: 'none', cursor: loading ? 'default' : 'pointer', borderRadius: 2,
                  }}>
                    {loading
                      ? <><Loader2 style={{ width: 14, height: 14 }} className="animate-spin" /> Enviando...</>
                      : 'Enviar Enlace de Recuperación'
                    }
                  </button>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{ textAlign: 'center', padding: '16px 0' }}
              >
                <div style={{
                  width: 56, height: 56, background: C.primary,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 2, margin: '0 auto 20px',
                }}>
                  <CheckCircle style={{ width: 28, height: 28, color: '#fff' }} />
                </div>
                <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.2rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                  Correo Enviado
                </h2>
                <p style={{ fontSize: '0.8rem', color: C.muted, lineHeight: 1.6, marginBottom: 6 }}>
                  Hemos enviado un enlace a <strong style={{ color: C.text }}>{email}</strong>. Revisa tu bandeja de entrada.
                </p>
                <p style={{ fontSize: '0.72rem', color: C.subtle }}>Si no recibes el correo, revisa tu carpeta de spam.</p>
                <button type="button" onClick={handleReset}
                  style={{ marginTop: 18, padding: '8px 16px', background: 'transparent', color: C.muted, fontWeight: 600, fontSize: '0.78rem', border: `1px solid ${C.border}`, cursor: 'pointer', borderRadius: 2 }}>
                  Cambiar correo
                </button>
              </motion.div>
            )}

            <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
              <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 600, color: C.active }}>
                <ArrowLeft style={{ width: 13, height: 13 }} />
                Volver a Iniciar Sesión
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
