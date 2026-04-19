import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Search, Filter, CheckCircle, XCircle, AlertCircle,
  Eye, Download, Star, MapPin, Briefcase, Calendar,
  Award, FileText, MessageSquare, Clock, CheckSquare
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AppSidebar from "../../components/AppSidebar";

interface WorkerApplication {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  skills: string[];
  experience: string;
  bio: string;
  rating?: number;
  previousJobs: number;
  certifications: string[];
  documents: File[];
  appliedAt: string;
  status: "pending" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

const mockApplications: WorkerApplication[] = [
  {
    id: "1",
    name: "James Mwale",
    email: "james.mwale@email.com",
    phone: "+265 991 234 567",
    location: "Lilongwe",
    skills: ["Electrical", "Plumbing", "Carpentry"],
    experience: "5 years of professional electrical work, 3 years plumbing",
    bio: "Experienced handyman with strong background in electrical and plumbing work. Certified electrician with excellent customer reviews.",
    rating: 4.7,
    previousJobs: 47,
    certifications: ["Electrical License", "Plumbing Certificate"],
    documents: [],
    appliedAt: "2024-04-15T10:30:00Z",
    status: "pending"
  },
  {
    id: "2",
    name: "Sarah Phiri",
    email: "sarah.phiri@email.com",
    phone: "+265 991 345 678",
    location: "Blantyre",
    skills: ["Cleaning", "Cooking", "Housekeeping"],
    experience: "3 years in professional cleaning services",
    bio: "Dedicated and thorough cleaning professional with experience in residential and commercial cleaning.",
    rating: 4.9,
    previousJobs: 62,
    certifications: ["Food Handling Certificate"],
    documents: [],
    appliedAt: "2024-04-14T15:45:00Z",
    status: "pending"
  },
  {
    id: "3",
    name: "Michael Banda",
    email: "michael.banda@email.com",
    phone: "+265 991 456 789",
    location: "Zomba",
    skills: ["Tutoring", "Teaching", "Mathematics"],
    experience: "4 years of teaching experience",
    bio: "Qualified teacher specializing in mathematics and science subjects for secondary school students.",
    rating: 4.5,
    previousJobs: 28,
    certifications: ["Teaching License", "Mathematics Degree"],
    documents: [],
    appliedAt: "2024-04-13T09:20:00Z",
    status: "approved",
    reviewedBy: "Admin User",
    reviewedAt: "2024-04-14T11:30:00Z"
  },
  {
    id: "4",
    name: "Grace Chikapa",
    email: "grace.chikapa@email.com",
    phone: "+265 991 567 890",
    location: "Mzuzu",
    skills: ["Gardening", "Landscaping", "Farming"],
    experience: "6 years in agricultural work",
    bio: "Experienced gardener with knowledge of local plants and sustainable farming practices.",
    rating: 4.3,
    previousJobs: 35,
    certifications: ["Agricultural Certificate"],
    documents: [],
    appliedAt: "2024-04-12T14:10:00Z",
    status: "rejected",
    reviewedBy: "Admin User",
    reviewedAt: "2024-04-13T16:45:00Z",
    rejectionReason: "Insufficient documentation provided"
  }
];

export default function SkilledWorkerApprovals() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<WorkerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedApplication, setSelectedApplication] = useState<WorkerApplication | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setApplications(mockApplications);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase()) ||
                         app.email.toLowerCase().includes(search.toLowerCase()) ||
                         app.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = (applicationId: string) => {
    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: "approved" as const,
            reviewedBy: user?.name,
            reviewedAt: new Date().toISOString()
          }
        : app
    ));
    setSelectedApplication(null);
  };

  const handleReject = (applicationId: string) => {
    if (!rejectionReason.trim()) {
      alert("Please provide a rejection reason");
      return;
    }

    setApplications(prev => prev.map(app => 
      app.id === applicationId 
        ? { 
            ...app, 
            status: "rejected" as const,
            reviewedBy: user?.name,
            reviewedAt: new Date().toISOString(),
            rejectionReason: rejectionReason.trim()
          }
        : app
    ));
    setShowRejectModal(false);
    setRejectionReason("");
    setSelectedApplication(null);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-500/20 text-yellow-500";
      case "approved": return "bg-green-500/20 text-green-500";
      case "rejected": return "bg-red-500/20 text-red-500";
      default: return "bg-[#404040] text-[#B3B3B3]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock size={16} />;
      case "approved": return <CheckCircle size={16} />;
      case "rejected": return <XCircle size={16} />;
      default: return <AlertCircle size={16} />;
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
                <h1 className="text-2xl font-bold text-white">Skilled Worker Approvals</h1>
                <p className="text-[#B3B3B3]">Review and approve skilled worker applications</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-yellow-500">
                  {applications.filter(a => a.status === "pending").length} Pending
                </span>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]" />
                <input
                  type="text"
                  placeholder="Search applications by name, email, or skills..."
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
                <option value="all">All Applications</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-yellow-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{applications.filter(a => a.status === "pending").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Pending Review</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{applications.filter(a => a.status === "approved").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Approved</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <XCircle className="text-red-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{applications.filter(a => a.status === "rejected").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Rejected</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Users className="text-blue-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{applications.length}</p>
                  <p className="text-xs text-[#B3B3B3]">Total Applications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="space-y-4">
            {filteredApplications.map((application, index) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#282828] border border-[#404040] rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{application.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{application.name}</h3>
                      <div className="flex items-center gap-4 text-[#B3B3B3] text-sm">
                        <span>{application.email}</span>
                        <span>{application.phone}</span>
                        <div className="flex items-center gap-1">
                          <MapPin size={12} />
                          {application.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      {application.status}
                    </span>
                    <button
                      onClick={() => setSelectedApplication(application)}
                      className="p-2 text-[#B3B3B3] hover:text-white transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {application.skills.map(skill => (
                        <span key={skill} className="bg-[#1DB954]/20 text-[#1DB954] px-2 py-1 rounded-full text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Experience</h4>
                    <p className="text-[#B3B3B3] text-sm">{application.experience}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Previous Jobs</h4>
                    <div className="flex items-center gap-2">
                      {application.rating && (
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-current" />
                          <span className="text-white text-sm">{application.rating}</span>
                        </div>
                      )}
                      <span className="text-[#B3B3B3] text-sm">{application.previousJobs} jobs completed</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#404040]">
                  <div className="text-[#B3B3B3] text-sm">
                    Applied: {formatDate(application.appliedAt)}
                    {application.reviewedAt && (
                      <span className="ml-4">
                        Reviewed: {formatDate(application.reviewedAt)} by {application.reviewedBy}
                      </span>
                    )}
                  </div>
                  {application.status === "pending" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(application.id)}
                        className="flex items-center gap-2 bg-[#1DB954] text-white px-4 py-2 rounded-xl hover:bg-[#1DB954]/90 transition-colors"
                      >
                        <CheckSquare size={16} />
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowRejectModal(true);
                        }}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-500/90 transition-colors"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>

                {application.rejectionReason && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                    <p className="text-red-500 text-sm">
                      <strong>Rejection Reason:</strong> {application.rejectionReason}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <Users size={48} className="mx-auto text-[#B3B3B3] mb-4" />
              <h3 className="text-white font-semibold mb-2">No applications found</h3>
              <p className="text-[#B3B3B3] text-sm">Try adjusting your search or filters</p>
            </div>
          )}
        </main>

        {/* Reject Modal */}
        {showRejectModal && selectedApplication && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#282828] border border-[#404040] rounded-xl p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-lg font-semibold text-white mb-4">Reject Application</h3>
              <p className="text-[#B3B3B3] mb-4">
                Please provide a reason for rejecting {selectedApplication.name}'s application:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full bg-[#191414] border border-[#404040] rounded-xl px-4 py-3 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] resize-none"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleReject(selectedApplication.id)}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-500/90 transition-colors"
                >
                  Reject Application
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                    setSelectedApplication(null);
                  }}
                  className="flex-1 bg-[#404040] text-white px-4 py-2 rounded-xl hover:bg-[#555555] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </AppSidebar>
  );
}
