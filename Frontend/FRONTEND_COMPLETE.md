# Luxury Furniture E-Commerce Website - Complete Frontend

## 📋 Overview

A complete React-based frontend for the Aurelle Maison luxury furniture e-commerce store. Built with modern technologies including Vite, React 18, Zustand, and Tailwind CSS.

## 🎯 Features Implemented

### ✅ Core Features
- [x] Product listing with filtering and sorting
- [x] Shopping cart management
- [x] Wishlist functionality
- [x] User authentication (login/register)
- [x] Product detail pages
- [x] Customer reviews system
- [x] Responsive design

### ✅ Pages Created
- [x] Home page with featured products
- [x] Products catalog with filters
- [x] Product detail page
- [x] Shopping cart
- [x] Wishlist
- [x] Login page
- [x] Register page
- [x] Header with navigation
- [x] Footer

### ✅ State Management
- [x] Authentication store (Zustand)
- [x] Cart store (Zustand)
- [x] Wishlist store (Zustand)

### ✅ API Integration
- [x] API service layer with Axios
- [x] Automatic token injection in requests
- [x] Error handling and response interceptors
- [x] All backend endpoints integrated

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── components/
│   │   ├── Header.jsx           # Navigation & user menu
│   │   ├── Footer.jsx           # Footer component
│   │   └── ProductCard.jsx      # Reusable product card
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Products.jsx         # Product listing
│   │   ├── ProductDetail.jsx    # Single product view
│   │   ├── Cart.jsx             # Shopping cart
│   │   ├── Wishlist.jsx         # Wishlist page
│   │   ├── Login.jsx            # Login page
│   │   └── Register.jsx         # Registration page
│   ├── services/
│   │   ├── api.js               # Axios instance
│   │   └── index.js             # API methods
│   ├── store/
│   │   ├── authStore.js         # Auth state
│   │   ├── cartStore.js         # Cart state
│   │   └── wishlistStore.js     # Wishlist state
│   ├── styles/
│   │   └── globals.css          # Global styles
│   ├── App.jsx                  # Main app component
│   └── main.jsx                 # Entry point
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind config
├── postcss.config.js           # PostCSS config
├── package.json                # Dependencies
├── .env                        # Environment variables
├── .env.example               # Example env file
├── .gitignore                 # Git ignore rules
├── README.md                  # Documentation
└── SETUP.md                   # Setup guide
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Backend running on http://localhost:10000

### Installation

```bash
# 1. Navigate to Frontend directory
cd Frontend

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example)
cp .env.example .env

# 4. Start development server
npm run dev
```

Frontend will be available at http://localhost:5173

## 🔌 API Integration

The frontend integrates with all backend endpoints:

**Authentication**
- Register new users
- Login with email/password
- Fetch user profile
- Update profile and password
- Manage addresses

**Products**
- Browse products with filters
- View product details
- Filter by category, material, price
- Sort by newest, price, rating

**Shopping Cart**
- Add/remove items
- Update quantities
- View cart total
- Proceed to checkout

**Wishlist**
- Add items to wishlist
- Remove from wishlist
- Move to cart from wishlist

**Reviews**
- View product reviews
- See ratings and comments
- Submit new reviews

## 🎨 UI/UX Features

- **Luxury Design**: Gold and dark color scheme matching the brand
- **Responsive**: Works on mobile, tablet, and desktop
- **Fast Loading**: Optimized images and code splitting
- **Smooth Interactions**: Loading states and error handling
- **Accessible**: Semantic HTML and ARIA labels

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| React 18 | UI library |
| Vite 5 | Build tool & dev server |
| React Router 6 | Client-side routing |
| Axios | HTTP client |
| Zustand | State management |
| Tailwind CSS 3 | Styling |
| Lucide React | Icons |

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start dev server

# Production
npm run build            # Build for production
npm run preview          # Preview production build

# Code quality
npm run lint             # Run ESLint
```

## 🔐 Authentication Flow

1. User registers/logs in
2. Token stored in localStorage
3. Token automatically added to API requests
4. On 401 response, user redirected to login
5. User data stored in auth store

## 🛒 Shopping Flow

1. Browse products on Home or Products page
2. View product details
3. Add to cart or wishlist
4. View cart and adjust quantities
5. Proceed to checkout (checkout page to be implemented)

## 🎯 State Management Pattern

Using Zustand for lightweight, scalable state:

```javascript
// Example: Using cart store
const { items, addToCart, removeFromCart } = useCartStore();

// Actions are async and handle API calls
await addToCart(productId, quantity);
```

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

Using Tailwind's `md:` breakpoints for responsive design

## 🚢 Deployment

### Build for Production
```bash
npm run build
```

### Serve with Node/Express
```bash
npm install -g serve
serve -s dist -l 5173
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🐛 Troubleshooting

### Port 5173 Already in Use
```bash
npm run dev -- --port 3000
```

### CORS Errors
- Check backend CORS configuration
- Ensure backend is running
- Check VITE_API_URL in .env

### Auth Token Not Persisting
- Check browser localStorage
- Clear cache and cookies
- Verify backend token response format

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Axios Documentation](https://axios-http.com/)

## 🎓 Learning Path

1. ✅ Basic React components created
2. ✅ Routing setup with React Router
3. ✅ State management with Zustand
4. ✅ API integration with Axios
5. ⏭️ Advanced features (checkout, admin panel, etc.)

## 📋 Next Steps / To-Do

- [ ] Checkout page implementation
- [ ] Payment integration (Stripe/Razorpay)
- [ ] User profile page
- [ ] Order history page
- [ ] Admin dashboard
- [ ] Product search
- [ ] Email notifications
- [ ] Unit tests
- [ ] E2E tests
- [ ] Performance optimization
- [ ] SEO optimization
- [ ] Analytics integration

## 👥 Team

- Frontend: React/Vite developer
- Backend: Node.js/Express developer

## 📄 License

ISC License

## 🤝 Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

**Last Updated**: April 19, 2026
**Status**: ✅ Complete - Ready for Development
