import { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "../redux/postsSlice";
import { CATEGORIES } from "../utils/categories";
import { useNavigate } from "react-router-dom";
import WordEditor from "../components/WordEditor";

export default function AddPost() {
  const [form, setForm] = useState({
    _id: "",
    title: "",
    content: "",
    featuredImage: "",
    status: "active",
    category: "Technology",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(createPost(form));
    if (res.meta.requestStatus === "fulfilled") {
      navigate("/posts");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        onSubmit={submit}
        className="max-w-3xl mx-auto bg-white p-6 rounded shadow"
      >
        <h2 className="text-xl font-bold mb-4">Add Post</h2>

        <input
          placeholder="slug (unique)"
          value={form._id}
          onChange={(e) => setForm({ ...form, _id: e.target.value })}
          className="w-full border p-2 mb-3"
        />

        <input
          placeholder="title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border p-2 mb-3"
        />

        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border p-2 mb-3"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          placeholder="featuredImage (direct URL)"
          value={form.featuredImage}
          onChange={(e) =>
            setForm({ ...form, featuredImage: e.target.value })
          }
          className="w-full border p-2 mb-4"
        />

        {/* ✅ Word / Docs style editor */}
        <div className="mb-6">
          <label className="block font-medium mb-1">Content</label>
          <WordEditor
            value={form.content}
            onChange={(content) =>
              setForm({ ...form, content })
            }
          />
        </div>

        <div className="flex space-x-2">
          <button className="bg-cyan-600 text-white px-4 py-2 rounded">
            Create
          </button>

          <button
            type="button"
            onClick={() => navigate("/posts")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
