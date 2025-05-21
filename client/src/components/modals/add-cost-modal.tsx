import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addOtherCost as addFirestoreOtherCost } from "@/lib/firebase";
import { addOtherCost } from "@/store/other-costs-slice";
import { RootState } from "@/store";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddCostModalProps {
  onClose: () => void;
}

export default function AddCostModal({ onClose }: AddCostModalProps) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
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
        description: "You must be logged in to add costs",
      });
      return;
    }
    
    if (!description || !amount || parseFloat(amount) <= 0) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please provide a valid description and amount",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Add to Firestore
      await addFirestoreOtherCost(user.uid, description, parseFloat(amount));
      
      // Update Redux state
      dispatch(addOtherCost({
        id: Date.now().toString(), // Temporary ID until we fetch the actual one
        description,
        amount: parseFloat(amount),
        createdAt: new Date()
      }));
      
      toast({
        title: "Cost added",
        description: `"${description}" has been added to your project`,
      });
      
      onClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to add cost",
        description: "There was an error adding your cost. Please try again.",
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
          <h3 className="text-lg font-medium text-gray-900">Add Other Cost</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4">
            <div className="mb-4">
              <Label htmlFor="cost-description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </Label>
              <Input
                id="cost-description"
                type="text"
                placeholder="Enter cost description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2"
                disabled={loading}
                required
              />
            </div>
            <div className="mb-2">
              <Label htmlFor="cost-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount ($)
              </Label>
              <Input
                id="cost-amount"
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
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
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-md focus:outline-none"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Cost"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
