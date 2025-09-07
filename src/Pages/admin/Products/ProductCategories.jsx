import React, { useEffect, useState } from "react";
import { Plus, X, Tag, Layers, Package } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductCategories = () => {
  const APIURL = import.meta.env.VITE_API_URL || "";
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeType, setActiveType] = useState(null);
  const [newItem, setNewItem] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSizeType, setSelectedSizeType] = useState("Letteral");
  const [selectedSubCategoryType, setSelectedSubCategoryType] = useState("Letteral");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        const authToken = sessionStorage.getItem("authToken");
        if (!authToken) {
          toast.error("Unauthorized");
          sessionStorage.removeItem("authToken");
          localStorage.removeItem("userRole");
          localStorage.removeItem("admin");
          navigate("/");
          return;
        }

        const response = await fetch(`${APIURL}/LoadAddProductUIData.php`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.response === true) {
            setCategories(data.categories);
            setSubCategories(data.sub_categories);
            setSizes(data.sizes);
          } else {
            toast.error(data.message);

            if (data.message === "Unauthorized") {
              sessionStorage.removeItem("authToken");
              localStorage.removeItem("userRole");
              localStorage.removeItem("admin");
              navigate("/");
            }
          }
        } else {
          toast.error("Failed to load product data");
        }
      } catch (error) {
        toast.error("Failed to load product data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [APIURL, navigate]);

  const handleAddNew = (type) => {
    setActiveType(type);
    setNewItem("");
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedItem = newItem.trim();
    if (!trimmedItem) return;

    switch (activeType) {
      case "category":
        handleAddCategory(trimmedItem);
        break;
      case "sub category":
        handleAddSubCategory(trimmedItem);
        break;
      case "size":
        handleAddSize(trimmedItem);
        break;
      default:
        break;
    }

    setIsModalOpen(false);
    setNewItem("");
  };

  const handleSizeTypeChange = (type) => {
    setSelectedSizeType(type);
  };

  const handleSubCategoryTypeChange = (type) => {
    setSelectedSubCategoryType(type);
  };

  const filteredSizes = sizes.filter(size => {
    return selectedSizeType === "Letteral" ? size.size_type_id === 1 : size.size_type_id === 2;
  });

  const filteredSubCategories = subCategories.filter(subCategory => {
    return selectedSubCategoryType === "Letteral" ? subCategory.size_type_id === 1 : subCategory.size_type_id === 2;
  });

  const handleAddCategory = async (newItem) => {
    try {
      const response = await fetch(`${APIURL}/AddNewCategory.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ category_name: newItem }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response === true) {
          toast.success("Category added successfully");
          setCategories([...categories, { category_name: newItem }]);
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("Failed to add category");
      }
    } catch (error) {
      toast.error("Failed to add category");
    }
  };

  const handleAddSubCategory = async (newItem) => {
    try {
      const sizeTypeId = selectedSubCategoryType === "Letteral" ? 1 : 2;
      const response = await fetch(`${APIURL}/AddNewSubCategory.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ sub_category_name: newItem, size_type_id: sizeTypeId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response === true) {
          toast.success("Sub Category added successfully");
          setSubCategories([...subCategories, { sub_category_name: newItem, size_type_id: sizeTypeId }]);
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("Failed to add sub category");
      }
    } catch (error) {
      toast.error("Failed to add sub category");
    }
  };

  const handleAddSize = async (newItem) => {
    try {
      const sizeTypeId = selectedSizeType === "Letteral" ? 1 : 2;
      const response = await fetch(`${APIURL}/AddNewSize.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ size_name: newItem, size_type_id: sizeTypeId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.response === true) {
          toast.success("Size added successfully");
          setSizes([...sizes, { size_name: newItem, size_type_id: sizeTypeId }]);
        } else {
          toast.error(data.message);
        }
      } else {
        toast.error("Failed to add size");
      }
    } catch (error) {
      toast.error("Failed to add size");
    }
  };

  const AttributeList = ({ title, items, type, icon: Icon, color, filterType = null }) => (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <div className={`p-2 ${color} rounded-lg`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600">Manage {title.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={() => handleAddNew(type)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors shadow-lg"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      {filterType && (
        <div className="flex space-x-2 mb-6">
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              (filterType === "size" ? selectedSizeType : selectedSubCategoryType) === "Letteral"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => filterType === "size" ? handleSizeTypeChange("Letteral") : handleSubCategoryTypeChange("Letteral")}
          >
            Letteral
          </button>
          <button
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              (filterType === "size" ? selectedSizeType : selectedSubCategoryType) === "Numerical"
                ? "bg-yellow-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => filterType === "size" ? handleSizeTypeChange("Numerical") : handleSubCategoryTypeChange("Numerical")}
          >
            Numerical
          </button>
        </div>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors border border-gray-200 hover:border-yellow-300"
            >
              <div className="font-medium text-gray-900">
                {typeof item === "object"
                  ? item.category_name || item.sub_category_name || item.size_name
                  : item}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className={`p-4 ${color} rounded-full w-16 h-16 mx-auto mb-4`}>
            <Icon className="h-8 w-8" />
          </div>
          <p className="text-gray-500">No {title.toLowerCase()} found</p>
          <p className="text-gray-400 text-sm">Add your first {title.toLowerCase().slice(0, -1)} to get started</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="h-12 w-12 rounded-full border-4 border-yellow-500 border-t-transparent animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600 animate-pulse">Loading data...</p>
            </div>
          </div>
          ) : (
          <div>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Product Attributes</h1>
                <p className="text-gray-600 mt-1">Manage categories, subcategories, and sizes for your products</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Categories */}
              <AttributeList
                title="Categories"
                items={categories}
                type="category"
                icon={Tag}
                color="bg-purple-100 text-purple-600"
              />

              {/* Sub Categories */}
              <AttributeList
                title="Sub Categories"
                items={filteredSubCategories}
                type="sub category"
                icon={Layers}
                color="bg-blue-100 text-blue-600"
                filterType="subcategory"
              />

              {/* Sizes */}
              <AttributeList
                title="Sizes"
                items={filteredSizes}
                type="size"
                icon={Package}
                color="bg-green-100 text-green-600"
                filterType="size"
              />
            </div>

            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Add New {activeType?.charAt(0).toUpperCase() + activeType?.slice(1)}
                      </h3>
                      <p className="text-gray-600">Enter the details below</p>
                    </div>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {activeType?.charAt(0).toUpperCase() + activeType?.slice(1)} Name *
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter new ${activeType}`}
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                        autoFocus
                      />
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2 text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                      >
                        Add {activeType?.charAt(0).toUpperCase() + activeType?.slice(1)}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProductCategories;