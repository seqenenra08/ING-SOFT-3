import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, BookOpen, GraduationCap, Bell, User,
  Users, UserCog, Calendar, BarChart3, Settings,
  FileText, AlertCircle, LogOut, ChevronRight, Award
} from 'lucide-react';

const studentLinks = [
  { to: '/estudiante/dashboard', icon: LayoutDashboard, label: 'Inicio',          color: '#a78bfa' },
  { to: '/estudiante/programas', icon: BookOpen,         label: 'Programas',       color: '#34d399' },
  { to: '/estudiante/mis-programas', icon: GraduationCap, label: 'Mis Programas', color: '#f472b6' },
  { to: '/estudiante/progreso',  icon: BarChart3,        label: 'Mi Progreso',     color: '#fbbf24' },
  { to: '/estudiante/notas',     icon: Award,            label: 'Mis Notas',       color: '#fde68a' },
  { to: '/estudiante/notificaciones', icon: Bell,        label: 'Notificaciones',  color: '#f87171' },
  { to: '/estudiante/perfil',    icon: User,             label: 'Mi Perfil',       color: '#60a5fa' },
];

const educatorLinks = [
  { to: '/educador/dashboard',  icon: LayoutDashboard, label: 'Inicio',       color: '#a78bfa' },
  { to: '/educador/grupos',     icon: Users,           label: 'Mis Grupos',   color: '#34d399' },
  { to: '/educador/horario',    icon: Calendar,        label: 'Horario',      color: '#fbbf24' },
  { to: '/educador/evaluacion', icon: FileText,        label: 'Evaluación',   color: '#f472b6' },
  { to: '/educador/alertas',    icon: AlertCircle,     label: 'Alertas',      color: '#f87171' },
  { to: '/educador/perfil',     icon: User,            label: 'Mi Perfil',    color: '#60a5fa' },
];

const adminLinks = [
  { to: '/admin/dashboard',     icon: LayoutDashboard, label: 'Dashboard',      color: '#a78bfa' },
  { to: '/admin/estudiantes',   icon: Users,           label: 'Estudiantes',    color: '#34d399' },
  { to: '/admin/educadores',    icon: UserCog,         label: 'Educadores',     color: '#f472b6' },
  { to: '/admin/programas',     icon: BookOpen,        label: 'Programas',      color: '#fbbf24' },
  { to: '/admin/reportes',      icon: FileText,        label: 'Reportes',       color: '#60a5fa' },
  { to: '/admin/notificaciones',icon: Bell,            label: 'Notificaciones', color: '#f87171' },
  { to: '/admin/configuracion', icon: Settings,        label: 'Configuración',  color: '#94a3b8' },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links =
    user?.role === 'estudiante' ? studentLinks :
    user?.role === 'educador'   ? educatorLinks :
    adminLinks;

  const roleLabel =
    user?.role === 'estudiante' ? 'Estudiante' :
    user?.role === 'educador'   ? 'Educador'   :
    'Administrador';

  const roleColor =
    user?.role === 'estudiante' ? '#a78bfa' :
    user?.role === 'educador'   ? '#34d399'  :
    '#f472b6';

  return (
    <div className="flex h-screen w-64 flex-col" style={{ background: '#08061a', borderRight: '1px solid rgba(124,58,237,0.15)' }}>
      {/* Brand */}
      <div className="px-5 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)', boxShadow: '0 4px 14px rgba(124,58,237,0.45)' }}>
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p style={{ fontFamily:"'Space Grotesk',sans-serif", fontWeight:700, color:'#fff', fontSize:'0.9rem', lineHeight:1.2 }}>Plataforma</p>
            <p style={{ fontSize:'0.75rem', color:'rgba(196,181,253,0.6)' }}>Lucy Tejada</p>
          </div>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-5 py-3">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background:'rgba(255,255,255,0.04)' }}>
          <span className="w-2 h-2 rounded-full" style={{ background: roleColor }} />
          <span className="text-xs font-semibold" style={{ color: roleColor }}>{roleLabel}</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto space-y-0.5">
        {links.map((link, i) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <motion.div key={link.to} initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }} transition={{ duration:0.3, delay: i*0.04 }}>
              <Link to={link.to}>
                <div className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${isActive ? '' : 'hover:bg-white/5'}`}
                  style={{ background: isActive ? 'rgba(124,58,237,0.15)' : 'transparent' }}>
                  {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r-full" style={{ background: link.color }} />}
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: isActive ? `${link.color}22` : 'transparent' }}>
                    <Icon className="w-4 h-4 transition-all" style={{ color: isActive ? link.color : 'rgba(196,181,253,0.5)' }} />
                  </div>
                  <span className="text-sm font-medium transition-colors"
                    style={{ color: isActive ? '#fff' : 'rgba(196,181,253,0.6)' }}>
                    {link.label}
                  </span>
                  {isActive && <ChevronRight className="ml-auto w-3.5 h-3.5" style={{ color: link.color }} />}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* User section */}
      <div className="p-4" style={{ borderTop:'1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3 mb-3 px-2 py-2 rounded-xl" style={{ background:'rgba(255,255,255,0.04)' }}>
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
          ) : (
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background:'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
              <User className="w-4 h-4 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold truncate" style={{ color:'#fff' }}>{user?.name}</p>
            <p className="text-xs truncate" style={{ color:'rgba(196,181,253,0.5)' }}>{user?.role}</p>
          </div>
        </div>
        <button onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-all hover:bg-rose-500/10"
          style={{ color:'rgba(196,181,253,0.5)' }}
          onMouseEnter={e => (e.currentTarget.style.color='#f87171')}
          onMouseLeave={e => (e.currentTarget.style.color='rgba(196,181,253,0.5)')}>
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};
