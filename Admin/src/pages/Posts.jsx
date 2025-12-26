import { useEffect, useState } from "react";
import API from "../api/axios";
import AdminLayout from "../layout/AdminLayout";

const Posts = () => {
    const [posts, setPosts] = useState([]);

    const fetchPosts = async () => {
        try {
            const res = await API.get("/admin/posts");
            setPosts(res.data);
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const deletePost = async (slug) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this post?");
            if (!confirmDelete) return;

            await API.delete(`/admin/posts/${slug}`);
            fetchPosts();
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Posts</h1>

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Image</th>
                        <th className="border p-2">Slug</th>
                        <th className="border p-2">Title</th>
                        <th className="border p-2">User ID</th>
                        <th className="border p-2">Category</th>
                        <th className="border p-2">Views</th>
                        <th className="border p-2">Likes</th>
                        <th className="border p-2">Comments</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2">Delete</th>
                    </tr>
                </thead>

                <tbody>
                    {posts.map((post) => (
                        <tr key={post._id}>
                            {/* IMAGE */}
                            <td className="border p-2">
                                {post.featuredImage ? (
                                    <img
                                        src={post.featuredImage}
                                        alt="thumbnail"
                                        className="w-14 h-14 object-cover rounded"
                                    />
                                ) : (
                                    <span className="text-gray-500">No Image</span>
                                )}
                            </td>

                            <td className="border p-2">{post._id}</td>
                            <td className="border p-2">{post.title}</td>
                            <td className="border p-2">{post.userId}</td>
                            <td className="border p-2">{post.category}</td>
                            <td className="border p-2">{post.views}</td>
                            <td className="border p-2">{post.likes?.length || 0}</td>

                            {/* ✅ CORRECT COMMENT COUNT */}
                            <td className="border p-2">
                                {post.commentCount || 0}
                            </td>

                            <td className="border p-2 capitalize">{post.status}</td>

                            <td className="border p-2">
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer hover:bg-red-600 transition"
                                    onClick={() => deletePost(post._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>
    );
};

export default Posts;
