import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Heart, User, LogOut, Menu, X, Search } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { items: cartItems } = useCartStore();
  const { items: wishlistItems } = useWishlistStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const cartItemCount = cartItems?.reduce((total, item) => total + item.quantity, 0) || 0;
  const wishlistItemCount = wishlistItems?.length || 0;

  return (
    <header className="bg-gray-900 text-white sticky top-0 z-50 shadow-lg">
      {/* Top Bar */}
      <div className="bg-gray-800 py-2">
        <div className="luxury-container flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <span>📞 +1 (555) 123-4567</span>
            <span>✉️ info@aurellemaison.com</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Free Shipping on Orders Over $500</span>
            {!isAuthenticated() ? (
              <div className="flex gap-2">
                <Link to="/login" className="hover:text-yellow-400 transition">Login</Link>
                <span>|</span>
                <Link to="/register" className="hover:text-yellow-400 transition">Register</Link>
              </div>
            ) : (
              <span>Welcome, {user?.name || 'User'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="luxury-container py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-3xl font-bold text-yellow-500 hover:text-yellow-400 transition">
            Aurelle Maison
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search luxury furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </form>

          {/* Navigation Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-gray-800 rounded-lg transition"
              title="Wishlist"
            >
              <Heart size={24} className="text-gray-300 hover:text-yellow-500 transition" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-800 rounded-lg transition"
              title="Shopping Cart"
            >
              <ShoppingCart size={24} className="text-gray-300 hover:text-yellow-500 transition" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="hover:text-yellow-600 transition">
                  <User size={24} />
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 hover:text-yellow-600 transition"
                >
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition font-semibold">
                Sign In
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 border-t border-gray-700 pt-4">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search furniture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </form>

            <nav className="flex flex-col gap-3">
              <Link to="/" className="hover:text-yellow-400 transition text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/products" className="hover:text-yellow-400 transition text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                Products
              </Link>
              <Link to="/about" className="hover:text-yellow-400 transition text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                About
              </Link>
              <Link to="/contact" className="hover:text-yellow-400 transition text-sm font-medium" onClick={() => setIsMenuOpen(false)}>
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
