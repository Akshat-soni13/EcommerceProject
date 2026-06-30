import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: 0
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
      trim: true,
    },
    price: {
      amount: {
        type: Number,
         default: 0
      },
      currency: {
        type: String,
        required: [true, "Product currency is required."],
        enum: ["USD", "EUR", "GBP", "INR", "JPY"],
      },
    },
    category: {
      type: String,
      required: [true, "Product category is required."],
      trim: true,
    },
    images: [
      {
        url: {
          type: String,
          required: [true, "Product image URL is required."],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const productModel = mongoose.model("Product", productSchema);

export default productModel;