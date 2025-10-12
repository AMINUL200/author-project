import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import CustomTextEditor from "../../../cmponent/common/TextEditor";
// import RichTextInput from "../../../cmponent/common/RichTextInput";

const AddAuthorBio = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const updateId = searchParams.get("update");
  const isUpdateMode = Boolean(updateId);

  const [loading, setLoading] = useState(false);
  const [image1Preview, setImage1Preview] = useState("");
  const [image2Preview, setImage2Preview] = useState("");
  const [expertiseInput, setExpertiseInput] = useState("");
  const [authorData, setAuthorData] = useState({
    name: "",
    affiliation: "",
    description: "",
    country: "",
    tagline: "",
    achievements: "",
    expertise: [],
    social_links: {
      twitter: "",
      linkedin: "",
      facebook: "",
      instagram: "",
    },
    image1: null,
    image2: null,
  });

  // Fetch author data when in update mode
  useEffect(() => {
    if (isUpdateMode && updateId) {
      fetchAuthorData();
    }
  }, [isUpdateMode, updateId]);

  const fetchAuthorData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${apiUrl}bio/${updateId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.data;
        setAuthorData({
          name: data.name || "",
          affiliation: data.affiliation || "",
          description: data.description || "",
          country: data.country || "",
          tagline: data.tagline || "",
          achievements: data.achievements || "",
          expertise: data.expertise || [],
          social_links: data.social_links || {
            twitter: "",
            linkedin: "",
            facebook: "",
            instagram: "",
          },
          image1: data.image1 || null,
          image2: data.image2 || null,
        });
        if (data.image1) setImage1Preview(data.image1);
        if (data.image2) setImage2Preview(data.image2);
      }
    } catch (error) {
      console.error("Error fetching author bio:", error);
      toast.error("Failed to fetch author bio data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuthorData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialLinkChange = (e) => {
    const { name, value } = e.target;
    setAuthorData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e, imageType) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      if (imageType === "image1") {
        setImage1Preview(previewUrl);
        setAuthorData((prev) => ({ ...prev, image1: file }));
      } else {
        setImage2Preview(previewUrl);
        setAuthorData((prev) => ({ ...prev, image2: file }));
      }
    }
  };

  const handleAddExpertise = () => {
    if (
      expertiseInput.trim() &&
      !authorData.expertise.includes(expertiseInput.trim())
    ) {
      setAuthorData((prev) => ({
        ...prev,
        expertise: [...prev.expertise, expertiseInput.trim()],
      }));
      setExpertiseInput("");
    }
  };

  const handleRemoveExpertise = (index) => {
    setAuthorData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((_, i) => i !== index),
    }));
  };

  const handleExpertiseKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddExpertise();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Append all text fields
      formData.append("name", authorData.name);
      formData.append("affiliation", authorData.affiliation);
      formData.append("description", authorData.description);
      formData.append("country", authorData.country);
      formData.append("tagline", authorData.tagline);
      formData.append("achievements", authorData.achievements);

      // Append expertise as array - handle both string and array formats
      if (Array.isArray(authorData.expertise)) {
        authorData.expertise.forEach((skill) => {
          formData.append("expertise[]", skill);
        });
      } else if (typeof authorData.expertise === "string") {
        // If expertise comes as string, try to parse it
        try {
          const parsedExpertise = JSON.parse(authorData.expertise);
          if (Array.isArray(parsedExpertise)) {
            parsedExpertise.forEach((skill) => {
              formData.append("expertise[]", skill);
            });
          }
        } catch {
          // If parsing fails, add as single item
          formData.append("expertise[]", authorData.expertise);
        }
      }

      // Append social links properly
      Object.keys(authorData.social_links).forEach((key) => {
        if (authorData.social_links[key]) {
          formData.append(`social_links[${key}]`, authorData.social_links[key]);
        }
      });

      // Append image files if they are new uploads
      if (authorData.image1 instanceof File) {
        formData.append("image1", authorData.image1);
      }
      if (authorData.image2 instanceof File) {
        formData.append("image2", authorData.image2);
      }

      let response;
      if (isUpdateMode) {
        // Update existing author bio - use PUT method for updates
        response = await axios.post(`${apiUrl}bio/${updateId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Author bio updated successfully!");
      } else {
        // Create new author bio
        response = await axios.post(`${apiUrl}bio`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Author bio created successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        navigate("/admin/landing-page/author-bio");
      }
    } catch (error) {
      console.error("Error saving author bio:", error);
      // More detailed error message
      if (error.response) {
        toast.error(
          `Failed to ${isUpdateMode ? "update" : "create"} author bio: ${
            error.response.data.message || "Server error"
          }`
        );
      } else {
        toast.error(
          `Failed to ${isUpdateMode ? "update" : "create"} author bio`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Clean up object URLs
    if (image1Preview.startsWith("blob:")) URL.revokeObjectURL(image1Preview);
    if (image2Preview.startsWith("blob:")) URL.revokeObjectURL(image2Preview);
    navigate("/admin/landing-page/author-bio");
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (image1Preview.startsWith("blob:")) URL.revokeObjectURL(image1Preview);
      if (image2Preview.startsWith("blob:")) URL.revokeObjectURL(image2Preview);
    };
  }, [image1Preview, image2Preview]);

  if (loading && isUpdateMode) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isUpdateMode
              ? `Edit Author Bio #${updateId}`
              : "Add New Author Bio"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isUpdateMode
              ? "Update author biography details"
              : "Create a new author biography"}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-8">
              {/* Basic Info & Images - Now in a single column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={authorData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter author name"
                    />
                  </div>

                  {/* Tagline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tagline *
                    </label>
                    <input
                      type="text"
                      name="tagline"
                      value={authorData.tagline}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter professional tagline"
                    />
                  </div>

                  {/* Affiliation */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Affiliation *
                    </label>
                    <input
                      type="text"
                      name="affiliation"
                      value={authorData.affiliation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter organization or affiliation"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={authorData.country}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter country"
                    />
                  </div>

                  {/* Achievements */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Achievements
                    </label>
                    <textarea
                      name="achievements"
                      value={authorData.achievements}
                      onChange={handleInputChange}
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter key achievements (comma separated)"
                    />
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Image 1 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Image *
                    </label>
                    <ImageUpload
                      preview={image1Preview}
                      onChange={(e) => handleImageChange(e, "image1")}
                      required={!isUpdateMode}
                      label="Upload primary image"
                    />
                  </div>

                  {/* Image 2 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Image
                    </label>
                    <ImageUpload
                      preview={image2Preview}
                      onChange={(e) => handleImageChange(e, "image2")}
                      required={false}
                      label="Upload secondary image"
                    />
                  </div>
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="border-t pt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                {/* <textarea
                  name="description"
                  value={authorData.description}
                  onChange={handleInputChange}
                  required
                  rows="8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter author biography description"
                /> */}

                <CustomTextEditor
                  value={authorData.description}
                  onChange={(newContent) =>
                    setAuthorData((prev) => ({
                      ...prev,
                      description: newContent,
                    }))
                  }
                  placeholder="Enter author biography description"
                  height={400}
                />
              </div>

              {/* Expertise & Social Links - Side by side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 border-t pt-8">
                {/* Expertise */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expertise & Skills
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={expertiseInput}
                      onChange={(e) => setExpertiseInput(e.target.value)}
                      onKeyPress={handleExpertiseKeyPress}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add expertise (e.g., Machine Learning)"
                    />
                    <button
                      type="button"
                      onClick={handleAddExpertise}
                      className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {authorData.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveExpertise(index)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Social Links
                  </label>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      name="twitter"
                      value={authorData.social_links.twitter}
                      onChange={handleSocialLinkChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://twitter.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      name="linkedin"
                      value={authorData.social_links.linkedin}
                      onChange={handleSocialLinkChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      name="facebook"
                      value={authorData.social_links.facebook}
                      onChange={handleSocialLinkChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://facebook.com/username"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Instagram URL
                    </label>
                    <input
                      type="url"
                      name="instagram"
                      value={authorData.social_links.instagram}
                      onChange={handleSocialLinkChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://instagram.com/username"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-end space-x-3 border-t pt-6">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
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
                  "Update Author Bio"
                ) : (
                  "Create Author Bio"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Separate Image Upload Component
const ImageUpload = ({ preview, onChange, required, label }) => {
  return (
    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
      <div className="space-y-1 text-center">
        {preview ? (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto h-32 w-32 object-cover rounded-lg border"
            />
            <p className="text-sm text-gray-600 mt-2">Click to change image</p>
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
            <span>{preview ? "Change Image" : label}</span>
            <input
              id="image-upload"
              type="file"
              className="sr-only"
              onChange={onChange}
              accept="image/*"
              required={required && !preview}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  );
};

export default AddAuthorBio;
