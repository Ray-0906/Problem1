// src/pages/Register.jsx
import { useState } from "react";
import axios from "axios" ;
import {useNavigate} from "react-router-dom" ;
import axiosInstance from "../utils/axios";


export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const navigate = useNavigate() ;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // setError("");

    try {
      const res = await axiosInstance.post(
        "/api/auth/register",
        formData
      );

      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      if (role === "user") navigate("/udash");
      else if (role === "admin") navigate("/rangerdash");
      else if (role === "ecologist") navigate("/edash");
    } catch (err) {
      // setError(err.response?.data?.error || "Something went wrong.");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Full Name"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
            onChange={handleChange}
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="ecologist">Biologist / Ecologist</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-xl hover:bg-green-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="/login" className="text-green-600 underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}