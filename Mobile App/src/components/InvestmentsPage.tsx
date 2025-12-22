import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Wallet, PiggyBank, LineChart, Rocket, Building2 } from "lucide-react";
import { motion } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";
import { InvestmentManagement } from "./InvestmentManagement";
import { InvestmentOpportunity } from "./InvestmentOpportunity";

interface InvestmentData {
  name: string;
  icon: any;
  color: string;
  amount: number;
  apy: number;
  lockPeriod: string;
  riskLevel: string;
  estimatedReturn: number;
}

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
}

interface InvestmentsPageProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onInvestmentConfirm?: (investment: InvestmentData) => void;
  onWithdrawInvestment?: (investmentId: number) => void;
  activeInvestments?: ActiveInvestment[];
  cartItemCount?: number;
  walletBalance?: number;
}

export function InvestmentsPage({ onBack, onNavigate, onInvestmentConfirm, onWithdrawInvestment, activeInvestments = [], cartItemCount = 0, walletBalance = 0 }: InvestmentsPageProps) {
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "manage" | "opportunity">("list");

  const investments = activeInvestments;

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalEarnings = investments.reduce((sum, inv) => sum + inv.earnings, 0);
  const avgReturn = (totalEarnings / totalInvested * 100).toFixed(2);

  const opportunities = {
    fixedDeposit: {
      name: "Fixed Deposit",
      description: "Secure your funds with guaranteed returns. Low risk investment option perfect for conservative investors.",
      apy: 6,
      minAmount: 500,
      lockPeriod: "6 months",
      riskLevel: "Low Risk",
      icon: PiggyBank,
      color: "from-green-500 to-emerald-600",
      features: [
        "Guaranteed 6% APY returns",
        "FDIC insured up to $250,000",
        "Flexible withdrawal options",
        "Automatic renewal available",
        "No management fees"
      ]
    },
    lendingPool: {
      name: "Lending Pool",
      description: "Earn passive income by lending to verified borrowers. Moderate risk with steady returns.",
      apy: 10,
      minAmount: 1000,
      lockPeriod: "12 months",
      riskLevel: "Medium Risk",
      icon: DollarSign,
      color: "from-blue-500 to-indigo-600",
      features: [
        "10% average annual return",
        "Diversified across 50+ borrowers",
        "Risk assessment included",
        "Monthly interest payments",
        "Credit-backed securities"
      ]
    },
    equityPool: {
      name: "Equity Pool",
      description: "Access to high-performing blue-chip stocks and ETFs with professional portfolio management.",
      apy: 15,
      minAmount: 2000,
      lockPeriod: "9 months",
      riskLevel: "Medium Risk",
      icon: LineChart,
      color: "from-purple-500 to-violet-600",
      features: [
        "15% target annual return",
        "Curated portfolio of top stocks",
        "Professional fund managers",
        "Quarterly rebalancing",
        "Real-time performance tracking"
      ]
    }
  };

  if (viewMode === "manage" && selectedInvestment) {
    return (
      <InvestmentManagement
        investment={selectedInvestment}
        onBack={() => {
          setViewMode("list");
          setSelectedInvestment(null);
        }}
        onWithdraw={(investmentId) => {
          if (onWithdrawInvestment) {
            onWithdrawInvestment(investmentId);
          }
          setViewMode("list");
          setSelectedInvestment(null);
        }}
      />
    );
  }

  if (viewMode === "opportunity" && selectedOpportunity) {
    return (
      <InvestmentOpportunity
        opportunity={selectedOpportunity}
        walletBalance={walletBalance}
        onBack={() => {
          setViewMode("list");
          setSelectedOpportunity(null);
        }}
        onInvest={(amount) => {
          const estimatedReturn = (amount * selectedOpportunity.apy / 100);
          const investmentData: InvestmentData = {
            name: selectedOpportunity.name,
            icon: selectedOpportunity.icon,
            color: selectedOpportunity.color,
            amount: amount,
            apy: selectedOpportunity.apy,
            lockPeriod: selectedOpportunity.lockPeriod,
            riskLevel: selectedOpportunity.riskLevel,
            estimatedReturn: estimatedReturn,
          };
          
          if (onInvestmentConfirm) {
            onInvestmentConfirm(investmentData);
          } else {
            // Fallback if callback not provided
            alert(`Investment of $${amount} in ${selectedOpportunity.name} confirmed!`);
            setViewMode("list");
            setSelectedOpportunity(null);
          }
        }}
      />
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-slate-700/30"
          >
            <ArrowLeft className="w-5 h-5 text-slate-300" />
          </Button>
          <h1 className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            My Investments
          </h1>
        </div>

        {/* Investment Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div 
            className="relative rounded-3xl p-6 shadow-2xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
              boxShadow: '0 20px 60px rgba(30, 58, 138, 0.4)'
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-sm text-blue-200" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Portfolio Performance
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-blue-100/70 mb-1">Total Invested</p>
                <p className="text-2xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  ${totalInvested.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-blue-100/70 mb-1">Total Earnings</p>
                <p className="text-2xl text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  +${totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-100/70">Average Return</span>
                <span className="text-sm text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  +{avgReturn}%
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Investments */}
      <div className="px-5 mb-6">
        <h2 className="text-base text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          Active Investments
        </h2>
        {investments.length === 0 ? (
          <Card className="p-8 bg-[#1a1a2e] border border-slate-700/40 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-700/30 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-sm text-slate-300 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              No Active Investments
            </p>
            <p className="text-xs text-slate-400/80">
              Explore opportunities below to get started
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {investments.map((investment, index) => {
            const Icon = investment.icon;
            return (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40 shadow-lg shadow-slate-900/20">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${investment.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                          {investment.name}
                        </p>
                        <p className="text-xs text-slate-400/80">{investment.type}</p>
                      </div>
                    </div>
                    <div className="px-2 py-1 rounded-full bg-green-500/20">
                      <span className="text-xs text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        {investment.return}% APY
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <p className="text-xs text-slate-400/80 mb-1">Invested</p>
                      <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        ${investment.amount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400/80 mb-1">Earnings</p>
                      <p className="text-sm text-green-400" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        +${investment.earnings}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400/80 mb-1">Period</p>
                      <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        {investment.period}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-700/30">
                    <Button 
                      onClick={() => {
                        setSelectedInvestment(investment);
                        setViewMode("manage");
                      }}
                      className="w-full"
                      style={{ 
                        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                      }}
                    >
                      Manage Investment
                    </Button>
                  </div>
                </Card>
              </motion.div>
            );
          })}
          </div>
        )}
      </div>

      {/* Investment Opportunities */}
      <div className="px-5 mb-6">
        <h2 className="text-base text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          New Opportunities
        </h2>
        
        <div className="space-y-3">
          {/* Fixed Deposit */}
          {!investments.some(inv => inv.name === "Fixed Deposit") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-5 bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-500/30 shadow-lg shadow-green-900/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <PiggyBank className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Fixed Deposit
                  </p>
                  <p className="text-xs text-green-300/80">Low Risk • Guaranteed Returns</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/20">
                  <span className="text-sm text-green-300" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    6% APY
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300/80 mb-4">
                Secure your funds with guaranteed returns. FDIC insured. Minimum investment: $500
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-green-300/70 mb-1">Min. Amount</p>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    $500
                  </p>
                </div>
                <div>
                  <p className="text-xs text-green-300/70 mb-1">Lock Period</p>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    6 months
                  </p>
                </div>
                <div>
                  <p className="text-xs text-green-300/70 mb-1">Risk Level</p>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Low
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setSelectedOpportunity(opportunities.fixedDeposit);
                  setViewMode("opportunity");
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
              >
                Invest Now
              </Button>
            </Card>
          </motion.div>
          )}

          {/* Lending Pool */}
          {!investments.some(inv => inv.name === "Lending Pool") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-5 bg-gradient-to-br from-slate-800/50 to-blue-900/30 border border-blue-500/30 shadow-lg shadow-blue-900/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Lending Pool
                  </p>
                  <p className="text-xs text-blue-300/80">Medium Risk • Steady Returns</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-blue-500/20">
                  <span className="text-sm text-blue-300" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    10% APY
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300/80 mb-4">
                Earn passive income by lending to verified borrowers. Diversified portfolio.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-blue-300/70 mb-1">Min. Amount</p>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    $1,000
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-300/70 mb-1">Lock Period</p>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    12 months
                  </p>
                </div>
                <div>
                  <p className="text-xs text-blue-300/70 mb-1">Borrowers</p>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    50+
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setSelectedOpportunity(opportunities.lendingPool);
                  setViewMode("opportunity");
                }}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
              >
                Invest Now
              </Button>
            </Card>
          </motion.div>
          )}

          {/* Equity Pool */}
          {!investments.some(inv => inv.name === "Equity Pool") && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-5 bg-gradient-to-br from-slate-800/50 to-purple-900/30 border border-purple-500/30 shadow-lg shadow-purple-900/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                  <LineChart className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Equity Pool
                  </p>
                  <p className="text-xs text-purple-300/80">Medium Risk • Growth Focused</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-500/20">
                  <span className="text-sm text-purple-300" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                    15% APY
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-300/80 mb-4">
                Access to high-performing stocks with professional portfolio management.
              </p>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <p className="text-xs text-purple-300/70 mb-1">Min. Amount</p>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    $2,000
                  </p>
                </div>
                <div>
                  <p className="text-xs text-purple-300/70 mb-1">Lock Period</p>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    9 months
                  </p>
                </div>
                <div>
                  <p className="text-xs text-purple-300/70 mb-1">Managed</p>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    Yes
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => {
                  setSelectedOpportunity(opportunities.equityPool);
                  setViewMode("opportunity");
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500"
              >
                Invest Now
              </Button>
            </Card>
          </motion.div>
          )}

          {/* Empty state when all opportunities are invested */}
          {investments.some(inv => inv.name === "Fixed Deposit") && 
           investments.some(inv => inv.name === "Lending Pool") && 
           investments.some(inv => inv.name === "Equity Pool") && (
            <Card className="p-8 bg-[#1a1a2e] border border-slate-700/40 text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <p className="text-sm text-slate-300 mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                All Opportunities Invested
              </p>
              <p className="text-xs text-slate-400/80">
                You're currently invested in all available opportunities
              </p>
            </Card>
          )}
        </div>
      </div>

      <BottomNavigation currentScreen="investments" onNavigate={onNavigate} cartItemCount={cartItemCount} />
    </div>
  );
}
