import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { optimisticToggleLike, likePost, viewPost, fetchPost, fetchPosts } from "../redux/postsSlice";

export default function PostCard({ post }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((s) => s.auth);
  const userId = auth.user?.id || auth.user?._id;

  // UI state
  const [likeLoading, setLikeLoading] = useState(false);
  const [openLoading, setOpenLoading] = useState(false);

  const excerpt = (post.content || "").slice(0, 140) + ((post.content || "").length > 140 ? "..." : "");
  const likesCount = post.likes?.length || 0;
  const viewsCount = post.views || 0;

  const isLiked = Boolean(userId && (post.likes || []).some(l => l.toString() === userId.toString()));

  // When clicking the card we try to increment view once per session/tab then navigate
  const handleOpen = async () => {
  const key = `viewed_${post._id}`;
  try {
    if (!sessionStorage.getItem(key)) {
      // call POST /api/posts/:slug/view
      await dispatch(viewPost(post._id)).unwrap();
      sessionStorage.setItem(key, "1");
    }
  } catch (err) {
    console.error("viewPost (card) failed:", err);
  } finally {
    navigate(`/post/${post._id}`);
  }
};

  // Like handler: optimistic UI + call backend; revert by refetching on error
  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      navigate("/login");
      return;
    }

    if (likeLoading) return;
    setLikeLoading(true);

    // optimistic update
    dispatch(optimisticToggleLike({ slug: post._id, userId }));

    try {
      // call backend; postsSlice will overwrite with server response on fulfilled
      await dispatch(likePost(post._id)).unwrap();
    } catch (err) {
      console.error("likePost failed:", err);
      // revert by refetching the single post (preferred) or the list
      try {
        await dispatch(fetchPost(post._id)).unwrap();
      } catch (singleErr) {
        // fallback: refetch list
        try { await dispatch(fetchPosts()).unwrap(); } catch (_) { /* ignore */ }
      }
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div className="bg-white rounded shadow overflow-hidden cursor-pointer" role="article">
      {/* Clickable image/title area */}
      <div onClick={handleOpen} className="select-none">
        {post.featuredImage ? (
          <img src={post.featuredImage} alt={post.title} className="w-full h-44 object-cover" />
        ) : (
          <div className="w-full h-44 bg-gray-200 flex items-center justify-center">No Image</div>
        )}
      </div>

      <div className="p-4">
        <div className="text-xs text-cyan-500 mb-1">{post.category}</div>

        <h3 onClick={handleOpen} className="block text-lg font-semibold hover:underline">
          {post.title}
        </h3>

        <p className="text-sm text-gray-600 mt-2">{excerpt}</p>

        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 px-2 py-1 rounded ${
                isLiked ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
              title={isLiked ? "Unlike" : "Like"}
            >
              <span>{isLiked ? "👍" : "🤍"}</span>
              <span>{likesCount}</span>
            </button>

            <div className="flex items-center gap-1">
              <span>👁️</span>
              <span>{viewsCount}</span>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            {dayjs(post.createdAt).format("MMM D, YYYY HH:mm")}
          </div>
        </div>
      </div>
    </div>
  );
}
