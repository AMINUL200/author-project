import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../cmponent/common/Loader";

const HandleFeedBack = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [feedbackList, setFeedbackList] = useState([]);

  const fetchFeedbackData = async () => {
    try {
      const response = await axios.get(`${apiUrl}feedback-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setFeedbackList(response.data.data);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (window.confirm("Are you sure you want to delete this feedback?")) {
      try {
        const response = await axios.delete(`${apiUrl}feedback/${feedbackId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          toast.success("Feedback deleted successfully");
          fetchFeedbackData(); // Refresh the list
        }
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to delete feedback");
      }
    }
  };

  const handleEdit = (feedbackId) => {
    navigate(`/admin/landing-page/add-feedback?update=${feedbackId}`);
  };

  const handleAddNew = () => {
    navigate("/admin/landing-page/add-feedback");
  };

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Add Button */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feedback Management</h1>
            <p className="text-gray-600 mt-2">Manage customer feedback and testimonials</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Feedback</span>
          </button>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User & Rating
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Designation
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbackList.map((feedback) => (
                  <tr key={feedback.id} className="hover:bg-gray-50 transition-colors duration-150">
                    {/* User & Rating */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 relative">
                          <img
                            className="h-12 w-12 rounded-full object-cover border"
                            src={feedback.image}
                            alt={feedback.name}
                          />
                          <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 rounded">
                            {feedback.id}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {feedback.name}
                          </div>
                          <div className="flex items-center mt-1">
                            {/* Star Rating */}
                            {[...Array(5)].map((_, index) => (
                              <svg
                                key={index}
                                className={`w-4 h-4 ${
                                  index < parseInt(feedback.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-1 text-sm text-gray-500">
                              ({feedback.rating}/5)
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Feedback */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs line-clamp-3">
                        {feedback.feedback}
                      </div>
                    </td>

                    {/* Designation */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {feedback.designation}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(feedback.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(feedback.id)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(feedback.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {feedbackList.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">💬</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Feedback Found
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first customer feedback.
              </p>
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Add Your First Feedback
              </button>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {feedbackList.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {feedbackList.length} feedback{feedbackList.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleFeedBack;