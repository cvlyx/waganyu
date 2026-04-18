import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, MapPin, Star, Search, Filter, 
  Briefcase, Clock, CheckCircle, MessageCircle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppNavigation from "../components/AppNavigation";

interface Worker {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  rating: number;
  jobsCompleted: number;
  location: string;
  verified: boolean;
  hourlyRate: number;
  available: boolean;
}

const SKILLS = [
  "All", "Plumbing", "Electrical", "Cleaning", "Carpentry", 
  "Painting", "Moving", "Tutoring", "Cooking"
];

const LOCATIONS = [
  "All", "Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu"
];

const mockWorkers: Worker[] = [
  {
    id: "1",
    name: "John Banda",
    avatar: "JB",
    skills: ["Electrical", "Plumbing"],
    rating: 4.8,
    jobsCompleted: 47,
    location: "Lilongwe",
    verified: true,
    hourlyRate: 15000,
    available: true
  },
  {
    id: "2", 
    name: "Mary Phiri",
    avatar: "MP",
    skills: ["Cleaning", "Cooking"],
    rating: 4.9,
    jobsCompleted: 62,
    location: "Blantyre",
    verified: true,
    hourlyRate: 8000,
    available: true
  },
  {
    id: "3",
    name: "Samuel Chikapa",
    avatar: "SC", 
    skills: ["Carpentry", "Painting"],
    rating: 4.6,
    jobsCompleted: 35,
    location: "Mzuzu",
    verified: false,
    hourlyRate: 12000,
    available: false
  },
  {
    id: "4",
    name: "Grace Moyo",
    avatar: "GM",
    skills: ["Tutoring", "Electrical"],
    rating: 4.7,
    jobsCompleted: 28,
    location: "Zomba",
    verified: true,
    hourlyRate: 10000,
    available: true
  }
];

export default function WorkersPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [sortBy, setSortBy] = useState("rating");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let filtered = mockWorkers.filter(worker => {
        const matchesSearch = !search || 
          worker.name.toLowerCase().includes(search.toLowerCase()) ||
          worker.skills.some(skill => skill.toLowerCase().includes(search.toLowerCase()));
        
        const matchesSkill = selectedSkill === "All" || worker.skills.includes(selectedSkill);
        const matchesLocation = selectedLocation === "All" || worker.location === selectedLocation;
        
        return matchesSearch && matchesSkill && matchesLocation;
      });

      // Sort workers
      filtered.sort((a, b) => {
        if (sortBy === "rating") return b.rating - a.rating;
        if (sortBy === "jobs") return b.jobsCompleted - a.jobsCompleted;
        if (sortBy === "rate") return a.hourlyRate - b.hourlyRate;
        return 0;
      });

      setWorkers(filtered);
      setLoading(false);
    }, 800);
  }, [search, selectedSkill, selectedLocation, sortBy]);

  return (
    <div className="min-h-screen bg-[#191414]">
      {/* Header */}
      <header className="bg-[#282828] border-b border-[#404040] px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white">Find Workers</h1>
            <div className="text-sm text-[#B3B3B3]">
              {workers.length} workers found
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]" />
              <input
                type="text"
                placeholder="Search workers by name or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#191414] border border-[#404040] rounded-xl pl-10 pr-4 py-3 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954]"
              />
            </div>

            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1DB954]"
            >
              {SKILLS.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1DB954]"
            >
              {LOCATIONS.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#1DB954]"
            >
              <option value="rating">Top Rated</option>
              <option value="jobs">Most Jobs</option>
              <option value="rate">Lowest Rate</option>
            </select>
          </div>
        </div>
      </header>

      {/* Workers Grid */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading workers...</p>
            </div>
          </div>
        ) : workers.length === 0 ? (
          <div className="text-center py-20">
            <Users size={48} className="mx-auto text-[#B3B3B3] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No workers found</h3>
            <p className="text-[#B3B3B3]">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workers.map((worker, index) => (
              <motion.div
                key={worker.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-[#282828] border border-[#404040] rounded-xl p-6 hover:border-[#1DB954] transition-colors"
              >
                {/* Worker Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{worker.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{worker.name}</h3>
                      <div className="flex items-center gap-1">
                        <Star size={14} className="text-yellow-500" />
                        <span className="text-sm text-white">{worker.rating}</span>
                        <span className="text-sm text-[#B3B3B3]">({worker.jobsCompleted} jobs)</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {worker.verified && (
                      <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">Verified</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      worker.available 
                        ? "bg-green-500/20 text-green-500" 
                        : "bg-red-500/20 text-red-500"
                    }`}>
                      {worker.available ? "Available" : "Busy"}
                    </span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {worker.skills.map(skill => (
                    <span key={skill} className="text-xs bg-[#1DB954]/20 text-[#1DB954] px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Location and Rate */}
                <div className="flex items-center justify-between mb-4 text-sm text-[#B3B3B3]">
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>{worker.location}</span>
                  </div>
                  <div className="font-medium text-white">
                    MWK {worker.hourlyRate.toLocaleString()}/hr
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/worker/${worker.id}`)}
                    className="flex-1 bg-[#1DB954] text-white py-2 rounded-xl hover:bg-[#1DB954]/90 transition-colors"
                  >
                    View Profile
                  </button>
                  <button className="flex-1 bg-[#404040] text-white py-2 rounded-xl hover:bg-[#555555] transition-colors flex items-center justify-center gap-1">
                    <MessageCircle size={14} />
                    Message
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      
      {/* Navigation */}
      <AppNavigation />
    </div>
  );
}
