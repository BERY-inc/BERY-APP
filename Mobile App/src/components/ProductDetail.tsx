import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { ArrowLeft, Star, ShoppingCart, Shield, Truck, RefreshCw, Heart, Image as ImageIcon } from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import { Haptics, NotificationType } from "@capacitor/haptics";

interface ProductData {
  id: number;
  name: string;
  price: string;
  usdPrice: string;
  rating: number;
  reviews: number;
  seller: string;
  image?: string;
  icon?: any;
  category: string;
  deliveryDays?: number;
  description: string;
  features: string[];
  images: string[];
}

interface ProductDetailProps {
  product: ProductData;
  onBack: () => void;
  isService?: boolean;
  onAddToCart: (product: ProductData, quantity: number) => void;
  onBuyNow: (product: ProductData, quantity: number) => void;
}

export function ProductDetail({ product, onBack, isService = false, onAddToCart, onBuyNow }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  const getImageUrl = (image: any) => {
    if (!image || image === "📦") return null;
    const imgStr = String(image);
    if (imgStr.startsWith('http') || imgStr.startsWith('//')) return imgStr;
    const cleanPath = imgStr.startsWith('/') ? imgStr.slice(1) : imgStr;
    return `https://market.bery.in/storage/app/public/product/${cleanPath}`;
  };

  const handleAddToCart = () => {
    try { Haptics.notification({ type: NotificationType.Success }); } catch {}
    onAddToCart(product, quantity);
    toast.success("Added to cart!", {
      description: `${quantity}x ${product.name}`,
    });
  };

  const handleBuyNow = () => {
    try { Haptics.notification({ type: NotificationType.Success }); } catch {}
    onBuyNow(product, quantity);
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
      {/* Header */}
      <div className="bg-[#1a1d24] px-5 pt-14 pb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="text-white hover:bg-slate-800/50 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
          {isService ? "Service Details" : "Product Details"}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFavorite(!isFavorite)}
          className="text-white hover:bg-slate-800/50 rounded-full"
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>

      {/* Product Images */}
      <div className="px-5 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full aspect-square rounded-3xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 flex items-center justify-center mb-4 overflow-hidden">
            {isService ? (
              <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
                {product.icon && (() => {
                  const Icon = product.icon;
                  return <Icon className="w-24 h-24 text-white" />;
                })()}
              </div>
            ) : (
              (() => {
                const imgToShow = product.images && product.images.length > 0 
                  ? product.images[selectedImage] 
                  : product.image;
                const finalUrl = getImageUrl(imgToShow);
                return finalUrl ? (
                   <img src={finalUrl} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                   <ImageIcon className="w-32 h-32 text-white/50" />
                );
              })()
            )}
          </div>

          {/* Image Thumbnails for Products */}
          {!isService && product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-16 h-16 rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 flex items-center justify-center flex-shrink-0 transition-all overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {getImageUrl(img) ? (
                    <img src={getImageUrl(img)!} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-white/50" />
                  )}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <div className="px-5">
        {/* Product Info */}
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-xl text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                {product.name}
              </h2>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    {product.rating}
                  </span>
                  <span className="text-sm text-slate-400">({product.reviews} reviews)</span>
                </div>
                {isService && product.deliveryDays && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-0">
                    {product.deliveryDays} day delivery
                  </Badge>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-3xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
              {product.price}
            </p>
            <p className="text-base text-slate-400">{product.usdPrice}</p>
          </div>

          {/* Seller Info */}
          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 border-2 border-slate-700/50">
                  <AvatarFallback>{product.seller[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                    {product.seller}
                  </p>
                  <p className="text-xs text-slate-400">Verified Seller</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="bg-transparent border-slate-600/40 text-blue-400 hover:bg-slate-800/50">
                View Store
              </Button>
            </div>
          </Card>
        </div>

        {/* Description */}
        <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40 mb-4">
          <h3 className="text-sm text-white mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
            Description
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>
        </Card>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40 mb-4">
            <h3 className="text-sm text-white mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              {isService ? "What's Included" : "Features"}
            </h3>
            <div className="space-y-2">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                  <p className="text-sm text-slate-300">{feature}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Benefits */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="p-3 bg-[#1a1a2e] border border-slate-700/40 text-center">
            <Shield className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300">Buyer Protection</p>
          </Card>
          <Card className="p-3 bg-[#1a1a2e] border border-slate-700/40 text-center">
            <Truck className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300">Fast Delivery</p>
          </Card>
          <Card className="p-3 bg-[#1a1a2e] border border-slate-700/40 text-center">
            <RefreshCw className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-xs text-slate-300">Easy Returns</p>
          </Card>
        </div>

        {/* Quantity Selector (for products only) */}
        {!isService && (
          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 mb-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Quantity
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-white transition-colors"
                >
                  -
                </button>
                <span className="text-base text-white w-8 text-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 flex items-center justify-center text-white transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={handleAddToCart}
            variant="outline"
            className="flex-1 h-14 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Add to Cart
          </Button>
          <Button
            onClick={handleBuyNow}
            className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
