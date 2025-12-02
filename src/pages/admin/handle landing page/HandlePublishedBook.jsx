import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import Loader from "../../../cmponent/common/Loader";
import { toast } from "react-toastify";
import {
  Eye,
  Edit,
  Trash2,
  FileText,
  Image,
  Plus,
  Download,
} from "lucide-react";

const HandlePublishedBook = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [publishedBookData, setPublishedBookData] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchPublishedBook = async () => {
    try {
      const response = await axios.get(`${apiUrl}author-all-article`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
         params: {
          t: Date.now(), // prevent caching
        },
      });

      if (response.status === 200) {
        setPublishedBookData(response.data.data);
        // console.log(response.data.data);
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      const response = await axios.delete(`${apiUrl}article-delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        toast.success("Article deleted successfully");
        fetchPublishedBook(); // Refresh the list
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Failed to delete article");
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/landing-page/add-published-book?update=${id}`);
  };

  const handleView = (article) => {
    // Open PDF in new tab if available
    if (article.pdf_path) {
      window.open(article.pdf_path, "_blank");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  useEffect(() => {
    fetchPublishedBook();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Published Book
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and view all published articles and books
              </p>
            </div>
            <button
              onClick={() => navigate("/admin/landing-page/add-published-book")}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus size={18} className="mr-2" />
              Add New Book
            </button>
          </div>
        </div>

        {/* Stats */}
        {publishedBookData.length > 0 && (
          <div className="mt-8 mb-8 bg-white rounded-lg shadow-md p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {publishedBookData.length}
                </div>
                <div className="text-sm text-gray-600">Total Book</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {
                    publishedBookData?.filter(
                      (article) => article.status === "active"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Active</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    publishedBookData?.filter(
                      (article) => article.is_free === "1"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Free Book</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {
                    publishedBookData?.filter(
                      (article) => article.is_free !== "1"
                    ).length
                  }
                </div>
                <div className="text-sm text-gray-600">Premium Book</div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {publishedBookData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No Book found
            </h3>
            <p className="mt-2 text-gray-500">
              Get started by creating your first Book.
            </p>
            <button
              onClick={() => navigate("/admin/landing-page/add-article")}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <Plus size={18} className="mr-2" />
              Add New Book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedBookData.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gray-200">
                  {article.images && article.images.length > 0 ? (
                    <img
                      src={article.images[0].image || article.images[0]}
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="text-center">
                        <Image size={48} className="mx-auto text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No image</p>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {article.status}
                    </span>
                  </div>

                  {/* Free/Premium Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        article.is_free === "1"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {article.is_free === "1" ? "Free" : "Premium"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {truncateText(article.title, 60)}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-3" dangerouslySetInnerHTML={{__html:truncateText(article.description, 120)}}>
                    {/* {truncateText(article.description, 120)} */}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>ID: #{article.id}</span>
                    <span>{formatDate(article.created_at)}</span>
                  </div>

                  {/* Images Count */}
                  {article.images && article.images.length > 0 && (
                    <div className="flex items-center text-xs text-gray-500 mb-3">
                      <Image size={16} className="mr-1" />
                      <span>{article.images.length} image(s)</span>
                    </div>
                  )}

                  {/* PDF Available Indicator */}
                  {/* <div className="flex items-center text-xs text-gray-500 mb-3">
                    <FileText size={16} className="mr-1" />
                    <span>{article.pdf_path ? "PDF Available" : "No PDF"}</span>
                  </div> */}

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      {/* View PDF Button */}
                      <button
                        onClick={() => handleView(article)}
                        disabled={!article.pdf_path}
                        className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded ${
                          article.pdf_path
                            ? "text-blue-700 bg-blue-100 hover:bg-blue-200"
                            : "text-gray-400 bg-gray-100 cursor-not-allowed"
                        }`}
                        title={
                          article.pdf_path ? "View PDF" : "No PDF available"
                        }
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(article.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <Edit size={16} className="mr-1" />
                        Edit
                      </button>
                    </div>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(article.id)}
                      disabled={deleteLoading === article.id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 disabled:opacity-50"
                    >
                      {deleteLoading === article.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-700"></div>
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HandlePublishedBook;
