import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Send, Phone, Video, MoreVertical, 
  Paperclip, Smile, Check, CheckCheck
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import AppNavigation from "../components/AppNavigation";

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  isOwn: boolean;
}

interface Chat {
  id: string;
  participantName: string;
  participantAvatar: string;
  isOnline: boolean;
  jobTitle?: string;
}

const mockChats: Record<string, Chat> = {
  "c1": {
    id: "c1",
    participantName: "James Mwangi",
    participantAvatar: "JM",
    isOnline: true,
    jobTitle: "Electrical wiring for new office",
  },
  "c2": {
    id: "c2",
    participantName: "Mary Akinyi",
    participantAvatar: "MA",
    isOnline: true,
    jobTitle: "House deep cleaning",
  },
};

const mockMessages: Record<string, Message[]> = {
  "c1": [
    {
      id: "m1",
      senderId: "worker",
      content: "Hello! I saw your job posting and I'm interested.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      isOwn: false,
    },
    {
      id: "m2",
      senderId: "user",
      content: "Great! Can you tell me more about your experience with electrical wiring?",
      timestamp: new Date(Date.now() - 1000 * 60 * 50),
      read: true,
      isOwn: true,
    },
    {
      id: "m3",
      senderId: "worker",
      content: "I have 10+ years of experience in both commercial and residential wiring. I'm certified and have completed over 200 similar projects.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: true,
      isOwn: false,
    },
    {
      id: "m4",
      senderId: "user",
      content: "That sounds perfect! When can you start?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: true,
      isOwn: true,
    },
    {
      id: "m5",
      senderId: "worker",
      content: "I can come tomorrow morning at 9am. Does that work for you?",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      read: false,
      isOwn: false,
    },
  ],
  "c2": [
    {
      id: "m1",
      senderId: "worker",
      content: "Hi! I'd like to apply for the cleaning job.",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: true,
      isOwn: false,
    },
    {
      id: "m2",
      senderId: "user",
      content: "Sure! Can you provide more details about your cleaning services?",
      timestamp: new Date(Date.now() - 1000 * 60 * 90),
      read: true,
      isOwn: true,
    },
    {
      id: "m3",
      senderId: "worker",
      content: "I offer deep cleaning services including windows, floors, bathrooms, and kitchen. I bring my own eco-friendly supplies.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: true,
      isOwn: false,
    },
  ],
};

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundChat = mockChats[id || ""];
      if (foundChat) {
        setChat(foundChat);
        setMessages(mockMessages[id || ""] || []);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !chat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: "user",
      content: newMessage.trim(),
      timestamp: new Date(),
      read: true,
      isOwn: true,
    };

    setMessages(prev => [...prev, message]);
    setNewMessage("");

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: "worker",
        content: "Thanks for your message! I'll get back to you shortly.",
        timestamp: new Date(),
        read: false,
        isOwn: false,
      };
      setMessages(prev => [...prev, reply]);
    }, 2000);
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatMessageDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#191414] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#1DB954] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading chat...</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="min-h-screen bg-[#191414] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Chat not found</h2>
          <p className="text-[#B3B3B3] mb-4">The conversation you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate("/messages")}
            className="bg-[#1DB954] text-white px-6 py-2 rounded-xl hover:bg-[#1DB954]/90 transition-colors"
          >
            Back to Messages
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#191414] flex flex-col">
      {/* Chat Header */}
      <header className="bg-[#282828] border-b border-[#404040] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2 bg-[#404040] rounded-xl hover:bg-[#555555] transition-colors"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{chat.participantAvatar}</span>
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#282828]"></div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">{chat.participantName}</h3>
                {chat.jobTitle && (
                  <p className="text-xs text-[#B3B3B3]">{chat.jobTitle}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors rounded-xl hover:bg-[#404040]">
              <Phone size={18} />
            </button>
            <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors rounded-xl hover:bg-[#404040]">
              <Video size={18} />
            </button>
            <button className="p-2 text-[#B3B3B3] hover:text-white transition-colors rounded-xl hover:bg-[#404040]">
              <MoreVertical size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {messages.map((message, index) => {
            const showDate = index === 0 || 
              formatMessageDate(message.timestamp) !== formatMessageDate(messages[index - 1].timestamp);

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex items-center justify-center my-6">
                    <div className="bg-[#282828] border border-[#404040] rounded-full px-4 py-1.5">
                      <p className="text-xs text-[#B3B3B3]">{formatMessageDate(message.timestamp)}</p>
                    </div>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isOwn ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div className={`max-w-xs lg:max-w-md ${
                    message.isOwn 
                      ? "bg-[#1DB954] text-white" 
                      : "bg-[#404040] text-white"
                  } rounded-2xl px-4 py-3`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <div className={`flex items-center gap-1 mt-2 text-xs ${
                      message.isOwn ? "text-white/70" : "text-[#B3B3B3]"
                    }`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {message.isOwn && (
                        message.read ? <CheckCheck size={14} /> : <Check size={14} />
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Message Input */}
      <div className="bg-[#282828] border-t border-[#404040] px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <button className="p-3 text-[#B3B3B3] hover:text-white transition-colors rounded-xl hover:bg-[#404040]">
            <Paperclip size={20} />
          </button>
          <div className="flex-1 bg-[#191414] border border-[#404040] rounded-xl px-4 py-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-transparent text-white placeholder-[#B3B3B3] focus:outline-none"
            />
            <button className="text-[#B3B3B3] hover:text-white transition-colors">
              <Smile size={20} />
            </button>
          </div>
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className={`p-3 rounded-xl transition-colors ${
              newMessage.trim() 
                ? "bg-[#1DB954] text-white hover:bg-[#1DB954]/90" 
                : "bg-[#404040] text-[#B3B3B3] cursor-not-allowed"
            }`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <AppNavigation />
    </div>
  );
}
