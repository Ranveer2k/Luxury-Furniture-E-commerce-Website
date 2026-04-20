# 📖 Complete Frontend Development Guide

## API Integration Examples

### Authentication Flow

```javascript
// Login Example
import { useAuthStore } from './store/authStore';

function LoginPage() {
  const { login, isLoading, error } = useAuthStore();
  
  const handleLogin = async (email, password) => {
    try {
      await login({ email, password });
      // Token automatically saved to localStorage
      // Redirect to home page
    } catch (err) {
      console.error('Login failed:', err);
    }
  };
}
```

### Product Fetching with Filters

```javascript
import { productService } from './services';

async function fetchFurniture() {
  try {
    const products = await productService.getProducts({
      category: 'sofa',
      minPrice: 5000,
      maxPrice: 100000,
      sort: 'price_asc',
      page: 1,
      limit: 20
    });
    
    console.log('Products:', products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
  }
}
```

### Shopping Cart Operations

```javascript
import { useCartStore } from './store/cartStore';
import { toast } from './utils/toast';

function ProductDetail() {
  const { addToCart, items } = useCartStore();
  
  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      await addToCart(productId, quantity);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(error.message);
    }
  };
  
  return (
    <button onClick={() => handleAddToCart('prod123', 2)}>
      Add to Cart
    </button>
  );
}
```

### Order Creation

```javascript
import { orderService } from './services';

async function createOrder(cartItems) {
  try {
    const order = await orderService.createOrder({
      items: cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity
      })),
      shippingAddress: {
        street: '123 Luxury Lane',
        city: 'Mumbai',
        state: 'Maharashtra',
        zipCode: '400001'
      },
      paymentMethod: 'card'
    });
    
    console.log('Order created:', order);
  } catch (error) {
    console.error('Order creation failed:', error);
  }
}
```

### Review Management

```javascript
import { reviewService } from './services';

async function createReview(productId) {
  try {
    const review = await reviewService.createReview(productId, {
      rating: 5,
      comment: 'Excellent quality furniture!'
    });
    
    toast.success('Review posted successfully');
  } catch (error) {
    toast.error('Failed to post review');
  }
}
```

---

## Custom Hooks

### useProtectedRoute

Protect pages that require authentication:

```javascript
import { useProtectedRoute } from './hooks/useProtectedRoute';

function ProfilePage() {
  const { user, token, isAuthenticated } = useProtectedRoute();
  
  if (!isAuthenticated) {
    return null; // Will redirect to /login
  }
  
  return (
    <div>
      <h1>Welcome, {user.name}</h1>
    </div>
  );
}
```

### useFetch

Fetch data with loading and error states:

```javascript
import { useFetch } from './hooks/useFetch';
import { productService } from './services';

function ProductsList() {
  const { data, isLoading, error } = useFetch(
    () => productService.getProducts(),
    [] // Dependencies
  );
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <div>
      {data?.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

---

## Styling Guide

### Tailwind CSS Classes Used

```javascript
// Colors
.bg-gray-900       // Dark background
.text-yellow-400   // Gold text
.border-yellow-500 // Gold borders

// Responsive
.md:grid-cols-2    // 2 columns on medium screens
.lg:grid-cols-4    // 4 columns on large screens

