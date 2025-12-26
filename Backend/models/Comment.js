import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    postId: {
      type: String, // post slug (_id)
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
