import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import useAuthStore from "../store/authStore";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    setError("");
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/auth/login", form);
      if (data?.token) {
        login(data.token);
        navigate("/");
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error) {
      setError(error.message);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="max-w-[450px] w-full space-y-8 p-8">
        <div className="flex flex-col items-center">
          <svg className="w-24 h-8 mb-6" viewBox="0 0 75 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.11 14.182l-4.545-7.889H0l9.091 15.778L14.11 14.182z" fill="#0066DA"/>
            <path d="M14.11 14.182l4.546-7.889h9.565l-9.091 15.778L14.11 14.182z" fill="#00AC47"/>
            <path d="M4.545 22.071h19.13l4.546-7.889H0l4.545 7.889z" fill="#EA4335"/>
          </svg>
          <h1 className="text-2xl font-normal text-gray-900">Sign in</h1>
          <p className="mt-2 text-sm text-gray-600">to continue to Drive</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white rounded-lg border border-gray-300 p-8 shadow-sm hover:shadow-md transition-shadow">
            {error && (
              <div className="mb-4 p-3 rounded bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  disabled={isLoading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Email"
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  required
                  disabled={isLoading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-base disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Password"
                  onChange={handleChange}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="mt-6">
              <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Forgot password?
              </Link>
            </div>

            <div className="flex items-center justify-between mt-8">
              <Link
                to="/register"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Create account
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Not your computer? Use Guest mode to sign in privately.</p>
          <a href="#" className="text-blue-600 hover:text-blue-800 font-medium ml-1">
            Learn more
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;