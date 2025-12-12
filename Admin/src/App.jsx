import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Posts from "./pages/Posts";
import Analytics from "./pages/Analytics";
import NotAuthorized from "./pages/NotAuthorized";
import AdminRoute from "./AdminRoute";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />
                <Route path="/users" element={<AdminRoute><Users /></AdminRoute>} />
                <Route path="/posts" element={<AdminRoute><Posts /></AdminRoute>} />
                <Route path="/analytics" element={<AdminRoute><Analytics /></AdminRoute>} />

                <Route path="*" element={<NotAuthorized />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
