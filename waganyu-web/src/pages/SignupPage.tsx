import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  User, Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Zap 
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      if (user.profileComplete) {
        navigate("/dashboard");
      } else {
        navigate("/setup");
      }
    }
  }, [user, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
      
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error is already handled by the register function
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#191414] flex flex-col">
      {/* Top accent */}
      <div className="h-1 w-full bg-[#1DB954]" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Top row with back button and brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="flex items-center gap-4 mb-7"
          >
            <Link
              to="/"
              className="w-9 h-9 bg-[#282828] border-2 border-[#404040] rounded-xl flex items-center justify-center hover:bg-[#333333] transition-colors"
            >
              <ArrowLeft size={18} className="text-white" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#1DB954] rounded-xl flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">Waganyu</span>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6"
          >
            <h1 className="text-3xl font-bold text-white mb-2">Create account</h1>
            <p className="text-[#B3B3B3] text-sm">
              Join thousands of Malawians earning and getting work done.
            </p>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="flex items-center justify-center mb-7"
          >
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step === 1 ? "bg-[#1DB954]" : "bg-[#404040]"
                    }`}
                  >
                    {step === 1 ? (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    ) : (
                      <span className="text-xs font-bold text-[#B3B3B3]">{step}</span>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      step === 1 ? "text-[#1DB954]" : "text-[#B3B3B3]"
                    }`}
                  >
                    {step === 1 ? "Account" : step === 2 ? "Profile" : "Done"}
                  </span>
                </div>
                {step < 3 && (
                  <div className="w-7 h-0.5 bg-[#404040] mx-1" />
                )}
              </div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            onSubmit={handleSignup}
            className="space-y-6"
          >
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-[#B3B3B3] mb-2 tracking-wide">
                Full Name
              </label>
              <div
                className={`flex items-center bg-[#282828] rounded-xl border-2 px-4 h-12 transition-colors ${
                  focused === "name" ? "border-[#1DB954]" : "border-[#404040]"
                }`}
              >
                <User
                  size={16}
                  className={focused === "name" ? "text-[#1DB954]" : "text-[#B3B3B3]"}
                  style={{ marginRight: "10px" }}
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused(null)}
                  placeholder="e.g. Chisomo Phiri"
                  className="flex-1 bg-transparent text-white placeholder-[#B3B3B3] outline-none text-sm"
                  autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#B3B3B3] mb-2 tracking-wide">
                Email Address
              </label>
              <div
                className={`flex items-center bg-[#282828] rounded-xl border-2 px-4 h-12 transition-colors ${
                  focused === "email" ? "border-[#1DB954]" : "border-[#404040]"
                }`}
              >
                <Mail
                  size={16}
                  className={focused === "email" ? "text-[#1DB954]" : "text-[#B3B3B3]"}
                  style={{ marginRight: "10px" }}
                />
                <input
                  ref={emailRef}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused(null)}
                  placeholder="you@example.com"
                  className="flex-1 bg-transparent text-white placeholder-[#B3B3B3] outline-none text-sm"
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#B3B3B3] mb-2 tracking-wide">
                Password
              </label>
              <div
                className={`flex items-center bg-[#282828] rounded-xl border-2 px-4 h-12 transition-colors ${
                  focused === "password" ? "border-[#1DB954]" : "border-[#404040]"
                }`}
              >
                <Lock
                  size={16}
                  className={focused === "password" ? "text-[#1DB954]" : "text-[#B3B3B3]"}
                  style={{ marginRight: "10px" }}
                />
                <input
                  ref={passwordRef}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused(null)}
                  placeholder="At least 6 characters"
                  className="flex-1 bg-transparent text-white placeholder-[#B3B3B3] outline-none text-sm"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#B3B3B3] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms hint */}
            <p className="text-xs text-[#B3B3B3] text-center leading-relaxed">
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </p>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-gradient-to-r from-[#059669] to-[#047857] text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Continue"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </motion.form>

          {/* Login link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="flex items-center justify-center mt-6"
          >
            <span className="text-sm text-[#B3B3B3]">Already have an account?</span>
            <Link
              to="/login"
              className="ml-1 text-sm font-semibold text-[#1DB954] hover:text-[#22C55E] transition-colors"
            >
              Sign In
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
