import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import beryLogo from "figma:asset/466dce6a0532de3f4107d8521f08e4422cd6ba06.png";

interface SignUpScreenProps {
  onBack: () => void;
  onSignUp: (email: string, phone: string, password: string) => void;
  onLogin: () => void;
}

export function SignUpScreen({ onBack, onSignUp, onLogin }: SignUpScreenProps) {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    const newErrors = { email: "", phone: "", password: "", confirmPassword: "" };
    let isValid = true;

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone) || formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = "Invalid phone number";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
      isValid = false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm() && agreed) {
      onSignUp(formData.email, formData.phone, formData.password);
    }
  };

  return (
    <div className="h-screen overflow-y-auto relative pb-12 bg-[#0a0a1a]">
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
          <div className="flex flex-col items-center mb-8">
            <div 
              className="w-20 h-20 rounded-3xl overflow-hidden mb-3"
              style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
              }}
            >
              <img src={beryLogo} alt="Bery" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              Create Account
            </h1>
            <p className="text-sm text-slate-400">Join Bery for fast, secure finance</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Email */}
            <div>
              <Label htmlFor="email" className="text-sm text-slate-300 mb-2 block">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="bg-[#1a1a2e] border-slate-700/40 text-white h-12 rounded-xl"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="text-sm text-slate-300 mb-2 block">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="bg-[#1a1a2e] border-slate-700/40 text-white h-12 rounded-xl"
              />
              {errors.phone && (
                <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword" className="text-sm text-slate-300 mb-2 block">
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="bg-[#1a1a2e] border-slate-700/40 text-white h-12 rounded-xl pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start gap-3 p-4 bg-[#1a1a2e] border border-slate-700/40 rounded-xl">
              <input
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
              />
              <label htmlFor="terms" className="text-xs text-slate-400">
                I agree to the{" "}
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Terms of Service</span>
                {" "}and{" "}
                <span className="text-blue-400 hover:text-blue-300 cursor-pointer">Privacy Policy</span>
              </label>
            </div>

            {/* Sign Up Button */}
            <Button
              onClick={handleSubmit}
              disabled={!agreed}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-base rounded-xl mt-6"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              Create Account
            </Button>

            {/* Sign In Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-slate-400">
                Already have an account?{" "}
                <button
                  onClick={onLogin}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                >
                  Sign In
                </button>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
