import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

export type JobCategory =
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

export type JobStatus = "open" | "in_progress" | "completed" | "cancelled";

export interface Job {
  id: string;
  title: string;
  description: string;
  category: JobCategory;
  budget: number;
  budgetType: "fixed" | "hourly";
  location: string;
  distance?: number;
  status: JobStatus;
  posterId: string;
  posterName: string;
  posterRating: number;
  posterAvatar?: string;
  applicants: number;
  createdAt: string;
  urgent: boolean;
  images?: string[];
  skills?: string[];
}

export interface WorkerProfile {
  id: string;
  name: string;
  avatar?: string;
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

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  participantName: string;
  participantAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  jobTitle?: string;
}

export interface Notification {
  id: string;
  type: "application" | "message" | "job_update" | "review" | "system";
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  actionId?: string;
}

const MOCK_JOBS: Job[] = [
  {
    id: "j1",
    title: "Fix leaking kitchen sink pipe",
    description: "My kitchen sink has been leaking for 2 days. Need an experienced plumber to fix the pipe under the sink. Parts may be needed.",
    category: "Plumbing",
    budget: 3500,
    budgetType: "fixed",
    location: "Area 47, Lilongwe",
    distance: 1.2,
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
    description: "Need thorough cleaning of a 4-bedroom house before tenants move in. Windows, floors, bathrooms, kitchen included.",
    category: "Cleaning",
    budget: 5000,
    budgetType: "fixed",
    location: "Blantyre City, Blantyre",
    distance: 3.5,
    status: "open",
    posterId: "3",
    posterName: "David M.",
    posterRating: 4.5,
    applicants: 7,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    urgent: false,
    skills: ["Cleaning", "Deep Clean"],
  },
  {
    id: "j3",
    title: "Electrical wiring for new office",
    description: "New office setup requires complete electrical wiring. 6 rooms. Must be certified electrician. Provide your own tools.",
    category: "Electrical",
    budget: 800,
    budgetType: "hourly",
    location: "City Centre, Lilongwe",
    distance: 2.1,
    status: "open",
    posterId: "4",
    posterName: "Tech Corp Ltd",
    posterRating: 4.9,
    applicants: 3,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    urgent: false,
    skills: ["Electrical", "Wiring", "Commercial"],
  },
  {
    id: "j4",
    title: "Math & Physics tutoring for MSCE",
    description: "Looking for an experienced tutor for Form 4 student. 3 sessions per week, 2 hours each. Must have strong results background.",
    category: "Tutoring",
    budget: 1500,
    budgetType: "hourly",
    location: "Limbe, Blantyre",
    distance: 0.8,
    status: "open",
    posterId: "5",
    posterName: "Peter W.",
    posterRating: 5.0,
    applicants: 12,
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    urgent: false,
    skills: ["Mathematics", "Physics", "MSCE"],
  },
  {
    id: "j5",
    title: "Paint 3-bedroom apartment interior",
    description: "Need professional painter for 3 BHK apartment. Fresh coat on all walls and ceiling. Paint will be provided by client.",
    category: "Painting",
    budget: 12000,
    budgetType: "fixed",
    location: "Nyambadwe, Blantyre",
    distance: 4.2,
    status: "open",
    posterId: "6",
    posterName: "Ann O.",
    posterRating: 4.3,
    applicants: 5,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    urgent: false,
    skills: ["Painting", "Interior"],
  },
  {
    id: "j6",
    title: "Move furniture to new apartment",
    description: "Moving from a 2-bedroom to a 3-bedroom apartment nearby. Have sofa, beds, wardrobes. Need 2-3 people and a truck.",
    category: "Moving",
    budget: 8000,
    budgetType: "fixed",
    location: "Chilomoni, Blantyre",
    distance: 2.8,
    status: "open",
    posterId: "7",
    posterName: "Grace N.",
    posterRating: 4.6,
    applicants: 2,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    urgent: true,
    skills: ["Moving", "Heavy Lifting"],
  },
];

