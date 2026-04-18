import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, MapPin, Clock, DollarSign, Star, 
  MessageCircle, Bookmark, BookmarkCheck, Send,
  Calendar, Users, Zap, Briefcase
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppNavigation from "../components/AppNavigation";

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  budgetType: "fixed" | "hourly";
  location: string;
  status: string;
  posterId: string;
  posterName: string;
  posterRating: number;
  posterAvatar?: string;
  applicants: number;
  createdAt: string;
  urgent: boolean;
  skills?: string[];
}

const mockJobs: Job[] = [
  {
    id: "j1",
    title: "Fix leaking kitchen sink pipe",
    description: "My kitchen sink has been leaking for 2 days. Need an experienced plumber to fix the pipe under the sink. Parts may be needed. Please bring your own tools and equipment. The leak is coming from the main pipe connection and requires immediate attention to prevent water damage.",
    category: "Plumbing",
    budget: 3500,
    budgetType: "fixed",
    location: "Area 47, Lilongwe",
    status: "open",
    posterId: "1",
    posterName: "Sarah K.",
    posterRating: 4.7,
    applicants: 4,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    urgent: true,
    skills: ["Plumbing", "Pipe Repair"],
  },
  {
    id: "j2",
    title: "House deep cleaning - 4 bedroom",
    description: "Need thorough cleaning of a 4-bedroom house before tenants move in. Windows, floors, bathrooms, kitchen included. Must be detail-oriented and reliable. Cleaning supplies will be provided, but you can bring your own if preferred.",
    category: "Cleaning",
    budget: 5000,
    budgetType: "fixed",
    location: "Blantyre City, Blantyre",
    status: "open",
    posterId: "3",
    posterName: "David M.",
    posterRating: 4.5,
    applicants: 7,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    urgent: false,
    skills: ["Cleaning", "Deep Clean"],
  },
];

export default function JobDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundJob = mockJobs.find(j => j.id === id);
      setJob(foundJob || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleApply = () => {
    if (applied) return;
    setApplied(true);
    alert("Application sent! The job poster will contact you soon.");
  };

  const handleSave = () => {
    setSaved(!saved);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191414] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#191414] flex items-center justify-center">
        <div className="text-center">
          <Briefcase size={48} className="mx-auto text-[#B3B3B3] mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Job not found</h2>
          <p className="text-[#B3B3B3] mb-4">The job you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-[#1DB954] text-white px-6 py-2 rounded-xl hover:bg-[#1DB954]/90 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191414] pb-20">
      {/* Header */}
      <header className="bg-[#282828] border-b border-[#404040] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-[#404040] rounded-xl hover:bg-[#555555] transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <h1 className="text-xl font-bold text-white">Job Details</h1>
          </div>
          <button 
            onClick={handleSave}
            className="p-2 bg-[#404040] rounded-xl hover:bg-[#555555] transition-colors"
          >
            {saved ? (
              <BookmarkCheck size={20} className="text-[#1DB954]" />
            ) : (
              <Bookmark size={20} className="text-white" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Category & Urgent Badges */}
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-[#1DB954]/20 text-[#1DB954] px-4 py-1.5 rounded-full text-sm font-semibold">
              {job.category}
            </span>
            {job.urgent && (
              <span className="bg-red-500/20 text-red-500 px-4 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1">
                <Zap size={14} />
                Urgent
              </span>
            )}
          </div>

          {/* Job Title */}
          <h2 className="text-3xl font-bold text-white mb-6">{job.title}</h2>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4 flex items-center gap-3">
              <MapPin size={18} className="text-[#1DB954]" />
              <div>
                <p className="text-xs text-[#B3B3B3]">Location</p>
                <p className="text-sm font-medium text-white">{job.location}</p>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4 flex items-center gap-3">
              <Users size={18} className="text-[#1DB954]" />
              <div>
                <p className="text-xs text-[#B3B3B3]">Applicants</p>
                <p className="text-sm font-medium text-white">{job.applicants}</p>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4 flex items-center gap-3">
              <Clock size={18} className="text-[#1DB954]" />
              <div>
                <p className="text-xs text-[#B3B3B3]">Posted</p>
                <p className="text-sm font-medium text-white">{formatTimeAgo(job.createdAt)}</p>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4 flex items-center gap-3">
              <Calendar size={18} className="text-[#1DB954]" />
              <div>
                <p className="text-xs text-[#B3B3B3]">Date</p>
                <p className="text-sm font-medium text-white">{new Date(job.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Budget Card */}
          <div className="bg-gradient-to-r from-[#1DB954]/20 to-[#047857]/20 border border-[#1DB954]/30 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#1DB954] mb-1">Budget</p>
                <p className="text-4xl font-bold text-[#1DB954]">
                  MK {job.budget.toLocaleString()}
                </p>
                <p className="text-sm text-[#1DB954]/80 mt-1">
                  {job.budgetType === "hourly" ? "per hour" : "fixed price"}
                </p>
              </div>
              <DollarSign size={48} className="text-[#1DB954]/30" />
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Description</h3>
            <p className="text-[#B3B3B3] leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* Skills Required */}
          {job.skills && job.skills.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Skills Required</h3>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill) => (
                  <span 
                    key={skill} 
                    className="bg-[#282828] border border-[#404040] text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Posted By */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Posted By</h3>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {job.posterName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-lg">{job.posterName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Star size={14} className="text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-[#B3B3B3]">
                        {job.posterRating.toFixed(1)} rating
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-[#404040] text-white px-4 py-2 rounded-xl hover:bg-[#555555] transition-colors flex items-center gap-2">
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Action */}
      <div className="fixed bottom-16 left-0 right-0 bg-[#282828] border-t border-[#404040] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleApply}
            disabled={applied}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-colors ${
              applied 
                ? "bg-[#404040] text-[#B3B3B3] cursor-not-allowed"
                : "bg-[#1DB954] text-white hover:bg-[#1DB954]/90"
            }`}
          >
            {applied ? (
              <>
                <Send size={20} />
                Application Sent
              </>
            ) : (
              <>
                <Send size={20} />
                Apply Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <AppNavigation />
    </div>
  );
}
