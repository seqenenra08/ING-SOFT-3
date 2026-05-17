import { Link, Outlet, useLocation } from 'react-router';
import { Building2, ArrowLeft } from 'lucide-react';
import { C } from '../../theme';

const VC = { primary: '#7a1a1a', active: '#b83228', gold: '#8b5e07' };

const navLinks = [
  { to: '/escenarios',            label: 'Inicio'    },
  { to: '/escenarios/catalogo',   label: 'Catálogo'  },
  { to: '/escenarios/seguimiento',label: 'Mi solicitud' },
];

export function VenuesPublicLayout() {
  const location = useLocation();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: C.bg, fontFamily: "'Inter', sans-serif" }}>

      {/* Accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${VC.primary}, ${VC.active}, ${VC.gold})`, flexShrink: 0 }} />

      {/* Sticky header */}
      <header style={{ background: C.dark, borderBottom: `1px solid #2a1212`, position: 'sticky', top: 0, zIndex: 50, flexShrink: 0 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', gap: 24 }}>

          {/* Brand */}
          <Link to="/escenarios" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, background: VC.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2 }}>
              <Building2 style={{ width: 13, height: 13, color: '#fff' }} />
            </div>
            <div>
              <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, color: '#f5f0ef', fontSize: '0.82rem', lineHeight: 1.2 }}>
                Escenarios Culturales
              </p>
              <p style={{ fontSize: '0.58rem', color: '#a08888', letterSpacing: '0.08em' }}>Secretaría de Cultura · Pereira</p>
            </div>
          </Link>

          <div style={{ width: 1, height: 24, background: '#2a1212', flexShrink: 0 }} />

          {/* Nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', height: '100%', flex: 1, gap: 0 }}>
            {navLinks.map(link => {
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to} style={{ height: '100%', display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                  <div style={{
                    position: 'relative', display: 'flex', alignItems: 'center',
                    padding: '0 14px', height: '100%',
                    color: isActive ? '#fff' : '#a08888',
                    fontSize: '0.78rem', fontWeight: isActive ? 600 : 400,
                    transition: 'color 0.15s', whiteSpace: 'nowrap',
                  }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.color = '#f5f0ef'; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLDivElement).style.color = '#a08888'; }}
                  >
                    {link.label}
                    {isActive && (
                      <div style={{ position: 'absolute', bottom: 0, left: 14, right: 14, height: 2, background: VC.active, borderRadius: '2px 2px 0 0' }} />
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.72rem', color: '#a08888', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.color = '#f5f0ef'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.color = '#a08888'}>
              <ArrowLeft style={{ width: 11, height: 11 }} />
              Menú principal
            </div>
          </Link>

          <Link to="/escenarios/backoffice/login" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <button style={{ padding: '6px 14px', background: VC.primary, color: '#fff', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', border: 'none', borderRadius: 2 }}>
              Acceso funcionarios
            </button>
          </Link>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
}
