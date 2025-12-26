import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";


export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left - App Title */}
        <Link to="/" className="text-2xl font-bold text-cyan-600">
          Blog App
        </Link>

        {/* Center - Public links (ONLY when not logged in) */}
        {!user && (
          <nav className="flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-cyan-600">
              Home
            </Link>
            <Link to="/about" className="text-gray-600 hover:text-cyan-600">
              About Us
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-cyan-600">
              Contact Us
            </Link>
          </nav>
        )}

        {/* Right - Auth / User Actions */}
        <div className="flex items-center gap-4">
          {/* When NOT logged in */}
          {!user && (
            <>
              <Link to="/login" className="px-3 py-1 border rounded">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1 bg-cyan-600 text-white rounded"
              >
                Sign up
              </Link>
            </>
          )}

          {/* When logged in */}
          {user && (
            <>
              <Link
                to="/posts"
                className="text-gray-600 hover:text-cyan-600"
              >
                All Posts
              </Link>

              <Link
                to="/my-posts"
                className="text-gray-600 hover:text-cyan-600"
              >
                My Posts
              </Link>

              <button
                onClick={() => navigate("/add")}
                className="bg-cyan-600 text-white px-3 py-1 rounded"
              >
                Add Post
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="flex items-center gap-2 text-gray-600 hover:text-cyan-600"
                >
                  <FaUserCircle size={30}  />
                  {/* <span className="hidden md:block">
                    {user.name || "User"}
                  </span> */}
                </button>

                {openMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                    <Link
                      to="/my-posts"
                      onClick={() => setOpenMenu(false)}
                      className="block px-3 py-2 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        setOpenMenu(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
