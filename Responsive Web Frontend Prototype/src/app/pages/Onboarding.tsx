import { Link } from 'react-router';
import { motion } from 'motion/react';
import { CheckCircle, BookOpen, Bell, User, ArrowRight, GraduationCap } from 'lucide-react';
import { C, accentBar } from '../theme';

const steps = [
  { icon: User,         title: 'Completa tu perfil',  desc: 'Añade más información sobre ti y tus preferencias artísticas.' },
  { icon: BookOpen,     title: 'Explora programas',   desc: 'Descubre toda la oferta académica del centro cultural.' },
  { icon: GraduationCap,title: 'Inscríbete',          desc: 'Elige los programas que más se ajusten a tus intereses.' },
  { icon: Bell,         title: 'Mantente informado',  desc: 'Activa las notificaciones para no perder ninguna novedad.' },
];

export const Onboarding = () => (
  <div style={{
    minHeight: '100vh', background: C.dark,
    fontFamily: "'Inter', sans-serif",
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '48px 24px', position: 'relative', overflow: 'hidden',
  }}>
    {/* Accent bar top */}
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentBar }} />
    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg, ${C.primary}, ${C.active})` }} />

    <div style={{ width: '100%', maxWidth: 560 }}>

      {/* Success mark */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring', stiffness: 200, delay: 0.1 }}
        style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}
      >
        <div style={{
          width: 72, height: 72,
          background: C.primary, border: `4px solid ${C.active}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2,
        }}>
          <CheckCircle style={{ width: 36, height: 36, color: '#fff' }} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        style={{ textAlign: 'center', marginBottom: 36 }}
      >
        <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 12 }}>
          Registro exitoso
        </p>
        <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 'clamp(1.4rem,3vw,2rem)', fontWeight: 700, color: '#fff', marginBottom: 12 }}>
          ¡Bienvenido a Plataforma Lucy Tejada!
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.7 }}>
          Tu cuenta ha sido creada exitosamente. Ahora puedes acceder a todos nuestros programas de formación artística.
        </p>
      </motion.div>

      {/* Steps */}
      <motion.div
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.darkBorder}`, marginBottom: 28 }}
      >
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${C.darkBorder}` }}>
          <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.85rem', letterSpacing: '0.02em' }}>
            Próximos pasos
          </p>
        </div>
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.title}>
              <motion.div
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.08 }}
                style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14,
                  padding: '14px 20px',
                  borderLeft: i === 0 ? `3px solid ${C.active}` : '3px solid transparent',
                }}
              >
                <div style={{
                  width: 32, height: 32, flexShrink: 0,
                  background: `${C.primary}22`, border: `1px solid ${C.primary}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2,
                }}>
                  <Icon style={{ width: 14, height: 14, color: C.active }} />
                </div>
                <div>
                  <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#fff', fontSize: '0.82rem', marginBottom: 3 }}>
                    {s.title}
                  </h3>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.5 }}>{s.desc}</p>
                </div>
              </motion.div>
              {i < steps.length - 1 && <div style={{ height: 1, background: C.darkBorder }} />}
            </div>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{ textAlign: 'center' }}
      >
        <Link to="/estudiante/dashboard">
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '11px 28px', background: C.primary, color: '#fff',
            fontWeight: 600, fontSize: '0.88rem', border: 'none', cursor: 'pointer', borderRadius: 2,
          }}>
            Ir a Mi Dashboard <ArrowRight style={{ width: 14, height: 14 }} />
          </button>
        </Link>
      </motion.div>
    </div>
  </div>
);
