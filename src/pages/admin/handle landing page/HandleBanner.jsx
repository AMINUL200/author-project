import axios from "axios";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";

const HandleBanner = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const [bannerData, setBannerData] = useState({
    heading1: "",
    heading2: "",
    description: "",
    button_name: "",
    image_title: "",
    image_subtitle: "",
    images: [],
  });

  const [newImages, setNewImages] = useState([]); // For newly uploaded files
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchBannerData = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual API call to get current banner data
      const response = await axios.get(`${apiUrl}show-banner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // const data = await response.json();

      if (response.status === 200) {
        const data = response.data.data;
        // setBannerData(
      }
      setBannerData(mockData);
    } catch (error) {
      console.error("Error fetching banner data:", error);
      setMessage("Error loading banner data");
    } finally {
      setLoading(false);
    }
  };
  // Fetch existing banner data
  useEffect(() => {
    fetchBannerData();
  }, []);

  const handleChange = (e) => {
    setBannerData({ ...bannerData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and size
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        setMessage("Please upload only image files");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        setMessage("File size should be less than 5MB");
        return false;
      }
      return true;
    });

    setNewImages((prev) => [...prev, ...validFiles]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setBannerData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const formData = new FormData();

      // Append text fields
      formData.append("heading1", bannerData.heading1);
      formData.append("heading2", bannerData.heading2);
      formData.append("description", bannerData.description);
      formData.append("button_name", bannerData.button_name);
      formData.append("image_title", bannerData.image_title);
      formData.append("image_subtitle", bannerData.image_subtitle);

      // Append new images
      newImages.forEach((file, index) => {
        formData.append(`images[${index}]`, file);
      });

      // If you want to keep existing images, you might need to send their URLs too
      // bannerData.images.forEach((url, index) => {
      //   formData.append(`existing_images[${index}]`, url);
      // });

      // TODO: Replace with actual API endpoint
      const response = await fetch("/api/banner/3", {
        method: "POST", // or 'PUT' depending on your API
        body: formData,
        // Note: Don't set Content-Type header for FormData, browser will set it automatically with boundary
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Banner updated successfully:", result);
        setMessage("Banner updated successfully!");
        setNewImages([]); // Clear new images after successful upload
      } else {
        throw new Error("Failed to update banner");
      }
    } catch (error) {
      console.error("Error updating banner:", error);
      setMessage("Error updating banner. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && Object.values(bannerData).every((value) => value === "")) {
    return (
      <div className="p-6 mt-8 max-w-3xl mx-auto bg-white rounded-xl shadow-md flex justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 mt-8 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Update Hero Section</h2>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.includes("Error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Text Inputs */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Main Heading
          </label>
          <input
            type="text"
            name="heading1"
            placeholder="Main Heading"
            value={bannerData.heading1}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Secondary Heading
          </label>
          <input
            type="text"
            name="heading2"
            placeholder="Secondary Heading"
            value={bannerData.heading2}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description"
            value={bannerData.description}
            onChange={handleChange}
            rows="4"
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Button Text
          </label>
          <input
            type="text"
            name="button_name"
            placeholder="Button Text"
            value={bannerData.button_name}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Title
          </label>
          <input
            type="text"
            name="image_title"
            placeholder="Image Title"
            value={bannerData.image_title}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image Subtitle
          </label>
          <input
            type="text"
            name="image_subtitle"
            placeholder="Image Subtitle"
            value={bannerData.image_subtitle}
            onChange={handleChange}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        {/* Existing Images Display */}
        {bannerData.images && bannerData.images.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Existing Images
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {bannerData.images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  <img
                    src={imageUrl}
                    alt={`Existing ${index}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* New Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload New Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-500 mt-1">
            You can select multiple images. Maximum file size: 5MB per image.
          </p>
        </div>

        {/* New Images Preview */}
        {newImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Images Preview
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {newImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`px-6 py-2 rounded text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default HandleBanner;
