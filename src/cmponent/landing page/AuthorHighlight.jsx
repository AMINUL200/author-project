import { Facebook, Linkedin, TwitterIcon, Instagram } from "lucide-react";
import Skeleton from "../common/Skeleton";

const AuthorHighlight = ({ authorInfo, loading, error }) => {
   if (loading) {
    return (
      <section className="py-20 bg-gray-50 flex justify-center">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="w-32 h-32 rounded-full mx-auto" />
          <Skeleton className="w-2/3 h-6 mx-auto" />
          <Skeleton className="w-1/2 h-4 mx-auto" />
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

  if (!authorInfo || Object.keys(authorInfo).length === 0) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-gray-500">No Author Information </p>
      </section>
    );
  }

  // Fallback image in case author image is not available
  const getAuthorImage = () => {
    if (authorInfo?.image) return authorInfo.image;

    return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face";
  };

  // Function to handle social media clicks
  const handleSocialClick = (platform, url) => {
    if (url && url !== "http://127.0.0.1:8000/api/author") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <section
      className="py-20 bg-gradient-to-r from-purple-600 to-pink-600"
      id="about"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="mb-8">
          <img
            src={getAuthorImage()}
            alt={`${authorInfo?.first_name} ${authorInfo?.last_name}`}
            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-white/20 object-cover"
          />
          <h2 className="text-3xl font-bold mb-4">Meet the Author</h2>
          <h3 className="text-2xl font-semibold mb-4">
            {authorInfo?.first_name} {authorInfo?.last_name}
          </h3>
          <p className="text-lg mb-6 text-purple-100 max-w-2xl mx-auto">
            {authorInfo?.description ||
              "An accomplished author with expertise in their field."}
          </p>

          {/* Author affiliation and country
          {(authorInfo?.affiliation || authorInfo?.country) && (
            <div className="mb-6 text-purple-200">
              {authorInfo?.affiliation && <p className="mb-1">{authorInfo.affiliation}</p>}
              {authorInfo?.country && <p>{authorInfo.country}</p>}
            </div>
          )} */}

          {/* Social media links */}
          <div className="flex justify-center space-x-4">
            {authorInfo?.social_links?.twitter && (
              <TwitterIcon
                className="hover:text-purple-200 cursor-pointer transition-colors"
                size={24}
                onClick={() =>
                  handleSocialClick("twitter", authorInfo.social_links.twitter)
                }
              />
            )}

            {authorInfo?.social_links?.linkedin && (
              <Linkedin
                className="hover:text-purple-200 cursor-pointer transition-colors"
                size={24}
                onClick={() =>
                  handleSocialClick(
                    "linkedin",
                    authorInfo.social_links.linkedin
                  )
                }
              />
            )}

            {authorInfo?.social_links?.fb && (
              <Facebook
                className="hover:text-purple-200 cursor-pointer transition-colors"
                size={24}
                onClick={() =>
                  handleSocialClick("facebook", authorInfo.social_links.fb)
                }
              />
            )}

            {authorInfo?.social_links?.instagram && (
              <Instagram
                className="hover:text-purple-200 cursor-pointer transition-colors"
                size={24}
                onClick={() =>
                  handleSocialClick(
                    "instagram",
                    authorInfo.social_links.instagram
                  )
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorHighlight;
