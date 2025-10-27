import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://drive-like-api.vercel.app/api/auth/register", form);
      navigate("/login");
    } catch (error) {
      alert(error.response.data.error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
      <div className="max-w-[450px] w-full space-y-8 p-8">
        <div className="flex flex-col items-center">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">Drive-Clone</h2>
         
          <h1 className="text-2xl font-semibold text-gray-900">Create your Drive-Clone account</h1>
          <p className="mt-2 text-gray-600">to continue to Drive-Clone</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-xl hover:shadow-2xl transition-shadow">
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="username"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
                  placeholder="Username"
                  onChange={handleChange}
                  autoComplete="username"
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  required
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
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
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base transition-all"
                  placeholder="Password"
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Use 8 or more characters with a mix of letters, numbers & symbols
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8">
              <Link 
                to="/login" 
                className="text-sm text-blue-600 hover:text-blue-800 font-semibold"
              >
                Sign in instead
              </Link>
              <button
                type="submit"
                className="px-8 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-500 rounded-lg hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Create account
              </button>
            </div>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            By creating an account, you agree to Drive's{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
