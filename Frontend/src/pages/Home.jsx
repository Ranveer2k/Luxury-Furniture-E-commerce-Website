import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Truck, Shield, Award, ArrowRight, Sparkles } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Use static data - no API calls
    setFeaturedProducts(products.slice(0, 8));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute inset-0" style={{backgroundImage: 'radial-gradient(circle, #D4AF37 1px, transparent 1px)', backgroundSize: '60px 60px'}}></div>
        </div>

        <div className="relative luxury-container py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles size={16} />
                  Premium Luxury Collection
                </div>
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Aurelle
                  <span className="block text-yellow-500">Maison</span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  Discover unparalleled craftsmanship and timeless elegance.
                  Each piece tells a story of luxury, comfort, and sophistication.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Explore Collection
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10 font-semibold py-4 px-8 rounded-lg transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-96 lg:h-full min-h-96">
              <img
                src="https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=600&h=600&fit=crop"
                alt="Luxury Furniture"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 lg:py-24">
        <div className="luxury-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <Truck className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">On all orders over $500. Fast & reliable delivery worldwide.</p>
            </div>
            <div className="text-center p-8">
              <Shield className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Secure Payment</h3>
              <p className="text-gray-600">100% secure transactions with industry-standard encryption.</p>
            </div>
            <div className="text-center p-8">
              <Award className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handcrafted by master artisans using finest materials.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categories.length > 0 && (
        <section className="bg-gray-50 py-16 lg:py-24">
          <div className="luxury-container">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Browse Categories</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our carefully curated collections of luxury furniture.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all duration-300 flex items-end">
                      <div className="p-6 text-white w-full">
                        <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                        <p className="text-gray-200">{category.description}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-16 lg:py-24">
          <div className="luxury-container">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold mb-4">Featured Collections</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked selections of our finest pieces.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 group"
              >
                View All Products
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16 lg:py-24">
        <div className="luxury-container text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Join Our Newsletter</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to receive exclusive offers, new arrivals, and luxury home inspiration.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
