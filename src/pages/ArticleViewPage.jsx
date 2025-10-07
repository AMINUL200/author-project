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
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Loader from "../cmponent/common/Loader";
import HTMLFlipBook from "react-pageflip";

import { pdfjs, Document, Page } from "react-pdf";
import { useAuth } from "../context/AuthContext";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ArticleViewPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
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
  const [currentImagePage, setCurrentImagePage] = useState(0);
  const [loadingPlanId, setLoadingPlanId] = useState(null);

  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef();
  const flipBookRef = useRef();

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
      const response = await axios.get(`${apiUrl}article/${id}`);

      if (response.status === 200) {
        setArticleData(response.data.data);
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

  // Flip book event handlers
  const onPageFlip = (e) => {
    setCurrentImagePage(e.data);
  };

  const nextImage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const prevImage = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
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
          message: "Please login to subscribe to our premium plans"
        } 
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
            <span className="flex items-center space-x-1 gap-2">
              <View size={16} />
              {articleData?.view_count || 0} views
            </span>
            <span className="flex items-center space-x-1 gap-2">
              <Calendar size={16} />
              {new Date(articleData?.created_at).toLocaleDateString()}
            </span>
          </div>

          {/* Article Images with 3D Flip Book */}
          {articleData?.images && articleData.images.length > 0 && (
            <div className="mb-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  Image Gallery
                </h3>
                <p className="text-slate-600">
                  Flip through the images like a book
                </p>
              </div>

              <div className="flex flex-col items-center">
                {/* Flip Book Container */}
                <div
                  className="relative mb-6 w-full max-w-4xl"
                  ref={containerRef}
                >
                  <HTMLFlipBook
                    ref={flipBookRef}
                    width={
                      containerWidth
                        ? Math.min(containerWidth * 0.45, 500)
                        : 500
                    }
                    height={
                      containerWidth ? Math.min(containerWidth * 0.6, 700) : 700
                    }
                    size="stretch"
                    minWidth={280}
                    maxWidth={600}
                    minHeight={600}
                    maxHeight={800}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    onFlip={onPageFlip}
                    style={{
                      background: "transparent",
                      width: "100%",
                      height: "100%",
                    }}
                    className="mx-auto shadow-2xl"
                    usePortrait={true}
                    autoSize={true}
                  >
                    {/* Cover Page */}
                    <div className="page-cover">
                      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white flex flex-col items-center justify-center p-8 h-full w-full">
                        <div className="text-center">
                          <h3 className="text-2xl font-bold mb-2">
                            {articleData?.title}
                          </h3>
                          <p className="text-blue-100 mb-4">Image Gallery</p>
                          <div className="w-16 h-1 bg-white/30 mx-auto mb-4"></div>
                          <p className="text-sm text-blue-100">
                            {articleData?.images.length} images
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Image Pages */}
                    {articleData.images.map((image, index) => (
                      <div key={index} className="page-content">
                        <div className="bg-white h-full w-full flex flex-col items-center justify-center p-0 relative overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center">
                            <img
                              src={image}
                              alt={`${articleData.title} - Image ${index + 1}`}
                              className="w-auto h-[95%] object-contain"
                            />
                          </div>
                          <div className="absolute bottom-2 left-0 right-0 text-center">
                            <p className="text-xs text-slate-600 font-medium bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                              Image {index + 1} of {articleData.images.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Back Cover */}
                    <div className="page-cover">
                      <div className="bg-gradient-to-br from-gray-800 to-gray-900 text-white flex flex-col items-center justify-center p-8 h-full w-full">
                        <div className="text-center">
                          <h3 className="text-xl font-bold mb-2">The End</h3>
                          <p className="text-gray-300 text-sm">
                            Thank you for viewing the gallery
                          </p>
                          <div className="w-16 h-1 bg-white/20 mx-auto my-4"></div>
                          <p className="text-xs text-gray-400">
                            Continue reading below
                          </p>
                        </div>
                      </div>
                    </div>
                  </HTMLFlipBook>
                </div>

                {/* Flip Book Controls */}
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={prevImage}
                    disabled={currentImagePage === 0}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                    Previous
                  </button>

                  <span className="text-slate-700 font-medium">
                    Page {currentImagePage + 1} of{" "}
                    {articleData.images.length + 2}
                  </span>

                  <button
                    onClick={nextImage}
                    disabled={
                      currentImagePage === articleData.images.length + 1
                    }
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight size={20} />
                  </button>
                </div>

                {/* Thumbnail Navigation */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {articleData.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (flipBookRef.current) {
                          flipBookRef.current.pageFlip().flip(index + 1);
                        }
                      }}
                      className={`w-16 h-16 rounded border-2 overflow-hidden transition-all ${
                        currentImagePage === index + 1
                          ? "border-blue-600 scale-110 shadow-lg"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

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
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            className="text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: articleData?.description,
            }}
          />
        </div>

        {/* PDF Viewer Section */}
        {articleData?.pdf_path && (
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
                  {/* Watermark overlay */}
                  <div className="absolute bottom-[50%] right-[30%] pointer-events-none inline-flex items-center justify-center opacity-20 text-4xl font-bold text-red-600 rotate-45">
                    Confidential • Document Preview
                  </div>
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

        {/* Subscription CTA Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Unlock Full Access
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Subscribe to access complete research documents, downloadable
              resources, and exclusive insights from industry experts.
            </p>
            
            {/* Show login prompt if not authenticated */}
            {!isAuthenticated() && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
                <p className="text-yellow-700 text-sm">
                  🔐 <strong>Login required:</strong> Please sign in to subscribe to our premium plans
                </p>
              </div>
            )}
          </div>

          {subscriptionInfo && subscriptionInfo.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {subscriptionInfo.map((plan) => (
                <div
                  key={plan.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group transform hover:-translate-y-1"
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
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>
                          Full PDF access with {totalPages || "all"} pages
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Downloadable resources</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Exclusive expert insights</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-500" />
                        <span>Access to 1000+ premium articles</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Tag size={14} />
                        <span>Plan ID: {plan.plan_id}</span>
                      </div>
                      <button
                        onClick={() => handleSubscriptionClick(plan)}
                        disabled={loadingPlanId === plan.id}
                        className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                          loadingPlanId === plan.id
                            ? "opacity-70 cursor-not-allowed"
                            : "hover:shadow-lg transform hover:-translate-y-0.5"
                        } ${
                          !isAuthenticated() ? "opacity-90 hover:opacity-100" : ""
                        }`}
                      >
                        {loadingPlanId === plan.id ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Processing...</span>
                          </div>
                        ) : !isAuthenticated() ? (
                          "Login to Subscribe"
                        ) : plan.price === "0.00" ? (
                          "Start Free Trial"
                        ) : (
                          "Subscribe Now"
                        )}
                      </button>

                      {plan.price === "0.00" && (
                        <p className="text-center text-xs text-gray-500 mt-2">
                          7-day trial • Cancel anytime
                        </p>
                      )}
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

          <div className="text-center mt-6">
            <p className="text-gray-500 text-sm">
              All plans include full access to our research library • Cancel
              anytime • Secure payment
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .no-select {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
          -webkit-tap-highlight-color: transparent;
        }

        .page-cover,
        .page-content {
          width: 100%;
          height: 100%;
          display: block;
        }

        .stf__wrapper {
          width: 100% !important;
          height: 100% !important;
        }

        .stf__block {
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3) !important;
        }

        /* Ensure images use maximum available height */
        .page-content img {
          display: block;
          margin: auto;
          max-height: none !important;
          object-fit: contain;
        }

        /* Remove padding constraints for image containers */
        .page-content > div {
          padding: 0 !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .page-content {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ArticleViewPage;