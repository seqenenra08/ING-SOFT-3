import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router';
import {
  Building2, FileText, DollarSign, Calendar, Wrench,
  Scale, TrendingUp, LogOut, Bell, User, ChevronRight,
  LayoutDashboard, Folders, Receipt, Gavel, BarChart3, X, Menu
} from 'lucide-react';

const navSections = [
  {
    label: 'Principal',
    items: [
      { name: 'Dashboard', href: '/escenarios/backoffice/dashboard', icon: LayoutDashboard, color: '#a78bfa', bg: 'bg-violet-500/20 hover:bg-violet-500/30', activeBg: 'bg-violet-500' },
      { name: 'Escenarios', href: '/escenarios/backoffice/escenarios', icon: Building2, color: '#22d3ee', bg: 'bg-cyan-500/20 hover:bg-cyan-500/30', activeBg: 'bg-cyan-500' },
    ]
  },
  {
    label: 'Gestión',
    items: [
      { name: 'Solicitudes', href: '/escenarios/backoffice/solicitudes', icon: Folders, color: '#fbbf24', bg: 'bg-amber-500/20 hover:bg-amber-500/30', activeBg: 'bg-amber-500' },
      { name: 'Contratos', href: '/escenarios/backoffice/contratos', icon: FileText, color: '#34d399', bg: 'bg-emerald-500/20 hover:bg-emerald-500/30', activeBg: 'bg-emerald-500' },
      { name: 'Pagos', href: '/escenarios/backoffice/pagos', icon: Receipt, color: '#4ade80', bg: 'bg-green-500/20 hover:bg-green-500/30', activeBg: 'bg-green-500' },
    ]
  },
  {
    label: 'Operaciones',
    items: [
      { name: 'Eventos', href: '/escenarios/backoffice/eventos', icon: Calendar, color: '#f472b6', bg: 'bg-pink-500/20 hover:bg-pink-500/30', activeBg: 'bg-pink-500' },
      { name: 'Mantenimiento', href: '/escenarios/backoffice/mantenimiento', icon: Wrench, color: '#fb923c', bg: 'bg-orange-500/20 hover:bg-orange-500/30', activeBg: 'bg-orange-500' },
      { name: 'Rev. Jurídica', href: '/escenarios/backoffice/revision-juridica', icon: Gavel, color: '#60a5fa', bg: 'bg-blue-500/20 hover:bg-blue-500/30', activeBg: 'bg-blue-500' },
      { name: 'Reportes', href: '/escenarios/backoffice/reportes', icon: BarChart3, color: '#e879f9', bg: 'bg-fuchsia-500/20 hover:bg-fuchsia-500/30', activeBg: 'bg-fuchsia-500' },
    ]
  }
];

export function BackofficeLayout() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg shadow-violet-500/40">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#070b14]"></span>
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">SGE</p>
            <p className="text-[#4a5568] text-[11px]">Secretaría de Cultura</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/5 mb-2"></div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-5">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-[#2d3748]">
              {section.label}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link key={item.href} to={item.href} onClick={() => setMobileOpen(false)}>
                    <div className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/8 text-white'
                        : 'text-[#718096] hover:text-white hover:bg-white/5'
                    }`}>
                      {/* Active indicator bar */}
                      {isActive && (
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full"
                          style={{ background: item.color }}
                        />
                      )}
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                        style={{
                          background: isActive
                            ? `${item.color}22`
                            : 'transparent',
                        }}
                      >
                        <Icon
                          className="w-4 h-4 transition-all"
                          style={{ color: isActive ? item.color : 'currentColor' }}
                        />
                      </div>
                      <span className="text-sm font-medium">{item.name}</span>
                      {isActive && (
                        <ChevronRight
                          className="ml-auto w-3.5 h-3.5 opacity-60"
                          style={{ color: item.color }}
                        />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-5 h-px bg-white/5 mt-2"></div>

      {/* User Profile */}
      <div className="p-4 space-y-2">
        {/* Notification + user row */}
        <div className="flex items-center gap-2">
          <button className="relative w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0">
            <Bell className="w-4 h-4 text-[#718096]" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-400 rounded-full"></span>
          </button>
          <div className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded-xl bg-white/5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">Admin Usuario</p>
              <p className="text-[#4a5568] text-[10px] truncate">Administrador</p>
            </div>
          </div>
        </div>
        <Link to="/escenarios">
          <button className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[#4a5568] hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-200 text-sm">
            <LogOut className="w-4 h-4" />
            <span>Salir del sistema</span>
          </button>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#faf9ff' }}>
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 min-h-screen fixed left-0 top-0 z-40"
        style={{ background: '#070b14' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            className="relative w-60 min-h-full flex flex-col z-10"
            style={{ background: '#070b14' }}
          >
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">
        {/* Top bar - mobile + desktop */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-xl border-b border-[#e8e2f7] shadow-sm">
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background:'#08061a' }}
            >
              <Menu className="w-4 h-4 text-white" />
            </button>
            {/* Breadcrumb / page indicator */}
            <div className="flex items-center gap-2 text-sm">
              <span style={{ color:'#b0a8c8' }}>Escenarios</span>
              <ChevronRight className="w-3.5 h-3.5" style={{ color:'#b0a8c8' }} />
              <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:'#1a1033' }}>
                {navSections.flatMap(s => s.items).find(i => i.href === location.pathname)?.name ?? 'Backoffice'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs" style={{ color:'#b0a8c8' }}>
                {new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
            <div className="w-px h-5 mx-1 hidden sm:block" style={{ background:'#e8e2f7' }} />
            <div className="flex items-center gap-2 text-sm">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background:'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="hidden sm:inline font-medium" style={{ color:'#1a1033' }}>Admin Usuario</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}