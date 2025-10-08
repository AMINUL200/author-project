import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from "react-router-dom";

const EventGallery = ({ eventData, loading = false, error = null }) => {
  // console.log("event data: ", eventData);
  
  // Use the actual eventData from props
  const events = eventData || [];

  // Format date from "2025-07-22" to "July 22, 2025"
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Format time from "12:00:00" to "12:00 PM"
  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  // Format time range
  const formatTimeRange = (startTime, endTime) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Upcoming Events
            </h1>
            <p className="text-gray-600 text-lg">
              Discover and join our exclusive events
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              Upcoming Events
            </h1>
          </div>
          <div className="text-center text-red-600 bg-red-50 p-8 rounded-lg">
            <p>Error loading events: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!events || events.length === 0) {
    return (
      <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
               Events
            </h1>
            <p className="text-gray-600 text-lg">
              Discover and join our exclusive events
            </p>
          </div>
          <div className="text-center text-gray-500 bg-gray-50 p-12 rounded-lg">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No upcoming events available.</p>
            <p className="text-sm mt-2">Check back later for new events!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <style>{`
        /* Modern Pagination Styles */
        .swiper-pagination {
          position: relative;
          margin-top: 2rem;
        }
        
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0.3;
          border-radius: 10px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          margin: 0 6px !important;
        }
        
        .swiper-pagination-bullet::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 24px;
          height: 24px;
          border: 2px solid #667eea;
          border-radius: 12px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          opacity: 0;
        }
        
        .swiper-pagination-bullet-active {
          width: 32px;
          opacity: 1;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .swiper-pagination-bullet-active::before {
          transform: translate(-50%, -50%) scale(1);
          opacity: 0.3;
        }
        
        .swiper-pagination-bullet:hover {
          opacity: 0.6;
          transform: scale(1.2);
        }
        
        .swiper-pagination-bullet-active:hover {
          opacity: 1;
        }

        /* Card hover effects */
        .event-card {
          transition: all 0.3s ease;
        }
        
        .event-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .event-card img {
          transition: transform 0.5s ease;
        }
        
        .event-card:hover img {
          transform: scale(1.1);
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            Upcoming Events
          </h1>
          <p className="text-gray-600 text-lg">
            Discover and join our exclusive events
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
          loop={events.length > 1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          className="pb-16"
        >
          {events.map((event) => (
            <SwiperSlide key={event.id}>
              <div className="event-card bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200/cccccc/969696?text=No+Image";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {event.title}
                  </h3>

                  {/* <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
                    {event.description}
                  </p> */}

                  {/* Event Details */}
                  <div className="space-y-2 mb-5">
                    <div className="flex items-center text-gray-700 text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center text-gray-700 text-sm">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{formatTimeRange(event.start_time, event.end_time)}</span>
                    </div>
                  </div>

                  {/* Button */}
                  <Link
                    to={`/events/${event.id}`}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group shadow-md hover:shadow-xl"
                  >
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default EventGallery;