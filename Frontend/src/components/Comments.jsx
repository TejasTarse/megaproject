import { useEffect, useState } from "react";
import API from "../api/axios";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

export default function Comments({ slug }) {
  const auth = useSelector(s => s.auth);
  const user = auth.user;
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchComments = async () => {
    const res = await API.get(`/comments/${slug}`);
    setComments(res.data);
  };

  useEffect(() => {
    fetchComments();
  }, [slug]);

  const addComment = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await API.post(`/comments/${slug}`, { text });
      setComments(prev => [res.data, ...prev]);
      setText("");
    } catch {
      alert("Login to comment");
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (id) => {
    if (!confirm("Delete comment?")) return;
    await API.delete(`/comments/${id}`);
    setComments(c => c.filter(x => x._id !== id));
  };

  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {/* Add Comment */}
      {user ? (
        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="w-full border rounded p-2"
          />
          <button
            onClick={addComment}
            disabled={loading}
            className="mt-2 bg-cyan-600 text-white px-4 py-1 rounded"
          >
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </div>
      ) : (
        <p className="text-gray-500 mb-4">Login to comment</p>
      )}

      {/* Comment List */}
      <div className="space-y-4">
        {comments.map(c => (
          <div key={c._id} className="border p-3 rounded">
            <div className="flex justify-between">
              <div>
                <p className="font-semibold">{c.userId?.name}</p>
                <p className="text-xs text-gray-400">
                  {dayjs(c.createdAt).format("MMM D, YYYY HH:mm")}
                </p>
              </div>

              {user?.id === c.userId?._id && (
                <button
                  onClick={() => deleteComment(c._id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              )}
            </div>

            <p className="mt-2 text-gray-700">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
