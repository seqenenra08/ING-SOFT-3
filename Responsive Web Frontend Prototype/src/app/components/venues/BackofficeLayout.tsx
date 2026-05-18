import { useEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import {
  Building2, FileText, LogOut, User, ChevronDown,
  LayoutDashboard, Folders, Receipt, Calendar, Wrench, Scale,
  BarChart3, Menu, X, ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const C = {
  bg:     '#0c0202',
  primary:'#8b1a1a',
  active: '#c0392b',
  gold:   '#a16207',
  text:   '#f5f0ef',
  muted:  '#a08888',
  border: '#2a1212',
} as const;

const navItems = [
  { to: '/escenarios/backoffice/dashboard',        icon: LayoutDashboard, label: 'Dashboard'    },
  { to: '/escenarios/backoffice/escenarios',       icon: Building2,       label: 'Escenarios'   },
  { to: '/escenarios/backoffice/solicitudes',      icon: Folders,         label: 'Solicitudes'  },
  { to: '/escenarios/backoffice/contratos',        icon: FileText,        label: 'Contratos'    },
  { to: '/escenarios/backoffice/pagos',            icon: Receipt,         label: 'Pagos'        },
  { to: '/escenarios/backoffice/eventos',          icon: Calendar,        label: 'Eventos'      },
  { to: '/escenarios/backoffice/mantenimiento',    icon: Wrench,          label: 'Mantenimiento'},
  { to: '/escenarios/backoffice/revision-juridica',icon: Scale,           label: 'Jurídica'     },
  { to: '/escenarios/backoffice/reportes',         icon: BarChart3,       label: 'Reportes'     },
];

const dropdownStyle: React.CSSProperties = {
  position: 'absolute', right: 0, top: 'calc(100% + 8px)',
  width: 200, background: '#100808', border: `1px solid ${C.border}`,
  borderRadius: 4, overflow: 'hidden', boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
  zIndex: 9999,
};

export function BackofficeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setUserMenuOpen(false);
    logout();
    navigate('/escenarios');
  };

  useEffect(() => {
    if (!userMenuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [userMenuOpen]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#f5f1ee' }}>

      {/* Hide scrollbar on webkit browsers for the nav */}
      <style>{`nav::-webkit-scrollbar { display: none; }`}</style>

      {/* Accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${C.primary}, ${C.active}, ${C.gold})`, flexShrink: 0 }} />

      {/* Top nav */}
      <header style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ maxWidth: '100%', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', height: 56, gap: 16 }}>

            {/* Brand */}
            <Link to="/escenarios" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none' }}>
              <div style={{ width: 28, height: 28, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 3 }}>
                <Building2 style={{ width: 13, height: 13, color: '#fff' }} />
              </div>
              <div>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: C.text, letterSpacing: '0.02em' }}>
                  ESCENARIOS
                </span>
                <span style={{ display: 'block', fontSize: '0.58rem', color: C.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: -1 }}>
                  Backoffice · Secretaría de Cultura
                </span>
              </div>
            </Link>

            <div style={{ width: 1, height: 24, background: C.border, flexShrink: 0 }} />

            {/* Desktop nav items — scrollable when overflow */}
            <nav style={{ display: 'flex', alignItems: 'center', height: '100%', flex: 1, overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none' }}
              className="hidden lg:flex">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                return (
                  <Link key={item.to} to={item.to} style={{ height: '100%', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <div
                      style={{
                        position: 'relative', display: 'flex', alignItems: 'center', gap: 5,
                        padding: '0 11px', height: '100%',
                        color: isActive ? '#fff' : C.muted,
                        fontSize: '0.77rem', fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer', transition: 'color 0.18s', whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.color = C.text; }}
                      onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.color = C.muted; }}
                    >
                      <Icon style={{ width: 12, height: 12, flexShrink: 0 }} />
                      {item.label}
                      {isActive && (
                        <motion.div layoutId="backoffice-nav-active"
                          style={{ position: 'absolute', bottom: 0, left: 11, right: 11, height: 2, background: C.active, borderRadius: '2px 2px 0 0' }}
                          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Right side */}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>

              {/* Back to public site */}
              <Link to="/escenarios" style={{ textDecoration: 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.7rem', color: C.muted, cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.color = C.text}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.color = C.muted}
                  className="hidden sm:flex">
                  <ArrowLeft style={{ width: 11, height: 11 }} />
                  Sitio público
                </div>
              </Link>

              <span style={{ fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.active, padding: '3px 8px', border: `1px solid ${C.primary}`, borderRadius: 2 }}
                className="hidden sm:inline-flex">
                Funcionario
              </span>

              {/* User menu */}
              <div ref={userMenuRef} style={{ position: 'relative' }}>
                <button onClick={() => setUserMenuOpen(v => !v)}
                  aria-haspopup="menu" aria-expanded={userMenuOpen} aria-label="Menú de usuario"
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 4, background: 'transparent', border: 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(139,26,26,0.2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 28, height: 28, borderRadius: 4, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User style={{ width: 14, height: 14, color: '#fff' }} />
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text }} className="hidden sm:block">Funcionario</span>
                  <ChevronDown style={{ width: 13, height: 13, color: C.muted, transform: userMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.15 }} style={dropdownStyle}>
                      <div style={{ padding: '10px 14px', borderBottom: `1px solid ${C.border}` }}>
                        <p style={{ fontSize: '0.8rem', fontWeight: 600, color: C.text }}>Administrador</p>
                        <p style={{ fontSize: '0.7rem', color: C.muted, marginTop: 2 }}>Secretaría de Cultura</p>
                      </div>
                      <div style={{ padding: 4 }}>
                        <button onClick={handleLogout}
                          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 3, cursor: 'pointer', color: C.active, fontSize: '0.8rem', background: 'none', border: 'none', transition: 'all 0.15s' }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(192,57,43,0.15)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                          <LogOut style={{ width: 13, height: 13 }} />
                          Salir del sistema
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile toggle */}
              <button onClick={() => setMobileOpen(v => !v)}
                aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={mobileOpen}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                className="lg:hidden">
                {mobileOpen
                  ? <X style={{ width: 18, height: 18, color: C.muted }} />
                  : <Menu style={{ width: 18, height: 18, color: C.muted }} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }} style={{ overflow: 'hidden', borderTop: `1px solid ${C.border}` }}>
              <div style={{ padding: '8px 16px 12px' }}>
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                  return (
                    <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: 10,
                        padding: '9px 12px', borderRadius: 3, marginBottom: 2,
                        background: isActive ? 'rgba(139,26,26,0.25)' : 'transparent',
                        color: isActive ? '#fff' : C.muted,
                        fontSize: '0.82rem', fontWeight: isActive ? 600 : 400,
                        borderLeft: isActive ? `2px solid ${C.active}` : '2px solid transparent',
                      }}>
                        <Icon style={{ width: 14, height: 14 }} />
                        {item.label}
                      </div>
                    </Link>
                  );
                })}
                <div style={{ height: 1, background: C.border, margin: '8px 0' }} />
                <button onClick={handleLogout}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 3, background: 'none', border: 'none', color: C.active, fontSize: '0.82rem', cursor: 'pointer' }}>
                  <LogOut style={{ width: 14, height: 14 }} />
                  Salir del sistema
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
