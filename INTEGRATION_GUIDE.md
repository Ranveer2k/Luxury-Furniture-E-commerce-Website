# 🚀 Luxury Furniture E-Commerce Frontend - Complete Setup & Integration Guide

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Installation & Setup](#installation--setup)
4. [Environment Configuration](#environment-configuration)
5. [Backend Integration](#backend-integration)
6. [Project Structure](#project-structure)
7. [Features & Implementation](#features--implementation)
8. [API Endpoints Reference](#api-endpoints-reference)
9. [Running the Application](#running-the-application)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**Aurelle Maison** is a premium luxury furniture e-commerce platform built with:

### Frontend Stack
- **React 18** - UI framework
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Zustand** - State management
- **Lucide Icons** - Icon library

### Design Features
- Modern luxury UI with gold & black theme
- Smooth animations and transitions
- Fully responsive design (mobile, tablet, desktop)
- High-performance image loading
- Product gallery with zoom
- Real-time cart updates

---

## ✅ Prerequisites

Before starting, ensure you have:

1. **Node.js 16+** and **npm** installed
   ```bash
   node --version  # Should be v16.0.0 or higher
   npm --version   # Should be v8.0.0 or higher
   ```

2. **Backend running** on `http://localhost:10000`
   - See [Backend README](../Backend/README.md) for setup instructions
   - MongoDB must be configured
   - All API endpoints must be accessible

3. **Git** (optional, for version control)

---

## 📦 Installation & Setup

### Step 1: Navigate to Frontend Directory
```bash
cd Frontend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install all required packages:
- React & React-DOM
- React Router DOM
- Axios for API calls
- Tailwind CSS & PostCSS
- Zustand for state management
- Lucide React for icons

### Step 3: Create Environment File
```bash
cp .env.example .env
```

---

## 🔧 Environment Configuration

### .env File Setup

Edit `/Frontend/.env` with your configuration:

```env
# API Configuration
VITE_API_URL=http://localhost:10000/api

# App Configuration
VITE_APP_NAME=Aurelle Maison

# Payment Gateway Keys (Optional - for future integration)
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
VITE_RAZORPAY_KEY=your_razorpay_key_here
```

### Environment Variables Explanation

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:10000/api` |
| `VITE_APP_NAME` | Application name | `Aurelle Maison` |
| `VITE_STRIPE_PUBLIC_KEY` | Stripe public key for payments | Empty |
| `VITE_RAZORPAY_KEY` | Razorpay key for Indian payments | Empty |

**Note:** Vite uses `VITE_` prefix for environment variables that are exposed to the browser.

---

## 🔗 Backend Integration

### API Communication Flow

```
React Component
    ↓
Service Layer (src/services/index.js)
    ↓
Axios Instance with Interceptors (src/services/api.js)
    ↓
Backend API (http://localhost:10000/api)
```

### Key Integration Points

#### 1. **Authentication**
Location: `src/store/authStore.js` & `src/services/index.js`

```javascript
// Login
const { login } = useAuthStore();
await login({ email: 'user@example.com', password: 'password123' });

// Automatic token injection in all requests
// Token stored in localStorage as 'token'
// User data stored as 'user'
```

#### 2. **Product Fetching**
Location: `src/services/index.js` → `productService`

```javascript
// Get all products with filters
productService.getProducts({
  category: 'chair',
  minPrice: 1000,
  maxPrice: 50000,
  sort: 'price_asc',
  page: 1,
  limit: 20
});

// Get single product
productService.getProductById('productId');

// Search products
productService.searchProducts('query', { category: 'sofa' });
```

#### 3. **Cart Management**
Location: `src/store/cartStore.js`

```javascript
const { addToCart, removeFromCart, updateCartItem } = useCartStore();

// Add item to cart
await addToCart('productId', 2); // 2 quantity

// Remove from cart
await removeFromCart('productId');

// Update quantity
await updateCartItem('productId', 5);
```

#### 4. **Wishlist**
Location: `src/store/wishlistStore.js`

```javascript
const { addToWishlist, removeFromWishlist } = useWishlistStore();

// Add to wishlist
await addToWishlist('productId');

// Remove from wishlist
await removeFromWishlist('productId');
```

#### 5. **Order Management**
Location: `src/services/index.js` → `orderService`

```javascript
// Create order
await orderService.createOrder({
  items: [{ productId: 'id1', quantity: 2 }],
  shippingAddress: { street: '...', city: '...' },
  paymentMethod: 'card'
});

// Get user's orders
await orderService.getOrders({ status: 'delivered' });

// Get single order
await orderService.getOrderById('orderId');
```

---

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── Header.jsx        # Navigation & user menu
│   │   ├── Footer.jsx        # Footer component
│   │   └── ProductCard.jsx   # Product card component
│   │
│   ├── pages/                # Page components
│   │   ├── Home.jsx          # Landing page
│   │   ├── Products.jsx      # Product listing with filters
│   │   ├── ProductDetail.jsx # Single product view
│   │   ├── Cart.jsx          # Shopping cart
│   │   ├── Wishlist.jsx      # Wishlist page
│   │   ├── Login.jsx         # Authentication
│   │   ├── Register.jsx      # User registration
│   │   ├── Profile.jsx       # User profile & addresses
│   │   ├── Orders.jsx        # Order history
│   │   └── Checkout.jsx      # Checkout process
│   │
│   ├── services/             # API communication
│   │   ├── api.js            # Axios instance with interceptors
│   │   └── index.js          # API service methods
│   │
│   ├── store/                # State management (Zustand)
│   │   ├── authStore.js      # Authentication state
│   │   ├── cartStore.js      # Shopping cart state
│   │   └── wishlistStore.js  # Wishlist state
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useProtectedRoute.js   # Protected route hook
│   │   └── useFetch.js            # Data fetching hook
│   │
│   ├── utils/                # Utility functions
│   │   ├── helpers.js        # Helper functions
│   │   └── toast.js          # Toast notifications
│   │
│   ├── styles/               # Global styles
│   │   └── globals.css       # Global CSS
│   │
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
│
├── public/                   # Static assets
├── index.html                # HTML template
├── vite.config.js            # Vite configuration
├── tailwind.config.js        # Tailwind configuration
├── postcss.config.js         # PostCSS configuration
├── package.json              # Dependencies
├── .env                      # Environment variables (not tracked)
├── .env.example              # Example environment file
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

---

## ✨ Features & Implementation

### 1. **Product Listing & Filtering** 
**File:** `src/pages/Products.jsx`

Features:
- Grid layout (4 columns on desktop, responsive)
- Filter by category, price range, material
- Sort by price, newest, popularity, rating
- Pagination support
- Search functionality
- Product count display

```javascript
// Example filter usage
const [filters, setFilters] = useState({
  category: 'sofa',
  minPrice: 5000,
  maxPrice: 50000,
  sort: 'price_asc',
  page: 1
});

const products = await productService.getProducts(filters);
```

### 2. **Product Detail Page**
**File:** `src/pages/ProductDetail.jsx`

Features:
- Image gallery with zoom
- Product specifications
- Price with discount percentage
- Customer reviews & ratings
- Add to cart/wishlist buttons
- Quantity selector
- Related products

### 3. **Shopping Cart**
**File:** `src/pages/Cart.jsx` & `src/store/cartStore.js`

Features:
- View all cart items
- Quantity adjustment
- Remove items
- Subtotal, tax, shipping calculation
- Discount code application (if backend supports)
- Proceed to checkout
- Save for later (move to wishlist)

### 4. **Wishlist**
**File:** `src/pages/Wishlist.jsx` & `src/store/wishlistStore.js`

Features:
- View saved items
- Add/remove from wishlist
- Move to cart
- Share wishlist (future feature)

### 5. **User Authentication**
**File:** `src/pages/Login.jsx`, `src/pages/Register.jsx`, `src/store/authStore.js`

Features:
- Email/password login
- User registration
- JWT token management
- Automatic token injection in API calls
- Protected routes
- Auto-logout on token expiry
- Remember me option

### 6. **User Profile**
**File:** `src/pages/Profile.jsx`

Features:
- Edit profile information
- Manage addresses
- Change password
- View account details

### 7. **Order Management**
**File:** `src/pages/Orders.jsx` & `src/pages/Checkout.jsx`

Features:
- Multi-step checkout process
- Shipping address entry
- Billing address (different from shipping)
- Payment method selection
- Order summary
- Order history view
- Order status tracking

---

## 📡 API Endpoints Reference

### Authentication Endpoints
```javascript
// Register
POST /auth/register
{ email, password, name, phone }

// Login  
POST /auth/login
{ email, password }
Response: { token, user }

// Get Profile
GET /auth/me
Headers: { Authorization: "Bearer token" }

// Update Profile
PUT /auth/me
{ name, email, phone }

// Add Address
POST /auth/me/addresses
{ street, city, state, zipCode, isDefault }

// Update Address
PUT /auth/me/addresses/:addressId
{ street, city, state, zipCode }

// Delete Address
DELETE /auth/me/addresses/:addressId
```

### Product Endpoints
```javascript
// Get Products
GET /products?category=sofa&minPrice=5000&maxPrice=50000&sort=price_asc&page=1&limit=20

// Get Single Product
GET /products/:id

// Get Categories
GET /products/categories

// Search Products
GET /products/search?q=luxury+sofa&category=sofa
```

### Cart Endpoints
```javascript
// Get Cart
GET /cart

// Add to Cart
POST /cart
{ productId, quantity }

// Update Cart Item
PUT /cart/:productId
{ quantity }

// Remove from Cart
DELETE /cart/:productId

// Clear Cart
DELETE /cart
```

### Wishlist Endpoints
```javascript
// Get Wishlist
GET /wishlist

// Add to Wishlist
POST /wishlist
{ productId }

// Remove from Wishlist
DELETE /wishlist/:productId
```

### Order Endpoints
```javascript
// Create Order
POST /orders
{ items: [{ productId, quantity }], shippingAddress, paymentMethod }

// Get Orders
GET /orders?status=delivered&page=1

// Get Single Order
GET /orders/:id

// Cancel Order
POST /orders/:id/cancel
```

### Review Endpoints
```javascript
// Get Product Reviews
GET /reviews/product/:productId?page=1

// Create Review
POST /reviews/product/:productId
{ rating, comment }

// Update Review
PUT /reviews/:reviewId
{ rating, comment }

// Delete Review
DELETE /reviews/:reviewId
```

---

## 🚀 Running the Application

### Development Mode
```bash
# From Frontend directory
npm run dev
```

The application will start on `http://localhost:5173`

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting
```bash
# Check for linting errors
npm run lint

# Fix linting errors automatically
npm run lint --fix
```

---

## 🐛 Troubleshooting

### Issue: CORS Error

**Problem:** `Access to XMLHttpRequest at 'http://localhost:10000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:**
1. Ensure backend is running on correct port
2. Check backend CORS configuration in `Backend/src/app.js`
3. Verify `VITE_API_URL` in `.env` matches backend URL

```javascript
// Backend should have CORS enabled
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

### Issue: API Not Found (404)

**Problem:** `GET http://localhost:10000/api/products 404 (Not Found)`

**Solution:**
1. Verify backend is running: `npm start` in Backend directory
2. Check if backend is on correct port (default: 10000)
3. Verify API routes exist in `Backend/src/routes/`

### Issue: Authentication Token Issues

**Problem:** Logged out unexpectedly or token not persisting

**Solution:**
1. Check browser localStorage: Open DevTools → Application → Local Storage
2. Verify token is being saved: `localStorage.getItem('token')`
3. Check token expiration in backend
4. Clear localStorage and login again

```javascript
// Manually check auth state
const authState = useAuthStore();
console.log('User:', authState.user);
console.log('Token:', authState.token);
```

### Issue: Images Not Loading

**Problem:** Product images show broken image icon

**Solution:**
1. Check image URLs in backend database
2. Verify Cloudinary configuration if using image service
3. Check CORS headers for image CDN
4. Inspect Network tab in DevTools

### Issue: Cart/Wishlist Not Persisting

**Problem:** Cart items disappear on page refresh

**Solution:**
1. Ensure localStorage is enabled in browser
2. Check if API calls are succeeding (Network tab)
3. Verify user is authenticated
4. Clear browser cache and try again

```bash
# Clear browser storage
localStorage.clear()
sessionStorage.clear()
```

### Issue: Slow Performance

**Problem:** Application feels sluggish

**Solution:**
1. Enable browser caching in Network tab
2. Check bundle size: `npm run build` shows analysis
3. Lazy load images using IntersectionObserver
4. Use React DevTools Profiler to identify slow components
5. Optimize API calls with pagination

---

## 📚 Additional Resources

### Documentation Files
- [FRONTEND_COMPLETE.md](./FRONTEND_COMPLETE.md) - Feature checklist
- [SETUP.md](./SETUP.md) - Initial setup guide
- [Backend README](../Backend/README.md) - Backend documentation

### Useful Links
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [Axios](https://axios-http.com)

### API Testing
Use **Postman** or **Insomnia** to test API endpoints:
1. Import the API collection
2. Set base URL to `http://localhost:10000/api`
3. Test each endpoint with required parameters

---

## 🤝 Support & Contribution

For issues or feature requests, please create an issue in the repository.

---

**Last Updated:** April 2024
**Version:** 1.0.0
**Status:** Production Ready ✅
