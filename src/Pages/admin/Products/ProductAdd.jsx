import React, { useState } from 'react';
import { ArrowLeft, Minus, Plus, Upload, X } from 'lucide-react';

const ProductAdd = () => {
    const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState(Array(3).fill(null));
  
  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = {
        url: URL.createObjectURL(file),
        name: file.name
      };
      setImages(newImages);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
  };
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    if (value >= 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    setQuantity(prev => prev > 0 ? prev - 1 : 0);
  };
  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Page Title */}
      <div className="flex items-center space-x-4 mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <form className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Rest of the form content stays the same */}
          <div className="w-full space-y-2">
            <label className="text-sm font-medium">Product Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product title"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Price</label>
              <input
                type="number"
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
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
            value={quantity}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="">Select category</option>
                <option value="category-a">Category A</option>
                <option value="category-b">Category B</option>
              </select>
            </div>
          
            <div className="space-y-2">
              <label className="text-sm font-medium">Colors</label>
              <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="red">Red</option>
                <option value="blue">Blue</option>
                <option value="green">Green</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Sizes</label>
              <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                <option value="s">Small</option>
                <option value="m">Medium</option>
                <option value="l">Large</option>
                <option value="xl">X-Large</option>
              </select>
            </div>
          </div>

          <div className="w-full space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter product description"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Product Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
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
          <button type="button" className="px-4 py-2 border rounded-lg hover:bg-gray-50 w-1/3 md:w-full">
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-2/3 md:w-full"
          >
            Save Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;