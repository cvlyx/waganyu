import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Bell, CheckCircle, MessageCircle, Briefcase, 
  Users, Star, Clock, X, Check, Filter
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppSidebar from "../components/AppSidebar";

interface Notification {
  id: string;
  type: "job" | "message" | "review" | "system";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  icon: any;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "job",
    title: "New Job Application",
    message: "John Banda applied for your Electrical Installation job",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    actionUrl: "/jobs/123",
    icon: Briefcase
  },
  {
    id: "2",
    type: "message",
    title: "New Message",
    message: "Mary Phiri sent you a message about plumbing work",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    actionUrl: "/messages/2",
    icon: MessageCircle
  },
  {
    id: "3",
    type: "review",
    title: "New Review",
    message: "Samuel Chikapa left you a 5-star review!",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    actionUrl: "/reviews/456",
    icon: Star
  },
  {
    id: "4",
    type: "system",
    title: "Profile Approved",
    message: "Your profile has been verified and is now live",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    icon: CheckCircle
  },
  {
    id: "5",
    type: "job",
    title: "Job Completed",
    message: "Electrical work at Office Building marked as complete",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    read: true,
    actionUrl: "/jobs/789",
    icon: Check
  }
];

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let filtered = mockNotifications;
      if (filter === "unread") {
        filtered = mockNotifications.filter(n => !n.read);
      }
      setNotifications(filtered);
      setLoading(false);
    }, 500);
  }, [filter]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "job": return "text-blue-500";
      case "message": return "text-green-500";
      case "review": return "text-yellow-500";
      case "system": return "text-purple-500";
      default: return "text-gray-500";
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppSidebar>
      <div className="min-h-screen bg-[#191414]">
        {/* Header */}
        <header className="bg-[#282828] border-b border-[#404040] px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-[#1DB954] text-white text-sm px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as "all" | "unread")}
                className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1DB954]"
              >
                <option value="all">All Notifications</option>
                <option value="unread">Unread Only</option>
              </select>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#1DB954] hover:text-[#1DB954]/80 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Notifications List */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-white">Loading notifications...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={48} className="mx-auto text-[#B3B3B3] mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No notifications</h3>
            <p className="text-[#B3B3B3]">
              {filter === "unread" ? "All caught up!" : "We'll notify you of important updates"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-[#282828] border rounded-xl p-4 hover:bg-[#333333] transition-colors ${
                  !notification.read ? "border-[#1DB954]" : "border-[#404040]"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !notification.read ? "bg-[#1DB954]/20" : "bg-[#404040]"
                  }`}>
                    <notification.icon 
                      size={18} 
                      className={getIconColor(notification.type)}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex-1">
                        <h3 className={`font-semibold text-white ${
                          !notification.read ? "font-bold" : ""
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-[#B3B3B3] mt-1">
                          {notification.message}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-xs text-[#B3B3B3] whitespace-nowrap">
                          {formatTime(notification.timestamp)}
                        </span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#1DB954] rounded-full"></div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-3">
                      {notification.actionUrl && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-[#1DB954] hover:text-[#1DB954]/80 transition-colors"
                        >
                          View
                        </button>
                      )}
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-sm text-[#B3B3B3] hover:text-white transition-colors"
                        >
                          Mark as read
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-sm text-[#B3B3B3] hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      </div>
    </AppSidebar>
  );
}
