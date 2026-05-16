import { useState } from 'react';
import { motion } from 'motion/react';
import { Settings, Bell, Shield, Database, Users, Palette, Save, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { C } from '../../theme';

const sections = [
  { key: 'general',         icon: Settings, label: 'General',             desc: 'Nombre del sistema, zona horaria, idioma' },
  { key: 'notifications',   icon: Bell,     label: 'Notificaciones',      desc: 'Alertas automáticas, correo, SMS' },
  { key: 'security',        icon: Shield,   label: 'Seguridad',           desc: 'Contraseñas, sesiones, 2FA' },
  { key: 'data',            icon: Database, label: 'Gestión de Datos',    desc: 'Respaldos, exportación, retención' },
  { key: 'roles',           icon: Users,    label: 'Roles y Permisos',    desc: 'Control de acceso por rol' },
  { key: 'appearance',      icon: Palette,  label: 'Apariencia',          desc: 'Tema del sistema, colores institucionales' },
];

const GeneralSection = () => {
  const [form, setForm] = useState({ name: 'Plataforma Lucy Tejada', org: 'Casa de la Cultura', city: 'Pereira', timezone: 'America/Bogota', lang: 'es' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[
        { key: 'name',  label: 'Nombre del sistema',        placeholder: 'Ej: Plataforma Lucy Tejada' },
        { key: 'org',   label: 'Organización',              placeholder: 'Ej: Casa de la Cultura' },
        { key: 'city',  label: 'Ciudad',                    placeholder: 'Ej: Pereira' },
        { key: 'timezone', label: 'Zona horaria',           placeholder: 'Ej: America/Bogota' },
      ].map(f => (
        <div key={f.key}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>{f.label}</label>
          <input value={(form as any)[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            style={{ width: '100%', padding: '9px 12px', background: '#fff', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = C.primary}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        </div>
      ))}
      <div>
        <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>Idioma</label>
        <select value={form.lang} onChange={e => setForm(p => ({ ...p, lang: e.target.value }))}
          style={{ width: '100%', padding: '9px 12px', background: '#fff', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box', cursor: 'pointer' }}>
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>
      </div>
      <button onClick={() => toast.success('Configuración guardada (requiere backend conectado)')}
        style={{ marginTop: 4, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
        <Save style={{ width: 14, height: 14 }} /> Guardar cambios
      </button>
    </div>
  );
};

const NotificationsSection = () => {
  const [settings, setSettings] = useState({ email: true, sms: false, inApp: true, weeklyReport: true, enrollmentAlerts: true, attendanceAlerts: true });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {[
        { key: 'email',            label: 'Notificaciones por correo electrónico', desc: 'Envío automático de alertas al correo del usuario' },
        { key: 'sms',              label: 'Notificaciones por SMS',                desc: 'Mensajes de texto para alertas críticas' },
        { key: 'inApp',            label: 'Notificaciones en plataforma',          desc: 'Centro de notificaciones dentro de la app' },
        { key: 'weeklyReport',     label: 'Reporte semanal automático',            desc: 'Envía resumen de actividad cada lunes' },
        { key: 'enrollmentAlerts', label: 'Alertas de inscripción',                desc: 'Notifica cuando un estudiante se inscribe' },
        { key: 'attendanceAlerts', label: 'Alertas de asistencia',                 desc: 'Aviso cuando hay faltas injustificadas' },
      ].map(s => (
        <div key={s.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
          <div>
            <p style={{ fontSize: '0.82rem', fontWeight: 600, color: C.text }}>{s.label}</p>
            <p style={{ fontSize: '0.7rem', color: C.subtle, marginTop: 2 }}>{s.desc}</p>
          </div>
          <div style={{ position: 'relative', width: 36, height: 20, cursor: 'pointer', flexShrink: 0 }}
            onClick={() => setSettings(p => ({ ...p, [s.key]: !(p as any)[s.key] }))}>
            <div style={{ width: '100%', height: '100%', borderRadius: 10, background: (settings as any)[s.key] ? C.primary : C.border, transition: 'background 0.2s' }} />
            <div style={{ position: 'absolute', top: 2, left: (settings as any)[s.key] ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
          </div>
        </div>
      ))}
      <button onClick={() => toast.success('Preferencias de notificación guardadas')}
        style={{ marginTop: 4, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
        <Save style={{ width: 14, height: 14 }} /> Guardar cambios
      </button>
    </div>
  );
};

const SecuritySection = () => {
  const [settings, setSettings] = useState({ sessionTimeout: '60', twoFactor: false, passwordExpiry: '90', minPasswordLength: '8' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {[
        { key: 'sessionTimeout',    label: 'Tiempo de sesión (minutos)', placeholder: '60' },
        { key: 'passwordExpiry',    label: 'Expiración de contraseña (días)', placeholder: '90' },
        { key: 'minPasswordLength', label: 'Longitud mínima de contraseña', placeholder: '8' },
      ].map(f => (
        <div key={f.key}>
          <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: C.text, marginBottom: 5 }}>{f.label}</label>
          <input type="number" value={(settings as any)[f.key]} onChange={e => setSettings(p => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            style={{ width: '100%', padding: '9px 12px', background: '#fff', border: `1px solid ${C.border}`, color: C.text, fontSize: '0.82rem', outline: 'none', borderRadius: 2, boxSizing: 'border-box' }}
            onFocus={e => e.target.style.borderColor = C.primary}
            onBlur={e => e.target.style.borderColor = C.border}
          />
        </div>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 2 }}>
        <div>
          <p style={{ fontSize: '0.82rem', fontWeight: 600, color: C.text }}>Autenticación de dos factores</p>
          <p style={{ fontSize: '0.7rem', color: C.subtle, marginTop: 2 }}>Requerir verificación adicional al iniciar sesión</p>
        </div>
        <div style={{ position: 'relative', width: 36, height: 20, cursor: 'pointer', flexShrink: 0 }}
          onClick={() => setSettings(p => ({ ...p, twoFactor: !p.twoFactor }))}>
          <div style={{ width: '100%', height: '100%', borderRadius: 10, background: settings.twoFactor ? C.primary : C.border, transition: 'background 0.2s' }} />
          <div style={{ position: 'absolute', top: 2, left: settings.twoFactor ? 18 : 2, width: 16, height: 16, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
        </div>
      </div>
      <button onClick={() => toast.success('Configuración de seguridad guardada')}
        style={{ marginTop: 4, alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 20px', background: C.primary, color: '#fff', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', borderRadius: 2 }}>
        <Save style={{ width: 14, height: 14 }} /> Guardar cambios
      </button>
    </div>
  );
};

const PlaceholderSection = ({ label }: { label: string }) => (
  <div style={{ padding: '32px', textAlign: 'center', color: C.subtle, background: '#fff', border: `1px solid ${C.border}` }}>
    <p style={{ fontSize: '0.9rem', marginBottom: 6 }}>Módulo: {label}</p>
    <p style={{ fontSize: '0.75rem' }}>Disponible al conectar el backend</p>
  </div>
);

const sectionContent: Record<string, React.ReactNode> = {
  general:       <GeneralSection />,
  notifications: <NotificationsSection />,
  security:      <SecuritySection />,
  data:          <PlaceholderSection label="Gestión de Datos" />,
  roles:         <PlaceholderSection label="Roles y Permisos" />,
  appearance:    <PlaceholderSection label="Apariencia" />,
};

export const AdminSettings = () => {
  const [active, setActive] = useState('general');
  const activeSection = sections.find(s => s.key === active)!;
  const ActiveIcon = activeSection.icon;

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: C.dark, padding: '28px 40px', borderBottom: `1px solid #2a1212`, position: 'relative' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: C.primary }} />
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <p style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.active, marginBottom: 6 }}>Administración</p>
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '1.6rem', fontWeight: 700, color: '#fff' }}>Configuración del Sistema</h1>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>Gestiona los parámetros globales de la plataforma</p>
        </motion.div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 40px', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Sidebar nav */}
        <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          style={{ width: 230, flexShrink: 0, background: '#fff', border: `1px solid ${C.border}` }}>
          {sections.map((s, i, arr) => {
            const Icon = s.icon;
            const isActive = s.key === active;
            return (
              <div key={s.key}>
                <button onClick={() => setActive(s.key)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: isActive ? C.tint : 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.15s', borderLeft: isActive ? `3px solid ${C.primary}` : '3px solid transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Icon style={{ width: 15, height: 15, color: isActive ? C.primary : C.muted }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: isActive ? 700 : 400, color: isActive ? C.text : C.muted }}>{s.label}</span>
                  </div>
                  <ChevronRight style={{ width: 12, height: 12, color: isActive ? C.primary : C.subtle }} />
                </button>
                {i < arr.length - 1 && <div style={{ height: 1, background: C.border }} />}
              </div>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div key={active} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
          style={{ flex: 1 }}>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <ActiveIcon style={{ width: 16, height: 16, color: C.primary }} />
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '1.05rem', color: C.text }}>{activeSection.label}</h2>
            </div>
            <p style={{ fontSize: '0.75rem', color: C.subtle }}>{activeSection.desc}</p>
          </div>
          {sectionContent[active]}
        </motion.div>
      </div>
    </div>
  );
};
