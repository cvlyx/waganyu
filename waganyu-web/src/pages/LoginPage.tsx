import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { 
  Mail, Lock, Eye, EyeOff, ArrowRight, 
  Globe, Smartphone, Zap 
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      
      // Navigation will be handled by the useEffect above
    } catch (error) {
      // Error is already handled by the login function
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
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-9 h-9 bg-[#1DB954] rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Waganyu</span>
          </motion.div>

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-white mb-2">Sign in</h1>
            <p className="text-[#B3B3B3] text-sm">
              Welcome back -- find tasks or hire professionals near you.
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.22, duration: 0.5 }}
            onSubmit={handleLogin}
            className="space-y-6"
          >
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-[#B3B3B3] mb-2 tracking-wide">
                Email
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
                  placeholder="········"
                  className="flex-1 bg-transparent text-white placeholder-[#B3B3B3] outline-none text-sm"
                  autoComplete="current-password"
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

            {/* Forgot password */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm font-medium text-[#1DB954] hover:text-[#22C55E] transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 bg-gradient-to-r from-[#059669] to-[#047857] text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign In"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </motion.form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="flex items-center gap-3 my-8"
          >
            <div className="flex-1 h-px bg-[#404040]" />
            <span className="text-sm text-[#B3B3B3]">or</span>
            <div className="flex-1 h-px bg-[#404040]" />
          </motion.div>

          {/* Social login */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="flex gap-3 mb-7"
          >
            {["Google", "Apple"].map((provider) => (
              <button
                key={provider}
                className="flex-1 flex items-center justify-center gap-2 bg-[#282828] border-2 border-[#404040] rounded-xl h-12 hover:bg-[#333333] transition-colors"
              >
                {provider === "Google" ? (
                  <Globe size={17} className="text-white" />
                ) : (
                  <Smartphone size={17} className="text-white" />
                )}
                <span className="text-sm font-medium text-white">{provider}</span>
              </button>
            ))}
          </motion.div>

          {/* Register link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex items-center justify-center"
          >
            <span className="text-sm text-[#B3B3B3]">Don't have an account?</span>
            <Link
              to="/signup"
              className="ml-1 text-sm font-semibold text-[#1DB954] hover:text-[#22C55E] transition-colors"
            >
              Register
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
