import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, ShoppingCart } from 'lucide-react';
import { useWishlistStore } from '../store/wishlistStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Wishlist() {
  const { items, isLoading, fetchWishlist, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchWishlist();
    }
  }, []);

  if (!isAuthenticated()) {
    return (
      <div className="luxury-container py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Wishlist</h1>
        <p className="text-gray-600 mb-8">Please log in to view your wishlist</p>
        <Link to="/login" className="button-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="luxury-container py-12 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="luxury-container py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Wishlist</h1>
        <p className="text-gray-600 mb-8">Your wishlist is empty</p>
        <Link to="/products" className="button-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="luxury-container py-12">
      <h1 className="text-4xl font-bold mb-8">My Wishlist</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="product-card">
            <div className="relative overflow-hidden bg-gray-100 h-64">
              <img
                src={item.image || 'https://via.placeholder.com/300x300?text=Product'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 truncate">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-yellow-600">
                  ${item.price}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => addToCart(item._id, 1)}
                  className="button-primary flex-1 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>

                <button
                  onClick={() => removeFromWishlist(item._id)}
                  className="button-secondary w-12 flex items-center justify-center"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
