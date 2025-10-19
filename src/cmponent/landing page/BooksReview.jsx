import React from "react";
import { Book } from "lucide-react";

const BooksReview = ({ reviewData, loading = false, error = null }) => {
  // SEO fallback values
  const seoTitle = reviewData?.title_seo || reviewData?.title;
  const seoDescription = reviewData?.description_seo || reviewData?.description;

  if (loading) {
    return (
      <section
        className="bg-[#f7f7f7] py-26 flex justify-center items-center"
        aria-label="Loading book reviews"
      >
        <p className="text-lg text-gray-700 animate-pulse">
          Loading book reviews...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section
        className="bg-[#f7f7f7] py-26 flex justify-center items-center"
        aria-label="Error loading book reviews"
      >
        <p className="text-lg text-red-600 font-medium">
          Failed to load book review data.
        </p>
      </section>
    );
  }

  return (
    <section
      className="bg-[#f7f7f7] py-26"
      id="review"
      aria-labelledby="book-review-title"
    >
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Left: Book Links */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Link 1 */}
          {reviewData?.url1 && (
            <a
              href={reviewData.url1}
              target="_self"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center space-y-3 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
              aria-label={`Go to ${reviewData?.url1_title}`}
            >
              <Book size={40} strokeWidth={2.5} className="text-black" />
              <span className="text-2xl font-medium text-black leading-tight">
                {reviewData?.url1_title}
              </span>
            </a>
          )}

          {/* Link 2 */}
          {reviewData?.url2 && (
            <a
              href={reviewData.url2}
              target="_self"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center space-y-3 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
              aria-label={`Go to ${reviewData?.url2_title}`}
            >
              <Book size={40} strokeWidth={2.5} className="text-black" />
              <span className="text-2xl font-medium text-black leading-tight">
                {reviewData?.url2_title}
              </span>
            </a>
          )}

          {/* Link 3 */}
          {reviewData?.url3 && (
            <a
              href={reviewData.url3}
              target="_self"
              rel="noopener noreferrer"
              className="flex flex-col items-center text-center space-y-3 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-lg"
              aria-label={`Go to ${reviewData?.url3_title}`}
            >
              <Book size={40} strokeWidth={2.5} className="text-black" />
              <span className="text-2xl font-medium text-black leading-tight">
                {reviewData?.url3_title}
              </span>
            </a>
          )}
        </div>

        {/* Right: Description */}
        <article
          className="mt-10 md:mt-0 md:ml-8 max-w-lg"
          itemScope
          itemType="https://schema.org/Book"
        >
          <h2
            id="book-review-title"
            className="text-4xl font-bold text-black mb-3"
            itemProp="name"
            aria-label={reviewData?.title_seo || "Book Review Title"}
          >
            {reviewData?.title}
          </h2>
          <div
            className="text-lg text-gray-800 leading-relaxed"
            itemProp="description"
            aria-label={reviewData?.description_seo || "Book Review Description"}
            dangerouslySetInnerHTML={{ __html: reviewData?.description }}
          />
        </article>
      </div>

      {/* ✅ Optional JSON-LD Schema for SEO Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Book",
            "name": seoTitle,
            "description": seoDescription,
            "url": reviewData?.url1,
            "author": {
              "@type": "Person",
              "name": "Unknown" // can be dynamic if you have author name
            },
            "potentialAction": [
              reviewData?.url1
                ? {
                    "@type": "ReadAction",
                    "target": reviewData.url1,
                    "name": reviewData.url1_title,
                  }
                : null,
              reviewData?.url2
                ? {
                    "@type": "ReadAction",
                    "target": reviewData.url2,
                    "name": reviewData.url2_title,
                  }
                : null,
              reviewData?.url3
                ? {
                    "@type": "ReadAction",
                    "target": reviewData.url3,
                    "name": reviewData.url3_title,
                  }
                : null,
            ].filter(Boolean),
          }),
        }}
      />
    </section>
  );
};

export default BooksReview;
