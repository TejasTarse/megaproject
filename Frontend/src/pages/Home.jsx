import { Link } from "react-router-dom";
import API from "../api/axios";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";

export default function Home(){
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data.slice(0, 8)); // show featured 8
      } catch (err) {}
    };
    load();
  }, []);

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold">Welcome to MyBlog</h1>
            <p className="mt-2 text-gray-600">Best place to read and share posts.</p>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {posts.map(p => <PostCard key={p._id} post={p} />)}
            </div>
          </div>

          <aside className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Top categories</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {/* categories links */}
            </div>
            <Link to="/posts" className="mt-4 inline-block text-cyan-600">See all posts</Link>
          </aside>
        </div>
      </div>
    </>
  )
}
