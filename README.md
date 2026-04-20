# Aurelle Maison - Luxury Furniture E-Commerce Website

A complete, production-ready e-commerce platform for luxury furniture with a modern React frontend and robust Node.js/Express backend.

## 📚 Project Overview

Aurelle Maison is a full-stack e-commerce application featuring:

### Frontend (React + Vite)
- Modern, responsive product browsing interface
- Shopping cart and wishlist management
- User authentication and profile management
- Product filtering, sorting, and search
- Customer reviews and ratings
- Beautiful luxury-themed UI with Tailwind CSS

### Backend (Node.js + Express)
- RESTful API with complete CRUD operations
- MongoDB database integration
- JWT authentication and authorization
- Stripe payment integration
- Admin dashboard functionality
- Rate limiting and security features
- Swagger API documentation

## 🏗️ Project Structure

```
Luxury-Furniture-E-commerce-Website/
├── Frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API integration
│   │   ├── store/              # Zustand state management
│   │   └── styles/             # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── Backend/                     # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/        # Route handlers
│   │   ├── models/             # MongoDB models
│   │   ├── routes/             # API routes
│   │   ├── middlewares/        # Custom middlewares
│   │   ├── services/           # Business logic
│   │   └── config/             # Configuration files
│   ├── package.json
│   └── README.md
│
└── README.md                    # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Luxury-Furniture-E-commerce-Website
```

2. **Install all dependencies**
```bash
npm run install-all
```

Or install separately:
```bash
# Backend
cd Backend && npm install && cd ..

# Frontend
cd Frontend && npm install && cd ..
```

3. **Setup Backend**
```bash
cd Backend
cp .env.example .env
# Edit .env with your configuration
```

4. **Setup Frontend**
```bash
cd Frontend
cp .env.example .env
# Edit .env if needed (default should work)
```

### Running the Application

#### Option 1: Run Both Backend and Frontend (requires concurrently)
```bash
npm install -g concurrently
npm run dev
```

#### Option 2: Run Backend Only
```bash
npm run dev:backend
```

#### Option 3: Run Frontend Only
```bash
npm run dev:frontend
```

