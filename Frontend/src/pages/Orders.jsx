import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Eye } from 'lucide-react';
import { orderService } from '../services';
import { useAuthStore } from '../store/authStore';
import { formatCurrency, formatDate } from '../utils/helpers';
import { toast } from '../utils/toast';

export default function Orders() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getOrders();
      setOrders(response.data || response.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600 text-white';
      case 'confirmed':
        return 'bg-blue-600 text-white';
      case 'shipped':
        return 'bg-purple-600 text-white';
      case 'delivered':
        return 'bg-green-600 text-white';
      case 'cancelled':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 flex items-center gap-3">
          <Package size={32} className="text-yellow-400" />
          My Orders
        </h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-800 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/30 rounded-lg border border-gray-700">
            <Package size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-gray-400 mb-4">No orders yet</p>
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded transition"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-yellow-400 transition">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="font-mono font-bold">{order._id.substring(0, 12)}...</p>
                  </div>
                  <span className={`px-4 py-2 rounded font-semibold capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Order Date</p>
                    <p className="font-semibold">{formatDate(order.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                    <p className="text-xl font-bold text-yellow-400">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Items</p>
                    <p className="font-semibold">{order.items?.length || 0} items</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Delivery Address</p>
                    <p className="text-sm">{order.shippingAddress?.city}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                  className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition"
                >
                  <Eye size={18} />
                  {selectedOrder === order._id ? 'Hide' : 'View'} Details
                </button>

                {selectedOrder === order._id && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <h4 className="font-semibold mb-3">Order Items</h4>
                    <div className="space-y-2">
                      {order.items?.map((item) => (
                        <div key={item._id} className="flex justify-between text-sm">
                          <span>{item.product?.name || 'Product'} x {item.quantity}</span>
                          <span>{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>{formatCurrency(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Shipping</span>
                        <span>{formatCurrency(order.shippingCost || 0)}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Tax</span>
                        <span>{formatCurrency(order.tax || 0)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-yellow-400">
                        <span>Total</span>
                        <span>{formatCurrency(order.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
