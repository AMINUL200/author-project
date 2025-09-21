import React from 'react';

const Loader = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center z-50">
      <div className="relative">
        {/* Main container with floating pages */}
        <div className="relative w-32 h-40">
          {/* Background pages */}
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-white rounded-lg shadow-lg border border-gray-200"
              style={{
                transform: `translateX(${i * 4}px) translateY(${i * 4}px) rotate(${i * 2}deg)`,
                zIndex: 3 - i,
                opacity: 1 - i * 0.2,
                animation: `float ${2 + i * 0.3}s ease-in-out infinite alternate`,
                animationDelay: `${i * 0.2}s`
              }}
            >
              {/* Page content lines */}
              <div className="p-4 space-y-2">
                {[...Array(6)].map((_, lineIndex) => (
                  <div
                    key={lineIndex}
                    className="bg-gray-300 rounded"
                    style={{
                      height: '2px',
                      width: `${Math.random() * 40 + 60}%`,
                      animation: `shimmer ${1.5}s ease-in-out infinite`,
                      animationDelay: `${lineIndex * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Loading text with typewriter effect */}
        <div className="mt-8 text-center">
          <div className="inline-block">
            <span className="text-2xl font-light text-gray-700 tracking-wide">
              Loading
            </span>
            <span className="inline-block ml-1">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.3s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.6s' }}>.</span>
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-500 font-medium">
            Preparing your manuscript
          </div>
        </div>

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
            style={{
              left: `${Math.random() * 200 - 50}px`,
              top: `${Math.random() * 200 - 50}px`,
              animation: `sparkle ${2 + Math.random() * 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}

        {/* Progress indicator */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse" 
                 style={{ 
                   width: '60%',
                   animation: 'progress 2s ease-in-out infinite'
                 }} 
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-10px) rotate(2deg); }
        }
        
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes sparkle {
          0%, 100% { 
            opacity: 0; 
            transform: scale(0) rotate(0deg); 
          }
          50% { 
            opacity: 1; 
            transform: scale(1) rotate(180deg); 
          }
        }
        
        @keyframes progress {
          0% { width: 20%; }
          50% { width: 80%; }
          100% { width: 20%; }
        }
      `}</style>
    </div>
  );
};

export default Loader;