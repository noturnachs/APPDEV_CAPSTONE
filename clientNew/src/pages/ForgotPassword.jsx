import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, ChevronLeft } from "lucide-react";
import Button from "../components/ui/Button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      // Handle password reset logic here
      console.log("Password reset requested for:", email);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center text-[#106934] hover:text-[#0d5429] font-medium"
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        Back to Home
      </Link>

      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <Link to="/" className="block text-center mb-4">
            <img
              src="/images/logo.svg"
              alt="Alpha Environmental Systems"
              className="h-12 mx-auto"
            />
          </Link>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            {isSubmitted ? "Check Your Email" : "Reset Your Password"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSubmitted
              ? "We've sent a password reset link to your email address."
              : "Enter your email address and we'll send you a link to reset your password."}
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#106934]/10 mb-6">
              <CheckCircle className="h-8 w-8 text-[#106934]" />
            </div>
            <p className="text-gray-600 mb-6">
              If an account exists for <strong>{email}</strong>, you will
              receive an email with instructions on how to reset your password.
            </p>
            <p className="text-gray-600 mb-8">
              Didn't receive an email? Check your spam folder or request another
              reset link.
            </p>
            <div className="flex flex-col space-y-4">
              <Button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="bg-[#106934] hover:bg-[#0d5429] text-white font-bold"
              >
                Try Another Email
              </Button>
              <Link
                to="/login"
                className="inline-flex justify-center items-center text-[#106934] hover:text-[#0d5429] font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
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

            <div className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="bg-[#106934] hover:bg-[#0d5429] text-white font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
              <Link
                to="/login"
                className="inline-flex justify-center items-center text-[#106934] hover:text-[#0d5429] font-medium"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
