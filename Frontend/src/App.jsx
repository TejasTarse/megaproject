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
import { Provider } from "react-redux";
import { store } from "./redux/store";
import MyPosts from "./pages/Myposts";

function App(){
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/posts" element={<AllPosts />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          <Route path="/add" element={<AddPost />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/edit/:slug" element={<EditPost />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
