# Luxury Furniture E-commerce Backend

A scalable Node.js backend for a luxury furniture e-commerce platform with advanced product image management using Cloudinary, Unsplash, and Pexels APIs.

## Features

- 🏗️ **Scalable Architecture**: Node.js + Express.js with MongoDB
- 🖼️ **Advanced Image Management**: 50+ high-quality images per product category
- ☁️ **Cloud Storage**: Cloudinary integration for optimized image storage
- 🔍 **Smart Image Fetching**: Unsplash & Pexels API integration
- 🔐 **Authentication**: JWT-based authentication with role-based access
- 📊 **Advanced Filtering**: Category, material, price, and text search
- 🏷️ **AI Tagging**: Automatic image tagging using Cloudinary AI
- 📱 **RESTful API**: Complete CRUD operations with pagination
- 📚 **API Documentation**: Swagger UI documentation
- 🧪 **Seeder Script**: Automated database seeding with real images

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Image Storage**: Cloudinary
- **Image Sources**: Unsplash API, Pexels API
- **Authentication**: JWT
- **Validation**: Express Validator
- **Documentation**: Swagger UI
- **Logging**: Winston

## Prerequisites

- Node.js (v18+)
- MongoDB
- API Keys for:
  - Cloudinary (required)
  - Unsplash API (recommended)
  - Pexels API (alternative to Unsplash)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxury-furniture-e-commerce/Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your API keys:

   ```env
   # Required
   MONGODB_URI=mongodb://localhost:27017/luxury-furniture
   JWT_SECRET=your-super-secret-jwt-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

   # Optional (for image fetching)
   UNSPLASH_ACCESS_KEY=your-unsplash-key
   PEXELS_API_KEY=your-pexels-key
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Database Seeding
Populate the database with luxury furniture products and 50+ images per category:
```bash
npm run seed
```

## API Endpoints

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get products with filters & pagination |
| GET | `/api/products/search` | Advanced search |
| GET | `/api/products/categories` | Get categories with statistics |
| GET | `/api/products/category/:category` | Get products by category |
| GET | `/api/products/recommendations` | Get product recommendations |
| GET | `/api/products/:id` | Get single product |
| POST | `/api/products` | Create product (Admin) |
| PUT | `/api/products/:id` | Update product (Admin) |
| DELETE | `/api/products/:id` | Delete product (Admin) |

### Image Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products/:id/images` | Add images to product (Admin) |
| DELETE | `/api/products/:id/images/:imageId` | Remove image (Admin) |
| PATCH | `/api/products/:id/images/:imageId/primary` | Set primary image (Admin) |

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/login` | User login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |

## Product Categories

- `wood-furniture` - Traditional wooden furniture
- `epoxy-furniture` - Modern epoxy resin furniture
- `chairs` - Various chair types
- `beds` - Bedroom furniture
- `sofas` - Living room seating
- `tables` - Dining and side tables
- `doors` - Wooden doors
- `epoxy-art-products` - Epoxy resin art pieces

## Materials

- `teak`, `oak`, `walnut`, `mahogany`
- `epoxy-resin`, `pine`, `bamboo`
- `metal`, `leather`

## API Examples

### Get Products with Filters
```bash
GET /api/products?category=wood-furniture&material=teak&minPrice=10000&maxPrice=50000&sort=popularity&page=1&limit=12
```

### Search Products
```bash
GET /api/products/search?q=luxury%20sofa&category=sofas&sort=rating
```

### Get Categories
```bash
GET /api/products/categories
```

Response:
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category": "wood-furniture",
        "count": 45,
        "totalImages": 2250,
        "avgPrice": 28500,
        "avgRating": 4.2
      }
    ]
  }
}
```

### Create Product (Admin)
```bash
POST /api/products
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "name": "Luxury Teak Dining Table",
  "description": "Handcrafted teak dining table with epoxy resin inlays",
  "price": 45000,
  "category": "wood-furniture",
  "material": "teak",
  "images": [
    {
      "url": "https://cloudinary-url/image1.jpg",
      "publicId": "luxury-furniture/wood-furniture/image1",
      "alt": "Luxury teak dining table",
      "isPrimary": true,
      "tags": ["teak", "dining", "luxury"]
    }
  ],
  "stockQuantity": 5,
  "dimensions": {
    "length": 200,
    "width": 100,
    "height": 75
  },
  "weight": {
    "value": 45,
    "unit": "kg"
  }
}
```

## Image Management

### Automatic Image Fetching
The seeder script automatically fetches 50+ high-quality images per category:

1. Uses multiple search queries per category
2. Fetches from Unsplash and Pexels APIs
3. Uploads to Cloudinary with optimization
4. Creates products with image galleries

### Manual Image Management
Admins can add/remove images via API:

