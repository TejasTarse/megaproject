import AdminLayout from "../layout/AdminLayout";

const Dashboard = () => {
    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>

            <div className="grid grid-cols-3 gap-6 mt-6">
                <div className="bg-blue-500 text-white p-6 rounded-lg shadow">Total Users</div>
                <div className="bg-green-500 text-white p-6 rounded-lg shadow">Total Posts</div>
                <div className="bg-purple-500 text-white p-6 rounded-lg shadow">Trending Posts</div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
