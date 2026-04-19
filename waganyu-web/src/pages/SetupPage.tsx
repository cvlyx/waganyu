import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, ArrowRight, Briefcase, Wrench, Zap, CheckCircle, 
  Users, Facebook, MessageCircle, Radio, Search, FileText, MoreHorizontal,
  MapPin, Mail, RefreshCw
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

type UserIntent = "hire" | "find_work" | "both";

interface SetupData {
  intent: UserIntent;
  skills: string[];
  city: string;
  heardFrom: string;
  bio: string;
  otp: string[];
}

const INTENTS = [
  { value: "hire" as UserIntent, label: "Hire Professionals", desc: "Post jobs and find skilled workers for tasks", icon: Briefcase, emoji: "???" },
  { value: "find_work" as UserIntent, label: "Find Work", desc: "Browse jobs and earn money with your skills", icon: Wrench, emoji: "???" },
  { value: "both" as UserIntent, label: "Both", desc: "Post jobs and also take on work -- full access", icon: Zap, emoji: "???" },
];

const ALL_SKILLS = [
  "Plumbing", "Electrical", "Cleaning", "Carpentry", "Painting",
  "Moving", "Tutoring", "Cooking", "Gardening", "IT Support",
  "Driving", "Security", "Photography", "Tailoring", "Masonry",
];

// Service categories for hirers (same skills but labeled as services they need)
const SERVICE_CATEGORIES = ALL_SKILLS;

const CITIES = [
  "Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Kasungu",
  "Mangochi", "Salima", "Dedza", "Ntcheu", "Karonga",
];

const HEARD_FROM = [
  { label: "Friend / Family", icon: Users },
  { label: "Facebook", icon: Facebook },
  { label: "WhatsApp", icon: MessageCircle },
  { label: "Radio / TV", icon: Radio },
  { label: "Google Search", icon: Search },
  { label: "Poster / Flyer", icon: FileText },
  { label: "Other", icon: MoreHorizontal },
];

const TOTAL_STEPS = 5;

