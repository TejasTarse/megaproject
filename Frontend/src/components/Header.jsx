import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { CATEGORIES } from "../utils/categories";
import { useState } from "react";

export default function Header(){
  const auth = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(false);

  const user = auth.user;
  const role = user?.role;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 flex items-center justify-between py-3">
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-2xl font-bold">MyBlog</Link>

          {/* Primary link always visible */}
          
          
        </div>

        <nav className="flex items-center space-x-4">
          {/* When not logged in: show Login / Signup only */}
          {!user && (
            <>
              <Link to="/login" className="px-3 py-1 border rounded">Login</Link>
              <Link to="/signup" className="px-3 py-1 bg-cyan-600 text-white rounded">Sign up</Link>
            </>
          )}

          {/* When logged in: show MyPosts, Add Post, (All Users if admin), and user menu */}
          {user && (
            <>
              
                <Link to="/posts" className="text-gray-600 hover:text-cyan-600">All Posts</Link>

              {/* My Posts (shows posts for the logged-in user, implement page separately) */}
              <Link to="/my-posts" className="px-3 py-1 rounded hover:text-cyan-600">My Posts</Link>

              {/* Add Post */}
              <button onClick={()=>navigate("/add")} className="bg-cyan-600 text-white px-3 py-1 rounded">Add Post</button>

              {/* Compact user menu */}
              <div className="relative">
                <button
                      onClick={() => { setOpenMenu(false); handleLogout(); }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      Logout
                    </button>

                {/* dropdown */}
                {openMenu && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                    <Link to="/profile" onClick={()=>setOpenMenu(false)} className="block px-3 py-2 hover:bg-gray-50">Profile</Link>
                    <button
                      onClick={() => { setOpenMenu(false); handleLogout(); }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
