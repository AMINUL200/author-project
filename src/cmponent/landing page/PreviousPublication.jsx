import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { BookOpen, User } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const PreviousPublication = () => {
  const publications = [
    {
      id: 1,
      title: "The Art of Modern Design",
      author: "Sarah Mitchell",
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop",
      year: "2024",
      category: "Design",
    },
    {
      id: 2,
      title: "Digital Transformation",
      author: "Michael Chen",
      coverImage:
        "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop",
      year: "2023",
      category: "Technology",
    },
    {
      id: 3,
      title: "Creative Thinking",
      author: "Emma Thompson",
      coverImage:
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
      year: "2024",
      category: "Business",
    },
    {
      id: 4,
      title: "Innovation Leadership",
      author: "David Rodriguez",
      coverImage:
        "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop",
      year: "2023",
      category: "Leadership",
    },
    {
      id: 5,
      title: "Future of AI",
      author: "Dr. Lisa Wang",
      coverImage:
        "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop",
      year: "2024",
      category: "Technology",
    },
    {
      id: 6,
      title: "Sustainable Growth",
      author: "James Anderson",
      coverImage:
        "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop",
      year: "2023",
      category: "Business",
    },
  ];

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Previous Publications
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
          loop
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          className="pb-16"
        >
          {publications.map((book) => (
            <SwiperSlide key={book.id}>
              <div className="book-card bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                {/* Book Cover */}
                <div className="h-80 overflow-hidden relative">
                  <div className="book-cover h-full">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* <div className="absolute top-4 right-4">
                    <span className="category-badge bg-white/90 backdrop-blur-sm text-purple-700 text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                      {book.category}
                    </span>
                  </div> */}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {book.title}
                  </h3>

                  <div className="flex items-center text-gray-600 text-sm mb-3">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    <span>{book.author}</span>
                  </div>

                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500 font-medium">
                      Published {book.year}
                    </span>
                  </div>

                  {/* Button */}
                  <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 shadow-md hover:shadow-xl">
                    View Details
                  </button>
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