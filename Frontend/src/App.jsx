import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AllPosts from "./pages/AllPosts";
import PostDetail from "./pages/PostDetail";
import AddPost from "./pages/AddPost";
import EditPost from "./pages/EditPost";
import MyPosts from "./pages/MyPosts";
import { Provider } from "react-redux";
import { store } from "./redux/store";

function App(){
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <main className="min-h-[calc(100vh-160px)]"> {/* keep footer visible */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/posts" element={<AllPosts />} />
            <Route path="/post/:slug" element={<PostDetail />} />
            <Route path="/add" element={<AddPost />} />
            <Route path="/edit/:slug" element={<EditPost />} />
            <Route path="/my-posts" element={<MyPosts />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
