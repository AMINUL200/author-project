import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BookOpen, User, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import HTMLFlipBook from "react-pageflip";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useNavigate } from "react-router-dom";

// Page Cover Component
const PageCover = React.forwardRef((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content">
        <div className="cover-content">{props.children}</div>
      </div>
    </div>
  );
});

// Page Component
const Page = React.forwardRef((props, ref) => {
  const { image, title, description, pageNumber, totalPages } = props;

  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <div className="page-inner">
          {image && (
            <div className="page-image-container">
              <img
                src={image}
                alt={`Page ${pageNumber}`}
                className="page-image"
              />
            </div>
          )}
          <div className="page-text-content">
            <h3 className="page-title">{title}</h3>
            {description && <p className="page-description">{description}</p>}
          </div>
          <div className="page-footer">
            {pageNumber} / {totalPages}
          </div>
        </div>
      </div>
    </div>
  );
});

const PublishedBook = ({
  publishedBookData = [],
  loading = false,
  error = null,
}) => {
  const swiperRef = useRef(null);
  const flipBookRefs = useRef({});
  const [isHovered, setIsHovered] = useState({});
  const [bookStates, setBookStates] = useState({});
  const navigate = useNavigate()

  // console.log('publishedbookdata: ', publishedBookData);
  

  const handleMouseEnter = (bookId) => {
    setIsHovered((prev) => ({ ...prev, [bookId]: true }));
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.autoplay.stop();
    }
  };

  const handleMouseLeave = (bookId) => {
    setIsHovered((prev) => ({ ...prev, [bookId]: false }));
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper.autoplay.start();
    }
  };

  const handleFlip = (bookId, e) => {
    setBookStates((prev) => ({
      ...prev,
      [bookId]: {
        ...prev[bookId],
        currentPage: e.data,
      },
    }));
  };

  const nextButtonClick = (bookId) => {
    const flipBook = flipBookRefs.current[bookId];
    if (flipBook && flipBook.pageFlip()) {
      flipBook.pageFlip().flipNext();
    }
  };

  const prevButtonClick = (bookId) => {
    const flipBook = flipBookRefs.current[bookId];
    if (flipBook && flipBook.pageFlip()) {
      flipBook.pageFlip().flipPrev();
    }
  };

  const renderBookContent = (book) => {
    const totalPages = book.images.length + 1;
    const currentPage = bookStates[book.id]?.currentPage || 0;

    return (
      <div className="relative w-full h-full flex items-center justify-center">
        <HTMLFlipBook
          width={280}
          height={360}
          size="stretch"
          minWidth={200}
          maxWidth={320}
          minHeight={280}
          maxHeight={420}
          maxShadowOpacity={0.3}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={(e) => handleFlip(book.id, e)}
          className="book-flip"
          style={{
            background: "transparent",
            width: "100%",
            height: "100%",
          }}
          drawShadow={true}
          flippingTime={900}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={false}
          disableFlipByClick={false}
          ref={(el) => (flipBookRefs.current[book.id] = el)}
        >
          {/* Front Cover */}
          <PageCover>
            <div className="front-cover w-full h-full">
              <div className="cover-image-container w-full h-full">
                <img
                  src={book.images[0]}
                  alt={book.title}
                  className="cover-image w-full h-full object-cover"
                />
                <div className="cover-overlay" />
              </div>
              <div className="cover-title">
                <h3 className="text-base font-bold">{book.title}</h3>
              </div>
            </div>
          </PageCover>

          {/* Content Pages */}
          {book.images.slice(1).map((image, index) => (
            <Page
              key={index}
              image={image}
              title={book.title}
              description={book.description}
              pageNumber={index + 2}
              totalPages={totalPages}
            />
          ))}

          {/* Back Cover */}
          <PageCover>
            <div className="back-cover w-full h-full">
              <div className="back-cover-content w-full h-full">
                <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-800 mb-2">
                  {book.title}
                </h4>
                <div className="bg-white/90 rounded-lg p-3 mx-2">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>
            </div>
          </PageCover>
        </HTMLFlipBook>

        {/* Navigation Controls */}
        <AnimatePresence>
          {isHovered[book.id] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-10"
            >
              <motion.button
                onClick={() => prevButtonClick(book.id)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 rounded-full p-3 shadow-2xl border border-gray-200 pointer-events-auto"
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronLeft className="w-4 h-4" />
              </motion.button>

              <motion.button
                onClick={() => nextButtonClick(book.id)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-white/95 hover:bg-white text-gray-800 rounded-full p-3 shadow-2xl border border-gray-200 pointer-events-auto"
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm z-20">
          {currentPage + 1} / {totalPages}
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Published Books
            </h1>
          </div>
        </motion.div>

        {/* Swiper Slider */}
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          pagination={{
            clickable: true,
            dynamicBullets: false,
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }}
          className="pb-16"
        >
          {publishedBookData.map((book) => (
            <SwiperSlide key={book.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col"
                onMouseEnter={() => handleMouseEnter(book.id)}
                onMouseLeave={() => handleMouseLeave(book.id)}
                whileHover={{ y: -8 }}
              >
                {/* Book Container - Full width and height */}
                <div className="h-110 w-full relative flex items-center justify-center p-4 bg-gradient-to-br from-gray-50 to-gray-200">
                  {renderBookContent(book)}
                </div>

                {/* Book Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {book.title}
                  </h3>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">
                      Published {new Date(book.created_at).getFullYear()}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {book.is_free === "1" ? "Free" : "Premium"}
                    </span>
                  </div>

                  <motion.button
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg"
                    whileHover={{
                      scale: 1.02,
                      boxShadow:
                        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={()=> navigate(`/articles/${book.id}`) }
                  >
                    View Book Details
                  </motion.button>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .book-flip {
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
          border-radius: 8px;
          width: 100% !important;
          height: 100% !important;
        }

        .page {
          border: 1px solid #e5e7eb;
          width: 100%;
          height: 100%;
        }

        .page-cover {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .page-content {
          padding: 0;
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .cover-content {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .front-cover,
        .back-cover {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
        }

        .cover-image-container {
          flex: 1;
          position: relative;
          overflow: hidden;
          width: 100%;
          height: 100%;
        }

        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .cover-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.1),
            rgba(0, 0, 0, 0.2)
          );
        }

        .cover-title {
          padding: 20px;
          background: white;
          text-align: center;
          width: 100%;
        }

        .cover-title h3 {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .cover-title p {
          color: #6b7280;
          font-size: 0.875rem;
        }

        .page-inner {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          padding: 0;
        }

        .page-image-container {
          flex: 1;
          width: 100%;
          height: 100%;
          margin: 0;
        }

        .page-image {
          width: 200%;
          height: 100%;
          object-fit: cover;
        }

        .page-text-content {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
          color: white;
          padding: 20px;
          padding-top: 40px;
        }

        .page-title {
          font-size: 1rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
          color: white;
        }

        .page-author {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }

        .page-description {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .page-footer {
          position: absolute;
          bottom: 10px;
          left: 0;
          right: 0;
          text-align: center;
          color: #9ca3af;
          font-size: 0.75rem;
        }

        .back-cover-content {
          height: 100%;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>
    </div>
  );
};

export default PublishedBook;