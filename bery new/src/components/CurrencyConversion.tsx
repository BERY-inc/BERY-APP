import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { ArrowLeft, ArrowDownUp, Lock, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "motion/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface CurrencyConversionProps {
  onBack: () => void;
}

export function CurrencyConversion({ onBack }: CurrencyConversionProps) {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");

  const exchangeRates: Record<string, Record<string, number>> = {
    USD: { EUR: 0.92, GBP: 0.79, INR: 83.12, JPY: 149.50 },
    EUR: { USD: 1.09, GBP: 0.86, INR: 90.45, JPY: 162.80 },
    GBP: { USD: 1.27, EUR: 1.16, INR: 105.20, JPY: 189.30 },
    INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.80 },
  };

  const rate = exchangeRates[fromCurrency]?.[toCurrency] || 1;
  const convertedAmount = amount ? (parseFloat(amount) * rate).toFixed(2) : "0.00";

  const currencySymbols: Record<string, string> = {
    USD: "$",
    EUR: "€",
    GBP: "£",
    INR: "₹",
    JPY: "¥",
  };

  const rateChange = "+0.15%"; // Mock rate change

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  return (
    <div className="h-screen overflow-y-auto pb-20 bg-[#0a0a1a]">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#7c3aed] to-[#1e3a8a] text-white px-5 pt-12 pb-8 rounded-b-[2rem]">
        <h1 className="text-2xl mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Currency Conversion</h1>
        <p className="text-white/80 text-sm">Convert between currencies</p>
      </div>

      {/* Content */}
      <div className="px-5 -mt-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-5 mb-5 shadow-lg bg-[#1a1a2e] border-2 border-purple-500/20 hover:border-purple-500/40 transition-all">
            {/* From Currency */}
            <div className="mb-4">
              <Label className="mb-2 block text-xs text-purple-200">From</Label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="h-12 bg-[#0a0a1a] border-purple-500/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-purple-500/20">
                  <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                  <SelectItem value="GBP">🇬🇧 GBP - British Pound</SelectItem>
                  <SelectItem value="INR">🇮🇳 INR - Indian Rupee</SelectItem>
                  <SelectItem value="JPY">🇯🇵 JPY - Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative mt-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-purple-300/60">
                  {currencySymbols[fromCurrency]}
                </span>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-12 text-2xl h-16 border-2 border-purple-500/20 focus:border-purple-500 bg-[#0a0a1a] text-white placeholder:text-purple-300/40"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center my-4">
              <Button
                onClick={handleSwapCurrencies}
                size="icon"
                variant="outline"
                className="rounded-full w-12 h-12 border-2 border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition-all active:scale-95"
              >
                <ArrowDownUp className="w-5 h-5" />
              </Button>
            </div>

            {/* To Currency */}
            <div>
              <Label className="mb-2 block text-xs text-purple-200">To</Label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="h-12 bg-[#0a0a1a] border-purple-500/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a2e] border-purple-500/20">
                  <SelectItem value="USD">🇺🇸 USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">🇪🇺 EUR - Euro</SelectItem>
                  <SelectItem value="GBP">🇬🇧 GBP - British Pound</SelectItem>
                  <SelectItem value="INR">🇮🇳 INR - Indian Rupee</SelectItem>
                  <SelectItem value="JPY">🇯🇵 JPY - Japanese Yen</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative mt-3">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-purple-300/60">
                  {currencySymbols[toCurrency]}
                </span>
                <Input
                  type="text"
                  value={convertedAmount}
                  readOnly
                  placeholder="0.00"
                  className="pl-12 text-2xl h-16 bg-[#0a0a1a] border-2 border-purple-500/20 text-white placeholder:text-purple-300/40"
                />
              </div>
            </div>
          </Card>

          {/* Exchange Rate Info */}
          <Card className="p-4 mb-5 bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-purple-300/60">Current Rate</p>
                  <p className="text-sm text-white">1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}</p>
                </div>
              </div>
              <Badge className="bg-emerald-500 hover:bg-emerald-500 text-xs">
                {rateChange}
              </Badge>
            </div>
            <div className="text-xs text-purple-300/60">
              Last updated: Just now
            </div>
          </Card>

          {/* Trust Badge */}
          <Card className="p-4 bg-gradient-to-br from-emerald-900/30 to-green-900/30 border-emerald-500/20 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs mb-1 text-emerald-300">Powered by Bery Global Network</p>
                <p className="text-xs text-emerald-300/60">
                  Real-time exchange rates
                </p>
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <Button
            className="w-full h-12 bg-gradient-to-r from-[#7c3aed] to-[#1e3a8a] mb-4"
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Convert Now
          </Button>

          {/* Quick Amounts */}
          <div>
            <p className="text-xs text-purple-300/60 mb-3">Quick amounts</p>
            <div className="grid grid-cols-4 gap-2">
              {["100", "500", "1000", "5000"].map((quickAmount) => (
                <Button
                  key={quickAmount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAmount(quickAmount)}
                  className="hover:border-purple-500 hover:text-purple-300 border-purple-500/20 text-purple-200 h-10 text-xs active:scale-95"
                >
                  {currencySymbols[fromCurrency]}{quickAmount}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}