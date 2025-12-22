import { useState } from "react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Wallet, TrendingUp, ShoppingBag, MessageCircle, Shield, ChevronRight } from "lucide-react";

interface FeatureWalkthroughProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function FeatureWalkthrough({ onComplete, onSkip }: FeatureWalkthroughProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Wallet,
      color: "from-blue-500 to-blue-700",
      title: "Your Digital Wallet",
      description: "Send and receive money instantly with Bery (₿) or USD. Zero fees, lightning fast.",
      features: [
        "Instant transfers globally",
        "Zero transaction fees",
        "Multi-currency support"
      ]
    },
    {
      icon: TrendingUp,
      color: "from-green-500 to-emerald-600",
      title: "Smart Investments",
      description: "Grow your wealth with diverse investment opportunities from 6% to 30% APY.",
      features: [
        "Fixed deposits from 6% APY",
        "Venture capital opportunities",
        "Real estate tokenization"
      ]
    },
    {
      icon: ShoppingBag,
      color: "from-purple-500 to-pink-600",
      title: "Global Marketplace",
      description: "Shop products and hire services from verified sellers worldwide.",
      features: [
        "Secure payments with Bery",
        "Buyer protection included",
        "Thousands of products & services"
      ]
    },
    {
      icon: MessageCircle,
      color: "from-orange-500 to-amber-600",
      title: "Bery AI Assistant",
      description: "Get instant help and insights from our AI-powered financial assistant.",
      features: [
        "24/7 support available",
        "Financial advice & tips",
        "Transaction assistance"
      ]
    },
    {
      icon: Shield,
      color: "from-teal-500 to-cyan-600",
      title: "Bank-Level Security",
      description: "Your money and data are protected with enterprise-grade encryption.",
      features: [
        "256-bit encryption",
        "Two-factor authentication",
        "Biometric security"
      ]
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="h-screen overflow-hidden bg-[#0a0a1a] flex flex-col">
      {/* Skip Button */}
      <div className="px-5 pt-14 pb-4 flex justify-end">
        <button
          onClick={onSkip}
          className="text-sm text-slate-400 hover:text-white transition-colors"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5, type: "spring" }}
              className="mb-8"
            >
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${slide.color} flex items-center justify-center mx-auto shadow-2xl`}>
                <Icon className="w-16 h-16 text-white" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl text-white mb-4"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              {slide.title}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-base text-slate-400 mb-8"
            >
              {slide.description}
            </motion.p>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="space-y-3 mb-12"
            >
              {slide.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  className="flex items-center gap-3 bg-[#1a1a2e] border border-slate-700/40 rounded-xl p-4"
                >
                  <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${slide.color}`} />
                  <p className="text-sm text-slate-300 text-left">{feature}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="px-5 pb-8">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-6">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? `w-8 bg-gradient-to-r ${slide.color}`
                  : 'w-2 bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button
          onClick={handleNext}
          className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-base rounded-xl"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
        >
          {currentSlide === slides.length - 1 ? (
            "Get Started"
          ) : (
            <>
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
