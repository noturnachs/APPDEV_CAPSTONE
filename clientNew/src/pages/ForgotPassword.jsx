import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  ChevronLeft,
} from "lucide-react";
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

      <div className="max-w-md w-full bg-white p-10 rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
          <Link to="/" className="inline-block mb-6">
            <img
              src="/images/logo.svg"
              alt="Alpha Environmental Systems"
              className="h-14 mx-auto"
            />
          </Link>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {isSubmitted ? "Check Your Email" : "Password Recovery"}
          </h2>
          <div className="w-12 h-0.5 bg-[#106934] mx-auto my-4"></div>
          <p className="text-gray-600 text-sm mb-8">
            {isSubmitted
              ? "A password reset link has been sent to your email address."
              : "Please enter your email address to receive password reset instructions."}
          </p>
        </div>

        {isSubmitted ? (
          <div>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    If an account exists for <strong>{email}</strong>, you will
                    receive an email with instructions on how to reset your
                    password.
                  </p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Please check your inbox and follow the instructions in the email. If you don't see the email in your inbox, please check your spam folder.
            </p>
            <div className="flex flex-col space-y-4 mt-8">
              <Button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="bg-[#106934] hover:bg-[#0d5429] text-white"
              >
                Try Another Email
              </Button>
              <Link
                to="/login"
                className="inline-flex justify-center items-center text-[#106934] hover:text-[#0d5429] font-medium"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to Sign In
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
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
                  className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#106934] focus:border-[#106934] transition"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="bg-[#106934] hover:bg-[#0d5429] text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-r-2 border-white rounded-full animate-spin mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  "Request Password Reset"
                )}
              </Button>
              <Link
                to="/login"
                className="inline-flex justify-center items-center text-[#106934] hover:text-[#0d5429] font-medium"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to Sign In
              </Link>
            </div>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            For security purposes, password reset links expire after 24 hours. If you need assistance, please contact our <a href="#" className="text-[#106934] hover:underline">support team</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;