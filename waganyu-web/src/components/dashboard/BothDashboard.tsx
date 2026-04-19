import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Briefcase, Users, MessageCircle, Bell, Search, 
  Plus, MapPin, Star, Clock, TrendingUp, FileText,
  DollarSign, Calendar, ArrowRight
} from "lucide-react";

export default function BothDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#191414]">
      {/* Header */}
      <header className="bg-[#282828] border-b border-[#404040] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-[#1DB954] rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Waganyu</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]" />
              <input
                type="text"
                placeholder="Search jobs or workers..."
                className="bg-[#191414] border border-[#404040] rounded-xl px-10 py-2 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] w-64"
              />
            </div>
            
            <button className="relative p-2 text-[#B3B3B3] hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#1DB954] rounded-full"></span>
            </button>
            
            <button className="relative p-2 text-[#B3B3B3] hover:text-white transition-colors">
              <MessageCircle size={20} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs text-[#B3B3B3]">Full Access</p>
              </div>
              <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name}! ???
            </h2>
            <p className="text-[#B3B3B3]">
              Manage your jobs, find work, and grow your business all in one place
            </p>
          </div>

          {/* Quick Actions - Split by role */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* As Client */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Briefcase size={18} className="text-[#1DB954]" />
                As Client
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/post-job")}
                  className="bg-gradient-to-r from-[#1DB954] to-[#047857] p-4 rounded-xl text-white"
                >
                  <Plus size={20} className="mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Post a Job</h4>
                  <p className="text-xs opacity-90">Get quotes from professionals</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/workers")}
                  className="bg-[#282828] border border-[#404040] p-4 rounded-xl text-white hover:border-[#1DB954] transition-colors"
                >
                  <Users size={20} className="mb-2 text-[#1DB954]" />
                  <h4 className="font-semibold text-sm mb-1">Browse Workers</h4>
                  <p className="text-xs text-[#B3B3B3]">Find skilled professionals</p>
                </motion.button>
              </div>
            </div>

            {/* As Worker */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Users size={18} className="text-[#1DB954]" />
                As Worker
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/workers")}
                  className="bg-gradient-to-r from-[#1DB954] to-[#047857] p-4 rounded-xl text-white"
                >
                  <Search size={20} className="mb-2" />
                  <h4 className="font-semibold text-sm mb-1">Find Jobs</h4>
                  <p className="text-xs opacity-90">Browse opportunities</p>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/my-jobs")}
                  className="bg-[#282828] border border-[#404040] p-4 rounded-xl text-white hover:border-[#1DB954] transition-colors"
                >
                  <Briefcase size={20} className="mb-2 text-[#1DB954]" />
                  <h4 className="font-semibold text-sm mb-1">My Work</h4>
                  <p className="text-xs text-[#B3B3B3]">Track your jobs</p>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Stats Cards - Combined */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Briefcase size={20} className="text-[#1DB954]" />
                <span className="text-xs text-[#B3B3B3]">Active</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">15</p>
              <p className="text-sm text-[#B3B3B3]">Total Activities</p>
            </div>
            
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign size={20} className="text-green-500" />
                <span className="text-xs text-[#B3B3B3]">This month</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">MWK 680K</p>
              <p className="text-sm text-[#B3B3B3]">Earned/Spent</p>
            </div>
            
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Star size={20} className="text-yellow-500" />
                <span className="text-xs text-[#B3B3B3]">Average</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">4.9</p>
              <p className="text-sm text-[#B3B3B3]">Rating</p>
            </div>
            
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Calendar size={20} className="text-[#1DB954]" />
                <span className="text-xs text-[#B3B3B3]">Total</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">234</p>
              <p className="text-sm text-[#B3B3B3]">Jobs Completed</p>
            </div>
          </div>

          {/* Recent Activity - Split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Job Requests */}
            <div className="bg-[#282828] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FileText size={16} className="text-[#1DB954]" />
                My Requests
              </h3>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/job/j${i}`)}
                    className="bg-[#191414] rounded-lg p-3 border border-[#404040] cursor-pointer hover:border-[#1DB954] transition-colors"
                  >
                    <h4 className="font-medium text-white text-sm mb-1">Kitchen Renovation</h4>
                    <div className="flex items-center gap-3 text-xs text-[#B3B3B3]">
                      <div className="flex items-center gap-1">
                        <MapPin size={10} />
                        <span>Lilongwe</span>
                      </div>
                      <span className="bg-[#1DB954]/20 text-[#1DB954] px-2 py-0.5 rounded-full text-xs">Active</span>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => navigate("/my-jobs")}
                  className="w-full text-center text-sm text-[#1DB954] hover:text-[#1DB954]/80 transition-colors py-2"
                >
                  View all requests <ArrowRight size={12} className="inline ml-1" />
                </button>
              </div>
            </div>

            {/* My Work */}
            <div className="bg-[#282828] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Briefcase size={16} className="text-[#1DB954]" />
                My Work
              </h3>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/job/j${i}`)}
                    className="bg-[#191414] rounded-lg p-3 border border-[#404040] cursor-pointer hover:border-[#1DB954] transition-colors"
                  >
                    <h4 className="font-medium text-white text-sm mb-1">Electrical Installation</h4>
                    <div className="flex items-center gap-3 text-xs text-[#B3B3B3]">
                      <div className="flex items-center gap-1">
                        <DollarSign size={10} />
                        <span>MWK 45K</span>
                      </div>
                      <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-xs">In Progress</span>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => navigate("/my-jobs")}
                  className="w-full text-center text-sm text-[#1DB954] hover:text-[#1DB954]/80 transition-colors py-2"
                >
                  View all work <ArrowRight size={12} className="inline ml-1" />
                </button>
              </div>
            </div>

            {/* Opportunities */}
            <div className="bg-[#282828] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Search size={16} className="text-[#1DB954]" />
                Opportunities
              </h3>
              <div className="space-y-3">
                {[1, 2].map((i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/job/j${i}`)}
                    className="bg-[#191414] rounded-lg p-3 border border-[#404040] cursor-pointer hover:border-[#1DB954] transition-colors"
                  >
                    <h4 className="font-medium text-white text-sm mb-1">Plumbing Emergency</h4>
                    <div className="flex items-center gap-3 text-xs text-[#B3B3B3]">
                      <div className="flex items-center gap-1">
                        <MapPin size={10} />
                        <span>Blantyre</span>
                      </div>
                      <span className="bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-xs">New</span>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => navigate("/workers")}
                  className="w-full text-center text-sm text-[#1DB954] hover:text-[#1DB954]/80 transition-colors py-2"
                >
                  Browse all jobs <ArrowRight size={12} className="inline ml-1" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
