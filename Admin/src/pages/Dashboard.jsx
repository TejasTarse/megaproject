import { useEffect, useState } from "react";
import API from "../api/axios";
import AdminLayout from "../layout/AdminLayout";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    totalComments: 0,
    totalViews: 0,
  });

  const [topViewed, setTopViewed] = useState([]);
  const [topCommented, setTopCommented] = useState([]);
  const [topLiked, setTopLiked] = useState([]);

  const fetchDashboardData = async () => {
    try {
      // 1️⃣ Users
      const usersRes = await API.get("/admin/users");

      // 2️⃣ Posts (with commentCount)
      const postsRes = await API.get("/admin/posts");
      const posts = postsRes.data;

      // Calculate totals
      const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);
      const totalComments = posts.reduce((sum, p) => sum + (p.commentCount || 0), 0);

      setStats({
        totalUsers: usersRes.data.length,
        totalPosts: posts.length,
        totalComments,
        totalViews,
      });

      // Top posts
      setTopViewed([...posts].sort((a, b) => b.views - a.views).slice(0, 5));
      setTopCommented([...posts].sort((a, b) => b.commentCount - a.commentCount).slice(0, 5));
      setTopLiked([...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)).slice(0, 5));
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard title="Users" value={stats.totalUsers} color="bg-blue-500" />
        <StatCard title="Posts" value={stats.totalPosts} color="bg-green-500" />
        <StatCard title="Comments" value={stats.totalComments} color="bg-purple-500" />
        <StatCard title="Views" value={stats.totalViews} color="bg-cyan-600" />
      </div>

      {/* TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Most Viewed */}
        <DashboardTable
          title="Most Viewed Posts"
          rows={topViewed}
          valueKey="views"
          valueLabel="Views"
        />

        {/* Most Commented */}
        <DashboardTable
          title="Most Commented Posts"
          rows={topCommented}
          valueKey="commentCount"
          valueLabel="Comments"
        />

        {/* Most Liked */}
        <DashboardTable
          title="Most Liked Posts"
          rows={topLiked}
          valueKey="likes"
          valueLabel="Likes"
          isArray
        />

      </div>
    </AdminLayout>
  );
};

export default Dashboard;

/* =======================
   SMALL COMPONENTS
======================= */

const StatCard = ({ title, value, color }) => (
  <div className={`${color} text-white p-6 rounded shadow`}>
    <h3 className="text-lg">{title}</h3>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

const DashboardTable = ({ title, rows, valueKey, valueLabel, isArray }) => (
  <div className="bg-white rounded shadow p-4">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>

    <table className="w-full text-sm">
      <thead>
        <tr className="border-b">
          <th className="text-left py-1">Title</th>
          <th className="text-right py-1">{valueLabel}</th>
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 && (
          <tr>
            <td colSpan="2" className="text-center py-3 text-gray-500">
              No data
            </td>
          </tr>
        )}

        {rows.map((post) => (
          <tr key={post._id} className="border-b last:border-none">
            <td className="py-1 truncate">{post.title}</td>
            <td className="py-1 text-right font-medium">
              {isArray ? post[valueKey]?.length || 0 : post[valueKey] || 0}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
