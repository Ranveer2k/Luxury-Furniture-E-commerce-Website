import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { orderService, paymentService } from '../services';
import { formatCurrency, calculateShipping, calculateTax } from '../utils/helpers';
import { toast } from '../utils/toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [billingAddress, setBillingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [sameAsShipping, setSameAsShipping] = useState(true);

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = calculateShipping(subtotal);
  const tax = calculateTax(subtotal);
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    if (!shippingAddress.street || !shippingAddress.city) {
      toast.error('Please fill in shipping address');
      return;
    }

    setIsProcessing(true);
    try {
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId || item._id,
          quantity: item.quantity,
        })),
        shippingAddress,
        billingAddress: sameAsShipping ? shippingAddress : billingAddress,
        paymentMethod,
      };

      const response = await orderService.createOrder(orderData);
      const orderId = response.data?._id || response._id;

      if (paymentMethod === 'card') {
        // Redirect to payment
        navigate(`/payment/${orderId}`, { state: { amount: total } });
      } else {
        toast.success('Order placed successfully!');
        navigate(`/orders`);
      }
    } catch (error) {
      toast.error(error.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex justify-between mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => s < step && setStep(s)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                  s === step
                    ? 'bg-yellow-500 text-black'
                    : s < step
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-400'
                }`}
              >
                {s < step ? '✓' : s}
              </button>
              {s < 3 && <div className={`w-20 h-1 ${s < step ? 'bg-green-600' : 'bg-gray-700'}`}></div>}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Shipping Address */}
            {step === 1 && (
              <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="City"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      className="px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      className="px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Zip Code"
                    value={shippingAddress.zipCode}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                  />
                </div>
                <button
                  onClick={() => setStep(2)}
                  className="mt-6 w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded font-semibold transition"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Billing Address */}
            {step === 2 && (
              <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Billing Address</h2>
                <div className="mb-6">
                  <label className="flex items-center gap-2 mb-4">
                    <input
                      type="checkbox"
                      checked={sameAsShipping}
                      onChange={(e) => setSameAsShipping(e.target.checked)}
                    />
                    <span>Same as shipping address</span>
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Street Address"
                      value={billingAddress.street}
                      onChange={(e) => setBillingAddress({ ...billingAddress, street: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="City"
                        value={billingAddress.city}
                        onChange={(e) => setBillingAddress({ ...billingAddress, city: e.target.value })}
                        className="px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={billingAddress.state}
                        onChange={(e) => setBillingAddress({ ...billingAddress, state: e.target.value })}
                        className="px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Zip Code"
                      value={billingAddress.zipCode}
                      onChange={(e) => setBillingAddress({ ...billingAddress, zipCode: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-yellow-400 focus:outline-none"
                    />
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 border border-gray-600 rounded hover:bg-gray-700 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded font-semibold transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Payment */}
            {step === 3 && (
              <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-3">
                  {['card', 'razorpay', 'bank_transfer'].map((method) => (
                    <label key={method} className="flex items-center gap-3 p-4 border border-gray-600 rounded cursor-pointer hover:bg-gray-700">
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={paymentMethod === method}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <span className="capitalize font-semibold">{method.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 px-6 py-3 border border-gray-600 rounded hover:bg-gray-700 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded font-semibold transition disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-800/50 rounded-lg p-8 border border-gray-700 h-fit sticky top-20">
            <h3 className="text-xl font-bold mb-6">Order Summary</h3>
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {items.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span>{item.name} x {item.quantity}</span>
                  <span>{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-600 pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (18%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-yellow-400 border-t border-gray-600 pt-4">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
