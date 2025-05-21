import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addItem as addFirestoreItem } from "@/lib/firebase";
import { addItem } from "@/store/items-slice";
import { RootState } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddItemModalProps {
  onClose: () => void;
}

export default function AddItemModal({ onClose }: AddItemModalProps) {
  const [name, setName] = useState("");
  const [cost, setCost] = useState("");
  const [loading, setLoading] = useState(false);
  
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.uid) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "You must be logged in to add items",
      });
      return;
    }
    
    if (!name || !cost || parseFloat(cost) <= 0) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please provide a valid item name and cost",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Add to Firestore
      await addFirestoreItem(user.uid, name, parseFloat(cost));
      
      // Update Redux state
      dispatch(addItem({
        id: Date.now().toString(), // Temporary ID until we fetch the actual one
        name,
        cost: parseFloat(cost),
        createdAt: new Date()
      }));
      
      toast({
        title: "Item added",
        description: `"${name}" has been added to your project`,
      });
      
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add item",
        description: "There was an error adding your item. Please try again.",
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
          <h3 className="text-lg font-medium text-gray-900">Add New Item</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="mb-4">
              <Label htmlFor="item-name" className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </Label>
              <Input
                id="item-name"
                type="text"
                placeholder="Enter item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2"
                disabled={loading}
                required
              />
            </div>
            <div className="mb-2">
              <Label htmlFor="item-cost" className="block text-sm font-medium text-gray-700 mb-1">
                Cost ($)
              </Label>
              <Input
                id="item-cost"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className="w-full px-4 py-2"
                disabled={loading}
                required
              />
            </div>
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
              type="submit" 
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md focus:outline-none"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
