import { Calendar, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import Skeleton from "../common/Skeleton";

// Latest Articles Component
const LatestArticles = ({ latesView, loading, error }) => {
  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full h-48 rounded-xl" />
                <Skeleton className="w-3/4 h-6" />
                <Skeleton className="w-1/2 h-4" />
              </div>
            ))}
          </div>
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

  if (!latesView || latesView.length === 0) {
    return (
      <section className="py-20 bg-white text-center">
        <p className="text-gray-500">No articles available.</p>
      </section>
    );
  }

  const navigate = useNavigate();

  const handleArticleClick = (id) => {
    navigate(`/articles/${id}`);
  };

  // Format date using moment.js
  const formatDate = (dateString) => {
    return moment(dateString).fromNow();
  };

  // Determine if an article is new (published within the last 7 days)
  const isNewArticle = (dateString) => {
    return moment().diff(moment(dateString), "days") <= 7;
  };

  // Fallback image in case article image is null
  const getImageUrl = (article) => {
    if (article.image) return article.image;

    // Return category-specific placeholder images
    const categoryImages = {
      Math: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
      Biology:
        "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=400&h=300&fit=crop",
      // Add more category placeholders as needed
    };

    return (
      categoryImages[article.category?.name] ||
      "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=300&fit=crop"
    );
  };

  return (
    <section className="py-20 bg-gray-50" id="latest">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Previous Articles
          </h2>
          <p className="text-xl text-gray-600">
            Fresh insights delivered weekly
          </p>
        </div>

        {latesView && latesView.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {latesView.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group cursor-pointer"
                onClick={() => handleArticleClick(article.id)}
              >
                <div className="relative">
                  <img
                    src={getImageUrl(article)}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isNewArticle(article.created_at) && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        New
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center">
                      <User size={14} className="mr-1" />
                      User #{article.user_id}
                    </span>
                    <span className="flex items-center">
                      <Calendar size={14} className="mr-1" />
                      {formatDate(article.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No recent articles available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestArticles;
