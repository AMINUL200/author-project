import { Mail } from "lucide-react";

const NewsletterSection = () => {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="mb-8">
          <Mail className="mx-auto mb-4" size={48} />
          <h2 className="text-3xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to get weekly articles and exclusive insights delivered straight to your inbox.
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 shadow-lg shadow-black/25 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white/15 focus:border-purple-400 transition-all duration-300"
            />
            <button className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-2xl shadow-purple-600/40 drop-shadow-xl hover:shadow-purple-600/60 hover:drop-shadow-2xl hover:scale-105">
              Subscribe
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-4">No spam, unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;