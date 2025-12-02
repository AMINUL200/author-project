import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loader from "../../../cmponent/common/Loader";
import { toast } from "react-toastify";
import axios from "axios";

const HandleAuthorBio = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorBio, setAuthorBio] = useState([]);

  const fetchAuthorBio = async () => {
    try {
      const response = await axios.get(`${apiUrl}bio-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
         params: {
          t: Date.now(), // prevent caching
        },
      });

      if (response.status === 200) {
        setAuthorBio(response.data.data);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bioId) => {
    if (window.confirm("Are you sure you want to delete this author bio?")) {
      try {
        const response = await axios.delete(`${apiUrl}bio/${bioId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          toast.success("Author bio deleted successfully");
          fetchAuthorBio(); // Refresh the list
        }
      } catch (error) {
        console.log(error.message);
        toast.error("Failed to delete author bio");
      }
    }
  };

  const handleEdit = (bioId) => {
    navigate(`/admin/landing-page/add-author-bio?update=${bioId}`);
  };

  const handleAddNew = () => {
    navigate("/admin/landing-page/add-author-bio");
  };

  useEffect(() => {
    fetchAuthorBio();
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
            <h1 className="text-3xl font-bold text-gray-900">Author Bio Management</h1>
            <p className="text-gray-600 mt-2">Manage author biographies and profiles</p>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Author Bio</span>
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
                    Author & Images
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Basic Info
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description & Expertise
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Social Links
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authorBio.map((bio) => (
                  <tr key={bio.id} className="hover:bg-gray-50 transition-colors duration-150">
                    {/* Author & Images */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <div className="flex-shrink-0 relative">
                          <div className="flex space-x-2">
                            <div className="relative">
                              <img
                                className="h-16 w-16 rounded-lg object-cover border"
                                src={bio.image1}
                                alt={`${bio.name} - Image 1`}
                              />
                              <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs px-1 rounded">
                                ID: {bio.id}
                              </div>
                            </div>
                           
                          </div>
                        </div>
                        <div className="mt-4">
                          <div className="text-sm font-medium text-gray-900">
                            {bio.name}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {bio.tagline}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Basic Info */}
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-2">
                        <div>
                          <span className="font-medium text-gray-900">Country:</span>
                          <span className="ml-2 text-gray-600">{bio.country}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Affiliation:</span>
                          <span className="ml-2 text-gray-600 line-clamp-2">{bio.affiliation}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Achievements:</span>
                          <span className="ml-2 text-gray-600 line-clamp-2">{bio.achievements}</span>
                        </div>
                      </div>
                    </td>

                    {/* Description & Expertise */}
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-3">
                        <div>
                          <span className="font-medium text-gray-900">Description:</span>
                          <p className="mt-1 text-gray-600 line-clamp-3" dangerouslySetInnerHTML={{__html:bio.description}}>
                            {/* {bio.description} */}
                          </p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Expertise:</span>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {bio.expertise && bio.expertise.map((skill, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Social Links */}
                    <td className="px-6 py-4">
                      <div className="text-sm space-y-2">
                        {bio.social_links?.twitter && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                            </svg>
                            <span className="text-gray-600 truncate max-w-xs">
                              {bio.social_links.twitter}
                            </span>
                          </div>
                        )}
                        {bio.social_links?.linkedin && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            <span className="text-gray-600 truncate max-w-xs">
                              {bio.social_links.linkedin}
                            </span>
                          </div>
                        )}
                        {(!bio.social_links?.twitter && !bio.social_links?.linkedin) && (
                          <span className="text-gray-500 text-sm">No social links</span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(bio.id)}
                          className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bio.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Updated: {new Date(bio.updated_at).toLocaleDateString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {authorBio.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">👨‍💼</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No Author Bios Found
              </h3>
              <p className="text-gray-600 mb-4">
                Get started by adding your first author biography.
              </p>
              <button
                onClick={handleAddNew}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Add Your First Author Bio
              </button>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {authorBio.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {authorBio.length} author bio{authorBio.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandleAuthorBio;