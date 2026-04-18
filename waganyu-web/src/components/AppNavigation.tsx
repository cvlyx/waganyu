import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, Users, MessageCircle, Bell, User,
  Briefcase, Search, Plus, LogOut
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

export default function AppNavigation() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const navItems: NavItem[] = [
    {
      path: "/dashboard",
      label: "Home",
      icon: Home
    },
    {
      path: "/workers", 
      label: "Workers",
      icon: Users
    },
    {
      path: "/my-jobs",
      label: "My Jobs",
      icon: Briefcase
    },
    {
      path: "/messages",
      label: "Messages", 
      icon: MessageCircle,
      badge: 2 // Mock unread count
    },
    {
      path: "/notifications",
      label: "Alerts",
      icon: Bell,
      badge: 5 // Mock unread count
    },
    {
      path: "/profile",
      label: "Profile",
      icon: User
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results page or filter current page
      console.log("Searching for:", searchQuery);
      setShowSearch(false);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/landing");
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#282828] border-t border-[#404040] z-50">
      {/* Search Overlay */}
      {showSearch && (
        <div className="absolute bottom-full left-0 right-0 bg-[#282828] border-t border-[#404040] p-4 animate-in slide-in-from-bottom">
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jobs, workers, or skills..."
                className="flex-1 bg-[#191414] border border-[#404040] rounded-xl px-4 py-3 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954]"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#1DB954] text-white px-6 py-3 rounded-xl hover:bg-[#1DB954]/90 transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setShowSearch(false)}
                className="bg-[#404040] text-white px-4 py-3 rounded-xl hover:bg-[#555555] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center gap-1 px-4 py-2 text-[#B3B3B3] hover:text-white transition-colors group"
            >
              {/* Active indicator */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-[#1DB954] rounded-full"
                  initial={false}
                  animate={true}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Icon with badge */}
              <div className="relative">
                <item.icon 
                  size={20} 
                  className={`${isActive(item.path) ? "text-[#1DB954]" : "text-[#B3B3B3]"} 
                    group-hover:text-white transition-colors`}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-xs font-medium ${
                isActive(item.path) ? "text-[#1DB954]" : "text-[#B3B3B3]"
              } group-hover:text-white transition-colors`}>
                {item.label}
              </span>
            </Link>
          ))}

          {/* Quick Actions */}
          <div className="flex items-center gap-2 px-4 py-2 border-l border-[#404040] ml-4">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 text-[#B3B3B3] hover:text-white transition-colors rounded-xl hover:bg-[#404040]"
              title="Search"
            >
              <Search size={18} />
            </button>
            <button 
              onClick={() => navigate("/post-job")}
              className="p-2 text-[#B3B3B3] hover:text-white transition-colors rounded-xl hover:bg-[#404040]"
              title="Post a Job"
            >
              <Plus size={18} />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-[#B3B3B3] hover:text-red-500 transition-colors rounded-xl hover:bg-[#404040]"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will be redirected to the landing page."
        confirmText="Logout"
        cancelText="Cancel"
        type="danger"
      />
    </nav>
  );
}
