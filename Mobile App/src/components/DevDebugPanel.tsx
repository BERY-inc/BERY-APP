import { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ChevronDown, ChevronUp, Zap } from "lucide-react";

interface DevDebugPanelProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

export function DevDebugPanel({ currentScreen, onNavigate }: DevDebugPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const screens = {
    "Onboarding": [
      { id: "splash", label: "Welcome Splash" },
      { id: "signup", label: "Sign Up" },
      { id: "login", label: "Login" },
      { id: "otp-verification", label: "OTP Verification" },
      { id: "profile-setup", label: "Profile Setup" },
      { id: "feature-walkthrough", label: "Feature Walkthrough" },
    ],
    "Main App": [
      { id: "dashboard", label: "Dashboard" },
      { id: "send-money", label: "Send Money" },
      { id: "history", label: "Transaction History" },
      { id: "profile", label: "Profile Settings" },
      { id: "ai-chat", label: "AI Chat" },
    ],
    "Investments": [
      { id: "investments", label: "Investments Page" },
      { id: "investment-confirmation", label: "Investment Confirmation" },
      { id: "investment-success", label: "Investment Success" },
    ],
    "Marketplace": [
      { id: "marketplace", label: "Marketplace" },
      { id: "product-detail", label: "Product Detail" },
      { id: "shopping-cart", label: "Shopping Cart" },
      { id: "checkout", label: "Checkout" },
      { id: "purchase-success", label: "Purchase Success" },
    ],
    "Marketplace Extended": [
      { id: "store", label: "Store" },
      { id: "stores", label: "All Stores" },
      { id: "store-item-search", label: "Store Item Search" },
      { id: "campaigns", label: "Campaigns" },
      { id: "item-details-new", label: "Item Details" },
      { id: "items-view-all", label: "Items View All" },
      { id: "popular-items", label: "Popular Items" },
      { id: "campaign-items", label: "Campaign Items" },
      { id: "categories", label: "Categories" },
      { id: "category-items", label: "Category Items" },
      { id: "search", label: "Global Search" },
      { id: "favourite", label: "Favourites" },
      { id: "orders", label: "Orders" },
      { id: "order-details", label: "Order Details" },
      { id: "order-tracking", label: "Order Tracking" },
      { id: "guest-track-order", label: "Guest Track Order" },
      { id: "refund-request", label: "Refund Request" },
      { id: "payment", label: "Payment" },
      { id: "payment-webview", label: "Payment Webview" },
      { id: "offline-payment", label: "Offline Payment" },
      { id: "profile-view", label: "Profile View" },
      { id: "update-profile", label: "Update Profile" },
      { id: "address-list", label: "Address List" },
      { id: "add-address", label: "Add Address" },
    ],
    "Utilities": [
      { id: "error", label: "Error Screen" },
    ],
  };

  if (import.meta.env.PROD) {
    return null; // Hide in production
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-purple-600 hover:bg-purple-500 shadow-2xl p-0"
          title="Open Debug Panel"
        >
          <Zap className="w-6 h-6" />
        </Button>
      ) : (
        <Card className="bg-[#1a1a2e] border border-purple-500/50 shadow-2xl max-h-[80vh] overflow-y-auto w-80">
          <div className="p-4 border-b border-slate-700/40 flex items-center justify-between sticky top-0 bg-[#1a1a2e] z-10">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Dev Debug
              </h3>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 text-slate-400 hover:text-white"
            >
              <ChevronDown className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-4">
            <div className="mb-3 p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <p className="text-xs text-purple-300">Current:</p>
              <p className="text-sm text-white" style={{ fontFamily: 'monospace' }}>
                {currentScreen}
              </p>
            </div>

            {Object.entries(screens).map(([category, items]) => (
              <div key={category} className="mb-4">
                <p className="text-xs text-slate-400 mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {category}
                </p>
                <div className="space-y-1">
                  {items.map((screen) => (
                    <button
                      key={screen.id}
                      onClick={() => onNavigate(screen.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        currentScreen === screen.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                      }`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {screen.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-4 pt-4 border-t border-slate-700/40">
              <p className="text-xs text-slate-500 text-center">
                Only visible in development
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
