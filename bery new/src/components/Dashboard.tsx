import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowUpRight, ArrowDownLeft, RefreshCw, TrendingUp, Globe2 } from "lucide-react";
import { motion } from "motion/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

interface DashboardProps {
  onSendMoney: () => void;
  onReceiveMoney: () => void;
  onConvert: () => void;
  onViewHistory: () => void;
}

export function Dashboard({ onSendMoney, onReceiveMoney, onConvert, onViewHistory }: DashboardProps) {
  const recentTransactions = [
    { id: 1, type: "send", amount: -150.00, currency: "USD", recipient: "Sarah Johnson", date: "Oct 25" },
    { id: 2, type: "receive", amount: 2500.00, currency: "INR", sender: "Raj Patel", date: "Oct 24" },
    { id: 3, type: "convert", amount: 500.00, from: "USD", to: "GBP", date: "Oct 23" },
    { id: 4, type: "send", amount: -89.99, currency: "EUR", recipient: "Emma Wilson", date: "Oct 22" },
  ];

  const currencies = [
    { code: "USD", amount: "12,458.50", change: "+2.5%" },
    { code: "EUR", amount: "8,342.20", change: "+1.2%" },
    { code: "GBP", amount: "5,234.10", change: "-0.8%" },
  ];

  return (
    <div className="h-screen overflow-y-auto pb-20 bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white px-5 pt-12 pb-24 rounded-b-[2rem]">
        <div className="mb-6">
          <p className="text-white/80 text-sm mb-1">Welcome back</p>
          <h1 className="text-2xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>Alex Chen</h1>
        </div>

        {/* Main Balance Card - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-md border-white/20 text-white p-4">
            <p className="text-white/80 text-xs mb-2">Wallet</p>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <p className="text-white/70 text-xs mb-1">Bery</p>
                <p className="text-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>₿ 2,450</p>
              </div>
              <div>
                <p className="text-white/70 text-xs mb-1">USD</p>
                <p className="text-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>$12,458</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={onSendMoney}
                className="bg-white text-[#2563eb] hover:bg-white/90 h-10 flex-col gap-1 px-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                <span className="text-xs">Send</span>
              </Button>
              <Button
                onClick={onReceiveMoney}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-10 flex-col gap-1 px-2"
                variant="outline"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span className="text-xs">Receive</span>
              </Button>
              <Button
                onClick={onConvert}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 h-10 flex-col gap-1 px-2"
                variant="outline"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="text-xs">Convert</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-10">

        {/* Recent Activity */}
        <Card className="p-5 mb-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base">Recent Activity</h3>
            <Button variant="ghost" size="sm" onClick={onViewHistory} className="text-xs h-8">
              View All
            </Button>
          </div>

          <div className="space-y-3">
            {recentTransactions.slice(0, 3).map((transaction) => (
              <div key={transaction.id} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  transaction.type === 'send' ? 'bg-red-100' :
                  transaction.type === 'receive' ? 'bg-green-100' : 'bg-blue-100'
                }`}>
                  {transaction.type === 'send' && <ArrowUpRight className="w-4 h-4 text-red-600" />}
                  {transaction.type === 'receive' && <ArrowDownLeft className="w-4 h-4 text-green-600" />}
                  {transaction.type === 'convert' && <RefreshCw className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    {transaction.type === 'send' && `${transaction.recipient}`}
                    {transaction.type === 'receive' && `${transaction.sender}`}
                    {transaction.type === 'convert' && `${transaction.from} → ${transaction.to}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{transaction.date}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm ${transaction.amount > 0 ? 'text-green-600' : 'text-foreground'}`}>
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.type === 'convert' ? transaction.amount.toFixed(0) : transaction.amount.toFixed(0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.currency || transaction.to}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Global Stats */}
        <Card className="p-5 mb-5 bg-gradient-to-br from-[#f0f9ff] to-[#faf5ff]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
              <Globe2 className="w-5 h-5 text-[#2563eb]" />
            </div>
            <h3 className="text-base">Your Global Reach</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl text-[#2563eb]">24</p>
              <p className="text-xs text-muted-foreground">Countries</p>
            </div>
            <div>
              <p className="text-2xl text-[#14b8a6]">8</p>
              <p className="text-xs text-muted-foreground">Currencies</p>
            </div>
            <div>
              <p className="text-2xl text-[#7c3aed]">156</p>
              <p className="text-xs text-muted-foreground">Transactions</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}