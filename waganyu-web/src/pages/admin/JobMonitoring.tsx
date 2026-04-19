import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Briefcase, Search, Filter, Eye, Download, TrendingUp, TrendingDown,
  Users, DollarSign, Clock, CheckCircle, XCircle, AlertTriangle,
  MapPin, Calendar, Star, MessageSquare, Pause, Play, Archive
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AppSidebar from "../../components/AppSidebar";

interface MonitoredJob {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: "fixed" | "hourly";
  location: string;
  status: "active" | "completed" | "cancelled" | "disputed" | "paused";
  postedBy: {
    name: string;
    email: string;
    id: string;
  };
  assignedTo?: {
    name: string;
    email: string;
    id: string;
  };
  applicants: number;
  postedAt: string;
  deadline?: string;
  startedAt?: string;
  completedAt?: string;
  priority: "low" | "medium" | "high";
  tags: string[];
  views: number;
  reports: number;
  lastActivity: string;
}

const mockJobs: MonitoredJob[] = [
  {
    id: "1",
    title: "Electrical Installation for Kitchen Renovation",
    description: "Need complete electrical wiring for new kitchen including outlets, lighting, and appliance connections.",
    category: "Electrical",
    budget: 45000,
    budgetType: "fixed",
    location: "Lilongwe",
    status: "active",
    postedBy: {
      name: "Alice Mwale",
      email: "alice.mwale@email.com",
      id: "user_001"
    },
    assignedTo: {
      name: "John Banda",
      email: "john.banda@email.com",
      id: "worker_001"
    },
    applicants: 12,
    postedAt: "2024-04-10T08:30:00Z",
    deadline: "2024-04-25T18:00:00Z",
    startedAt: "2024-04-15T09:00:00Z",
    priority: "high",
    tags: ["urgent", "kitchen", "renovation"],
    views: 156,
    reports: 0,
    lastActivity: "2024-04-18T10:30:00Z"
  },
  {
    id: "2",
    title: "Bathroom Plumbing Repair",
    description: "Fix leaking pipes and install new fixtures in master bathroom.",
    category: "Plumbing",
    budget: 25000,
    budgetType: "fixed",
    location: "Blantyre",
    status: "disputed",
    postedBy: {
      name: "Bob Banda",
      email: "bob.banda@email.com",
      id: "user_002"
    },
    assignedTo: {
      name: "Mary Phiri",
      email: "mary.phiri@email.com",
      id: "worker_002"
    },
    applicants: 8,
    postedAt: "2024-04-08T14:20:00Z",
    deadline: "2024-04-20T18:00:00Z",
    startedAt: "2024-04-12T10:00:00Z",
    priority: "medium",
    tags: ["repair", "bathroom"],
    views: 98,
    reports: 1,
    lastActivity: "2024-04-17T16:45:00Z"
  },
  {
    id: "3",
    title: "House Deep Cleaning Service",
    description: "Complete deep cleaning of 3-bedroom house before moving in.",
    category: "Cleaning",
    budget: 15000,
    budgetType: "fixed",
    location: "Zomba",
    status: "completed",
    postedBy: {
      name: "Carol Phiri",
      email: "carol.phiri@email.com",
      id: "user_003"
    },
    assignedTo: {
      name: "Sarah Chikapa",
      email: "sarah.chikapa@email.com",
      id: "worker_003"
    },
    applicants: 15,
    postedAt: "2024-04-05T11:15:00Z",
    deadline: "2024-04-15T18:00:00Z",
    startedAt: "2024-04-08T08:00:00Z",
    completedAt: "2024-04-14T17:30:00Z",
    priority: "low",
    tags: ["cleaning", "move-in"],
    views: 87,
    reports: 0,
    lastActivity: "2024-04-14T17:30:00Z"
  },
  {
    id: "4",
    title: "Garden Landscaping Design",
    description: "Design and implement new garden layout with irrigation system.",
    category: "Gardening",
    budget: 75000,
    budgetType: "fixed",
    location: "Mzuzu",
    status: "paused",
    postedBy: {
      name: "David Mwale",
      email: "david.mwale@email.com",
      id: "user_004"
    },
    applicants: 6,
    postedAt: "2024-04-12T16:45:00Z",
    deadline: "2024-05-15T18:00:00Z",
    priority: "medium",
    tags: ["landscaping", "design", "irrigation"],
    views: 67,
    reports: 0,
    lastActivity: "2024-04-16T12:20:00Z"
  }
];

