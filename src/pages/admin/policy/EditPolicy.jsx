import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, Save, FileText, Loader2 } from "lucide-react";
import Loader from "../../../cmponent/common/Loader";
import CustomTextEditor from "../../../cmponent/common/TextEditor";
// import CustomTextEditor from "../../../components/CustomTextEditor"; // Import the text editor

const EditPolicy = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [policy, setPolicy] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    long_description: ""
  });

  // Fetch policy data
  const fetchPolicy = async () => {
    try {
      const response = await axios.get(`${apiUrl}privacy/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
         params: {
          t: Date.now(), // prevent caching
        },
      });

      if (response.status === 200) {
        setPolicy(response.data);
        setFormData({
          title: response.data.title,
          long_description: response.data.long_description
        });
      } else {
        toast.error(response.data.message || "Failed to fetch policy");
      }
    } catch (error) {
      console.error("Error fetching policy:", error);
      toast.error(error.response?.data?.message || "Failed to fetch policy");
      navigate("/admin/policies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, [id, token]);

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle text editor change
  const handleEditorChange = (newContent) => {
    setFormData(prev => ({
      ...prev,
      long_description: newContent
    }));
  };

  // Handle policy update
  const handleUpdatePolicy = async () => {
    if (!formData.title.trim() || !formData.long_description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setSaving(true);
    try {
      const response = await axios.put(
        `${apiUrl}privacy/${id}`,
        {
          title: formData.title,
          long_description: formData.long_description
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success(response.data.message || "Policy updated successfully");
        navigate("/admin/handle-policy");
      } else {
        toast.error(response.data.message || "Failed to update policy");
      }
    } catch (error) {
      console.error("Error updating policy:", error);
      toast.error(error.response?.data?.message || "Failed to update policy");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (!policy) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Policy not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <button
            onClick={() => navigate("/admin/policies")}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Policies
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Edit Policy</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update the policy details below
          </p>
        </div>
      </div>

      {/* Edit Form */}
      <div className="mt-8 bg-white shadow rounded-lg">
        <div className="px-6 py-6">
          <div className="space-y-6">
            {/* Title Field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Policy Title
              </label>
              <input
                type="text"
                name="title"
                id="title"
                value={formData.title}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter policy title"
                disabled={saving}
              />
            </div>

            {/* Description Field with Text Editor */}
            <div>
              <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-2">
                Policy Content
              </label>
              <CustomTextEditor
                value={formData.long_description}
                onChange={handleEditorChange}
                placeholder="Enter policy content..."
                height={400}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate("/admin/policies")}
            disabled={saving}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleUpdatePolicy}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPolicy;