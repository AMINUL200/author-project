import React, { useRef, useState, useCallback, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

const PublishedBook = ({
  sectionTitle = {},
  publishedBookData = [],
  loading = false,
  error = null,
}) => {
  const swiperRef = useRef(null);
  const [isHovered, setIsHovered] = useState({});
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleMouseEnter = useCallback((bookId) => {
    setIsHovered((prev) => ({ ...prev, [bookId]: true }));
    swiperRef.current?.swiper?.autoplay.stop();
  }, []);

  const handleMouseLeave = useCallback((bookId) => {
    setIsHovered((prev) => ({ ...prev, [bookId]: false }));
    swiperRef.current?.swiper?.autoplay.start();
  }, []);

  const nextImage = useCallback((bookId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [bookId]: ((prev[bookId] || 0) + 1) % totalImages,
    }));
  }, []);

  const prevImage = useCallback((bookId, totalImages) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [bookId]: ((prev[bookId] || 0) - 1 + totalImages) % totalImages,
    }));
  }, []);

  const handleRedirect = (id) => {
    if (!token) {
      toast.info("Please Login to Access Book");
      navigate("/login");
    } else {
      navigate(`/articles/${id}`);
    }
  };

  // Generate JSON-LD structured data for books
  useEffect(() => {
    if (publishedBookData.length > 0) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": sectionTitle?.sec2_title || "Published Books",
        "description": sectionTitle?.sec2_para,
        "itemListElement": publishedBookData.map((book, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Book",
            "@id": `${window.location.origin}/articles/${book.id}`,
            "name": book.title,
            "description": book.description_seo || book.description?.replace(/<[^>]*>/g, '').substring(0, 200),
            "image": book.images?.[0]?.image || book.images?.[0],
            "datePublished": book.created_at,
            "inLanguage": "en",
            "isAccessibleForFree": book.is_free === "1",
            "numberOfPages": book.images?.length || 0,
            "genre": book.category || "General",
            "offers": book.is_free === "1" ? {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            } : undefined
          }
        }))
      };

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(structuredData);
      script.id = 'published-books-structured-data';
      
      const existingScript = document.getElementById('published-books-structured-data');
      if (existingScript) {
        existingScript.remove();
      }
      
      document.head.appendChild(script);

      return () => {
        const scriptToRemove = document.getElementById('published-books-structured-data');
        if (scriptToRemove) {
          scriptToRemove.remove();
        }
      };
    }
  }, [publishedBookData, sectionTitle]);

  const renderBookContent = useCallback(
    (book) => {
      const currentIndex = currentImageIndex[book.id] || 0;
      const totalImages = book.images.length;
      const currentImage = book.images[currentIndex];

      return (
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Main Image */}
          <div className="relative flex justify-center w-full h-full overflow-hidden rounded-2xl shadow-2xl">
            <img
              src={currentImage?.image || currentImage}
              alt={`${book.title} - Page ${currentIndex + 1} of ${totalImages}`}
              className="w-full h-full object-fill transition-opacity duration-300"
              loading={currentIndex === 0 ? "eager" : "lazy"}
              itemProp="image"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none rounded-2xl" />
          </div>

          {/* Navigation Buttons */}
          <AnimatePresence>
            {isHovered[book.id] && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 pointer-events-none z-10"
              >
                <motion.button
                  onClick={() => prevImage(book.id, totalImages)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 rounded-full p-3 shadow-2xl border border-gray-200 pointer-events-auto"
                  whileHover={{ scale: 1.1, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <motion.button
                  onClick={() => nextImage(book.id, totalImages)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 rounded-full p-3 shadow-2xl border border-gray-200 pointer-events-auto"
                  whileHover={{ scale: 1.1, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Page Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm z-20 flex items-center gap-2">
            <span className="font-medium">{currentIndex + 1}</span>
            <span className="text-white/60">/</span>
            <span className="text-white/80">{totalImages}</span>
          </div>

          {/* Dots Indicator */}
          <nav className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 z-20" aria-label="Page navigation">
            {book.images.map((_, index) => (
              <button
                key={index}
                onClick={() =>
                  setCurrentImageIndex((prev) => ({
                    ...prev,
                    [book.id]: index,
                  }))
                }
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "w-8 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to page ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </nav>
        </div>
      );
    },
    [currentImageIndex, isHovered, nextImage, prevImage]
  );

  if (loading) {
    return (
      <div className="py-12 px-4 md:min-h-screen flex items-center justify-center relative" role="status" aria-live="polite">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" aria-label="Loading books"></div>
        <span className="sr-only">Loading published books...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 px-4 min-h-screen flex items-center justify-center relative" role="alert">
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        <div className="text-center text-red-600">
          <p>Error loading books: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <section
      className="relative py-12 px-4 md:min-h-screen overflow-hidden"
      id="published"
      itemScope
      itemType="https://schema.org/ItemList"
      aria-labelledby="published-books-heading"
    >
      {/* 🌈 Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-20 right-10 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute -bottom-20 right-20 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-300 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <h2 
                id="published-books-heading"
                className="font-roboto text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                itemProp="name"
              >
                {sectionTitle?.sec2_title || "Published Books"}
              </h2>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto" itemProp="description">
              {sectionTitle?.sec2_para || "Explore our collection of published books"}
            </p>
          </div>
        </motion.header>

        {publishedBookData.length > 0 ? (
          <Swiper
            ref={swiperRef}
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              el: '.custom-pagination',
              bulletClass: 'custom-bullet',
              bulletActiveClass: 'custom-bullet-active'
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            className="pb-20"
            role="region"
            aria-label="Published books carousel"
          >
            {publishedBookData.map((book, index) => (
              <SwiperSlide key={book.id}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[600px] flex flex-col lg:flex-row"
                  onMouseEnter={() => handleMouseEnter(book.id)}
                  onMouseLeave={() => handleMouseLeave(book.id)}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  itemScope
                  itemType="https://schema.org/Book"
                  itemProp="itemListElement"
                >
                  <meta itemProp="position" content={index + 1} />
                  
                  {/* Left Section - Content */}
                  <div className="lg:w-[50%] p-8 lg:p-12 flex flex-col justify-between">
                    <div>
                      {/* Book Status Badge */}
                      <div className="mb-6">
                        <span 
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
                            book.is_free === "1" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-purple-100 text-purple-700"
                          }`}
                          itemProp="isAccessibleForFree"
                          content={book.is_free === "1" ? "true" : "false"}
                        >
                          {book.is_free === "1" ? "Free" : "Premium"}
                        </span>
                        <time 
                          className="ml-3 text-sm text-gray-500 font-medium"
                          dateTime={book.created_at}
                          itemProp="datePublished"
                        >
                          Published {new Date(book.created_at).toLocaleDateString()}
                        </time>
                      </div>

                      {/* Title */}
                      <h3 
                        className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 leading-tight"
                        itemProp="name"
                      >
                        {book.title}
                      </h3>

                      {/* Description */}
                      <div 
                        className="text-gray-600 text-lg leading-relaxed mb-8 line-clamp-2 md:line-clamp-8"
                        itemProp="description"
                        dangerouslySetInnerHTML={{__html: book.description}}
                      />
                      
                      {/* Hidden SEO content */}
                      {book.description_seo && (
                        <meta itemProp="description" content={book.description_seo} />
                      )}
                      <meta itemProp="inLanguage" content="en" />
                      {book.category && <meta itemProp="genre" content={book.category} />}
                      <meta itemProp="numberOfPages" content={book.images?.length || 0} />
                    </div>

                    {/* Action Button */}
                    <div className="space-y-4">
                      <motion.button
                        className="w-[50%] bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                        }}
                        onClick={() => handleRedirect(book.id)}
                        whileTap={{ scale: 0.98 }}
                        aria-label={`Read ${book.title}`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <BookOpen className="w-5 h-5" aria-hidden="true" />
                          {sectionTitle?.sec2_button_name || "Read Book"}
                        </span>
                      </motion.button>
                      
                      {/* Additional Info */}
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{book.images?.length || 0} Pages</span>
                        <span>{book.category || "General"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Section - Image Carousel */}
                  <div className="lg:w-[50%] h-full relative bg-white p-6">
                    <div className="h-full w-full rounded-2xl overflow-hidden">
                      {renderBookContent(book)}
                    </div>
                  </div>
                </motion.article>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <div className="text-center py-12" role="status">
            <p className="text-gray-500 text-lg">No books published yet.</p>
          </div>
        )}

        {/* Custom Pagination */}
        <nav className="custom-pagination flex justify-center gap-2 mt-8" aria-label="Carousel pagination"></nav>
      </div>

      {/* Custom CSS for pagination */}
      <style jsx>{`
        .custom-bullet {
          width: 12px;
          height: 12px;
          background: #cbd5e1;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 4px;
        }
        .custom-bullet-active {
          background: linear-gradient(135deg, #2563eb, #7c3aed);
          width: 32px;
          border-radius: 8px;
        }
      `}</style>
    </section>
  );
};

export default PublishedBook;