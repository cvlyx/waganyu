import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, Search, Filter, MoreVertical, Ban, Shield,
  Mail, Phone, MapPin, Calendar, Star, CheckCircle,
  XCircle, AlertCircle, UserCheck, UserX, Download
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import AppSidebar from "../../components/AppSidebar";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  role: "user" | "admin";
  status: "active" | "suspended" | "pending";
  verified: boolean;
  rating?: number;
  jobsCompleted: number;
  joinedAt: string;
  lastActive: string;
  skills?: string[];
  intent?: "hire" | "find_work" | "both";
}

const mockUsers: AdminUser[] = [
  {
    id: "1",
    name: "John Banda",
    email: "john.banda@email.com",
    phone: "+265 991 234 567",
    location: "Lilongwe",
    role: "user",
    status: "active",
    verified: true,
    rating: 4.8,
    jobsCompleted: 47,
    joinedAt: "2024-01-15",
    lastActive: "2024-04-18T10:30:00Z",
    skills: ["Electrical", "Plumbing"],
    intent: "find_work"
  },
  {
    id: "2",
    name: "Mary Phiri",
    email: "mary.phiri@email.com",
    phone: "+265 991 345 678",
    location: "Blantyre",
    role: "user",
    status: "active",
    verified: true,
    rating: 4.5,
    jobsCompleted: 32,
    joinedAt: "2024-02-10",
    lastActive: "2024-04-18T09:15:00Z",
    skills: ["Cleaning", "Cooking"],
    intent: "find_work"
  },
  {
    id: "3",
    name: "Samuel Chikapa",
    email: "samuel.chikapa@email.com",
    phone: "+265 991 456 789",
    location: "Zomba",
    role: "user",
    status: "suspended",
    verified: false,
    rating: 3.2,
    jobsCompleted: 8,
    joinedAt: "2024-03-01",
    lastActive: "2024-04-10T14:20:00Z",
    skills: ["Carpentry"],
    intent: "both"
  },
  {
    id: "4",
    name: "Alice Mwale",
    email: "alice.mwale@email.com",
    phone: "+265 991 567 890",
    location: "Mzuzu",
    role: "user",
    status: "pending",
    verified: false,
    rating: 0,
    jobsCompleted: 0,
    joinedAt: "2024-04-16",
    lastActive: "2024-04-17T16:45:00Z",
    skills: ["Tutoring", "Teaching"],
    intent: "hire"
  },
  {
    id: "5",
    name: "Bob Banda",
    email: "bob.banda@email.com",
    location: "Lilongwe",
    role: "admin",
    status: "active",
    verified: true,
    rating: 5.0,
    jobsCompleted: 0,
    joinedAt: "2023-12-01",
    lastActive: "2024-04-18T11:00:00Z"
  }
];

export default function UserManagement() {
  const { user } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "suspended" | "pending">("all");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === "suspended" ? "active" : "suspended" as const }
        : user
    ));
  };

  const handleVerifyUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, verified: !user.verified, status: user.verified ? "pending" : "active" as const }
        : user
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-MW', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500/20 text-green-500";
      case "suspended": return "bg-red-500/20 text-red-500";
      case "pending": return "bg-yellow-500/20 text-yellow-500";
      default: return "bg-[#404040] text-[#B3B3B3]";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "bg-purple-500/20 text-purple-500";
      case "user": return "bg-blue-500/20 text-blue-500";
      default: return "bg-[#404040] text-[#B3B3B3]";
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
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-[#B3B3B3]">Manage all platform users and their permissions</p>
              </div>
              <button className="flex items-center gap-2 bg-[#1DB954] text-white px-4 py-2 rounded-xl hover:bg-[#1DB954]/90 transition-colors">
                <Download size={16} />
                Export Users
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
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
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="pending">Pending</option>
              </select>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="bg-[#191414] border border-[#404040] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#1DB954]"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="admin">Admins</option>
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
                <Users className="text-blue-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{users.length}</p>
                  <p className="text-xs text-[#B3B3B3]">Total Users</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{users.filter(u => u.status === "active").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Active Users</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="text-yellow-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{users.filter(u => u.status === "pending").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Pending Verification</p>
                </div>
              </div>
            </div>
            <div className="bg-[#282828] border border-[#404040] rounded-xl p-4">
              <div className="flex items-center gap-3">
                <XCircle className="text-red-500" size={20} />
                <div>
                  <p className="text-2xl font-bold text-white">{users.filter(u => u.status === "suspended").length}</p>
                  <p className="text-xs text-[#B3B3B3]">Suspended Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-[#282828] border border-[#404040] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#191414] border-b border-[#404040]">
                  <tr>
                    <th className="text-left p-4 text-[#B3B3B3] font-medium">User</th>
                    <th className="text-left p-4 text-[#B3B3B3] font-medium">Contact</th>
                    <th className="text-left p-4 text-[#B3B3B3] font-medium">Role</th>
                    <th className="text-left p-4 text-[#B3B3B3] font-medium">Status</th>
                    <th className="text-left p-4 text-[#B3B3B3] font-medium">Rating</th>
                    <th className="text-left p-4 text-[#B3B3B3] font-medium">Jobs</th>
                    <th className="text-left p-4 text-[#B3B3B3] font-medium">Joined</th>
                    <th className="text-left p-4 text-[#B3B3B3] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-[#404040] hover:bg-[#333333] transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">{user.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{user.name}</p>
                            <div className="flex items-center gap-2">
                              {user.verified && <CheckCircle size={12} className="text-green-500" />}
                              <span className="text-xs text-[#B3B3B3]">{user.intent}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[#B3B3B3] text-sm">
                            <Mail size={12} />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-[#B3B3B3] text-sm">
                              <Phone size={12} />
                              {user.phone}
                            </div>
                          )}
                          {user.location && (
                            <div className="flex items-center gap-2 text-[#B3B3B3] text-sm">
                              <MapPin size={12} />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          {user.rating ? (
                            <>
                              <Star size={14} className="text-yellow-500 fill-current" />
                              <span className="text-white text-sm">{user.rating}</span>
                            </>
                          ) : (
                            <span className="text-[#B3B3B3] text-sm">N/A</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-white text-sm">{user.jobsCompleted}</span>
                      </td>
                      <td className="p-4">
                        <div className="text-[#B3B3B3] text-sm">
                          <div>{formatDate(user.joinedAt)}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleVerifyUser(user.id)}
                            className="p-1 text-[#B3B3B3] hover:text-green-500 transition-colors"
                            title={user.verified ? "Remove Verification" : "Verify User"}
                          >
                            <Shield size={16} />
                          </button>
                          <button
                            onClick={() => handleSuspendUser(user.id)}
                            className="p-1 text-[#B3B3B3] hover:text-red-500 transition-colors"
                            title={user.status === "suspended" ? "Unsuspend User" : "Suspend User"}
                          >
                            {user.status === "suspended" ? <UserCheck size={16} /> : <Ban size={16} />}
                          </button>
                          <button className="p-1 text-[#B3B3B3] hover:text-white transition-colors">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-[#B3B3B3] mb-4" />
                <h3 className="text-white font-semibold mb-2">No users found</h3>
                <p className="text-[#B3B3B3] text-sm">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </AppSidebar>
  );
}
