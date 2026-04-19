import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  MessageCircle, Search, Send, Paperclip, Phone, 
  Video, MoreVertical, Check, CheckCheck, Clock
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppSidebar from "../components/AppSidebar";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  read: boolean;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    participantId: "worker1",
    participantName: "John Banda",
    participantAvatar: "JB",
    lastMessage: "Thanks for hiring me! I'll be there tomorrow at 9 AM",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
    unreadCount: 2,
    isOnline: true
  },
  {
    id: "2", 
    participantId: "worker2",
    participantName: "Mary Phiri",
    participantAvatar: "MP",
    lastMessage: "Can you provide more details about plumbing job?",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 1,
    isOnline: false
  },
  {
    id: "3", 
    participantId: "worker3", 
    participantName: "Samuel Chikapa",
    participantAvatar: "SC",
    lastMessage: "I've completed electrical work. Please check and confirm.",
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    isOnline: true
  }
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "worker1",
    senderName: "John Banda",
    content: "Hi! I'm available for the electrical job you posted.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60),
    read: true,
    isOwn: false
  },
  {
    id: "2",
    senderId: "user",
    senderName: "You",
    content: "Great! When can you start?",
    timestamp: new Date(Date.now() - 1000 * 60 * 50),
    read: true,
    isOwn: true
  },
  {
    id: "3",
    senderId: "worker1",
    senderName: "John Banda",
    content: "Thanks for hiring me! I'll be there tomorrow at 9 AM",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    isOwn: false
  }
];

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      let filtered = mockConversations.filter(conv => 
        conv.participantName.toLowerCase().includes(search.toLowerCase())
      );
      setConversations(filtered);
      setLoading(false);
    }, 500);
  }, [search]);

  useEffect(() => {
    if (selectedConversation) {
      // Simulate loading messages for selected conversation
      setMessages(mockMessages);
    }
  }, [selectedConversation]);

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

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "user",
      senderName: "You",
      content: newMessage.trim(),
      timestamp: new Date(),
      read: true,
      isOwn: true
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");
  };

  return (
    <AppSidebar>
      <div className="min-h-screen bg-[#191414] flex">
        {/* Conversations List */}
        <div className="w-80 bg-[#282828] border-r border-[#404040] flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-[#404040]">
            <h2 className="text-xl font-bold text-white mb-3">Messages</h2>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B3B3B3]" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#191414] border border-[#404040] rounded-xl pl-10 pr-4 py-2 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954]"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-6 h-6 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="text-center py-20">
                <MessageCircle size={48} className="mx-auto text-[#B3B3B3] mb-4" />
                <h3 className="text-white font-semibold mb-2">No conversations yet</h3>
                <p className="text-[#B3B3B3] text-sm">Start messaging workers or clients</p>
              </div>
            ) : (
              conversations.map(conv => (
                <motion.div
                  key={conv.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ backgroundColor: "#333333" }}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={`flex items-center gap-3 p-4 cursor-pointer border-b border-[#404040] ${
                    selectedConversation === conv.id ? "bg-[#333333]" : ""
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{conv.participantAvatar}</span>
                    </div>
                    {conv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#282828]"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white truncate">{conv.participantName}</h3>
                      <span className="text-xs text-[#B3B3B3]">{formatTime(conv.lastMessageTime)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#B3B3B3] truncate">{conv.lastMessage}</p>
                      {conv.unreadCount > 0 && (
                        <span className="bg-[#1DB954] text-white text-xs px-2 py-1 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="bg-[#282828] border-b border-[#404040] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">
                    {conversations.find(c => c.id === selectedConversation)?.participantAvatar}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-white">
                    {conversations.find(c => c.id === selectedConversation)?.participantName}
                  </h3>
                  <p className="text-xs text-green-500">Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors">
                  <Phone size={18} />
                </button>
                <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors">
                  <Video size={18} />
                </button>
                <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    message.isOwn 
                      ? "bg-[#1DB954] text-white" 
                      : "bg-[#404040] text-white"
                  } rounded-2xl px-4 py-2`}>
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center gap-1 mt-1 text-xs ${
                      message.isOwn ? "text-white/70" : "text-[#B3B3B3]"
                    }`}>
                      <Clock size={12} />
                      <span>{formatTime(message.timestamp)}</span>
                      {message.isOwn && (
                        message.read ? <CheckCheck size={12} /> : <Check size={12} />
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-[#282828] border-t border-[#404040] p-4">
              <div className="flex items-center gap-2">
                <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors">
                  <Paperclip size={20} />
                </button>
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1 bg-[#191414] border border-[#404040] rounded-xl px-4 py-2 text-white placeholder-[#B3B3B3] focus:outline-none focus:border-[#1DB954]"
                />
                <button
                  onClick={sendMessage}
                  className="p-2 bg-[#1DB954] text-white rounded-xl hover:bg-[#1DB954]/90 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle size={64} className="mx-auto text-[#B3B3B3] mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
              <p className="text-[#B3B3B3]">Choose a conversation to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </AppSidebar>
  );
}
