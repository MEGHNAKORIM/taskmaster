import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface ProjectSummaryProps {
  onAddItem: () => void;
  onAddCost: () => void;
}

export default function ProjectSummary({ onAddItem, onAddCost }: ProjectSummaryProps) {
  const { items } = useSelector((state: RootState) => state.items);
  const { otherCosts } = useSelector((state: RootState) => state.otherCosts);
  
  // Calculate totals
  const itemsTotal = items.reduce((total, item) => total + Number(item.cost), 0);
  const otherCostsTotal = otherCosts.reduce((total, cost) => total + Number(cost.amount), 0);
  const totalProjectCost = itemsTotal + otherCostsTotal;
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Project Summary</h2>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none"
            onClick={onAddItem}
          >
            <i className="fas fa-plus mr-2"></i>
            Add Item
          </button>
          <button 
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center focus:outline-none"
            onClick={onAddCost}
          >
            <i className="fas fa-plus mr-2"></i>
            Add Other Cost
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
          <h3 className="text-sm font-medium text-blue-800 mb-1">Total Items Cost</h3>
          <p className="text-2xl font-bold text-blue-700">{formatCurrency(itemsTotal)}</p>
          <p className="text-sm text-blue-600 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
          <h3 className="text-sm font-medium text-purple-800 mb-1">Total Other Costs</h3>
          <p className="text-2xl font-bold text-purple-700">{formatCurrency(otherCostsTotal)}</p>
          <p className="text-sm text-purple-600 mt-1">{otherCosts.length} {otherCosts.length === 1 ? 'cost' : 'costs'}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-100">
          <h3 className="text-sm font-medium text-green-800 mb-1">Total Project Cost</h3>
          <p className="text-2xl font-bold text-green-700">{formatCurrency(totalProjectCost)}</p>
          <p className="text-sm text-green-600 mt-1">Updated just now</p>
        </div>
      </div>
    </div>
  );
}
