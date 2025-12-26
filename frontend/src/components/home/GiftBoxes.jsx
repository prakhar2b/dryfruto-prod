import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

const GiftBoxes = () => {
  const { giftBoxes } = useData();
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

  if (giftBoxes.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#fdf8f3]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
              Latest Gift Boxes Collection
            </h2>
            <p className="text-gray-600 max-w-xl">
              Celebrate all festivals in a healthy & delicious way with our exquisite range of dry fruit gift hampers.
            </p>
          </div>
          <Link 
            to="/products?category=gift-boxes" 
            className="mt-4 md:mt-0 inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 font-semibold transition-colors"
          >
            View More
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

          {/* Carousel */}
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {giftBoxes.concat(giftBoxes).map((box, index) => (
              <Link
                key={`${box.id}-${index}`}
                to={`/products?category=gift-boxes`}
                className="flex-shrink-0 w-[280px] group"
              >
                <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={box.image}
                      alt={box.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <p className="font-semibold">{box.name}</p>
                      <p className="text-amber-300">₹{box.price}</p>
                    </div>
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

export default GiftBoxes;
