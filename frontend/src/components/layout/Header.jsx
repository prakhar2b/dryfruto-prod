import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { categories, siteSettings } = useData();
  const navigate = useNavigate();

  const LOGO_URL = siteSettings.logo || "https://customer-assets.emergentagent.com/job_70b8c44d-b0eb-46ab-b798-c90870274405/artifacts/5olvlaa7_WhatsApp%20Image%202025-12-26%20at%2013.46.33.jpeg";
  const callLink = `tel:+91${siteSettings.phone}`;

  const handleHomeClick = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-[#2d1810] text-white py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <a href={callLink} className="hover:text-amber-300 transition-colors">
              Call us: {siteSettings.phone}
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Free Shipping on orders above ₹500</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-[#3d2518] shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" onClick={handleHomeClick} className="flex items-center gap-3">
              <img 
                src={LOGO_URL} 
                alt={siteSettings.businessName} 
                className="h-14 w-14 rounded-full object-cover border-2 border-amber-400"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">{siteSettings.businessName}</h1>
                <p className="text-xs text-amber-300 italic">{siteSettings.slogan}</p>
              </div>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="/" onClick={handleHomeClick} className="text-white hover:text-amber-300 transition-colors font-medium">
                Home
              </a>
              <div className="relative group">
                <button className="text-white hover:text-amber-300 transition-colors font-medium flex items-center gap-1">
                  Shop
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 bg-white shadow-xl rounded-lg py-2 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.slug}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link to="/bulk-order" className="text-white hover:text-amber-300 transition-colors font-medium">
                Bulk Order
              </Link>
              <Link to="/career" className="text-white hover:text-amber-300 transition-colors font-medium">
                Career
              </Link>
              <Link to="/about" className="text-white hover:text-amber-300 transition-colors font-medium">
                About Us
              </Link>
              <a href="#contact" className="text-white hover:text-amber-300 transition-colors font-medium">
                Contact
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white lg:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-[#2d1810] border-t border-amber-900">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <nav className="flex flex-col gap-3">
                <a 
                  href="/" 
                  className="text-white hover:text-amber-300 py-2 transition-colors"
                  onClick={handleHomeClick}
                >
                  Home
                </a>
                <div className="border-t border-amber-900 pt-2">
                  <p className="text-amber-400 text-sm font-medium mb-2">Shop</p>
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      to={`/products?category=${cat.slug}`}
                      className="block text-white hover:text-amber-300 py-1.5 pl-2 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <Link 
                  to="/bulk-order" 
                  className="text-white hover:text-amber-300 py-2 border-t border-amber-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Bulk Order
                </Link>
                <Link 
                  to="/career" 
                  className="text-white hover:text-amber-300 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Career
                </Link>
                <Link 
                  to="/about" 
                  className="text-white hover:text-amber-300 py-2 border-t border-amber-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About Us
                </Link>
                <a 
                  href="#contact" 
                  className="text-white hover:text-amber-300 py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </a>
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
