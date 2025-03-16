import React, { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, Upload, X } from 'lucide-react';

const ProductEdit = ({ productId }) => {
  const initialProductData = {
    id: "prod_123",
    title: "Premium Cotton T-Shirt",
    price: 29.99,
    quantity: 50,
    category: "Clothing",
    brand: "FashionBrand",
    colors: "Blue",
    sizes: "M",
    description: "High-quality cotton t-shirt perfect for everyday wear.",
    images: [
     null,null,
      null
    ]
  };

  const [editableData, setEditableData] = useState({
    price: 0,
    quantity: 0,
    title: "",
    images: []
  });

  useEffect(() => {
    setEditableData({
      price: initialProductData.price,
      quantity: initialProductData.quantity,
      title: initialProductData.title,
      images: initialProductData.images
    });
  }, []);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...editableData.images];
      newImages[index] = {
        url: URL.createObjectURL(file),
        name: file.name
      };
      setEditableData(prev => ({ ...prev, images: newImages }));
    }
  };

  const removeImage = (index) => {
    const newImages = [...editableData.images];
    newImages[index] = null;
    setEditableData(prev => ({ ...prev, images: newImages }));
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setEditableData(prev => ({ ...prev, quantity: value }));
    }
  };

  const incrementQuantity = () => {
    setEditableData(prev => ({ ...prev, quantity: prev.quantity + 1 }));
  };

  const decrementQuantity = () => {
    setEditableData(prev => ({ 
      ...prev, 
      quantity: prev.quantity > 0 ? prev.quantity - 1 : 0 
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    ('Saving changes:', editableData);
  };

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div className="w-full space-y-2">
            <label className="text-sm font-medium">Product Title</label>
            <input
              type="text"
              value={editableData.title}
              disabled
              onChange={(e) => setEditableData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <input
                type="number"
                value={editableData.price}
                onChange={(e) => setEditableData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="relative flex items-center">
                <button
                  type="button"
                  onClick={decrementQuantity}
                  className="absolute left-0 h-full px-2 text-gray-600 hover:text-gray-800 border-r"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="0"
                  value={editableData.quantity}
                  onChange={handleQuantityChange}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center"
                />
                <button
                  type="button"
                  onClick={incrementQuantity}
                  className="absolute right-0 h-full px-2 text-gray-600 hover:text-gray-800 border-l"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <input
                type="text"
                value={initialProductData.category}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <input
                type="text"
                value={initialProductData.brand}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Colors</label>
              <input
                type="text"
                value={initialProductData.colors}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sizes</label>
              <input
                type="text"
                value={initialProductData.sizes}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-50"
              />
            </div>
          </div>

          <div className="w-full space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={initialProductData.description}
              disabled
              className="w-full p-2 border rounded-lg bg-gray-50"
              rows="4"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Product Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {editableData.images?.map((image, index) => (
                <div 
                  key={index} 
                  className={`border-2 border-dashed rounded-lg p-4 ${
                    image ? 'border-blue-500' : 'border-gray-300'
                  }`}
                >
                  {image ? (
                    <div className="relative group">
                      <img
                        src={image.url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center space-y-2 cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-sm text-gray-500">Upload Image {index + 1}</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, index)}
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between md:justify-end space-x-4">
          <button type="button" className="px-4 py-2 border rounded-lg hover:bg-gray-50 w-1/3 md:w-auto">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-2/3 md:w-auto"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEdit;