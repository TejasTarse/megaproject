import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, deleteUser } from "../redux/userSlice";
import AdminLayout from "../layout/AdminLayout";

const Users = () => {
    const dispatch = useDispatch();
    const { list, loading } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(fetchUsers());
    }, []);

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold">Users</h1>

            {loading && <p>Loading...</p>}

            <table className="w-full mt-4 border">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((user) => (
                        <tr key={user._id}>
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.role}</td>
                            <td className="border p-2">
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => dispatch(deleteUser(user._id))}
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

export default Users;
