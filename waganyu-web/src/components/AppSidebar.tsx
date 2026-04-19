import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, Users, MessageCircle, Bell, User,
  Briefcase, Search, Plus, LogOut, Menu,
  ChevronLeft, ChevronRight, Shield, AlertTriangle,
  UserCheck, FileText
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmModal from "./ConfirmModal";

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

interface AppSidebarProps {
  children: React.ReactNode;
}

export default function AppSidebar({ children }: AppSidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const getNavItems = (): NavItem[] => {
    // For admin users, only show admin navigation items
    if (user?.role === "admin") {
      const adminItems: NavItem[] = [
        {
          path: "/admin",
          label: "Admin Dashboard",
          icon: Shield
        },
        {
          path: "/admin/users",
          label: "User Management",
          icon: UserCheck
        },
        {
          path: "/workers",
          label: "Workers",
          icon: Users
        },
        {
          path: "/admin/approvals",
          label: "Worker Approvals",
          icon: AlertTriangle
        },
        {
          path: "/admin/reports",
          label: "Reports",
          icon: FileText
        },
        {
          path: "/notifications",
          label: "Alerts",
          icon: Bell,
          badge: 5 // Mock unread count
        }
      ];

      return adminItems;
    }

    // For regular users, show navigation based on intent
    const baseItems: NavItem[] = [
      {
        path: "/dashboard",
        label: "Home",
        icon: Home
      }
    ];

    // Add navigation items based on user intent
    if (user?.intent === "hire" || user?.intent === "both") {
      baseItems.push({
        path: "/workers", 
        label: "Browse Workers",
        icon: Users
      });
      baseItems.push({
        path: "/my-jobs",
        label: "My Requests",
        icon: Briefcase
      });
    }

    if (user?.intent === "find_work" || user?.intent === "both") {
      baseItems.push({
        path: "/workers",
        label: "Find Jobs",
        icon: Search
      });
      baseItems.push({
        path: "/my-jobs",
        label: "My Work",
        icon: Briefcase
      });
    }

    // Common items for all users
    baseItems.push({
      path: "/messages",
      label: "Messages", 
      icon: MessageCircle,
      badge: 2 // Mock unread count
    });
    baseItems.push({
      path: "/notifications",
      label: "Alerts",
      icon: Bell,
      badge: 5 // Mock unread count
    });
    baseItems.push({
      path: "/profile",
      label: "Profile",
      icon: User
    });

    return baseItems;
  };

  const navItems = getNavItems();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsExpanded(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
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

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsExpanded(!isExpanded);
    }
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#191414] relative">
      {/* Mobile overlay */}
      <AnimatePresence>
        {isMobile && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={closeMobileSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        initial={false}
        animate={{
          width: isExpanded ? (isMobile ? "100%" : "280px") : (isMobile ? "0" : "80px")
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed md:relative h-full bg-[#282828] border-r border-[#404040] z-50 flex flex-col ${
          isMobile ? (isExpanded ? "translate-x-0" : "-translate-x-full") : ""
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#404040]">
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 bg-[#1DB954] rounded-xl flex items-center justify-center">
                  <Home size={16} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">Waganyu</h1>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleSidebar}
            className="p-2 text-[#B3B3B3] hover:text-white transition-colors rounded-lg hover:bg-[#404040]"
          >
            {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={isMobile ? closeMobileSidebar : undefined}
              className={`relative flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-colors group ${
                isActive(item.path) 
                  ? "bg-[#1DB954]/20 text-[#1DB954]" 
                  : "text-[#B3B3B3] hover:text-white hover:bg-[#404040]"
              }`}
            >
              {/* Active indicator */}
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeSidebar"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-[#1DB954] rounded-r-full"
                  initial={false}
                  animate={true}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}

              {/* Icon with badge */}
              <div className="relative flex-shrink-0">
                <item.icon 
                  size={20} 
                  className={`${
                    isActive(item.path) ? "text-[#1DB954]" : "text-[#B3B3B3]"
                  } group-hover:text-white transition-colors`}
                />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`font-medium ${
                      isActive(item.path) ? "text-[#1DB954]" : "text-[#B3B3B3]"
                    } group-hover:text-white transition-colors`}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-[#404040] p-4">
          <div className="flex flex-col gap-2">
            {/* Search */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group ${
                showSearch 
                  ? "bg-[#1DB954]/20 text-[#1DB954]" 
                  : "text-[#B3B3B3] hover:text-white hover:bg-[#404040]"
              }`}
            >
              <Search size={20} className="group-hover:text-white transition-colors" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="font-medium"
                  >
                    Search
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Post Job / Find Work */}
            {user?.role !== "admin" && (user?.intent === "hire" || user?.intent === "both") && (
              <button
                onClick={() => {
                  navigate("/post-job");
                  if (isMobile) closeMobileSidebar();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group text-[#B3B3B3] hover:text-white hover:bg-[#404040]"
              >
                <Plus size={20} className="group-hover:text-white transition-colors" />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="font-medium"
                    >
                      Post Job
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}
            
            {/* Find Work for workers */}
            {user?.role !== "admin" && (user?.intent === "find_work" || user?.intent === "both") && (
              <button
                onClick={() => {
                  navigate("/workers");
                  if (isMobile) closeMobileSidebar();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group text-[#B3B3B3] hover:text-white hover:bg-[#404040]"
              >
                <Search size={20} className="group-hover:text-white transition-colors" />
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="font-medium"
                    >
                      Find Work
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            )}

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors group text-[#B3B3B3] hover:text-red-500 hover:bg-[#404040]"
            >
              <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
              <AnimatePresence>
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="font-medium"
                  >
                    Logout
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-full left-4 right-4 bg-[#282828] border border-[#404040] p-4 rounded-xl z-50"
            >
              <form onSubmit={handleSearch}>
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setIsExpanded(true)}
            className="fixed top-4 left-4 z-30 p-3 bg-[#282828] border border-[#404040] rounded-xl text-[#B3B3B3] hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
        )}

        {/* Content Area */}
        <div className={`h-full overflow-y-auto transition-all duration-300 ${
          isMobile ? "" : isExpanded ? "ml-0" : "ml-0"
        }`}>
          {children}
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout Confirmation"
        message="Are you sure you want to logout? You will be redirected to landing page."
        confirmText="Logout"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
}
