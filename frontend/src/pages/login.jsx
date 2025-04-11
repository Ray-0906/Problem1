import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      console.log(res);
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      if (role === "user") navigate("/udash");
      else if (role === "admin") navigate("/rangerdash");
      else if (role === "ecologist") navigate("/edash");
   // fallback
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
          GreenGuard Login
        </h2>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-xl hover:bg-green-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <a href="/signup" className="text-green-600 underline">Register</a>
        </p>
      </div>
    </div>
  );
}
