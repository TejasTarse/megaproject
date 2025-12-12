import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NotAuthorized from "./pages/NotAuthorized";

const AdminRoute = ({ children }) => {
    const admin = useSelector((state) => state.admin.user);
    const token = localStorage.getItem("adminToken");

    if (!token) return <Navigate to="/" />;
    if (admin?.role !== "admin") return <NotAuthorized />;

    return children;
};

export default AdminRoute;
