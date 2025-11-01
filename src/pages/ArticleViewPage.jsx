import React, { useState, useEffect, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  View,
  Tag,
  Calendar,
  Check,
  ExternalLink,
  Lock,
  Download,
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../cmponent/common/Loader";

import { pdfjs, Document, Page } from "react-pdf";
import { useAuth } from "../context/AuthContext";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ArticleViewPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { userData, token } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPDF, setShowPDF] = useState(false);
  const { id } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadingPlanId, setLoadingPlanId] = useState(null);
  const [hasPDFAccess, setHasPDFAccess] = useState(false);
  const [sectionInfo, setSectionInfo] = useState({});

  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef();
  const imageContainerRef = useRef();

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Check authentication status
  const isAuthenticated = () => {
    return !!(token && userData && userData.id);
  };

  const fetchArticle = async (id) => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}article/${id}`, {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });

      if (response.status === 200) {
        const article = response.data.data;
        console.log(article);
        
        setArticleData(article);

        // Check if user has PDF access (pdf_path exists and is not null/empty)
        setHasPDFAccess(!!article.pdf_path);
      } else {
        toast.error(response.data.message || "Failed to fetch article.");
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error(error.message || "Failed to fetch article.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSectionInfo = async () => {
    try {
      const response = await axios.get(`${apiUrl}sections-details`, {
        headers: {
          Authorization: `Bearer ${token} `,
        },
      });
      if(response.data.status){
        console.log("Article Title:: ",response.data.data);
        setSectionInfo(response.data.data)
        
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await axios.get(`${apiUrl}all-subscription`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setSubscriptionInfo(response.data.data);
      } else {
        toast.error(
          response.data.message || "Failed to fetch subscription info."
        );
      }
    } catch (error) {
      console.error("Error fetching subscription info:", error);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
    setPdfLoading(false);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    toast.error("Failed to load PDF document.");
    setPdfLoading(false);
  };

  const onDocumentLoadStart = () => {
    setPdfLoading(true);
  };

  // Simple carousel navigation
  const nextImage = () => {
    if (articleData?.images) {
      setCurrentImageIndex((prev) =>
        prev === articleData.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (articleData?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? articleData.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageJump = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticle(id);
    }
    fetchSectionInfo();
    fetchSubscriptionInfo();
  }, [id]);

  // Helper function to get billing badge color
  const getBillingBadgeColor = (interval) => {
    switch (interval) {
      case "day":
        return "bg-green-100 text-green-800 border-green-200";
      case "week":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "month":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "year":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Format billing interval for display
  const formatBillingInterval = (cycle, interval) => {
    return `${cycle} ${interval}${cycle > 1 ? "s" : ""}`;
  };

  // Handle subscription logic here
  const handleSubscribe = async (plan, articleId) => {
    // Validate authentication before proceeding
    if (!isAuthenticated()) {
      toast.error("Please login to subscribe to premium plans");
      navigate("/login", {
        state: {
          from: window.location.pathname,
          message: "Please login to subscribe to our premium plans",
        },
      });
      return;
    }

    // Additional validation to ensure userData exists
    if (!userData || !userData.id) {
      toast.error("User information not available. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoadingPlanId(plan.id);
      const payload = {
        amount: plan.price,
        currency: "USD",
        user_id: userData.id,
        item_name: articleData?.title,
        article_id: articleId,
        subscription_plan_id: plan.id,
      };

      console.log("Subscription payload:", payload);

      const response = await axios.post(
        `${apiUrl}paypal/create-order`,
        payload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (response.data.success) {
        // Redirect to PayPal checkout
        window.location.href = response.data.approval_url;
      } else {
        toast.error("Failed to create PayPal order");
      }
    } catch (error) {
      console.error("PayPal order error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error("Something went wrong with PayPal checkout");
      }
    } finally {
      setLoadingPlanId(null);
    }
  };

  // Handle subscription button click with validation
  const handleSubscriptionClick = (plan) => {
    handleSubscribe(plan, articleData?.id);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-2 md:px-6 py-8">
        {/* Article Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">
            {articleData?.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6 flex-wrap">
            {/* <span className="flex items-center space-x-1 gap-2">
              <View size={16} />
              {articleData?.view_count || 0} views
            </span> */}
            <span className="flex items-center space-x-1 gap-2">
              <Calendar size={16} />
              {new Date(articleData?.created_at).toLocaleDateString()}
            </span>
            {/* {hasPDFAccess && (
              <span className="flex items-center space-x-1 gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <Download size={14} />
                PDF Available
              </span>
            )} */}
          </div>

          {/* Article Images with Simple Carousel */}
          {articleData?.images && articleData.images.length > 0 && (
            <div className="mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {/* Image Gallery */}
                  {sectionInfo?.name}
                </h3>
                <p className="text-slate-600">
                  {/* Browse through the images using the navigation controls */}
                  {sectionInfo?.paragraph}
                </p>
              </div>

              <div className="flex flex-col items-center">
                {/* Carousel Container */}
                <div
                  className="relative mb-6 w-full max-w-4xl"
                  ref={containerRef}
                >
                  <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
                    {/* Main Image Display */}
                    <div
                      ref={imageContainerRef}
                      className="relative w-full h-96 md:h-[500px] flex items-center justify-center bg-slate-50"
                    >
                      <img
                        src={articleData.images[currentImageIndex].image}
                        alt={`${articleData.title} - Image ${
                          currentImageIndex + 1
                        }`}
                        className="max-w-full max-h-full object-contain p-4"
                      />

                      {/* Navigation Arrows */}
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 rounded-full p-3 shadow-lg border border-slate-200 transition-all duration-200 hover:scale-110 z-10"
                      >
                        <ChevronLeft size={24} />
                      </button>

                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-slate-700 rounded-full p-3 shadow-lg border border-slate-200 transition-all duration-200 hover:scale-110 z-10"
                      >
                        <ChevronRight size={24} />
                      </button>

                      {/* Image Counter */}
                      <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full backdrop-blur-sm">
                        {currentImageIndex + 1} / {articleData.images.length}
                      </div>

                      {/* Image Title */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-sm px-4 py-2 rounded-full backdrop-blur-sm">
                        Image {currentImageIndex + 1} of{" "}
                        {articleData.images.length}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carousel Controls */}
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={prevImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  <span className="text-slate-700 font-medium">
                    Image {currentImageIndex + 1} of {articleData.images.length}
                  </span>

                  <button
                    onClick={nextImage}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex flex-wrap justify-center gap-3 mt-4 max-w-4xl">
                  {articleData.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => goToImage(index)}
                      className={`w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                        currentImageIndex === index
                          ? "border-blue-600 scale-105 shadow-lg ring-2 ring-blue-400"
                          : "border-gray-300 hover:border-blue-400 hover:scale-105"
                      }`}
                    >
                      <img
                        src={image.image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>

                {/* Keyboard Shortcuts Info */}
                <div className="mt-4 text-center text-slate-500 text-sm">
                  <p>Use ← → arrow keys or click on thumbnails to navigate</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            className="text-slate-700 leading-relaxed default-style"
            dangerouslySetInnerHTML={{
              __html: articleData?.description,
            }}
          />
        </div>
        {/* Article Links */}
        {articleData?.links && articleData.links.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">
              Related Links
            </h3>
            <div className="flex flex-wrap gap-3">
              {articleData.links.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink size={16} />
                  <span>{link.platform}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* PDF Viewer Section - Only show if user has PDF access */}
        {hasPDFAccess && articleData?.pdf_path && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 p-4">
              <div className="flex flex-col md:flex-row gap-5 md:gap-0 items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">PDF</span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      Research Document
                    </h3>
                    <p className="text-slate-300 text-sm">
                      {totalPages > 0
                        ? `${totalPages} page${
                            totalPages > 1 ? "s" : ""
                          } available`
                        : "Loading document..."}
                    </p>
                  </div>
                </div>

                {/* PDF Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    disabled={zoomLevel <= 0.5}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-white text-sm px-2">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    disabled={zoomLevel >= 3}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="w-px h-6 bg-slate-600 mx-2"></div>
                  <button
                    onClick={handlePrevPage}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) =>
                        handlePageJump(parseInt(e.target.value) || 1)
                      }
                      className="w-12 px-1 py-1 text-center text-white text-sm rounded border border-slate-500 bg-slate-700"
                    />
                    <span className="text-white text-sm">/ {totalPages}</span>
                  </div>
                  <button
                    onClick={handleNextPage}
                    className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                    disabled={currentPage >= totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* PDF Display Area */}
            <div className="p-2 md:p-6 bg-slate-50 min-h-[600px] flex items-center justify-center">
              {pdfLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-500">Loading PDF document...</p>
                </div>
              ) : (
                <div
                  ref={containerRef}
                  className="relative w-full max-w-full overflow-auto"
                >
                  <Document
                    file={articleData.pdf_path}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    onLoadStart={onDocumentLoadStart}
                    loading={
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                        <p className="text-slate-500">
                          Loading PDF document...
                        </p>
                      </div>
                    }
                    className="flex justify-center"
                  >
                    <Page
                      pageNumber={currentPage}
                      scale={zoomLevel}
                      width={
                        containerWidth ? containerWidth * zoomLevel : undefined
                      }
                      renderAnnotationLayer={false}
                      renderTextLayer={false}
                      className="shadow-lg"
                      loading={
                        <div className="w-full h-96 bg-slate-200 animate-pulse flex items-center justify-center">
                          <p className="text-slate-500">
                            Loading page {currentPage}...
                          </p>
                        </div>
                      }
                    />
                  </Document>
                </div>
              )}
            </div>

            {/* Page Navigation */}
            {totalPages > 1 && (
              <div className="bg-slate-100 px-6 py-4 border-t">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
                  <div className="text-sm text-slate-600">
                    Showing page {currentPage} of {totalPages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-slate-50 disabled:opacity-50"
                    >
                      First
                    </button>
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage <= 1}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-slate-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-slate-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm bg-white border rounded hover:bg-slate-50 disabled:opacity-50"
                    >
                      Last
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subscription CTA Section - Only show if user doesn't have PDF access */}
        {!hasPDFAccess && (
          <div className="mb-8">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <Lock className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {/* Unlock Full Book Document */}
                {sectionInfo?.heading}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto" dangerouslySetInnerHTML={{__html:sectionInfo?.description}}>
                {/* Subscribe to access the complete research PDF, resources, and
                exclusive insights from industry experts. */}
                {/* {sectionInfo?.description} */}
              </p>

              {/* Show login prompt if not authenticated */}
              {!isAuthenticated() && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                  <p className="text-yellow-700 text-sm">
                    🔐 <strong>Login required:</strong> Please sign in to
                    subscribe to our premium plans
                  </p>
                </div>
              )}
            </div>

            {subscriptionInfo && subscriptionInfo.length > 0 ? (
              <div className="flex flex-col md:flex-row justify-center items-center md:items-start gap-20">
                {subscriptionInfo.map((plan) => (
                  <div
                    key={plan.id}
                    className="bg-white w-[400px] rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {plan.name}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {plan.description}
                        </p>
                      </div>
                      {plan.price === "0.00" && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                          Free Trial
                        </span>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold text-gray-900">
                          ₹{parseFloat(plan.price).toLocaleString()}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getBillingBadgeColor(
                            plan.billing_interval
                          )}`}
                        >
                          {formatBillingInterval(
                            parseInt(plan.billing_cycle),
                            plan.billing_interval
                          )}
                        </span>
                      </div>

                      <div className="space-y-3">
                        {plan?.plan_packages.map((pkg, index) => (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500" />
                            <span>{pkg}</span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <button
                          onClick={() => handleSubscriptionClick(plan)}
                          disabled={loadingPlanId === plan.id}
                          className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                            loadingPlanId === plan.id
                              ? "opacity-70 cursor-not-allowed"
                              : "hover:shadow-lg transform hover:-translate-y-0.5"
                          } ${
                            !isAuthenticated()
                              ? "opacity-90 hover:opacity-100"
                              : ""
                          }`}
                        >
                          {loadingPlanId === plan.id ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Processing...</span>
                            </div>
                          ) : !isAuthenticated() ? (
                            "Login to Subscribe"
                          ) : (
                            `${plan?.button}`
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No subscription plans available
                </h3>
                <p className="text-gray-500">
                  Please check back later for subscription options.
                </p>
              </div>
            )}

            {/* <div className="text-center mt-6">
              <p className="text-gray-500 text-sm">
                All plans include full access to our research library • Cancel
                anytime • Secure payment
              </p>
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleViewPage;
