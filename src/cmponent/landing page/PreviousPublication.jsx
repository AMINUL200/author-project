import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BookOpen, User } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PreviousPublication = ({
  sectionTitle = {},
  featureBookData,
  loading = false,
  error = null,
}) => {
  const publications = featureBookData || [];

  const formatYear = (dateString) => {
    return new Date(dateString).getFullYear();
  };

  // Loading state
  if (loading) {
    return (
      <section
        className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white md:min-h-screen"
        aria-busy="true"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {sectionTitle?.sec3_name || "Featured Publications"}
          </h1>
          <p className="text-gray-600 text-lg">{sectionTitle?.sec3_para}</p>
          <div
            className="flex justify-center items-center h-64"
            role="status"
            aria-label="Loading publications"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section
        className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen"
        aria-live="polite"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {sectionTitle?.sec3_name}
          </h1>
          <p className="text-red-600 bg-red-50 p-8 rounded-lg mt-4">
            Error loading publications: {error}
          </p>
        </div>
      </section>
    );
  }

  // Empty state
  if (publications.length === 0) {
    return (
      <section
        className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen"
        aria-live="polite"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {sectionTitle?.sec3_name}
          </h1>
          <p className="text-gray-600 text-lg">{sectionTitle?.sec3_para}</p>
          <div className="text-gray-500 bg-gray-50 p-12 rounded-lg mt-6">
            <BookOpen
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              aria-hidden="true"
            />
            <p className="text-lg">No publications available yet.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white md:min-h-screen"
      id="feature"
      aria-label="Featured Publications Section"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {sectionTitle?.sec3_name}
          </h2>
          <p className="text-gray-600 text-lg mt-2">
            {sectionTitle?.sec3_para}
          </p>
        </header>

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
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
          className="pb-16"
          aria-roledescription="carousel"
        >
          {publications.map((book) => (
            <SwiperSlide key={book.id} role="group" aria-label={book.title}>
              <article
                className="book-card bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-transform duration-300 hover:scale-105"
                itemScope
                itemType="https://schema.org/Book"
              >
                {/* Book Cover */}
                <figure className="h-80 overflow-hidden relative">
                  <img
                    src={book.image}
                    alt={`${book.image_alt} cover`}
                    className="w-full h-full object-fill"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x400/cccccc/969696?text=No+Image";
                    }}
                    itemProp="image"
                  />
                </figure>

                {/* Book Info */}
                {/* <div className="p-5 flex-1 flex flex-col">
                  <h3
                    className="text-lg font-bold text-gray-900 mb-2 line-clamp-2"
                    itemProp="name"
                  >
                    {book.title}
                  </h3>

                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    <span itemProp="author">{book.author_name}</span>
                  </div>

                  <time
                    className="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium"
                    itemProp="datePublished"
                    dateTime={book.published_date}
                  >
                    Published {formatYear(book.published_date)}
                  </time>
                </div> */}
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default PreviousPublication;
