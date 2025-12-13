import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import beryLogo from "figma:asset/466dce6a0532de3f4107d8521f08e4422cd6ba06.png";

interface LoginScreenProps {
  onBack: () => void;
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
  onSignUp: () => void;
}

export function LoginScreen({ onBack, onLogin, onForgotPassword, onSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  const validateForm = () => {
    const newErrors = { email: "", password: "" };
    let isValid = true;

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onLogin(email, password);
    }
  };

  return (
    <div className="h-screen overflow-y-auto relative bg-[#0a0a1a]">
      {/* Subtle gradient overlay matching homepage */}
      <div 
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at top right, #1e3a8a 0%, transparent 50%), radial-gradient(circle at bottom left, #0f172a 0%, transparent 50%)',
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-5 pt-14 pb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-white/10 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="relative z-10 px-5 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-12">
            <div 
              className="w-24 h-24 rounded-3xl overflow-hidden mb-4"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
              }}
            >
              <img src={beryLogo} alt="Bery" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Welcome Back
            </h1>
            <p className="text-sm text-slate-400">Sign in to continue to Bery</p>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm text-slate-300 mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="bg-[#1a1a2e] border-slate-700/40 text-white h-12 rounded-xl"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password" className="text-sm text-slate-300 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-[#1a1a2e] border-slate-700/40 text-white h-12 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <button
                onClick={onForgotPassword}
                className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              onClick={handleSubmit}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-base rounded-xl"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              Sign In
            </Button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-slate-700/40" />
              <span className="text-xs text-slate-500">OR</span>
              <div className="flex-1 h-px bg-slate-700/40" />
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{" "}
                <button
                  onClick={onSignUp}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
