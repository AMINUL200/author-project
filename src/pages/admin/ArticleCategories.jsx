import React, { useEffect, useState } from "react";
import { Plus, Tag, Edit, Trash2, X } from "lucide-react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const ArticleCategories = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const [categories, setCategories] = useState([]);

  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    status: "active",
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiUrl}article-categories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (formData.name.trim() && formData.description.trim()) {
      setSubmitting(true);

      try {
        if (isEditing) {
          // Update existing category via API
          const response = await axios.put(
            `${apiUrl}article-categories/${formData.id}`,
            {
              name: formData.name,
              description: formData.description,
              status: formData.status,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 200) {
            fetchCategories(); // Refresh the list from server
            console.log("Category updated successfully");
          }
        } else {
          // Add new category via API
          const response = await axios.post(
            `${apiUrl}article-categories`,
            {
              name: formData.name,
              description: formData.description,
              status: formData.status,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.status === 201 || response.status === 200) {
            // setCategories([...categories, newCategory]);
            fetchCategories(); // Refresh the list from server
            console.log("Category created successfully");
          }
        }
        closePopup();
      } catch (error) {
        console.error("Error saving category:", error);
        // You might want to show an error message to the user here
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleEditCategory = (category) => {
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      status: category.status || "active", // fallback to active if status is not set
    });
    setIsEditing(true);
    setShowPopup(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}article-categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.status === 200) {
      fetchCategories(); // Refresh the list from server
      console.log("Category deleted successfully");
    } else {
      console.error("Error deleting category");
    }
    } catch (error) {
      console.log("Error deleting category:", error);
      toast.error(error.message || "Failed to delete category");
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setIsEditing(false);
    setFormData({ id: null, name: "", description: "", status: "active" });
  };

  return (
    <div className="min-h-screen p-8 font-sans">
      {/* Header Section */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
              Article Categories
            </h1>
            <p className="text-gray-600 text-lg">
              Organize your content with custom categories
            </p>
          </div>

          <button
            onClick={() => setShowPopup(true)}
            className="group relative overflow-hidden bg-gray-900 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-2xl hover:shadow-gray-900/25 hover:-translate-y-1"
          >
            <div className="flex items-center space-x-3 relative z-10">
              <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
              <span>Add Category</span>
            </div>

            {/* Overlay stays behind the text */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-0"></div>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group relative bg-white border border-gray-200 rounded-3xl p-8 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 hover:-translate-y-2"
            >
              {/* Category Icon */}
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-900 transition-colors duration-300">
                <Tag className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
              </div>

              {/* Category Content */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-800 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {category.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">
                  {category.articles} articles
                </span>
                {/* Status indicator */}
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      category.status === "active"
                        ? "bg-green-400"
                        : "bg-gray-400"
                    }`}
                  ></div>
                  <span
                    className={`text-xs font-medium capitalize ${
                      category.status === "active"
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {category.status || "active"}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleEditCategory(category)}
                  className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Edit</span>
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="bg-red-50 hover:bg-red-100 text-red-600 p-2 rounded-xl transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 border-2 border-gray-900 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Category Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md relative animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-6 right-6 w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>

            {/* Popup Header */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isEditing ? "Edit Category" : "Add New Category"}
              </h2>
              <p className="text-gray-600">
                {isEditing
                  ? "Update your category details"
                  : "Create a new category to organize your articles"}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Category Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter category name"
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter category description"
                  rows="4"
                  className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 resize-none text-gray-900"
                />
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Status
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full px-4 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 text-gray-900 bg-white appearance-none cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                  {/* Custom dropdown arrow */}
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8">
              <button
                onClick={closePopup}
                disabled={submitting}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 rounded-2xl font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                disabled={submitting}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-2xl font-semibold transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : isEditing ? (
                  "Update Category"
                ) : (
                  "Add Category"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleCategories;
