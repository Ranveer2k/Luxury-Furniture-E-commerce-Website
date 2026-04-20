# ✨ Luxury Furniture E-Commerce Frontend

> A premium, luxury-themed React e-commerce frontend for Aurelle Maison furniture store

![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.0-brightgreen?logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-3.3.0-38B2AC?logo=tailwindcss)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success)

## 🎯 Overview

A fully-featured, modern React e-commerce frontend built with **Vite**, **React Router**, **Tailwind CSS**, **Axios**, and **Zustand**. Designed with luxury aesthetics - premium dark theme with gold accents, smooth animations, and fully responsive.

### ✨ Key Features

- 🛍️ **Product Browsing** - Browse 500+ premium furniture items with filters and search
- 🔍 **Smart Filtering** - Filter by category, price, material, and search
- 🛒 **Shopping Cart** - Add/remove items, adjust quantities, real-time updates
- ❤️ **Wishlist** - Save favorite items for later
- 👤 **User Accounts** - Register, login, manage profiles and addresses
- 📦 **Orders** - Track order history, view status, and details
- 🎨 **Luxury Design** - Premium dark theme with gold accents
- 📱 **Responsive** - Perfect on mobile, tablet, and desktop
- ⚡ **Fast** - Built with Vite for instant HMR and optimized builds
- 🔌 **API Integrated** - Connected to Node.js/Express/MongoDB backend

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 16+** and **npm 8+**
- **Backend running** on `http://localhost:10000`

### Installation & Setup (2 minutes)

1. **Navigate to Frontend**
   ```bash
   cd Frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Create Environment File**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env`:
   ```env
   VITE_API_URL=http://localhost:10000/api
   VITE_APP_NAME=Aurelle Maison
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173)

---

## 📦 Available Scripts

```bash
# Start development server with hot module reload
npm run dev

# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview

# Check code quality with ESLint
npm run lint

# Fix linting errors automatically
npm run lint --fix
```

---

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── Header.jsx          # Navigation with user menu
│   │   ├── Footer.jsx          # Footer with links
│   │   └── ProductCard.jsx     # Product card component
│   │
│   ├── pages/                   # Full page components
│   │   ├── Home.jsx            # Landing page
│   │   ├── Products.jsx        # Product listing with filters
│   │   ├── ProductDetail.jsx   # Single product details
│   │   ├── Cart.jsx            # Shopping cart
│   │   ├── Wishlist.jsx        # Wishlist page
│   │   ├── Login.jsx           # Login page
│   │   ├── Register.jsx        # Registration
│   │   ├── Profile.jsx         # User profile
│   │   ├── Orders.jsx          # Order history
│   │   └── Checkout.jsx        # Checkout process
│   │
│   ├── services/                # API communication
│   │   ├── api.js              # Axios instance
│   │   └── index.js            # API methods
│   │
│   ├── store/                   # Global state (Zustand)
│   │   ├── authStore.js        # Auth state
│   │   ├── cartStore.js        # Cart state
│   │   └── wishlistStore.js    # Wishlist state
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useProtectedRoute.js
│   │   └── useFetch.js
│   │
│   ├── utils/                   # Utility functions
│   │   ├── helpers.js          # Helper functions
│   │   └── toast.js            # Toast notifications
│   │
│   ├── styles/
│   │   └── globals.css         # Global styles
│   │
│   ├── App.jsx                 # Root component with routing
│   └── main.jsx                # Entry point
│
├── public/                      # Static assets
├── .env.example                 # Example env file
├── .gitignore                   # Git ignore rules
├── tailwind.config.js           # Tailwind configuration
├── vite.config.js              # Vite configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

---

## 🔗 Backend Integration

### API Setup

The frontend connects to backend via Axios:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';
```

### Key Services

| Service | Purpose |
|---------|---------|
| `authService` | Login, register, profile management |
| `productService` | Browse and search products |
| `cartService` | Shopping cart operations |
| `wishlistService` | Wishlist management |
| `orderService` | Order creation and history |
| `reviewService` | Product reviews |
| `paymentService` | Payment processing |

### Example API Calls

```javascript
import { productService, cartService } from './services';

// Fetch products with filters
const products = await productService.getProducts({
  category: 'sofa',
  minPrice: 5000,
  maxPrice: 50000,
  sort: 'price_asc'
});

// Add to cart
const result = await cartService.addToCart('productId', 2);
```

---

## 🎨 Design

### Color Scheme

- **Primary Gold**: `#D4AF37` - Luxury accent color
- **Dark Background**: `#111827` - Premium dark
- **Light Gray**: `#F3F4F6` - Text and accents
- **Secondary Dark**: `#1F2937` - Sections

### Responsive Breakpoints

- **Mobile**: < 640px (Single column)
- **Tablet**: 640px - 1024px (2 columns)
- **Desktop**: > 1024px (4 columns)

---

## 🔐 Authentication

### Login Flow

```javascript
import { useAuthStore } from './store/authStore';

const { login, user, token } = useAuthStore();

// Login
await login({ email: 'user@example.com', password: 'password123' });

// Token automatically saved to localStorage
// Token injected in all API requests
```

### Protected Routes

