import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';

export default function Cart() {
  const navigate = useNavigate();
  const { items, isLoading, fetchCart, removeFromCart, updateCartItem, getCartTotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCart();
    }
  }, []);

  if (!isAuthenticated()) {
    return (
      <div className="luxury-container py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">Please log in to view your cart</p>
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
        <h1 className="text-4xl font-bold mb-4">Shopping Cart</h1>
        <p className="text-gray-600 mb-8">Your cart is empty</p>
        <Link to="/products" className="button-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const total = getCartTotal();

  return (
    <div className="luxury-container py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex gap-6 p-6 border-b last:border-b-0"
              >
                <img
                  src={item.image || 'https://via.placeholder.com/100x100?text=Product'}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{item.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-3 bg-gray-100 rounded px-3 py-2">
                      <button
                        onClick={() =>
                          updateCartItem(item._id, Math.max(1, item.quantity - 1))
                        }
                        className="hover:text-yellow-600"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateCartItem(item._id, item.quantity + 1)
                        }
                        className="hover:text-yellow-600"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold text-yellow-600">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-gray-600 text-sm">
                        ${item.price} each
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 size={24} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-20">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6 pb-6 border-b">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-semibold">${(total * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between mb-6">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold text-yellow-600">
                ${(total * 1.1).toFixed(2)}
              </span>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="button-primary w-full mb-3"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/products"
              className="button-secondary w-full text-center block"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
