import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPost, viewPost, likePost } from "../redux/postsSlice";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import dayjs from "dayjs";
import Comments from "../components/Comments";
import DOMPurify from "dompurify";

export default function PostDetail() {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { current } = useSelector((s) => s.posts);
  const auth = useSelector((s) => s.auth);
  const userId = auth.user?.id || auth.user?._id;

  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const didViewRef = useRef(false);

  useEffect(() => {
    if (!slug) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      try {
        await dispatch(fetchPost(slug)).unwrap();
      } catch (err) {
        console.error("fetchPost error:", err);
      } finally {
        if (mounted) setLoading(false);
      }

      // count view only once
      if (!didViewRef.current) {
        didViewRef.current = true;
        try {
          await dispatch(viewPost(slug)).unwrap();
        } catch {
          try {
            await API.post(`/posts/${slug}/view`);
          } catch (err2) {
            console.error(err2);
          }
        } finally {
          try {
            await dispatch(fetchPost(slug)).unwrap();
          } catch {}
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, [slug, dispatch]);

  if (loading || !current) {
    return <div className="p-8">Loading...</div>;
  }

  const likesCount = current.likes?.length || 0;
  const viewsCount = current.views || 0;

  const isLiked = Boolean(
    userId &&
      (current.likes || []).some(
        (id) => id.toString() === userId.toString()
      )
  );

  const handleLike = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }
    if (likeLoading) return;

    setLikeLoading(true);
    try {
      await dispatch(likePost(current._id)).unwrap();
    } catch {
      try {
        await dispatch(fetchPost(current._id)).unwrap();
      } catch {}
    } finally {
      setLikeLoading(false);
    }
  };

  /**
   * ✅ IMPORTANT LOGIC
   * If content has NO HTML tags, wrap it as <h1>
   * So typing: 123456
   * Renders as: <h1>123456</h1>
   */
  let contentHTML = current.content || "";
  const hasHTMLTag = /<\/?[a-z][\s\S]*>/i.test(contentHTML);

  if (!hasHTMLTag && contentHTML.trim()) {
    contentHTML = `<h1>${contentHTML}</h1>`;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">

        {/* FEATURED IMAGE */}
        {current.featuredImage ? (
          <img
            src={current.featuredImage}
            alt={current.title}
            className="w-full h-80 object-cover rounded mb-4"
          />
        ) : (
          <div className="w-full h-80 bg-gray-200 rounded mb-4 flex items-center justify-center">
            No Image
          </div>
        )}

        {/* META */}
        <div className="text-cyan-600 text-sm">{current.category}</div>

        <h1 className="text-2xl font-bold mt-2">
          {current.title}
        </h1>

        <div className="text-gray-500 text-sm my-2 flex items-center justify-between">
          {/* <div>
            By: <span className="font-medium">{current.userId}</span>
          </div> */}
          <div>
            {dayjs(current.createdAt).format("MMM D, YYYY HH:mm")}
          </div>
        </div>

        {/* ✅ WORD / DOCS CONTENT RENDERING */}
        <div
          className="mt-6 prose max-w-none"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(contentHTML),
          }}
        />

        {/* LIKE + VIEWS */}
        <div className="mt-8 flex items-center gap-4">
          <button
            onClick={handleLike}
            disabled={likeLoading}
            className={`flex items-center gap-2 px-3 py-1 rounded ${
              isLiked
                ? "bg-cyan-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <span>{isLiked ? "👍" : "🤍"}</span>
            <span>{likesCount}</span>
          </button>

          <div className="text-sm text-gray-600 flex items-center gap-2">
            <span>👁️</span>
            <span>{viewsCount}</span>
          </div>
        </div>

        {/* COMMENTS */}
        <div className="mt-10">
          <Comments slug={slug} />
        </div>

      </div>
    </div>
  );
}
