import React from "react";
import Skeleton from "../common/Skeleton";

const HeroSectionSkeleton = () => {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 via-white to-purple-50 min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left skeleton content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-40 h-6" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-10 w-1/2" />
          </div>

          <Skeleton className="h-20 w-full max-w-xl" />

          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>

        {/* Right skeleton visual card */}
        <div className="relative hidden lg:block">
          <div className="bg-white rounded-3xl shadow-2xl p-8 transform rotate-3">
            <Skeleton className="w-full h-[350px] rounded-2xl" />

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-16 h-3" />
                  </div>
                </div>
                <Skeleton className="w-6 h-6 rounded-full" />
              </div>
              <div className="flex gap-2">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="w-4 h-4 rounded-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Floating skeleton cards */}
          <div className="absolute -top-6 -left-6 bg-white rounded-2xl shadow-xl p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-16 h-3 mt-1" />
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-16 h-3 mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSectionSkeleton;
