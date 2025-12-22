import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import pauketService from "../services/pauketService";
import { CampaignDetails } from "../types/pauketTypes";

interface CouponDetailsProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userId: string;
}

export function CouponDetails({ onBack, onNavigate, userId }: CouponDetailsProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [campaign, setCampaign] = useState<CampaignDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract source link from URL params
  const urlParams = new URLSearchParams(location.search);
  const sourceLink = urlParams.get('sourceLink');

  // Fetch campaign details when component mounts
  useEffect(() => {
    if (sourceLink) {
      fetchCampaignDetails(sourceLink);
    } else {
      setError("No campaign specified");
      setLoading(false);
    }
  }, [sourceLink]);

  const fetchCampaignDetails = async (link: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const details = await pauketService.getCampaignDetails(link, userId);
      setCampaign(details);
    } catch (err) {
      console.error("Failed to fetch campaign details:", err);
      setError("Failed to load campaign details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleActivateCoupon = async () => {
    if (!sourceLink) return;
    
    try {
      // Navigate to activation flow
      navigate(`/coupon-activate?sourceLink=${encodeURIComponent(sourceLink)}&userId=${userId}`);
    } catch (err) {
      console.error("Failed to activate coupon:", err);
      setError("Failed to activate coupon. Please try again.");
    }
  };

  if (!sourceLink) {
    return (
      <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
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
              Campaign Details
            </h1>
          </div>
        </div>
        <div className="px-5 py-8">
          <Card className="p-8 bg-[#1a1a2e] border border-slate-700/40 text-center">
            <p className="text-slate-400">No campaign specified</p>
          </Card>
        </div>
      </div>
    );
  }

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
            Offer Details
          </h1>
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
        ) : campaign ? (
          <div className="space-y-5">
            {/* Cover Image */}
            {campaign.cover_image && (
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={campaign.cover_image} 
                  alt={campaign.campaign_name}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Campaign Info */}
            <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
              <h2 className="text-white text-lg font-medium mb-2">{campaign.campaign_name}</h2>
              <p className="text-slate-300 text-sm mb-3">{campaign.merchant_name}</p>
              
              <div className="flex items-center gap-3 text-slate-400 text-sm mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Expires {new Date(campaign.expiry_date).toLocaleDateString()}</span>
                </div>
              </div>
              
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
                <p className="text-emerald-400 text-center font-medium">{campaign.offer_to_show}</p>
              </div>
            </Card>

            {/* How to Use */}
            {campaign.how_to_use && (
              <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
                <h3 className="text-white text-base font-medium mb-3">How to Use</h3>
                <div 
                  className="text-slate-300 text-sm prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: campaign.how_to_use }}
                />
              </Card>
            )}

            {/* Terms and Conditions */}
            {campaign.terms_and_conditions && (
              <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
                <h3 className="text-white text-base font-medium mb-3">Terms & Conditions</h3>
                <div 
                  className="text-slate-300 text-sm prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: campaign.terms_and_conditions }}
                />
              </Card>
            )}

            {/* Activate Button */}
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-base font-medium"
              onClick={handleActivateCoupon}
            >
              Activate Offer
            </Button>
          </div>
        ) : (
          <Card className="p-8 bg-[#1a1a2e] border border-slate-700/40 text-center">
            <Tag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
            <p className="text-slate-400">Campaign not found</p>
          </Card>
        )}
      </div>
    </div>
  );
}