export default function JobMonitoring() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<MonitoredJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | MonitoredJob["status"]>("all");
  const [categoryFilter, setCategoryFilter] = useState<"all" | string>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | MonitoredJob["priority"]>("all");
  const [selectedJob, setSelectedJob] = useState<MonitoredJob | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(search.toLowerCase()) ||
                         job.description.toLowerCase().includes(search.toLowerCase()) ||
                         job.postedBy.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || job.category === categoryFilter;
    const matchesPriority = priorityFilter === "all" || job.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const handlePauseJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: job.status === "paused" ? "active" : "paused" as const }
        : job
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-MW', {
      style: 'currency',
      currency: 'MWK',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-500";
      case "completed": return "bg-blue-500/20 text-blue-500";
      case "cancelled": return "bg-red-500/20 text-red-500";
      case "disputed": return "bg-orange-500/20 text-orange-500";
      case "paused": return "bg-yellow-500/20 text-yellow-500";
      default: return "bg-[#404040] text-[#B3B3B3]";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-500/20 text-red-500";
      case "medium": return "bg-yellow-500/20 text-yellow-500";
      case "low": return "bg-green-500/20 text-green-500";
      default: return "bg-[#404040] text-[#B3B3B3]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Play size={16} />;
      case "completed": return <CheckCircle size={16} />;
      case "cancelled": return <XCircle size={16} />;
      case "disputed": return <AlertTriangle size={16} />;
      case "paused": return <Pause size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getCategories = () => {
    const categories = [...new Set(jobs.map(job => job.category))];
    return categories;
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
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-white">Job Monitoring</h1>
                <p className="text-[#B3B3B3]">Monitor and manage all platform jobs</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-orange-500">
                  {jobs.filter(j => j.status === "disputed").length} Disputed
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]" />
                <input
                  type="text"
                  placeholder="Search jobs by title, description, or poster..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#191414] border border-[#404040] rounded-xl pl-10 pr-4 py-2 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1DB954]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="disputed">Disputed</option>
                <option value="paused">Paused</option>
              </select>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1DB954]"
              >
                <option value="all">All Categories</option>
                {getCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1DB954]"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Briefcase className="text-blue-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{jobs.length}</p>
                  <p className="text-xs text-[#B3B3B3]">Total Jobs</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Play className="text-green-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{jobs.filter(j => j.status === "active").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Active</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-orange-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{jobs.filter(j => j.status === "disputed").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Disputed</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-blue-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{jobs.filter(j => j.status === "completed").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Completed</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <DollarSign className="text-green-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(jobs.reduce((sum, job) => sum + job.budget, 0))}</p>
                  <p className="text-xs text-[#B3B3B3]">Total Value</p>
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#282828] border border-[#404040] rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {getStatusIcon(job.status)}
                        {job.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                        {job.priority}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-[#1DB954]/20 text-[#1DB954]">
                        {job.category}
                      </span>
                    </div>
                    <p className="text-[#B3B3B3] mb-3">{job.description}</p>
                    <div className="flex items-center gap-6 text-sm text-[#B3B3B3]">
                      <div className="flex items-center gap-2">
                        <Users size={14} />
                        <span>Posted by: {job.postedBy.name}</span>
                      </div>
                      {job.assignedTo && (
                        <div className="flex items-center gap-2">
                          <Briefcase size={14} />
                          <span>Assigned to: {job.assignedTo.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} />
                        <span>{formatCurrency(job.budget)} ({job.budgetType})</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="p-2 text-[#B3B3B3] hover:text-white transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Applicants</h4>
                    <p className="text-[#B3B3B3] text-sm">{job.applicants} applications</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Views</h4>
                    <p className="text-[#B3B3B3] text-sm">{job.views} views</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Reports</h4>
                    <p className="text-[#B3B3B3] text-sm">{job.reports} reports</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-1">Posted</h4>
                    <p className="text-[#B3B3B3] text-sm">{formatDate(job.postedAt)}</p>
                  </div>
                </div>

                {job.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map(tag => (
                      <span key={tag} className="bg-[#404040] text-[#B3B3B3] px-2 py-1 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#404040]">
                  <div className="text-[#B3B3B3] text-sm">
                    Last activity: {formatDate(job.lastActivity)}
                    {job.deadline && (
                      <span className="ml-4">Deadline: {formatDate(job.deadline)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {job.status === "active" && (
                      <button
                        onClick={() => handlePauseJob(job.id)}
                        className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-xl hover:bg-yellow-500/90 transition-colors"
                      >
                        <Pause size={16} />
                        Pause
                      </button>
                    )}
                    {job.status === "paused" && (
                      <button
                        onClick={() => handlePauseJob(job.id)}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-500/90 transition-colors"
                      >
                        <Play size={16} />
                        Resume
                      </button>
                    )}
                    <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors">
                      <Archive size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase size={48} className="mx-auto text-[#B3B3B3] mb-4" />
              <h3 className="text-white font-semibold mb-2">No jobs found</h3>
              <p className="text-[#B3B3B3] text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>
    </AppSidebar>
  );
}
