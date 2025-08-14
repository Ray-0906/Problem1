import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../utils/axios";
import { 
  Leaf, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Shield,
  TreePine,
  Globe,
  AlertCircle,
  CheckCircle,
  Sparkles
} from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/api/auth/login", formData);
      
      const { token, role } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", res.data._id);
      console.log("Login successful:", localStorage.getItem("userId"));
      console.log("Login successful:", localStorage.getItem("role"));

      // Success animation delay
      setTimeout(() => {
        if (role === "user") navigate("/udash");
        else if (role === "admin") navigate("/rangerdash");
        else if (role === "ecologist") navigate("/edash");
      }, 1000);
   // fallback
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-green-300 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-teal-300 rounded-full opacity-10 animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/3 w-32 h-32 bg-emerald-400 rounded-full opacity-15 animate-bounce"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Leaf className="absolute top-1/4 left-1/4 w-8 h-8 text-emerald-400 opacity-40 animate-float" />
        <TreePine className="absolute top-3/4 right-1/4 w-6 h-6 text-green-400 opacity-40 animate-float delay-1000" />
        <Globe className="absolute bottom-1/3 left-1/3 w-7 h-7 text-teal-400 opacity-40 animate-float delay-2000" />
        <Shield className="absolute top-1/2 right-1/4 w-5 h-5 text-emerald-500 opacity-40 animate-float delay-1500" />
      </div>

      {/* Back to Homepage Link */}
      <div className="absolute top-8 left-8 z-10">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-emerald-700 hover:text-emerald-800 transition-colors duration-300 group"
        >
          <div className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
            <Leaf className="w-5 h-5" />
          </div>
          <span className="font-semibold">GreenGuard</span>
        </Link>
      </div>

      {/* Achievement Badge */}
      <div className="absolute top-8 right-8 z-10">
        <div className="bg-white/80 backdrop-blur-md border border-emerald-200 rounded-full px-4 py-2 shadow-lg">
          <div className="flex items-center space-x-2 text-emerald-700">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold text-sm">🏆 Award Winning Platform</span>
          </div>
        </div>
      </div>

      {/* Main Login Container */}
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="relative z-10 w-full max-w-md">
          {/* Glassmorphic Login Card */}
          <div className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="absolute inset-[1px] bg-white/95 backdrop-blur-lg rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                  Welcome Back
                </h1>
                <p className="text-gray-600">Sign in to your GreenGuard account</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 animate-fade-in-up">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className={`w-5 h-5 transition-colors duration-300 ${
                        focusedField === 'email' ? 'text-emerald-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                        focusedField === 'email' 
                          ? 'border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-200/50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField('')}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className={`w-5 h-5 transition-colors duration-300 ${
                        focusedField === 'password' ? 'text-emerald-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                        focusedField === 'password' 
                          ? 'border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-200/50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField('')}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-emerald-500 transition-colors duration-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors duration-300"
                  >
                    Forgot your password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                        Signing In...
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-green-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </form>

              {/* Divider */}
              <div className="my-8 flex items-center">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <span className="px-4 text-sm text-gray-500 bg-white">or</span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link 
                    to="/signup" 
                    className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-300 hover:underline"
                  >
                    Create Account
                  </Link>
                </p>
              </div>

              {/* Platform Info */}
              <div className="mt-8 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                <div className="flex items-center justify-center space-x-2 text-emerald-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">AI-Powered Environmental Platform</span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: Shield, label: "Secure Login" },
              { icon: Leaf, label: "Plant ID" },
              { icon: Globe, label: "Global Impact" }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white/80 backdrop-blur-md rounded-xl p-4 text-center border border-white/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <feature.icon className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <span className="text-sm font-medium text-gray-700">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
