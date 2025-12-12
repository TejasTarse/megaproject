import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost, viewPost, likePost } from "../redux/postsSlice";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import API from "../api/axios";

export default function PostDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current } = useSelector((s) => s.posts);
  const auth = useSelector((s) => s.auth);
  const userId = auth.user?.id || auth.user?._id;

  const [likeLoading, setLikeLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        // fetch post
        await dispatch(fetchPost(slug)).unwrap();
      } catch (err) {
        console.error("fetchPost failed:", err);
        // optional: show not-found UI
      }

      // sessionStorage guard to ensure single increment per tab
      try {
        const key = `viewed_${slug}`;
        if (!sessionStorage.getItem(key)) {
          await dispatch(viewPost(slug)).unwrap();
          sessionStorage.setItem(key, "1");
        }
      } catch (err) {
        console.error("viewPost failed:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [slug, dispatch]);

  if (loading || !current) {
    return <div className="p-8">Loading post...</div>;
  }

  // Like handler (in detail view)
  const handleLike = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    if (likeLoading) return;
    setLikeLoading(true);

    try {
      await dispatch(likePost(slug)).unwrap();
    } catch (err) {
      console.error("like in detail failed:", err);
      // optionally refetch
      try { await dispatch(fetchPost(slug)).unwrap(); } catch (_) {}
    } finally {
      setLikeLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/edit/${current._id}`);
  };

  const handleDelete = async () => {
    if (!confirm("Delete this post?")) return;
    try {
      await API.delete(`/posts/${current._id}`); // assumes protected delete endpoint and user is owner
      navigate("/posts");
    } catch (err) {
      console.error("delete failed:", err);
      alert(err?.response?.data?.message || "Delete failed");
    }
  };

  const isLiked = Boolean(userId && (current.likes || []).some(id => id.toString() === userId.toString()));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
        {current.featuredImage ? (
          <img src={current.featuredImage} alt={current.title} className="w-full h-80 object-cover rounded mb-4" />
        ) : (
          <div className="w-full h-80 bg-gray-200 rounded mb-4 flex items-center justify-center">No Image</div>
        )}

        <div className="text-cyan-600 text-sm">{current.category}</div>
        <h1 className="text-2xl font-bold mt-2">{current.title}</h1>
        <div className="text-gray-500 text-sm my-2">{dayjs(current.createdAt).format("MMM D, YYYY HH:mm")}</div>

        <div className="mt-4 prose max-w-none">{current.content}</div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`px-3 py-1 rounded ${isLiked ? "bg-cyan-600 text-white" : "bg-gray-100"}`}
            >
              {isLiked ? "👍" : "🤍"} {current.likes?.length || 0}
            </button>

            <div className="text-sm text-gray-600">Views: {current.views || 0}</div>
          </div>

          <div className="flex items-center gap-2">
            {/* show edit/delete only if owner or admin (frontend check only; server enforces) */}
            { (auth.user && (auth.user.id === current.userId || auth.user._id === current.userId || auth.user.role === "admin")) && (
              <>
                <button onClick={handleEdit} className="px-3 py-1 border rounded">Edit</button>
                <button onClick={handleDelete} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
