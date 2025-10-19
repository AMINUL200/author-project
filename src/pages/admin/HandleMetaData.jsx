import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../context/AuthContext";

const HandleMetaData = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    site_title: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    canonical_tag: ""
  });

  // Fetch metadata function
  const getMetadata = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}meta-tags-edit`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setMetadata(response.data);
      setFormData({
        site_title: response.data.site_title || "",
        meta_title: response.data.meta_title || "",
        meta_description: response.data.meta_description || "",
        meta_keywords: response.data.meta_keywords || "",
        canonical_tag: response.data.canonical_tag || ""
      });
      
      toast.success("Metadata loaded successfully!");
    } catch (error) {
      console.error("Error fetching metadata:", error);
      toast.error("Failed to load metadata");
    } finally {
      setLoading(false);
    }
  };

  // Update metadata function
  const updateMetadata = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const response = await axios.put(
        `${apiUrl}meta-tags`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      setMetadata(response.data);
      toast.success("Metadata updated successfully!");
    } catch (error) {
      console.error("Error updating metadata:", error);
      toast.error("Failed to update metadata");
    } finally {
      setSaving(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Load metadata on component mount
  useEffect(() => {
    getMetadata();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading metadata...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Manage Site Metadata
        </h1>
        
        {metadata && (
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h2 className="text-xl font-semibold text-gray-700">
                Edit SEO Metadata
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Last updated: {new Date(metadata.updated_at).toLocaleDateString()}
              </p>
            </div>
            
            <form onSubmit={updateMetadata} className="p-6 space-y-6">
              {/* Site Title */}
              <div>
                <label htmlFor="site_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Site Title *
                </label>
                <input
                  type="text"
                  id="site_title"
                  name="site_title"
                  value={formData.site_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Meta Title */}
              <div>
                <label htmlFor="meta_title" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title *
                </label>
                <input
                  type="text"
                  id="meta_title"
                  name="meta_title"
                  value={formData.meta_title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>

              {/* Meta Description */}
              <div>
                <label htmlFor="meta_description" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description *
                </label>
                <textarea
                  id="meta_description"
                  name="meta_description"
                  value={formData.meta_description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>

              {/* Meta Keywords */}
              <div>
                <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Keywords
                </label>
                <textarea
                  id="meta_keywords"
                  name="meta_keywords"
                  value={formData.meta_keywords}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter keywords separated by commas"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Separate keywords with commas
                </p>
              </div>

              {/* Canonical Tag */}
              <div>
                <label htmlFor="canonical_tag" className="block text-sm font-medium text-gray-700 mb-2">
                  Canonical URL *
                </label>
                <input
                  type="url"
                  id="canonical_tag"
                  name="canonical_tag"
                  value={formData.canonical_tag}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={getMetadata}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  disabled={saving}
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

       
      </div>
    </div>
  );
};

export default HandleMetaData;