import Post from "../models/Post.js";

// CREATE POST
export const createPost = async (req, res) => {
  try {
    const { _id, title, content, featuredImage, status, category } = req.body;
    const post = await Post.create({
      _id,
      title,
      content,
      featuredImage,
      status,
      category: category || "General",
      userId: req.user._id // from token
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Create Post Error", error });
  }
};

// UPDATE POST (only owner or admin)
export const updatePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ _id: slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const requesterId = req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (post.userId?.toString() !== requesterId && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this post" });
    }

    const updated = await Post.findOneAndUpdate({ _id: slug }, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Update Post Error", error });
  }
};

// DELETE POST (only owner or admin)
export const deletePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ _id: slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const requesterId = req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (post.userId?.toString() !== requesterId && !isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Post.findOneAndDelete({ _id: slug });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Delete Post Error", error });
  }
};

// GET POSTS CREATED BY CURRENT USER
export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const posts = await Post.find({ userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Get My Posts Error", error });
  }
};

// GET SINGLE POST
export const getPost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ _id: slug });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Get Post Error", error });
  }
};

// GET ACTIVE POSTS (supports ?category=CategoryName)
export const getPosts = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: "active" };
    if (category) filter.category = category;
    const posts = await Post.find(filter).sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Get Posts Error", error });
  }
};

/*
 * LIKE POST (toggle)
 * protected route: user required
 * If userId exists in likes array -> pull it (unlike)
 * else push it (like)
 * return updated post
 */
export const likePost = async (req, res) => {
  try {
    const userId = req.user._id.toString();
    const { slug } = req.params;

    const post = await Post.findOne({ _id: slug });
    if (!post) return res.status(404).json({ message: "Post not found" });

    const alreadyLiked = (post.likes || []).some(l => l.toString() === userId);

    let updated;
    if (alreadyLiked) {
      // remove userId from likes
      updated = await Post.findOneAndUpdate(
        { _id: slug },
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      // add userId to likes
      updated = await Post.findOneAndUpdate(
        { _id: slug },
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Like Post Error", error });
  }
};

/*
 * VIEW POST
 * public route by default (no auth)
 * increments views by 1 and returns updated post
 * NOTE: this counts raw clicks; if you want unique views per user/ip you'll need extra logic
 */
export const viewPost = async (req, res) => {
  try {
    const { slug } = req.params;
    const updated = await Post.findOneAndUpdate(
      { _id: slug },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Post not found" });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "View Post Error", error });
  }
};
