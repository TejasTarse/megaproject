import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost, viewPost, likePost } from "../redux/postsSlice";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import dayjs from "dayjs";

export default function PostDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current } = useSelector((s) => s.posts);
  const auth = useSelector((s) => s.auth);
  const userId = auth.user?.id || auth.user?._id;

  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  // const [deleteLoading, setDeleteLoading] = useState(false);

  // Ensures we increment views only once per component mount (protects against StrictMode double-mount)
  const didViewRef = useRef(false);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        // 1) fetch the post
        await dispatch(fetchPost(slug)).unwrap();
      } catch (err) {
        console.error("fetchPost error:", err);
      } finally {
        if (mounted) setLoading(false);
      }

      // 2) increment views once for this mount (every open/navigation triggers this)
      if (!didViewRef.current) {
        didViewRef.current = true; // mark immediately to avoid duplicates from StrictMode
        try {
          await dispatch(viewPost(slug)).unwrap(); // increments on server and returns updated post
        } catch (err) {
          console.error("viewPost thunk failed, trying direct API call:", err);
          try {
            await API.post(`/posts/${slug}/view`);
          } catch (err2) {
            console.error("Direct API view call also failed:", err2);
          }
        } finally {
          // re-fetch post so UI shows updated views (server truth)
          try { await dispatch(fetchPost(slug)).unwrap(); } catch (e) {console.log(e);
          }
        }
      }
    })();

    return () => { mounted = false; };
  }, [slug, dispatch]);

  if (loading || !current) return <div className="p-8">Loading...</div>;

  // const isOwner = Boolean(
  //   userId && (current.userId === userId || current.userId === (auth.user?._id || auth.user?.id))
  // );

  const likesCount = current.likes?.length || 0;
  const viewsCount = current.views || 0;
  const isLiked = Boolean(userId && (current.likes || []).some((id) => id.toString() === userId.toString()));

  const handleLike = async () => {
    if (!userId) { navigate("/login"); return; }
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      await dispatch(likePost(current._id)).unwrap();
    } catch (err) {
      console.error("Like failed", err);
      try { await dispatch(fetchPost(current._id)).unwrap(); } catch(err) {console.log(err);
      }
    } finally {
      setLikeLoading(false);
    }
  };

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

        <div className="text-gray-500 text-sm my-2 flex items-center justify-between">
          <div>By: <span className="font-medium">{current.userId}</span></div>
          <div>{dayjs(current.createdAt).format("MMM D, YYYY HH:mm")}</div>
        </div>

        <div className="mt-4 prose max-w-none whitespace-pre-wrap">{current.content}</div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              disabled={likeLoading}
              className={`flex items-center gap-2 px-3 py-1 rounded ${isLiked ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-700"}`}
            >
              <span>{isLiked ? "👍" : "🤍"}</span>
              <span>{likesCount}</span>
            </button>

            <div className="text-sm text-gray-600 flex items-center gap-2">
              <span>👁️</span>
              <span>{viewsCount}</span>
            </div>
          </div>

          {/* <div className="flex items-center gap-2">
            {isOwner && (
              <>
                <button onClick={() => navigate(`/edit/${current._id}`)} className="px-3 py-1 border rounded">Edit</button>
                <button onClick={handleDelete} disabled={deleteLoading} className="px-3 py-1 bg-red-500 text-white rounded">
                  {deleteLoading ? "Deleting..." : "Delete"}
                </button>
              </>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
