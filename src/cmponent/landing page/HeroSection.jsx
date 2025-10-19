import React, { useState, useEffect } from "react";
import { ArrowRight, Star, Award } from "lucide-react";
import HeroSectionSkeleton from "../skeliton section/HeroSectionSkeleton";

const HeroSection = ({ sectionTitle, data, loading = false, error = null }) => {
  if (loading) return <HeroSectionSkeleton />;

  if (error || !data) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-red-500 text-xl">
          {error ? error : "No banner data available"}
        </p>
      </section>
    );
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!data?.images || data.images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % data.images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [data?.images]);

  // Use SEO fields if available
  const headingText = data.h1_seo || data.heading1;
  const descriptionText = data.description_seo || data.description;

  return (
    <header
      className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 md:min-h-screen flex items-center overflow-hidden"
      id="home"
      aria-label={headingText}
    >
      {/* Background Bubbles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
        <div className="grid md:grid-cols-2 gap-12 items-top">
          {/* 📝 Left Column - Text Content */}
          <div className="text-left space-y-8 animate-fade-in-up">
            <h1 className="text-5xl md:text-5xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                {headingText}
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {data.heading2}
              </span>
            </h1>

            <div
              className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl"
              dangerouslySetInnerHTML={{
                __html: descriptionText,
              }}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  const section = document.getElementById("pricing");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
                className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                aria-label="Start reading"
              >
                {data.button_name}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* 🖼️ Right Column - Banner Images */}
          <div className="relative flex justify-center lg:justify-end mt-10 lg:mt-0">
            <figure
              className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden relative mx-auto"
              style={{
                width: "min(90vw, 400px)",
                height: "min(120vw, 550px)",
              }}
            >
              {data.images?.map((image, index) => (
                <img
                  key={index}
                  src={image.image}
                  alt={image.alt || `Banner Image ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-fill p-4 bg-white transition-all duration-1000 ${
                    index === currentImageIndex
                      ? "opacity-100 scale-100"
                      : "opacity-0 scale-105"
                  }`}
                  loading="lazy"
                />
              ))}

              {/* Dots Indicator */}
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                {data.images?.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    aria-label={`Switch to image ${index + 1}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-gray-800 w-8"
                        : "bg-gray-400 hover:bg-gray-600"
                    }`}
                  />
                ))}
              </div>

              {/* Image Info */}
              <figcaption className="mt-6 space-y-3 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {data.image_title}
                      </p>
                      <p className="text-sm text-gray-600">
                        {data.image_subtitle}
                      </p>
                    </div>
                  </div>
                  <Award className="w-6 h-6 text-yellow-500" />
                </div>
                <div className="flex gap-2" aria-label="Book rating stars">
                  {[...Array(4)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </header>
  );
};

export default HeroSection;
