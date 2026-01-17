import { Link } from "react-router-dom";
import API from "../api/axios";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Prevent refetch if data already exists
    if (posts.length > 0) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await API.get("/posts");
        setPosts(res.data.slice(0, 8));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // 🔹 Loader shown ONLY when data is empty
  if (loading && posts.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 text-sm">
          Data is fetching from Render server, please wait for few seconds
        </p>
      </div>
    );
  }

  return (
    <div className="hide-scrollbar overflow-y-scroll h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* LEFT CONTENT */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold">Welcome to MyBlog</h1>
            <p className="mt-2 text-gray-600">
              Best place to read and share posts.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {posts.map((p) => (
                <PostCard key={p._id} post={p} />
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Top categories</h3>

            <Link to="/posts" className="mt-4 inline-block text-cyan-600">
              See all posts
            </Link>
          </aside>
        </div>
      </div>
    </div>
  );
}
