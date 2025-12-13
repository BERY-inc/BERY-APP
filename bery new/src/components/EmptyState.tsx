import { motion } from "motion/react";
import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";
import {
  Package,
  ShoppingCart,
  History,
  TrendingUp,
  Search,
  MessageSquare,
} from "lucide-react";

interface EmptyStateProps {
  type:
    | "cart"
    | "transactions"
    | "investments"
    | "search"
    | "messages"
    | "marketplace";
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}

export function EmptyState({
  type,
  title,
  message,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) {
  const emptyConfig = {
    cart: {
      icon: ShoppingCart,
      title: "Your Cart is Empty",
      message: "Add some products or services to get started",
      actionLabel: "Browse Marketplace",
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
    },
    transactions: {
      icon: History,
      title: "No Transactions Yet",
      message: "Your transaction history will appear here",
      actionLabel: "Send Money",
      color: "text-green-400",
      bgColor: "bg-green-500/20",
    },
    investments: {
      icon: TrendingUp,
      title: "No Investments Yet",
      message: "Start investing to grow your wealth with Bery",
      actionLabel: "Explore Opportunities",
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
    },
    search: {
      icon: Search,
      title: "No Results Found",
      message: "Try adjusting your search or filters",
      actionLabel: "Clear Filters",
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
    },
    messages: {
      icon: MessageSquare,
      title: "No Messages",
      message: "Start a conversation with Bery AI or your contacts",
      actionLabel: "Chat with AI",
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/20",
    },
    marketplace: {
      icon: Package,
      title: "No Items Available",
      message: "Check back soon for new products and services",
      actionLabel: "Refresh",
      color: "text-pink-400",
      bgColor: "bg-pink-500/20",
    },
  };

  const config = emptyConfig[type];
  const Icon = icon || config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center py-12 px-6 text-center"
    >
      {/* Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className={`w-24 h-24 rounded-full ${config.bgColor} flex items-center justify-center mb-6`}
      >
        <Icon className={`w-12 h-12 ${config.color}`} />
      </motion.div>

      {/* Text */}
      <h3
        className="text-lg text-white mb-2"
        style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
      >
        {title || config.title}
      </h3>
      <p className="text-sm text-slate-400 mb-6 max-w-xs leading-relaxed">
        {message || config.message}
      </p>

      {/* Action Button */}
      {onAction && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
        >
          {actionLabel || config.actionLabel}
        </Button>
      )}
    </motion.div>
  );
}
