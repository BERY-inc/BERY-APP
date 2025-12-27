import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Search, Calendar, Tag, MapPin } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate, useLocation } from "react-router-dom";
import pauketService from "../services/pauketService";
import { Campaign } from "../types/pauketTypes";

interface CouponCampaignsProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userId: string;
}

export function CouponCampaigns({ onBack, onNavigate, userId }: CouponCampaignsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Extract category ID from URL params
  const urlParams = new URLSearchParams(location.search);
  const categoryId = urlParams.get('categoryId') || undefined;

  // Fetch campaigns when component mounts or when filters change
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { campaigns, totalCount, totalPages } = await pauketService.getCampaigns({
          search: searchQuery || undefined,
          categoryId,
          custId: userId,
          page: currentPage
        });
        
        setCampaigns(campaigns);
        setTotalCount(totalCount);
        setTotalPages(totalPages);
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
        setError("Failed to load campaigns. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, [categoryId, searchQuery, currentPage, userId]);

  const handleCampaignClick = (sourceLink: string) => {
    // Navigate to campaign details screen
    navigate(`/coupon-details?sourceLink=${encodeURIComponent(sourceLink)}`);
  };

  const handleActivateCoupon = async (sourceLink: string) => {
    try {
      // Navigate to activation flow
      navigate(`/coupon-activate?sourceLink=${encodeURIComponent(sourceLink)}`);
    } catch (err) {
      console.error("Failed to activate coupon:", err);
      setError("Failed to activate coupon. Please try again.");
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
            {categoryId ? "Category Offers" : "All Offers"}
          </h1>
        </div>
        <p className="text-blue-200/80 text-sm">
          {totalCount > 0 ? `${totalCount} offers available` : "Discover amazing deals"}
        </p>
      </div>

      {/* Search Bar */}
      <div className="px-5 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search offers..."
            className="w-full pl-10 pr-4 py-3 bg-[#1a1a2e] border border-slate-700/50 rounded-xl text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
        ) : campaigns.length > 0 ? (
          <>
            <div className="space-y-4 mb-6">
              {campaigns.map((campaign) => (
                <motion.div
                  key={campaign.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card 
                    className="p-4 bg-[#1a1a2e] border border-slate-700/40 hover:border-blue-500/50 cursor-pointer transition-all"
                    onClick={() => handleCampaignClick(campaign.source_link)}
                  >
                    <div className="flex gap-3">
                      {campaign.thumbnail ? (
                        <img 
                          src={campaign.thumbnail} 
                          alt={campaign.campaign_name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <Tag className="w-8 h-8 text-blue-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white text-sm font-medium mb-1 truncate">{campaign.campaign_name}</h3>
                        <p className="text-slate-300 text-xs mb-1 truncate">{campaign.merchant_name}</p>
                        <p className="text-emerald-400 text-xs font-medium mb-2">{campaign.offer_to_show}</p>
                        <div className="flex items-center gap-3 text-slate-400 text-xs">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Expires {new Date(campaign.expiry_date).toLocaleDateString()}</span>
                          </div>
                          {campaign.category_name && (
                            <span className="px-2 py-0.5 bg-slate-700/50 rounded text-xs">
                              {campaign.category_name}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs py-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleActivateCoupon(campaign.source_link);
                      }}
                    >
                      Get Offer
                    </Button>
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
            <p className="text-slate-400">No offers found</p>
            {searchQuery && (
              <Button 
                className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm py-2"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}