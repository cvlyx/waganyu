import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  AlertTriangle, Search, Filter, Eye, Download, MessageSquare,
  User, Briefcase, Star, Calendar, Clock, CheckCircle, XCircle,
  Flag, Shield, Ban, Archive, ExternalLink
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AppSidebar from "../../components/AppSidebar";

interface Report {
  id: string;
  type: "complaint" | "dispute" | "fraud" | "inappropriate" | "other";
  title: string;
  description: string;
  reportedBy: {
    name: string;
    email: string;
    id: string;
  };
  reportedUser?: {
    name: string;
    email: string;
    id: string;
  };
  reportedJob?: {
    id: string;
    title: string;
  };
  priority: "low" | "medium" | "high" | "critical";
  status: "pending" | "investigating" | "resolved" | "dismissed";
  submittedAt: string;
  updatedAt?: string;
  assignedTo?: string;
  resolution?: string;
  attachments?: string[];
  evidence?: string[];
}

const mockReports: Report[] = [
  {
    id: "1",
    type: "complaint",
    title: "Poor quality electrical work",
    description: "The worker did not complete the electrical installation properly and left wires exposed. This is a safety hazard.",
    reportedBy: {
      name: "Alice Mwale",
      email: "alice.mwale@email.com",
      id: "user_001"
    },
    reportedUser: {
      name: "John Banda",
      email: "john.banda@email.com",
      id: "worker_001"
    },
    reportedJob: {
      id: "job_001",
      title: "Electrical Installation for Kitchen"
    },
    priority: "high",
    status: "pending",
    submittedAt: "2024-04-18T08:30:00Z"
  },
  {
    id: "2",
    type: "dispute",
    title: "Payment dispute for completed plumbing work",
    description: "Worker completed the job but client is refusing to pay full amount claiming work was not satisfactory.",
    reportedBy: {
      name: "Mary Phiri",
      email: "mary.phiri@email.com",
      id: "worker_002"
    },
    reportedUser: {
      name: "Bob Banda",
      email: "bob.banda@email.com",
      id: "user_002"
    },
    reportedJob: {
      id: "job_002",
      title: "Bathroom Plumbing Repair"
    },
    priority: "medium",
    status: "investigating",
    submittedAt: "2024-04-17T14:20:00Z",
    updatedAt: "2024-04-18T09:15:00Z",
    assignedTo: "Admin User"
  },
  {
    id: "3",
    type: "fraud",
    title: "Fake job posting scam",
    description: "User reported a suspicious job posting that appears to be a scam asking for upfront payment.",
    reportedBy: {
      name: "Samuel Chikapa",
      email: "samuel.chikapa@email.com",
      id: "user_003"
    },
    reportedJob: {
      id: "job_003",
      title: "Urgent Data Entry Work - High Pay"
    },
    priority: "critical",
    status: "resolved",
    submittedAt: "2024-04-16T11:45:00Z",
    updatedAt: "2024-04-17T16:30:00Z",
    assignedTo: "Admin User",
    resolution: "Job posting removed and user banned for fraudulent activity"
  },
  {
    id: "4",
    type: "inappropriate",
    title: "Inappropriate messages in chat",
    description: "Worker sending inappropriate and harassing messages to client through the platform chat.",
    reportedBy: {
      name: "Carol Phiri",
      email: "carol.phiri@email.com",
      id: "user_004"
    },
    reportedUser: {
      name: "David Mwale",
      email: "david.mwale@email.com",
      id: "worker_003"
    },
    priority: "high",
    status: "investigating",
    submittedAt: "2024-04-15T16:10:00Z",
    updatedAt: "2024-04-16T10:20:00Z",
    assignedTo: "Admin User"
  }
];

