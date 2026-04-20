import { useState } from 'react';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';

export default function ProductCard({ product }) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const discountPercentage = product.originalPrice && product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (inWishlist) {
        await removeFromWishlist(product.id);
      } else {
        await addToWishlist(product.id);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    try {
      await addToCart(product.id, 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        fill={i < rating ? '#D4AF37' : 'none'}
        color={i < rating ? '#D4AF37' : '#e5e7eb'}
      />
    ));
  };

  return (
    <div
      className="product-card group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden bg-gray-50 h-80">
        {/* Main Image */}
        <img
          src={product.images?.[0] || product.image || 'https://via.placeholder.com/400x400?text=Luxury+Furniture'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Link
              to={`/product/${product.id}`}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-500 hover:text-white transition flex items-center gap-2"
            >
              <Eye size={18} />
              View Details
            </Link>
          </div>
        </div>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-lg"
        >
          <Heart
            size={18}
            fill={inWishlist ? 'currentColor' : 'none'}
            color={inWishlist ? 'red' : 'gray'}
            className={inWishlist ? 'text-red-500' : 'text-gray-600'}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 truncate">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">
              ${product.price?.toFixed(2) || '0.00'}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice?.toFixed(2) || '0.00'}
              </span>
            )}
          </div>
          <div className="flex gap-0.5">
            {renderStars(Math.round(product.rating || 0))}
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full bg-yellow-600 text-white p-2 rounded hover:bg-yellow-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
