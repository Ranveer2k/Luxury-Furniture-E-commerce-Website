import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.statics.calcAverageRatings = async function calcAverageRatings(productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: "$product",
        ratingsAverage: { $avg: "$rating" },
        ratingsCount: { $sum: 1 },
      },
    },
  ]);

  const Product = mongoose.model("Product");

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: Number(stats[0].ratingsAverage.toFixed(1)),
      ratingsCount: stats[0].ratingsCount,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsCount: 0,
    });
  }
};

reviewSchema.post("save", function postSave() {
  this.constructor.calcAverageRatings(this.product);
});

reviewSchema.post("findOneAndDelete", async function postDelete(doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.product);
  }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;