#### Option 4: Run Separately in Different Terminals
```bash
# Terminal 1: Backend
cd Backend
npm run dev

# Terminal 2: Frontend
cd Frontend
npm run dev
```

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register     - Register new user
POST   /api/auth/login        - Login user
GET    /api/auth/me           - Get current user
PUT    /api/auth/me           - Update profile
PUT    /api/auth/me/password  - Change password
```

### Products
```
GET    /api/products          - Get all products (with filters)
GET    /api/products/:id      - Get product details
POST   /api/products          - Create product (admin)
PUT    /api/products/:id      - Update product (admin)
DELETE /api/products/:id      - Delete product (admin)
```

### Cart
```
GET    /api/cart              - Get user's cart
POST   /api/cart              - Add to cart
PUT    /api/cart/:itemId      - Update cart item
DELETE /api/cart/:itemId      - Remove from cart
DELETE /api/cart              - Clear cart
```

### Wishlist
```
GET    /api/wishlist          - Get wishlist
POST   /api/wishlist          - Add to wishlist
DELETE /api/wishlist/:itemId  - Remove from wishlist
```

### Orders
```
GET    /api/orders            - Get user's orders
GET    /api/orders/:id        - Get order details
POST   /api/orders            - Create order
PUT    /api/orders/:id        - Update order
PUT    /api/orders/:id/cancel - Cancel order
```

### Reviews
```
GET    /api/reviews           - Get product reviews
POST   /api/reviews           - Create review
PUT    /api/reviews/:id       - Update review
DELETE /api/reviews/:id       - Delete review
```

## 🔑 Key Features

### Frontend Features
- ✅ Product catalog with advanced filtering
- ✅ Shopping cart management
- ✅ Wishlist functionality
- ✅ User registration and login
- ✅ User profile and address management
- ✅ Product reviews and ratings
- ✅ Order tracking
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark/light mode ready

### Backend Features
- ✅ JWT authentication
- ✅ Role-based access control (Admin/Customer)
- ✅ MongoDB integration with Mongoose
- ✅ Payment processing (Stripe/Razorpay)
- ✅ File upload (Cloudinary)
- ✅ Request validation
- ✅ Rate limiting
- ✅ CORS support
- ✅ API documentation (Swagger)
- ✅ Comprehensive error handling
- ✅ Logging system

## 🎯 Technology Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2+ | UI library |
| Vite | 5.0+ | Build tool |
| React Router | 6.20+ | Routing |
| Axios | 1.6+ | HTTP client |
| Zustand | 4.4+ | State management |
| Tailwind CSS | 3.3+ | Styling |
| Lucide React | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 16+ | Runtime |
| Express | 4.18+ | Web framework |
| MongoDB | 5.0+ | Database |
| Mongoose | 7.0+ | ODM |
| JWT | Latest | Authentication |
| Stripe | Latest | Payments |
| Cloudinary | Latest | Image storage |
| Swagger | Latest | API docs |

## 📊 Database Schema

### Collections
- **Users** - User accounts and profiles
- **Products** - Furniture products catalog
- **Orders** - Customer orders
- **Reviews** - Product reviews
- **Cart** - Shopping carts
- **Wishlist** - Saved items
- **Payments** - Payment records

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- CORS protection
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- HTTPS ready
- Secure headers with Helmet
- Environment variable protection

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎨 UI/UX

- Luxury-themed design with gold accents
- Intuitive navigation
- Fast loading with lazy image loading
- Smooth animations and transitions
- Accessibility compliance
- Dark mode support ready

## 🚢 Deployment

### Frontend Deployment
```bash
cd Frontend
npm run build
# Deploy dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3
# - Any static hosting
```

### Backend Deployment
```bash
cd Backend
npm run build
# Deploy to:
# - Heroku
# - AWS EC2
# - DigitalOcean
# - Railway
# - Render
```

## 📚 Documentation

- [Frontend README](./Frontend/README.md) - Frontend specific documentation
- [Backend README](./Backend/README.md) - Backend specific documentation
- [Frontend Setup Guide](./Frontend/SETUP.md) - Detailed frontend setup
- [Backend Setup Guide](./Backend/README.md) - Detailed backend setup
- [API Swagger Docs](http://localhost:10000/api/docs) - Interactive API documentation

## 🔧 Environment Variables

### Backend (.env)
```env
NODE_ENV=development
PORT=10000
MONGODB_URI=mongodb://127.0.0.1:27017/aurelle-maison
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_key
CLOUDINARY_API_KEY=your_cloudinary_key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:10000/api
VITE_APP_NAME=Aurelle Maison
```

## 📈 Performance

- Frontend: Optimized with Vite (~200KB gzipped)
- Backend: Efficient MongoDB queries with indexing
- Images: Optimized through Cloudinary
- Caching strategies implemented
- Lazy loading for routes and images

## 🐛 Troubleshooting

### Backend Issues
- Check MongoDB connection
- Verify environment variables
- Check port 10000 availability

### Frontend Issues
- Check backend is running on port 10000
- Clear browser cache
- Verify VITE_API_URL in .env

### Common Errors
See individual README files for detailed troubleshooting:
- [Frontend Troubleshooting](./Frontend/README.md#troubleshooting)
- [Backend Troubleshooting](./Backend/README.md)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Commit changes: `git commit -m 'Add amazing feature'`
3. Push to branch: `git push origin feature/amazing-feature`
4. Open Pull Request

## 📝 License

ISC License

## 👨‍💻 Author

Ranveer2k

## 📞 Support

For issues and questions:
1. Check the README files in Frontend/ and Backend/
2. Check API documentation at http://localhost:10000/api/docs
3. Review the troubleshooting sections

## 🗺️ Roadmap

- [ ] Admin Dashboard
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] Recommendation engine
- [ ] Social media integration
- [ ] Multiple payment methods
- [ ] Inventory management
- [ ] Barcode scanning
- [ ] Mobile app (React Native)

---

**Last Updated**: April 19, 2026
**Status**: ✅ v1.0.0 Complete and Ready for Development