import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Calendar, MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const EventGallery = ({
  sectionTitle = {},
  eventData,
  loading = false,
  error = null,
}) => {
  const events = eventData || [];

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatTimeRange = (startTime, endTime) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  // ✅ Structured Data for SEO
  const eventSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: events.map((event, index) => ({
      "@type": "Event",
      position: index + 1,
      name: event.title,
      startDate: event.date,
      location: {
        "@type": "Place",
        name: event.location,
      },
      image: event.image,
      url: `${window.location.origin}/events/${event.id}`,
      description: event.description || "Event details and information.",
    })),
  };

  // ⏳ Loading state
  if (loading) {
    return (
      <section
        aria-label="Upcoming Events Section"
        className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {sectionTitle?.sec4_name}
          </h2>
          <p className="text-gray-600 text-lg">{sectionTitle?.sec4_para}</p>
          <div className="flex justify-center items-center h-64 mt-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    );
  }

  // ❌ Error state
  if (error) {
    return (
      <section className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white md:min-h-screen">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {sectionTitle?.sec4_name}
          </h2>
          <p className="text-red-600 bg-red-50 p-8 rounded-lg">
            Error loading events: {error}
          </p>
        </div>
      </section>
    );
  }

  // 🈳 Empty state
  if (!events || events.length === 0) {
    return (
      <section className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {sectionTitle?.sec4_name}
          </h2>
          <p className="text-gray-600 text-lg">{sectionTitle?.sec4_para}</p>
          <div className="text-center text-gray-500 bg-gray-50 p-12 rounded-lg mt-8">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No upcoming events available.</p>
            <p className="text-sm mt-2">Check back later for new events!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white md:min-h-screen"
      aria-label="Upcoming Events Section"
    >
      {/* ✅ Structured data for SEO */}
      <script type="application/ld+json">{JSON.stringify(eventSchema)}</script>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
            {sectionTitle?.sec4_name}
          </h2>
          <p className="text-gray-600 text-lg">{sectionTitle?.sec4_para}</p>
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
            reverseDirection: true,
          }}
          loop={events.length > 1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-16"
        >
          {events.map((event, index) => (
            <SwiperSlide key={event.id}>
              <article
                className="event-card bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col"
                itemScope
                itemType="https://schema.org/Event"
              >
                {index === 0 && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                    New Event
                  </div>
                )}
                {/* Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={`Event: ${event.image_alt || event.title }`}
                    className="w-full h-full object-cover"
                    itemProp="image"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x200/cccccc/969696?text=No+Image";
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3
                    className="text-xl font-bold text-gray-900 mb-2"
                    itemProp="name"
                    aria-label={event.title_meta || event.title}
                  >
                    {event.title}
                  </h3>

                  <div className="space-y-2 mb-5 text-sm text-gray-700">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      <time itemProp="startDate" dateTime={event.date}>
                        {formatDate(event.date)}
                      </time>
                    </div>
                    <div className="flex items-center" itemProp="location">
                      <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-blue-600" />
                      <span>{formatTimeRange(event.start_time, event.end_time)}</span>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event.id}`}
                    itemProp="url"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group shadow-md hover:shadow-xl"
                  >
                    {sectionTitle?.sec4_button_name || "Read More"}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default EventGallery;
