import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Lock,
  Mail,
  User,
  Building,
  ChevronLeft,
} from "lucide-react";
import Button from "../components/ui/Button";

const Login = () => {
  const [activeTab, setActiveTab] = useState("client"); // "client" or "staff"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Handle authentication logic here
      console.log("Login attempt as:", activeTab, {
        email,
        password,
        rememberMe,
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <Link
          to="/"
          className="absolute top-4 left-4 flex items-center text-[#106934] hover:text-[#0d5429] font-medium"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Home
        </Link>
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-4">
              <img
                src="/images/logo.svg"
                alt="Alpha Environmental Systems"
                className="h-12 mx-auto"
              />
            </Link>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your environmental compliance dashboard
            </p>
          </div>

          {/* Login Type Tabs */}
          <div className="flex rounded-md overflow-hidden border border-gray-300 mb-8">
            <button
              className={`flex-1 py-3 font-medium text-center transition-colors ${
                activeTab === "client"
                  ? "bg-[#106934] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("client")}
            >
              <User className="inline-block h-4 w-4 mr-2" />
              Client Login
            </button>
            <button
              className={`flex-1 py-3 font-medium text-center transition-colors ${
                activeTab === "staff"
                  ? "bg-[#106934] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setActiveTab("staff")}
            >
              <Building className="inline-block h-4 w-4 mr-2" />
              Staff Login
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#106934] focus:border-[#106934] transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-[#106934] hover:text-[#0d5429]"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#106934] focus:border-[#106934] transition"
                  placeholder="••••••••"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#106934] focus:ring-[#106934] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-[#106934] hover:bg-[#0d5429] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#106934] transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Need help accessing your account?{" "}
            <a
              href="#"
              className="font-medium text-[#106934] hover:text-[#0d5429]"
            >
              Contact support
            </a>
          </p>
        </div>
      </div>

      {/* Right side - Image and info */}
      <div className="hidden md:block md:w-1/2 bg-[#106934]">
        <div className="h-full flex flex-col justify-center px-8 lg:px-16">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-white mb-6">
              {activeTab === "client"
                ? "Client Portal Access"
                : "Staff Management System"}
            </h2>
            <p className="text-[#e6f0eb] mb-8 text-lg">
              {activeTab === "client"
                ? "Access your dashboard to track permits, manage documents, and stay updated on your environmental compliance status."
                : "Staff members can access internal tools, manage client projects, and handle environmental compliance documentation."}
            </p>
            <div className="space-y-4">
              {activeTab === "client"
                ? // Client features
                  [
                    "Real-time permit tracking",
                    "Document management system",
                    "Compliance deadline notifications",
                    "Expert support access",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-[#106934]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-white">{feature}</span>
                    </div>
                  ))
                : // Staff features
                  [
                    "Client project management",
                    "Permit application processing",
                    "Internal document collaboration",
                    "Compliance reporting tools",
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-[#106934]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-white">{feature}</span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Background decorative elements */}
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full"></div>
          <div className="absolute bottom-1/3 left-1/4 w-40 h-40 bg-white/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white/5 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;
