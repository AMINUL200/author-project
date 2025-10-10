import React from "react";
import {
  Linkedin,
  Twitter,
  Github,
  Globe,
  ArrowRight,
  Facebook,
  Instagram,
} from "lucide-react";
import Skeleton from "../common/Skeleton";
import { useNavigate } from "react-router-dom";

const AuthorBio = ({
  sectionTitle = {},
  authorInfo,
  loading = false,
  error = null,
}) => {

  const navigate = useNavigate();

  if (loading) {
    return (
      <section className="py-20 bg-white flex justify-center">
        <div className="w-full max-w-4xl space-y-4 px-4">
          <Skeleton className="w-40 h-40 rounded-full mx-auto" />
          <Skeleton className="w-3/4 h-8 mx-auto" />
          <Skeleton className="w-full h-24 mx-auto" />
          <Skeleton className="w-1/2 h-6 mx-auto" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-red-500">{error}</p>
      </section>
    );
  }

  const getAuthorImage = () => {
    if (authorInfo?.image1) return authorInfo.image1;
    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face";
  };
  const handleSocialClick = (platform, url) => {
    if (url && url !== "http://127.0.0.1:8000/api/author") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 " id="bio">
      <div className="max-w-6xl w-full bg-white  overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Content */}
          <div className="p-12 flex flex-col justify-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                {/* Alexandra Chen */}
                {authorInfo?.name}
              </h1>
              <p className="text-xl text-indigo-600 font-medium">
                {/* Product Designer & Creative Technologist */}
                {authorInfo?.affiliation}
              </p>
            </div>

            {/* Social Links */}
            {authorInfo?.social_links && (
              <div className="flex justify-start  gap-6 mb-8">
                {authorInfo.social_links.twitter && (
                  <button
                    onClick={() =>
                      handleSocialClick(
                        "twitter",
                        authorInfo.social_links.twitter
                      )
                    }
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="Twitter"
                  >
                    <Twitter size={24} />
                  </button>
                )}
                {authorInfo.social_links.linkedin && (
                  <button
                    onClick={() =>
                      handleSocialClick(
                        "linkedin",
                        authorInfo.social_links.linkedin
                      )
                    }
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="LinkedIn"
                  >
                    <Linkedin size={24} />
                  </button>
                )}
                {authorInfo.social_links.facebook && (
                  <button
                    onClick={() =>
                      handleSocialClick("facebook", authorInfo.social_links.fb)
                    }
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="Facebook"
                  >
                    <Facebook size={24} />
                  </button>
                )}
                {authorInfo.social_links.instagram && (
                  <button
                    onClick={() =>
                      handleSocialClick(
                        "instagram",
                        authorInfo.social_links.instagram
                      )
                    }
                    className="text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                    aria-label="Instagram"
                  >
                    <Instagram size={24} />
                  </button>
                )}
              </div>
            )}

            <p className="text-gray-600 leading-relaxed text-lg line-clamp-8">
              {authorInfo?.description}
            </p>

            

            {/* Read More Button */}
            <button 
              onClick={()=>navigate('/bio-details')}
            className="group mt-6 inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl w-fit">

              Read More
              <ArrowRight className="w-5 h-5 transform transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right Side - Image */}
          <div className="relative bg-gradient-to-br bg-white">
            <div className="absolute inset-0 bg-black opacity-20"></div>
            <div className="relative bg-white h-full flex items-center justify-center p-12">
              {/* Decorative Elements */}

              {/* Profile Image Placeholder */}
              <div
                className="relative z-10 w-100 h-120 rounded-3xl border border-black/20 overflow-hidden transform  hover:rotate-0 transition-transform duration-500"
                style={{ boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px" }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={getAuthorImage()}
                    alt="Author Bio"
                    className="w-full h-full rounded object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
