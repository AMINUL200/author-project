import React, { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loader from "../../../cmponent/common/Loader";

const BannerList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);

  const fetchBannerList = async () => {
    try {
      const response = await axios.get(`${apiUrl}banner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setBanners(response.data);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBannerList();
  }, []);

  const handleDelete = async (bannerId) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        const response = await axios.delete(`${apiUrl}banner-delete/${bannerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          toast.success("Banner deleted successfully");
          fetchBannerList(); // Refresh the list
        }
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to delete banner");
      }
    }
  };

  if (loading) {
    return <Loader/>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Add Button */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banner Management</h1>
            <p className="text-gray-600 mt-2">Manage your website banners and promotions</p>
          </div>
          <button
            onClick={() => navigate(`/admin/landing-page/add-banners`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Banner</span>
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
                    Banner
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Headings
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Button
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner.id} className="hover:bg-gray-50 transition-colors duration-150">
                    {/* Banner Image & Info */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 relative">
                          <img
                            className="h-16 w-16 rounded-md object-cover border"
                            src={banner.images[0]}
                            alt={banner.image_title}
                          />
                          <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 rounded">
                            {banner.id}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {banner.image_title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {banner.image_subtitle}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Headings */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs">
                        {banner.heading1}
                      </div>
                      <div className="text-sm text-gray-500 mt-1 max-w-xs">
                        {banner.heading2}
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs line-clamp-3">
                        {banner.description}
                      </div>
                    </td>

                    {/* Button */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {banner.button_name}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(banner.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/admin/landing-page/add-banners?update=${banner.id}`)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(banner.id)}
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
          {banners.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📱</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Banners Found
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first banner.
              </p>
              <button
                onClick={() => toast.info("Add banner functionality to be implemented")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Create Your First Banner
              </button>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {banners.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {banners.length} banner{banners.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerList;