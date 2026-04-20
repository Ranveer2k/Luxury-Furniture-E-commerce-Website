import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Plus, Minus } from 'lucide-react';
import { productService, reviewService } from '../services';
import { useCartStore } from '../store/cartStore';
import { useWishlistStore } from '../store/wishlistStore';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(id);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productService.getProductById(id);
        setProduct(response);

        // Fetch reviews
        const reviewsResponse = await reviewService.getReviews({ productId: id });
        setReviews(reviewsResponse.reviews || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
      alert('Product added to cart!');
    } catch (error) {
      alert('Error adding to cart');
    }
  };

  const handleWishlist = async () => {
    try {
      if (inWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (error) {
      alert('Error updating wishlist');
    }
  };

  if (loading) {
    return (
      <div className="luxury-container py-12 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="luxury-container py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <button
          onClick={() => navigate('/products')}
          className="button-primary"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const averageRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="luxury-container py-12">
      <button
        onClick={() => navigate('/products')}
        className="text-yellow-600 hover:underline mb-8"
      >
        ← Back to Products
      </button>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Product Image */}
        <div>
          <div className="bg-gray-100 rounded-lg overflow-hidden h-96">
            <img
              src={product.image || 'https://via.placeholder.com/500x500?text=Product'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <button
              onClick={handleWishlist}
              className="bg-white rounded-full p-3 hover:bg-yellow-600 hover:text-white transition"
            >
              <Heart
                size={28}
                fill={inWishlist ? 'currentColor' : 'none'}
                color={inWishlist ? 'red' : 'black'}
              />
            </button>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  fill={i < Math.round(averageRating) ? '#D4AF37' : 'none'}
                  color={i < Math.round(averageRating) ? '#D4AF37' : '#ccc'}
                />
              ))}
            </div>
            <span className="text-gray-600">
              {averageRating} ({reviews.length} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-yellow-600">
                ${product.price}
              </span>
              {product.discountPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.discountPrice}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-700 mb-6">{product.description}</p>

          {/* Product Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold capitalize">{product.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Material</p>
              <p className="font-semibold capitalize">{product.material}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Dimensions</p>
              <p className="font-semibold">{product.dimensions || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Stock</p>
              <p className="font-semibold">
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3">Quantity</label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
              >
                <Minus size={20} />
              </button>
              <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="bg-gray-200 hover:bg-gray-300 p-2 rounded"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="button-primary w-full py-4 text-lg flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={24} />
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 pt-16 border-t">
        <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-600">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review._id} className="bg-gray-100 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{review.reviewer}</h3>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < review.rating ? '#D4AF37' : 'none'}
                        color={i < review.rating ? '#D4AF37' : '#ccc'}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-gray-500 text-sm mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
