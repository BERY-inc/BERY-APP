import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, CheckCircle, QrCode, Copy, ExternalLink } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import QRCode from "react-qr-code";
import pauketService from "../services/pauketService";
import { Coupon } from "../types/pauketTypes";

interface CouponSuccessProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  userId: string;
}

export function CouponSuccess({ onBack, onNavigate, userId }: CouponSuccessProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [merchantLogo, setMerchantLogo] = useState<string>("");
  const [offer, setOffer] = useState<string>("");
  const [redirectUrl, setRedirectUrl] = useState<string>("");
  const [couponCode, setCouponCode] = useState<string>("");
  const [isCTAValid, setIsCTAValid] = useState<boolean>(false);
  const [ctaName, setCtaName] = useState<string>("");
  const [ctaRedirect, setCtaRedirect] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Extract source link from URL params
  const urlParams = new URLSearchParams(location.search);
  const sourceLink = urlParams.get('sourceLink');

  // Activate coupon when component mounts
  useEffect(() => {
    const activateCoupon = async (link: string) => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await pauketService.activateCoupon(link, userId);
        setCoupons(result.coupons);
        setMerchantLogo(result.merchantLogo);
        setOffer(result.offer);
        setRedirectUrl(result.redirectUrl);
        setCouponCode(result.couponCode);
        setIsCTAValid(result.isCTAValid);
        setCtaName(result.CTAName);
        setCtaRedirect(result.CTARedirect);
      } catch (err) {
        console.error("Failed to activate coupon:", err);
        setError("Failed to activate coupon. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (sourceLink) {
      activateCoupon(sourceLink);
    } else {
      setError("No coupon specified");
      setLoading(false);
    }
  }, [sourceLink, userId]);

  const handleCopyCode = () => {
    if (couponCode) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCTAClick = () => {
    if (ctaRedirect) {
      window.open(ctaRedirect, '_blank');
    }
  };

  const handleViewMyCoupons = () => {
    navigate('/my-coupons');
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
              Activate Offer
            </h1>
          </div>
        </div>
        <div className="px-5 py-8">
          <Card className="p-8 bg-[#1a1a2e] border border-slate-700/40 text-center">
            <p className="text-slate-400">No coupon specified</p>
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
            Offer Activated
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
        ) : (
          <div className="space-y-6">
            {/* Success Message */}
            <Card className="p-6 bg-[#1a1a2e] border border-slate-700/40 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-white text-xl font-medium mb-2">Offer Activated!</h2>
              <p className="text-slate-300 text-sm">
                Your offer is now ready to use
              </p>
            </Card>

            {/* Merchant Info */}
            {merchantLogo && (
              <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
                <div className="flex items-center gap-3">
                  <img 
                    src={merchantLogo} 
                    alt="Merchant"
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-white text-sm font-medium">{offer}</h3>
                  </div>
                </div>
              </Card>
            )}

            {/* Coupon Code */}
            {couponCode && (
              <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
                <h3 className="text-white text-sm font-medium mb-3">Your Coupon Code</h3>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-slate-800/50 rounded-lg p-3">
                    <p className="text-white font-mono text-center">{couponCode}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyCode}
                    className="text-slate-400 hover:text-white hover:bg-slate-700/50"
                  >
                    {copied ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </Card>
            )}

            {/* QR Code */}
            {coupons.length > 0 && coupons[0].qr_code && (
              <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
                <h3 className="text-white text-sm font-medium mb-3">QR Code</h3>
                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-lg">
                    <QRCode
                      value={coupons[0].qr_code}
                      size={128}
                      level="H"
                      viewBox={`0 0 256 256`}
                    />
                  </div>
                </div>
                <p className="text-slate-400 text-xs text-center mt-2">
                  Show this QR code at checkout
                </p>
              </Card>
            )}

            {/* Expiry */}
            {coupons.length > 0 && coupons[0].expiry_date && (
              <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-sm">Expires on</span>
                  <span className="text-white text-sm font-medium">
                    {new Date(coupons[0].expiry_date).toLocaleDateString()}
                  </span>
                </div>
              </Card>
            )}

            {/* CTA Button */}
            {isCTAValid && ctaRedirect && (
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-base font-medium flex items-center justify-center gap-2"
                onClick={handleCTAClick}
              >
                {ctaName || "Redeem Now"}
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="flex-1 bg-[#1a1a2e] border-slate-700/50 text-white"
                onClick={onBack}
              >
                Back to Offers
              </Button>
              <Button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                onClick={handleViewMyCoupons}
              >
                My Coupons
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}