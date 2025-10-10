import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp,
  Check,
  Sparkles,
  Star,
  Award,
} from "lucide-react";
import Skeleton from "../common/Skeleton";
import HeroSectionSkeleton from "../skeliton section/HeroSectionSkeleton";

const HeroSection = ({ sectionTitle, data, loading = false, error = null }) => {
  if (loading) {
    return <HeroSectionSkeleton />;
  }

  // --- Error & normal UI remain same ---
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

  // Auto-rotate images
  React.useEffect(() => {
    if (!data?.images || data.images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % data?.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <section
        className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 md:min-h-screen flex items-center overflow-hidden"
        id="home"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-700"></div>
          <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-top">
            {/* Left Column - Content */}
            <div className="text-left space-y-8 animate-fade-in-up">
              {/* Main Heading */}
              <h1 className="text-5xl md:text-5xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                  {data?.heading1}
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {data?.heading2}
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                {data?.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    const section = document.getElementById("pricing");
                    if (section) {
                      section.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center justify-center gap-2"
                >
                  {data?.button_name}
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative lg:block hidden">
              <div className="relative">
                
                  <div
                    className="bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden relative mx-auto"
                    style={{ width: "400px", height: "550px" }} // A5 page ratio
                  >
                    {/* Image Stack with Transitions */}
                    {data?.images?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`A5 Page ${index + 1}`}
                        className={`absolute inset-0 w-full h-full object-fill p-4 bg-white transition-all duration-1000 ${
                          index === currentImageIndex
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-105"
                        }`}
                      />
                    ))}

                    {/* Image Indicators */}
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                      {data?.images?.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? "bg-gray-800 w-8"
                              : "bg-gray-400 hover:bg-gray-600"
                          }`}
                        />
                      ))}
                    </div>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {data?.image_title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {data?.image_subtitle}
                          </p>
                        </div>
                      </div>
                      <Award className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="flex gap-2">
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Styles */}
        <style>{`
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in-up {
            animation: fade-in-up 1s ease-out;
          }

          @keyframes float {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .delay-500 {
            animation-delay: 0.5s;
          }

          .delay-700 {
            animation-delay: 0.7s;
          }

          .delay-1000 {
            animation-delay: 1s;
          }
        `}</style>
      </section>
    </>
  );
};

export default HeroSection;
