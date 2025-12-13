import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ArrowLeft, Search, Star, ShoppingBag, ShoppingCart, Briefcase, Smartphone, Palette, Code, Video, Music, Zap, Package, Clock, MapPin, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";
import { Haptics, NotificationType } from "@capacitor/haptics";
import { EmptyState } from "./EmptyState";
import itemService from '../services/itemService';
import storeService, { Store } from '../services/storeService';
import metadataService, { Zone, Module } from '../services/metadataService';
import { ZoneMapSelector } from "./ZoneMapSelector";

interface MarketplaceProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onProductClick: (product: any, isService: boolean) => void;
  cartItemCount?: number;
}

export function Marketplace({ onBack, onNavigate, onProductClick, cartItemCount = 0 }: MarketplaceProps) {
  const [selectedTab, setSelectedTab] = useState<"products" | "services">("products");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [products, setProducts] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  // Metadata state
  const [zones, setZones] = useState<Zone[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedZoneId, setSelectedZoneId] = useState<number | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [showZoneMap, setShowZoneMap] = useState(false);

  // Helper: set header to All Zones and clear local selection
  const setAllZonesHeader = () => {
    if (zones.length > 0) {
      const zoneIds = zones.map(z => z.id);
      try { localStorage.setItem('zoneId', JSON.stringify(zoneIds)); } catch {}
      setSelectedZoneId(null);
    }
  };
  // NEW: Store selection state
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(() => {
    const ls = localStorage.getItem('storeId');
    return ls ? Number(ls) : null;
  });
  // NEW: Dynamic product categories based on fetched products
  const [dynamicProductCategories, setDynamicProductCategories] = useState<{ id: string; name: string }[]>([{ id: 'all', name: 'All' }]);

  // Fetch Zones and set default to ALL zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        console.log("Fetching zones...");
        const zonesData = await metadataService.getZones();
        console.log("Zones fetched:", zonesData);
        setZones(Array.isArray(zonesData) ? zonesData : []);

        // Extract all zone IDs and set as default
        const zoneIds = Array.isArray(zonesData) ? zonesData.map(z => z.id) : [];

        // Check if user has a stored zone preference
        const storedZone = localStorage.getItem('zoneId');
        if (storedZone) {
          console.log("Using stored zone:", storedZone);
          // Don't set selectedZoneId for display, but keep it in localStorage
        } else if (zoneIds.length > 0) {
          // Default: Set all zones in localStorage as JSON array
          console.log("Setting default zones:", zoneIds);
          localStorage.setItem('zoneId', JSON.stringify(zoneIds));
        }
      } catch (error) {
        console.error('Error fetching zones:', error);
      }
    };
    fetchZones();
  }, []);

  // Fetch Modules and default to Grocery
  useEffect(() => {
    const fetchModules = async () => {
      try {
        console.log("Fetching modules...");
        const modulesData = await metadataService.getModules();
        console.log("Modules fetched:", modulesData);
        setModules(Array.isArray(modulesData) ? modulesData : []);

        // Find and set Grocery module as default
        if (Array.isArray(modulesData) && modulesData.length > 0) {
          const storedModule = localStorage.getItem('moduleId');

          if (storedModule && modulesData.find((m: Module) => m.id === Number(storedModule))) {
            console.log("Using stored module:", storedModule);
            setSelectedModuleId(Number(storedModule));
          } else {
            // Default to Grocery module
            const grocery = modulesData.find(m => m.module_name.toLowerCase() === 'grocery');
            const defaultModule = grocery || modulesData[0];
            console.log("Setting default module (Grocery):", defaultModule);
            setSelectedModuleId(defaultModule.id);
            localStorage.setItem('moduleId', defaultModule.id.toString());
          }
        }
      } catch (error) {
        console.error('Error fetching modules:', error);
      }
    };
    fetchModules();
  }, []);

  // Fetch Data (Products & Stores) when module is ready
  useEffect(() => {
    if (!selectedModuleId) {
      console.log("Waiting for module to be set...");
      return;
    }

    // Ensure zoneId header exists before fetching
    const storedZone = localStorage.getItem('zoneId');
    if (!storedZone && zones.length > 0) {
      const zoneIds = zones.map(z => z.id);
      try {
        localStorage.setItem('zoneId', JSON.stringify(zoneIds));
        console.log('Default zoneId set from zones list:', zoneIds);
      } catch {}
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching data - Module: ${selectedModuleId}`);

        let [productData, storeData] = await Promise.all([
          itemService.getLatestProducts({
            store_id: selectedStoreId ?? undefined,
            category_id: selectedCategory !== 'all' && !Number.isNaN(Number(selectedCategory)) ? Number(selectedCategory) : 0,
            limit: 20,
            offset: 0,
          }),
          storeService.getLatestStores()
        ]);

        // Fallback: if no stores for selected zone, switch to All Zones and refetch once
        if (Array.isArray(storeData) && storeData.length === 0 && zones.length > 0) {
          console.warn('No stores in selected zone. Falling back to All Zones.');
          setAllZonesHeader();
          [productData, storeData] = await Promise.all([
            itemService.getLatestProducts({
              store_id: selectedStoreId ?? undefined,
              category_id: selectedCategory !== 'all' && !Number.isNaN(Number(selectedCategory)) ? Number(selectedCategory) : 0,
              limit: 20,
              offset: 0,
            }),
            storeService.getLatestStores()
          ]);
        }
        console.log("Products fetched:", productData);
        console.log("Stores fetched:", storeData);

        const transformedProducts = Array.isArray(productData) ? productData.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: `₿ ${product.price}`,
          usdPrice: `$${(product.price * 6.5).toFixed(2)}`,
          rating: product.avg_rating || 4.5,
          reviews: product.rating_count || 100,
          category: product.category_id ? product.category_id.toString() : "uncategorized",
          seller: product.store_name || "Store Name",
          image: product.image,
        })) : [];

        console.log("Transformed products:", transformedProducts);
        setProducts(transformedProducts);
        setStores(Array.isArray(storeData) ? storeData : []);

        // Guard: if selected store is invalid for current context, reset to first
        if (Array.isArray(storeData) && storeData.length > 0) {
          const hasSelected = selectedStoreId ? storeData.some(s => Number(s.id) === Number(selectedStoreId)) : false;
          if (!hasSelected) {
            const defaultStoreId = Number(storeData[0].id);
            setSelectedStoreId(defaultStoreId);
            try { localStorage.setItem('storeId', String(defaultStoreId)); } catch {}
          }
        }

        // NEW: Init dynamic categories from transformed products
        const uniqueCats = Array.from(new Set(transformedProducts.map(p => p.category))).filter(Boolean);
        setDynamicProductCategories([
          { id: 'all', name: 'All' },
          ...uniqueCats.map(c => ({ id: c, name: c === 'uncategorized' ? 'Uncategorized' : `Category ${c}` }))
        ]);

        // NEW: Initialize selected store from list if not set
        if (!selectedStoreId && Array.isArray(storeData) && storeData.length > 0) {
          const defaultStoreId = Number(storeData[0].id);
          setSelectedStoreId(defaultStoreId);
          try { localStorage.setItem('storeId', String(defaultStoreId)); } catch {}
        }

        const serviceData = [
          {
            id: 1,
            name: "Logo Design & Branding",
            price: "From ₿ 15",
            usdPrice: "From $100",
            rating: 5.0,
            reviews: 342,
            category: "design",
            seller: "DesignMaster",
            deliveryDays: 3,
            icon: Palette,
          },
          {
            id: 2,
            name: "Mobile App Development",
            price: "From ₿ 150",
            usdPrice: "From $1,000",
            rating: 4.9,
            reviews: 156,
            category: "development",
            seller: "CodePro",
            deliveryDays: 14,
            icon: Smartphone,
          },
          {
            id: 3,
            name: "Video Editing Services",
            price: "From ₿ 22",
            usdPrice: "From $150",
            rating: 4.8,
            reviews: 234,
            category: "marketing",
            seller: "VideoExpert",
            deliveryDays: 5,
            icon: Video,
          },
          {
            id: 4,
            name: "Website Development",
            price: "From ₿ 75",
            usdPrice: "From $500",
            rating: 5.0,
            reviews: 289,
            category: "development",
            seller: "WebWizard",
            deliveryDays: 7,
            icon: Code,
          },
          {
            id: 5,
            name: "Social Media Marketing",
            price: "From ₿ 30",
            usdPrice: "From $200",
            rating: 4.7,
            reviews: 445,
            category: "marketing",
            seller: "MarketGuru",
            deliveryDays: 30,
            icon: Zap,
          },
          {
            id: 6,
            name: "Music Production",
            price: "From ₿ 45",
            usdPrice: "From $300",
            rating: 4.9,
            reviews: 167,
            category: "design",
            seller: "SoundStudio",
            deliveryDays: 10,
            icon: Music,
          },
        ];

        setServices(serviceData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setProducts([]);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedModuleId, zones]);

  // NEW: Refetch products when store or category changes (with module ready)
  useEffect(() => {
    const refetchProducts = async () => {
      if (!selectedModuleId) return;
      try {
        setLoading(true);
        const productData = await itemService.getLatestProducts({
          store_id: selectedStoreId ?? undefined,
          category_id: selectedCategory !== 'all' && !Number.isNaN(Number(selectedCategory)) ? Number(selectedCategory) : 0,
          limit: 20,
          offset: 0,
        });
        const transformedProducts = Array.isArray(productData) ? productData.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: `₿ ${product.price}`,
          usdPrice: `$${(product.price * 6.5).toFixed(2)}`,
          rating: product.avg_rating || 4.5,
          reviews: product.rating_count || 100,
          category: product.category_id ? product.category_id.toString() : "uncategorized",
          seller: product.store_name || "Store Name",
          image: product.image,
        })) : [];

        // Fallback: if no products with selected zone, switch to All Zones and refetch once
        if (transformedProducts.length === 0 && zones.length > 0) {
          console.warn('No products in selected zone. Falling back to All Zones.');
          setAllZonesHeader();
          productData = await itemService.getLatestProducts({
            store_id: selectedStoreId ?? undefined,
            category_id: selectedCategory !== 'all' && !Number.isNaN(Number(selectedCategory)) ? Number(selectedCategory) : 0,
            limit: 20,
            offset: 0,
          });
          transformedProducts = Array.isArray(productData) ? productData.map((product: any) => ({
            id: product.id,
            name: product.name,
            price: `₿ ${product.price}`,
            usdPrice: `$${(product.price * 6.5).toFixed(2)}`,
            rating: product.avg_rating || 4.5,
            reviews: product.rating_count || 100,
            category: product.category_id ? product.category_id.toString() : "uncategorized",
            seller: product.store_name || "Store Name",
            image: product.image,
          })) : [];
        }
        setProducts(transformedProducts);
        // Update dynamic categories on refetch
        const uniqueCats = Array.from(new Set(transformedProducts.map(p => p.category))).filter(Boolean);
        setDynamicProductCategories([
          { id: 'all', name: 'All' },
          ...uniqueCats.map(c => ({ id: c, name: c === 'uncategorized' ? 'Uncategorized' : `Category ${c}` }))
        ]);
      } catch (error) {
        console.error('Error refetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    refetchProducts();
  }, [selectedStoreId, selectedCategory, selectedModuleId]);

  const handleZoneChange = (id: number) => {
    setSelectedZoneId(id);
    try { localStorage.setItem('zoneId', JSON.stringify([id])); } catch {}
  };

  const handleModuleChange = (id: number) => {
    setSelectedModuleId(id);
    localStorage.setItem('moduleId', id.toString());
  };

  const productCategories = [
    { id: "all", name: "All" },
    { id: "electronics", name: "Electronics" },
    { id: "home", name: "Home" },
    { id: "fashion", name: "Fashion" },
  ];

  const serviceCategories = [
    { id: "all", name: "All" },
    { id: "design", name: "Design" },
    { id: "development", name: "Development" },
    { id: "marketing", name: "Marketing" },
  ];

  const currentCategories = selectedTab === "products" ? productCategories : serviceCategories;
  const currentItems = selectedTab === "products" ? products : services;

  let filteredItems = selectedCategory === "all"
    ? currentItems
    : currentItems.filter(item => item.category === selectedCategory);

  if (searchQuery.trim()) {
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const handleItemClick = (item: any) => {
    const enhancedItem = {
      ...item,
      description: selectedTab === "products"
        ? `High-quality ${item.name} from ${item.seller}. This product offers exceptional value and performance, backed by our buyer protection guarantee.`
        : `Professional ${item.name} service provided by ${item.seller}. Delivered with attention to detail and quality assurance.`,
      features: selectedTab === "products"
        ? [
          "Premium quality materials",
          "1-year warranty included",
          "Free shipping available",
          "Buyer protection guarantee",
          "Authentic product verification"
        ]
        : [
          "Expert professional service",
          `${(item as any).deliveryDays}-day delivery`,
          "Unlimited revisions",
          "Money-back guarantee",
          "24/7 customer support"
        ],
      images: selectedTab === "products" ? [item.image, item.image, item.image] : []
    };
    try { Haptics.notification({ type: NotificationType.Success }); } catch { }
    onProductClick(enhancedItem, selectedTab === "services");
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-32">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] px-5 pt-14 pb-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex flex-col">
              <h1 className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                Marketplace
              </h1>
              {/* Zone Selector Trigger - Optional */}
              {zones.length > 0 && (
                <div
                  className="flex items-center gap-1 text-xs text-blue-200 cursor-pointer"
                  onClick={() => setShowZoneMap(true)}
                >
                  <MapPin className="w-3 h-3" />
                  <span>
                    {selectedZoneId
                      ? zones.find(z => z.id === selectedZoneId)?.name
                      : "All Zones"}
                  </span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              )}
              {/* NEW: Store selector */}
              {stores.length > 0 && (
                <div className="mt-1">
                  <select
                    value={selectedStoreId ?? ''}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      setSelectedStoreId(id);
                      try { localStorage.setItem('storeId', String(id)); } catch {}
                    }}
                    className="bg-white/10 border-white/20 text-white text-xs px-2 py-1 rounded-lg"
                  >
                    <option value="" disabled>Select Store</option>
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch { }; onNavigate("orders"); }}
              className="text-white hover:bg-white/20 rounded-full relative"
            >
              <Package className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch { }; onNavigate("shopping-cart"); }}
              className="text-white hover:bg-white/20 rounded-full relative"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Zone Map Modal */}
        <AnimatePresence>
          {showZoneMap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[#1a1a2e] w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-slate-700"
              >
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                  <h3 className="text-white font-bold">Select Your Zone</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowZoneMap(false)} className="text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
                <div className="p-0">
                  <ZoneMapSelector
                    zones={zones}
                    selectedZoneId={selectedZoneId}
                    onZoneSelect={handleZoneChange}
                    onClose={() => setShowZoneMap(false)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Module Selector (Tabs style) */}
        {modules.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
            {modules.map(module => (
              <button
                key={module.id}
                onClick={() => handleModuleChange(module.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${selectedModuleId === module.id
                    ? 'bg-white text-blue-900'
                    : 'bg-white/10 text-blue-100 hover:bg-white/20'
                  }`}
              >
                {module.module_name}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products & services..."
            className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-2">
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => {
              setSelectedTab("products");
              setSelectedCategory("all");
            }}
            className={`flex-1 py-3 rounded-xl text-sm transition-all ${selectedTab === "products"
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
              : 'bg-[#1a1a2e] text-slate-300 border border-slate-700/40'
              }`}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Products
          </button>
          <button
            onClick={() => {
              setSelectedTab("services");
              setSelectedCategory("all");
            }}
            className={`flex-1 py-3 rounded-xl text-sm transition-all ${selectedTab === "services"
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
              : 'bg-[#1a1a2e] text-slate-300 border border-slate-700/40'
              }`}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
          >
            <Briefcase className="w-4 h-4 inline mr-2" />
            Services
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {currentCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === category.id
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/30'
                : 'bg-[#1a1a2e] text-slate-300 border border-slate-700/40 hover:border-blue-600/40'
                }`}
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Featured Banner */}
        {selectedCategory === "all" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <div
              className="relative rounded-3xl p-6 shadow-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
              }}
            >
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <Badge className="bg-yellow-400/20 text-yellow-300 border-0">
                    Featured
                  </Badge>
                </div>
                <h2 className="text-2xl text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                  {selectedTab === "products" ? "Hot Deals Today" : "Top Freelancers"}
                </h2>
                <p className="text-blue-100 text-sm mb-4">
                  {selectedTab === "products"
                    ? "Up to 50% off on selected items"
                    : "Hire expert professionals with ₿ Bery"}
                </p>
                <Button className="bg-white text-blue-700 hover:bg-blue-50">
                  Explore Now
                </Button>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            </div>
          </motion.div>
        )}

        {/* Featured Stores */}
        {selectedTab === "products" && stores.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                Featured Stores
              </h2>
              <button className="text-xs text-blue-400">See All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {stores.map((store) => (
                <div
                  key={store.id}
                  className={`min-w-[260px] bg-[#1a1a2e] rounded-xl overflow-hidden border transition-colors ${selectedStoreId === store.id ? 'border-blue-500' : 'border-slate-700/40'} cursor-pointer`}
                  onClick={() => {
                    setSelectedStoreId(Number(store.id));
                    try { localStorage.setItem('storeId', String(store.id)); } catch {}
                  }}
                >
                  <div className="h-28 bg-slate-800 relative">
                    <img
                      src={`https://market.bery.in/storage/app/public/store/cover/${store.cover_photo}`}
                      alt={store.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/260x112?text=Store';
                      }}
                    />
                    <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-white flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      {store.avg_rating.toFixed(1)}
                    </div>
                  </div>
                  <div className="p-3">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-white truncate">{store.name}</h3>
                      {store.delivery_time && (
                        <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3" />
                          {store.delivery_time}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-2 truncate">
                      <MapPin className="w-3 h-3" />
                      {store.address}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full border border-blue-800/30">
                        Free Delivery
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              {selectedTab === "products" ? "Products" : "Services"}
            </h2>
            <span className="text-xs text-slate-400">{filteredItems.length} items</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
              <p className="text-slate-400 text-sm">Loading {modules.find(m => m.id === selectedModuleId)?.module_name || 'Grocery'} products...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <EmptyState
              type="search"
              onAction={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
            />
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.slice(0, visibleCount).map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                >
                  <Card
                    onClick={() => handleItemClick(item)}
                    className="p-3 bg-[#1a1a2e] border border-slate-700/40 hover:border-blue-600/40 transition-all cursor-pointer hover:shadow-lg hover:shadow-blue-600/10 active:scale-95 h-full flex flex-col"
                  >
                    {selectedTab === "products" ? (
                      <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 flex items-center justify-center mb-3 overflow-hidden relative">
                        {item.image && item.image !== "📦" ? (
                          <img
                            src={`https://market.bery.in/storage/app/public/product/${item.image}`}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <span className={`text-5xl ${item.image && item.image !== "📦" ? 'hidden' : ''}`}>📦</span>
                      </div>
                    ) : (
                      <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-3">
                        {(() => {
                          const Icon = (item as any).icon;
                          return Icon ? <Icon className="w-12 h-12 text-white" /> : <Briefcase className="w-12 h-12 text-white" />;
                        })()}
                      </div>
                    )}

                    <div className="mb-2 flex-1">
                      <p className="text-sm text-white mb-1 line-clamp-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400/80">{item.seller}</p>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-slate-300">{item.rating}</span>
                      <span className="text-xs text-slate-500">({item.reviews})</span>
                    </div>

                    {selectedTab === "services" && (item as any).deliveryDays && (
                      <p className="text-xs text-slate-400 mb-2">
                        {(item as any).deliveryDays} day delivery
                      </p>
                    )}

                    <div className="mt-auto">
                      <p className="text-sm text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        {item.price}
                      </p>
                      <p className="text-xs text-slate-400">{item.usdPrice}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          {filteredItems.length > visibleCount && (
            <div className="flex justify-center mt-4">
              <Button
                className="h-10 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setVisibleCount(c => c + 6)}
              >
                Load More
              </Button>
            </div>
          )}
        </div>

        {/* Why Shop with Bery */}
        {filteredItems.length > 0 && (
          <div className="mb-6">
            <h2 className="text-base text-white mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
              Why Shop with Bery
            </h2>
            <div className="space-y-3">
              <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600/20 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Pay with Bery or USD
                    </p>
                    <p className="text-xs text-slate-400/80">Seamless payments with your Bery wallet</p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-white mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                      Fast & Secure
                    </p>
                    <p className="text-xs text-slate-400/80">Buyer protection on all purchases</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>

      <BottomNavigation currentScreen="marketplace" onNavigate={onNavigate} cartItemCount={cartItemCount} />
    </div>
  );
}
