import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { QrCode, ArrowUpRight, ArrowDownLeft, RefreshCw } from "lucide-react";
import QRCode from "react-qr-code";
import { motion } from "motion/react";

interface QRPaymentProps {
  onBack: () => void;
  userName: string;
  userImage?: string;
  walletBalance: number;
  transactions?: any[];
  counterpartyInfo?: Record<string, { name: string; image?: string; phone?: string }>;
}

export function QRPayment({ 
  onBack, 
  userName = "Guest", 
  userImage,
  walletBalance = 0,
  transactions = [],
  counterpartyInfo
}: QRPaymentProps) {
  // Map API transactions to UI format
  const mappedTransactions = transactions.map(t => {
    let name = t.transaction_type.replace(/_/g, ' ');
    if (t.transaction_type === 'fund_transfer' || t.transaction_type === 'fund_transfer_received') {
      const ref = t.reference;
      name = ref && counterpartyInfo?.[ref]?.name ? counterpartyInfo[ref].name : (ref || name);
    }

    const type = t.transaction_type === 'fund_transfer' ? 'send'
      : t.transaction_type === 'fund_transfer_received' ? 'receive'
        : t.transaction_type === 'add_fund' ? 'credit' : 'other';

    return {
      id: t.transaction_id,
      name: name,
      date: new Date(t.created_at).toLocaleDateString(),
      amount: (t.credit > 0 ? '+' : '-') + '₿' + (t.credit > 0 ? t.credit : t.debit).toFixed(2),
      isPositive: t.credit > 0,
      avatar: (t.reference && counterpartyInfo?.[t.reference]?.image) || null,
      icon: type === 'send' ? <ArrowUpRight className="w-5 h-5 text-red-400" />
        : type === 'receive' ? <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
          : <RefreshCw className="w-5 h-5 text-blue-400" />,
      original: t,
      type
    };
  });

  // Get recent QR transactions (limit to 5)
  const qrTransactions = mappedTransactions.slice(0, 5);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-5 pt-14 pb-6">
        <div className="flex items-center justify-center mb-4">
          <h1 className="text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>QR Payment</h1>
        </div>
        <p className="text-blue-200/80 text-sm text-center">Scan to pay or show your QR code</p>
      </div>

      {/* QR Code Section - Full Screen */}
      <div className="px-5 py-6">
        <Card className="p-6 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] border-blue-500/20 mb-6">
          <div className="flex flex-col items-center">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="w-12 h-12 border-2 border-blue-600/30">
                <AvatarImage src={userImage} />
                <AvatarFallback>{userName.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white text-sm">Your QR Code</p>
                <p className="text-blue-200/80 text-xs">{userName}</p>
              </div>
            </div>

            {/* QR Code - Large and Centered */}
            <div className="p-4 bg-white rounded-2xl mb-6">
              <QRCode
                value={JSON.stringify({
                  type: 'payment',
                  name: userName,
                  wallet: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e', // Mock wallet
                  app: 'BeryMarket'
                })}
                size={200}
                level="H"
                viewBox={`0 0 256 256`}
                style={{ borderRadius: "8px" }}
              />
            </div>

            {/* Wallet Balance */}
            <div className="text-center mb-4">
              <p className="text-blue-200/80 text-xs mb-1">Available Balance</p>
              <p className="text-white text-2xl font-bold">₿ {walletBalance.toLocaleString()}</p>
            </div>

            {/* Instruction */}
            <p className="text-blue-200/80 text-center text-sm">
              Show this QR code to receive payments or scan other QR codes to send money
            </p>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button 
            onClick={onBack}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-900/20"
          >
            Back to Home
          </Button>
        </div>

        {/* Recent QR Transactions */}
        <div className="mb-4">
          <h2 className="text-white text-lg mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            Recent Transactions
          </h2>
          
          {qrTransactions.length > 0 ? (
            <div className="space-y-3">
              {qrTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
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
                          <div className="w-12 h-12 rounded-full bg-[#0f172a] border border-slate-700/50 flex items-center justify-center">
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
          ) : (
            <Card className="p-8 bg-[#1a1a2e] border border-slate-700/40 text-center">
              <p className="text-slate-400">No transactions yet</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
