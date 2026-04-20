import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discountPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      enum: ["wood-furniture", "epoxy-furniture", "chairs", "beds", "sofas", "tables", "doors", "epoxy-art-products"],
      required: true,
      index: true,
    },
    material: {
      type: String,
      enum: ["teak", "sheesham", "oak", "walnut", "epoxy-resin", "mahogany", "pine", "bamboo", "metal", "leather"],
      required: true,
      index: true,
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: String,
        alt: String,
        isPrimary: { type: Boolean, default: false },
        tags: [String], // AI-generated tags
      },
    ],
    thumbnail: {
      url: String,
      publicId: String,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    popularityScore: {
      type: Number,
      default: 0,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: { type: String, default: "cm" },
    },
    weight: {
      value: Number,
      unit: { type: String, default: "kg" },
    },
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    seoTitle: String,
    seoDescription: String,
  },
  { timestamps: true },
);

// Indexes for better performance
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.index({ category: 1, material: 1 });
productSchema.index({ price: 1 });
productSchema.index({ ratingsAverage: -1 });
productSchema.index({ popularityScore: -1 });

// Virtual for discounted price
productSchema.virtual("finalPrice").get(function () {
  return this.discountPrice || this.price;
});

// Instance method to get primary image
productSchema.methods.getPrimaryImage = function () {
  return this.images.find(img => img.isPrimary) || this.images[0];
};

// Static method to get products by category with image count
productSchema.statics.getProductsByCategory = function (category, limit = 20) {
  return this.find({ category, isActive: true })
    .select("name price discountPrice images thumbnail ratingsAverage ratingsCount category material")
    .sort({ popularityScore: -1 })
    .limit(limit);
};

const Product = mongoose.model("Product", productSchema);

export default Product;