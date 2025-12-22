import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { motion } from "motion/react";
import { ArrowLeft, Shield } from "lucide-react";

interface OTPVerificationProps {
  onBack: () => void;
  onVerify: (otp: string) => void;
  phoneOrEmail: string;
  type: "email" | "phone";
}

export function OTPVerification({ onBack, onVerify, phoneOrEmail, type }: OTPVerificationProps) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer for resend
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only last character
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits entered
    if (index === 5 && value) {
      const otpString = newOtp.join("");
      if (otpString.length === 6) {
        handleVerify(otpString);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastIndex]?.focus();

    // Auto-verify if complete
    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = (otpString?: string) => {
    const code = otpString || otp.join("");
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }
    onVerify(code);
  };

  const handleResend = () => {
    setResendTimer(60);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    // Here you would trigger resend OTP API
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a]">
      {/* Header */}
      <div className="px-5 pt-14 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-slate-800/50 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-5 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>

          {/* Title */}
          <h1 className="text-2xl text-white mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Verify Your {type === "email" ? "Email" : "Phone"}
          </h1>
          <p className="text-sm text-slate-400 mb-8">
            We sent a 6-digit code to
            <br />
            <span className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              {phoneOrEmail}
            </span>
          </p>

          {/* OTP Input */}
          <div className="flex gap-3 justify-center mb-4" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-xl bg-[#1a1a2e] border border-slate-700/40 rounded-xl text-white focus:border-blue-500 focus:outline-none transition-colors"
                style={{ fontFamily: 'monospace', fontWeight: 700 }}
              />
            ))}
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-400 mb-4"
            >
              {error}
            </motion.p>
          )}

          {/* Resend */}
          <div className="mb-8">
            {resendTimer > 0 ? (
              <p className="text-sm text-slate-400">
                Resend code in{" "}
                <span className="text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {resendTimer}s
                </span>
              </p>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
              >
                Resend Code
              </button>
            )}
          </div>

          {/* Verify Button */}
          <Button
            onClick={() => handleVerify()}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-base rounded-xl"
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
          >
            Verify & Continue
          </Button>

          {/* Help Text */}
          <p className="text-xs text-slate-500 mt-6">
            Didn't receive the code?{" "}
            <button className="text-blue-400 hover:text-blue-300">
              Contact Support
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
