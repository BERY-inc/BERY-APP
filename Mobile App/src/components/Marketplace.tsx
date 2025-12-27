import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ArrowLeft, Search, Star, ShoppingBag, ShoppingCart, Briefcase, Smartphone, Palette, Code, Video, Music, Zap, Package, Clock, MapPin, ChevronDown, X, ShoppingBasket, Pill, Laptop, Utensils, Home, Sparkles, Truck, Store as StoreIcon, Apple, Shield, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";
import { Haptics, NotificationType } from "@capacitor/haptics";
import { EmptyState } from "./EmptyState";
import itemService from '../services/itemService';
import storeService, { Store } from '../services/storeService';
import metadataService, { Zone, Module } from '../services/metadataService';
import { getStorageUrl } from '../services/supabaseClient';
import { ZoneMapSelector } from "./ZoneMapSelector";

interface MarketplaceProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onProductClick: (product: any, isService: boolean) => void;
  cartItemCount?: number;
}

export function Marketplace({ onBack, onNavigate, onProductClick, cartItemCount = 0 }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
  const [products, setProducts] = useState<any[]>([]);
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
      try { localStorage.setItem('zoneId', JSON.stringify(zoneIds)); } catch { }
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

  // Featured stores state
  const [featuredStores, setFeaturedStores] = useState<any[]>([]);


  // Fetch Zones and set default to ALL zones
  useEffect(() => {
    const fetchZones = async () => {
      try {
        const zonesData = await metadataService.getZones();
        setZones(Array.isArray(zonesData) ? zonesData : []);

        // Extract all zone IDs and set as default
        const zoneIds = Array.isArray(zonesData) ? zonesData.map(z => z.id) : [];

        // Check if user has a stored zone preference
        const storedZone = localStorage.getItem('zoneId');
        if (storedZone) {
          // Don't set selectedZoneId for display, but keep it in localStorage
        } else if (zoneIds.length > 0) {
          // Default: Set all zones in localStorage as JSON array
          localStorage.setItem('zoneId', JSON.stringify(zoneIds));
        }
      } catch (error) {
      }
    };
    fetchZones();
  }, []);

  // Fetch Modules and default to Grocery
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const modulesData = await metadataService.getModules();
        setModules(Array.isArray(modulesData) ? modulesData : []);

        // Find and set Grocery module as default
        if (Array.isArray(modulesData) && modulesData.length > 0) {
          const storedModule = localStorage.getItem('moduleId');

          if (storedModule && modulesData.find((m: Module) => m.id === Number(storedModule))) {
            setSelectedModuleId(Number(storedModule));
          } else {
            // Default to Grocery module
            const grocery = modulesData.find(m => m.module_name.toLowerCase() === 'grocery');
            const defaultModule = grocery || modulesData[0];
            setSelectedModuleId(defaultModule.id);
            localStorage.setItem('moduleId', defaultModule.id.toString());
          }
        }
      } catch (error) {
      }
    };
    fetchModules();
  }, []);

  // Fetch Featured Stores
  // Fetch Featured Stores
  useEffect(() => {
    const fetchFeaturedStores = async () => {
      // Check if we have a zone selected (either in localStorage or from zones state)
      const storedZone = localStorage.getItem('zoneId');
      if (!storedZone && zones.length === 0) {
         // If no zone is stored and we haven't fetched zones yet, wait.
         return;
      }

      try {
        const fetchOptions = selectedModuleId ? { moduleId: selectedModuleId } : {};

        // Pass fetchOptions which include moduleId if selected
        let storeData = await storeService.getPopularStores('all', fetchOptions);

        if (!storeData || storeData.length === 0) {
          try {
            storeData = await storeService.getLatestStores({ limit: 10, offset: 0, ...fetchOptions });
          } catch { }
        }

        // Transform store data to match UI structure
        const transformedStores = storeData.map((store: any) => ({
          id: store.id.toString(),
          name: store.name,
          description: store.address || 'Popular store',
          rating: store.avg_rating || 4.5,
          reviews: store.rating_count || 100,
          image: store.logo ? getStorageUrl(store.logo, 'store') : '🏪',
          verified: store.approved === 1,
          badge: store.featured === 1 ? 'Featured' : store.rating_count > 1000 ? 'Top Rated' : 'New',
          products: `${store.items_count || 0} items`
        }));

        if (transformedStores.length > 0) {
          setFeaturedStores(transformedStores.slice(0, 5)); // Show up to 5 stores
        } else {
          setFeaturedStores([]);
        }
      } catch (error) {
      }
    };

    fetchFeaturedStores();
  }, [selectedModuleId, zones]);

  // Fetch Data (Products & Stores) when module is ready
  useEffect(() => {
    if (!selectedModuleId) {
      return;
    }

    // Ensure zoneId header exists before fetching
    const storedZone = localStorage.getItem('zoneId');
    if (!storedZone) {
       if (zones.length > 0) {
          const zoneIds = zones.map(z => z.id);
          try {
            localStorage.setItem('zoneId', JSON.stringify(zoneIds));
          } catch { }
       } else {
          // If no stored zone and no zones fetched yet, wait
          return;
       }
    }

    const fetchData = async () => {
      try {
        setLoading(true);

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

        const transformedProducts = Array.isArray(productData) ? productData.map((product: any) => {
          const primaryImage = product.image_full_url || product.image;
          const images = Array.isArray(product.images)
            ? product.images
            : (primaryImage ? [primaryImage] : []);

          return {
            id: product.id,
            name: product.name,
            price: `₿ ${product.price}`,
            actual_price: product.price,
            usdPrice: `$${(product.price * 8.9).toFixed(2)}`,
            rating: product.avg_rating || 4.5,
            reviews: product.rating_count || 100,
            category: product.category_id ? product.category_id.toString() : "uncategorized",
            seller: product.store_name || "Store Name",
            image: primaryImage,
            images,
            description: product.description ?? "",
            store_id: product.store_id,
            module_id: product.module_id,
          };
        }) : [];

        setProducts(transformedProducts);
        setStores(Array.isArray(storeData) ? storeData : []);

        // Guard: if selected store is invalid for current context, reset to first
        if (Array.isArray(storeData) && storeData.length > 0) {
          const hasSelected = selectedStoreId ? storeData.some(s => Number(s.id) === Number(selectedStoreId)) : false;
          // Guard: if selected store is invalid for current context, reset to NULL (All Stores)
          if (selectedStoreId && !hasSelected) {
            setSelectedStoreId(null);
            try { localStorage.removeItem('storeId'); } catch { }
          }
        }

        // NEW: Init dynamic categories from transformed products
        const uniqueCats = Array.from(new Set(transformedProducts.map(p => p.category))).filter(Boolean);
        setDynamicProductCategories([
          { id: 'all', name: 'All' },
          ...uniqueCats.map(c => ({ id: c, name: c === 'uncategorized' ? 'Uncategorized' : `Category ${c}` }))
        ]);

        // NEW: Initialize selected store from list if not set - REMOVED to allow "All Stores" view
        // if (!selectedStoreId && Array.isArray(storeData) && storeData.length > 0) { ... }
      } catch (error) {
        setProducts([]);
        setStores([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedModuleId, zones]);

  // State for fetched categories
  const [categoryMap, setCategoryMap] = useState<Record<string, string>>({});

  // Fetch Categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await metadataService.getCategories();
        if (Array.isArray(cats)) {
          const map: Record<string, string> = {};
          cats.forEach((c: any) => {
            map[c.id.toString()] = c.name;
          });
          setCategoryMap(map);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const getImageUrl = (image: any) => {
    if (!image || image === "📦") return null;
    const imgStr = String(image);
    if (imgStr.startsWith('http') || imgStr.startsWith('//')) return imgStr;
    const cleanPath = imgStr.startsWith('/') ? imgStr.slice(1) : imgStr;
    return `https://market.bery.in/storage/app/public/product/${cleanPath}`;
  };

  // NEW: Refetch products when store or category changes (with module ready)
  useEffect(() => {
    const refetchProducts = async () => {
      if (!selectedModuleId) return;

      // Ensure zoneId is available
      const storedZone = localStorage.getItem('zoneId');
      if (!storedZone) return;

      try {
        setLoading(true);
        const productData = await itemService.getLatestProducts({
          store_id: selectedStoreId ?? undefined,
          category_id: selectedCategory !== 'all' && !Number.isNaN(Number(selectedCategory)) ? Number(selectedCategory) : 0,
          limit: 20,
          offset: 0,
        });

        const transformProduct = (product: any) => {
          const primaryImage = product.image_full_url || product.image;
          const images = Array.isArray(product.images)
            ? product.images
            : (primaryImage ? [primaryImage] : []);

          return {
            id: product.id,
            name: product.name,
            price: `₿ ${product.price}`,
            actual_price: product.price,
            usdPrice: `$${(product.price * 8.9).toFixed(2)}`,
            rating: product.avg_rating || 4.5,
            reviews: product.rating_count || 100,
            category: product.category_id ? product.category_id.toString() : "uncategorized",
            seller: product.store_name || "Store Name",
            image: primaryImage,
            images,
            description: product.description ?? "",
            store_id: product.store_id,
            module_id: product.module_id,
          };
        };

        let transformedProducts = Array.isArray(productData) ? productData.map(transformProduct) : [];

        // Fallback: if no products with selected zone, switch to All Zones and refetch once
        if (transformedProducts.length === 0 && zones.length > 0) {
          setAllZonesHeader();
          const fallbackData = await itemService.getLatestProducts({
            store_id: selectedStoreId ?? undefined,
            category_id: selectedCategory !== 'all' && !Number.isNaN(Number(selectedCategory)) ? Number(selectedCategory) : 0,
            limit: 20,
            offset: 0,
          });
          transformedProducts = Array.isArray(fallbackData) ? fallbackData.map(transformProduct) : [];
        }

        setProducts(transformedProducts);

        // Update dynamic categories on refetch
        const uniqueCats = Array.from(new Set(transformedProducts.map(p => p.category))).filter(Boolean);
        setDynamicProductCategories([
          { id: 'all', name: 'All' },
          ...uniqueCats.map(c => ({
            id: c,
            name: c === 'uncategorized' ? 'Uncategorized' : (categoryMap[c] || `Category ${c}`)
          }))
        ]);
      } catch (error) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    refetchProducts();
  }, [selectedStoreId, selectedCategory, selectedModuleId, categoryMap]);

  const handleZoneChange = (id: number) => {
    setSelectedZoneId(id);
    try { localStorage.setItem('zoneId', JSON.stringify([id])); } catch { }
  };

  const handleModuleChange = (id: number) => {
    setSelectedModuleId(id);
    setSelectedStoreId(null); // Reset store selection
    try {
      localStorage.setItem('moduleId', id.toString());
      localStorage.removeItem('storeId'); // Clear stored store ID
    } catch { }
  };

  // Using dynamic categories from API data instead of hardcoded values
  // Filter out 'all' and 'uncategorized' from product categories
  const filteredProductCategories = dynamicProductCategories.filter(cat => cat.id !== 'all' && cat.id.toLowerCase() !== 'uncategorized');

  const currentCategories = filteredProductCategories;
  const currentItems = products;

  let filteredItems = selectedCategory === "all"
    ? currentItems
    : currentItems.filter(item => item.category === selectedCategory);

  // Filter by selected store if a store is selected
  if (selectedStoreId) {
    filteredItems = filteredItems.filter(item => item.store_id === selectedStoreId);
  }


  if (searchQuery.trim()) {
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const handleItemClick = (item: any) => {
    const images = Array.isArray(item?.images)
      ? item.images
      : (item?.image ? [item.image] : []);

    const enhancedItem = {
      ...item,
      description: item?.description ?? "",
      images,
    };

    try { Haptics.notification({ type: NotificationType.Success }); } catch { }
    onProductClick(enhancedItem, false);
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


        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-200/50" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="pl-12 bg-white/10 border-white/20 text-white placeholder:text-blue-200/50 h-12 rounded-xl"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-2">

        {/* Module Selector - Grid Design like Categories (Products Only) */}
        {modules.length > 0 && (
          <div className="mb-2 mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-bold text-base">Select Module</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {modules.map((module, index) => {
                // Map module names and types to icons and colors
                const getModuleConfig = (moduleName: string, moduleType: string) => {
                  const name = moduleName.toLowerCase();
                  const type = moduleType.toLowerCase();

                  // Grocery - Teal to Cyan (ShoppingCart icon) - Green color
                  if (name.includes('grocery') || type.includes('grocery'))
                    return { icon: ShoppingCart, color: 'from-gray-600 to-gray-700', selectedColor: 'from-green-500 to-green-600' };

                  // Food (general) - Lime to Green (ShoppingBasket icon) - Blue color
                  if (name.includes('food'))
                    return { icon: ShoppingBasket, color: 'from-gray-600 to-gray-700', selectedColor: 'from-blue-500 to-blue-600' };

                  // Pharmacy - Red to Pink (Pill icon) - Pink color
                  if (name.includes('pharmacy') || name.includes('medicine') || name.includes('health') || type.includes('pharmacy'))
                    return { icon: Pill, color: 'from-gray-600 to-gray-700', selectedColor: 'from-pink-500 to-pink-600' };

                  // Electronics - Blue to Cyan (Laptop icon) - White color
                  if (name.includes('electronic') || name.includes('tech') || type.includes('electronic'))
                    return { icon: Laptop, color: 'from-gray-600 to-gray-700', selectedColor: 'from-white to-gray-100' };

                  // Restaurant/Dining - Orange to Amber (Utensils icon) - Red color
                  if (name.includes('restaurant') || name.includes('dining') || type.includes('restaurant'))
                    return { icon: Utensils, color: 'from-gray-600 to-gray-700', selectedColor: 'from-red-500 to-red-600' };

                  // Home/Furniture - Indigo to Purple (Home icon) - Orange color
                  if (name.includes('home') || name.includes('furniture') || type.includes('home'))
                    return { icon: Home, color: 'from-gray-600 to-gray-700', selectedColor: 'from-orange-500 to-orange-600' };

                  // Parcel/Courier - Yellow to Orange (Truck icon) - Purple color
                  if (name.includes('parcel') || name.includes('courier') || name.includes('delivery') || type.includes('parcel'))
                    return { icon: Truck, color: 'from-gray-600 to-gray-700', selectedColor: 'from-purple-500 to-purple-600' };

                  // Retail/Store - Purple to Pink (StoreIcon icon) - Yellow color (changed from white)
                  if (name.includes('retail') || name.includes('store') || type.includes('retail') || type.includes('store'))
                    return { icon: StoreIcon, color: 'from-gray-600 to-gray-700', selectedColor: 'from-yellow-400 to-yellow-500' };

                  // E-commerce/Shop - Pink to Rose (ShoppingBag icon) - Cyan color
                  if (name.includes('shop') || type.includes('e-commerce') || type.includes('ecommerce'))
                    return { icon: ShoppingBag, color: 'from-gray-600 to-gray-700', selectedColor: 'from-cyan-500 to-cyan-600' };

                  // Default - Gray (neutral color for unselected state) - White color
                  return { icon: Sparkles, color: 'from-gray-600 to-gray-700', selectedColor: 'from-white to-gray-100' };
                };

                const { icon: ModuleIcon, color, selectedColor } = getModuleConfig(module.module_name, module.module_type);
                const isSelected = selectedModuleId === module.id;

                return (
                  <Card
                    key={module.id}
                    onClick={() => handleModuleChange(module.id)}
                    className={`p-3 text-center transition-all cursor-pointer ${isSelected
                      ? 'bg-[#252540] border-blue-500 ring-2 ring-blue-500/50'
                      : 'bg-[#1a1a2e] border-slate-700/40 hover:bg-[#252540]'
                      }`}
                  >
                    <div className={`w-14 h-14 mx-auto mb-2 rounded-2xl flex items-center justify-center shadow-lg ${isSelected
                      ? `bg-gradient-to-br ${selectedColor}`
                      : `bg-gradient-to-br ${color}`
                      }`}>
                      <ModuleIcon className="w-7 h-7 text-white" />
                    </div>
                    <p className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                      {module.module_name}
                    </p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

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
                  Hot Deals Today
                </h2>
                <p className="text-blue-100 text-sm mb-4">
                  Up to 50% off on selected items
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
        {!selectedStoreId && featuredStores.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-white font-bold text-lg">Featured Stores</h3>
                <p className="text-slate-400 text-xs">Verified sellers with best ratings</p>
              </div>
            </div>
            <div className="space-y-3">
              {featuredStores.map((store) => (
                <Card key={store.id} className="p-0 bg-[#1a1a2e] border-slate-700/40 hover:bg-[#252540] hover:border-slate-600/40 transition-all overflow-hidden cursor-pointer">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg overflow-hidden">
                          {store.image.startsWith('/') ? (
                            <img
                              src={`https://market.bery.in/storage/app/public/store${store.image}`}
                              alt={store.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                (e.target as HTMLImageElement).parentElement!.innerHTML = '🏪';
                                (e.target as HTMLImageElement).parentElement!.classList.add('text-4xl');
                              }}
                            />
                          ) : (
                            <span className="text-4xl">{store.image}</span>
                          )}
                        </div>
                        {store.verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-[#1a1a2e]">
                            <Shield className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <h4 className="text-white font-bold text-base mb-0.5">{store.name}</h4>
                            <p className="text-gray-400 text-sm mb-2">{store.description}</p>
                          </div>
                          <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-0.5 text-xs font-semibold">
                            {store.badge}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-white text-sm font-bold">{store.rating}</span>
                            <span className="text-gray-500 text-xs">({store.reviews})</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-slate-400" />
                            <span className="text-slate-300 text-xs font-medium">{store.products}</span>
                          </div>
                        </div>
                        <button
                          className="w-full py-2 bg-gradient-to-r cursor-pointer from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all"
                          onClick={() => {
                            setSelectedStoreId(Number(store.id));
                            try { localStorage.setItem('storeId', store.id); } catch { }
                          }}
                        >
                          Visit Store
                        </button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Items Grid */}
        <div className="mb-6">
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
                    <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-800/20 flex items-center justify-center mb-3 overflow-hidden relative">
                      {getImageUrl(item.image) ? (
                        <img
                          src={getImageUrl(item.image)!}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                          }}
                        />
                      ) : null}
                      <div className={`absolute inset-0 flex items-center justify-center ${getImageUrl(item.image) ? 'hidden' : ''}`}>
                        <ImageIcon className="w-12 h-12 text-white/30" />
                      </div>
                    </div>

                    <div className="mb-2 flex-1">
                      <p className="text-sm text-white mb-1 line-clamp-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">{item.seller}</p>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      <span className="text-xs text-slate-300">{item.rating}</span>
                      <span className="text-xs text-slate-500">({item.reviews})</span>
                    </div>

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
