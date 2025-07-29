import { MainNotFoundPage } from '@/components/notFound/MainNotFound';
import { SidebarDashboard } from '@/components/SideNav';
import { getUserRoleHelper, isAuthenticatedHelper } from '@/lib/authHelper';
import { UserRole } from '@/util/types';
import { createFileRoute,  Outlet, redirect } from '@tanstack/react-router';


export const Route = createFileRoute('/dashboard')({
  beforeLoad: async() => {
    console.log(isAuthenticatedHelper())
    if (!isAuthenticatedHelper()){
      throw redirect({ to:'/login',search: {
          redirect: location.pathname,
        }})
    }
  },
  component: SuperAdminDashboard,
  notFoundComponent:MainNotFoundPage
  
})




function SuperAdminDashboard() {

  const userRole: UserRole = getUserRoleHelper() as UserRole;


  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      {
        <SidebarDashboard role={userRole} />
      }
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;