import React, { useState, useEffect } from "react";
import { BookOpen, User } from "lucide-react";
import { motion } from "framer-motion";

const PublishedBook = () => {
  const [currentPages, setCurrentPages] = useState({});
  const [isHovered, setIsHovered] = useState({});

  const publications = [
    {
      id: 1,
      title: "The Art of Modern Design",
      author: "Sarah Mitchell",
      pages: [
        { type: "cover", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop" },
        { type: "content", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop" },
        { type: "content", image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop" },
        { type: "back-cover", content: "Explore the fundamentals of contemporary design principles and their application in the modern world." }
      ],
      year: "2024",
      category: "Design"
    },
    {
      id: 2,
      title: "Digital Transformation",
      author: "Michael Chen",
      pages: [
        { type: "cover", image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=600&fit=crop" },
        { type: "content", image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop" },
        { type: "content", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=600&fit=crop" },
        { type: "back-cover", content: "Navigate the digital landscape with proven strategies for technological innovation and growth." }
      ],
      year: "2023",
      category: "Technology"
    },
    {
      id: 3,
      title: "Creative Thinking",
      author: "Emma Thompson",
      pages: [
        { type: "cover", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop" },
        { type: "content", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop" },
        { type: "content", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop" },
        { type: "back-cover", content: "Unlock your creative potential and learn to approach problems from innovative perspectives." }
      ],
      year: "2024",
      category: "Business"
    },
    {
      id: 4,
      title: "Innovation Leadership",
      author: "David Rodriguez",
      pages: [
        { type: "cover", image: "https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop" },
        { type: "content", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=600&fit=crop" },
        { type: "content", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=600&fit=crop" },
        { type: "back-cover", content: "Master the art of leading teams through change and fostering a culture of innovation." }
      ],
      year: "2023",
      category: "Leadership"
    }
  ];

  const handlePageClick = (bookId, pageIndex, isBackSide) => {
    const curr = isBackSide ? pageIndex : pageIndex + 1;
    setCurrentPages(prev => ({ ...prev, [bookId]: curr }));
  };

  return (
    <div className="py-12 px-4 bg-gradient-to-b from-gray-50 to-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-10 h-10 text-purple-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Published Books
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Click on pages to flip through the books
          </p>
        </motion.div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
          {publications.map((book) => {
            const currentPage = currentPages[book.id] || 0;
            
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col"
                onMouseEnter={() => setIsHovered(prev => ({ ...prev, [book.id]: true }))}
                onMouseLeave={() => setIsHovered(prev => ({ ...prev, [book.id]: false }))}
              >
                {/* Book Container with 3D Perspective */}
                <div 
                  className="relative h-96 overflow-hidden"
                  style={{ 
                    perspective: "1500px",
                    perspectiveOrigin: "50% 50%"
                  }}
                >
                  {/* 3D Book */}
                  <div 
                    className="absolute inset-0 flex"
                    style={{
                      transformStyle: "preserve-3d",
                      transition: "transform 1s ease",
                      transform: `translateX(${Math.min(currentPage, 1) * 50}%) rotateX(15deg)`,
                      pointerEvents: "none"
                    }}
                  >
                    {book.pages.map((page, idx) => {
                      const isFlipped = currentPage > idx;
                      const zIndex = isFlipped ? idx : book.pages.length - idx;
                      
                      return (
                        <div
                          key={idx}
                          className="absolute inset-0 w-full"
                          style={{
                            transformStyle: "preserve-3d",
                            transformOrigin: "left center",
                            transform: `
                              translateX(${idx * -100}%)
                              translateZ(${(currentPage - idx - 0.5) * 2}px)
                              rotateY(${Math.max(0, Math.min(1, currentPage - idx)) * -180}deg)
                            `,
                            transition: "transform 1s ease, rotate 1s ease-in",
                            transitionDelay: `${(Math.min(idx, currentPage) - Math.max(idx, currentPage)) * 50}ms`,
                            zIndex: zIndex,
                            pointerEvents: "all"
                          }}
                        >
                          {/* Front of Page */}
                          <div
                            className="absolute inset-0 bg-white cursor-pointer overflow-hidden"
                            style={{
                              backfaceVisibility: "hidden",
                              WebkitBackfaceVisibility: "hidden",
                              background: "linear-gradient(to left, #f7f7f7 80%, #eee 100%)",
                              borderRadius: "0.1em 0.5em 0.5em 0.1em",
                              border: "1px solid rgba(0,0,0,0.1)",
                              boxShadow: "0 0.5em 1em -0.2em rgba(0,0,0,0.125)"
                            }}
                            onClick={() => handlePageClick(book.id, idx, false)}
                          >
                            {page.type === "cover" && (
                              <div 
                                className="w-full h-full flex flex-col items-center justify-center text-white p-8"
                                style={{
                                  background: `radial-gradient(circle farthest-corner at 80% 20%, rgba(76, 175, 80, 0.3) 0%, rgba(33, 150, 243, 0.1) 100%), #1e3a5f url("${page.image}") 50% / cover`
                                }}
                              >
                                <h2 className="text-2xl font-bold text-center mb-2 drop-shadow-lg">{book.title}</h2>
                                <p className="text-sm text-center drop-shadow-md">{book.year}</p>
                                <p className="text-xs text-center mt-2 drop-shadow-md">Click to open</p>
                              </div>
                            )}
                            
                            {page.type === "content" && page.image && (
                              <img 
                                src={page.image} 
                                alt={`Page ${idx}`}
                                className="w-full h-full object-cover"
                              />
                            )}

                            {/* Page Number */}
                            {page.type !== "cover" && page.type !== "back-cover" && (
                              <div className="absolute bottom-4 right-4 text-xs text-gray-500">
                                {idx}
                              </div>
                            )}

                            {/* Left shadow */}
                            <div 
                              className="absolute left-0 top-0 bottom-0 w-8 pointer-events-none"
                              style={{
                                background: "linear-gradient(to right, rgba(0,0,0,0.2), transparent)"
                              }}
                            />
                          </div>

                          {/* Back of Page */}
                          <div
                            className="absolute inset-0 bg-white cursor-pointer overflow-hidden"
                            style={{
                              backfaceVisibility: "hidden",
                              WebkitBackfaceVisibility: "hidden",
                              transform: "rotateY(180deg) translateZ(1px)",
                              background: "linear-gradient(to right, #f7f7f7 80%, #eee 100%)",
                              borderRadius: "0.5em 0.1em 0.1em 0.5em",
                              border: "1px solid rgba(0,0,0,0.1)",
                              boxShadow: "0 0.5em 1em -0.2em rgba(0,0,0,0.125)"
                            }}
                            onClick={() => handlePageClick(book.id, idx, true)}
                          >
                            {page.type === "back-cover" && (
                              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
                                <BookOpen className="w-12 h-12 text-purple-600 mb-4" />
                                <h3 className="text-lg font-bold text-gray-800 mb-2 text-center">
                                  {book.title}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 text-center">
                                  by {book.author}
                                </p>
                                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-lg">
                                  <p className="text-xs text-gray-700 leading-relaxed text-center">
                                    {page.content}
                                  </p>
                                </div>
                                <p className="text-xs text-gray-500 mt-4">Click to close</p>
                              </div>
                            )}
                            
                            {page.type === "content" && (
                              <div className="w-full h-full p-8 flex items-center justify-center">
                                <p className="text-sm text-gray-600 text-center">
                                  Page content for {book.title}
                                </p>
                              </div>
                            )}

                            {/* Page Number */}
                            {page.type !== "cover" && page.type !== "back-cover" && (
                              <div className="absolute bottom-4 left-4 text-xs text-gray-500">
                                {idx}
                              </div>
                            )}

                            {/* Right shadow */}
                            <div 
                              className="absolute right-0 top-0 bottom-0 w-8 pointer-events-none"
                              style={{
                                background: "linear-gradient(to left, rgba(0,0,0,0.2), transparent)"
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Page Counter */}
                  {isHovered[book.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full backdrop-blur-sm z-50"
                    >
                      Page {currentPage} / {book.pages.length - 1}
                    </motion.div>
                  )}
                </div>

                {/* Book Info */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {book.title}
                  </h3>

                  <div className="flex items-center text-gray-600 text-sm mb-4">
                    <User className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="font-medium">{book.author}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm text-gray-500 font-medium">
                      Published {book.year}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {book.category}
                    </span>
                  </div>

                  <motion.div 
                    className="mt-4 text-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <p className="text-xs text-gray-500">
                      ✨ Click pages to flip through
                    </p>
                  </motion.div>

                  <motion.button 
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCurrentPages(prev => ({ ...prev, [book.id]: 0 }))}
                  >
                    Reset Book
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PublishedBook;