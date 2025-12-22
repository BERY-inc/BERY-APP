import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, TrendingUp, Plus, Minus, ArrowDownToLine, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "./ui/badge";

interface Investment {
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
}

interface InvestmentManagementProps {
  investment: Investment;
  onBack: () => void;
  onWithdraw?: (investmentId: number) => void;
}

export function InvestmentManagement({ investment, onBack, onWithdraw }: InvestmentManagementProps) {
  const [selectedAction, setSelectedAction] = useState<"add" | "reduce" | "withdraw" | null>(null);
  const [amount, setAmount] = useState("");

  const Icon = investment.icon;

  const handleAction = () => {
    if (selectedAction === "withdraw") {
      // Full withdrawal - remove from active investments
      const withdrawAmount = parseFloat(amount);
      const maxWithdraw = investment.amount + investment.earnings;
      
      if (withdrawAmount >= maxWithdraw) {
        // Full withdrawal
        if (onWithdraw) {
          onWithdraw(investment.id);
        }
      } else {
        // Partial withdrawal
        alert(`Partial withdrawal of $${amount} from ${investment.name}`);
        setSelectedAction(null);
        setAmount("");
      }
    } else {
      // Here you would handle the actual transaction for add/reduce
      alert(`${selectedAction} $${amount} ${selectedAction === "add" ? "to" : "from"} ${investment.name}`);
      setSelectedAction(null);
      setAmount("");
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] px-5 pt-14 pb-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Manage Investment
          </h1>
        </div>

        {/* Investment Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${investment.color} flex items-center justify-center`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-base text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {investment.name}
                </p>
                <p className="text-xs text-blue-200/80">{investment.type}</p>
              </div>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-0">
              {investment.return}% APY
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-xs text-blue-200/70 mb-1">Invested</p>
              <p className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                ${investment.amount.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-200/70 mb-1">Earnings</p>
              <p className="text-base text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                +${investment.earnings}
              </p>
            </div>
            <div>
              <p className="text-xs text-blue-200/70 mb-1">Period</p>
              <p className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                {investment.period}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions */}
      <div className="px-5 mt-6">
        <h2 className="text-base text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          Actions
        </h2>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setSelectedAction("add")}
            className={`p-4 rounded-2xl transition-all ${
              selectedAction === "add"
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-400'
                : 'bg-[#1a1a2e] border border-slate-700/40 hover:border-blue-600/40'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-2">
              <Plus className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-xs text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Add More
            </p>
          </button>

          <button
            onClick={() => setSelectedAction("reduce")}
            className={`p-4 rounded-2xl transition-all ${
              selectedAction === "reduce"
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-400'
                : 'bg-[#1a1a2e] border border-slate-700/40 hover:border-blue-600/40'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center mx-auto mb-2">
              <Minus className="w-6 h-6 text-orange-400" />
            </div>
            <p className="text-xs text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Reduce
            </p>
          </button>

          <button
            onClick={() => setSelectedAction("withdraw")}
            className={`p-4 rounded-2xl transition-all ${
              selectedAction === "withdraw"
                ? 'bg-gradient-to-br from-blue-600 to-blue-700 border-2 border-blue-400'
                : 'bg-[#1a1a2e] border border-slate-700/40 hover:border-blue-600/40'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mx-auto mb-2">
              <ArrowDownToLine className="w-6 h-6 text-red-400" />
            </div>
            <p className="text-xs text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Withdraw
            </p>
          </button>
        </div>

        {/* Action Form */}
        {selectedAction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40 mb-6">
              <h3 className="text-sm text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                {selectedAction === "add" && "Add More Funds"}
                {selectedAction === "reduce" && "Reduce Investment"}
                {selectedAction === "withdraw" && "Withdraw Funds"}
              </h3>

              <div className="mb-4">
                <label className="text-xs text-slate-400 mb-2 block">Amount (USD)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 bg-[#0f1419] border-slate-600/40 text-white h-12 rounded-xl"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {selectedAction === "add" && "Minimum: $100"}
                  {selectedAction === "reduce" && `Maximum: $${investment.amount.toLocaleString()}`}
                  {selectedAction === "withdraw" && `Available: $${(investment.amount + investment.earnings).toLocaleString()}`}
                </p>
              </div>

              {selectedAction === "withdraw" && (
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl mb-4">
                  <AlertCircle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-yellow-300 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Early Withdrawal Fee
                    </p>
                    <p className="text-xs text-yellow-300/70">
                      Withdrawing before {investment.period} will incur a 2% penalty
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedAction(null);
                    setAmount("");
                  }}
                  className="flex-1 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAction}
                  disabled={!amount || parseFloat(amount) <= 0}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
                >
                  Confirm
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Performance Chart Placeholder */}
        <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Performance
            </h3>
            <Badge className="bg-green-500/20 text-green-400 border-0">
              <TrendingUp className="w-3 h-3 mr-1" />
              +{((investment.earnings / investment.amount) * 100).toFixed(2)}%
            </Badge>
          </div>
          
          <div className="h-40 bg-gradient-to-t from-blue-600/10 to-transparent rounded-xl flex items-end justify-center">
            <p className="text-xs text-slate-500 mb-4">Performance chart</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-700/30">
            <div>
              <p className="text-xs text-slate-400/80 mb-1">Current Value</p>
              <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                ${(investment.amount + investment.earnings).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400/80 mb-1">Total Return</p>
              <p className="text-sm text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                +{((investment.earnings / investment.amount) * 100).toFixed(2)}%
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
