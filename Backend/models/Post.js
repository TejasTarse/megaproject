import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    _id: String, // slug
    title: String,
    content: String,
    featuredImage: String,
    status: { type: String, default: "active" },
    userId: String,

    // optional for analytics
    category: { type: String, default: "general" },
    views: { type: Number, default: 0 },
    likes: { type: Array, default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
