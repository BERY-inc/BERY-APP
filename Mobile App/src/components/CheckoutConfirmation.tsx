import { useState } from "react";
import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Wallet,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { CartItem } from "./ShoppingCart";
import { toast } from "sonner";
import { Haptics, NotificationType } from "@capacitor/haptics";

interface CheckoutConfirmationProps {
  cartItems: CartItem[];
  totalBery: number;
  totalUSD: number;
  onBack: () => void;
  onConfirmPurchase: (paymentMethod: "bery", amount: number) => void;
  walletBalance?: number;
}

export function CheckoutConfirmation({
  cartItems,
  totalBery,
  totalUSD,
  onBack,
  onConfirmPurchase,
  walletBalance = 0,
}: CheckoutConfirmationProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "John Doe",
    phone: "+1 (555) 123-4567",
    email: "john@example.com",
    address: "123 Main St, Apt 4B",
    city: "New York",
    zipCode: "10001",
  });

  const hasSufficientBalance = walletBalance >= totalBery;

  const handleConfirm = () => {
    if (!hasSufficientBalance) {
      toast.error("Insufficient Balance", {
        description: `You need ₿${totalBery.toFixed(1)} but only have ₿${walletBalance.toFixed(1)}`,
        duration: 5000,
      });
      return;
    }

    try { Haptics.notification({ type: NotificationType.Success }); } catch {}
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      try { Haptics.notification({ type: NotificationType.Success }); } catch {}
      onConfirmPurchase("bery", totalBery);
    }, 2000);
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] px-5 pt-14 pb-6 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
            disabled={isProcessing}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1
            className="text-xl text-white"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
          >
            Checkout
          </h1>
        </div>
      </div>

      <div className="px-5 py-6 space-y-4">
        {/* Order Items Summary */}
        <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
          <h3
            className="text-sm text-white mb-3"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Order Summary ({cartItems.length} items)
          </h3>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-300 truncate flex-1">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-white ml-2">{item.price}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Information */}
        <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40">
          <h3
            className="text-sm text-white mb-4"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Delivery Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm">
                <p className="text-white">{deliveryInfo.name}</p>
                <p className="text-slate-400">
                  {deliveryInfo.address}, {deliveryInfo.city} {deliveryInfo.zipCode}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-sm text-slate-300">{deliveryInfo.phone}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-sm text-slate-300">{deliveryInfo.email}</p>
            </div>
          </div>
        </Card>

        {/* Payment Method */}
        <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40">
          <h3
            className="text-sm text-white mb-4"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Payment Method
          </h3>
          <div className="space-y-3">
            {/* Bery Wallet */}
            <div className="w-full p-4 rounded-xl border-2 border-blue-600 bg-blue-600/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600"
                  >
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-left">
                    <p
                      className="text-sm text-white"
                      style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
                    >
                      Bery Wallet
                    </p>
                    <p className="text-xs text-slate-400">
                      Balance: ₿ {walletBalance.toFixed(1)}
                    </p>
                  </div>
                </div>
                <CheckCircle2 className="w-5 h-5 text-blue-400" />
              </div>
            </div>
          </div>

          {!hasSufficientBalance && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-xs text-red-300">
                Insufficient balance. Please add funds or select another payment method.
              </p>
            </div>
          )}
        </Card>

        {/* Payment Summary */}
        <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40">
          <h3
            className="text-sm text-white mb-4"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
          >
            Payment Summary
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">You Pay</span>
              <div className="text-right">
                <p
                  className="text-lg text-white"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
                >
                  ₿ {totalBery.toFixed(1)}
                </p>
                <p className="text-xs text-slate-400">
                  ≈ ${totalUSD.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-4 flex items-center justify-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl">
            <Lock className="w-4 h-4 text-green-400" />
            <p className="text-xs text-green-300">
              Secure payment powered by Bery
            </p>
          </div>
        </Card>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={isProcessing || !hasSufficientBalance}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </div>
          ) : (
            `Confirm Payment ₿ ${totalBery.toFixed(1)}`
          )}
        </Button>

        <p className="text-xs text-center text-slate-500 leading-relaxed">
          By confirming, you agree to Bery's Terms of Service and Privacy Policy.
          All purchases are protected by buyer guarantee.
        </p>
      </div>
    </div>
  );
}