```bash
# Add images
POST /api/products/:id/images
{
  "imageUrls": ["https://example.com/image1.jpg"],
  "tags": ["luxury", "modern"]
}

# Set primary image
PATCH /api/products/:id/images/:imageId/primary

# Remove image
DELETE /api/products/:id/images/:imageId?deleteFromCloudinary=true
```

## Database Schema

### Product Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  discountPrice: Number,
  category: String (enum),
  material: String (enum),
  images: [{
    url: String,
    publicId: String,
    alt: String,
    isPrimary: Boolean,
    tags: [String]
  }],
  thumbnail: {
    url: String,
    publicId: String
  },
  stockQuantity: Number,
  ratingsAverage: Number,
  ratingsCount: Number,
  popularityScore: Number,
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: String
  },
  weight: {
    value: Number,
    unit: String
  },
  tags: [String],
  isActive: Boolean,
  seoTitle: String,
  seoDescription: String
}
```

## Getting API Keys

### Cloudinary (Required)
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Get your Cloud Name, API Key, and API Secret
3. Add to `.env` file

### Unsplash API (Recommended)
1. Go to [unsplash.com/developers](https://unsplash.com/developers)
2. Create an app and get Access Key
3. Add `UNSPLASH_ACCESS_KEY` to `.env`

### Pexels API (Alternative)
1. Visit [pexels.com/api](https://pexels.com/api)
2. Get your API key
3. Add `PEXELS_API_KEY` to `.env`

## Performance Features

- **Image Optimization**: Cloudinary automatic format conversion and compression
- **Lazy Loading**: Support for progressive image loading
- **Pagination**: Efficient database queries with skip/limit
- **Indexing**: Optimized MongoDB indexes for search and filtering
- **Caching**: Popularity scores for recommendation algorithms

## Development

### Project Structure
```
Backend/
├── src/
│   ├── config/          # Environment & database config
│   ├── controllers/     # Route handlers
│   ├── middlewares/     # Custom middleware
│   ├── models/         # Mongoose schemas
│   ├── routes/         # API routes
│   ├── scripts/        # Database seeding scripts
│   ├── utils/          # Helper utilities
│   ├── validations/    # Input validation
│   ├── app.js          # Express app setup
│   └── server.js       # Server entry point
├── .env.example        # Environment template
└── package.json
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run seed` - Populate database with sample data

## API Documentation

Once the server is running, visit:
- **API Docs**: `http://localhost:10000/api-docs`
- **Health Check**: `http://localhost:10000/api/health`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or issues:
- Check the API documentation
- Review the logs for error details
- Ensure all required environment variables are set
- `GET /api/auth/me`
- `PUT /api/auth/me`
- `POST /api/auth/me/addresses`
- `GET /api/products`
- `POST /api/products` admin only
- `PUT /api/products/:id` admin only
- `DELETE /api/products/:id` admin only
- `GET /api/cart`
- `PUT /api/cart`
- `GET /api/wishlist`
- `POST /api/wishlist`
- `POST /api/orders`
- `GET /api/orders/me`
- `GET /api/orders` admin only
- `POST /api/payments/stripe/checkout-session`
- `POST /api/payments/razorpay/order`
- `POST /api/payments/verify`
- `POST /api/reviews`
- `GET /api/reviews/product/:productId`
- `GET /api/admin/stats`
- `GET /api/admin/users`
- `POST /api/upload/images`

## Example Request JSON

Register:

```json
{
  "name": "Rhea Malhotra",
  "email": "rhea@example.com",
  "password": "luxury123"
}
```

Create product:

```json
{
  "name": "Imperial Teak Lounge Sofa",
  "description": "Handcrafted teak sofa with brushed brass details.",
  "price": 4200,
  "discountPrice": 3899,
  "category": "luxury",
  "material": "teak",
  "images": [
    {
      "url": "https://example.com/sofa-1.jpg",
      "publicId": "products/sofa-1"
    }
  ],
  "stockQuantity": 8
}
```

Create order:

```json
{
  "paymentProvider": "stripe",
  "shippingAddress": {
    "fullName": "Rhea Malhotra",
    "phone": "+91 9876543210",
    "line1": "17 Palm Residences",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  }
}
```

Verify Razorpay payment:

```json
{
  "provider": "razorpay",
  "orderId": "6631d0a6b0d4e4d7af5e9011",
  "razorpayOrderId": "order_xxx",
  "razorpayPaymentId": "pay_xxx",
  "razorpaySignature": "signature"
}
```

## Example Response JSON

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "products": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "pages": 0
  }
}
```

## Deployment Notes

- Works on Render, Railway, AWS, or any Node host with MongoDB access.
- Use managed MongoDB such as MongoDB Atlas in production.
- Restrict `ALLOWED_ORIGINS` to trusted frontend domains.
- Store Stripe, Razorpay, JWT, and Cloudinary secrets in platform env vars.
- For Stripe, prefer Checkout Sessions for one-time payments.