const CTABanner = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-4xl font-bold mb-6">
          Ready to unlock all articles?
        </h2>
        <p className="text-xl mb-8 text-purple-100">
          Start your free 30-day trial today and get unlimited access to premium content, 
          ad-free reading, and exclusive insights.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-colors">
            Start Free Trial
          </button>
          <button className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-full text-lg font-semibold transition-colors">
            View Plans
          </button>
        </div>
      </div>
    </section>
  );
};
export default CTABanner;