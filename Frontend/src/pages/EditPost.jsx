import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { CATEGORIES } from "../utils/categories";
import WordEditor from "../components/WordEditor";

export default function EditPost() {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const res = await API.get(`/posts/${slug}`);
      setForm(res.data);
    };
    load();
  }, [slug]);

  if (!form) return <div className="p-8">Loading...</div>;

  const submit = async (e) => {
    e.preventDefault();
    await API.put(`/posts/${slug}`, form);
    navigate(`/post/${slug}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <form
        onSubmit={submit}
        className="max-w-3xl mx-auto bg-white p-6 rounded shadow"
      >
        <h2 className="text-xl font-bold mb-4">Edit Post</h2>

        <input
          disabled
          value={form._id}
          className="w-full border p-2 mb-3 bg-gray-100"
        />

        <input
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
            Save
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
