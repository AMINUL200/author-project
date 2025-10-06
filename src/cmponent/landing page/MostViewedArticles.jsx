import { ArrowRight, Calendar, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment";
import Skeleton from "../common/Skeleton";

const MostViewedArticles = ({ mostView, loading, error }) => {
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

  if (!mostView || mostView.length === 0) {
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

  // Format view count to be more readable (e.g., 1500 -> 1.5K)
  const formatViewCount = (count) => {
    if (!count) return "0";

    const num = parseInt(count);
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
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
    <section className="py-20 bg-white" id="popular">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Current Published Books
          </h2>
          <p className="text-xl text-gray-600">
            Discover what's trending among our readers
          </p>
        </div>

        {mostView && mostView.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {mostView.map((article) => (
                <div
                  key={article.id}
                  className="group cursor-pointer"
                  onClick={() => handleArticleClick(article.id)}
                >
                  <div className="relative overflow-hidden rounded-xl mb-4">
                    <img
                      src={getImageUrl(article)}
                      alt={article.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {article.category?.name || "Uncategorized"}
                      </span>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center bg-black/60 text-white px-2 py-1 rounded-full text-sm">
                      <Eye size={14} className="mr-1" />
                      {formatViewCount(article.view_count)}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  {/* <p className="text-gray-600 text-sm">Submitted Date:{ moment(article.created_at).fromNow()}</p> */}
                  <span className="flex items-center">
                    <Calendar size={14} className="mr-1" />
                    {moment(article.created_at).fromNow()}
                  </span>
                </div>
              ))}
            </div>
            {/* <div className="text-center mt-12">
              <Link
                to="/articles"
                className="group text-purple-600 hover:text-purple-700 font-semibold inline-flex items-center cursor-pointer"
              >
                See All Articles
                <ArrowRight
                  size={16}
                  className="ml-2 transform transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div> */}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No articles available at the moment.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default MostViewedArticles;
