import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // adjust path

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        setError(data.message || "Login failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/"); // redirect to home
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong!");
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-0 px-4">
        {/* Glassmorphism Card */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-md md:max-w-4xl overflow-hidden border border-white/20">
          
          {/* Left Form */}
          <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 text-center md:text-left">Welcome Back!</h2>
            <p className="mb-6 text-gray-700 text-center md:text-left">Login to your account to continue.</p>

            {error && <p className="text-red-500 mb-4 text-center md:text-left">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400 transition-all duration-300 bg-white/90"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400 transition-all duration-300 bg-white/90"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white font-semibold transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-teal-400 to-blue-500 hover:from-blue-500 hover:to-teal-400"
                }`}
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
            </form>

            <p className="mt-6 text-center text-gray-700 md:text-left">
              New here?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-teal-400 font-semibold cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </p>
          </div>

          {/* Right Image (hidden on mobile) */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center p-6">
            <img
              src="/loginimage.jpeg"
              alt="Login Visual"
              className="max-h-80 w-auto object-contain rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
