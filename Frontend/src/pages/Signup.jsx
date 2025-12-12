import { useState } from "react";
import { useDispatch } from "react-redux";
import { signup } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function Signup(){
  const [form, setForm] = useState({ name:"", email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(signup(form));
    if (res.meta.requestStatus === "fulfilled") navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Sign up</h2>
        <input className="w-full border p-2 mb-3" placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
        <input className="w-full border p-2 mb-3" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
        <input type="password" className="w-full border p-2 mb-4" placeholder="Password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
        <button className="w-full bg-cyan-600 text-white py-2 rounded">Create account</button>
      </form>
    </div>
  )
}
