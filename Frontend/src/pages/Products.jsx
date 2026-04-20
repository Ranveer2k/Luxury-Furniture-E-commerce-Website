import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { productService } from '../services';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    material: searchParams.get('material') || '',
    search: searchParams.get('search') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page')) || 1,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getProducts({
          ...filters,
          limit: 12,
        });
        setProducts(response.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);

    const params = new URLSearchParams();
    Object.keys(newFilters).forEach((k) => {
      if (newFilters[k] && newFilters[k] !== '') {
        params.set(k, newFilters[k]);
      }
    });
    setSearchParams(params);
  };

  return (
    <div className="luxury-container py-12">
      <h1 className="text-4xl font-bold mb-8">Shop Products</h1>

      <div className="grid grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="col-span-1 bg-gray-100 p-6 rounded-lg h-fit">
          <h3 className="text-lg font-bold mb-4">Filters</h3>

          {/* Category Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">All Categories</option>
              <option value="wood">Wood</option>
              <option value="epoxy">Epoxy</option>
              <option value="luxury">Luxury</option>
              <option value="office">Office</option>
            </select>
          </div>

          {/* Material Filter */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Material</label>
            <input
              type="text"
              value={filters.material}
              onChange={(e) => handleFilterChange('material', e.target.value)}
              placeholder="Search material"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Price Range</label>
            <input
              type="number"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="w-full border rounded px-3 py-2 mb-2"
            />
            <input
              type="number"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {/* Sort */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-2">Sort By</label>
            <select
              value={filters.sort}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="newest">Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="col-span-3">
          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full border rounded px-4 py-2"
            />
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              Error loading products: {error}
            </div>
          )}

          {!loading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products found</p>
            </div>
          )}

          {!loading && !error && (
            <div className="grid md:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
