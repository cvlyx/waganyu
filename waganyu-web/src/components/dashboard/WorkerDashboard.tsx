import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { 
  Briefcase, Users, MessageCircle, Bell, Search, 
  MapPin, Star, Clock, TrendingUp,
  DollarSign, Calendar
} from "lucide-react";

export default function WorkerDashboard() {
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
                placeholder="Search jobs..."
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
                <p className="text-xs text-[#B3B3B3]">Worker</p>
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
              Discover new opportunities and manage your work efficiently
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/workers")}
              className="bg-gradient-to-r from-[#1DB954] to-[#047857] p-6 rounded-xl text-white"
            >
              <Search size={24} className="mb-3" />
              <h3 className="font-semibold mb-1">Find Jobs</h3>
              <p className="text-sm opacity-90">Browse available jobs in your area</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/my-jobs")}
              className="bg-[#282828] border border-[#404040] p-6 rounded-xl text-white hover:border-[#1DB954] transition-colors"
            >
              <Briefcase size={24} className="mb-3 text-[#1DB954]" />
              <h3 className="font-semibold mb-1">My Work</h3>
              <p className="text-sm text-[#B3B3B3]">Track your active and completed jobs</p>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/profile")}
              className="bg-[#282828] border border-[#404040] p-6 rounded-xl text-white hover:border-[#1DB954] transition-colors"
            >
              <Users size={24} className="mb-3 text-[#1DB954]" />
              <h3 className="font-semibold mb-1">My Profile</h3>
              <p className="text-sm text-[#B3B3B3]">Update your skills and availability</p>
            </motion.button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <Briefcase size={20} className="text-[#1DB954]" />
                <span className="text-xs text-[#B3B3B3]">Active</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">8</p>
              <p className="text-sm text-[#B3B3B3]">Current Jobs</p>
            </div>
            
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <DollarSign size={20} className="text-green-500" />
                <span className="text-xs text-[#B3B3B3]">This month</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">MWK 450K</p>
              <p className="text-sm text-[#B3B3B3]">Earnings</p>
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
              <p className="text-2xl font-bold text-white mb-1">156</p>
              <p className="text-sm text-[#B3B3B3]">Jobs Completed</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Jobs */}
            <div className="bg-[#282828] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">New Job Opportunities</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/job/j${i}`)}
                    className="bg-[#191414] rounded-lg p-4 border border-[#404040] cursor-pointer hover:border-[#1DB954] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white">Home Renovation Project</h4>
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">New</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#B3B3B3] mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>Lilongwe</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>MWK 50K</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#B3B3B3]">Looking for experienced carpenter for kitchen renovation...</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Work */}
            <div className="bg-[#282828] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Work</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    onClick={() => navigate(`/job/j${i}`)}
                    className="bg-[#191414] rounded-lg p-4 border border-[#404040] cursor-pointer hover:border-[#1DB954] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white">Plumbing Repair</h4>
                      <span className="text-xs bg-blue-500/20 text-blue-500 px-2 py-1 rounded-full">Completed</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[#B3B3B3] mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin size={12} />
                        <span>Blantyre</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>3 days ago</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#B3B3B3]">
                      <Star size={12} className="text-yellow-500" />
                      <span>5.0 rating from client</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
