import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BookOpen, GraduationCap, Bell, User,
  Users, UserCog, Calendar, BarChart3, Settings,
  FileText, AlertCircle, LogOut, ChevronDown, Menu, X
} from 'lucide-react';

const C = {
  bg:     '#0c0202',
  primary:'#8b1a1a',
  active: '#c0392b',
  gold:   '#a16207',
  text:   '#f5f0ef',
  muted:  '#a08888',
  border: '#2a1212',
};

const studentLinks = [
  { to: '/estudiante/dashboard',      icon: LayoutDashboard, label: 'Inicio' },
  { to: '/estudiante/programas',      icon: BookOpen,        label: 'Programas' },
  { to: '/estudiante/mis-programas',  icon: GraduationCap,   label: 'Mis Programas' },
  { to: '/estudiante/progreso',       icon: BarChart3,       label: 'Mi Progreso' },
  { to: '/estudiante/notificaciones', icon: Bell,            label: 'Notificaciones' },
  { to: '/estudiante/perfil',         icon: User,            label: 'Mi Perfil' },
];

const educadorLinks = [
  { to: '/educador/dashboard', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/educador/grupos',    icon: Users,           label: 'Mis Grupos' },
  { to: '/educador/horario',   icon: Calendar,        label: 'Horario' },
  { to: '/educador/alertas',   icon: AlertCircle,     label: 'Alertas' },
  { to: '/educador/perfil',    icon: User,            label: 'Mi Perfil' },
];

const adminLinks = [
  { to: '/admin/dashboard',      icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/estudiantes',    icon: Users,           label: 'Estudiantes' },
  { to: '/admin/educadores',     icon: UserCog,         label: 'Educadores' },
  { to: '/admin/programas',      icon: BookOpen,        label: 'Programas' },
  { to: '/admin/reportes',       icon: FileText,        label: 'Reportes' },
  { to: '/admin/notificaciones', icon: Bell,            label: 'Notificaciones' },
  { to: '/admin/configuracion',  icon: Settings,        label: 'Configuración' },
];

const roleMeta: Record<string, { label: string }> = {
  estudiante:    { label: 'Estudiante' },
  educador:      { label: 'Educador' },
  administrador: { label: 'Administrador' },
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  right: 0,
  top: 'calc(100% + 8px)',
  width: 200,
  background: '#100808',
  border: `1px solid ${C.border}`,
  borderRadius: 4,
  overflow: 'hidden',
  boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
};

export const TopNav = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const links =
    user?.role === 'estudiante' ? studentLinks :
    user?.role === 'educador'   ? educadorLinks :
    adminLinks;

  const rm = roleMeta[user?.role ?? 'estudiante'];

  return (
    <>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${C.primary}, ${C.active}, ${C.gold})` }} />

      <header style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-8">
          <div className="flex items-center h-14 gap-6">

            {/* Brand */}
            <Link to="/" className="flex items-center gap-3 flex-shrink-0">
              <div style={{
                width: 32, height: 32, background: C.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              }}>
                <BookOpen style={{ width: 14, height: 14, color: '#fff' }} />
              </div>
              <div>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700, fontSize: '0.9rem',
                  color: C.text, letterSpacing: '0.02em',
                }}>
                  LUCY TEJADA
                </span>
                <span style={{
                  display: 'block', fontSize: '0.6rem', color: C.muted,
                  letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: -2,
                }}>
                  Centro Cultural
                </span>
              </div>
            </Link>

            <div style={{ width: 1, height: 24, background: C.border, flexShrink: 0 }} />

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center h-full flex-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link key={link.to} to={link.to} style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '0 14px', height: '100%',
                        color: isActive ? '#fff' : C.muted,
                        fontSize: '0.8rem', fontWeight: isActive ? 600 : 400,
                        letterSpacing: '0.02em', cursor: 'pointer',
                        transition: 'color 0.18s',
                      }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.color = C.text; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.color = C.muted; }}
                    >
                      <Icon style={{ width: 13, height: 13, flexShrink: 0 }} />
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active"
                          style={{
                            position: 'absolute', bottom: 0, left: 14, right: 14,
                            height: 2, background: C.active, borderRadius: '2px 2px 0 0',
                          }}
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
              <span className="hidden sm:inline-flex" style={{
                fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: C.active,
                padding: '3px 8px', border: `1px solid ${C.primary}`,
                borderRadius: 2,
              }}>
                {rm?.label}
              </span>

              {/* User menu */}
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(v => !v)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '5px 8px', borderRadius: 4,
                    background: 'transparent', border: 'none', cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,26,26,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {user?.avatar
                    ? <img src={user.avatar} alt="" style={{ width: 28, height: 28, borderRadius: 4, objectFit: 'cover', border: `1.5px solid ${C.primary}` }} />
                    : (
                      <div style={{ width: 28, height: 28, borderRadius: 4, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User style={{ width: 14, height: 14, color: '#fff' }} />
                      </div>
                    )
                  }
                  <span className="hidden sm:block" style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown style={{
                    width: 13, height: 13, color: C.muted,
                    transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }}
                      style={dropdownStyle}
                    >
                      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}` }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text }}>{user?.name}</p>
                        <p style={{ fontSize: '0.7rem', color: C.muted, marginTop: 2 }}>{user?.email}</p>
                      </div>
                      <div style={{ padding: 4 }}>
                        <Link
                          to={`/${user?.role === 'administrador' ? 'admin' : user?.role}/perfil`}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <div
                            style={{
                              display: 'flex', alignItems: 'center', gap: 8,
                              padding: '7px 10px', borderRadius: 3, cursor: 'pointer',
                              color: C.muted, fontSize: '0.8rem', transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => {
                              (e.currentTarget as HTMLDivElement).style.background = 'rgba(139,26,26,0.2)';
                              (e.currentTarget as HTMLDivElement).style.color = C.text;
                            }}
                            onMouseLeave={e => {
                              (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                              (e.currentTarget as HTMLDivElement).style.color = C.muted;
                            }}
                          >
                            <User style={{ width: 13, height: 13 }} />
                            Mi Perfil
                          </div>
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          style={{
                            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                            padding: '7px 10px', borderRadius: 3, cursor: 'pointer',
                            color: C.active, fontSize: '0.8rem', background: 'none',
                            border: 'none', transition: 'all 0.15s',
                          }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(192,57,43,0.15)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                        >
                          <LogOut style={{ width: 13, height: 13 }} />
                          Cerrar Sesión
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile toggle */}
              <button
                className="lg:hidden"
                onClick={() => setMobileOpen(v => !v)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              >
                {mobileOpen
                  ? <X style={{ width: 18, height: 18, color: C.muted }} />
                  : <Menu style={{ width: 18, height: 18, color: C.muted }} />
                }
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              style={{ overflow: 'hidden', borderTop: `1px solid ${C.border}` }}
            >
              <div style={{ padding: '8px 16px 12px' }}>
                {links.map(link => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.to;
                  return (
                    <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 3, marginBottom: 2,
                        background: isActive ? 'rgba(139,26,26,0.25)' : 'transparent',
                        color: isActive ? '#fff' : C.muted,
                        fontSize: '0.82rem', fontWeight: isActive ? 600 : 400,
                        borderLeft: isActive ? `2px solid ${C.active}` : '2px solid transparent',
                      }}>
                        <Icon style={{ width: 14, height: 14 }} />
                        {link.label}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};
