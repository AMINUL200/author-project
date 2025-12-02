import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import CustomTextEditor from "../../../cmponent/common/TextEditor";

const HandleBookReview = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    url1_title: "",
    url1: "",
    url2_title: "",
    url2: "",
    url3_title: "",
    url3: "",
    title_seo: "",
    description_seo: "",
    url1_seo: "",
    url2_seo: "",
    url3_seo: "",
  });

  // Fetch book review data
  const fetchBookReview = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${apiUrl}reviews/edit`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          t: Date.now(), // prevent caching
        },
      });

      if (response.data.status && response.data.data) {
        setBookData(response.data.data);
        setFormData({
          title: response.data.data.title || "",
          description: response.data.data.description || "",
          url1_title: response.data.data.url1_title || "",
          url1: response.data.data.url1 || "",
          url2_title: response.data.data.url2_title || "",
          url2: response.data.data.url2 || "",
          url3_title: response.data.data.url3_title || "",
          url3: response.data.data.url3 || "",
          title_seo: response.data.data.title_seo || "",
          description_seo: response.data.data.description_seo || "",
          url1_seo: response.data.data.url1_seo || "",
          url2_seo: response.data.data.url2_seo || "",
          url3_seo: response.data.data.url3_seo || "",
        });
      }
    } catch (err) {
      setError("Failed to fetch book review data");
      console.error("Error fetching book review:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update book review data
  const updateBookReview = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(`${apiUrl}reviews`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.status) {
        setSuccess("Book review updated successfully!");
        setBookData(response.data.data);
      }
    } catch (err) {
      setError("Failed to update book review");
      console.error("Error updating book review:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    // Fetch data when component mounts
    fetchBookReview();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Manage Book Review</h1>

      {/* Book Review Button */}
      <div className="mb-6">
        <button
          onClick={fetchBookReview}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Loading..." : "Get Books Review"}
        </button>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Input Fields */}
      {bookData && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter book title"
              />
            </div>

            {/* SEO Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                name="title_seo"
                value={formData.title_seo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SEO title"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <CustomTextEditor
                value={formData.description}
                onChange={(newContent) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: newContent,
                  }))
                }
                height={300}
              />
            </div>

            {/* SEO Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Description
              </label>
              <textarea
                name="description_seo"
                value={formData.description_seo}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SEO description"
              />
            </div>

            {/* URL 1 Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                URL 1 Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL 1 Title
                  </label>
                  <input
                    type="text"
                    name="url1_title"
                    value={formData.url1_title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter URL 1 title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL 1
                  </label>
                  <input
                    type="url"
                    name="url1"
                    value={formData.url1}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter URL 1"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL 1 SEO
                  </label>
                  <input
                    type="text"
                    name="url1_seo"
                    value={formData.url1_seo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter URL 1 SEO text"
                  />
                </div>
              </div>
            </div>

            {/* URL 2 Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                URL 2 Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL 2 Title
                  </label>
                  <input
                    type="text"
                    name="url2_title"
                    value={formData.url2_title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter URL 2 title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL 2
                  </label>
                  <input
                    type="url"
                    name="url2"
                    value={formData.url2}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter URL 2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL 2 SEO
                  </label>
                  <input
                    type="text"
                    name="url2_seo"
                    value={formData.url2_seo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter URL 2 SEO text"
                  />
                </div>
              </div>
            </div>

            {/* URL 3 Section */}
            <div className="md:col-span-2 border-t pt-4 mt-2">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                URL 3 Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL 3 Title
                  </label>
                  <input
                    type="text"
                    name="url3_title"
                    value={formData.url3_title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter URL 3 title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL 3
                  </label>
                  <input
                    type="url"
                    name="url3"
                    value={formData.url3}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter URL 3"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL 3 SEO
                  </label>
                  <input
                    type="text"
                    name="url3_seo"
                    value={formData.url3_seo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter URL 3 SEO text"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Update Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={updateBookReview}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Book Review"}
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && !bookData && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">Loading book review data...</p>
        </div>
      )}

      {/* No Data State */}
      {!loading && !bookData && !error && (
        <div className="text-center py-8 text-gray-500">
          Click "Get Books Review" to load the data
        </div>
      )}
    </div>
  );
};

export default HandleBookReview;
