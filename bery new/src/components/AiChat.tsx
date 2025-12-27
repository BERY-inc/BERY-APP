import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Send, Mic, Paperclip, MoreVertical, Check, CheckCheck, Search, Sparkles, Wifi, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";

interface AiChatProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  cartItemCount?: number;
  wsUrl?: string; // WebSocket server URL
}

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  status?: "sent" | "delivered" | "read" | "failed";
  mediaType?: "image" | "file" | "video";
  mediaUrl?: string;
  mediaName?: string;
  senderName?: string;
}

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isAI?: boolean;
  isOnline?: boolean;
}

interface WebSocketMessage {
  type: "message" | "status" | "typing" | "connect" | "disconnect" | "ai-chat-message" | "register" | "registered" | "media";
  contactId?: string;
  messageId?: number;
  text?: string;
  status?: "sent" | "delivered" | "read" | "failed";
  timestamp?: string;
  response?: string;
  userId?: string;
  userName?: string;
  error?: string;
  mediaType?: "image" | "file" | "video";
  mediaUrl?: string;
  mediaName?: string;
  senderName?: string;
}

export function AiChat({ onBack, onNavigate, cartItemCount = 0, wsUrl = "ws://localhost:8080" }: AiChatProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUserName, setCurrentUserName] = useState<string>("");

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  const contacts: Contact[] = [
    {
      id: "bery-ai",
      name: "Bery AI Assistant",
      lastMessage: "I'm here to help with your finances!",
      timestamp: "Now",
      unread: 0,
      isAI: true,
      isOnline: true,
    },
    {
      id: "user-1",
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?img=45",
      lastMessage: "Thanks for the payment!",
      timestamp: "10:45 AM",
      unread: 2,
      isOnline: true,
    },
    {
      id: "user-2",
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?img=33",
      lastMessage: "Can you send me the invoice?",
      timestamp: "Yesterday",
      unread: 0,
      isOnline: false,
    },
    {
      id: "user-3",
      name: "Emma Wilson",
      avatar: "https://i.pravatar.cc/150?img=44",
      lastMessage: "Perfect, I'll send it tomorrow",
      timestamp: "Yesterday",
      unread: 1,
      isOnline: true,
    },
    {
      id: "user-4",
      name: "James Rodriguez",
      avatar: "https://i.pravatar.cc/150?img=12",
      lastMessage: "How much did you invest?",
      timestamp: "2 days ago",
      unread: 0,
      isOnline: false,
    },
  ];

  const [messages, setMessages] = useState<{ [contactId: string]: Message[] }>({
    "bery-ai": [
      {
        id: 1,
        text: "Hello! I'm Bery AI, your financial assistant. I can help you with:\n\n• Balance inquiries\n• Investment advice\n• Transaction support\n• Marketplace guidance\n\nHow can I help you today?",
        isUser: false,
        timestamp: new Date(Date.now() - 60000),
        status: "read",
      },
    ],
    "user-1": [
      {
        id: 1,
        text: "Hey! Did you receive the payment?",
        isUser: true,
        timestamp: new Date(Date.now() - 120000),
        status: "read",
      },
      {
        id: 2,
        text: "Yes! Just got it. Thanks so much! 💙",
        isUser: false,
        timestamp: new Date(Date.now() - 60000),
      },
      {
        id: 3,
        text: "Thanks for the payment!",
        isUser: false,
        timestamp: new Date(Date.now() - 30000),
      },
    ],
  });

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // WebSocket connection management
  useEffect(() => {
    // Assign user ID based on localStorage counter for multi-tab testing
    const userCounter = parseInt(localStorage.getItem('chatUserCounter') || '0') + 1;
    localStorage.setItem('chatUserCounter', userCounter.toString());

    const userId = `user-${userCounter}`;
    const userName = contacts.find(c => c.id === userId)?.name || `User ${userCounter}`;

    setCurrentUserId(userId);
    setCurrentUserName(userName);

    connectWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, []);

  const connectWebSocket = () => {
    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        setConnectionError("");
        reconnectAttemptsRef.current = 0;

        // Send initial connection message
        sendWebSocketMessage({
          type: "connect",
          timestamp: new Date().toISOString(),
        });

        // Register current user with unique ID
        sendWebSocketMessage({
          type: "register",
          userId: currentUserId,
          userName: currentUserName,
        });
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(data);
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setConnectionError("Connection error occurred");
      };

      ws.onclose = () => {
        console.log("WebSocket disconnected");
        setIsConnected(false);

        // Attempt to reconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);

          console.log(`Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
          reconnectTimeoutRef.current = setTimeout(connectWebSocket, delay);
        } else {
          setConnectionError("Unable to connect. Please refresh the page.");
        }
      };
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setConnectionError("Failed to establish connection");
    }
  };

  const sendWebSocketMessage = (message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected");
    }
  };

  const handleWebSocketMessage = (data: WebSocketMessage) => {
    switch (data.type) {
      case "message":
        if (data.contactId && (data.text || data.mediaUrl)) {
          const newMessage: Message = {
            id: data.messageId || Date.now(),
            text: data.text || "",
            isUser: false,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            status: "read",
            mediaType: data.mediaType,
            mediaUrl: data.mediaUrl,
            mediaName: data.mediaName,
            senderName: data.senderName,
          };

          setMessages(prev => ({
            ...prev,
            [data.contactId!]: [...(prev[data.contactId!] || []), newMessage],
          }));
        }
        break;

      case "media":
        // Handle media messages specifically
        if (data.contactId && data.mediaUrl) {
          const mediaMessage: Message = {
            id: data.messageId || Date.now(),
            text: data.text || "",
            isUser: false,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            status: "read",
            mediaType: data.mediaType,
            mediaUrl: data.mediaUrl,
            mediaName: data.mediaName,
            senderName: data.senderName,
          };

          setMessages(prev => ({
            ...prev,
            [data.contactId!]: [...(prev[data.contactId!] || []), mediaMessage],
          }));
        }
        break;

      case "ai-chat-message":
        // Handle AI chat responses from Laravel broadcasting
        if (data.contactId && data.response) {
          const aiMessage: Message = {
            id: Date.now(),
            text: data.response,
            isUser: false,
            timestamp: new Date(),
            status: "read",
          };

          setMessages(prev => ({
            ...prev,
            [data.contactId!]: [...(prev[data.contactId!] || []), aiMessage],
          }));
        }
        break;

      case "status":
        if (data.contactId && data.messageId && data.status) {
          setMessages(prev => ({
            ...prev,
            [data.contactId!]: prev[data.contactId!]?.map(msg =>
              msg.id === data.messageId ? { ...msg, status: data.status } : msg
            ) || [],
          }));
        }
        break;

      case "typing":
        // Handle typing indicator if needed
        console.log(`${data.contactId} is typing...`);
        break;

      case "registered":
        // User registration confirmed
        console.log(`User registered: ${data.userName} (${data.userId})`);
        break;

      case "connect":
      case "disconnect":
        // Handle connection events
        console.log(`WebSocket ${data.type}`);
        break;

      default:
        console.log("Unknown message type:", data.type);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };



  useEffect(() => {
    if (selectedContact) {
      scrollToBottom();
    }
  }, [messages, selectedContact]);

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedContact) return;

    // Handle text-only messages
    const messageId = Date.now();
    const userMessage: Message = {
      id: messageId,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), userMessage],
    }));

    // Try to send via API first (Laravel backend)
    let apiSuccess = false;
    try {
      const token = localStorage.getItem('auth_token'); // Assuming token is stored in localStorage
      const response = await fetch('http://localhost:8000/api/rest_api/v1/customer/ai-chat/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: inputValue,
          contact_id: selectedContact.id,
        }),
      });

      if (response.ok) {
        apiSuccess = true;
        // Update message status to delivered
        setMessages(prev => ({
          ...prev,
          [selectedContact.id]: prev[selectedContact.id].map(msg =>
            msg.id === userMessage.id ? { ...msg, status: "delivered" as const } : msg
          ),
        }));

        // Send via WebSocket for real-time updates
        sendWebSocketMessage({
          type: "message",
          contactId: selectedContact.id,
          messageId: messageId,
          text: inputValue,
          timestamp: new Date().toISOString(),
        });
      } else {
        console.error('API failed, falling back to WebSocket');
      }
    } catch (error) {
      console.error('API error, falling back to WebSocket:', error);
    }

    // If API failed or Laravel backend is not available, send directly via WebSocket
    if (!apiSuccess) {
      // Update message status to delivered (WebSocket will handle it)
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: prev[selectedContact.id].map(msg =>
          msg.id === userMessage.id ? { ...msg, status: "delivered" as const } : msg
        ),
      }));

      // Send via WebSocket - the server will generate AI responses
      sendWebSocketMessage({
        type: "message",
        contactId: selectedContact.id,
        messageId: messageId,
        text: inputValue,
        timestamp: new Date().toISOString(),
      });
    }

    setInputValue("");
  };

  const getAiResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (lowerInput.includes("balance") || lowerInput.includes("money") || lowerInput.includes("wallet")) {
      return "Your current balance is:\n\n💵 Total: $13,400\n₿ Bery: 119,260 (1 USD = 8.9 ₿)\n\nWould you like to see your transaction history or investment portfolio?";
    } else if (lowerInput.includes("invest")) {
      return "Great question! We have several investment options:\n\n📊 Fixed Deposit: 6% APY (Low risk)\n💰 Lending Pool: 10% APY (Medium risk)\n📈 Equity Pool: 15% APY (High risk)\n🚀 Venture Capital: 30% APY (High risk/reward)\n🏢 Real Estate: 12% APY (Medium risk)\n\nWhich interests you most?";
    } else if (lowerInput.includes("send") || lowerInput.includes("transfer")) {
      return "To send money:\n\n1. Tap 'Send' on your wallet\n2. Select recipient or enter wallet ID\n3. Enter amount in USD or Bery\n4. Confirm transaction\n\nYou can send to any Bery user instantly with zero fees! Need help with a specific transfer?";
    } else if (lowerInput.includes("marketplace") || lowerInput.includes("buy") || lowerInput.includes("shop")) {
      return "The Bery Marketplace has:\n\n🛍️ Products: Electronics, home goods, fashion & more\n💼 Services: Design, development, marketing, video editing\n\nAll payments accepted in Bery (₿) or USD. Want me to show you featured items?";
    } else if (lowerInput.includes("bery") || lowerInput.includes("currency")) {
      return "Bery (₿) is the platform's native currency!\n\n💱 Exchange Rate: 1 USD = 8.9 ₿\n✅ Use for all marketplace purchases\n⚡ Instant transfers, zero fees\n🌍 Accepted globally on Bery\n\nYou can convert USD to Bery anytime from your wallet!";
    } else if (lowerInput.includes("hi") || lowerInput.includes("hello") || lowerInput.includes("hey")) {
      return "Hi there! 👋 I'm Bery AI, your financial assistant.\n\nI can help you with:\n• Account & balance info\n• Investment recommendations\n• Transaction support\n• Marketplace guidance\n• Currency conversions\n\nWhat would you like to know?";
    } else if (lowerInput.includes("help") || lowerInput.includes("support")) {
      return "I'm here to help! You can ask me about:\n\n💰 Wallet & balances\n📊 Investments & returns\n💸 Sending & receiving money\n🛒 Marketplace purchases\n₿ Bery currency info\n🌍 Platform features\n\nJust ask your question and I'll do my best to help!";
    } else {
      return "I'm here to help with your Bery account! You can ask me about:\n\n• Your balance & wallet\n• Investment opportunities\n• Sending money\n• The marketplace\n• Bery currency\n\nWhat would you like to know?";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredContacts = contacts.filter(contact =>
    contact.id !== currentUserId && contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!selectedContact) {
    // Contacts List View
    return (
      <div className="h-screen flex flex-col bg-[#0a0a1a] pb-32">
        {/* Header */}
        <div className="bg-[#1a1d24] px-5 pt-14 pb-4 flex-shrink-0 border-b border-slate-800/50">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-slate-300 hover:bg-slate-800/50 rounded-full h-9 w-9"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl text-white flex-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Messages
            </h1>

            {/* Connection Status */}
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>

          {/* Connection Error */}
          {connectionError && (
            <div className="mb-3 px-3 py-2 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-xs text-red-400">{connectionError}</p>
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="pl-10 bg-[#2a2f38] border-slate-700/40 text-white placeholder:text-slate-500 h-10 rounded-xl"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact, index) => (
            <motion.button
              key={contact.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => setSelectedContact(contact)}
              className="w-full px-5 py-4 flex items-center gap-3 hover:bg-slate-800/30 transition-colors border-b border-slate-800/30"
            >
              <div className="relative">
                {contact.isAI ? (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                ) : (
                  <Avatar className="w-14 h-14 border-2 border-slate-700/50">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{contact.name[0]}</AvatarFallback>
                  </Avatar>
                )}
                {contact.isOnline && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0a1a]" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm text-white truncate" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    {contact.name}
                  </p>
                  <span className="text-xs text-slate-400 ml-2 flex-shrink-0">
                    {contact.timestamp}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400 truncate flex-1">
                    {contact.lastMessage}
                  </p>
                  {contact.unread > 0 && (
                    <div className="ml-2 flex-shrink-0 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        {contact.unread}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <BottomNavigation currentScreen="ai-chat" onNavigate={onNavigate} cartItemCount={cartItemCount} />
      </div>
    );
  }

  // Chat View
  const contactMessages = messages[selectedContact.id] || [];


  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-[#0a0a1a] via-[#0d0d1d] to-[#0a0a1a] pb-32">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#1a1d24] to-[#15181f] px-4 pt-14 pb-4 flex-shrink-0 border-b border-slate-800/50 shadow-xl">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedContact(null)}
            className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl h-10 w-10 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div className="relative">
            {selectedContact.isAI ? (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/30">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            ) : (
              <Avatar className="w-11 h-11 border-2 border-slate-700/50 rounded-xl">
                <AvatarImage src={selectedContact.avatar} />
                <AvatarFallback>{selectedContact.name[0]}</AvatarFallback>
              </Avatar>
            )}
            {selectedContact.isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[#1a1d24]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-sm text-white truncate" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              {selectedContact.name}
            </h1>
            <div className="flex items-center gap-1.5">
              <p className="text-xs text-slate-400">
                {selectedContact.isOnline ? (selectedContact.isAI ? "AI Assistant" : "Active now") : "Offline"}
              </p>
              {selectedContact.isOnline && <div className="w-1 h-1 rounded-full bg-green-500" />}
            </div>
          </div>

          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2">
            {isConnected ? (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Wifi className="w-3.5 h-3.5 text-green-500" />
                <span className="text-xs text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-red-500/10 border border-red-500/30 rounded-lg">
                <WifiOff className="w-3.5 h-3.5 text-red-500" />
                <span className="text-xs text-red-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>Offline</span>
              </div>
            )}
            {/* Current User ID Display */}
            <div className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <span className="text-xs text-blue-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                {currentUserName} ({currentUserId})
              </span>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-xl h-10 w-10 transition-all"
          >
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Chat Background */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"

      >
        <div className="max-w-2xl mx-auto space-y-3">
          {contactMessages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex gap-3 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {!message.isUser && (
                <div className="flex-shrink-0 mt-1">
                  {selectedContact.isAI ? (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <Avatar className="w-8 h-8 border-2 border-slate-700/50">
                      <AvatarImage src={selectedContact.avatar} />
                      <AvatarFallback className="text-xs">{selectedContact.name[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}

              <div className={`flex flex-col ${message.isUser ? 'items-end' : 'items-start'} max-w-[75%]`}>
                {/* Sender name for group chats */}
                {!message.isUser && message.senderName && selectedContact.id.startsWith('group-') && (
                  <p className="text-xs text-slate-400 mb-1 px-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                    {message.senderName}
                  </p>
                )}

                <div
                  className={`rounded-2xl px-4 py-3 ${
                    message.isUser
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/20'
                      : selectedContact.isAI
                        ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 text-white shadow-lg'
                        : 'bg-slate-800/80 border border-slate-700/30 text-white shadow-md'
                  }`}
                  style={{
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  {/* Media content */}
                  {message.mediaUrl && (
                    <div className="mb-2">
                      {message.mediaType === 'image' && (
                        <img
                          src={message.mediaUrl}
                          alt={message.mediaName || 'Image'}
                          className="rounded-lg max-w-full h-auto max-h-64 object-cover cursor-pointer"
                          onClick={() => window.open(message.mediaUrl, '_blank')}
                        />
                      )}
                      {message.mediaType === 'video' && (
                        <video
                          src={message.mediaUrl}
                          controls
                          className="rounded-lg max-w-full h-auto max-h-64"
                          style={{ maxWidth: '100%' }}
                        />
                      )}
                      {message.mediaType === 'file' && (
                        <div className="flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg">
                          <Paperclip className="w-4 h-4 text-slate-400" />
                          <a
                            href={message.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm underline"
                          >
                            {message.mediaName || 'Download file'}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Text content */}
                  {message.text && (
                    <p className="text-sm leading-relaxed break-words whitespace-pre-line" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {message.text}
                    </p>
                  )}
                </div>

                <div className={`flex items-center gap-1.5 mt-1 px-1 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <span className="text-xs text-slate-500">
                    {formatTime(message.timestamp)}
                  </span>
                  {message.isUser && message.status && (
                    <span className="text-slate-400">
                      {message.status === "sent" && <Check className="w-3 h-3" />}
                      {message.status === "delivered" && <CheckCheck className="w-3 h-3" />}
                      {message.status === "read" && <CheckCheck className="w-3 h-3 text-blue-500" />}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="px-4 pb-6 flex-shrink-0 bg-gradient-to-b from-[#1a1d24] to-[#0a0a1a] border-t border-slate-800/50">
        <div className="flex items-center gap-3 pt-4 max-w-2xl mx-auto">
         <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              disabled={!isConnected}
              className="w-full bg-slate-800/50 border-slate-700/40 text-white placeholder:text-slate-500 h-12 px-5 rounded-2xl focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:border-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm cursor-text"
              style={{ fontFamily: 'Inter, sans-serif', cursor: 'text' }}
            />
          </div>

          {inputValue.trim() ? (
            <Button
              onClick={handleSend}
              disabled={!isConnected}
              className="h-11 w-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 flex-shrink-0 p-0 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/30 transition-all"
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              disabled={!isConnected}
              className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl h-11 w-11 flex-shrink-0 disabled:opacity-50 transition-all"
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      <BottomNavigation currentScreen="ai-chat" onNavigate={onNavigate} cartItemCount={cartItemCount} />
    </div>
  );
}