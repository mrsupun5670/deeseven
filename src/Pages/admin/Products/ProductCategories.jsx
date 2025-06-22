import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
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
            {typeof item === "object"
              ? item.category_name || item.sub_category_name || item.size_name
              : item}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full mx-auto p-6 bg-gray-50 min-h-screen">
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto"></div>
            <p className="text-muted-foreground animate-pulse">
              Loading data...
            </p>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Product Attributes
          </h1>
          <div className="space-y-6">
            <AttributeList
              title="Categories"
              items={categories}
              type="category"
            />
            <div className="flex space-x-2 mb-4">
              <button
                className={`px-4 py-2 rounded-lg ${selectedSubCategoryType === "Letteral" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                onClick={() => handleSubCategoryTypeChange("Letteral")}
              >
                Letteral
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${selectedSubCategoryType === "Numerical" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                onClick={() => handleSubCategoryTypeChange("Numerical")}
              >
                Numerical
              </button>
            </div>
            <AttributeList
              title="Sub Categories"
              items={filteredSubCategories}
              type="sub category"
            />
            <div className="flex space-x-2 mb-4">
              <button
                className={`px-4 py-2 rounded-lg ${selectedSizeType === "Letteral" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                onClick={() => handleSizeTypeChange("Letteral")}
              >
                Letteral
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${selectedSizeType === "Numerical" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
                  }`}
                onClick={() => handleSizeTypeChange("Numerical")}
              >
                Numerical
              </button>
            </div>
            <AttributeList
              title="Sizes"
              items={filteredSizes}
              type="size"
            />
          </div>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">
                    Add New{" "}
                    {activeType?.charAt(0).toUpperCase() + activeType?.slice(1)}
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
      )}
      <ToastContainer />
    </div>
  );
};

export default ProductCategories;