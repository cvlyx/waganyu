import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, PlusCircle, Zap, AlertCircle, AlertTriangle
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppSidebar from "../components/AppSidebar";

type JobCategory = 
  | "Plumbing"
  | "Electrical"
  | "Cleaning"
  | "Carpentry"
  | "Painting"
  | "Moving"
  | "Delivery"
  | "Tutoring"
  | "Cooking"
  | "Gardening"
  | "IT Support"
  | "Other";

const CATEGORIES: JobCategory[] = [
  "Plumbing", "Electrical", "Cleaning", "Carpentry",
  "Painting", "Moving", "Delivery", "Tutoring",
  "Cooking", "Gardening", "IT Support", "Other",
];

export default function PostJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Check if user can post jobs based on their role
  const canPostJobs = user?.intent === "hire" || user?.intent === "both";

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<JobCategory>("Plumbing");
  const [budget, setBudget] = useState("");
  const [budgetType, setBudgetType] = useState<"fixed" | "hourly">("fixed");
  const [location, setLocation] = useState(user?.city || "Lilongwe");
  const [urgent, setUrgent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    budget?: string;
  }>({});

  // Redirect users who cannot post jobs
  React.useEffect(() => {
    if (!canPostJobs) {
      navigate("/dashboard");
    }
  }, [canPostJobs, navigate]);

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!title.trim()) {
      newErrors.title = "Job title is required";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    
    if (!budget) {
      newErrors.budget = "Budget is required";
    } else if (isNaN(Number(budget)) || Number(budget) <= 0) {
      newErrors.budget = "Enter a valid amount";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log("Job posted:", {
        title: title.trim(),
        description: description.trim(),
        category,
        budget: Number(budget),
        budgetType,
        location: location.trim(),
        urgent,
        posterId: user?.id,
        posterName: user?.name,
      });

      setIsSubmitting(false);
      alert("Job posted successfully! Your job is now live and accepting applications.");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <AppSidebar>
      <div className="min-h-screen bg-[#191414]">
        {/* Header */}
        <header className="bg-[#282828] border-b border-[#404040] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-[#404040] rounded-xl hover:bg-[#555555] transition-colors"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Post a Job</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
        >
          {/* Job Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Job Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: undefined }));
              }}
              placeholder="e.g. Fix leaking kitchen sink"
              className={`w-full bg-[#282828] border rounded-xl px-4 py-3 text-white placeholder-[#B3B3B3] focus:outline-none transition-colors ${
                errors.title 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-[#404040] focus:border-[#1DB954]"
              }`}
            />
            {errors.title && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: undefined }));
              }}
              placeholder="Describe what needs to be done, any requirements, timeline..."
              rows={5}
              className={`w-full bg-[#282828] border rounded-xl px-4 py-3 text-white placeholder-[#B3B3B3] focus:outline-none transition-colors resize-none ${
                errors.description 
                  ? "border-red-500 focus:border-red-500" 
                  : "border-[#404040] focus:border-[#1DB954]"
              }`}
            />
            {errors.description && (
              <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                <AlertCircle size={14} />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-3">
              Category
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    category === cat
                      ? "bg-[#1DB954] text-white border-2 border-[#1DB954]"
                      : "bg-[#282828] text-[#B3B3B3] border-2 border-[#404040] hover:border-[#1DB954] hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Budget (MK) *
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={budget}
                  onChange={(e) => {
                    setBudget(e.target.value);
                    if (errors.budget) setErrors(prev => ({ ...prev, budget: undefined }));
                  }}
                  placeholder="e.g. 5000"
                  className={`w-full bg-[#282828] border rounded-xl px-4 py-3 text-white placeholder-[#B3B3B3] focus:outline-none transition-colors ${
                    errors.budget 
                      ? "border-red-500 focus:border-red-500" 
                      : "border-[#404040] focus:border-[#1DB954]"
                  }`}
                />
                {errors.budget && (
                  <div className="flex items-center gap-2 mt-2 text-red-500 text-sm">
                    <AlertCircle size={14} />
                    <span>{errors.budget}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setBudgetType("fixed")}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                    budgetType === "fixed"
                      ? "bg-[#1DB954] text-white border-2 border-[#1DB954]"
                      : "bg-[#282828] text-[#B3B3B3] border-2 border-[#404040] hover:border-[#1DB954]"
                  }`}
                >
                  Fixed
                </button>
                <button
                  type="button"
                  onClick={() => setBudgetType("hourly")}
                  className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
                    budgetType === "hourly"
                      ? "bg-[#1DB954] text-white border-2 border-[#1DB954]"
                      : "bg-[#282828] text-[#B3B3B3] border-2 border-[#404040] hover:border-[#1DB954]"
                  }`}
                >
                  Hourly
                </button>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Area 47, Lilongwe"
              className="w-full bg-[#282828] border border-[#404040] rounded-xl px-4 py-3 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954] transition-colors"
            />
          </div>

          {/* Urgency Toggle */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-3">
              Urgency
            </label>
            <button
              type="button"
              onClick={() => setUrgent(!urgent)}
              className={`w-full flex items-center justify-between p-5 rounded-xl border-2 transition-all ${
                urgent
                  ? "bg-red-500/10 border-red-500"
                  : "bg-[#282828] border-[#404040] hover:border-[#1DB954]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Zap 
                  size={24} 
                  className={urgent ? "text-red-500" : "text-[#B3B3B3]"} 
                />
                <div className="text-left">
                  <p className={`font-semibold ${urgent ? "text-red-500" : "text-white"}`}>
                    Mark as Urgent
                  </p>
                  <p className="text-sm text-[#B3B3B3]">Gets priority visibility</p>
                </div>
              </div>
              <div className={`w-12 h-7 rounded-full transition-colors relative ${
                urgent ? "bg-red-500" : "bg-[#404040]"
              }`}>
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                  urgent ? "right-1" : "left-1"
                }`} />
              </div>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              isSubmitting
                ? "bg-[#404040] text-[#B3B3B3] cursor-not-allowed"
                : "bg-[#1DB954] text-white hover:bg-[#1DB954]/90"
            }`}
          >
            <PlusCircle size={20} />
            {isSubmitting ? "Posting..." : "Post Job"}
          </button>
        </motion.form>
      </main>
      </div>
    </AppSidebar>
  );
}