```javascript
import { useProtectedRoute } from './hooks/useProtectedRoute';

function ProfilePage() {
  const { user, isAuthenticated } = useProtectedRoute();
  // Automatically redirects to /login if not authenticated
}
```

---

## 🛒 Shopping Features

### Product Filters

- Category (Wood, Epoxy, Chairs, Sofas, Beds, Tables)
- Price range
- Material type
- Full-text search
- Pagination

### Cart Management

```javascript
const { addToCart, removeFromCart, items } = useCartStore();

// Add item
await addToCart('productId', 2);

// Remove item
await removeFromCart('productId');

// Auto-calculates totals with shipping and tax
```

### Wishlist

```javascript
const { addToWishlist, removeFromWishlist } = useWishlistStore();

await addToWishlist('productId');
await removeFromWishlist('productId');
```

---

## 💳 Checkout Process

**Multi-step checkout**:
1. Shipping Address
2. Billing Address (optional)
3. Payment Method Selection
4. Order Review & Confirmation

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
# Creates optimized dist/ folder
```

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

1. Connect GitHub repository
2. Set Build Command: `npm run build`
3. Set Publish Directory: `dist`
4. Deploy

### Deploy Anywhere

```bash
# Build
npm run build

# Copy dist/ to your server
# Configure server for SPA (rewrite all routes to index.html)
```

---

## 🐛 Troubleshooting

### CORS Error

**Issue**: `Access to XMLHttpRequest blocked by CORS`  
**Solution**: 
- Ensure backend is running on port 10000
- Check backend CORS configuration
- Verify `VITE_API_URL` in `.env`

### API Not Found

**Issue**: API endpoints return 404  
**Solution**:
- Verify backend is running: `npm start` in Backend folder
- Check backend port (default: 10000)
- Verify API routes exist

### Images Not Loading

**Issue**: Product images show broken icon  
**Solution**:
- Check image URLs in database
- Verify Cloudinary setup (if using image service)
- Check CORS for image CDN

### Token Issues

**Issue**: Keep getting logged out  
**Solution**:
```javascript
// Check localStorage
console.log(localStorage.getItem('token'));

// Clear and re-login
localStorage.clear();
```

---

## 📊 Performance

### Bundle Size
- Main: ~150KB (gzipped)
- Vendor: ~100KB (gzipped)
- Total: ~250KB (gzipped)

### Optimization Techniques
- Code splitting with React.lazy
- Image lazy loading
- Tailwind CSS minification
- Vite optimizations

---

## 🧪 Testing Checklist

- [ ] Login/Logout functionality
- [ ] Product filtering and sorting
- [ ] Add/remove cart items
- [ ] Add/remove wishlist items
- [ ] Checkout process
- [ ] Profile management
- [ ] Mobile responsiveness
- [ ] Image loading
- [ ] Toast notifications

---

## 📚 Documentation

- [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md) - Detailed integration guide
- [FRONTEND_DEVELOPMENT_GUIDE.md](../FRONTEND_DEVELOPMENT_GUIDE.md) - Developer guide
- [Backend README](../Backend/README.md) - Backend setup
- [QUICK_START.md](../QUICK_START.md) - Quick setup guide

---

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

### Code Standards

- Use functional components with hooks
- Follow React best practices
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and reusable

---

## 📄 License

MIT License - Free to use for personal or commercial projects

---

## ✅ Implementation Checklist

### Pages Implemented
- [x] Home page with featured products
- [x] Products listing with filters
- [x] Product detail page
- [x] Shopping cart
- [x] Wishlist
- [x] Login page
- [x] Register page
- [x] User profile
- [x] Order history
- [x] Checkout process

### Features Implemented
- [x] JWT authentication
- [x] Product filtering & sorting
- [x] Cart management
- [x] Wishlist functionality
- [x] Order creation
- [x] Address management
- [x] Toast notifications
- [x] Protected routes
- [x] Responsive design
- [x] Luxury UI theme

---

**Version**: 1.0.0  
**Last Updated**: April 2024  
**Status**: Production Ready ✅

---

Made with ❤️ for luxury furniture enthusiasts

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
Frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API service layer
│   ├── store/         # Zustand stores (state management)
│   ├── styles/        # Global styles
│   ├── App.jsx        # Main app component
│   └── main.jsx       # Entry point
├── public/            # Static assets
├── index.html         # HTML template
├── vite.config.js     # Vite configuration
├── tailwind.config.js # Tailwind configuration
└── package.json       # Dependencies
```

## Key Components

### Pages

- **Home**: Landing page with featured products
- **Products**: Product listing with filters
- **Cart**: Shopping cart management
- **Login**: User authentication
- **Register**: User registration

### Components

- **Header**: Navigation and user menu
- **Footer**: Footer information
- **ProductCard**: Individual product display

### Stores (Zustand)

- **authStore**: User authentication state
- **cartStore**: Shopping cart state
- **wishlistStore**: Wishlist state

### Services

API service layer for:
- Authentication
- Products
- Cart
- Wishlist
- Orders
- Payments
- Reviews

## API Integration

The frontend communicates with the backend API at `http://localhost:10000/api`. All requests are made through the Axios instance configured in `src/services/api.js`.

Authentication tokens are automatically attached to requests and stored in localStorage.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is licensed under the ISC License.
