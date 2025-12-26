import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

/* =======================
   DATE HELPER
======================= */
Date.prototype.getWeekNumber = function () {
  const date = new Date(this);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
};

/* =======================
   USERS
======================= */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* =======================
   POSTS (WITH COMMENT COUNT)
======================= */
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "comments",        // Comment collection
          localField: "_id",       // Post slug
          foreignField: "postId",  // Comment.postId
          as: "comments",
        },
      },
      {
        $addFields: {
          commentCount: { $size: "$comments" },
        },
      },
      {
        $project: {
          comments: 0, // remove heavy array
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch posts" });
  }
};

export const deletePostByAdmin = async (req, res) => {
  try {
    await Post.findOneAndDelete({ _id: req.params.slug });
    await Comment.deleteMany({ postId: req.params.slug }); // cleanup comments
    res.json({ message: "Post deleted by admin" });
  } catch (err) {
    res.status(500).json(err);
  }
};

/* =======================
   ADMIN – GET COMMENTS OF A POST
======================= */
export const getPostCommentsAdmin = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.slug })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
};

/* =======================
   ADMIN – DELETE ANY COMMENT
======================= */
export const deleteCommentAdmin = async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.commentId);
    res.json({ success: true, message: "Comment deleted by admin" });
  } catch (error) {
    res.status(500).json({ message: "Admin delete comment failed" });
  }
};

/* =======================
   ANALYTICS
======================= */
export const getAnalytics = async (req, res) => {
  try {
    const users = await User.find();
    const posts = await Post.find();

    // Weekly post count
    const weeklyStats = {};
    posts.forEach(p => {
      const week = new Date(p.createdAt).getWeekNumber();
      weeklyStats[week] = (weeklyStats[week] || 0) + 1;
    });

    // Category distribution
    const categoryStats = {};
    posts.forEach(p => {
      categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
    });

    // Trending
    const mostViewed = [...posts].sort((a, b) => b.views - a.views).slice(0, 5);
    const mostLiked = [...posts].sort((a, b) => b.likes.length - a.likes.length).slice(0, 5);

    res.json({
      totalUsers: users.length,
      totalPosts: posts.length,
      weeklyStats,
      categoryStats,
      mostViewed,
      mostLiked,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};
