import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  CheckCircle2,
  Download,
  Home,
  Package,
  Share2,
  MessageCircle,
} from "lucide-react";
import { Haptics, NotificationType } from "@capacitor/haptics";
import { Share } from "@capacitor/share";
import { Clipboard } from "@capacitor/clipboard";

interface PurchaseSuccessProps {
  transactionId: string;
  totalAmount: string;
  itemCount: number;
  onDone: () => void;
  onViewOrders: () => void;
}

export function PurchaseSuccess({
  transactionId,
  totalAmount,
  itemCount,
  onDone,
  onViewOrders,
}: PurchaseSuccessProps) {
  try { Haptics.notification({ type: NotificationType.Success }); } catch {}

  const handleShare = async () => {
    try {
      await Share.share({
        title: "Purchase Confirmed",
        text: `Items: ${itemCount}\nTotal: ${totalAmount}\nTransaction ID: ${transactionId}`,
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] flex items-center justify-center p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-8 text-center"
        >
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/50">
            <CheckCircle2 className="w-14 h-14 text-white" />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1
              className="text-2xl text-white mb-2"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
            >
              Purchase Successful!
            </h1>
            <p className="text-sm text-blue-200">
              Your order has been confirmed
            </p>
          </motion.div>
        </motion.div>

        {/* Transaction Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="p-6 bg-[#1a1a2e] border border-slate-700/40 mb-6">
            <div className="space-y-4">
              {/* Transaction ID */}
              <div className="pb-4 border-b border-slate-700/40">
                <p className="text-xs text-slate-400 mb-1">Transaction ID</p>
                <div className="flex items-center justify-between">
                  <p
                    className="text-sm text-white"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                  >
                    {transactionId}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 h-auto p-1"
                      onClick={handleShare}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-400 hover:text-blue-300 h-auto px-2"
                      onClick={handleCopyTx}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div className="pb-4 border-b border-slate-700/40">
                <p className="text-xs text-slate-400 mb-1">Total Amount</p>
                <p
                  className="text-xl text-white"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
                >
                  {totalAmount}
                </p>
              </div>

              {/* Items */}
              <div className="pb-4 border-b border-slate-700/40">
                <p className="text-xs text-slate-400 mb-1">Items Purchased</p>
                <p
                  className="text-sm text-white"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-slate-400 mb-2">Status</p>
                <Badge className="bg-green-500/20 text-green-300 border-0">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Confirmed
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-6"
        >
          <Card className="p-5 bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-3">
              <Package className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p
                  className="text-sm text-white mb-1"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                >
                  What's Next?
                </p>
                <p className="text-xs text-blue-200 leading-relaxed">
                  We've sent order confirmation to your email. Track your orders
                  in the Profile section.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="space-y-3"
        >
          <Button
            onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch {}; onViewOrders(); }}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
          >
            <Package className="w-5 h-5 mr-2" />
            View My Orders
          </Button>
          <Button
            onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch {}; onDone(); }}
            variant="outline"
            className="w-full h-12 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
            onClick={handleShare}
          >
            <Share2 className="w-5 h-5 mr-2" />
            Share
          </Button>
        </motion.div>

        {/* Support */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <button className="flex items-center gap-2 mx-auto text-xs text-blue-400 hover:text-blue-300">
            <MessageCircle className="w-4 h-4" />
            Need help? Contact Support
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
