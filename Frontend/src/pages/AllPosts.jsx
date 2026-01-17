import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/postsSlice";
import PostCard from "../components/PostCard";
import { CATEGORIES } from "../utils/categories";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AllPosts() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.posts);
  const [category, setCategory] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "";
    setCategory(cat);
    const query = cat ? `?category=${encodeURIComponent(cat)}` : "";
    dispatch(fetchPosts(query));
  }, [location.search, dispatch]);

  // 🔹 Loader shown ONLY when list is empty
  if (loading && list.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm text-center">
          Data is fetching from server, please wait for few seconds
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Posts</h2>

        <select
          value={category}
          onChange={(e) =>
            navigate(
              e.target.value
                ? `/posts?category=${encodeURIComponent(e.target.value)}`
                : "/posts"
            )
          }
          className="border p-2 rounded"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* POSTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {list.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  );
}
