import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, AlertTriangle, TrendingUp,
  Clock, DollarSign,
  UserCheck, MessageSquare
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AppSidebar from "../../components/AppSidebar";

interface AdminStats {
  totalUsers: number;
  activeJobs: number;
  pendingApprovals: number;
  totalReports: number;
  revenue: number;
  userGrowth: number;
  jobCompletionRate: number;
  avgResponseTime: string;
}

const mockStats: AdminStats = {
  totalUsers: 1247,
  activeJobs: 342,
  pendingApprovals: 28,
  totalReports: 15,
  revenue: 2450000,
  userGrowth: 18.5,
  jobCompletionRate: 92.3,
  avgResponseTime: "2.4 hours"
};

const recentActivities = [
  {
    id: "1",
    type: "user_registration",
    message: "New user registered: John Banda",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    icon: Users,
    color: "text-green-500"
  },
  {
    id: "2", 
    type: "job_posted",
    message: "New job posted: Electrical Installation needed",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    icon: Briefcase,
    color: "text-blue-500"
  },
  {
    id: "3",
    type: "report_filed",
    message: "New report filed against worker",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    icon: AlertTriangle,
    color: "text-red-500"
  },
  {
    id: "4",
    type: "payment_processed",
    message: "Payment processed: MWK 25,000",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    icon: DollarSign,
    color: "text-green-500"
  }
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>(mockStats);
  const [activities, setActivities] = useState(recentActivities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <AppSidebar>
        <div className="min-h-screen bg-[#191414] flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-[#1DB954] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AppSidebar>
    );
  }

  return (
    <AppSidebar>
      <div className="min-h-screen bg-[#191414]">
        {/* Header */}
        <header className="bg-[#282828] border-b border-[#404040] px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-[#B3B3B3]">Welcome back, {user?.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-green-500">System Online</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#282828] border border-[#404040] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Users className="text-blue-500" size={24} />
                </div>
                <span className="text-xs text-green-500 font-medium">+{stats.userGrowth}%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.totalUsers.toLocaleString()}</h3>
              <p className="text-[#B3B3B3] text-sm">Total Users</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#282828] border border-[#404040] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <Briefcase className="text-green-500" size={24} />
                </div>
                <span className="text-xs text-[#B3B3B3]">Active</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.activeJobs}</h3>
              <p className="text-[#B3B3B3] text-sm">Active Jobs</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#282828] border border-[#404040] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="text-yellow-500" size={24} />
                </div>
                <span className="text-xs text-yellow-500 font-medium">Pending</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{stats.pendingApprovals}</h3>
              <p className="text-[#B3B3B3] text-sm">Approvals</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#282828] border border-[#404040] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <DollarSign className="text-purple-500" size={24} />
                </div>
                <span className="text-xs text-green-500 font-medium">+12%</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-1">{formatCurrency(stats.revenue)}</h3>
              <p className="text-[#B3B3B3] text-sm">Total Revenue</p>
            </motion.div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-[#282828] border border-[#404040] rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Performance Metrics</h3>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#B3B3B3]">Job Completion Rate</span>
                  <span className="text-green-500 font-medium">{stats.jobCompletionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#B3B3B3]">Avg Response Time</span>
                  <span className="text-blue-500 font-medium">{stats.avgResponseTime}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#B3B3B3]">User Satisfaction</span>
                  <span className="text-yellow-500 font-medium">4.8/5.0</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#282828] border border-[#404040] rounded-xl p-6 lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                <Clock className="text-[#B3B3B3]" size={20} />
              </div>
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-[#191414] rounded-lg"
                  >
                    <activity.icon className={activity.color} size={16} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{activity.message}</p>
                      <p className="text-[#B3B3B3] text-xs">{formatTimeAgo(activity.timestamp)}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-[#282828] border border-[#404040] rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              <button className="flex flex-col items-center gap-2 p-4 bg-[#191414] rounded-xl hover:bg-[#333333] transition-colors">
                <UserCheck className="text-green-500" size={24} />
                <span className="text-white text-sm">Approve Users</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-[#191414] rounded-xl hover:bg-[#333333] transition-colors">
                <MessageSquare className="text-blue-500" size={24} />
                <span className="text-white text-sm">View Reports</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-[#191414] rounded-xl hover:bg-[#333333] transition-colors">
                <AlertTriangle className="text-yellow-500" size={24} />
                <span className="text-white text-sm">Pending Issues</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-[#191414] rounded-xl hover:bg-[#333333] transition-colors">
                <TrendingUp className="text-purple-500" size={24} />
                <span className="text-white text-sm">Analytics</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-[#191414] rounded-xl hover:bg-[#333333] transition-colors">
                <DollarSign className="text-green-500" size={24} />
                <span className="text-white text-sm">Revenue</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-[#191414] rounded-xl hover:bg-[#333333] transition-colors">
                <Users className="text-blue-500" size={24} />
                <span className="text-white text-sm">User Stats</span>
              </button>
            </div>
          </motion.div>
        </main>
      </div>
    </AppSidebar>
  );
}
