import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

const ProductCategories = () => {
  const [categories, setCategories] = useState(['T-Shirt', 'Pants', 'Innerwear', 'Jackets', 'Shorts']);
  const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL', 'XXL']);
  const [colors, setColors] = useState(['Black', 'White', 'Navy Blue', 'Gray', 'Red']);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [newItem, setNewItem] = useState('');

  const handleAddNew = (type) => {
    setActiveType(type);
    setNewItem('');
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;

    switch (activeType) {
      case 'category':
        setCategories([...categories, newItem]);
        break;
      case 'size':
        setSizes([...sizes, newItem]);
        break;
      case 'color':
        setColors([...colors, newItem]);
        break;
      default:
        break;
    }

    setIsModalOpen(false);
    setNewItem('');
  };

  const AttributeList = ({ title, items, type }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <button 
          onClick={() => handleAddNew(type)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors text-gray-700"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Product Attributes</h1>
      
      <div className="space-y-6">
        <AttributeList title="Categories" items={categories} type="category" />
        <AttributeList title="Sizes" items={sizes} type="size" />
        <AttributeList title="Colors" items={colors} type="color" />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                Add New {activeType?.charAt(0).toUpperCase() + activeType?.slice(1)}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder={`Enter new ${activeType}`}
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategories;