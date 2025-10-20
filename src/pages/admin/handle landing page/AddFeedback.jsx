import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../cmponent/common/Loader";

const AddFeedback = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const updateId = searchParams.get("update");
  const isUpdateMode = Boolean(updateId);

  const [loading, setLoading] = useState(false);
  const [handleLoading, setHandleLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [feedbackData, setFeedbackData] = useState({
    name: "",
    designation: "",
    rating: "5",
    feedback: "",
    feedback_seo: "",
    image_alt: "",
    image: null,
  });

  // Rating options for dropdown
  const ratingOptions = [
    { value: "1", label: "1 Star" },
    { value: "2", label: "2 Stars" },
    { value: "3", label: "3 Stars" },
    { value: "4", label: "4 Stars" },
    { value: "5", label: "5 Stars" },
  ];

  // Fetch feedback data when in update mode
  useEffect(() => {
    if (isUpdateMode && updateId) {
      fetchFeedbackData();
    }
  }, [isUpdateMode, updateId]);

  const fetchFeedbackData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}feedback/${updateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.data;
        console.log(data.data);

        setFeedbackData({
          name: data.name || "",
          designation: data.designation || "",
          rating: data.rating || "5",
          feedback: data.feedback || "",
          feedback_seo: data.feedback_seo || "",
          image_alt: data.image_alt || "",
          image: data.image || null,
        });
        if (data.image) {
          setImagePreview(data.image);
        }
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
      toast.error("Failed to fetch feedback data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Store file for upload
      setFeedbackData((prev) => ({
        ...prev,
        image: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHandleLoading(true);

    try {
      const formData = new FormData();

      // Append all fields
      formData.append("name", feedbackData.name);
      formData.append("designation", feedbackData.designation);
      formData.append("rating", feedbackData.rating);
      formData.append("feedback", feedbackData.feedback);
      formData.append("feedback_seo", feedbackData.feedback_seo);
      formData.append("image_alt", feedbackData.image_alt);

      // Append image if it's a file (new upload)
      if (feedbackData.image instanceof File) {
        formData.append("image", feedbackData.image);
      }

      let response;
      if (isUpdateMode) {
        // Update existing feedback
        response = await axios.post(`${apiUrl}feedback/${updateId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Feedback updated successfully!");
      } else {
        // Create new feedback
        response = await axios.post(`${apiUrl}feedback`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Feedback created successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        navigate("/admin/landing-page/feedback");
      }
    } catch (error) {
      console.error("Error saving feedback:", error);
      toast.error(`Failed to ${isUpdateMode ? "update" : "create"} feedback`);
    } finally {
      setHandleLoading(false);
    }
  };

  const handleCancel = () => {
    // Clean up object URL to avoid memory leaks
    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    navigate("/admin/landing-page/feedback");
  };

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (loading && isUpdateMode) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isUpdateMode ? `Edit Feedback #${updateId}` : "Add New Feedback"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isUpdateMode
              ? "Update feedback details"
              : "Add new customer feedback or testimonial"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - User Details */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={feedbackData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter customer name"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Designation *
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={feedbackData.designation}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter designation (e.g., Dr., CEO, Manager)"
                  />
                </div>

                {/* Rating Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating *
                  </label>
                  <select
                    name="rating"
                    value={feedbackData.rating}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {ratingOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* Star Preview */}
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-gray-600 mr-2">Preview:</span>
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-5 h-5 ${
                            index < parseInt(feedbackData.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      ({feedbackData.rating}/5)
                    </span>
                  </div>
                </div>

                {/* Image Alt Text */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image Alt Text
                  </label>
                  <input
                    type="text"
                    name="image_alt"
                    value={feedbackData.image_alt}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter descriptive text for the profile image"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional: Descriptive text for accessibility and SEO
                  </p>
                </div>
              </div>

              {/* Right Column - Feedback & Image */}
              <div className="space-y-6">
                {/* Feedback */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Feedback *
                  </label>
                  <textarea
                    name="feedback"
                    value={feedbackData.feedback}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter customer feedback or testimonial"
                  />
                </div>

                {/* SEO Feedback */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SEO Feedback
                  </label>
                  <textarea
                    name="feedback_seo"
                    value={feedbackData.feedback_seo}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter SEO-optimized version of the feedback"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional: A concise, SEO-friendly version of the feedback for search engines
                  </p>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image {!isUpdateMode && "*"}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      {imagePreview ? (
                        <div className="mb-4">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-32 w-32 object-cover rounded-full border-4 border-white shadow-md"
                          />
                          <p className="text-sm text-gray-600 mt-2">
                            Click to change image
                          </p>
                        </div>
                      ) : (
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>
                            {imagePreview ? "Change Image" : "Upload a file"}
                          </span>
                          <input
                            id="image-upload"
                            name="image"
                            type="file"
                            className="sr-only"
                            onChange={handleImageChange}
                            accept="image/*"
                            required={!isUpdateMode}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={handleLoading}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={handleLoading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {handleLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    {isUpdateMode ? "Updating..." : "Creating..."}
                  </span>
                ) : isUpdateMode ? (
                  "Update Feedback"
                ) : (
                  "Create Feedback"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Form Tips */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Form Tips</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• Use high-quality profile images for better presentation</li>
            <li>• Rating helps showcase customer satisfaction level</li>
            <li>• Image Alt Text improves accessibility for screen readers</li>
            <li>• SEO Feedback helps with search engine visibility</li>
            {isUpdateMode && (
              <li>• Leave image field empty to keep the current profile image</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddFeedback;