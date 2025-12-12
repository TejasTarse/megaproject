import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useState } from "react";
import { CATEGORIES } from "../utils/categories"; // You already have this

export default function Header() {
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const active = (path) =>
    location.pathname === path ? "text-cyan-600 font-semibold" : "text-gray-600";

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold text-cyan-700">
          MyBlog
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6">

          {/* ALL POSTS BUTTON */}
          

          {/* CATEGORY QUICK LINKS */}
          
        </nav>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {auth.user ? (
            <>
            <Link
            to="/posts"
            className={`${active("/posts")} hover:text-cyan-600`}
          >
            All Posts
          </Link>
              <Link to="/my-posts" className="px-3 py-1 rounded hover:bg-gray-100">
                My Posts
              </Link>
              <button
                onClick={() => navigate("/add")}
                className="bg-cyan-600 text-white px-3 py-1 rounded"
              >
                Add Post
              </button>
              <button
                onClick={handleLogout}
                className="px-3 py-1 border rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 border rounded">
                Login
              </Link>
              <Link to="/signup" className="px-3 py-1 bg-cyan-600 text-white rounded">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU ICON */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
          aria-label="menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="px-4 py-3 space-y-3">

            {/* ALL POSTS BUTTON */}
            <Link
              to="/posts"
              onClick={() => setOpen(false)}
              className="block text-gray-700 text-lg font-semibold"
            >
              All Posts
            </Link>

            {/* Category List */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat}
                  to={`/posts?category=${encodeURIComponent(cat)}`}
                  className="text-sm text-cyan-600"
                  onClick={() => setOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            {auth.user ? (
              <>
                <Link
                  to="/my-posts"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-1 border rounded"
                >
                  My Posts
                </Link>
                <button
                  onClick={() => {
                    setOpen(false);
                    navigate("/add");
                  }}
                  className="block w-full bg-cyan-600 text-white px-3 py-1 rounded"
                >
                  Add Post
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    handleLogout();
                  }}
                  className="block w-full px-3 py-1 border rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block px-3 py-1 border rounded"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="block bg-cyan-600 text-white px-3 py-1 rounded"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
