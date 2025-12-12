import User from "../models/User.js";
import Post from "../models/Post.js";

Date.prototype.getWeekNumber = function () {
  const date = new Date(this);
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  return Math.ceil((((date - yearStart) / 86400000) + 1) / 7);
};

// USERS
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

// POSTS
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
};

export const deletePostByAdmin = async (req, res) => {
  try {
    await Post.findOneAndDelete({ _id: req.params.slug });
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
};

// ANALYTICS
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

    // Post categories
    const categoryStats = {};
    posts.forEach(p => {
      categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
    });

    // Trending Posts
    const mostViewed = posts.sort((a, b) => b.views - a.views).slice(0, 5);
    const mostLiked = posts.sort((a, b) => b.likes.length - a.likes.length).slice(0, 5);

    res.json({
      totalUsers: users.length,
      totalPosts: posts.length,
      weeklyStats,
      categoryStats,
      mostViewed,
      mostLiked
    });

  } catch (err) {
    res.status(500).json(err);
  }
};
