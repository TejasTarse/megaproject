import Comment from "../models/Comment.js";

// GET comments for a post
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.slug })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

// ADD comment
export const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      postId: req.params.slug,
      userId: req.user.id,
      text: req.body.text,
    });

    const populated = await comment.populate("userId", "name email");
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment" });
  }
};

// DELETE comment (own comment)
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await comment.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
