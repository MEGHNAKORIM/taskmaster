import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import TopNavbar from "@/components/layout/top-navbar";
import Sidebar from "@/components/layout/sidebar";
import ProjectSummary from "@/components/project/project-summary";
import ProjectItems from "@/components/project/project-items";
import OtherCosts from "@/components/project/other-costs";
import AddItemModal from "@/components/modals/add-item-modal";
import AddCostModal from "@/components/modals/add-cost-modal";
import DeleteConfirmModal from "@/components/modals/delete-confirm-modal";
import { useToast } from "@/hooks/use-toast";
import { fetchItems } from "@/store/items-slice";
import { fetchOtherCosts } from "@/store/other-costs-slice";
import { logout } from "@/lib/firebase";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { toast } = useToast();
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showAddCostModal, setShowAddCostModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteType, setDeleteType] = useState<'item' | 'cost' | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!user) {
      setLocation('/auth');
    }
  }, [user, setLocation]);
  
  // Fetch data when user is authenticated
  useEffect(() => {
    if (user?.uid) {
      dispatch(fetchItems(user.uid));
      dispatch(fetchOtherCosts(user.uid));
    }
  }, [user, dispatch]);
  
  const handleLogout = async () => {
    try {
      await logout();
      setLocation('/auth');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "Could not log out. Please try again.",
      });
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const showItemModal = () => {
    setShowAddItemModal(true);
  };
  
  const showCostModal = () => {
    setShowAddCostModal(true);
  };
  
  const closeAllModals = () => {
    setShowAddItemModal(false);
    setShowAddCostModal(false);
    setShowDeleteModal(false);
    setDeleteType(null);
    setDeleteId(null);
  };
  
  const showDeleteConfirmation = (type: 'item' | 'cost', id: string) => {
    setDeleteType(type);
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  
  // If user is not authenticated, don't render the dashboard
  if (!user) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar 
        userEmail={user.email || ''} 
        onLogout={handleLogout} 
        onToggleSidebar={toggleSidebar} 
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
          userName={user.displayName || 'User'} 
          userEmail={user.email || ''} 
        />
        
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black opacity-50 z-10 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        
        <main className={`flex-1 overflow-y-auto bg-gray-50 dashboard-transition ${sidebarOpen ? 'ml-64' : 'ml-0'} lg:ml-0`}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ProjectSummary onAddItem={showItemModal} onAddCost={showCostModal} />
            <ProjectItems onEdit={(id) => {}} onDelete={(id) => showDeleteConfirmation('item', id)} />
            <OtherCosts onEdit={(id) => {}} onDelete={(id) => showDeleteConfirmation('cost', id)} />
          </div>
        </main>
      </div>
      
      {/* Modals */}
      {showAddItemModal && (
        <AddItemModal onClose={closeAllModals} />
      )}
      
      {showAddCostModal && (
        <AddCostModal onClose={closeAllModals} />
      )}
      
      {showDeleteModal && deleteType && deleteId && (
        <DeleteConfirmModal 
          type={deleteType} 
          id={deleteId} 
          onClose={closeAllModals} 
        />
      )}
    </div>
  );
}
