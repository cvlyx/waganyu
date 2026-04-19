import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Briefcase, MapPin, Clock, DollarSign, Star, 
  Users, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppSidebar from "../components/AppSidebar";

interface MyJob {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: "fixed" | "hourly";
  location: string;
  status: "open" | "in_progress" | "completed" | "cancelled";
  applicants: number;
  createdAt: string;
  urgent: boolean;
  userId?: string; // Add userId to filter by logged-in user
}

interface WorkJob {
  id: string;
  title: string;
  description: string;
  clientName: string;
  category: string;
  budget: number;
  budgetType: "fixed" | "hourly";
  location: string;
  status: "in_progress" | "completed" | "cancelled";
  clientRating?: number;
  earnings: number;
  startedAt: string;
  completedAt?: string;
  userId?: string; // Add userId to filter by logged-in user
}

const mockMyJobs: MyJob[] = [
  {
    id: "j1",
    title: "Fix leaking kitchen sink pipe",
    description: "My kitchen sink has been leaking for 2 days. Need an experienced plumber.",
    category: "Plumbing",
    budget: 3500,
    budgetType: "fixed",
    location: "Area 47, Lilongwe",
    status: "open",
    applicants: 4,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    urgent: true,
    userId: "user_123" // Simulate logged-in user ID
  },
  {
    id: "j2",
    title: "Electrical wiring for new office",
    description: "New office setup requires complete electrical wiring. 6 rooms.",
    category: "Electrical",
    budget: 800,
    budgetType: "hourly",
    location: "City Centre, Lilongwe",
    status: "in_progress",
    applicants: 3,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    urgent: false,
    userId: "user_123" // Simulate logged-in user ID
  },
  {
    id: "j3",
    title: "House deep cleaning - 4 bedroom",
    description: "Need thorough cleaning of a 4-bedroom house before tenants move in.",
    category: "Cleaning",
    budget: 5000,
    budgetType: "fixed",
    location: "Blantyre City, Blantyre",
    status: "completed",
    applicants: 7,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    urgent: false,
    userId: "user_123" // Simulate logged-in user ID
  },
  {
    id: "j4",
    title: "Paint 3-bedroom apartment interior",
    description: "Need professional painter for 3 BHK apartment. Fresh coat on all walls.",
    category: "Painting",
    budget: 12000,
    budgetType: "fixed",
    location: "Nyambadwe, Blantyre",
    status: "cancelled",
    applicants: 5,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    urgent: false,
    userId: "user_123" // Simulate logged-in user ID
  },
  {
    id: "j5",
    title: "Garden landscaping project",
    description: "Complete garden redesign with irrigation system installation.",
    category: "Landscaping",
    budget: 15000,
    budgetType: "fixed",
    location: "Area 12, Lilongwe",
    status: "open",
    applicants: 8,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    urgent: false,
    userId: "user_123" // Simulate logged-in user ID
  },
  {
    id: "j6",
    title: "Install air conditioning units",
    description: "Need installation of 3 AC units in commercial building.",
    category: "HVAC",
    budget: 25000,
    budgetType: "fixed",
    location: "Mzuzu City, Mzuzu",
    status: "open",
    applicants: 6,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    urgent: true,
    userId: "user_123" // Simulate logged-in user ID
  }
];

// Mock work jobs for workers
const mockWorkJobs: WorkJob[] = [
  {
    id: "w1",
    title: "Kitchen cabinet installation",
    clientName: "Sarah Mwale",
    description: "Install new kitchen cabinets and countertops",
    category: "Carpentry",
    budget: 85000,
    budgetType: "fixed",
    location: "Area 25, Lilongwe",
    status: "in_progress",
    earnings: 85000,
    startedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user_123"
  },
  {
    id: "w2",
    title: "Emergency plumbing repair",
    clientName: "James Chilombo",
    description: "Fix burst pipe in commercial building",
    category: "Plumbing",
    budget: 45000,
    budgetType: "fixed",
    location: "Blantyre City, Blantyre",
    status: "completed",
    earnings: 45000,
    clientRating: 5,
    startedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    userId: "user_123"
  }
];