// Utilities
.hover:scale-105   // Scale on hover
.transition        // Smooth transitions
.rounded-lg        // Rounded corners
.shadow-lg         // Box shadow
```

### Creating Custom Components

```javascript
// Example: CustomButton Component
function CustomButton({ children, variant = 'primary', onClick }) {
  const baseStyles = 'px-6 py-3 rounded-lg font-semibold transition';
  
  const variants = {
    primary: 'bg-yellow-600 hover:bg-yellow-700 text-white',
    secondary: 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white'
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

---

## Error Handling

### Toast Notifications

```javascript
import { toast } from './utils/toast';

// Success
toast.success('Order placed successfully!');

// Error
toast.error('Failed to add to cart');

// Warning
toast.warning('Low stock available');

// Info
toast.info('New collection available');

// Custom duration (ms)
toast.success('Saved!', 5000);
```

### API Error Handling

```javascript
try {
  await productService.getProducts();
} catch (error) {
  // error.message - Error message from API
  // error.response?.status - HTTP status code
  // error.response?.data - Response data
  
  if (error.response?.status === 404) {
    console.log('Product not found');
  } else if (error.response?.status === 401) {
    console.log('Not authenticated');
  }
}
```

---

## State Management Examples

### Using Auth Store

```javascript
import { useAuthStore } from './store/authStore';

function MyComponent() {
  const { 
    user,          // Current user object
    token,         // JWT token
    isLoading,     // Loading state
    login,         // Login method
    logout,        // Logout method
    register       // Register method
  } = useAuthStore();
  
  // Your component logic
}
```

### Using Cart Store

```javascript
import { useCartStore } from './store/cartStore';

function MyComponent() {
  const {
    items,           // Array of cart items
    total,           // Total price
    addToCart,       // Add item method
    removeFromCart,  // Remove item method
    updateCartItem,  // Update quantity method
    clearCart        // Clear all items
  } = useCartStore();
}
```

### Using Wishlist Store

```javascript
import { useWishlistStore } from './store/wishlistStore';

function MyComponent() {
  const {
    items,              // Array of wishlist items
    addToWishlist,      // Add item method
    removeFromWishlist, // Remove item method
    isInWishlist        // Check if product is wishlisted
  } = useWishlistStore();
}
```

---

## Performance Optimization

### Image Lazy Loading

```javascript
// Use native lazy loading
<img 
  src="image.jpg" 
  loading="lazy"
  alt="Product"
/>

// Or use intersection observer for custom loading
import { useEffect, useRef } from 'react';

function LazyImage({ src, alt }) {
  const imgRef = useRef();
  
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = src;
          observer.unobserve(img);
        }
      });
    });
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
  }, [src]);
  
  return <img ref={imgRef} alt={alt} />;
}
```

### Memoization

```javascript
import { memo } from 'react';

// Prevent unnecessary re-renders
const ProductCard = memo(function ProductCard({ product }) {
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
});
```

---

## Debugging Tips

### Enable Redux DevTools (for Zustand)
```javascript
// Install: npm install zustand-devtools-extension
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export const useAuthStore = create(
  devtools(
    (set) => ({
      // Store definition
    })
  )
);
```

### Console Logging Store State
```javascript
const authStore = useAuthStore();
console.log('Auth State:', authStore);
```

### Check API Response
Open DevTools → Network tab:
1. Filter by API calls
2. Click on request to see Request/Response
3. Check headers for Authorization token

### Check LocalStorage
Open DevTools → Application → Local Storage:
1. Look for `token` key
2. Look for `user` key (stringified JSON)

---

## Testing Checklist

- [ ] Login/Logout works
- [ ] Products load correctly
- [ ] Filters and sorting work
- [ ] Add to cart updates counter
- [ ] Cart calculations are correct
- [ ] Wishlist items persist
- [ ] Checkout flow completes
- [ ] Images load properly
- [ ] Mobile responsive on all pages
- [ ] No console errors

---

## Deployment Checklist

Before deploying to production:

- [ ] Update API URL in `.env` (production backend)
- [ ] Build project: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Remove console.log statements
- [ ] Add analytics tracking
- [ ] Set up error logging
- [ ] Configure CDN for images
- [ ] Enable caching headers
- [ ] Test with production database
- [ ] Set up SSL certificate

---

## Environment Variables for Different Environments

### Development (.env.development)
```env
VITE_API_URL=http://localhost:10000/api
VITE_DEBUG=true
```

### Production (.env.production)
```env
VITE_API_URL=https://api.aurellemmaison.com/api
VITE_DEBUG=false
```

### Using Environment Files
```bash
# Run with specific env file
npm run dev --mode development
npm run build --mode production
```

---

## Useful Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting errors
npm run lint --fix

# Clean node_modules
rm -rf node_modules && npm install

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

---

## Folder Structure Best Practices

```
Frontend/
├── src/
│   ├── components/      # Reusable UI components (Button, Card, etc.)
│   ├── pages/          # Full page components (Home, Products, etc.)
│   ├── services/       # API communication layer
│   ├── store/          # Global state management
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions and utilities
│   ├── styles/         # Global styles
│   ├── assets/         # Images, fonts, static files (if needed)
│   ├── App.jsx         # Root component with routing
│   └── main.jsx        # Entry point
```

---

## Performance Metrics

Track these metrics to ensure good performance:

- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Time to Interactive (TTI):** < 3.8s
- **Bundle Size:** < 200KB gzipped
- **API Response Time:** < 500ms

Monitor with Lighthouse:
1. Open DevTools → Lighthouse
2. Generate report
3. Fix issues in Performance, Accessibility, Best Practices

---

## Security Best Practices

- ✅ Store JWT tokens in httpOnly cookies (if backend supports)
- ✅ Always use HTTPS in production
- ✅ Validate user input on frontend and backend
- ✅ Never store sensitive data in localStorage
- ✅ Use environment variables for API keys
- ✅ Implement CSRF protection (if needed)
- ✅ Keep dependencies updated
- ✅ Use Content Security Policy (CSP) headers

---

**Last Updated:** April 2024
**Version:** 1.0.0
