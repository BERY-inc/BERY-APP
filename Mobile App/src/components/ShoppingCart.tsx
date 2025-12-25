import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, ShoppingCart as ShoppingCartIcon, Trash2, Plus, Minus, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";
import { EmptyState } from "./EmptyState";
import { toast } from "sonner";

export interface CartItem {
  id: number; // Cart ID
  itemId?: number; // Product ID
  name: string;
  price: string;
  numericPrice?: number; // Numeric price for calculations/updates
  usdPrice: string;
  seller: string;
  image?: string;
  icon?: any;
  quantity: number;
  type: "product" | "service";
}

interface ShoppingCartProps {
  cartItems: CartItem[];
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  cartItemCount?: number;
}

export function ShoppingCart({
  cartItems,
  onBack,
  onNavigate,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  cartItemCount = 0,
}: ShoppingCartProps) {
  const [removingId, setRemovingId] = useState<number | null>(null);

  // Ensure cartItems is a valid array
  const safeCartItems: CartItem[] = Array.isArray(cartItems) ? cartItems : [];
  const isEmpty = safeCartItems.length === 0;
  
  console.log("🛒 ShoppingCart render:", {
    cartItems: cartItems,
    safeLength: safeCartItems.length,
    isEmpty: isEmpty,
    cartItemCount: cartItemCount
  });

  const handleRemove = (id: number) => {
    setRemovingId(id);
    setTimeout(() => {
      onRemoveItem(id);
      toast.success("Item removed from cart");
    }, 300);
  };

  // Calculate totals
  const subtotalBery = safeCartItems.reduce((sum, item) => {
    const price = parseFloat(String(item.price || '0').replace("₿", "").replace("From", "").trim());
    return sum + price * (item.quantity || 1);
  }, 0);

  const subtotalUSD = subtotalBery / 8.9;
  const estimatedTax = subtotalUSD * 0.1;
  const totalUSD = subtotalUSD + estimatedTax;
  const totalBery = totalUSD * 8.9;

  return (
    <div className="h-screen flex flex-col bg-[#0a0a1a]">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] px-5 pt-14 pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1
              className="text-xl text-white"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 700 }}
            >
              Shopping Cart
            </h1>
            {safeCartItems.length > 0 && (
              <p className="text-sm text-blue-200 mt-1">
                {safeCartItems.length} {safeCartItems.length === 1 ? "item" : "items"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-5 -mt-4">
        <div className="py-6">
        {isEmpty ? (
          <EmptyState
            type="cart"
            onAction={() => onNavigate("marketplace")}
          />
        ) : (
          <>
            {/* Cart Items */}
            <div className="mb-6 space-y-3">
              <AnimatePresence>
                {safeCartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      className={`p-4 bg-[#1a1a2e] border border-slate-700/40 transition-all ${removingId === item.id ? "opacity-50" : ""
                        }`}
                    >
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                          {(() => {
                            // Handle different image types
                            if (item.image && typeof item.image === 'string') {
                              // Check if it's a URL
                              if (item.image.startsWith('http') || item.image.startsWith('/')) {
                                return (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                      if (e.currentTarget.parentElement) {
                                        e.currentTarget.parentElement.innerHTML = '<div class="text-3xl">📦</div>';
                                      }
                                    }}
                                  />
                                );
                              } else {
                                // It's an emoji or text
                                return <span className="text-3xl">{item.image}</span>;
                              }
                            } else if (item.icon) {
                              // Use icon component
                              const Icon = item.icon;
                              return (
                                <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
                                  <Icon className="w-8 h-8 text-white" />
                                </div>
                              );
                            } else {
                              // Fallback to package icon
                              return <span className="text-3xl">📦</span>;
                            }
                          })()}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0 pr-2">
                              <h3
                                className="text-sm text-white mb-1 truncate"
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 600,
                                }}
                              >
                                {item.name}
                              </h3>
                              <p className="text-xs text-slate-400">
                                {item.seller}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemove(item.id)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 flex-shrink-0"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p
                                className="text-sm text-white"
                                style={{
                                  fontFamily: "Inter, sans-serif",
                                  fontWeight: 700,
                                }}
                              >
                                {item.price}
                              </p>
                              <p className="text-xs text-slate-400">
                                {item.usdPrice}
                              </p>
                            </div>

                            {/* Quantity Controls */}
                            {item.type === "product" && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(
                                      item.id,
                                      Math.max(1, item.quantity - 1)
                                    )
                                  }
                                  className="w-7 h-7 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-white transition-colors"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span
                                  className="text-sm text-white w-6 text-center"
                                  style={{
                                    fontFamily: "Inter, sans-serif",
                                    fontWeight: 600,
                                  }}
                                >
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    onUpdateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="w-7 h-7 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-white transition-colors"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40 mb-4">
              <h3
                className="text-sm text-white mb-4"
                style={{ fontFamily: "Inter, sans-serif", fontWeight: 600 }}
              >
                Order Summary
              </h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <div className="text-right">
                    <p className="text-white">₿ {subtotalBery.toFixed(1)}</p>
                    <p className="text-xs text-slate-400">
                      ${subtotalUSD.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Estimated Tax</span>
                  <div className="text-right">
                    <p className="text-white">
                      ₿ {(estimatedTax * 8.9).toFixed(1)}
                    </p>
                    <p className="text-xs text-slate-400">
                      ${estimatedTax.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-700/40 pt-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-base text-white"
                      style={{
                        fontFamily: "Inter, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      Total
                    </span>
                    <div className="text-right">
                      <p
                        className="text-lg text-white"
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        ₿ {totalBery.toFixed(1)}
                      </p>
                      <p className="text-sm text-slate-400">
                        ${totalUSD.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="flex items-start gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-300 leading-relaxed">
                  Payment will be processed securely using your Bery wallet
                </p>
              </div>
            </Card>

            {/* Checkout Button */}
            <Button
              onClick={onCheckout}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
            >
              <ShoppingCartIcon className="w-5 h-5 mr-2" />
              Proceed to Checkout
            </Button>
          </>
        )}
        </div>
      </div>

      {/* Bottom Navigation - Fixed */}
      <div className="flex-shrink-0">
        <BottomNavigation currentScreen="marketplace" onNavigate={onNavigate} cartItemCount={cartItemCount} />
      </div>
    </div>
  );
}
