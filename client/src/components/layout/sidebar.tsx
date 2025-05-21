import { useLocation } from "wouter";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
}

export default function Sidebar({ isOpen, onClose, userName, userEmail }: SidebarProps) {
  const [location, setLocation] = useLocation();

  const getUserInitials = (name: string): string => {
    if (!name || name === 'User') return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleNavigation = (path: string) => {
    setLocation(path);
    onClose(); // Close sidebar on mobile after navigation
  };

  return (
    <aside 
      className={`bg-gray-800 text-white w-64 flex-shrink-0 fixed inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 z-20 transition-transform duration-300 ease-in-out lg:static lg:h-auto`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-xl font-semibold">Dashboard</span>
        </div>
        
        <nav className="flex-1 pt-4 pb-4">
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation('/dashboard');
            }}
            className={`flex items-center px-6 py-3 ${
              location === '/dashboard' ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            <i className="fas fa-chart-pie mr-3"></i>
            <span>Project Overview</span>
          </a>
          
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // This is just a placeholder link for the design, not functional
            }}
            className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <i className="fas fa-history mr-3"></i>
            <span>History</span>
          </a>
          
          <a 
            href="#"
            onClick={(e) => {
              e.preventDefault();
              // This is just a placeholder link for the design, not functional
            }}
            className="flex items-center px-6 py-3 text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <i className="fas fa-cog mr-3"></i>
            <span>Settings</span>
          </a>
        </nav>
        
        <div className="p-4 bg-gray-900">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white font-medium">{getUserInitials(userName)}</span>
            </div>
            <div className="ml-3 truncate">
              <div className="text-sm font-medium text-white truncate">{userName}</div>
              <div className="text-xs text-gray-400 truncate">{userEmail}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
