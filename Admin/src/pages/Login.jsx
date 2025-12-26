import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../redux/adminSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector(state => state.admin);

    const [form, setForm] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await dispatch(adminLogin(form));

        if (res.meta.requestStatus === "fulfilled") {
            navigate("/dashboard");
        }
    };

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <form
                className="bg-white p-8 shadow-md rounded w-96"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-4 text-center">
                    Admin Login
                </h2>

                {error && <p className="text-red-500 mb-2">{error}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    className="border p-2 mb-2 w-full"
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="border p-2 mb-4 w-full"
                    onChange={(e) =>
                        setForm({ ...form, password: e.target.value })
                    }
                />

                <button
                    type="submit"
                    className="bg-blue-600 text-white w-full py-2 rounded"
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Login"}
                </button>

                {/* ✅ Bottom Center Paragraph */}
                <p className="text-center text-sm text-gray-500 mt-4">
                    Demo Admin Login <br />
                    <span className="font-medium">Email:</span> admin@123.com <br />
                    <span className="font-medium">Password:</span> Admin@123
                </p>
            </form>
        </div>
    );
};

export default Login;
