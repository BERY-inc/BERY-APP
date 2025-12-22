import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { motion } from "motion/react";
import { CheckCircle2, Download, Share2, TrendingUp, Calendar, Copy } from "lucide-react";
import { Haptics, NotificationType } from "@capacitor/haptics";
import { Share } from "@capacitor/share";
import { Clipboard } from "@capacitor/clipboard";

interface InvestmentSuccessProps {
  investment: {
    name: string;
    icon: any;
    color: string;
    amount: number;
    apy: number;
    lockPeriod: string;
    estimatedReturn: number;
  };
  transactionId: string;
  onDone: () => void;
  onViewInvestments: () => void;
}

export function InvestmentSuccess({ investment, transactionId, onDone, onViewInvestments }: InvestmentSuccessProps) {
  const Icon = investment.icon;
  const maturityDate = new Date();
  const months = parseInt(investment.lockPeriod.match(/\d+/)?.[0] || "12");
  maturityDate.setMonth(maturityDate.getMonth() + months);

  // Haptic success when screen mounts
  try { Haptics.notification({ type: NotificationType.Success }); } catch {}

  const handleShare = async () => {
    try {
      await Share.share({
        title: "Investment Confirmed",
        text: `Investment: ${investment.name}\nAmount: $${investment.amount.toLocaleString()}\nAPY: ${investment.apy}%\nTransaction ID: ${transactionId}`,
      });
    } catch {}
  };

  const handleCopyTx = async () => {
    try {
      await Clipboard.write({ string: transactionId });
      Haptics.notification({ type: NotificationType.Success });
    } catch {}
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
      {/* Success Animation */}
      <div className="flex flex-col items-center justify-center px-5 pt-20 pb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
          className="mb-6"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-600/40">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl text-white mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Investment Successful!
          </h1>
          <p className="text-base text-slate-400">
            Your investment has been confirmed
          </p>
        </motion.div>

        {/* Investment Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-6 bg-[#1a1a2e] border border-slate-700/40 shadow-2xl mb-6">
            {/* Investment Header */}
            <div className="flex items-center gap-4 pb-5 mb-5 border-b border-slate-700/30">
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${investment.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-base text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {investment.name}
                </h2>
                <p className="text-xs text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {investment.apy}% APY
                </p>
              </div>
            </div>

            {/* Investment Summary */}
            <div className="space-y-4 mb-5">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Amount Invested</span>
                <span className="text-lg text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  ${investment.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-400">Expected Annual Return</span>
                <span className="text-lg text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  +${investment.estimatedReturn.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Maturity Info */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-5">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-blue-300 mb-1">Maturity Date</p>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    {maturityDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-blue-200/70 mt-1">
                    Locked for {investment.lockPeriod}
                  </p>
                </div>
              </div>
            </div>

            {/* Transaction ID */}
            <div className="p-4 bg-slate-800/30 rounded-xl">
              <p className="text-xs text-slate-400 mb-1">Transaction ID</p>
              <div className="flex items-center justify-between gap-2">
                <p 
                  className="text-sm text-white font-mono truncate"
                  style={{ fontFamily: 'monospace' }}
                >
                  {transactionId}
                </p>
                <Button 
                  variant="outline"
                  onClick={handleCopyTx}
                  className="h-8 px-2 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50 rounded"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <Button
              variant="outline"
              className="h-12 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              variant="outline"
              className="h-12 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
            >
              <Download className="w-4 h-4 mr-2" />
              Receipt
            </Button>
          </div>

          {/* Next Steps */}
          <Card className="p-5 bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 mb-6">
            <div className="flex items-start gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-300 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  What's Next?
                </p>
                <ul className="space-y-2 text-xs text-green-200/80">
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Track your investment performance in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Receive monthly performance reports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-400 mt-0.5">•</span>
                    <span>Withdraw funds after maturity period</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Button
              onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch {}; onViewInvestments(); }}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-base rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              View My Investments
            </Button>
            <Button
              onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch {}; onDone(); }}
              variant="outline"
              className="w-full h-12 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50 rounded-xl"
            >
              Back to Home
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
