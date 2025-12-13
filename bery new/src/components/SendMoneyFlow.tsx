import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { ArrowLeft, Search, Check, Lock, Zap } from "lucide-react";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Haptics, NotificationType } from "@capacitor/haptics";
import authService from "../services/authService";
import { toast } from "sonner";

interface SendMoneyFlowProps {
  onBack: () => void;
  onComplete: () => void;
  initialRecipient?: string;
  autoVerify?: boolean;
}

export function SendMoneyFlow({ onBack, onComplete, initialRecipient, autoVerify }: SendMoneyFlowProps) {
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState(typeof initialRecipient === 'string' ? initialRecipient : "");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(false);
  const [manualEntryMode, setManualEntryMode] = useState(false);
  const [recipientName, setRecipientName] = useState("");
  const [verifiedUser, setVerifiedUser] = useState<any>(null);
  const [verificationError, setVerificationError] = useState(false);

  const progress = (step / 3) * 100;

  useEffect(() => {
    if (typeof initialRecipient === 'string' && initialRecipient.length > 0) {
      setRecipient(initialRecipient);
      if (autoVerify) {
        handleCheckUser();
      }
    }
  }, [initialRecipient, autoVerify]);

  const handleCheckUser = async () => {
    if (!recipient) return null;
    setCheckingUser(true);
    setVerifiedUser(null);
    setVerificationError(false);
    setManualEntryMode(false);

    try {
      const raw = await authService.checkUser(recipient);
      const src = raw?.data || raw?.user || raw;
      const first = (src?.f_name || src?.first_name || '').trim();
      const last = (src?.l_name || src?.last_name || '').trim();
      const name = (src?.name || `${first} ${last}`.trim() || recipient).trim();
      let image = src?.image;
      if (image && typeof image === 'string' && !image.startsWith('http')) {
        image = `https://market.bery.in/storage/app/public/profile/${image}`;
      }
      const normalized = {
        name,
        phone: src?.phone || src?.email || recipient,
        image
      };
      setVerifiedUser(normalized);
      toast.success("User verified!");
      return normalized;
    } catch (error: any) {
      console.error("User check failed", error);
      // Enable manual entry mode instead of auto-setting dummy user
      setVerificationError(true);
      setManualEntryMode(true);
      toast.info("User not found on server. Please enter name manually.");
      return null;
    } finally {
      setCheckingUser(false);
    }
  };

  const handleNext = async () => {
    if (step === 1) {
      let currentUser = verifiedUser;

      // If manual mode is on and we have a name, create the user now
      if (manualEntryMode && recipientName) {
        currentUser = {
          name: recipientName,
          phone: recipient,
          image: undefined
        };
        setVerifiedUser(currentUser);
      }
      // If not manual mode and no user, try to check
      else if (!currentUser && !manualEntryMode) {
        currentUser = await handleCheckUser();
      }

      // If still no user (and check failed -> manual mode on), stop and let user enter name
      if (!currentUser) return;

      try { Haptics.notification({ type: NotificationType.Success }); } catch { }
      setStep(step + 1);
    } else if (step === 2) {
      try { Haptics.notification({ type: NotificationType.Success }); } catch { }
      setStep(step + 1);
    } else {
      // Complete transaction
      setLoading(true);
      try {
        await authService.transferFund(parseFloat(amount), recipient);
        try { Haptics.notification({ type: NotificationType.Success }); } catch { }
        toast.success("Transfer Successful!");
        onComplete();
      } catch (error: any) {
        if (error.response?.status === 404) {
          toast.error("Transfer Unavailable", {
            description: "The Funds Transfer feature is not deployed on this server."
          });
        } else {
          toast.error("Transfer Failed", {
            description: error.response?.data?.errors?.[0]?.message || "Something went wrong"
          });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-5 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl" style={{ fontFamily: 'Montserrat, sans-serif' }}>Send Money</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-10 py-6 pb-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-5 bg-[#1a1a2e] border-slate-700/40">
            {/* Progress moved inside card */}
            <div className="mb-6">
              <Progress value={progress} className="h-2 bg-slate-700" />
              <div className="flex justify-between mt-2 text-xs text-slate-400">
                <span className={step >= 1 ? "text-blue-400" : ""}>Recipient</span>
                <span className={step >= 2 ? "text-blue-400" : ""}>Amount</span>
                <span className={step >= 3 ? "text-blue-400" : ""}>Confirm</span>
              </div>
            </div>

            {/* Step 1: Enter Recipient */}
            {step === 1 && (
              <>
                <h2 className="text-lg mb-4 text-white">Recipient Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-slate-300">Email or Phone</Label>
                    <div className="flex gap-2">
                      <Input
                        value={recipient}
                        onChange={(e) => {
                          setRecipient(e.target.value);
                          setVerifiedUser(null);
                          setManualEntryMode(false);
                        }}
                        onKeyDown={(e) => e.key === "Enter" && handleNext()}
                        placeholder="Enter email or phone number"
                        className="mt-2 bg-[#0a0a1a] border-slate-700/40 text-white placeholder:text-slate-400/60 flex-1"
                      />
                      <Button
                        onClick={handleCheckUser}
                        disabled={checkingUser || !recipient}
                        className="mt-2 bg-blue-600 hover:bg-blue-700"
                        size="icon"
                      >
                        {checkingUser ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /> : <Search className="w-4 h-4" />}
                      </Button>
                    </div>

                    {/* Manual Name Entry */}
                    {manualEntryMode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4"
                      >
                        <Label className="text-xs text-yellow-500">Recipient Name (Required)</Label>
                        <Input
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder="Enter recipient's name"
                          className="mt-2 bg-[#0a0a1a] border-yellow-500/50 text-white placeholder:text-slate-400/60"
                          autoFocus
                        />
                        <p className="text-xs text-slate-500 mt-1">We couldn't find this user. Please enter their name to continue.</p>
                      </motion.div>
                    )}

                    {verifiedUser && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-center gap-3"
                      >
                        <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={(verifiedUser?.image as string) || undefined} />
                        <AvatarFallback className="bg-blue-600 text-white">
                            {String(verifiedUser?.name || '').substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                          <p className="text-sm font-medium text-white">{String(verifiedUser?.name || recipient)}</p>
                          <p className="text-xs text-blue-200/70">{String(verifiedUser?.phone || recipient)}</p>
                      </div>
                        <Check className="w-5 h-5 text-green-400 ml-auto" />
                      </motion.div>
                    )}

                    <p className="text-xs text-slate-500 mt-2">
                      Enter the registered email or phone number of the user you want to send money to.
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleNext}
                  disabled={!recipient}
                  className="w-full mt-6 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] h-12"
                >
                  Continue
                </Button>
              </>
            )}

            {/* Step 2: Enter Amount */}
            {step === 2 && (
              <>
                <h2 className="text-lg mb-6 text-white">Enter Amount</h2>

                <div className="mb-5">
                  <Label className="text-xs text-slate-300">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="mt-2 h-12 bg-[#0a0a1a] border-slate-700/40 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1a1a2e] border-slate-700/40">
                      <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="mb-5">
                  <Label className="text-xs text-slate-300">Amount</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400/80">
                      $
                    </span>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="pl-12 text-3xl h-20 border-2 border-slate-700/40 focus:border-blue-600 bg-[#0a0a1a] text-white placeholder:text-slate-400/60"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                    className="flex-1 h-12 border-slate-700/40 text-slate-300 hover:bg-slate-700/30"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!amount || parseFloat(amount) <= 0}
                    className="flex-1 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] h-12"
                  >
                    Continue
                  </Button>
                </div>
              </>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-lg mb-2 text-white">Confirm Transaction</h2>
                </div>

                <div className="space-y-3 mb-6">
                  {verifiedUser && (
                    <div className="flex items-center gap-3 p-4 bg-[#0a0a1a] rounded-xl border border-slate-700/40">
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={(verifiedUser?.image as string) || undefined} />
                        <AvatarFallback className="bg-blue-600 text-white">
                          {String(verifiedUser?.name || recipient).substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400/80">Sending to</p>
                        <p className="text-sm text-white font-medium">{String(verifiedUser?.name || recipient)}</p>
                        <p className="text-xs text-slate-500">{String(verifiedUser?.phone || recipient)}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-[#0a0a1a] rounded-xl border border-slate-700/40">
                    <p className="text-xs text-slate-400/80 mb-1">Amount</p>
                    <p className="text-3xl text-white">
                      ${amount}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-[#0a0a1a] rounded-xl border border-slate-700/40">
                      <p className="text-xs text-slate-400/80 mb-1">Fee</p>
                      <p className="text-sm text-white">Free</p>
                    </div>
                    <div className="p-4 bg-[#0a0a1a] rounded-xl border border-slate-700/40">
                      <p className="text-xs text-slate-400/80 mb-1">Total</p>
                      <p className="text-sm text-white">${amount}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                    className="flex-1 h-12 border-slate-700/40 text-slate-300 hover:bg-slate-700/30"
                    disabled={loading}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] h-12"
                  >
                    {loading ? "Sending..." : "Confirm & Send"}
                  </Button>
                </div>
              </>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
