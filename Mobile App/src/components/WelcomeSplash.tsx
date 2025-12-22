import { Button } from "./ui/button";
import { motion } from "motion/react";
import { Globe, Zap, Shield } from "lucide-react";
import beryLogo from "figma:asset/466dce6a0532de3f4107d8521f08e4422cd6ba06.png";

interface WelcomeSplashProps {
  onGetStarted: () => void;
  onLogin?: () => void;
}

export function WelcomeSplash({ onGetStarted, onLogin }: WelcomeSplashProps) {
  return (
    <div className="h-screen relative overflow-hidden flex items-center justify-center bg-[#0a0a1a]">
      {/* Subtle gradient overlay matching homepage */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at top right, #1e3a8a 0%, transparent 50%), radial-gradient(circle at bottom left, #0f172a 0%, transparent 50%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo */}
          <div className="mb-12">
            <div className="flex justify-center mb-6">
              <div 
                className="w-32 h-32 rounded-3xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
                }}
              >
                <img src={beryLogo} alt="Bery" className="w-full h-full object-contain" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-white/50" />
              <p style={{ fontFamily: 'Sora, sans-serif' }}>Born from motion, built for trust</p>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-white/50" />
            </div>
          </div>

          {/* Feature highlights */}
          <div className="flex justify-center gap-8 mb-16 flex-wrap">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="flex flex-col items-center gap-2 text-white"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Zap className="w-8 h-8" />
              </div>
              <span className="text-xs">Instant</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col items-center gap-2 text-white"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Shield className="w-8 h-8" />
              </div>
              <span className="text-xs">Secure</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-col items-center gap-2 text-white"
            >
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Globe className="w-8 h-8" />
              </div>
              <span className="text-xs">Global</span>
            </motion.div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="space-y-3"
          >
            <Button
              onClick={onGetStarted}
              size="lg"
              className="bg-white text-[#1e3a8a] hover:bg-white/90 w-full h-14 rounded-full shadow-2xl transition-all active:scale-95"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              Create Account
            </Button>
            <Button
              onClick={onLogin}
              size="lg"
              variant="outline"
              className="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 w-full h-14 rounded-full backdrop-blur-sm transition-all active:scale-95"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              Sign In
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
