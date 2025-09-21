import React, { useState, useMemo, useEffect } from "react";
import {
  ArrowRight,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../cmponent/common/Loader";
import { Link } from "react-router-dom";

const ArticlePage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);

  const itemsPerPageOptions = [4, 8, 12, 16, 20];

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${apiUrl}article-list`);
      
      if(response.status === 200 && response.data.status) {
        
        // Set articles from API response
        const fetchedArticles = response.data.data || [];
        setArticles(fetchedArticles);
        
        // Extract unique categories from the fetched articles
        const uniqueCategories = [...new Set(
          fetchedArticles
            .filter(article => article.category && article.category.name)
            .map(article => article.category.name)
        )];
        
        setCategories(uniqueCategories);
        
        // Set all categories as selected by default
        setSelectedCategories(uniqueCategories);
        
      } else {
        toast.error(response.data.message || "Failed to fetch articles");
      }
      
    } catch (error) {
      console.log("Error fetching articles:", error);
      toast.error("Error fetching articles: " + (error.response?.data?.message || error.message));
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter articles based on search and selected categories
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (article.category?.name && article.category.name.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory =
        selectedCategories.length === 0 ||
        (article.category?.name && selectedCategories.includes(article.category.name));
      
      return matchesSearch && matchesCategory;
    });
  }, [articles, searchTerm, selectedCategories]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArticles = filteredArticles.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategories, itemsPerPage]);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) => {
      if (prev.includes(category)) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSelectAllCategories = () => {
    if (selectedCategories.length === categories.length) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([...categories]);
    }
  };

  const handleArticleClick = (id) => {
    console.log(`Navigate to article ${id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Get category counts
  const getCategoryCount = (category) => {
    return articles.filter((article) => 
      article.category?.name === category
    ).length;
  };

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (error) {
      return "N/A";
    }
  };

  // Get image URL helper
  const getImageUrl = (article) => {
    if (article.image) {
      return article.image;
    }
    // Fallback to a default image based on category
    const categoryImages = {
      "Math": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      "Biology": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop",
      "Default": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop"
    };
    
    return categoryImages[article.category?.name] || categoryImages["Default"];
  };

  if(loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              All Articles
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our comprehensive collection of articles covering various academic topics
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between max-w-4xl mx-auto">
            <div className="relative flex-1 min-w-0">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search articles or categories..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-5 w-5 text-gray-500" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filter */}
          <div
            className={`${
              sidebarOpen ? "block" : "hidden"
            } md:block fixed md:static inset-y-0 left-0 z-50 w-80 md:w-64 bg-white md:bg-transparent border-r md:border-r-0 border-gray-200 md:border-gray-200 md:border-r p-6 md:p-0 overflow-y-auto`}
          >
            {/* Mobile Close Button */}
            <div className="md:hidden flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-white md:bg-gray-50 rounded-lg p-4 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Categories
                </h3>
              </div>

              {categories.length > 0 && (
                <>
                  {/* Select All Checkbox */}
                  <div className="mb-4 pb-4 border-b border-gray-200">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedCategories.length === categories.length}
                        onChange={handleSelectAllCategories}
                        className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-900 group-hover:text-purple-600 transition-colors">
                        Select All
                      </span>
                    </label>
                  </div>

                  {/* Individual Category Checkboxes */}
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <label
                        key={category}
                        className="flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category)}
                            onChange={() => handleCategoryChange(category)}
                            className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2"
                          />
                          <span className="ml-3 text-sm text-gray-700 group-hover:text-purple-600 transition-colors">
                            {category}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                          {getCategoryCount(category)}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Clear Filters */}
                  {selectedCategories.length < categories.length && (
                    <button
                      onClick={() => setSelectedCategories([...categories])}
                      className="w-full mt-4 text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Clear Filters
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/50 bg-opacity-50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Main Content */}
          <div className="flex-1">
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {articles.length === 0 
                    ? "No articles available."
                    : "No articles found matching your search criteria."
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Results Info and Show Per Page */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
                  <div>
                    <p className="text-gray-600">
                      Showing {startIndex + 1}-
                      {Math.min(endIndex, filteredArticles.length)} of{" "}
                      {filteredArticles.length} article
                      {filteredArticles.length !== 1 ? "s" : ""}
                      {selectedCategories.length < categories.length &&
                        selectedCategories.length > 0 &&
                        ` in ${selectedCategories.join(", ")}`}
                      {searchTerm && ` matching "${searchTerm}"`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Show per page:
                    </span>
                    <select
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white text-sm"
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    >
                      {itemsPerPageOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {currentArticles.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group  overflow-hidden"
                      // onClick={() => handleArticleClick(article.id)}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={getImageUrl(article)}
                          alt={article.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop";
                          }}
                        />
                        <div className="absolute top-4 left-4">
                          <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {article.category?.name || "Uncategorized"}
                          </span>
                        </div>
                        <div className="absolute bottom-4 right-4 flex items-center bg-black/60 text-white px-2 py-1 rounded-full text-sm">
                          <span className="text-xs">
                            {article.pages ? `${article.pages} pages` : "PDF"}
                          </span>
                        </div>
                        {article.is_free === "0" && (
                          <div className="absolute top-4 right-4">
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              Premium
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{formatDate(article.created_at)}</span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            article.is_free === "1" 
                              ? "bg-green-100 text-green-800" 
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {article.is_free === "1" ? "Free" : "Premium"}
                          </span>
                        </div>
                      </div>

                      <div className="px-6 pb-6">
                        <Link to={`/articles/${article.id}`} className="group/btn w-full text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center justify-center py-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                          Read More
                          <ArrowRight
                            size={14}
                            className="ml-1 transform transition-transform duration-300 group-hover/btn:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-12 gap-4">
                    <div className="text-sm text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>

                    <nav className="flex items-center space-x-1">
                      {/* Previous Button */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className="flex space-x-1">
                        {generatePageNumbers().map((page, index) =>
                          page === "..." ? (
                            <span
                              key={index}
                              className="px-3 py-2 text-sm font-medium text-gray-400"
                            >
                              ...
                            </span>
                          ) : (
                            <button
                              key={index}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                  ? "bg-purple-600 text-white hover:bg-purple-700"
                                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                              }`}
                            >
                              {page}
                            </button>
                          )
                        )}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticlePage;