import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import API from "../api/axios";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8A2BE2"];

const Analytics = () => {
    const [data, setData] = useState({
        totalUsers: 0,
        totalPosts: 0,
        weeklyStats: {},
        categoryStats: {},
        mostViewed: [],
        mostLiked: []
    });

    const fetchAnalytics = async () => {
        const res = await API.get("/admin/analytics");
        setData(res.data);
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    // Convert weekly stats → array
    const weeklyChart = Object.keys(data.weeklyStats).map(week => ({
        week,
        posts: data.weeklyStats[week]
    }));

    // Convert category stats → array
    const categoryChart = Object.keys(data.categoryStats).map(cat => ({
        name: cat,
        value: data.categoryStats[cat]
    }));

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold mb-6">Advanced Analytics</h1>

            {/* Top summary cards */}
            <div className="grid grid-cols-3 gap-6 mb-10">
                <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg">
                    <h2>Total Users</h2>
                    <p className="text-3xl font-bold">{data.totalUsers}</p>
                </div>

                <div className="bg-green-600 text-white p-6 rounded-lg shadow-lg">
                    <h2>Total Posts</h2>
                    <p className="text-3xl font-bold">{data.totalPosts}</p>
                </div>

                <div className="bg-purple-600 text-white p-6 rounded-lg shadow-lg">
                    <h2>Trending Posts</h2>
                    <p className="text-3xl font-bold">{data.mostViewed.length}</p>
                </div>
            </div>

            {/* Weekly Posts Bar Chart */}
            <h2 className="text-xl font-bold mb-3">Weekly Post Creation</h2>
            <BarChart width={700} height={300} data={weeklyChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="posts" fill="#8884d8" />
            </BarChart>

            {/* Category Pie Chart */}
            <h2 className="text-xl font-bold mt-10 mb-3">Posts by Category</h2>
            <PieChart width={500} height={300}>
                <Pie
                    data={categoryChart}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                >
                    {categoryChart.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Legend />
                <Tooltip />
            </PieChart>

            {/* Most Viewed Posts */}
            <h2 className="text-xl font-bold mt-10 mb-3">Top 5 Most Viewed Posts</h2>
            <table className="w-full border mb-10">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Title</th>
                        <th className="p-2 border">Views</th>
                    </tr>
                </thead>
                <tbody>
                    {data.mostViewed.map(post => (
                        <tr key={post._id}>
                            <td className="border p-2">{post.title}</td>
                            <td className="border p-2">{post.views}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Most Liked Posts */}
            <h2 className="text-xl font-bold mt-3 mb-3">Top 5 Most Liked Posts</h2>
            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border">Title</th>
                        <th className="p-2 border">Likes</th>
                    </tr>
                </thead>
                <tbody>
                    {data.mostLiked.map(post => (
                        <tr key={post._id}>
                            <td className="border p-2">{post.title}</td>
                            <td className="border p-2">{post.likes.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </AdminLayout>
    );
};

export default Analytics;
