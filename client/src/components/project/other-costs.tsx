import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Input } from "@/components/ui/input";

interface OtherCostsProps {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function OtherCosts({ onEdit, onDelete }: OtherCostsProps) {
  const { otherCosts, loading } = useSelector((state: RootState) => state.otherCosts);
  const [searchText, setSearchText] = useState("");
  const [filteredCosts, setFilteredCosts] = useState(otherCosts);
  
  useEffect(() => {
    if (searchText) {
      setFilteredCosts(
        otherCosts.filter(cost => 
          cost.description.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setFilteredCosts(otherCosts);
    }
  }, [otherCosts, searchText]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Other Costs</h2>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search costs..."
            className="pl-10 pr-4 py-2"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">Loading costs...</td>
              </tr>
            ) : filteredCosts.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                  {otherCosts.length === 0 ? "No other costs added yet" : "No costs match your search"}
                </td>
              </tr>
            ) : (
              filteredCosts.map((cost) => (
                <tr key={cost.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{cost.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="text-sm font-medium text-gray-900">{formatCurrency(Number(cost.amount))}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3 focus:outline-none"
                      onClick={() => onEdit(cost.id)}
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button 
                      className="text-red-600 hover:text-red-900 focus:outline-none"
                      onClick={() => onDelete(cost.id)}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {loading ? "Loading..." : `Showing ${filteredCosts.length} of ${otherCosts.length} costs`}
        </p>
        {/* Pagination controls - would be implemented if needed */}
        <div className="flex space-x-2">
          <button 
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={true}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
            disabled={true}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
