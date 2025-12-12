import { useSelector, useDispatch } from "react-redux";
import { logoutAdmin } from "../redux/adminSlice";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const admin = useSelector((state) => state.admin.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <div className="w-full bg-white shadow-md flex justify-between items-center px-6 py-3">
            <h1 className="text-xl font-bold">Welcome, {admin?.name || "Admin"}</h1>

            <button
                onClick={() => {
                    dispatch(logoutAdmin());
                    navigate("/");
                }}
                className="bg-red-500 text-white px-4 py-1 rounded"
            >
                Logout
            </button>
        </div>
    );
};

export default Navbar;
