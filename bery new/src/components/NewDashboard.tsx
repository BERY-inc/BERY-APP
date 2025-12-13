import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bell, Plus, Wallet, QrCode, ArrowDownToLine, Copy, TrendingUp, PiggyBank, DollarSign, LineChart, ArrowRight, Clock } from "lucide-react";
import { motion } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";

interface ActiveInvestment {
  id: number;
  name: string;
  type: string;
  amount: number;
  return: number;
  period: string;
  earnings: number;
  status: string;
  icon: any;
  color: string;
  startDate: number;
}

interface NewDashboardProps {
  onSendMoney?: () => void;
  onInvestments?: () => void;
  onMarketplace?: () => void;
  onHistory?: () => void;
  onAiChat?: () => void;
  onProfile?: () => void;
  onNavigate?: (screen: string) => void;
  cartItemCount?: number;
  walletBalance?: number;
  activeInvestments?: ActiveInvestment[];
}

export function NewDashboard({ onSendMoney, onInvestments, onMarketplace, onHistory, onAiChat, onProfile, onNavigate, cartItemCount = 0, walletBalance = 13400, activeInvestments = [] }: NewDashboardProps) {
  const quickSendContacts = [
    { id: "add", name: "Add", avatar: null, isAdd: true },
    { id: "1", name: "Hawkins", avatar: "https://i.pravatar.cc/150?img=33" },
    { id: "2", name: "Ingrid", avatar: "https://i.pravatar.cc/150?img=45" },
    { id: "3", name: "Edwards", avatar: "https://i.pravatar.cc/150?img=12" },
    { id: "4", name: "Sofia", avatar: "https://i.pravatar.cc/150?img=44" },
    { id: "5", name: "Warren", avatar: "https://i.pravatar.cc/150?img=68" },
  ];

  const recentTransactions = [
    {
      id: 1,
      name: "Sofia",
      date: "Mar 16, 2025",
      amount: "+$175.75",
      isPositive: true,
      avatar: "https://i.pravatar.cc/150?img=44",
    },
    {
      id: 2,
      name: "William",
      date: "Mar 15, 2025",
      amount: "+$250.00",
      isPositive: true,
      avatar: "https://i.pravatar.cc/150?img=51",
    },
    {
      id: 3,
      name: "Apple Music",
      date: "April 5, 2025",
      amount: "-$199.88",
      isPositive: false,
      icon: "🎵",
    },
  ];

  const handleNavigate = (screen: string) => {
    if (onNavigate) {
      onNavigate(screen);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-blue-600/30">
              <AvatarImage src="https://i.pravatar.cc/150?img=57" />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-slate-400/80">Good morning,</p>
              <p className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Alex Richards
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-slate-700/30"
          >
            <Bell className="w-5 h-5 text-slate-300" />
          </Button>
        </div>

        {/* Wallet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div 
            className="relative rounded-3xl p-6 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
              boxShadow: '0 20px 60px rgba(30, 58, 138, 0.4)'
            }}
          >
            {/* Wallet Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-200" />
                <span className="text-sm text-blue-200" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  My Wallet
                </span>
              </div>
              <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <QrCode className="w-5 h-5 text-blue-200" />
              </button>
            </div>

            {/* Balance Section - Side by Side */}
            <div className="flex gap-3 mb-6">
              {/* Total Balance */}
              <div className="flex-1">
                <p className="text-[10px] text-blue-100/70 mb-1">Total Balance</p>
                <h2 
                  className="text-2xl tracking-tight"
                  style={{ 
                    fontFamily: 'Inter, sans-serif', 
                    fontWeight: 700,
                    color: '#f0f9ff'
                  }}
                >
                  ${walletBalance.toLocaleString()}
                </h2>
              </div>

              {/* Bery Conversion */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[10px] text-blue-100/70">Bery (₿)</p>
                  <p className="text-[9px] text-blue-100/50">1 USD = 8.9 ₿</p>
                </div>
                <p className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  ₿ {(walletBalance * 8.9).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Wallet ID */}
            <div className="flex items-center justify-between bg-black/20 rounded-xl p-3 mb-4">
              <div className="flex-1">
                <p className="text-[10px] text-blue-100/70 mb-1">Wallet ID</p>
                <p 
                  className="text-xs"
                  style={{ 
                    fontFamily: 'monospace',
                    color: '#f0f9ff',
                    fontWeight: 500
                  }}
                >
                  0x742d...8f4e
                </p>
              </div>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Copy className="w-4 h-4 text-blue-200" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:scale-105"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)' }}
              >
                <ArrowDownToLine className="w-4 h-4 text-white" />
                <span className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Receive
                </span>
              </button>
              <button 
                onClick={onSendMoney}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:scale-105"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(10px)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                <span className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Send
                </span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Investment Performance */}
        {activeInvestments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-xs text-green-300/70">Investment Returns</p>
                <p className="text-lg text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  +${activeInvestments.reduce((sum, inv) => sum + inv.earnings, 0).toLocaleString()}
                </p>
              </div>
            </div>
            <button 
              onClick={onInvestments}
              className="text-xs text-green-300 hover:text-green-200 transition-colors flex items-center gap-1"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              View
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
        )}

        {/* Quick Investment Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Quick Invest
            </h2>
            <button 
              onClick={onInvestments}
              className="text-xs text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-1"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              Explore
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* Fixed Deposit */}
            <button 
              onClick={onInvestments}
              className="bg-[#1a1a2e] border border-slate-600/30 rounded-2xl p-4 hover:border-blue-600/40 transition-all hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto mb-3">
                <PiggyBank className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-slate-300/90 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Fixed Deposit
              </p>
              <p className="text-lg text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                6%
              </p>
              <p className="text-[10px] text-slate-400/70">APY</p>
            </button>

            {/* Lending Pool */}
            <button 
              onClick={onInvestments}
              className="bg-[#1a1a2e] border border-slate-600/30 rounded-2xl p-4 hover:border-blue-600/40 transition-all hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-slate-300/90 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Lending Pool
              </p>
              <p className="text-lg text-blue-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                10%
              </p>
              <p className="text-[10px] text-slate-400/70">APY</p>
            </button>

            {/* Equity Pool */}
            <button 
              onClick={onInvestments}
              className="bg-[#1a1a2e] border border-slate-600/30 rounded-2xl p-4 hover:border-blue-600/40 transition-all hover:scale-105"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mx-auto mb-3">
                <LineChart className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-slate-300/90 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                Equity Pool
              </p>
              <p className="text-lg text-orange-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                15%
              </p>
              <p className="text-[10px] text-slate-400/70">APY</p>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Quick Send */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            Quick Send
          </h2>
          <Button variant="ghost" size="sm" className="text-xs h-auto p-0 hover:bg-transparent text-blue-300">
            See All
          </Button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {quickSendContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={contact.isAdd ? undefined : onSendMoney}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              {contact.isAdd ? (
                <div className="w-14 h-14 rounded-full bg-slate-800/50 border-2 border-dashed border-slate-600/50 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-slate-400" />
                </div>
              ) : (
                <Avatar className="w-14 h-14 border-2 border-blue-600/30 shadow-md shadow-blue-600/10">
                  <AvatarImage src={contact.avatar || undefined} />
                  <AvatarFallback>{contact.name[0]}</AvatarFallback>
                </Avatar>
              )}
              <span className="text-xs text-slate-300">{contact.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            Recent Transactions
          </h2>
          <button 
            onClick={onHistory}
            className="text-xs text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-1"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
          >
            View All
            <Clock className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 shadow-lg shadow-slate-900/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {transaction.avatar ? (
                      <Avatar className="w-12 h-12 border border-slate-600/40">
                        <AvatarImage src={transaction.avatar} />
                        <AvatarFallback>{transaction.name[0]}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-2xl">
                        {transaction.icon}
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        {transaction.name}
                      </p>
                      <p className="text-xs text-slate-400/80">{transaction.date}</p>
                    </div>
                  </div>
                  <p 
                    className="text-base"
                    style={{ 
                      fontFamily: 'Inter, sans-serif', 
                      fontWeight: 700,
                      color: transaction.isPositive ? '#34d399' : '#f87171'
                    }}
                  >
                    {transaction.amount}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomNavigation currentScreen="dashboard" onNavigate={handleNavigate} cartItemCount={cartItemCount} />
    </div>
  );
}
