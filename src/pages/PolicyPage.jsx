import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Loader2, FileText } from "lucide-react";

const PolicyPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch policy data
  const fetchPolicy = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`${apiUrl}${id}`);
      
      const response = await axios.get(`${apiUrl}${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setPolicy(response.data);
      } else {
        setError("Failed to fetch policy");
      }
    } catch (error) {
      console.error("Error fetching policy:", error);
      setError(error.response?.data?.message || "Failed to fetch policy");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPolicy();
    }
  }, [id, token]);

  // Function to create markup from HTML content
  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading policy...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Policy</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!policy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Policy Not Found</h3>
          <p className="text-gray-600 mb-4">The requested policy could not be found.</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          {/* Optional: Show title if needed, but you mentioned not to show it */}
          {/* <h1 className="text-3xl font-bold text-gray-900">{policy.title}</h1> */}
        </div>

        {/* Policy Content */}
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            {/* Policy HTML Content */}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={createMarkup(policy.long_description)}
            />
          </div>
        </div>

        {/* Last Updated Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Last updated: {new Date(policy.updated_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage;