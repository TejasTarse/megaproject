import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AdminLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gray-100">

            {/* FIXED SIDEBAR */}
            <Sidebar />

            {/* MAIN CONTENT SHIFTED RIGHT */}
            <div className="ml-64 flex flex-col min-h-screen">

                <Navbar />

                <main className="p-6 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
