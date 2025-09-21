const CategoriesSection = () => {
  const categories = [
    { name: "Technology", icon: "💻", count: 45, color: "bg-blue-500" },
    { name: "Business", icon: "📈", count: 32, color: "bg-green-500" },
    { name: "Lifestyle", icon: "🌟", count: 28, color: "bg-purple-500" },
    { name: "Finance", icon: "💰", count: 24, color: "bg-yellow-500" },
    { name: "Health", icon: "🏥", count: 19, color: "bg-red-500" },
    { name: "Travel", icon: "✈️", count: 16, color: "bg-indigo-500" }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore by Category</h2>
          <p className="text-xl text-gray-600">Find articles that match your interests</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div key={category.name} className="group cursor-pointer">
              <div className="bg-white border-2 border-gray-100 hover:border-purple-300 rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg">
                <div className={`${category.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl`}>
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-gray-600">{category.count} articles</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default CategoriesSection;