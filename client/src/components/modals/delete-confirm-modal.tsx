import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteItem as deleteFirestoreItem, deleteOtherCost as deleteFirestoreOtherCost } from "@/lib/firebase";
import { deleteItem } from "@/store/items-slice";
import { deleteOtherCost } from "@/store/other-costs-slice";
import { RootState } from "@/store";
import { useToast } from "@/hooks/use-toast";

interface DeleteConfirmModalProps {
  type: 'item' | 'cost';
  id: string;
  onClose: () => void;
}

export default function DeleteConfirmModal({ type, id, onClose }: DeleteConfirmModalProps) {
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.items);
  const { otherCosts } = useSelector((state: RootState) => state.otherCosts);
  
  // Find the item/cost to be deleted
  const item = type === 'item' ? items.find(i => i.id === id) : null;
  const cost = type === 'cost' ? otherCosts.find(c => c.id === id) : null;
  
  const handleDelete = async () => {
    if (!user?.uid) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to delete items",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      if (type === 'item') {
        // Delete from Firestore
        await deleteFirestoreItem(user.uid, id);
        
        // Update Redux state
        dispatch(deleteItem(id));
        
        toast({
          title: "Item deleted",
          description: item ? `"${item.name}" has been removed from your project` : "Item has been removed",
        });
      } else {
        // Delete from Firestore
        await deleteFirestoreOtherCost(user.uid, id);
        
        // Update Redux state
        dispatch(deleteOtherCost(id));
        
        toast({
          title: "Cost deleted",
          description: cost ? `"${cost.description}" has been removed from your project` : "Cost has been removed",
        });
      }
      
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete",
        description: "There was an error processing your request. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black opacity-50" 
        onClick={onClose}
      ></div>
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 z-10">
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-medium text-gray-900">Confirm Deletion</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-700">
            {type === 'item' 
              ? `Are you sure you want to delete this item${item ? ` (${item.name})` : ''}? This action cannot be undone.`
              : `Are you sure you want to delete this cost${cost ? ` (${cost.description})` : ''}? This action cannot be undone.`
            }
          </p>
        </div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-3">
          <button 
            type="button" 
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md focus:outline-none"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
