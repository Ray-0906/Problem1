// src/pages/Register.jsx
import { useState, useEffect } from "react";
import axios from "axios" ;
import {useNavigate, Link} from "react-router-dom" ;
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
  Sparkles,
  User,
  UserCheck,
  Users,
  Briefcase
} from "lucide-react";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate() ;

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength += 25;
    if (password.match(/\d/)) strength += 25;
    if (password.match(/[^a-zA-Z\d]/)) strength += 25;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
    
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post(
        "/api/auth/register",
        formData
      );

      const { token, role } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      // Success animation delay
      setTimeout(() => {
        if (role === "user") navigate("/udash");
        else if (role === "admin") navigate("/rangerdash");
        else if (role === "ecologist") navigate("/edash");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = [
    { 
      value: "user", 
      label: "Environmental Enthusiast", 
      icon: User, 
      description: "Join our community of nature lovers",
      gradient: "from-emerald-500 to-green-600"
    },
    { 
      value: "admin", 
      label: "Park Ranger / Admin", 
      icon: Shield, 
      description: "Manage conservation areas",
      gradient: "from-blue-500 to-cyan-600"
    },
    { 
      value: "ecologist", 
      label: "Biologist / Ecologist", 
      icon: Briefcase, 
      description: "Professional environmental scientist",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 25) return "bg-red-500";
    if (passwordStrength < 50) return "bg-orange-500";
    if (passwordStrength < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Weak";
    if (passwordStrength < 50) return "Fair";
    if (passwordStrength < 75) return "Good";
    return "Strong";
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

      {/* Main Signup Container */}
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="relative z-10 w-full max-w-lg">
          {/* Glassmorphic Signup Card */}
          <div className="bg-white/90 backdrop-blur-lg border border-white/20 shadow-2xl rounded-3xl p-8 relative overflow-hidden">
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
            <div className="absolute inset-[1px] bg-white/95 backdrop-blur-lg rounded-3xl"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-2">
                  Join GreenGuard
                </h1>
                <p className="text-gray-600">Create your account and start making an environmental impact</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 animate-fade-in-up">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className={`w-5 h-5 transition-colors duration-300 ${
                        focusedField === 'name' ? 'text-emerald-500' : 'text-gray-400'
                      }`} />
                    </div>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      placeholder="Enter your full name"
                      className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-xl transition-all duration-300 focus:outline-none ${
                        focusedField === 'name' 
                          ? 'border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-200/50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField('')}
                    />
                  </div>
                </div>

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
                      placeholder="Create a strong password"
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
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Password strength</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength >= 75 ? 'text-green-600' : 
                          passwordStrength >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${passwordStrength}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Role Selection */}
                <div className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    I am a...
                  </label>
                  <div className="space-y-3">
                    {roleOptions.map((option) => (
                      <label 
                        key={option.value}
                        className={`flex items-start space-x-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          formData.role === option.value 
                            ? 'border-emerald-400 bg-emerald-50 shadow-lg shadow-emerald-200/50' 
                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={option.value}
                          checked={formData.role === option.value}
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-r ${option.gradient} ${
                          formData.role === option.value ? 'shadow-lg' : ''
                        }`}>
                          <option.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-800">{option.label}</div>
                          <div className="text-sm text-gray-600">{option.description}</div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          formData.role === option.value 
                            ? 'border-emerald-500 bg-emerald-500' 
                            : 'border-gray-300'
                        }`}>
                          {formData.role === option.value && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
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
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
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

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors duration-300 hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Terms */}
              <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
                <p className="text-xs text-gray-600 text-center">
                  By creating an account, you agree to our{" "}
                  <Link to="/terms" className="text-emerald-600 hover:underline">Terms of Service</Link>
                  {" "}and{" "}
                  <Link to="/privacy" className="text-emerald-600 hover:underline">Privacy Policy</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}