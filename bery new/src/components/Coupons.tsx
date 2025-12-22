import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ArrowLeft, Search, Tag, QrCode, Calendar, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import pauketService from "../services/pauketService";
import { Category, Campaign, UserCoupon } from "../types/pauketTypes";

interface CouponsProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userId: string;
  userName: string;
  userImage?: string;
}

export function Coupons({ onBack, onNavigate, userId, userName, userImage }: CouponsProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"categories" | "myCoupons">("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [myCoupons, setMyCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const categoryList = await pauketService.getCategoryList();
      setCategories(categoryList);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      const { coupons } = await pauketService.getMyCoupons(userId, "all");
      setMyCoupons(coupons);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      setError("Failed to load your coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    // Navigate to campaigns screen with category filter
    navigate(`/coupon-campaigns?categoryId=${categoryId}`);
  };

  const handleMyCouponsClick = () => {
    setActiveTab("myCoupons");
    if (myCoupons.length === 0) {
      fetchMyCoupons();
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] text-white px-5 pt-14 pb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Coupons & Offers</h1>
        </div>
        <p className="text-blue-200/80 text-sm">Discover amazing deals and discounts</p>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for coupons, merchants..."
            className="w-full pl-10 pr-4 py-3 bg-[#1a1a2e] border border-slate-700/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex bg-[#1a1a2e] rounded-xl p-1">
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
              activeTab === "categories"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("categories")}
          >
            Categories
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-lg text-sm transition-colors ${
              activeTab === "myCoupons"
                ? "bg-blue-600 text-white"
                : "text-slate-400 hover:text-white"
            }`}
            onClick={handleMyCouponsClick}
          >
            My Coupons
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-5">
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-200 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : activeTab === "categories" ? (
          <>
            <h2 className="text-white text-lg mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Browse by Category
            </h2>
            {categories.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card 
                      className="p-4 bg-[#1a1a2e] border border-slate-700/40 hover:border-blue-500/50 cursor-pointer transition-all"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      <div className="flex flex-col items-center text-center">
                        {category.image ? (
                          <img 
                            src={category.image} 
                            alt={category.name}
                            className="w-16 h-16 rounded-lg object-cover mb-3"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                            <Tag className="w-8 h-8 text-blue-400" />
                          </div>
                        )}
                        <h3 className="text-white text-sm font-medium mb-1">{category.name}</h3>
                        <p className="text-slate-400 text-xs">{category.campaign_count} offers</p>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-8 bg-[#1a1a2e] border border-slate-700/40 text-center">
                <Tag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">No categories available at the moment</p>
              </Card>
            )}
          </>
        ) : (
          <>
            <h2 className="text-white text-lg mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              My Coupons
            </h2>
            {myCoupons.length > 0 ? (
              <div className="space-y-4">
                {myCoupons.map((coupon) => (
                  <motion.div
                    key={coupon.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
                      <div className="flex items-start gap-3">
                        {coupon.qr_code ? (
                          <div className="w-16 h-16 rounded-lg bg-white p-1 flex items-center justify-center">
                            <img 
                              src={coupon.qr_code} 
                              alt="Coupon QR Code"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center">
                            <Tag className="w-8 h-8 text-blue-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white text-sm font-medium truncate">{coupon.merchant_name}</h3>
                          <p className="text-slate-300 text-xs mb-1 truncate">{coupon.campaign_name}</p>
                          <p className="text-emerald-400 text-xs font-medium mb-2">{coupon.offer_to_show}</p>
                          <div className="flex items-center gap-3 text-slate-400 text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Expires {new Date(coupon.expiry_date).toLocaleDateString()}</span>
                            </div>
                            <span className="px-2 py-0.5 bg-slate-700/50 rounded text-xs capitalize">
                              {coupon.coupon_status}
                            </span>
                          </div>
                        </div>
                      </div>
                      {coupon.isCTAvalid && (
                        <Button 
                          className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs py-2"
                          onClick={() => {
                            // Handle CTA action
                            if (coupon.CTAredirect) {
                              window.open(coupon.CTAredirect, '_blank');
                            }
                          }}
                        >
                          {coupon.CTAname || "Redeem Now"}
                        </Button>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card className="p-8 bg-[#1a1a2e] border border-slate-700/40 text-center">
                <Tag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-400">You don't have any coupons yet</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm py-2"
                  onClick={() => setActiveTab("categories")}
                >
                  Browse Coupons
                </Button>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}