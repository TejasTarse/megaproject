// src/components/PostCard.jsx
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { likePost, fetchPosts } from "../redux/postsSlice";
import { optimisticToggleLike } from "../redux/postsSlice";
import { useState } from "react";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((s) => s.auth);
  const userId = auth.user?.id || auth.user?._id;

  const excerpt = post.content?.slice(0, 140) + (post.content?.length > 140 ? "..." : "");
  const likesCount = post.likes?.length || 0;
  const viewsCount = post.views || 0;

  const isLiked = Boolean(userId && (post.likes || []).some(l => l.toString() === userId.toString()));
  const [likeLoading, setLikeLoading] = useState(false);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return navigate("/login");
    if (likeLoading) return;
    setLikeLoading(true);

    // optimistic UI
    dispatch(optimisticToggleLike({ slug: post._id, userId }));

    try {
      await dispatch(likePost(post._id)).unwrap();
    } catch (err) {
      console.error("Like error", err);
      // fallback: refetch posts to reconcile
      try { await dispatch(fetchPosts()).unwrap(); } catch {}
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden">
      <Link to={`/post/${post._id}`} className="block">
        {post.featuredImage ? (
          <img src={post.featuredImage} alt={post.title} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-gray-200 flex items-center justify-center">No Image</div>
        )}
      </Link>

      <div className="p-4">
        <div className="text-xs text-cyan-500 mb-1">{post.category}</div>
        <Link to={`/post/${post._id}`} className="block text-lg font-semibold hover:underline">{post.title}</Link>
        <p className="text-sm text-gray-600 mt-2">{excerpt}</p>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 px-2 py-1 rounded ${isLiked ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              <span>{isLiked ? "👍" : "🤍"}</span>
              <span>{likesCount}</span>
            </button>

            <div className="flex items-center gap-1">
              <span>👁️</span>
              <span>{viewsCount}</span>
            </div>
          </div>

          <div className="text-xs text-gray-400">{dayjs(post.createdAt).format("MMM D, YYYY HH:mm")}</div>
        </div>
      </div>
    </div>
  );
}
