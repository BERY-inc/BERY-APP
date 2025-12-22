import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { ArrowLeft, Lock, Shield, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { Haptics, NotificationType } from "@capacitor/haptics";

interface InvestmentConfirmationProps {
  investment: {
    name: string;
    icon: any;
    color: string;
    amount: number;
    apy: number;
    lockPeriod: string;
    riskLevel: string;
    estimatedReturn: number;
  };
  onBack: () => void;
  onConfirm: () => void;
}

export function InvestmentConfirmation({ investment, onBack, onConfirm }: InvestmentConfirmationProps) {
  const [processing, setProcessing] = useState(false);
  const Icon = investment.icon;

  const handleConfirm = () => {
    try { Haptics.notification({ type: NotificationType.Success }); } catch {}
    setProcessing(true);
    // Simulate processing
    setTimeout(() => {
      onConfirm();
    }, 1500);
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
            disabled={processing}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Confirm Investment
          </h1>
        </div>
      </div>

      <div className="px-5 -mt-4">
        {/* Investment Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 bg-[#1a1a2e] border border-slate-700/40 shadow-2xl mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${investment.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {investment.name}
                </h2>
                <Badge className="bg-green-500/20 text-green-300 border-0">
                  {investment.apy}% APY
                </Badge>
              </div>
            </div>

            <div className="space-y-3 py-4 border-y border-slate-700/30">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Investment Amount</span>
                <span className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  ${investment.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Lock Period</span>
                <span className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {investment.lockPeriod}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Expected Return (Annual)</span>
                <span className="text-base text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  +${investment.estimatedReturn.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Risk Level</span>
                <span className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {investment.riskLevel}
                </span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-300 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Total Value After {investment.lockPeriod}
                  </p>
                  <p className="text-2xl text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    ${(investment.amount + investment.estimatedReturn).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-5 bg-blue-500/10 border border-blue-500/30 mb-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-300 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Your Investment is Protected
                </p>
                <p className="text-xs text-blue-200/70">
                  This investment is secured with bank-level encryption and regulatory compliance.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <Lock className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Lock Period Notice
                </p>
                <p className="text-xs text-slate-400">
                  Your funds will be locked for {investment.lockPeriod}. Early withdrawal may incur penalties.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  Investment Risk
                </p>
                <p className="text-xs text-slate-400">
                  All investments carry risk. Past performance does not guarantee future results.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={processing}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 text-base rounded-xl"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            <>Confirm & Invest ${investment.amount.toLocaleString()}</>
          )}
        </Button>

        <p className="text-xs text-center text-slate-500 mt-4">
          By confirming, you agree to the{" "}
          <span className="text-blue-400">Investment Terms</span>
        </p>
      </div>
    </div>
  );
}
