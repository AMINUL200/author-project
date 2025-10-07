import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BookOpen, User } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PreviousPublication = ({
  featureBookData,
  loading = false,
  error = null,
}) => {

  
  // Use the actual featureBookData from props
  const publications = featureBookData || [];

  // Format date to show only year
  const formatYear = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Feature Publications
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Explore our collection of published works
            </p>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Feature Publications
              </h1>
            </div>
          </div>
          <div className="text-center text-red-600 bg-red-50 p-8 rounded-lg">
            <p>Error loading publications: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!publications || publications.length === 0) {
    return (
      <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-10 h-10 text-purple-600 mr-3" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Feature Publications
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Explore our collection of published works
            </p>
          </div>
          <div className="text-center text-gray-500 bg-gray-50 p-12 rounded-lg">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No publications available yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Feature Publications
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Explore our collection of published works
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
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
          loop={publications.length > 1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="pb-16"
        >
          {publications.map((book) => (
            <SwiperSlide key={book.id}>
              <div className="book-card bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-transform duration-300 hover:scale-105">
                {/* Book Cover */}
                <div className="h-80 overflow-hidden relative">
                  <div className="book-cover h-full">
                    <img
                      src={book.image}
                      alt={book.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x400/cccccc/969696?text=No+Image";
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {book.title}
                  </h3>

                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{book.author_name}</span>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">
                      Published {formatYear(book.published_date)}
                    </span>
                  </div>

                  {/* Removed View Details Button */}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default PreviousPublication;