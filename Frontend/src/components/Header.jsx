import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useEffect, useState } from "react";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";

export default function Header() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);     // user dropdown
  const [mobileOpen, setMobileOpen] = useState(false); // mobile hamburger

  // 🔹 CLOSE MENUS ON ROUTE CHANGE (IMPORTANT FIX)
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-cyan-600">
          Blog App
        </Link>

        {/* ================= DESKTOP NAV ================= */}
        {!user && (
          <nav className="hidden md:flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-cyan-600">Home</Link>
            <Link to="/posts" className="text-gray-600 hover:text-cyan-600">All Posts</Link>
            <Link to="/about" className="text-gray-600 hover:text-cyan-600">About Us</Link>
            <Link to="/contact" className="text-gray-600 hover:text-cyan-600">Contact Us</Link>
          </nav>
        )}

        <div className="hidden md:flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
              <Link to="/signup" className="px-3 py-1 bg-cyan-600 text-white rounded">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link to="/posts" className="text-gray-600 hover:text-cyan-600">
                All Posts
              </Link>
              <Link to="/my-posts" className="text-gray-600 hover:text-cyan-600">
                My Posts
              </Link>

              <button
                onClick={() => navigate("/add")}
                className="bg-cyan-600 text-white px-3 py-1 rounded"
              >
                Add Post
              </button>

              {/* USER DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenu(!openMenu)}
                  className="text-gray-600 hover:text-cyan-600"
                >
                  <FaUserCircle size={30} />
                </button>

                {openMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                    <Link
                      to="/my-posts"
                      className="block px-3 py-2 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
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

        {/* ================= MOBILE HAMBURGER ================= */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-gray-700"
        >
          {mobileOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t shadow z-40">
          <nav className="flex flex-col p-4 gap-4">
            {!user ? (
              <>
                <Link to="/">Home</Link>
                <Link to="/posts">All Posts</Link>
                <Link to="/about">About Us</Link>
                <Link to="/contact">Contact Us</Link>
                <Link to="/login">Login</Link>
                <Link to="/signup">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to="/posts">All Posts</Link>
                <Link to="/my-posts">My Posts</Link>
                <Link to="/add">Add Post</Link>
                <button
                  onClick={handleLogout}
                  className="text-left text-red-600"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
