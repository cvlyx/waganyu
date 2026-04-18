import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, MapPin, Clock, Star, MessageCircle, 
  UserCheck, Award, CheckCircle, Briefcase
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppNavigation from "../components/AppNavigation";

interface Worker {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  hourlyRate: number;
  location: string;
  bio: string;
  completedJobs: number;
  responseTime: string;
  isOnline: boolean;
  badges: string[];
}

const mockWorkers: Worker[] = [
  {
    id: "w1",
    name: "James Mwangi",
    avatar: "JM",
    skills: ["Electrical", "Wiring", "Solar"],
    rating: 4.9,
    reviewCount: 87,
    isVerified: true,
    hourlyRate: 1200,
    location: "Lilongwe",
    bio: "Licensed electrician with 10+ years of experience. Certified for commercial and residential work. Specializing in solar panel installation and energy-efficient solutions. Available for emergency repairs 24/7.",
    completedJobs: 203,
    responseTime: "< 30 min",
    isOnline: true,
    badges: ["Top Rated", "Fast Responder", "Verified Pro"],
  },
  {
    id: "w2",
    name: "Mary Akinyi",
    avatar: "MA",
    skills: ["Cleaning", "Deep Clean", "Laundry"],
    rating: 4.8,
    reviewCount: 145,
    isVerified: true,
    hourlyRate: 600,
    location: "Blantyre",
    bio: "Professional cleaning specialist with expertise in residential and commercial cleaning. Detail-oriented, reliable, and always on time. I bring my own eco-friendly cleaning supplies and equipment.",
    completedJobs: 312,
    responseTime: "< 1 hour",
    isOnline: true,
    badges: ["Top Rated", "100+ Jobs"],
  },
  {
    id: "w3",
    name: "Kevin Ochieng",
    avatar: "KO",
    skills: ["Plumbing", "Pipe Repair", "Drainage"],
    rating: 4.7,
    reviewCount: 63,
    isVerified: true,
    hourlyRate: 900,
    location: "Lilongwe",
    bio: "Expert plumber serving Malawi for 7 years. Emergency repairs available 24/7. Specializing in pipe repair, drainage systems, and bathroom renovations. All work guaranteed.",
    completedJobs: 158,
    responseTime: "< 2 hours",
    isOnline: false,
    badges: ["Verified Pro", "Emergency Available"],
  },
];

export default function WorkerProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundWorker = mockWorkers.find(w => w.id === id);
      setWorker(foundWorker || null);
      setLoading(false);
    }, 500);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191414] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="min-h-screen bg-[#191414] flex items-center justify-center">
        <div className="text-center">
          <UserCheck size={48} className="mx-auto text-[#B3B3B3] mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Worker not found</h2>
          <p className="text-[#B3B3B3] mb-4">The worker profile you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate("/workers")}
            className="bg-[#1DB954] text-white px-6 py-2 rounded-xl hover:bg-[#1DB954]/90 transition-colors"
          >
            Browse Workers
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
            <h1 className="text-xl font-bold text-white">Professional Profile</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="bg-[#282828] border border-[#404040] rounded-xl p-8 mb-8 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-24 h-24 bg-gradient-to-br from-[#1DB954] to-[#047857] rounded-full flex items-center justify-center mx-auto border-4 border-[#1DB954]">
                <span className="text-white font-bold text-3xl">{worker.avatar}</span>
              </div>
              {worker.isOnline && (
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-[#282828]"></div>
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-white">{worker.name}</h2>
              {worker.isVerified && (
                <CheckCircle size={20} className="text-[#1DB954]" />
              )}
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Star size={18} className="text-yellow-500 fill-yellow-500" />
              <span className="text-xl font-bold text-white">{worker.rating.toFixed(1)}</span>
              <span className="text-[#B3B3B3]">({worker.reviewCount} reviews)</span>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {worker.badges.map((badge) => (
                <span 
                  key={badge} 
                  className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
                >
                  <Award size={12} />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white mb-1">{worker.completedJobs}</p>
              <p className="text-sm text-[#B3B3B3]">Jobs Done</p>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white mb-1">{worker.responseTime}</p>
              <p className="text-sm text-[#B3B3B3]">Response</p>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4 text-center">
              <p className={`text-lg font-bold mb-1 ${worker.isOnline ? "text-green-500" : "text-[#B3B3B3]"}`}>
                {worker.isOnline ? "Online" : "Offline"}
              </p>
              <p className="text-sm text-[#B3B3B3]">Status</p>
            </div>
          </div>

          {/* About */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">About</h3>
            <p className="text-[#B3B3B3] leading-relaxed">
              {worker.bio}
            </p>
          </div>

          {/* Skills & Expertise */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-3">
              {worker.skills.map((skill) => (
                <span 
                  key={skill} 
                  className="bg-[#282828] border border-[#404040] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <CheckCircle size={14} className="text-[#1DB954]" />
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Rate & Availability */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Rate & Availability</h3>
            <div className="bg-gradient-to-r from-[#1DB954]/20 to-[#047857]/20 border border-[#1DB954]/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#1DB954] mb-1">Hourly Rate</p>
                  <p className="text-4xl font-bold text-[#1DB954]">
                    MK {worker.hourlyRate.toLocaleString()}
                  </p>
                  <p className="text-sm text-[#1DB954]/80 mt-1">per hour</p>
                </div>
                <Clock size={48} className="text-[#1DB954]/30" />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Details</h3>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-[#1DB954]" />
                <span className="text-white">{worker.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-[#1DB954]" />
                <span className="text-white">Responds in {worker.responseTime}</span>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase size={18} className="text-[#1DB954]" />
                <span className="text-white">{worker.completedJobs} jobs completed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer Actions */}
      <div className="fixed bottom-16 left-0 right-0 bg-[#282828] border-t border-[#404040] px-6 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button className="flex-1 bg-[#404040] text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-[#555555] transition-colors">
            <MessageCircle size={20} />
            Message
          </button>
          <button className="flex-2 bg-[#1DB954] text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-[#1DB954]/90 transition-colors" style={{ flex: 2 }}>
            <UserCheck size={20} />
            Hire Now
          </button>
        </div>
      </div>

      {/* Navigation */}
      <AppNavigation />
    </div>
  );
}
