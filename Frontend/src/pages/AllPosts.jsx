import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../redux/postsSlice";
import PostCard from "../components/PostCard";
// import AdminLayout from "../layout/AdminLayout"; // no admin layout here — use Home layout? We'll use simple wrapper
import { CATEGORIES } from "../utils/categories";
import API from "../api/axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function AllPosts(){
  const dispatch = useDispatch();
  const { list, loading } = useSelector(s => s.posts);
  const [category, setCategory] = useState("");
  const [pageSize] = useState(4);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const cat = params.get("category") || "";
    setCategory(cat);
    const query = cat ? `?category=${encodeURIComponent(cat)}` : "";
    dispatch(fetchPosts(query));
  }, [location.search]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">All Posts</h2>
        <div className="flex items-center space-x-2">
          <select value={category} onChange={(e)=>navigate(`/posts?category=${encodeURIComponent(e.target.value)}`)} className="border p-2 rounded">
            <option value="">All categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
        {list.map(post => <PostCard key={post._id} post={post} />)}
      </div>
    </div>
  )
}
