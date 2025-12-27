import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ArrowLeft, Search, ArrowUpRight, ArrowDownLeft, RefreshCw, Filter, TrendingUp, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BottomNavigation } from "./BottomNavigation";

interface TransactionHistoryProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  cartItemCount?: number;
  transactions?: any[];
  counterpartyInfo?: Record<string, { name: string; image?: string; phone?: string }>;
}

export function TransactionHistory({ onBack, onNavigate, cartItemCount = 0, transactions = [], counterpartyInfo }: TransactionHistoryProps) {
  const [filterType, setFilterType] = useState("all");

  // Map API transactions to UI format
  const mappedTransactions = transactions.map(t => ({
    id: t.transaction_id,
    type: t.transaction_type === 'fund_transfer_received' ? 'receive'
      : t.transaction_type === 'fund_transfer' ? 'send'
        : t.transaction_type === 'add_fund' ? 'receive'
          : 'convert', // Default/Fallback
    amount: t.credit > 0 ? t.credit : -t.debit,
    currency: "USD", // Assuming USD for now
    recipient: t.transaction_type === 'fund_transfer' ? (
      (t.reference && counterpartyInfo?.[t.reference]?.name) || t.reference
    ) : null,
    sender: t.transaction_type === 'fund_transfer_received' ? (
      (t.reference && counterpartyInfo?.[t.reference]?.name) || t.reference
    ) : null,
    date: new Date(t.created_at).toLocaleDateString(),
    time: new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: "completed",
    country: "🌐", // Generic icon
    category: t.transaction_type.replace(/_/g, ' '),
    originalType: t.transaction_type
  }));

  const displayTransactions = mappedTransactions.length > 0 ? mappedTransactions : [
    // Keep one dummy item for empty state preview if needed, or just empty
  ];

  const spendingData = [
    { month: "Jun", amount: 2400 },
    { month: "Jul", amount: 1800 },
    { month: "Aug", amount: 3200 },
    { month: "Sep", amount: 2800 },
    { month: "Oct", amount: 3500 },
  ];

  const filteredTransactions = displayTransactions.filter(t => {
    if (filterType === "all") return true;
    return t.type === filterType;
  });

  return (
    <div className="h-screen overflow-y-auto pb-32 bg-[#0a0a1a]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-5 pt-14 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Transaction History</h1>
        </div>
        <p className="text-blue-200/80 text-sm">View all your transactions</p>
      </div>

      {/* Content */}
      <div className="px-5 -mt-6 py-6">
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-5">
            <TabsTrigger value="transactions" className="text-sm">Transactions</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions">
            {/* Search and Filter */}
            <Card className="p-4 mb-4 bg-[#1a1a2e] border-purple-500/20">
              <div className="flex flex-col gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/60" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-10 h-11 bg-[#0a0a1a] border-purple-500/20 text-white placeholder:text-purple-300/40"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full h-11 bg-[#0a0a1a] border-purple-500/20 text-white">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-purple-500/20">
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="send">Sent</SelectItem>
                    <SelectItem value="receive">Received</SelectItem>
                    <SelectItem value="convert">Conversions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>

            {/* Transactions List */}
            <div className="space-y-3">
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <Card className="p-4 hover:shadow-md hover:shadow-purple-500/20 transition-all active:scale-98 bg-[#1a1a2e] border-purple-500/20">
                    <div className="flex items-center gap-3">
                      {/* Icon */}
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${transaction.type === 'send' ? 'bg-red-500/20' :
                        transaction.type === 'receive' ? 'bg-emerald-500/20' : 'bg-purple-500/20'
                        }`}>
                        {transaction.type === 'send' && <ArrowUpRight className="w-5 h-5 text-red-400" />}
                        {transaction.type === 'receive' && <ArrowDownLeft className="w-5 h-5 text-emerald-400" />}
                        {transaction.type === 'convert' && <RefreshCw className="w-5 h-5 text-purple-400" />}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm truncate text-white">
                            {transaction.type === 'send' && `${transaction.recipient || 'Unknown Recipient'}`}
                            {transaction.type === 'receive' && `${transaction.sender || 'Unknown Sender'}`}
                            {transaction.type === 'convert' && `Conversion`}
                          </p>
                          <span className="text-xs">{transaction.country}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-purple-300/60">
                          <span>{transaction.date}</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm ${transaction.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                          {transaction.amount > 0 ? '+' : ''}
                          {transaction.type === 'convert' ? transaction.amount.toFixed(0) : transaction.amount.toFixed(0)}
                        </p>
                        <p className="text-xs text-purple-300/60">
                          {transaction.currency}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-5">
              <Button variant="outline" className="h-11">Load More</Button>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-3 mb-5">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <ArrowDownLeft className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Total Received</p>
                    <p className="text-xl">₿ 3,700.00</p>
                  </div>
                  <p className="text-xs text-green-600">+12%</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-red-50 to-rose-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Total Sent</p>
                    <p className="text-xl">₿ 285.49</p>
                  </div>
                  <p className="text-xs text-red-600">-5%</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Conversions</p>
                    <p className="text-xl">₿ 500.00</p>
                  </div>
                  <p className="text-xs text-blue-600">1 conv.</p>
                </div>
              </Card>
            </div>

            {/* Spending Chart */}
            <Card className="p-5 mb-5">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-10 h-10 rounded-full bg-[#2563eb]/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-[#2563eb]" />
                </div>
                <div>
                  <h3 className="text-base">Spending Pattern</h3>
                  <p className="text-xs text-muted-foreground">Last 5 months</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={spendingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    style={{ fontSize: '11px' }}
                  />
                  <YAxis
                    stroke="#6b7280"
                    style={{ fontSize: '11px' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: '#2563eb', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Category Breakdown */}
            <Card className="p-5">
              <h3 className="mb-4 text-base">Top Categories</h3>
              <div className="space-y-4">
                {[
                  { name: "Business", amount: 2500, percentage: 60, color: "bg-[#2563eb]" },
                  { name: "Salary", amount: 1200, percentage: 30, color: "bg-[#14b8a6]" },
                  { name: "Shopping", amount: 90, percentage: 7, color: "bg-[#7c3aed]" },
                  { name: "Personal", amount: 196, percentage: 3, color: "bg-[#d4af37]" },
                ].map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between text-xs mb-2">
                      <span>{category.name}</span>
                      <span>${category.amount.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full transition-all`}
                        style={{ width: `${category.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation currentScreen="history" onNavigate={onNavigate} cartItemCount={cartItemCount} />
    </div>
  );
}
