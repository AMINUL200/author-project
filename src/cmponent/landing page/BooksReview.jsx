import React from "react";
import { Book } from "lucide-react";

const BooksReview = ({ reviewData, loading = false, error = null }) => {
  const handleRedirect = (url) => {
    if (!url) return;
    // window.open(url, "_blank"); // open in new tab
    window.location.href = url; // open in same tab
  };

  // ✅ Handle loading state
  if (loading) {
    return (
      <div className="bg-[#f7f7f7] py-26 flex justify-center items-center">
        <p className="text-lg text-gray-700 animate-pulse">
          Loading book reviews...
        </p>
      </div>
    );
  }

  // ✅ Handle error state
  if (error) {
    return (
      <div className="bg-[#f7f7f7] py-26 flex justify-center items-center">
        <p className="text-lg text-red-600 font-medium">
          Failed to load book review data.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f7] py-26" id="review">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        {/* Left: Book Reviews */}
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div
            onClick={() => handleRedirect(reviewData?.url1)}
            className="flex flex-col items-center text-center space-y-3 cursor-pointer transition transform hover:scale-105"
          >
            <Book size={40} strokeWidth={2.5} className="text-black" />
            <div>
              <p className="text-2xl font-medium text-black leading-tight">
                {reviewData?.url1_title}
              </p>
            </div>
          </div>
          <div
            onClick={() => handleRedirect(reviewData?.url2_title)}
            className="flex flex-col items-center text-center space-y-3 cursor-pointer transition transform hover:scale-105"
          >
            <Book size={40} strokeWidth={2.5} className="text-black" />
            <div>
              <p className="text-2xl font-medium text-black leading-tight">
                {reviewData?.url2_title}
              </p>
            </div>
          </div>
          <div
            onClick={() => handleRedirect(reviewData?.url3_title)}
            className="flex flex-col items-center text-center space-y-3 cursor-pointer transition transform hover:scale-105"
          >
            <Book size={40} strokeWidth={2.5} className="text-black" />
            <div>
              <p className="text-2xl font-medium text-black leading-tight">
                {reviewData?.url3_title}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Description */}
        <div className="mt-10 md:mt-0 md:ml-8 max-w-lg">
          <h2 className="text-4xl font-bold text-black mb-3">
            {reviewData?.title}
          </h2>
          <p className="text-lg text-gray-800 leading-relaxed">
            {reviewData?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BooksReview;