export default function ReportsComplaints() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | Report["type"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | Report["status"]>("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | Report["priority"]>("all");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReports(mockReports);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(search.toLowerCase()) ||
                         report.description.toLowerCase().includes(search.toLowerCase()) ||
                         report.reportedBy.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || report.priority === priorityFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPriority;
  });

  const handleAssignReport = (reportId: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: "investigating" as const,
            assignedTo: user?.name,
            updatedAt: new Date().toISOString()
          }
        : report
    ));
  };

  const handleResolveReport = (reportId: string, resolution: string) => {
    setReports(prev => prev.map(report => 
      report.id === reportId 
        ? { 
            ...report, 
            status: "resolved" as const,
            resolution,
            updatedAt: new Date().toISOString()
          }
        : report
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "complaint": return "bg-orange-500/20 text-orange-500";
      case "dispute": return "bg-blue-500/20 text-blue-500";
      case "fraud": return "bg-red-500/20 text-red-500";
      case "inappropriate": return "bg-purple-500/20 text-purple-500";
      default: return "bg-[#404040] text-[#B3B3B3]";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-500";
      case "high": return "bg-orange-500/20 text-orange-500";
      case "medium": return "bg-yellow-500/20 text-yellow-500";
      case "low": return "bg-green-500/20 text-green-500";
      default: return "bg-[#404040] text-[#B3B3B3]";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-500";
      case "investigating": return "bg-blue-500/20 text-blue-500";
      case "resolved": return "bg-green-500/20 text-green-500";
      case "dismissed": return "bg-gray-500/20 text-gray-500";
      default: return "bg-[#404040] text-[#B3B3B3]";
    }
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
                <h1 className="text-2xl font-bold text-white">Reports & Complaints</h1>
                <p className="text-[#B3B3B3]">Manage user reports and platform complaints</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-red-500">
                  {reports.filter(r => r.priority === "critical").length} Critical
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]" />
                <input
                  type="text"
                  placeholder="Search reports by title, description, or reporter..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#191414] border border-[#404040] rounded-xl pl-10 pr-4 py-2 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954]"
                />
              </div>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as any)}
                className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1DB954]"
              >
                <option value="all">All Types</option>
                <option value="complaint">Complaint</option>
                <option value="dispute">Dispute</option>
                <option value="fraud">Fraud</option>
                <option value="inappropriate">Inappropriate</option>
                <option value="other">Other</option>
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1DB954]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
                <option value="dismissed">Dismissed</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value as any)}
                className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1DB954]"
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
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
                <AlertTriangle className="text-red-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{reports.filter(r => r.priority === "critical").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Critical</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Flag className="text-orange-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{reports.filter(r => r.priority === "high").length}</p>
                  <p className="text-xs text-[#B3B3B3]">High Priority</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Clock className="text-yellow-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{reports.filter(r => r.status === "pending").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Pending</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Shield className="text-blue-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{reports.filter(r => r.status === "investigating").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Investigating</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{reports.filter(r => r.status === "resolved").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Resolved</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {filteredReports.map((report, index) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#282828] border border-[#404040] rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-white">{report.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(report.type)}`}>
                        {report.type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-[#B3B3B3] mb-3">{report.description}</p>
                    <div className="flex items-center gap-6 text-sm text-[#B3B3B3]">
                      <div className="flex items-center gap-2">
                        <User size={14} />
                        <span>Reported by: {report.reportedBy.name}</span>
                      </div>
                      {report.reportedUser && (
                        <div className="flex items-center gap-2">
                          <Flag size={14} />
                          <span>Against: {report.reportedUser.name}</span>
                        </div>
                      )}
                      {report.reportedJob && (
                        <div className="flex items-center gap-2">
                          <Briefcase size={14} />
                          <span>Job: {report.reportedJob.title}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>{formatDate(report.submittedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedReport(report)}
                    className="p-2 text-[#B3B3B3] hover:text-white transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#404040]">
                  <div className="text-[#B3B3B3] text-sm">
                    {report.assignedTo ? (
                      <span>Assigned to: {report.assignedTo}</span>
                    ) : (
                      <span>Unassigned</span>
                    )}
                    {report.updatedAt && (
                      <span className="ml-4">Updated: {formatDate(report.updatedAt)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === "pending" && (
                      <button
                        onClick={() => handleAssignReport(report.id)}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-500/90 transition-colors"
                      >
                        <Shield size={16} />
                        Assign to Me
                      </button>
                    )}
                    {report.status === "investigating" && report.assignedTo === user?.name && (
                      <button
                        onClick={() => {
                          const resolution = prompt("Enter resolution details:");
                          if (resolution) {
                            handleResolveReport(report.id, resolution);
                          }
                        }}
                        className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-500/90 transition-colors"
                      >
                        <CheckCircle size={16} />
                        Mark Resolved
                      </button>
                    )}
                    <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors">
                      <Archive size={16} />
                    </button>
                  </div>
                </div>

                {report.resolution && (
                  <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                    <p className="text-green-500 text-sm">
                      <strong>Resolution:</strong> {report.resolution}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle size={48} className="mx-auto text-[#B3B3B3] mb-4" />
              <h3 className="text-white font-semibold mb-2">No reports found</h3>
              <p className="text-[#B3B3B3] text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </main>
      </div>
    </AppSidebar>
  );
}
