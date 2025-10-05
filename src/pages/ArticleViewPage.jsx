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
} from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from "../cmponent/common/Loader";

import { pdfjs, Document, Page } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const ArticleViewPage = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const storageUrl = import.meta.env.VITE_STORAGE_URL;
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showPDF, setShowPDF] = useState(false);
  const { id } = useParams();
  const [articleData, setArticleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [totalPages, setTotalPages] = useState(0);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  const [containerWidth, setContainerWidth] = useState(null);
  const containerRef = useRef();

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

  const fetchArticle = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}article/${id}`);

      if (response.status === 200) {
        setArticleData(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch article.");
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error(error.message || "Failed to fetch article.");
    }
  };

  const fetchSubscriptionInfo = async () => {
    try {
      const response = await axios.get(`${apiUrl}all-subscription`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        // console.log("Subscription info:", response.data.data);
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

  const fetchPDF = async (id) => {
    try {
      setPdfLoading(true);
      const response = await axios.get(`${apiUrl}articles/${id}/pdf`, {
        responseType: "blob",
        withCredentials: true,
      });

      if (response.status === 200) {
        const file = new Blob([response.data], { type: "application/pdf" });
        const fileUrl = URL.createObjectURL(file);
        setPdfUrl(fileUrl);
      } else {
        toast.error(response.data.message || "Failed to fetch PDF.");
      }
    } catch (error) {
      console.error("Error fetching PDF:", error);
      toast.error(error.message || "Failed to fetch PDF.");
    } finally {
      setPdfLoading(false);
      setLoading(false);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    toast.error("Failed to load PDF document.");
  };

  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    const disableKeyShortcuts = (e) => {
      if (
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) ||
        (e.ctrlKey &&
          (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 67))
      ) {
        e.preventDefault();
        return false;
      }
    };

    const disableSelection = (e) => {
      if (showPDF) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("keydown", disableKeyShortcuts);
    document.addEventListener("selectstart", disableSelection);
    document.addEventListener("dragstart", disableSelection);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", disableKeyShortcuts);
      document.removeEventListener("selectstart", disableSelection);
      document.removeEventListener("dragstart", disableSelection);
    };
  }, [showPDF]);

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
      fetchPDF(id);
    }
    fetchSubscriptionInfo();
  }, [id]);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

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

  // handle subscription logic here
  const handleSubscribe = async (plan, articleId, userId) => {
    try {
      const payload = {
        amount: plan.price,
        currency: "USD", // or INR if needed
        user_id: userId,
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
          },
        }
      );

      if (response.data.success) {
        // console.log("PayPal order response:", response.data);
        
        // Redirect to PayPal checkout
        window.location.href = response.data.approval_url;
      } else {
        toast.error("Failed to create PayPal order");
      }
    } catch (error) {
      console.error("PayPal order error:", error);
      toast.error("Something went wrong with PayPal checkout");
    }
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
              <View />
              {articleData?.view_count}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-sm text-slate-500 mb-6 flex-wrap">
            <img src={articleData?.image} alt="" />
          </div>
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
                      ? `All ${totalPages} pages available`
                      : "Loading..."}
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
                    className="w-12 px-1 py-1 text-center text-white text-sm rounded border"
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
                <p className="text-slate-500">Loading PDF...</p>
              </div>
            ) : pdfUrl ? (
              <div
                ref={containerRef}
                className="relative w-full max-w-full overflow-auto"
              >
                <Document
                  file={pdfUrl}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-slate-500">Loading PDF...</p>
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
                        <p className="text-slate-500">Loading page...</p>
                      </div>
                    }
                  />
                </Document>
                {/* Watermark overlay */}
                <div className="absolute bottom-[50%] right-[30%] pointer-events-none inline-flex items-center justify-center opacity-20 text-4xl font-bold text-red-600 rotate-45">
                  Confidential • User: {articleData?.author?.name || "Guest"}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-slate-500 mb-2">PDF preview not available</p>
                <button
                  onClick={() => fetchPDF(id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Retry Loading PDF
                </button>
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

        {/* New Subscription CTA Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Unlock Full Access
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Subscribe to access complete research documents, downloadable
              resources, and exclusive insights from industry experts.
            </p>
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
                        onClick={() =>
                          handleSubscribe(plan, articleData?.id, 2)
                        }
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                      >
                        {plan.price === "0.00"
                          ? "Start Free Trial"
                          : "Subscribe Now"}
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
      `}</style>
    </div>
  );
};

export default ArticleViewPage;
