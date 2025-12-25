import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Send, Mic, Paperclip, MoreVertical, Check, CheckCheck, Search, Sparkles, Wifi, WifiOff } from "lucide-react";
import { motion } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";
import { chatService, Conversation, ChatMessage } from "../services/chatService";
import { toast } from "sonner";

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
  status?: "sent" | "delivered" | "read";
  images?: string[]; // Array of image URLs
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
  // Backend fields
  conversationId?: number;
  receiverType?: 'admin' | 'vendor' | 'delivery_man';
  receiverId?: number;
}

interface WebSocketMessage {
  type: "message" | "status" | "typing" | "connect" | "disconnect";
  contactId?: string;
  messageId?: number;
  text?: string;
  status?: "sent" | "delivered" | "read";
  timestamp?: string;
}

export function AiChat({ onBack, onNavigate, cartItemCount = 0, wsUrl = "ws://localhost:8080" }: AiChatProps) {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConnected, setIsConnected] = useState(false); // Using this for general connectivity status
  const [connectionError, setConnectionError] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(false);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>();
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // Initial AI Contact
  const aiContact: Contact = {
    id: "bery-ai",
    name: "Bery AI Assistant",
    lastMessage: "I'm here to help with your finances!",
    timestamp: "Now",
    unread: 0,
    isAI: true,
    isOnline: true,
  };

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
  });

  const [inputValue, setInputValue] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
    // Set up polling for new conversations list every 30 seconds
    const interval = setInterval(fetchConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchConversations = async () => {
    try {
      setIsLoadingContacts(true);
      const data = await chatService.getConversations();
      
      const mappedContacts: Contact[] = data.conversations.map((conv: Conversation) => {
        let name = "Unknown";
        let avatar = "";
        let receiverId = 0;
        let receiverType: 'admin' | 'vendor' | 'delivery_man' = 'admin'; // Default

        // Determine remote party details
        // If current user is sender, remote is receiver. If current user is receiver, remote is sender.
        // However, the API returns 'sender' and 'receiver' objects.
        // Usually the user ID matches one of them.
        // For simplicity, we assume the 'receiver' or 'sender' object that is NOT the current user is the contact.
        // But since we don't easily have current user ID here without authService, we can infer from structure or usage.
        // In the backend controller, 'conversations' query checks where sender_id or receiver_id is current user.
        
        // Let's rely on checking if sender_type is 'customer' -> remote is receiver.
        // If receiver_type is 'customer' -> remote is sender.
        
        // Wait, backend logic:
        // $q->where(['sender_id' => $sender->id])->orWhere(['receiver_id' => $sender->id]);
        
        // We need to identify which one is the "other" person.
        // Assuming the app is for 'customer'.
        
        let remoteUser;
        if (conv.sender_type === 'customer') {
           remoteUser = conv.receiver;
           receiverType = conv.receiver_type as any;
           receiverId = conv.receiver_id;
        } else {
           remoteUser = conv.sender;
           receiverType = conv.sender_type as any; // If sender is vendor, we are replying to vendor
           receiverId = conv.sender_id;
        }

        if (remoteUser) {
           name = `${remoteUser.f_name || ''} ${remoteUser.l_name || ''}`.trim();
           avatar = remoteUser.image || "";
           // If remoteUser is admin (receiver_id=0 or admin_id present), handle name
           if (receiverType === 'admin' || !receiverId) {
             name = "Support Admin";
           }
        } else {
           if (receiverType === 'admin') name = "Support Admin";
           else name = "Unknown User";
        }

        return {
          id: conv.id.toString(),
          name: name,
          avatar: avatar, // You might need to prepend base URL if it's relative
          lastMessage: conv.last_message?.message || "No messages",
          timestamp: conv.last_message_time ? new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "",
          unread: conv.unread_message_count || 0,
          isOnline: false, // Cannot determine easily without WS
          conversationId: conv.id,
          receiverType: receiverType,
          receiverId: receiverId
        };
      });

      setContacts([aiContact, ...mappedContacts]);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to fetch conversations", error);
      // Fallback to just AI contact on error
      setContacts([aiContact]);
      // setConnectionError("Failed to load chats");
    } finally {
      setIsLoadingContacts(false);
    }
  };

  // Poll for messages when a contact is selected
  useEffect(() => {
    if (selectedContact && !selectedContact.isAI) {
      fetchMessages(selectedContact);
      
      // Poll every 5 seconds for new messages
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(selectedContact, true); // silent update
      }, 5000);
    } else {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    }

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
    };
  }, [selectedContact]);

  const fetchMessages = async (contact: Contact, silent = false) => {
    try {
      if (!contact.conversationId && !contact.receiverId) return;

      const data = await chatService.getMessages(
        contact.conversationId,
        contact.receiverType === 'vendor' ? contact.receiverId : undefined,
        contact.receiverType === 'delivery_man' ? contact.receiverId : undefined,
        contact.receiverType === 'admin' ? 1 : undefined // Admin ID logic
      );

      const mappedMessages: Message[] = data.messages.map((msg: ChatMessage) => ({
        id: msg.id,
        text: msg.message,
        isUser: msg.sender_id !== contact.receiverId, // Assumption: if sender is not the contact (receiver), it's us. 
        // Better check: msg.sender_id === currentUserId. But we assume we are the 'customer'. 
        // Actually, for incoming messages, sender_id is the remote user. 
        // If msg.sender_id === contact.receiverId (the remote user ID), then isUser is false.
        // Wait, contact.receiverId is the ID of the remote entity (Vendor ID, DM ID).
        // The message.sender_id refers to UserInfo ID usually. 
        // Let's look at backend: 
        // $message->sender_id = $sender->id; (Sender is UserInfo).
        // If we are customer, our UserInfo ID is different from Vendor's UserInfo ID.
        // We need to know OUR UserInfo ID to be sure.
        // However, usually `isUser` means "Is Current Logged In User".
        // If `msg.sender_id` matches the conversation's `sender_id` (if we created it) OR `receiver_id` (if they created it)...
        // Simpler: We know `contact` is the OTHER person.
        // If `msg.sender_id` matches the `contact`'s UserInfo ID, it's them.
        // But `contact.receiverId` might be VendorID, not UserInfoID.
        // The backend `getMessages` returns `conversation` with `sender` and `receiver` UserInfos.
        // We can compare `msg.sender_id` with `conversation.sender_id` and `conversation.receiver_id`.
        // We know we are 'customer'. 
        // If `conversation.sender_type` is 'customer', we are sender.
        // If `conversation.receiver_type` is 'customer', we are receiver.
        
        // Let's assume for now:
        // We need to know who WE are in this conversation.
        // const isMe = (data.conversation.sender_type === 'customer' && msg.sender_id === data.conversation.sender_id) || 
        //              (data.conversation.receiver_type === 'customer' && msg.sender_id === data.conversation.receiver_id);
        
        timestamp: new Date(msg.created_at),
        status: "read" // Default
      })).map(msg => {
         // Fix isUser logic inside map using the conversation data from response
         const conv = data.conversation;
         const isMe = (conv.sender_type === 'customer' && msg.id /* wait, msg doesn't have sender type, just ID */) ? 
            // We can't access `msg` inside this map easily if we need `data`.
            // Let's rewrite the map.
            false : false;
         return msg;
      });

      // Correct mapping
      const realMappedMessages: Message[] = data.messages.map((msg: ChatMessage) => {
         const conv = data.conversation;
         // Determine if I am sender or receiver of the CONVERSATION
         const amISender = conv.sender_type === 'customer';
         const myId = amISender ? conv.sender_id : conv.receiver_id;
         
         // If message sender ID matches my ID, it's me.
         const isUser = msg.sender_id === myId;
         
         return {
            id: msg.id,
            text: msg.message,
            isUser: isUser,
            timestamp: new Date(msg.created_at),
            status: "read",
            images: msg.file_full_url && msg.file_full_url.length > 0 
                ? msg.file_full_url
                : undefined
         };
      }).reverse(); // Messages usually come newest first from backend paginate, UI expects oldest first (or handle flex-reverse)

      setMessages(prev => ({
        ...prev,
        [contact.id]: realMappedMessages
      }));
    } catch (error) {
      console.error("Error fetching messages", error);
      if (!silent) toast.error("Failed to load messages");
    }
  };

  // WebSocket connection management (Keep existing for potential future use or AI)
  useEffect(() => {
    // connectWebSocket(); // Disable for now to avoid errors on non-existent WS
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
        if (data.contactId && data.text) {
          const newMessage: Message = {
            id: data.messageId || Date.now(),
            text: data.text,
            isUser: false,
            timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
            status: "read",
          };

          setMessages(prev => ({
            ...prev,
            [data.contactId!]: [...(prev[data.contactId!] || []), newMessage],
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

    const messageText = inputValue.trim();
    setInputValue(""); // Clear input immediately

    // Optimistic update
    const tempId = Date.now();
    const userMessage: Message = {
      id: tempId,
      text: messageText,
      isUser: true,
      timestamp: new Date(),
      status: "sent",
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...(prev[selectedContact.id] || []), userMessage],
    }));

    // If it's the AI, simulate response
    if (selectedContact.isAI) {
      setTimeout(() => {
        const aiResponse: Message = {
          id: Date.now() + 1,
          text: getAiResponse(messageText),
          isUser: false,
          timestamp: new Date(),
          status: "read",
        };
        setMessages(prev => ({
          ...prev,
          [selectedContact.id]: [
            ...prev[selectedContact.id].map(msg => 
              msg.id === tempId ? { ...msg, status: "read" as const } : msg
            ),
            aiResponse
          ],
        }));
      }, 1000);
      return;
    }

    // Send to backend
    try {
      await chatService.sendMessage(
        messageText,
        selectedContact.conversationId,
        selectedContact.receiverType,
        selectedContact.receiverId
      );

      // Refresh messages to get the real ID and status
      await fetchMessages(selectedContact, true);
      
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
      // Mark as failed in UI (optional, for now just leave as sent or remove)
      setMessages(prev => ({
        ...prev,
        [selectedContact.id]: prev[selectedContact.id].filter(msg => msg.id !== tempId) // Remove failed message or mark error
      }));
    }
  };

  const getAiResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("balance") || lowerInput.includes("money") || lowerInput.includes("wallet")) {
      return "Your current balance is:\n\n₿ Total: 119,260\n≈ $13,400 (1 USD = 8.9 ₿)\n\nWould you like to see your transaction history or investment portfolio?";
    } else if (lowerInput.includes("invest")) {
      return "Great question! We have several investment options:\n\n📊 Fixed Deposit: 6% APY (Low risk)\n💰 Lending Pool: 10% APY (Medium risk)\n📈 Equity Pool: 15% APY (High risk)\n🚀 Venture Capital: 30% APY (High risk/reward)\n🏢 Real Estate: 12% APY (Medium risk)\n\nWhich interests you most?";
    } else if (lowerInput.includes("send") || lowerInput.includes("transfer")) {
      return "To send money:\n\n1. Tap 'Send' on your wallet\n2. Select recipient or enter wallet ID\n3. Enter amount in Bery (₿)\n4. Confirm transaction\n\nYou can send to any Bery user instantly with zero fees! Need help with a specific transfer?";
    } else if (lowerInput.includes("marketplace") || lowerInput.includes("buy") || lowerInput.includes("shop")) {
      return "The Bery Marketplace has:\n\n🛍️ Products: Electronics, home goods, fashion & more\n💼 Services: Design, development, marketing, video editing\n\nAll payments accepted in Bery (₿). Want me to show you featured items?";
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
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
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
                  {message.images && message.images.length > 0 && (
                    <div className="mb-2 space-y-2">
                        {message.images.map((img, idx) => (
                            <img key={idx} src={img} alt="attachment" className="rounded-lg max-w-full h-auto object-cover border border-white/10" style={{ maxHeight: '200px' }} />
                        ))}
                    </div>
                  )}
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
        
        {/* Image Preview */}
        {previewUrl && (
          <div className="pt-3 px-1 flex items-center gap-2">
            <div className="relative group">
                <img src={previewUrl} alt="preview" className="h-16 w-16 object-cover rounded-lg border border-slate-600" />
                <button 
                    onClick={clearFile}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors"
                >
                    <div className="w-4 h-4 flex items-center justify-center text-xs">×</div>
                </button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-4 max-w-2xl mx-auto">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-xl h-11 w-11 flex-shrink-0 transition-all"
          >
            <Paperclip className="w-5 h-5" />
          </Button>

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


          {inputValue.trim() || selectedFile ? (
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
