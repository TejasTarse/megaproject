import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyPosts, deletePost } from "../redux/postsSlice";
import { Link } from "react-router-dom";

const htmlToText = (html = "") => {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
};

export default function MyPosts() {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((s) => s.posts);
  const auth = useSelector((s) => s.auth);

  useEffect(() => {
    if (auth.token) {
      dispatch(fetchMyPosts());
    }
  }, [dispatch, auth.token]);

  const handleDelete = async (slug) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await dispatch(deletePost(slug)).unwrap();
      dispatch(fetchMyPosts());
    } catch (err) {
      console.error("Delete failed", err);
      alert(err?.message || "Delete failed");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Posts</h2>
        <Link
          to="/add"
          className="bg-cyan-600 text-white px-3 py-1 rounded"
        >
          Add Post
        </Link>
      </div>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {list.map((post) => {
          const plainText = htmlToText(post.content);
          const excerpt =
            plainText.slice(0, 80) +
            (plainText.length > 80 ? "..." : "");

          return (
            <div key={post._id} className="bg-white rounded shadow">
              {post.featuredImage ? (
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-36 object-cover rounded-t"
                />
              ) : (
                <div className="w-full h-36 bg-gray-200 rounded-t flex items-center justify-center">
                  No Image
                </div>
              )}

              <div className="p-3">
                <div className="text-xs text-cyan-500">
                  {post.category}
                </div>

                <div className="font-semibold">
                  {post.title}
                </div>

                {/* ✅ CLEAN TEXT EXCERPT */}
                <div className="text-sm text-gray-600 mt-2">
                  {excerpt}
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Views: {post.views || 0}
                  </div>

                  <div className="flex gap-2">
                    <Link
                      to={`/edit/${post._id}`}
                      className="px-2 py-1 border rounded text-sm hover:bg-gray-100"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(post._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
