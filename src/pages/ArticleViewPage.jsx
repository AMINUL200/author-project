import React, { useState, useEffect, useRef } from "react";
import {
  Eye,
  Clock,
  User,
  Calendar,
  Lock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
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

  // Dummy article data (you can replace this with actual data from fetchArticle)
  const article = {
    id: 1,
    title: "The Future of Sustainable Technology: Innovations Shaping Tomorrow",
    subtitle:
      "Exploring breakthrough technologies that promise to revolutionize how we interact with our environment",
    author: {
      name: "Dr. Sarah Chen",
      avatar:
        "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      bio: "Senior Research Scientist at MIT, specializing in sustainable technology and renewable energy systems.",
    },
    publishDate: "March 15, 2024",
    readTime: "8 min read",
    views: "12.4K",
    category: "Technology",
    tags: ["Sustainability", "Innovation", "Green Tech", "Future"],
    content: `
      <p>In an era where environmental consciousness meets technological advancement, we stand at the precipice of a revolutionary shift in how we approach sustainable innovation. The convergence of artificial intelligence, renewable energy, and biotechnology is creating unprecedented opportunities to address some of humanity's most pressing challenges.</p>
      
      <h2>The Dawn of Intelligent Sustainability</h2>
      <p>Artificial intelligence is no longer just a tool for automation; it has become the backbone of sustainable decision-making. Smart grid systems powered by machine learning algorithms can predict energy demand with 95% accuracy, optimizing renewable energy distribution in real-time. These systems learn from weather patterns, consumption habits, and grid performance to minimize waste and maximize efficiency.</p>
      
      <p>Consider the case of Copenhagen, where AI-driven traffic management systems have reduced carbon emissions by 30% while improving commute times. The city's intelligent infrastructure communicates with electric vehicles, public transportation, and even pedestrian traffic to create a harmonious, low-emission urban environment.</p>
      
      <h2>Biotechnology Meets Environmental Science</h2>
      <p>Perhaps one of the most fascinating developments is the emergence of bioengineered solutions to environmental problems. Researchers have successfully developed algae that can absorb carbon dioxide at rates 400 times faster than traditional trees. These microscopic organisms are being integrated into urban buildings as living walls that purify air while generating biomass for renewable energy.</p>
      
      <p>The implications extend beyond air purification. Genetically modified bacteria are being used to break down plastic waste in oceans, while specially designed fungi networks can remediate contaminated soil in a fraction of the time required by conventional methods.</p>
      
      <h2>The Circular Economy Revolution</h2>
      <p>Technology is enabling a fundamental shift from linear "take-make-dispose" models to circular systems where waste becomes input for new processes. Blockchain technology ensures transparency in supply chains, making it possible to track materials from origin to end-of-life, facilitating perfect recycling loops.</p>
      
      <p>3D printing with recycled materials has reached industrial scale, with some manufacturers achieving 90% waste reduction. These printers can create everything from building materials to consumer electronics, all while maintaining quality standards that rival traditional manufacturing.</p>
    `,
    isPremium: true,
  };

  const fetchArticle = async (id) => {
    try {
      const response = await axios.get(`${apiUrl}article/${id}`);

      if (response.status === 200) {
        console.log(response.data.data);
        setArticleData(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch article.");
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error(error.message || "Failed to fetch article.");
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
        console.log("PDF URL created:", fileUrl);
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

  // Handle PDF load success
  const onDocumentLoadSuccess = ({ numPages }) => {
    setTotalPages(numPages);
    console.log(`PDF loaded successfully. Total pages: ${numPages}`);
  };

  // Handle PDF load error
  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    toast.error("Failed to load PDF document.");
  };

  // Disable right-click and common keyboard shortcuts
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    const disableKeyShortcuts = (e) => {
      // Disable F12, Ctrl+Shift+I/J, Ctrl+U, Ctrl+S, Ctrl+C
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || // Ctrl+Shift+I/J
        (e.ctrlKey &&
          (e.keyCode === 85 || e.keyCode === 83 || e.keyCode === 67)) // Ctrl+U, Ctrl+S, Ctrl+C
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

  // Jump to specific page
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
  }, [id]);

  // Cleanup PDF URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-2 md:px-6 py-8">
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center flex-wrap space-x-3 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-2 md:mb-0">
              {article.category}
            </span>
            <div className="flex flex-wrap gap-4 space-x-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-slate-900 mb-3 leading-tight">
            {articleData?.title || article.title}
          </h1>

          <p className="text-xl text-slate-600 mb-6 leading-relaxed">
            {articleData?.subtitle || article.subtitle}
          </p>

          {/* Author Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={articleData?.author?.avatar || article.author.avatar}
                alt={articleData?.author?.name || article.author.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-slate-900">
                    {articleData?.author?.name || article.author.name}
                  </h3>
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{articleData?.publishDate || article.publishDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="prose prose-lg max-w-none mb-12">
          <div
            className="text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{
              __html: articleData?.content || article.content,
            }}
          />
        </div>

        {/* PDF Viewer Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
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
                {/* ✅ Add watermark overlay here */}
                <div className="absolute bottom-[50%] right-[30%]  pointer-events-none inline-flex items-center justify-center opacity-20 text-4xl font-bold text-red-600 rotate-45">
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
        {/* Subscription CTA */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Want to Read More?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Get access to the complete article with {article.totalPages - 2}{" "}
            additional pages, downloadable resources, and exclusive insights
            from industry experts.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg">
            Subscribe Now - $9.99/month
          </button>
          <p className="text-blue-200 text-sm mt-3">
            Cancel anytime • 7-day free trial • Access to 1000+ premium articles
          </p>
        </div>
      </div>

      {/* CSS to disable text selection and other interactions */}
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
