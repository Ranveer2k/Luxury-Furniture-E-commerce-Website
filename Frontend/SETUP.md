# Frontend Setup Guide

## Quick Start

### Step 1: Install Dependencies

```bash
cd Frontend
npm install
```

### Step 2: Start Development Server

Make sure the backend is running on port 10000, then:

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Overview

This is a modern React frontend for the Aurelle Maison luxury furniture e-commerce store. It's built with Vite for fast development and Tailwind CSS for styling.

### Key Features

1. **Product Browsing**
   - View all products with images and descriptions
   - Filter by category, material, and price range
   - Search functionality
   - Sorting options

2. **Shopping Cart**
   - Add/remove products
   - Update quantities
   - View order summary
   - Checkout integration

3. **Wishlist**
   - Save favorite products
   - Move items to cart
   - Manage wishlist items

4. **User Authentication**
   - User registration
   - Login/logout
   - Profile management
   - Address management

5. **Product Details**
   - Detailed product information
   - Customer reviews and ratings
   - Related products

## Architecture

### Frontend Structure

```
src/
├── components/       # Reusable UI components
│   ├── Header.jsx
│   ├── Footer.jsx
│   └── ProductCard.jsx
├── pages/           # Full page components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Wishlist.jsx
│   ├── Login.jsx
│   └── Register.jsx
├── services/        # API calls
│   ├── api.js       # Axios instance
│   └── index.js     # API service methods
├── store/          # Zustand state management
│   ├── authStore.js
│   ├── cartStore.js
│   └── wishlistStore.js
├── styles/         # Global styles
│   └── globals.css
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

### Component Hierarchy

```
App
├── Header (Navigation, Cart, User Menu)
├── Main Routes
│   ├── Home (Featured Products, Categories)
│   ├── Products (Filtering, Sorting)
│   ├── ProductDetail (Reviews, Add to Cart)
│   ├── Cart (Order Summary, Checkout)
│   ├── Wishlist (Saved Items)
│   ├── Login (Authentication)
│   └── Register (Registration)
└── Footer (Links, Contact)
```

## API Integration

The frontend communicates with the backend at `http://localhost:10000/api`.

### Available API Endpoints Used

```
Authentication
POST   /auth/register
POST   /auth/login
GET    /auth/me
PUT    /auth/me
PUT    /auth/me/password
POST   /auth/me/addresses
PUT    /auth/me/addresses/:id
DELETE /auth/me/addresses/:id

Products
GET    /products
GET    /products/:id
POST   /products (admin)
PUT    /products/:id (admin)
DELETE /products/:id (admin)

Cart
GET    /cart
POST   /cart
PUT    /cart/:itemId
DELETE /cart/:itemId
DELETE /cart

Wishlist
GET    /wishlist
POST   /wishlist
DELETE /wishlist/:itemId

Reviews
GET    /reviews
POST   /reviews
PUT    /reviews/:id
DELETE /reviews/:id

Orders
GET    /orders
GET    /orders/:id
POST   /orders
PUT    /orders/:id

Payments
POST   /payments/create-intent
POST   /payments/confirm
```

## State Management (Zustand)

### Auth Store
- `user` - Current user object
- `token` - Authentication token
- `login()` - Login user
- `register()` - Register user
- `logout()` - Logout user
- `isAuthenticated()` - Check if user is logged in

### Cart Store
- `items` - Cart items array
- `total` - Cart total
- `addToCart()` - Add product to cart
- `removeFromCart()` - Remove from cart
- `updateCartItem()` - Update quantity
- `getCartTotal()` - Calculate total

### Wishlist Store
- `items` - Wishlist items array
- `addToWishlist()` - Add to wishlist
- `removeFromWishlist()` - Remove from wishlist
- `isInWishlist()` - Check if item is in wishlist

## Styling

The project uses Tailwind CSS for styling. Key custom styles are defined in `src/styles/globals.css`:

- `.luxury-container` - Main container with max-width
- `.button-primary` - Primary action buttons
- `.button-secondary` - Secondary action buttons
- `.product-card` - Product card styling
- `.gold-text` - Gold/luxury accent color
- `.dark-bg` - Dark background

## Development Workflow

### Adding a New Page

1. Create a new component in `src/pages/`
2. Add the route in `src/App.jsx`
3. Link to it from navigation or other pages

### Adding a New Component

1. Create a new file in `src/components/`
2. Import and use in your pages
3. Keep components focused and reusable

### Adding API Calls

1. Add method to `src/services/index.js`
2. Use it in components with try/catch
3. Update relevant store if needed

## Environment Variables

Create a `.env` file in the Frontend directory:

```env
VITE_API_URL=http://localhost:10000/api
VITE_APP_NAME=Aurelle Maison
```

## Build and Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Testing API Endpoints

You can test the API using:
- Postman (https://www.postman.com/)
- Thunder Client (VS Code extension)
- cURL commands
- The Swagger UI at http://localhost:10000/api/docs

## Troubleshooting

### Port 5173 Already in Use

```bash
# Use a different port
npm run dev -- --port 3000
```

### API Connection Issues

1. Check if backend is running on port 10000
2. Check VITE_API_URL in `.env`
3. Check browser console for CORS errors
4. Verify backend CORS settings

### Authentication Issues

1. Clear localStorage in browser
2. Check if token is being stored correctly
3. Verify backend authentication endpoints

## Performance Optimization

- Images are lazy-loaded
- Code splitting with React Router
- Tailwind CSS purges unused styles
- Zustand for lightweight state management

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Next Steps

1. ✅ Frontend setup complete
2. Install dependencies: `npm install`
3. Start development: `npm run dev`
4. Build for production: `npm run build`
5. Add more pages and features as needed

## Additional Pages to Implement

- Profile page (`/profile`)
- Checkout page (`/checkout`)
- Order confirmation (`/order/:id`)
- Admin dashboard (`/admin`)
- About page (`/about`)
- Contact page (`/contact`)

## Support

For backend issues, refer to `Backend/README.md`
For general questions, check the main project README.md
