import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from '@/features/auth/api/queries';
import { useLogout } from '@/features/auth/api/mutations';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Layers, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Projects', path: '/admin/projects', icon: Briefcase },
  { label: 'Team', path: '/admin/team', icon: Users },
  { label: 'Services', path: '/admin/services', icon: Layers },
  { label: 'Contacts', path: '/admin/contacts', icon: MessageSquare },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export const AdminLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: user } = useUser();
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutMutation.mutateAsync();
      navigate('/admin/login');
    } catch (e) {
      // already logged out or error
      navigate('/admin/login');
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-card border-r border-border/40">
      <div className="h-16 flex items-center px-6 border-b border-border/40">
        <h2 className="font-bold text-lg tracking-tight">Studio Admin</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={() => setMobileMenuOpen(false)}
            className={({ isActive }) => 
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-border/40">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10" 
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-secondary/10 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden h-16 bg-card border-b border-border/40 flex items-center justify-between px-4 sticky top-0 z-20">
        <h2 className="font-bold text-lg tracking-tight">Studio Admin</h2>
        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-5 h-5" />
        </Button>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-card z-50 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Mobile close button */}
        <div className="absolute top-4 right-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Desktop Topbar - Minimalist */}
        <header className="hidden md:flex h-16 bg-card border-b border-border/40 items-center justify-between px-6 shrink-0">
          <div className="text-sm text-muted-foreground">
            {/* Could put breadcrumbs here later */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
    </div>
  );
};
