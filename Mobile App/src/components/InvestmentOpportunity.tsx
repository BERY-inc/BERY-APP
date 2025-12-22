import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, TrendingUp, Shield, Clock, DollarSign, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "./ui/badge";

interface OpportunityData {
  name: string;
  description: string;
  apy: number;
  minAmount: number;
  lockPeriod: string;
  riskLevel: string;
  icon: any;
  color: string;
  features: string[];
}

interface InvestmentOpportunityProps {
  opportunity: OpportunityData;
  onBack: () => void;
  onInvest: (amount: number) => void;
  walletBalance?: number;
}

export function InvestmentOpportunity({ opportunity, onBack, onInvest, walletBalance = 0 }: InvestmentOpportunityProps) {
  const [amount, setAmount] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const Icon = opportunity.icon;
  const estimatedReturn = amount ? (parseFloat(amount) * opportunity.apy / 100).toFixed(2) : "0.00";

  const handleInvest = () => {
    setError("");
    const investAmount = parseFloat(amount);
    
    if (!amount || isNaN(investAmount)) {
      setError("Please enter a valid amount");
      return;
    }
    
    if (investAmount < opportunity.minAmount) {
      setError(`Minimum investment is $${opportunity.minAmount.toLocaleString()}`);
      return;
    }
    
    if (investAmount > walletBalance) {
      setError(`Insufficient funds. Your balance is $${walletBalance.toLocaleString()}`);
      return;
    }
    
    if (!agreed) {
      setError("Please agree to the terms and conditions");
      return;
    }
    
    onInvest(investAmount);
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
            Investment Details
          </h1>
        </div>

        {/* Investment Header Card */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${opportunity.color} flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                {opportunity.name}
              </h2>
              <p className="text-xs text-blue-200/80">{opportunity.riskLevel}</p>
            </div>
            <Badge className="bg-green-500/20 text-green-300 border-0">
              {opportunity.apy}% APY
            </Badge>
          </div>
          <p className="text-sm text-blue-100/90">{opportunity.description}</p>
        </Card>
      </div>

      <div className="px-5 mt-6">
        {/* Key Information */}
        <h3 className="text-base text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          Key Information
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-slate-400">Min. Investment</p>
            </div>
            <p className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              ${opportunity.minAmount.toLocaleString()}
            </p>
          </Card>

          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-slate-400">Lock Period</p>
            </div>
            <p className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              {opportunity.lockPeriod}
            </p>
          </Card>

          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <p className="text-xs text-slate-400">Expected APY</p>
            </div>
            <p className="text-base text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              {opportunity.apy}%
            </p>
          </Card>

          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <p className="text-xs text-slate-400">Risk Level</p>
            </div>
            <p className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              {opportunity.riskLevel.split(" ")[0]}
            </p>
          </Card>
        </div>

        {/* Features */}
        <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40 mb-6">
          <h3 className="text-sm text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            Features & Benefits
          </h3>
          <div className="space-y-3">
            {opportunity.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-300">{feature}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Investment Calculator */}
        <Card className="p-5 bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-500/30 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Investment Calculator
            </h3>
            <div className="text-xs text-blue-300">
              Balance: <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>${walletBalance.toLocaleString()}</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs text-slate-400 mb-2 block">Investment Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
              <Input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                placeholder={opportunity.minAmount.toString()}
                className="pl-8 bg-[#0f1419] border-slate-600/40 text-white h-12 rounded-xl"
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Minimum investment: ${opportunity.minAmount.toLocaleString()}
            </p>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 mt-2"
              >
                {error}
              </motion.p>
            )}
          </div>

          {amount && parseFloat(amount) >= opportunity.minAmount && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-green-300">Estimated Annual Return</p>
                <p className="text-lg text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  ${estimatedReturn}
                </p>
              </div>
              <p className="text-xs text-green-300/70">
                After {opportunity.lockPeriod}, your total value: ${(parseFloat(amount) + parseFloat(estimatedReturn)).toLocaleString()}
              </p>
            </motion.div>
          )}
        </Card>

        {/* Terms Agreement */}
        <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40 mb-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
            />
            <div>
              <p className="text-sm text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                I understand the risks
              </p>
              <p className="text-xs text-slate-400">
                I acknowledge that investments carry risks and past performance doesn't guarantee future results. My funds will be locked for {opportunity.lockPeriod}.
              </p>
            </div>
          </label>
        </Card>

        {/* Invest Button */}
        <Button
          onClick={handleInvest}
          disabled={!agreed || !amount || parseFloat(amount) < opportunity.minAmount || (amount && parseFloat(amount) > walletBalance)}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-base"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
        >
          Invest ${amount || "0"}
        </Button>
      </div>
    </div>
  );
}