export default function MyJobsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<MyJob[]>([]);
  const [workJobs, setWorkJobs] = useState<WorkJob[]>([]);
  const [filter, setFilter] = useState<"all" | "open" | "in_progress" | "completed" | "cancelled">("all");
  const [loading, setLoading] = useState(true);

  // Determine if user is hirer or worker
  const isHirer = user?.intent === "hire" || user?.intent === "both";
  const isWorker = user?.intent === "find_work" || user?.intent === "both";
  const pageTitle = isHirer ? "My Requests" : isWorker ? "My Work" : "My Jobs";

  useEffect(() => {
    // Simulate API call - filter by logged-in user
    setTimeout(() => {
      const currentUserId = user?.id || "user_123"; // Fallback for demo
      
      if (isHirer) {
        const userJobs = mockMyJobs.filter(job => job.userId === currentUserId);
        setJobs(userJobs);
      }
      
      if (isWorker) {
        const userWork = mockWorkJobs.filter(job => job.userId === currentUserId);
        setWorkJobs(userWork);
      }
      
      setLoading(false);
    }, 500);
  }, [user, isHirer, isWorker]);

  const filteredJobs = filter === "all" 
    ? jobs 
    : jobs.filter(job => job.status === filter);
    
  const filteredWorkJobs = filter === "all" 
    ? workJobs 
    : workJobs.filter(job => job.status === filter);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "Just now";
    if (hours === 1) return "1 hour ago";
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-[#1DB954]/20 text-[#1DB954]";
      case "in_progress": return "bg-blue-500/20 text-blue-500";
      case "completed": return "bg-purple-500/20 text-purple-500";
      case "cancelled": return "bg-red-500/20 text-red-500";
      default: return "bg-[#404040] text-[#B3B3B3]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <AlertCircle size={12} />;
      case "in_progress": return <Clock size={12} />;
      case "completed": return <CheckCircle size={12} />;
      case "cancelled": return <XCircle size={12} />;
      default: return null;
    }
  };

  const stats = {
    total: isHirer ? jobs.length : workJobs.length,
    open: isHirer ? jobs.filter(j => j.status === "open").length : 0,
    inProgress: isHirer ? jobs.filter(j => j.status === "in_progress").length : workJobs.filter(j => j.status === "in_progress").length,
    completed: isHirer ? jobs.filter(j => j.status === "completed").length : workJobs.filter(j => j.status === "completed").length,
    earnings: isWorker ? workJobs.reduce((sum, job) => sum + job.earnings, 0) : 0
  };

  return (
    <AppSidebar>
      <div className="min-h-screen bg-[#191414]">
        {/* Header */}
        <header className="bg-[#282828] border-b border-[#404040] px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">{pageTitle}</h1>
          
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-[#191414] border border-[#404040] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-[#B3B3B3]">{isHirer ? "Total" : "Jobs"}</p>
            </div>
            {isHirer && (
              <div className="bg-[#191414] border border-[#404040] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-[#1DB954]">{stats.open}</p>
                <p className="text-xs text-[#B3B3B3]">Open</p>
              </div>
            )}
            <div className="bg-[#191414] border border-[#404040] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
              <p className="text-xs text-[#B3B3B3]">In Progress</p>
            </div>
            <div className="bg-[#191414] border border-[#404040] rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-purple-500">{stats.completed}</p>
              <p className="text-xs text-[#B3B3B3]">Completed</p>
            </div>
            {isWorker && (
              <div className="bg-[#191414] border border-[#404040] rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-green-500">MWK {stats.earnings.toLocaleString()}</p>
                <p className="text-xs text-[#B3B3B3]">Total Earnings</p>
              </div>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              ...(isHirer ? [{ key: "all", label: "All Requests" }] : [{ key: "all", label: "All Work" }]),
              ...(isHirer ? [{ key: "open", label: "Open" }] : []),
              { key: "in_progress", label: "In Progress" },
              { key: "completed", label: "Completed" },
              ...(isHirer ? [{ key: "cancelled", label: "Cancelled" }] : []),
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as typeof filter)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
                  filter === tab.key
                    ? "bg-[#1DB954] text-white"
                    : "bg-[#191414] text-[#B3B3B3] border border-[#404040] hover:border-[#1DB954]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Jobs List */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading your jobs...</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20">
            <Briefcase size={48} className="mx-auto text-[#B3B3B3] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No jobs found</h3>
            <p className="text-[#B3B3B3] mb-4">
              {filter === "all" 
                ? (isHirer ? "You haven't posted any requests yet" : "You haven't taken any work yet")
                : `No ${filter.replace("_", " ")} ${isHirer ? "requests" : "work"}`
              }
            </p>
            {isHirer && (
              <button 
                onClick={() => navigate("/post-job")}
                className="bg-[#1DB954] text-white px-6 py-3 rounded-xl hover:bg-[#1DB954]/90 transition-colors"
              >
                Post a Request
              </button>
            )}
            {isWorker && (
              <button 
                onClick={() => navigate("/workers")}
                className="bg-[#1DB954] text-white px-6 py-3 rounded-xl hover:bg-[#1DB954]/90 transition-colors"
              >
                Find Work
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-8">
            {/* Hirer View - 3 column grid */}
            {isHirer && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-[#282828] border border-[#404040] rounded-xl p-6 hover:border-[#1DB954] transition-colors cursor-pointer"
                  >
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <h3 className="text-lg font-semibold text-white line-clamp-2">{job.title}</h3>
                        {job.urgent && (
                          <span className="bg-red-500/20 text-red-500 px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0">
                            Urgent
                          </span>
                        )}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status.replace("_", " ").toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-sm text-[#B3B3B3] mb-4 line-clamp-3">{job.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-[#B3B3B3]">
                        <MapPin size={14} />
                        <span className="line-clamp-1">{job.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-[#B3B3B3]">
                          <Clock size={14} />
                          <span>{formatTimeAgo(job.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#B3B3B3]">
                          <Users size={14} />
                          <span>{job.applicants}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 text-white font-semibold text-sm">
                        <DollarSign size={14} />
                        <span>MK {job.budget.toLocaleString()}</span>
                        <span className="text-[#B3B3B3] text-xs">({job.budgetType})</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* Worker View - List */}
            {isWorker && (
              <div className="space-y-4">
                {filteredWorkJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => navigate(`/job/${job.id}`)}
                    className="bg-[#282828] border border-[#404040] rounded-xl p-6 hover:border-[#1DB954] transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(job.status)}`}>
                            {getStatusIcon(job.status)}
                            {job.status.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <p className="text-sm text-[#B3B3B3] mb-3">Client: {job.clientName}</p>
                        <p className="text-sm text-[#B3B3B3] line-clamp-2">{job.description}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[#B3B3B3]">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#B3B3B3]">
                        <Clock size={14} />
                        <span>{formatTimeAgo(job.startedAt)}</span>
                      </div>
                      {job.clientRating && (
                        <div className="flex items-center gap-2 text-yellow-500">
                          <Star size={14} />
                          <span>{job.clientRating}.0</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-green-500 font-semibold">
                        <DollarSign size={14} />
                        <span>MK {job.earnings.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      </div>
    </AppSidebar>
  );
}
