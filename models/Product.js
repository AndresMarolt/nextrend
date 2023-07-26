import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    images: { type: Array, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    sizes: { type: Array, required: true, default: [] },
    variants: { type: Array, required: true, default: [] },
  },
  {
    timestamp: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
