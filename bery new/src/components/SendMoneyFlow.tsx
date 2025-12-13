import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
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

interface SendMoneyFlowProps {
  onBack: () => void;
  onComplete: () => void;
}

export function SendMoneyFlow({ onBack, onComplete }: SendMoneyFlowProps) {
  const [step, setStep] = useState(1);
  const [selectedRecipient, setSelectedRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("USD");

  const contacts = [
    { id: "1", name: "Sarah Johnson", email: "sarah.j@email.com", initials: "SJ", country: "🇺🇸" },
    { id: "2", name: "Raj Patel", email: "raj.patel@email.com", initials: "RP", country: "🇮🇳" },
    { id: "3", name: "Emma Wilson", email: "emma.w@email.com", initials: "EW", country: "🇬🇧" },
    { id: "4", name: "Carlos Rodriguez", email: "carlos.r@email.com", initials: "CR", country: "🇪🇸" },
  ];

  const progress = (step / 3) * 100;

  const handleNext = () => {
    if (step < 3) {
      try { Haptics.notification({ type: NotificationType.Success }); } catch {}
      setStep(step + 1);
    } else {
      // Complete transaction
      setTimeout(() => {
        try { Haptics.notification({ type: NotificationType.Success }); } catch {}
        onComplete();
      }, 2000);
    }
  };

  const selectedContact = contacts.find(c => c.id === selectedRecipient);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a]">
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
        <Progress value={progress} className="h-2 bg-white/20" />
        <div className="flex justify-between mt-2 text-xs text-white/70">
          <span className={step >= 1 ? "text-white" : ""}>Recipient</span>
          <span className={step >= 2 ? "text-white" : ""}>Amount</span>
          <span className={step >= 3 ? "text-white" : ""}>Confirm</span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-6 pb-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Step 1: Select Recipient */}
          {step === 1 && (
            <Card className="p-5 bg-[#1a1a2e] border-slate-700/40">
              <h2 className="text-lg mb-4 text-white">Select Recipient</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400/80" />
                <Input
                  placeholder="Search contacts..."
                  className="pl-10 bg-[#0a0a1a] border-slate-700/40 text-white placeholder:text-slate-400/60"
                />
              </div>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedRecipient(contact.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all active:scale-98 ${
                      selectedRecipient === contact.id
                        ? 'border-blue-600 bg-blue-600/10'
                        : 'border-slate-700/40 hover:border-blue-600/40 bg-[#0a0a1a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white">
                          {contact.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-white">{contact.name}</p>
                          <span>{contact.country}</span>
                        </div>
                        <p className="text-xs text-slate-400/80">{contact.email}</p>
                      </div>
                      {selectedRecipient === contact.id && (
                        <Check className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button
                onClick={handleNext}
                disabled={!selectedRecipient}
                className="w-full mt-6 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] h-12"
              >
                Continue
              </Button>
            </Card>
          )}

          {/* Step 2: Enter Amount */}
          {step === 2 && (
            <Card className="p-5 bg-[#1a1a2e] border-slate-700/40">
              <h2 className="text-lg mb-6 text-white">Enter Amount</h2>
              
              <div className="mb-5">
                <Label className="text-xs text-slate-300">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="mt-2 h-12 bg-[#0a0a1a] border-slate-700/40 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#1a1a2e] border-slate-700/40">
                    <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                    <SelectItem value="GBP">🇬🇧 GBP - British Pound</SelectItem>
                    <SelectItem value="INR">🇮🇳 INR - Indian Rupee</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-5">
                <Label className="text-xs text-slate-300">Amount</Label>
                <div className="relative mt-2">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-slate-400/80">
                    {currency === 'USD' && '$'}
                    {currency === 'EUR' && '€'}
                    {currency === 'GBP' && '£'}
                    {currency === 'INR' && '₹'}
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

              <Card className="p-4 bg-blue-600/10 border-blue-600/20 mb-5">
                <div className="flex items-center gap-2 text-sm text-blue-400 mb-2">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs">Transfer Details</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400/80 text-xs">Fee</span>
                    <span className="text-xs text-white">$2.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400/80 text-xs">Exchange Rate</span>
                    <span className="text-xs text-white">1.00</span>
                  </div>
                  <div className="h-px bg-slate-700/40 my-2" />
                  <div className="flex justify-between">
                    <span className="text-sm text-white">Total</span>
                    <span className="text-base text-white">${amount ? (parseFloat(amount) + 2.50).toFixed(2) : '2.50'}</span>
                  </div>
                </div>
              </Card>

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
            </Card>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <Card className="p-5 bg-[#1a1a2e] border-slate-700/40">
              <div className="text-center mb-6">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-600/30">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-lg mb-2 text-white">Confirm Transaction</h2>
                <p className="text-xs text-slate-400/80">Please review the details below</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-4 bg-[#0a0a1a] rounded-xl border border-slate-700/40">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white">
                      {selectedContact?.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400/80">Sending to</p>
                    <p className="text-sm text-white">{selectedContact?.name}</p>
                  </div>
                </div>

                <div className="p-4 bg-[#0a0a1a] rounded-xl border border-slate-700/40">
                  <p className="text-xs text-slate-400/80 mb-1">Amount</p>
                  <p className="text-3xl text-white">
                    {currency === 'USD' && '$'}
                    {currency === 'EUR' && '€'}
                    {currency === 'GBP' && '£'}
                    {currency === 'INR' && '₹'}
                    {amount}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-[#0a0a1a] rounded-xl border border-slate-700/40">
                    <p className="text-xs text-slate-400/80 mb-1">Fee</p>
                    <p className="text-sm text-white">$2.50</p>
                  </div>
                  <div className="p-4 bg-[#0a0a1a] rounded-xl border border-slate-700/40">
                    <p className="text-xs text-slate-400/80 mb-1">Total</p>
                    <p className="text-sm text-white">${amount ? (parseFloat(amount) + 2.50).toFixed(2) : '2.50'}</p>
                  </div>
                </div>
              </div>

              <Card className="p-4 bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-emerald-500/20 mb-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Lock className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs mb-1 text-emerald-300">Secure Transaction</p>
                    <p className="text-xs text-emerald-300/60">
                      Protected by Bery's secure network
                    </p>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="flex-1 h-12 border-slate-700/40 text-slate-300 hover:bg-slate-700/30"
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  className="flex-1 bg-gradient-to-r from-[#0f172a] to-[#1e3a8a] h-12"
                >
                  Confirm & Send
                </Button>
              </div>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}
