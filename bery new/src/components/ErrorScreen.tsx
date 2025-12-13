import { motion } from "motion/react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { AlertCircle, WifiOff, XCircle, RefreshCw, Home } from "lucide-react";

interface ErrorScreenProps {
  type?: "network" | "transaction" | "general" | "not-found";
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
  showHomeButton?: boolean;
}

export function ErrorScreen({
  type = "general",
  title,
  message,
  onRetry,
  onGoHome,
  showHomeButton = true,
}: ErrorScreenProps) {
  const errorConfig = {
    network: {
      icon: WifiOff,
      title: "No Internet Connection",
      message: "Please check your connection and try again",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    transaction: {
      icon: XCircle,
      title: "Transaction Failed",
      message: "We couldn't process your transaction. Please try again",
      color: "text-red-400",
      bgColor: "bg-red-500/20",
    },
    "not-found": {
      icon: AlertCircle,
      title: "Page Not Found",
      message: "The page you're looking for doesn't exist",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    general: {
      icon: AlertCircle,
      title: "Something Went Wrong",
      message: "An unexpected error occurred. Please try again",
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
    },
  };

  const config = errorConfig[type];
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] flex items-center justify-center p-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 bg-[#1a1a2e] border border-slate-700/40 text-center">
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-6`}
          >
            <Icon className={`w-10 h-10 ${config.color}`} />
          </motion.div>

          {/* Error Message */}
          <h2
            className="text-xl text-white mb-3"
            style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
          >
            {title || config.title}
          </h2>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed">
            {message || config.message}
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            {onRetry && (
              <Button
                onClick={onRetry}
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Try Again
              </Button>
            )}
            {showHomeButton && onGoHome && (
              <Button
                onClick={onGoHome}
                variant="outline"
                className="w-full h-12 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Home
              </Button>
            )}
          </div>
        </Card>

        {/* Help Text */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Need help? Contact{" "}
          <span className="text-blue-400">support@bery.app</span>
        </p>
      </motion.div>
    </div>
  );
}