export default function SetupPage() {
  const navigate = useNavigate();
  const { completeProfile, user } = useAuth();
  const [step, setStep] = useState(1);
  const [setupData, setSetupData] = useState<SetupData>({
    intent: "both",
    skills: [],
    city: "",
    heardFrom: "",
    bio: "",
    otp: ["", "", "", "", "", ""],
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resending, setResending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [focused, setFocused] = useState(false);
  const [saving, setSaving] = useState(false);

  // Redirect if user is not available or profile is already complete
  React.useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.profileComplete) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Send OTP when reaching step 5
  React.useEffect(() => {
    if (step === 5 && !otpSent) {
      sendOTP();
    }
  }, [step, otpSent]);

  const toggleSkill = (skill: string) => {
    setSetupData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill) 
        ? prev.skills.filter(s => s !== skill) 
        : [...prev.skills, skill]
    }));
  };

  const next = () => {
    setStep(s => s + 1);
  };

  const back = () => {
    if (step === 1) {
      navigate("/login");
      return;
    }
    setStep(s => s - 1);
  };

  const sendOTP = async () => {
    setResending(true);
    try {
      // Simulate sending OTP - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setOtpSent(true);
      setOtpError("");
    } catch (error) {
      setOtpError("Failed to send OTP. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const verifyOTP = async () => {
    setVerifying(true);
    setOtpError("");
    
    try {
      const otpCode = setupData.otp.join("");
      
      // Simulate OTP verification - in real app, this would call an API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, accept any 6-digit code
      if (otpCode.length === 6) {
        // Complete profile setup
        await completeProfile({
          intent: setupData.intent,
          skills: setupData.skills,
          city: setupData.city,
          location: `${setupData.city}, Malawi`,
          heardFrom: setupData.heardFrom,
          bio: setupData.bio.trim() || undefined,
          emailVerified: true,
        });
      } else {
        setOtpError("Invalid OTP code");
      }
    } catch (error) {
      setOtpError("Verification failed. Please try again.");
    } finally {
      setVerifying(false);
    }
  };

  const finish = async () => {
    if (step === 5) {
      await verifyOTP();
    } else {
      setSaving(true);
      try {
        await completeProfile({
          intent: setupData.intent,
          skills: setupData.skills,
          city: setupData.city,
          location: `${setupData.city}, Malawi`,
          heardFrom: setupData.heardFrom,
          bio: setupData.bio.trim() || undefined,
        });
        
        // Navigation will be handled by the ProtectedRoute component
      } catch (error) {
        // Error is already handled by the completeProfile function
      } finally {
        setSaving(false);
      }
    }
  };

  const canNext = step === 1 ? true 
    : step === 2 ? true 
    : step === 3 ? setupData.city !== "" 
    : step === 4 ? true
    : step === 5 ? setupData.otp.every(digit => digit !== "")
    : true;

  const updateSetupData = (key: keyof SetupData, value: any) => {
    setSetupData(prev => ({ ...prev, [key]: value }));
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtp = [...setupData.otp];
      newOtp[index] = value;
      setSetupData(prev => ({ ...prev, otp: newOtp }));
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !setupData.otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#191414] flex flex-col">
      {/* Top accent */}
      <div className="h-1 w-full bg-[#1DB954]" />

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05, duration: 0.4 }}
            className="flex items-center gap-4 mb-6"
          >
            <button
              onClick={back}
              className="w-9 h-9 bg-[#282828] border-2 border-[#404040] rounded-xl flex items-center justify-center hover:bg-[#333333] transition-colors"
            >
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div className="flex-1">
              <p className="text-xs font-medium text-[#B3B3B3] tracking-wide">Step {step} of {TOTAL_STEPS}</p>
              <h1 className="text-xl font-bold text-white">
                {step === 1 ? "Hi there! ??? " : step === 5 ? "Verify your email" : step === 4 ? "Almost done!" : "Set up your profile"}
              </h1>
            </div>
          </motion.div>

          {/* Progress bar */}
          <div className="flex gap-1.5 mb-8">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-1 rounded-full transition-colors ${
                  i < step ? "bg-[#1DB954]" : "bg-[#404040]"
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            {/* Step 1: Intent */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">What brings you to Waganyu?</h2>
                  <p className="text-sm text-[#B3B3B3] mb-8">
                    You can always change this later. Everyone sees all jobs and workers regardless.
                  </p>
                </div>

                <div className="space-y-4">
                  {INTENTS.map((intent) => {
                    const active = setupData.intent === intent.value;
                    return (
                      <button
                        key={intent.value}
                        onClick={() => updateSetupData("intent", intent.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                          active 
                            ? "bg-[#1DB954]/10 border-[#1DB954]" 
                            : "bg-[#282828] border-[#404040] hover:border-[#1DB954]/50"
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          active ? "bg-[#1DB954]" : "bg-[#404040]"
                        }`}>
                          <intent.icon 
                            size={20} 
                            className={active ? "text-white" : "text-[#B3B3B3]"} 
                          />
                        </div>
                        <div className="flex-1 text-left">
                          <h3 className={`font-semibold ${active ? "text-[#1DB954]" : "text-white"}`}>
                            {intent.label}
                          </h3>
                          <p className="text-sm text-[#B3B3B3]">{intent.desc}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          active ? "border-[#1DB954]" : "border-[#404040]"
                        }`}>
                          {active && <div className="w-2.5 h-2.5 rounded-full bg-[#1DB954]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Skills */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">
                    {setupData.intent === "hire" ? "What services do you need?" : "What are your skills?"}
                  </h2>
                  <p className="text-sm text-[#B3B3B3] mb-8">
                    {setupData.intent === "hire"
                      ? "Pick the categories you're likely to post jobs in. This helps us show you relevant workers."
                      : "Select all that apply -- this helps match you with the right jobs."}
                    {" "}You can skip this for now.
                  </p>
                  
                  {/* Role-specific information */}
                  {setupData.intent === "hire" && (
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-3 mb-4">
                      <p className="text-sm text-blue-400">
                        <strong>Note:</strong> As a hirer, you'll be able to post jobs in these categories but won't be able to apply for work yourself.
                      </p>
                    </div>
                  )}
                  
                  {setupData.intent === "find_work" && (
                    <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-3 mb-4">
                      <p className="text-sm text-green-400">
                        <strong>Note:</strong> As a job seeker, you'll be able to apply for jobs in these areas but won't be able to post jobs yourself.
                      </p>
                    </div>
                  )}
                  
                  {setupData.intent === "both" && (
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 mb-4">
                      <p className="text-sm text-purple-400">
                        <strong>Note:</strong> With both roles, you can post jobs and apply for work in all selected categories.
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  {(setupData.intent === "hire" ? SERVICE_CATEGORIES : ALL_SKILLS).map((skill) => {
                    const active = setupData.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        onClick={() => toggleSkill(skill)}
                        className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                          active
                            ? "bg-[#1DB954] border-[#1DB954] text-white"
                            : "bg-[#282828] border-[#404040] text-white hover:border-[#1DB954]/50"
                        }`}
                      >
                        {active && <CheckCircle size={12} className="inline mr-1" />}
                        {skill}
                      </button>
                    );
                  })}
                </div>

                {setupData.skills.length > 0 && (
                  <div className="flex items-center gap-2 bg-[#1DB954]/10 border border-[#1DB954]/30 px-4 py-2 rounded-full">
                    <CheckCircle size={16} className="text-[#1DB954]" />
                    <span className="text-sm font-medium text-[#1DB954]">
                      {setupData.skills.length} {setupData.intent === "hire" ? "service categories" : "skills"} selected
                    </span>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: City + Heard from */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">Where are you based?</h2>
                  <p className="text-sm text-[#B3B3B3] mb-8">
                    This helps us show you nearby jobs and workers.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#B3B3B3] mb-3 tracking-wide">
                    Your City *
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CITIES.map((city) => {
                      const active = setupData.city === city;
                      return (
                        <button
                          key={city}
                          onClick={() => updateSetupData("city", city)}
                          className={`px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                            active
                              ? "bg-[#1DB954] border-[#1DB954] text-white"
                              : "bg-[#282828] border-[#404040] text-white hover:border-[#1DB954]/50"
                          }`}
                        >
                          {city}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#B3B3B3] mb-3 tracking-wide">
                    How did you hear about us?
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {HEARD_FROM.map((source) => {
                      const active = setupData.heardFrom === source.label;
                      return (
                        <button
                          key={source.label}
                          onClick={() => updateSetupData("heardFrom", source.label)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                            active
                              ? "bg-[#1DB954]/10 border-[#1DB954]"
                              : "bg-[#282828] border-[#404040] hover:border-[#1DB954]/50"
                          }`}
                        >
                          <source.icon 
                            size={14} 
                            className={active ? "text-[#1DB954]" : "text-[#B3B3B3]"} 
                          />
                          <span className={active ? "text-[#1DB954]" : "text-white"}>
                            {source.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Bio + finish */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-white mb-3">Tell people about yourself</h2>
                  <p className="text-sm text-[#B3B3B3] mb-8">
                    A short bio helps build trust. You can skip this and add it later from your profile.
                  </p>
                </div>

                <div className={`bg-[#282828] rounded-xl border-2 p-4 transition-colors ${
                  focused ? "border-[#1DB954]" : "border-[#404040]"
                }`}>
                  <textarea
                    value={setupData.bio}
                    onChange={(e) => updateSetupData("bio", e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder={setupData.intent === "hire"
                      ? "e.g. I'm a business owner in Lilongwe looking for reliable professionals..."
                      : "e.g. I'm an experienced electrician based in Blantyre with 5+ years..."}
                    className="w-full bg-transparent text-white placeholder-[#B3B3B3] outline-none resize-none text-sm leading-relaxed"
                    rows={5}
                    maxLength={200}
                  />
                  <div className="text-right mt-2">
                    <span className="text-xs text-[#B3B3B3]">{setupData.bio.length}/200</span>
                  </div>
                </div>

                {/* Summary card */}
                <div className="bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-xl p-4 space-y-3">
                  <h3 className="text-sm font-bold text-[#1DB954] tracking-wide">Your profile summary</h3>
                  
                  <div className="flex items-center gap-2">
                    <Zap size={13} className="text-[#1DB954]" />
                    <span className="text-sm text-white">
                      {INTENTS.find(i => i.value === setupData.intent)?.label}
                    </span>
                  </div>

                  {setupData.skills.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Wrench size={13} className="text-[#1DB954]" />
                      <span className="text-sm text-white">
                        {setupData.skills.slice(0, 3).join(", ")}
                        {setupData.skills.length > 3 ? ` +${setupData.skills.length - 3}` : ""}
                      </span>
                    </div>
                  )}

                  {setupData.city && (
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-[#1DB954]" />
                      <span className="text-sm text-white">{setupData.city}, Malawi</span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 5: OTP Verification */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#1DB954]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail size={32} className="text-[#1DB954]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-3">Verify your email address</h2>
                  <p className="text-sm text-[#B3B3B3] mb-8">
                    We've sent a 6-digit verification code to {user?.email || "your email address"}. 
                    Enter the code below to complete your account setup.
                  </p>
                </div>

                {/* OTP Input */}
                <div className="flex justify-center gap-2">
                  {setupData.otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className={`w-12 h-12 text-center text-lg font-bold rounded-xl border-2 bg-[#282828] text-white transition-colors ${
                        focused && document.activeElement?.id === `otp-${index}`
                          ? "border-[#1DB954]"
                          : "border-[#404040]"
                      }`}
                      maxLength={1}
                    />
                  ))}
                </div>

                {/* Error message */}
                {otpError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
                    <p className="text-sm text-red-400 text-center">{otpError}</p>
                  </div>
                )}

                {/* Resend OTP */}
                <div className="text-center">
                  <p className="text-sm text-[#B3B3B3] mb-3">
                    Didn't receive the code?
                  </p>
                  <button
                    onClick={sendOTP}
                    disabled={resending}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#1DB954] hover:text-[#1DB954]/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
                    {resending ? "Sending..." : "Resend code"}
                  </button>
                </div>

                {/* Email display */}
                <div className="bg-[#1DB954]/10 border border-[#1DB954]/30 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <Mail size={16} className="text-[#1DB954]" />
                    <div>
                      <p className="text-xs font-medium text-[#B3B3B3]">Verification sent to:</p>
                      <p className="text-sm font-semibold text-white">{user?.email || "your email"}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-8">
            {step < TOTAL_STEPS ? (
              <>
                {step > 1 && (
                  <button
                    onClick={() => setStep(s => s - 1)}
                    className="px-6 py-3 border-2 border-[#404040] rounded-xl text-sm font-medium text-[#B3B3B3] hover:border-[#1DB954]/50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={next}
                  disabled={!canNext}
                  className={`flex-1 h-12 bg-gradient-to-r from-[#059669] to-[#047857] text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed ${
                    !canNext ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Continue
                  <ArrowRight size={17} />
                </button>
              </>
            ) : (
              <div className="w-full space-y-3">
                <button
                  onClick={finish}
                  disabled={saving || verifying}
                  className="w-full h-12 bg-gradient-to-r from-[#059669] to-[#047857] text-white font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {step === 5 ? (
                    verifying ? "Verifying..." : "Verify Email"
                  ) : (
                    saving ? "Setting up..." : "Continue to Email Verification"
                  )}
                  {step === 5 ? (
                    <CheckCircle size={17} />
                  ) : (
                    <ArrowRight size={17} />
                  )}
                </button>
                {step === 5 ? (
                  <button
                    onClick={() => setStep(4)}
                    className="w-full text-sm font-medium text-[#B3B3B3] hover:text-white transition-colors py-2"
                  >
                    Back to profile setup
                  </button>
                ) : (
                  <button
                    onClick={finish}
                    className="w-full text-sm font-medium text-[#B3B3B3] hover:text-white transition-colors py-2"
                  >
                    Skip for now -- I'll complete later
                  </button>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
