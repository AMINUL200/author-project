import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import CustomTextEditor from "../../../cmponent/common/TextEditor";

const ArticleSectionTitle = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();

  const [sectionData, setSectionData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    heading: "",
    paragraph: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // ✅ Fetch section info
  const fetchSectionInfo = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${apiUrl}section-article/edit`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        params: {
          t: Date.now(), // prevent caching
        },
        withCredentials: true,
      });

      if (response.data.status) {
        setSectionData(response.data.data);
        setFormData({
          name: response.data.data.name || "",
          heading: response.data.data.heading || "",
          paragraph: response.data.data.paragraph || "",
          description: response.data.data.description || "",
        });
      } else {
        setError("Failed to fetch section info");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update section info
  const updateSectionInfo = async () => {
    try {
      setUpdating(true);
      setError(null);
      setSuccess(null);

      const response = await axios.post(`${apiUrl}section-article`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (response.data.status) {
        setSectionData(response.data.data);
        setSuccess("Section information updated successfully!");

        // Update form data with the latest data from response
        setFormData({
          name: response.data.data.name || "",
          heading: response.data.data.heading || "",
          paragraph: response.data.data.paragraph || "",
          description: response.data.data.description || "",
        });
      } else {
        setError("Failed to update section info");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setUpdating(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    updateSectionInfo();
  };

  useEffect(() => {
    fetchSectionInfo();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Article Section Title Info</h2>

      {loading && <p className="text-blue-600">Loading...</p>}
      {error && (
        <p className="text-red-600 bg-red-50 p-3 rounded mb-4">{error}</p>
      )}
      {success && (
        <p className="text-green-600 bg-green-50 p-3 rounded mb-4">{success}</p>
      )}

      {sectionData && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heading
            </label>
            <input
              type="text"
              name="heading"
              value={formData.heading}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paragraph
            </label>
            <textarea
              name="paragraph"
              value={formData.paragraph}
              onChange={handleInputChange}
              rows="3"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {/* <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ></textarea> */}
            <CustomTextEditor
              value={formData.description}
              onChange={(newContent) =>
                setFormData((prev) => ({
                  ...prev,
                  description: newContent,
                }))
              }
              height={100}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={updating}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {updating ? "Updating..." : "Update Section"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ArticleSectionTitle;
