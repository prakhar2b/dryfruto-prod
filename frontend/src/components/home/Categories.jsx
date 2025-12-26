import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';

const Categories = () => {
  const { categories } = useData();

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Categories</h2>
        </div>

        {/* Desktop: 3 columns, Mobile: 2 columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/products?category=${category.slug}`}
              className="group"
            >
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Image Container - Slightly smaller */}
                <div className="aspect-[5/4] overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                {/* Text Label */}
                <div className="py-3 px-2 text-center bg-white">
                  <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                    {category.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