const MOCK_WORKERS: WorkerProfile[] = [
  {
    id: "w1",
    name: "James Mwangi",
    skills: ["Electrical", "Wiring", "Solar"],
    rating: 4.9,
    reviewCount: 87,
    isVerified: true,
    hourlyRate: 1200,
    location: "Lilongwe",
    bio: "Licensed electrician with 10+ years. Certified for commercial and residential work.",
    completedJobs: 203,
    responseTime: "< 30 min",
    isOnline: true,
    badges: ["Top Rated", "Fast Responder", "Verified Pro"],
  },
  {
    id: "w2",
    name: "Mary Akinyi",
    skills: ["Cleaning", "Deep Clean", "Laundry"],
    rating: 4.8,
    reviewCount: 145,
    isVerified: true,
    hourlyRate: 600,
    location: "Blantyre",
    bio: "Professional cleaning specialist. Residential and commercial cleaning expert.",
    completedJobs: 312,
    responseTime: "< 1 hour",
    isOnline: true,
    badges: ["Top Rated", "100+ Jobs"],
  },
  {
    id: "w3",
    name: "Kevin Ochieng",
    skills: ["Plumbing", "Pipe Repair", "Drainage"],
    rating: 4.7,
    reviewCount: 63,
    isVerified: true,
    hourlyRate: 900,
    location: "Lilongwe",
    bio: "Expert plumber serving Malawi for 7 years. Emergency repairs available 24/7.",
    completedJobs: 158,
    responseTime: "< 2 hours",
    isOnline: false,
    badges: ["Verified Pro", "Emergency Available"],
  },
  {
    id: "w4",
    name: "Lucy Wambui",
    skills: ["Tutoring", "Mathematics", "Physics"],
    rating: 5.0,
    reviewCount: 38,
    isVerified: true,
    hourlyRate: 2000,
    location: "Blantyre",
    bio: "BSc Mathematics, University of Malawi. MSCE distinction in all sciences. 5 years tutoring.",
    completedJobs: 89,
    responseTime: "< 1 hour",
    isOnline: true,
    badges: ["Top Rated", "Verified Pro"],
  },
  {
    id: "w5",
    name: "Samuel Kariuki",
    skills: ["Carpentry", "Furniture", "Wood Work"],
    rating: 4.6,
    reviewCount: 51,
    isVerified: false,
    hourlyRate: 750,
    location: "Lilongwe",
    bio: "Skilled carpenter crafting custom furniture and doing home repairs.",
    completedJobs: 94,
    responseTime: "< 3 hours",
    isOnline: false,
    badges: ["50+ Jobs"],
  },
  {
    id: "w6",
    name: "Amina Hassan",
    skills: ["Cooking", "Catering", "Meal Prep"],
    rating: 4.9,
    reviewCount: 72,
    isVerified: true,
    hourlyRate: 1500,
    location: "Blantyre",
    bio: "Professional chef with hotel experience. Specializing in African and Malawian cuisine.",
    completedJobs: 167,
    responseTime: "< 1 hour",
    isOnline: true,
    badges: ["Top Rated", "Verified Pro", "Chef Certified"],
  },
];

const MOCK_CHATS: Chat[] = [
  {
    id: "c1",
    participants: ["1", "w1"],
    participantName: "James Mwangi",
    lastMessage: "I can come tomorrow morning at 9am",
    lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    unreadCount: 2,
    jobTitle: "Electrical wiring for new office",
  },
  {
    id: "c2",
    participants: ["1", "w2"],
    participantName: "Mary Akinyi",
    lastMessage: "What areas need deep cleaning?",
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    jobTitle: "House deep cleaning",
  },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "application",
    title: "New Application",
    body: "James Mwangi applied to your electrical job",
    timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    read: false,
    actionId: "j3",
  },
  {
    id: "n2",
    type: "message",
    title: "New Message",
    body: "Mary Akinyi: What areas need deep cleaning?",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    actionId: "c2",
  },
  {
    id: "n3",
    type: "review",
    title: "New Review",
    body: "You received a 5-star review from Sarah K.",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "n4",
    type: "job_update",
    title: "Job Completed",
    body: "Your fix leaking sink job has been marked complete",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    actionId: "j1",
  },
];

interface DataContextType {
  jobs: Job[];
  workers: WorkerProfile[];
  chats: Chat[];
  notifications: Notification[];
  savedJobs: string[];
  addJob: (job: Omit<Job, "id" | "createdAt" | "applicants" | "status">) => void;
  toggleSaveJob: (jobId: string) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  sendMessage: (chatId: string, content: string, senderId: string) => void;
  getMessages: (chatId: string) => Message[];
  unreadNotificationCount: number;
  unreadMessageCount: number;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(MOCK_JOBS);
  const [workers] = useState<WorkerProfile[]>(MOCK_WORKERS);
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});

  useEffect(() => {
    AsyncStorage.getItem("waganyu_saved_jobs").then((v) => {
      if (v) setSavedJobs(JSON.parse(v));
    });
  }, []);

  function addJob(job: Omit<Job, "id" | "createdAt" | "applicants" | "status">) {
    const newJob: Job = {
      ...job,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      applicants: 0,
      status: "open",
    };
    setJobs((prev) => [newJob, ...prev]);
  }

  function toggleSaveJob(jobId: string) {
    setSavedJobs((prev) => {
      const next = prev.includes(jobId) ? prev.filter((id) => id !== jobId) : [...prev, jobId];
      AsyncStorage.setItem("waganyu_saved_jobs", JSON.stringify(next));
      return next;
    });
  }

  function markNotificationRead(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  function markAllNotificationsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function sendMessage(chatId: string, content: string, senderId: string) {
    const msg: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      chatId,
      senderId,
      content,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), msg],
    }));
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId
          ? { ...c, lastMessage: content, lastMessageTime: new Date().toISOString() }
          : c
      )
    );
  }

  function getMessages(chatId: string): Message[] {
    return messages[chatId] || [];
  }

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;
  const unreadMessageCount = chats.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <DataContext.Provider
      value={{
        jobs,
        workers,
        chats,
        notifications,
        savedJobs,
        addJob,
        toggleSaveJob,
        markNotificationRead,
        markAllNotificationsRead,
        sendMessage,
        getMessages,
        unreadNotificationCount,
        unreadMessageCount,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
