import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, QrCode, Calendar, Tag, Copy, ExternalLink } from "lucide-react";
import { motion } from "motion/react";
import QRCode from "react-qr-code";
import pauketService from "../services/pauketService";
import { UserCoupon, CouponStatus } from "../types/pauketTypes";

interface MyCouponsProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userId: string;
}

export function MyCoupons({ onBack, onNavigate, userId }: MyCouponsProps) {
  const [coupons, setCoupons] = useState<UserCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<CouponStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null);

  // Fetch coupons when component mounts or when filters change
  useEffect(() => {
    fetchCoupons();
  }, [activeFilter, currentPage]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { coupons, totalCount, totalPages } = await pauketService.getMyCoupons(
        userId, 
        activeFilter, 
        currentPage
      );
      
      setCoupons(coupons);
      setTotalCount(totalCount);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Failed to fetch coupons:", err);
      setError("Failed to load your coupons. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (code: string, couponId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCouponId(couponId);
    setTimeout(() => setCopiedCouponId(null), 2000);
  };

  const handleCTAClick = (ctaRedirect: string) => {
    if (ctaRedirect) {
      window.open(ctaRedirect, '_blank');
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
          <h1 className="text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            My Coupons
          </h1>
        </div>
        <p className="text-blue-200/80 text-sm">
          {totalCount > 0 ? `${totalCount} coupons` : "Your saved offers"}
        </p>
      </div>

      {/* Filters */}
      <div className="px-5 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {(["all", "activated", "claimed", "expired"] as CouponStatus[]).map((status) => (
            <button
              key={status}
              className={`px-4 py-2 rounded-full text-xs whitespace-nowrap transition-colors ${
                activeFilter === status
                  ? "bg-blue-600 text-white"
                  : "bg-[#1a1a2e] text-slate-400 hover:text-white"
              }`}
              onClick={() => {
                setActiveFilter(status);
                setCurrentPage(1);
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
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
        ) : coupons.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {coupons.map((coupon) => (
                <motion.div
                  key={coupon.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
                    <div className="flex items-start gap-3 mb-3">
                      {coupon.qr_code ? (
                        <div className="w-16 h-16 rounded-lg bg-white p-1 flex items-center justify-center">
                          <QRCode
                            value={coupon.qr_code}
                            size={48}
                            level="H"
                            viewBox={`0 0 256 256`}
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

                    {/* Coupon Code */}
                    {coupon.coupon_code && (
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex-1 bg-slate-800/50 rounded-lg p-2">
                          <p className="text-white font-mono text-xs text-center truncate">
                            {coupon.coupon_code}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyCode(coupon.coupon_code, coupon.id)}
                          className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                        >
                          {copiedCouponId === coupon.id ? (
                            <Copy className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}

                    {/* CTA Button */}
                    {coupon.isCTAvalid && coupon.CTAredirect && (
                      <Button 
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs py-2 flex items-center justify-center gap-1"
                        onClick={() => handleCTAClick(coupon.CTAredirect)}
                      >
                        {coupon.CTAname || "Redeem Now"}
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between py-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-[#1a1a2e] border-slate-700/50 text-white"
                >
                  Previous
                </Button>
                <span className="text-slate-400 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-[#1a1a2e] border-slate-700/50 text-white"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <Card className="p-8 bg-[#1a1a2e] border border-slate-700/40 text-center">
            <Tag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">
              {activeFilter === "all" 
                ? "You don't have any coupons yet" 
                : `No ${activeFilter} coupons found`}
            </p>
            {activeFilter !== "all" && (
              <Button 
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm py-2"
                onClick={() => setActiveFilter("all")}
              >
                View All Coupons
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}