import React, { useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Users,
  TrendingUp,
  X,
  Check,
  Sparkles,
  Star,
  Award,
} from "lucide-react";

const HeroSection = () => {
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("monthly");

  const stats = [
    { icon: BookOpen, value: "10K+", label: "Articles Published" },
    { icon: Users, value: "50K+", label: "Active Readers" },
    { icon: TrendingUp, value: "1M+", label: "Monthly Views" },
  ];

  return (
    <>
      <section
        className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 min-h-screen flex items-center overflow-hidden"
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
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full border border-purple-200">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">
                  Premium Writing Platform
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl md:text-5xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                  Read Stories That
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Inspire & Transform
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Discover thought-provoking articles from world-class writers.
                Join our community and unlock unlimited access to premium
                content.
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
                  Start Reading Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* <button className="border-2 border-slate-300 text-slate-700 hover:border-purple-600 hover:text-purple-600 hover:bg-purple-50 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
                  Browse Articles
                </button> */}
              </div>
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative lg:block hidden">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl overflow-hidden">
                    <img
                      src="https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&h=800&fit=crop"
                      alt="Reading"
                      style={{ height: "350px" }}
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full"></div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            Featured Article
                          </p>
                          <p className="text-sm text-gray-600">5 min read</p>
                        </div>
                      </div>
                      <Award className="w-6 h-6 text-yellow-500" />
                    </div>
                    <div className="flex gap-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        Premium Access
                      </p>
                      <p className="text-xs text-gray-600">Unlimited reading</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 animate-float delay-500">
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        50K+ Readers
                      </p>
                      <p className="text-xs text-gray-600">
                        Join the community
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowRight className="rotate-90 text-purple-400" size={32} />
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
