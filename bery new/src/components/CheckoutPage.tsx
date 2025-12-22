import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, ShoppingCart, Wallet, Shield, X } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Haptics, NotificationType } from "@capacitor/haptics";

// Modal component for confirmation
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  cartItems, 
  totalBery, 
  totalUSD,
  isProcessing
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cartItems: any[];
  totalBery: number;
  totalUSD: number;
  isProcessing: boolean;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-[#1a1a2e] rounded-2xl border border-slate-700/40 w-full max-w-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700/40">
          <h3 className="text-lg text-white font-semibold">Confirm Purchase</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Items Summary */}
          <div className="mb-4">
            <h4 className="text-sm text-slate-300 mb-2">Items:</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    {item.name} <span className="text-slate-500">(x{item.quantity})</span>
                  </span>
                  <span className="text-white">
                    ₿{(parseFloat(item.price.replace("₿", "").replace("From", "").trim()) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="py-3 border-t border-b border-slate-700/40">
            <div className="flex items-center justify-between">
              <span className="text-base text-white font-semibold">Total Amount</span>
              <div className="text-right">
                <p className="text-base text-white font-bold">₿{totalBery.toFixed(2)}</p>
                <p className="text-xs text-slate-400">${totalUSD.toFixed(2)} USD</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <p className="text-sm text-slate-400 mt-3 mb-5">
            Are you sure you want to proceed with this purchase?
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : "Proceed"}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface CartItem {
  id: number;
  name: string;
  price: string;
  usdPrice: string;
  image?: string;
  quantity: number;
  category: string;
}

interface CheckoutPageProps {
  cartItems: CartItem[];
  totalBery: number;
  totalUSD: number;
  walletBalance: number;
  onBack: () => void;
  onConfirmPurchase: (paymentMethod: "bery", amount: number) => void;
}

export function CheckoutPage({ 
  cartItems, 
  totalBery, 
  totalUSD, 
  walletBalance,
  onBack, 
  onConfirmPurchase 
}: CheckoutPageProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate tax (10%)
  const subtotalUSD = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("₿", "").replace("From", "").trim());
    return sum + (price * item.quantity * 8.9);
  }, 0);
  
  const taxUSD = subtotalUSD * 0.1;
  const shippingUSD = 0; // Free shipping
  const finalTotalUSD = subtotalUSD + taxUSD + shippingUSD;
  const finalTotalBery = finalTotalUSD / 8.9;

  const handleConfirmPurchase = async () => {
    // Close the modal first
    setIsModalOpen(false);
    
    // Check if wallet has sufficient balance
    if (walletBalance < finalTotalBery) {
      toast.error("Insufficient Funds", {
        description: `You need ₿${finalTotalBery.toFixed(2)} but only have ₿${walletBalance.toFixed(2)} in your wallet.`,
      });
      setIsProcessing(false);
      return;
    }
    
    try {
      Haptics.notification({ type: NotificationType.Success });
    } catch {}
    
    setIsProcessing(true);
    
    // Simulate processing delay
    setTimeout(() => {
      const amount = finalTotalBery;
      onConfirmPurchase("bery", amount);
      setIsProcessing(false);
    }, 1500);
  };
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
      {/* Header */}
      <div className="bg-[#0a0a1a] px-5 pt-14 pb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-slate-800/50 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          Checkout
        </h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      <div className="px-5 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Order Summary */}
          <Card className="p-5 bg-[#0a0a1a] border border-slate-700/40 mb-6">
            <h2 className="text-lg text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Order Summary
            </h2>
            
            {/* Items List */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 flex items-center justify-center">
                    <span className="text-2xl">{item.image}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm text-white font-medium truncate">{item.name}</h3>
                    <p className="text-xs text-slate-400 mb-1">{item.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-300">Qty: {item.quantity}</span>
                      <span className="text-sm text-white font-medium">
                        ₿{(parseFloat(item.price.replace("₿", "").replace("From", "").trim()) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cost Breakdown */}
            <div className="space-y-2 pt-4 border-t border-slate-700/40">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Subtotal</span>
                <span className="text-sm text-white">${subtotalUSD.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Tax (10%)</span>
                <span className="text-sm text-white">${taxUSD.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Shipping</span>
                <span className="text-sm text-green-400">Free</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
                <span className="text-base text-white font-bold">Total</span>
                <div className="text-right">
                  <p className="text-base text-white font-bold">₿{finalTotalBery.toFixed(2)}</p>
                  <p className="text-xs text-slate-400">${finalTotalUSD.toFixed(2)} USD</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Payment Method */}
          <Card className="p-5 bg-[#0a0a1a] border border-slate-700/40 mb-6">
            <h2 className="text-lg text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Wallet Balance
            </h2>
            
            <div className="flex items-center gap-3 p-4 rounded-xl border border-slate-700/40 bg-[#0a0a1a]">
              <Wallet className="w-5 h-5 text-blue-400" />
              <div className="text-left">
                <p className="text-sm text-white font-medium">Bery Wallet</p>
                <p className="text-xs text-slate-400">₿{walletBalance.toFixed(2)} available</p>
              </div>
            </div>
          </Card>
          {/* Security Assurance */}
          <Card className="p-5 bg-[#0a0a1a] border border-slate-700/40 mb-6">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-400" />
              <p className="text-sm text-slate-300">
                Your payment is secured with bank-level encryption
              </p>
            </div>
          </Card>

          {/* Confirm Button */}
          <Button
            onClick={() => setIsModalOpen(true)}
            disabled={isProcessing}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span>Confirm Purchase</span>
              </div>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmPurchase}
        cartItems={cartItems}
        totalBery={finalTotalBery}
        totalUSD={finalTotalUSD}
        isProcessing={isProcessing}
      />
    </div>
  );
}