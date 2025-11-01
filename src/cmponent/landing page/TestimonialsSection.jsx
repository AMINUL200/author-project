import { useRef, useEffect } from "react";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Skeleton from "../common/Skeleton";

const TestimonialsSection = ({
  sectionTitle = {},
  testimonials = [],
  loading = false,
  error = null,
}) => {
  const paginationRef = useRef(null);

  // ✅ Structured Data (SEO Rich Snippets)
  useEffect(() => {
    if (testimonials.length > 0) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: testimonials.map((t, index) => ({
          "@type": "Review",
          position: index + 1,
          author: { "@type": "Person", name: t.name },
          reviewBody: t.feedback,
          reviewRating: {
            "@type": "Rating",
            ratingValue: t.rating,
            bestRating: "5",
            worstRating: "1",
          },
        })),
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.innerHTML = JSON.stringify(structuredData);
      document.head.appendChild(script);

      return () => {
        document.head.removeChild(script);
      };
    }
  }, [testimonials]);

  const renderSkeletons = () => (
    <>
      {[...Array(3)].map((_, index) => (
        <SwiperSlide key={index}>
          <div className="bg-gray-50 rounded-xl p-6 h-full flex flex-col">
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-4 h-4 mr-1" />
              ))}
            </div>
            <Skeleton className="w-full h-20 mb-6" />
            <div className="flex items-center">
              <Skeleton className="w-12 h-12 rounded-full mr-4" />
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </>
  );

  return (
    <section
      className="py-20 pt-10 bg-white"
      id="feedback"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            id="testimonials-heading"
            className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            {sectionTitle?.sec7_name || "Testimonials"}
          </h2>
          {sectionTitle?.sec7_para && (
            <p className="text-xl text-gray-600">{sectionTitle.sec7_para}</p>
          )}
        </div>

        <div className="relative">
          {error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                el: paginationRef.current,
                clickable: true,
                renderBullet: (index, className) =>
                  `<span class="${className}" style="background-color: #4F46E5; width: 12px; height: 12px; margin: 0 6px;"></span>`,
              }}
              navigation={{
                nextEl: ".testimonial-swiper-button-next",
                prevEl: ".testimonial-swiper-button-prev",
              }}
              breakpoints={{
                640: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
              }}
              onInit={(swiper) => {
                swiper.params.pagination.el = paginationRef.current;
                swiper.pagination.init();
                swiper.pagination.render();
              }}
              className="pb-16"
            >
              {loading
                ? renderSkeletons()
                : testimonials.map((t, index) => (
                    <SwiperSlide key={index}>
                      <article
                        className="bg-gray-50 rounded-xl p-6 h-full flex flex-col"
                        itemScope
                        itemType="https://schema.org/Review"
                      >
                        <div className="flex items-center mb-4">
                          {[...Array(Number(t.rating))].map((_, i) => (
                            <Star
                              key={i}
                              className="text-yellow-400 fill-current"
                              size={16}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p
                          className="text-gray-700 mb-6 italic flex-grow"
                          itemProp="reviewBody"
                          aria-label={`Feedback by ${t.name}`}
                        >
                          "{t.feedback}"
                        </p>
                        <div className="flex items-center">
                          <img
                            src={t.image}
                            alt={t.image_alt || `${t.name} profile picture`}
                            className="w-12 h-12 object-cover rounded-full mr-4"
                            loading="lazy"
                          />
                          <div>
                            <p
                              className="font-semibold text-gray-900"
                              itemProp="author"
                            >
                              {t.name}
                            </p>
                            <p className="text-gray-600 text-sm">
                              {t.designation}
                            </p>
                          </div>
                        </div>
                      </article>
                    </SwiperSlide>
                  ))}
            </Swiper>
          )}

          {/* Pagination */}
          <div
            ref={paginationRef}
            className="absolute bottom-0 left-0 right-0 flex justify-center mt-8 space-x-2"
          ></div>

          {/* Navigation buttons */}
          <div className="testimonial-swiper-button-prev absolute top-1/2 -left-12 -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <div className="testimonial-swiper-button-next absolute top-1/2 -right-12 -translate-y-1/2 z-10 cursor-pointer bg-white rounded-full p-3 shadow-md hover:bg-gray-100 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
