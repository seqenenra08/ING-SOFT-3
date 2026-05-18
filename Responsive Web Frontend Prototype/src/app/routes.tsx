import { createBrowserRouter, Link, Navigate } from 'react-router';
import { useAuth } from './context/AuthContext';

// Layouts
import { AppLayout } from './components/layout/AppLayout';

// Public Pages
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PasswordRecovery } from './pages/PasswordRecovery';
import { Onboarding } from './pages/Onboarding';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { ProgramsCatalog } from './pages/student/ProgramsCatalog';
import { ProgramDetail } from './pages/student/ProgramDetail';
import { MyPrograms } from './pages/student/MyPrograms';
import { AcademicProgress } from './pages/student/AcademicProgress';
import { MyEvaluations } from './pages/student/MyEvaluations';
import { Notifications } from './pages/student/Notifications';
import { Profile } from './pages/student/Profile';

// Educator Pages
import { EducatorDashboard } from './pages/educator/EducatorDashboard';
import { MyGroups } from './pages/educator/MyGroups';
import { GroupDetail } from './pages/educator/GroupDetail';
import { Attendance } from './pages/educator/Attendance';
import { Schedule } from './pages/educator/Schedule';
import { Alerts } from './pages/educator/Alerts';
import { Evaluation } from './pages/educator/Evaluation';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageStudents } from './pages/admin/ManageStudents';
import { ManagePrograms } from './pages/admin/ManagePrograms';
import { ManageEducators } from './pages/admin/ManageEducators';
import { AdminNotifications } from './pages/admin/AdminNotifications';
import { AdminSettings } from './pages/admin/AdminSettings';
import { Reports } from './pages/admin/Reports';

// Venues Public Pages
import { VenuesLanding } from './pages/venues/VenuesLanding';
import { VenuesCatalog } from './pages/venues/VenuesCatalog';
import { VenueDetail } from './pages/venues/VenueDetail';
import { RentalRequestWizard } from './pages/venues/RentalRequestWizard';
import { RequestTracking } from './pages/venues/RequestTracking';

// Venues Backoffice Pages
import { BackofficeLogin } from './pages/venues/backoffice/BackofficeLogin';
import { BackofficeDashboard } from './pages/venues/backoffice/BackofficeDashboard';
import { RequestsManagement } from './pages/venues/backoffice/RequestsManagement';
import { ContractsManagement } from './pages/venues/backoffice/ContractsManagement';
import { PaymentsManagement } from './pages/venues/backoffice/PaymentsManagement';
import { LegalReview } from './pages/venues/backoffice/LegalReview';
import { MaintenanceModule } from './pages/venues/backoffice/MaintenanceModule';
import { ReportsCenter } from './pages/venues/backoffice/ReportsCenter';
import { VenuesManagement } from './pages/venues/backoffice/VenuesManagement';
import { EventsManagement } from './pages/venues/backoffice/EventsManagement';
import { BackofficeLayout } from './components/venues/BackofficeLayout';
import { VenuesPublicLayout } from './components/venues/VenuesPublicLayout';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles, redirectTo = '/login' }: { children: React.ReactNode; allowedRoles?: string[]; redirectTo?: string }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <Landing />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/registro',
    element: <Register />
  },
  {
    path: '/recuperar-contrasena',
    element: <PasswordRecovery />
  },
  {
    path: '/onboarding',
    element: <Onboarding />
  },

  // Student routes
  {
    path: '/estudiante',
    element: (
      <ProtectedRoute allowedRoles={['estudiante']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <StudentDashboard />
      },
      {
        path: 'programas',
        element: <ProgramsCatalog />
      },
      {
        path: 'programa/:id',
        element: <ProgramDetail />
      },
      {
        path: 'mis-programas',
        element: <MyPrograms />
      },
      {
        path: 'progreso',
        element: <AcademicProgress />
      },
      {
        path: 'notas',
        element: <MyEvaluations />
      },
      {
        path: 'notificaciones',
        element: <Notifications />
      },
      {
        path: 'perfil',
        element: <Profile />
      }
    ]
  },

  // Educator routes
  {
    path: '/educador',
    element: (
      <ProtectedRoute allowedRoles={['educador']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <EducatorDashboard />
      },
      {
        path: 'grupos',
        element: <MyGroups />
      },
      {
        path: 'grupo/:id',
        element: <GroupDetail />
      },
      {
        path: 'asistencia/:id',
        element: <Attendance />
      },
      {
        path: 'horario',
        element: <Schedule />
      },
      {
        path: 'alertas',
        element: <Alerts />
      },
      {
        path: 'evaluacion',
        element: <Evaluation />
      },
      {
        path: 'perfil',
        element: <Profile />
      }
    ]
  },

  // Admin routes
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['administrador']}>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />
      },
      {
        path: 'estudiantes',
        element: <ManageStudents />
      },
      {
        path: 'educadores',
        element: <ManageEducators />
      },
      {
        path: 'programas',
        element: <ManagePrograms />
      },
      {
        path: 'reportes',
        element: <Reports />
      },
      {
        path: 'notificaciones',
        element: <AdminNotifications />
      },
      {
        path: 'configuracion',
        element: <AdminSettings />
      },
      {
        path: 'perfil',
        element: <Profile />
      }
    ]
  },

  // Venues public routes
  {
    path: '/escenarios',
    element: <VenuesPublicLayout />,
    children: [
      { index: true,                    element: <VenuesLanding /> },
      { path: 'catalogo',               element: <VenuesCatalog /> },
      { path: 'detalle/:id',            element: <VenueDetail /> },
      { path: 'solicitar/:id',          element: <RentalRequestWizard /> },
      { path: 'seguimiento',            element: <RequestTracking /> },
    ],
  },

  // Venues backoffice routes
  {
    path: '/escenarios/backoffice/login',
    element: <BackofficeLogin />
  },
  {
    path: '/escenarios/backoffice',
    element: (
      <ProtectedRoute allowedRoles={['administrador']} redirectTo="/escenarios/backoffice/login">
        <BackofficeLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'dashboard',
        element: <BackofficeDashboard />
      },
      {
        path: 'escenarios',
        element: <VenuesManagement />
      },
      {
        path: 'solicitudes',
        element: <RequestsManagement />
      },
      {
        path: 'contratos',
        element: <ContractsManagement />
      },
      {
        path: 'pagos',
        element: <PaymentsManagement />
      },
      {
        path: 'eventos',
        element: <EventsManagement />
      },
      {
        path: 'mantenimiento',
        element: <MaintenanceModule />
      },
      {
        path: 'revision-juridica',
        element: <LegalReview />
      },
      {
        path: 'reportes',
        element: <ReportsCenter />
      }
    ]
  },

  // 404
  {
    path: '*',
    element: (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">404</h1>
          <p className="mb-4 text-gray-600">Página no encontrada</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">Volver al inicio</Link>
        </div>
      </div>
    )
  }
]);