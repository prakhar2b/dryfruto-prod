import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';

const FeaturedProducts = () => {
  const { products } = useData();
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const featuredProducts = products.slice(0, 8);

  if (featuredProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Dry Fruits - Featured Collection
            </h2>
            <p className="text-gray-600 max-w-xl">
              Discover our handpicked selection of premium dry fruits and nuts
            </p>
          </div>
          <Link 
            to="/products" 
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold transition-colors"
          >
            View All
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-amber-50 transition-colors hidden md:flex"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-700 hover:bg-amber-50 transition-colors hidden md:flex"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Products Carousel */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.slug}`}
                className="flex-shrink-0 w-[280px] group"
              >
                <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-amber-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="relative overflow-hidden aspect-square bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="bg-white text-amber-700 px-4 py-2 rounded-full font-medium flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Details
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-amber-600 mb-1">DryFruto</p>
                    <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-amber-700 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-lg font-bold text-amber-700">
                      ₹{product.basePrice}.00
                      <span className="text-sm text-gray-500 font-normal"> /100g</span>
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
