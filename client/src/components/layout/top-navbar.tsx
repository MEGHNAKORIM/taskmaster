interface TopNavbarProps {
  userEmail: string;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export default function TopNavbar({ userEmail, onLogout, onToggleSidebar }: TopNavbarProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              className="p-2 rounded-md text-gray-700 lg:hidden focus:outline-none"
              onClick={onToggleSidebar}
              aria-label="Toggle sidebar"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
            <h1 className="text-xl font-bold text-blue-600 ml-2 md:ml-0">Project Cost Tracker</h1>
          </div>
          
          <div className="flex items-center">
            <div className="hidden md:flex items-center text-sm text-gray-600 mr-4">
              {userEmail}
            </div>
            <button 
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none"
              onClick={onLogout}
            >
              <i className="fas fa-sign-out-alt mr-2"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
