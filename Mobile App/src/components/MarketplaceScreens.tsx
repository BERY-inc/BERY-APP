import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import * as React from "react";
import { ArrowLeft, Search, Store, Package, MapPin, CreditCard, Wallet, Globe, Star, ShoppingCart, Heart, SlidersHorizontal, Zap, Clock, Shield, Crown, Share2, Grid3x3, List, Flame, TrendingUp, Sparkles, Check, Truck, User, Image as ImageIcon, X, HelpCircle, Copy } from "lucide-react";
import { storeService, itemService, wishlistService, orderService, metadataService, customerService, authService } from '../services';
import { getStorageUrl } from '../services/supabaseClient';
import { toast } from "sonner";

interface ScreenProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
}

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: typeof Package;
  popular?: boolean;
  color: string;
}

function ScreenHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] px-5 pt-14 pb-6">
      <div className="flex items-center gap-4 mb-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="text-white hover:bg-white/20 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl text-white" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>{title}</h1>
      </div>
    </div>
  );
}

function Placeholder({ children }: { children?: React.ReactNode }) {
  return (
    <Card className="p-5 bg-[#1a1a2e] border border-slate-700/40">
      <p className="text-sm text-slate-300">This screen is scaffolded and ready for data integration.</p>
      {children}
    </Card>
  );
}

export function StoreScreen({ onBack, onNavigate }: ScreenProps) {
  const [featuredStores, setFeaturedStores] = React.useState<any[]>([
    // Default mock data
    {
      id: '1',
      name: 'TechHub Electronics',
      description: 'Premium gadgets & accessories',
      rating: 4.8,
      reviews: 1234,
      image: '🔌',
      verified: true,
      badge: 'Top Rated',
      products: '2.5k'
    },
    {
      id: '2',
      name: 'Fashion Forward',
      description: 'Trending clothing & styles',
      rating: 4.6,
      reviews: 892,
      image: '👗',
      verified: true,
      badge: 'Trending',
      products: '1.8k'
    },
    {
      id: '3',
      name: 'Home Essentials',
      description: 'Everything for your home',
      rating: 4.9,
      reviews: 2341,
      image: '🏠',
      verified: true,
      badge: 'Best Seller',
      products: '3.2k'
    },
    {
      id: '4',
      name: 'Beauty Box',
      description: 'Cosmetics & skincare paradise',
      rating: 4.7,
      reviews: 1567,
      image: '💄',
      verified: true,
      badge: 'New',
      products: '1.2k'
    },
  ]);

  const [loading, setLoading] = React.useState(true);

  // Fetch real store data from API
  React.useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);

        // Ensure we have a zoneId before fetching
        let currentZoneId = localStorage.getItem('zoneId');
        if (!currentZoneId) {
          try {
             const zones = await metadataService.getZones();
             if (zones && zones.length > 0) {
               const firstZoneId = Number((zones as any[])[0]?.id);
               currentZoneId = JSON.stringify([Number.isFinite(firstZoneId) ? firstZoneId : 1]);
               localStorage.setItem('zoneId', currentZoneId);
             }
          } catch (e) {
            console.error('Failed to fetch default zones', e);
          }
        }

        // Fetch stores from the 6amMart API
        let storeData = await storeService.getPopularStores();
        if (!storeData || storeData.length === 0) {
          try {
            storeData = await storeService.getLatestStores({ limit: 20, offset: 0 });
          } catch { }
        }

        // Transform store data to match existing UI structure
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
          setFeaturedStores(transformedStores);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        // Keep default mock data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const categories = [
    { id: '1', name: 'Electronics', icon: '📱', color: 'from-blue-500 to-cyan-500' },
    { id: '2', name: 'Fashion', icon: '👔', color: 'from-pink-500 to-rose-500' },
    { id: '3', name: 'Home', icon: '🏡', color: 'from-green-500 to-emerald-500' },
    { id: '4', name: 'Beauty', icon: '💄', color: 'from-purple-500 to-pink-500' },
    { id: '5', name: 'Sports', icon: '⚽', color: 'from-orange-500 to-red-500' },
    { id: '6', name: 'Books', icon: '📚', color: 'from-indigo-500 to-blue-500' },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Marketplace" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-5">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-4 mt-4 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search stores, products..."
            className="pl-10 h-12 bg-[#1a1a2e] border-slate-700/40 text-white placeholder:text-slate-500 rounded-xl"
          />
        </div>

        {/* Campaign Banner */}
        <Card className="p-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 border-0 overflow-hidden shadow-xl">
          <div className="p-5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <Badge className="bg-white/30 text-white border-0 mb-2 backdrop-blur-sm">
              <Zap className="w-3 h-3 mr-1" />
              Hot Deals
            </Badge>
            <h3 className="text-white font-bold text-2xl mb-1">Black Friday Sale</h3>
            <p className="text-white/90 text-sm mb-4">Up to 70% off on selected stores</p>
            <button className="bg-white text-red-600 px-2 py-2 rounded-xl cursor-pointer font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg" onClick={() => onNavigate('campaigns')}>
              Shop Now →
            </button>
          </div>
        </Card>
        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-bold text-lg">Shop by Category</h3>
            <button className="text-blue-400 text-sm font-medium cursor-pointer hover:text-blue-300" onClick={() => onNavigate('categories')}>See All</button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <Card key={cat.id} className="p-3 bg-[#1a1a2e] border-slate-700/40 text-center hover:bg-[#252540] transition-colors cursor-pointer">
                <div className={`w-14 h-14 mx-auto mb-2 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl shadow-lg`}>
                  {cat.icon}
                </div>
                <p className="text-white text-xs font-semibold">{cat.name}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Stores */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-white font-bold text-lg">Featured Stores</h3>
              <p className="text-slate-400 text-xs">Verified sellers with best ratings</p>
            </div>
            <button className="text-blue-400 text-sm font-medium cursor-pointer hover:text-blue-300" onClick={() => onNavigate("stores")}>View All</button>
          </div>
          <div className="space-y-3">
            {featuredStores.map((store) => (
              <Card key={store.id} className="p-0 bg-[#1a1a2e] border-slate-700/40 hover:bg-[#252540] hover:border-slate-600/40 transition-all overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-lg">
                        {store.image}
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
                          <span className="text-slate-300 text-xs font-medium">{store.products} items</span>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-gradient-to-r cursor-pointer from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all" onClick={() => { try { localStorage.setItem('selectedStoreId', store.id); } catch { }; onNavigate('marketplace'); }}>
                        Visit Store
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>



        {/* Stats Bar */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl border border-indigo-500/20">
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-white">250+</p>
            <p className="text-xs text-slate-400">Active Stores</p>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-white">50k+</p>
            <p className="text-xs text-slate-400">Products</p>
          </div>
          <div className="w-px h-8 bg-slate-700"></div>
          <div className="text-center flex-1">
            <p className="text-2xl font-bold text-white">4.8★</p>
            <p className="text-xs text-slate-400">Avg Rating</p>
          </div>
        </div>

        {/* All Stores Link */}
        <Card className="p-4 bg-gradient-to-r from-slate-800/40 to-slate-700/40 border-slate-700/40 text-center cursor-pointer hover:from-slate-700/40 hover:to-slate-600/40 transition-all" onClick={() => onNavigate('stores')}>
          <Store className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-white font-semibold text-sm">Browse All Stores</p>
          <p className="text-slate-400 text-xs">Discover 250+ verified sellers</p>
        </Card>
      </div>
    </div>
  );
}

export function AllStoreScreen({ onBack, onNavigate }: ScreenProps) {
  const [selectedFilter, setSelectedFilter] = React.useState('All');
  const [featuredStores, setFeaturedStores] = React.useState<any[]>([
    // Default mock data
    {
      id: '1',
      name: 'TechHub Electronics',
      description: 'Premium gadgets & accessories',
      rating: 4.8,
      reviews: 1234,
      image: '🔌',
      verified: true,
      badge: 'Top Rated',
      products: '2.5k',
    },
    {
      id: '2',
      name: 'Fashion Forward',
      description: 'Trending clothing & styles',
      rating: 4.6,
      reviews: 892,
      image: '👗',
      verified: true,
      badge: 'Trending',
      products: '1.8k',
    },
    {
      id: '3',
      name: 'Home Essentials',
      description: 'Everything for your home',
      rating: 4.9,
      reviews: 2341,
      image: '🏠',
      verified: true,
      badge: 'Best Seller',
      products: '3.2k',
    },
    {
      id: '4',
      name: 'Beauty Box',
      description: 'Cosmetics & skincare paradise',
      rating: 4.7,
      reviews: 1567,
      image: '💄',
      verified: true,
      badge: 'New',
      products: '1.2k',
    },
  ]);

  const [loading, setLoading] = React.useState(true);

  const filters = ['All', 'Top Rated', 'Trending', 'Best Seller', 'New'];

  // Fetch real store data from API
  React.useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);

        // Ensure we have a zoneId before fetching
        let currentZoneId = localStorage.getItem('zoneId');
        if (!currentZoneId) {
          try {
             const zones = await metadataService.getZones();
             if (zones && zones.length > 0) {
               const firstZoneId = Number((zones as any[])[0]?.id);
               currentZoneId = JSON.stringify([Number.isFinite(firstZoneId) ? firstZoneId : 1]);
               localStorage.setItem('zoneId', currentZoneId);
             }
          } catch (e) { console.error(e); }
        }

        // Fetch all stores from the 6amMart API with safe pagination
        let storeData = await storeService.getStores('all', { limit: 20, offset: 0 });

        // Fallback to latest stores if get-stores returns empty
        if (!storeData || storeData.length === 0) {
          try {
            storeData = await storeService.getLatestStores({ limit: 20, offset: 0 });
          } catch { }
        }

        if (!storeData || storeData.length === 0) {
          try {
            const zones = await metadataService.getZones();
            const firstZoneId = Number((Array.isArray(zones) ? zones[0] : null as any)?.id);
            if (Number.isFinite(firstZoneId)) {
              try { localStorage.setItem('zoneId', JSON.stringify([firstZoneId])); } catch { }
              storeData = await storeService.getStores('all', { limit: 20, offset: 0 });
            }
          } catch { }
        }

        // Transform store data to match existing UI structure
        const transformedStores = storeData.map((store: any) => ({
          id: store.id.toString(),
          name: store.name,
          description: store.address || 'Popular store',
          rating: store.avg_rating || 4.5,
          reviews: store.rating_count || 100,
          image: store.logo ? `/${store.logo}` : '🏪',
          verified: store.approved === 1,
          badge: store.featured === 1 ? 'Featured' : store.rating_count > 1000 ? 'Top Rated' : 'New',
          products: `${store.items_count || 0} items`
        }));

        if (transformedStores.length > 0) {
          setFeaturedStores(transformedStores);
        }
      } catch (error) {
        console.error('Error fetching stores:', error);
        // Keep default mock data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const filteredStores = selectedFilter === 'All'
    ? featuredStores
    : featuredStores.filter(store => store.badge === selectedFilter);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="All Stores" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Input placeholder="Search stores" className="bg-[#0a0a1a] border-slate-700/40 text-white" />

        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${selectedFilter === filter
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-[#1a1a2e] text-gray-400 border border-slate-700/40 hover:border-slate-600/40 hover:text-white'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Campaign Banner */}
        <Card className="p-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 border-0 overflow-hidden shadow-xl">
          <div className="p-5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <Badge className="bg-white/30 text-white border-0 mb-2 backdrop-blur-sm">
              <Zap className="w-3 h-3 mr-1" />
              Hot Deals
            </Badge>
            <h3 className="text-white font-bold text-2xl mb-1">Black Friday Sale</h3>
            <p className="text-white/90 text-sm mb-4">Up to 70% off on selected stores</p>
            <button className="bg-white text-red-600 px-2 py-2 rounded-xl cursor-pointer font-bold text-sm hover:bg-gray-100 transition-colors shadow-lg" onClick={() => onNavigate('campaigns')}>
              Shop Now →
            </button>
          </div>
        </Card>

        {/* Categories */}
        <div className="space-y-3">
          {filteredStores.map((store) => (
            <Card
              key={store.id}
              className="p-0 bg-[#1a1a2e] border-slate-700/40 hover:bg-[#252540] hover:border-slate-600/40 transition-all cursor-pointer overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl shadow-lg">
                      {store.image}
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
                        <span className="text-slate-300 text-xs font-medium">{store.products} items</span>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all" onClick={() => { try { localStorage.setItem('selectedStoreId', store.id); } catch { }; onNavigate('marketplace'); }}>
                      Visit Store
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function StoreItemSearchScreen({ onBack }: ScreenProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedSort, setSelectedSort] = React.useState('Popular');
  const [products, setProducts] = React.useState<any[]>([
    // Default mock data
    {
      id: '1',
      name: 'Wireless Earbuds Pro',
      price: 89.99,
      originalPrice: 129.99,
      image: '🎧',
      rating: 4.8,
      reviews: 2456,
      category: 'Audio',
      discount: '31%',
      badge: 'Best Seller'
    },
    {
      id: '2',
      name: 'Smart Watch Series 5',
      price: 249.99,
      originalPrice: 349.99,
      image: '⌚',
      rating: 4.9,
      reviews: 1823,
      category: 'Wearables',
      discount: '29%',
      badge: 'Top Rated'
    },
    {
      id: '3',
      name: 'Gaming Laptop Pro',
      price: 1299.99,
      originalPrice: 1599.99,
      image: '💻',
      rating: 4.7,
      reviews: 956,
      category: 'Computers',
      discount: '19%',
      badge: 'New Arrival'
    },
    {
      id: '4',
      name: 'Smartphone X Pro',
      price: 899.99,
      originalPrice: 999.99,
      image: '📱',
      rating: 4.8,
      reviews: 3241,
      category: 'Mobile',
      discount: '10%',
      badge: 'Best Seller'
    },
    {
      id: '5',
      name: 'Wireless Charger Pad',
      price: 29.99,
      originalPrice: 39.99,
      image: '🔋',
      rating: 4.6,
      reviews: 742,
      category: 'Accessories',
      discount: '25%',
      badge: 'Hot Deal'
    },
    {
      id: '6',
      name: 'Bluetooth Speaker',
      price: 79.99,
      originalPrice: 99.99,
      image: '🔊',
      rating: 4.7,
      reviews: 1523,
      category: 'Audio',
      discount: '20%',
      badge: 'Trending'
    }
  ]);

  const [loading, setLoading] = React.useState(true);

  const categories = ['All', 'Audio', 'Wearables', 'Mobile', 'Computers', 'Accessories'];
  const sortOptions = ['Popular', 'Price: Low to High', 'Price: High to Low', 'New Arrivals', 'Top Rated'];

  // Fetch real product data from API
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        // Ensure we have a zoneId before fetching
        let currentZoneId = localStorage.getItem('zoneId');
        if (!currentZoneId) {
          try {
             const zones = await metadataService.getZones();
             if (zones && zones.length > 0) {
               const firstZoneId = Number((zones as any[])[0]?.id);
               currentZoneId = JSON.stringify([Number.isFinite(firstZoneId) ? firstZoneId : 1]);
               localStorage.setItem('zoneId', currentZoneId);
             }
          } catch (e) { console.error(e); }
        }

        // Fetch products from the 6amMart API
        const productData = await itemService.getLatestProducts();

        // Transform product data to match existing UI structure
        const transformedProducts = productData.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          originalPrice: product.price * 1.2, // Add original price for discount calculation
          image: product.image_full_url || product.image,
          rating: product.avg_rating || 4.5,
          reviews: product.rating_count || 100,
          category: product.category_id ? `Category ${product.category_id}` : 'Uncategorized',
          discount: product.discount ? `${Math.round(product.discount)}%` : '0%',
          badge: product.featured ? 'Featured' : product.rating_count > 1000 ? 'Popular' : 'New'
        }));

        if (transformedProducts.length > 0) {
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Keep default mock data if API fails
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Store Search" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400/80" />
          <Input placeholder="Search items in this store..." className="pl-10 bg-[#0a0a1a] border-slate-700/40 text-white" />
        </div>

        {/* Store Info Banner */}
        <Card className="p-0 bg-gradient-to-r from-blue-600 to-purple-600 border-0 overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl flex-shrink-0">
              🔌
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-lg mb-0.5">TechHub Electronics</h3>
              <p className="text-white/90 text-sm">2.5k products • 4.8★ rating</p>
            </div>
            <Badge className="bg-white/30 text-white border-0 backdrop-blur-sm flex items-center gap-1 px-2 py-1">
              <Shield className="w-3 h-3" />
              <span className="text-xs font-semibold">Verified</span>
            </Badge>
          </div>
        </Card>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === category
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-[#1a1a2e] text-gray-400 border border-slate-700/40 hover:border-slate-600/40 hover:text-white'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Sort and Filter Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{filteredProducts.length}</span>
            <span className="text-slate-400 text-sm">items found</span>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-[#1a1a2e] text-white text-sm px-3 py-2 rounded-lg border border-slate-700/40 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-0 bg-[#1a1a2e] border-slate-700/40 hover:bg-[#252540] hover:border-slate-600/40 transition-all cursor-pointer overflow-hidden">
              <div className="p-3">
                {/* Product Image */}
                <div className="relative mb-3">
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-5xl">
                    {product.image}
                  </div>
                  {/* Badge - Top Left */}
                  {product.badge && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 text-xs px-2 py-0.5 font-semibold shadow-md">
                      {product.badge}
                    </Badge>
                  )}
                  {/* Discount - Top Right */}
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 bg-green-500 text-white border-0 text-xs px-2 py-0.5 font-bold shadow-md">
                      -{product.discount}
                    </Badge>
                  )}
                  {/* Heart Button - Bottom Right */}
                  <button className="absolute bottom-3 right-2 w-7 h-7 mt-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-slate-700" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                  <h4 className="text-white font-semibold text-sm mt-6 line-clamp-2 leading-tight min-h-[2.5rem]">
                    {product.name}
                  </h4>

                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-300 fill-yellow-400" />
                    <span className="text-white text-xs font-bold">{product.rating}</span>
                    <span className="text-gray-500 text-xs">({product.reviews})</span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-white font-bold text-lg">${product.price}</span>
                    <span className="text-gray-500 text-xs line-through">${product.originalPrice}</span>
                  </div>

                  <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-1.5">
                    <ShoppingCart className="w-3 h-3" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


export function CampaignScreen({ onBack }: ScreenProps) {
  const campaigns = [
    {
      id: '1',
      title: 'Black Friday Mega Sale',
      subtitle: 'Up to 80% OFF',
      description: 'Biggest sale of the year on all categories',
      gradient: 'from-orange-600 via-red-600 to-pink-600',
      icon: '🔥',
      badge: 'Hot Deal',
      timeLeft: '2 Days Left',
      stores: '500+ Stores'
    },
    {
      id: '2',
      title: 'Flash Sale',
      subtitle: 'Limited Time Offer',
      description: 'Extra 50% off on selected items',
      gradient: 'from-purple-600 via-pink-600 to-red-600',
      icon: '⚡',
      badge: 'Ending Soon',
      timeLeft: '6 Hours Left',
      stores: '200+ Stores'
    },
    {
      id: '3',
      title: 'Summer Collection',
      subtitle: 'New Arrivals',
      description: 'Fresh styles for the season',
      gradient: 'from-blue-600 via-cyan-600 to-teal-600',
      icon: '☀️',
      badge: 'New',
      timeLeft: '30 Days',
      stores: '150+ Stores'
    },
    {
      id: '4',
      title: 'Tech Week Deals',
      subtitle: 'Gadgets & Electronics',
      description: 'Save big on latest technology',
      gradient: 'from-indigo-600 via-blue-600 to-purple-600',
      icon: '💻',
      badge: 'Tech Week',
      timeLeft: '5 Days Left',
      stores: '300+ Stores'
    }
  ];

  const quickDeals = [
    { id: '1', title: 'Buy 1 Get 1', icon: '🎁', color: 'from-green-600 to-emerald-600' },
    { id: '2', title: 'Free Shipping', icon: '🚚', color: 'from-blue-600 to-cyan-600' },
    { id: '3', title: 'Clearance Sale', icon: '🏷️', color: 'from-red-600 to-pink-600' },
    { id: '4', title: 'Member Deals', icon: '👑', color: 'from-amber-500 to-yellow-500' },
  ];

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Store Campaigns" onBack={onBack} />
      <div className="px-5 space-y-4">

        {/* Hero Campaign Banner - Enhanced */}
        <Card className="p-0 bg-gradient-to-br from-orange-600 via-red-600 to-pink-600 border-0 overflow-hidden shadow-2xl relative group">
          <div className="p-6 relative">
            {/* Animated Background Effects */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

            {/* Floating Sparkles */}
            <div className="absolute top-4 right-8 text-yellow-300 text-2xl animate-bounce">✨</div>
            <div className="absolute bottom-8 left-8 text-yellow-300 text-xl animate-bounce">💫</div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <Badge className="bg-yellow-400 text-red-600 border-0 font-black text-xs px-3 py-1 shadow-lg animate-pulse">
                  <Zap className="w-3 h-3 mr-1 fill-current" />
                  MEGA SALE
                </Badge>
                <div className="bg-white/30 backdrop-blur-md px-3 py-1 rounded-full border border-white/50">
                  <span className="text-white text-xs font-black">🔥 TRENDING</span>
                </div>
              </div>

              <h2 className="text-white font-black text-4xl mb-2 tracking-tight">
                Black Friday
              </h2>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-yellow-300 text-3xl font-black tracking-tighter">80% OFF</p>
                <p className="text-white/90 text-sm font-medium">Up to</p>
              </div>
              <p className="text-white/80 text-sm mb-5">The biggest sale event of the year is here!</p>

              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
                  <Clock className="w-4 h-4 text-red-300 animate-pulse" />
                  <span className="text-white text-xs font-black">2 Days Left</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20">
                  <Store className="w-4 h-4 text-white" />
                  <span className="text-white text-xs font-bold">500+</span>
                </div>
              </div>

              <button className="bg-white text-red-600 px-3 py-2 rounded-xl font-black text-sm hover:bg-yellow-300 hover:scale-105 transition-all shadow-2xl w-full flex items-center justify-center gap-2 group">
                <span>Shop Now</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Quick Deals Grid - Enhanced */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-black text-xl">Quick Deals</h3>
            <span className="text-purple-400 text-xs font-bold cursor-pointer hover:text-purple-300 transition-colors">See All →</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickDeals.map((deal, index) => (
              <Card
                key={deal.id}
                className={`p-0 bg-gradient-to-br ${deal.color} border-0 cursor-pointer hover:scale-110 hover:-rotate-1 transition-all duration-300 shadow-lg hover:shadow-2xl`}
              >
                <div className="p-5 text-center relative overflow-hidden">
                  {/* Background Pattern */}

                  <div className="relative z-10">
                    <div className="text-5xl mb-2 transform hover:scale-125 transition-transform inline-block">
                      {deal.icon}
                    </div>
                    <p className="text-white font-black text-sm drop-shadow-lg">{deal.title}</p>
                    <div className="mt-2 h-1 w-12 bg-white/40 rounded-full mx-auto"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* All Campaigns - Enhanced */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-black text-xl">Active Campaigns</h3>
            <span className="text-cyan-400 text-xs font-bold cursor-pointer hover:text-cyan-300 transition-colors">View All →</span>
          </div>
          <div className="space-y-3">
            {campaigns.map((campaign, index) => (
              <Card
                key={campaign.id}
                className={`p-0 bg-gradient-to-r ${campaign.gradient} border-0 overflow-hidden cursor-pointer hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-2xl`}
              >
                <div className="p-4 relative">
                  {/* Enhanced Background Effects */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                  <div className="flex items-start gap-4 relative z-10">
                    {/* Enhanced Icon Container */}
                    <div className="w-16 h-16 rounded-2xl bg-white/25 backdrop-blur-md flex items-center justify-center text-3xl flex-shrink-0 shadow-xl border border-white/30 hover:scale-110 transition-transform">
                      {campaign.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h4 className="text-white font-black text-lg mb-1 tracking-tight">{campaign.title}</h4>
                          <p className="text-yellow-300 text-sm font-black mb-1">{campaign.subtitle}</p>
                          <p className="text-white/80 text-xs">{campaign.description}</p>
                        </div>
                        <Badge className="bg-yellow-400 text-gray-900 border-0 text-xs font-black flex-shrink-0 shadow-lg">
                          {campaign.badge}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                          <Clock className="w-3.5 h-3.5 text-red-300" />
                          <span className="text-white text-xs font-bold">{campaign.timeLeft}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                          <Store className="w-3.5 h-3.5 text-white" />
                          <span className="text-white text-xs font-bold">{campaign.stores}</span>
                        </div>
                      </div>

                      <button className="w-full py-2 px-2 bg-white backdrop-blur-md text-blue-600 text-xs font-black rounded-xl hover:bg-yellow-300 hover:scale-105 transition-all shadow-lg flex items-center justify-center gap-2 group">
                        <span>View Deals</span>
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </button>

                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Special Offers Banner - Enhanced */}
        <Card className="p-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 border-0 overflow-hidden shadow-2xl">
          <div className="p-6 relative">
            {/* Animated Background */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>

            {/* Floating Elements */}
            <div className="absolute top-4 left-6 text-2xl animate-bounce">🎊</div>
            <div className="absolute top-4 right-6 text-2xl animate-bounce">🎁</div>
            <div className="absolute bottom-4 left-1/4 text-xl animate-bounce">✨</div>

            <div className="relative z-10 text-center">
              <div className="text-5xl mb-3 animate-bounce">🎉</div>
              <h3 className="text-white font-black text-2xl mb-2 tracking-tight">Special Offer!</h3>
              <p className="text-white/95 text-sm mb-4 font-semibold">Get extra 20% off with promo code</p>

              <div className="bg-white rounded-2xl px-6 py-4 inline-block mb-4 shadow-2xl border-4 border-dashed border-yellow-300 hover:scale-110 transition-transform cursor-pointer">
                <span className="text-red-600 font-black text-2xl tracking-wider font-mono">SAVE20</span>
              </div>

              <p className="text-white/80 text-xs">
                🔥 Limited time only • Tap to copy code
              </p>
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}

interface ItemDetailsProps extends ScreenProps {
  product?: any;
  onAddToCart?: (product: any, quantity: number) => void;
  onBuyNow?: (product: any, quantity: number) => void;
}

export function ItemDetailsScreen({ onBack, onNavigate, product: initialProduct, onAddToCart, onBuyNow }: ItemDetailsProps) {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedColor, setSelectedColor] = React.useState('Black');
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [product, setProduct] = React.useState<any>(initialProduct || null);
  const [loading, setLoading] = React.useState(!initialProduct);

  React.useEffect(() => {
    let cancelled = false;

    const normalizeImages = (maybeImages: any, fallbackImage?: any): string[] => {
      if (Array.isArray(maybeImages)) {
        const flat = maybeImages
          .map((img) => {
            if (typeof img === 'string') return img;
            if (img && typeof img === 'object') return img.image ?? img.url ?? img.path ?? null;
            return null;
          })
          .filter(Boolean);
        if (flat.length > 0) return flat as string[];
      }
      if (fallbackImage) return [String(fallbackImage)];
      return [];
    };

    const enrichFromDetails = (details: any, fallback?: any) => ({
      ...fallback,
      ...details,
      rating: details?.avg_rating ?? fallback?.rating,
      reviews: details?.rating_count ?? fallback?.reviews,
      images: normalizeImages(details?.images, details?.image_full_url ?? details?.image ?? fallback?.image_full_url ?? fallback?.image),
      image_full_url: details?.image_full_url ?? fallback?.image_full_url,
      image: details?.image ?? fallback?.image,
      description: details?.description ?? fallback?.description,
    });

    const hydrateDescription = async (baseProduct: any) => {
      const id = baseProduct?.id;
      const numericId = Number(id);
      if (!numericId || Number.isNaN(numericId)) return;
      try {
        const details = await itemService.getProductDetails(numericId);
        if (cancelled) return;
        setProduct((prev: any) => enrichFromDetails(details, prev));
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    const fetchProduct = async () => {
      try {
        if (initialProduct) {
          setProduct(initialProduct);
          setLoading(false);
          await hydrateDescription(initialProduct);
          return;
        }

        setLoading(true);
        const search = typeof window !== 'undefined' ? window.location.search : '';
        const params = new URLSearchParams(search);
        const rawId = params.get('id') || params.get('item_id');
        const numericId = rawId ? Number(rawId) : NaN;

        if (rawId && Number.isFinite(numericId)) {
          const details = await itemService.getProductDetails(numericId);
          if (cancelled) return;
          setProduct(enrichFromDetails(details));
          setLoading(false);
          return;
        }

        const productData = await itemService.getLatestProducts();
        if (productData && productData.length > 0) {
          const first = productData[0];
          if (!cancelled) setProduct(first);
          setLoading(false);
          await hydrateDescription(first);
          return;
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      cancelled = true;
    };
  }, [initialProduct]);

  const handleAddToCart = () => {
    if (onAddToCart && product) {
      onAddToCart(product, quantity);
      try {
        // Simple toast or feedback if available in scope, ensuring Haptics
        // Note: checking if Haptics is imported or available globally, else skipping or using simple alert if needed, 
        // but App.tsx handles the actual logic.
      } catch { }
    }
  };

  const handleBuyNow = () => {
    if (onBuyNow && product) {
      onBuyNow(product, quantity);
    }
  };

  const getImageUrl = (image: any) => {
    if (!image || image === "📦") return null;
    const imgStr = String(image);
    if (imgStr.startsWith('http') || imgStr.startsWith('//')) return imgStr;
    const cleanPath = imgStr.startsWith('/') ? imgStr.slice(1) : imgStr;
    return `https://market.bery.in/storage/app/public/product/${cleanPath}`;
  };

  const images = Array.isArray(product?.images) && product.images.length > 0 ? product.images : [product?.image_full_url || product?.image].filter(Boolean);
  // Fallback for colors if not present
  const colors = product?.colors || ['Black', 'White', 'Blue', 'Red'];

  if (loading) {
    return <div className="h-screen bg-[#0a0a1a] flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-20">
      <ScreenHeader title="Item Details" onBack={onBack} />

      <div className="space-y-4">
        {/* Product Image Section */}
        <div className="px-5 mt-4">
          <div className="relative">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden shadow-xl">
              {(() => {
                 const finalUrl = getImageUrl(images[selectedImage]);
                 return finalUrl ? (
                   <img src={finalUrl} alt={product?.name} className="w-full h-full object-cover" />
                 ) : (
                   <ImageIcon className="w-32 h-32 text-white/50" />
                 );
              })()}
            </div>
            {/* Badges */}
            {product?.discount && (
              <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold shadow-lg">
                {product.discount}
              </div>
            )}
            {/* Action Buttons */}
            <div className="absolute top-3 right-2 flex flex-col gap-2">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-700'}`} />
              </button>
              <button className="w-9 h-9 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                <Share2 className="w-4 h-4 text-slate-700" />
              </button>
            </div>
          </div>
          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center overflow-hidden transition-all ${selectedImage === idx ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0a0a1a]' : 'opacity-50'
                    }`}
                >
                  {(() => {
                    const thumbUrl = getImageUrl(img);
                    return thumbUrl ? (
                      <img src={thumbUrl} alt="thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-white/50" />
                    );
                  })()}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="px-5 space-y-4">
          {/* Title and Price */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h1 className="text-white font-bold text-2xl leading-tight flex-1">
                {product?.name || 'Product Name'}
              </h1>
              {product?.badge && (
                <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-1 text-xs font-semibold">
                  {product.badge}
                </Badge>
              )}
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-white font-bold text-3xl">{product?.price}</span>
              {product?.originalPrice && (
                <span className="text-gray-500 text-lg line-through">${product.originalPrice}</span>
              )}
              {product?.discountAmount && (
                <span className="text-green-400 text-sm font-semibold">Save ${product.discountAmount}</span>
              )}
            </div>
            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${star <= (product?.rating || 4.8) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                ))}
              </div>
              <span className="text-white font-bold">{product?.rating || '4.5'}</span>
              <span className="text-gray-400 text-sm">({product?.reviews?.toLocaleString() || '100'} reviews)</span>
            </div>
          </div>
          {/* Seller Info */}
          <Card className="p-0 bg-[#1a1a2e] border-slate-700/40">
            <div className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
                🏪
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">{product?.seller || 'Store Name'}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-bold">4.8</span>
                  </div>
                  <span className="text-gray-400 text-xs">• Verified</span>
                </div>
              </div>
              <button
                onClick={() => onNavigate && onNavigate('store')}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg active:bg-blue-700 transition-colors whitespace-nowrap"
              >
                Visit Store
              </button>
            </div>
          </Card>

          {/* Color/Variant Selection - Optional (Show only if colors exist) */}
          {product?.colors && (
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Select Variant</h3>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((color: string) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedColor === color
                        ? 'bg-blue-600 text-white'
                        : 'bg-[#1a1a2e] text-gray-400 border border-slate-700/40 active:bg-[#252540]'
                      }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Quantity</h3>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-[#1a1a2e] border border-slate-700/40 rounded-lg flex items-center justify-center text-white font-bold active:bg-[#252540] transition-colors"
                >
                  -
                </button>
                <span className="text-white font-bold text-lg min-w-[2rem] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-[#1a1a2e] border border-slate-700/40 rounded-lg flex items-center justify-center text-white font-bold active:bg-[#252540] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons - Add to Cart & Buy Now */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={handleAddToCart}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl active:scale-98 transition-transform shadow-lg flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">Add to Cart</span>
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl active:scale-98 transition-transform shadow-lg"
            >
              <span className="text-sm">Buy Now</span>
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-white font-semibold text-base mb-2">Description</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {product?.description || 'No description available for this product.'}
            </p>
          </div>

          {/* Features */}
          {product?.features && product.features.length > 0 && (
            <div>
              <h3 className="text-white font-semibold text-base mb-3">Key Features</h3>
              <div className="space-y-2">
                {product.features.map((feature: string, idx: number) => (
                  <div key={idx} className="flex items-center gap-3 text-gray-300 text-sm">
                    <span className="text-xl">✨</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Specifications - Mocked for now if not in product */}
          <div>
            <h3 className="text-white font-semibold text-base mb-3">Specifications</h3>
            <Card className="p-0 bg-[#1a1a2e] border-slate-700/40">
              <div className="divide-y divide-slate-700/40">
                {[
                  { label: 'Category', value: product?.category || 'General' },
                  { label: 'Delivery', value: product?.deliveryDays ? `${product.deliveryDays} Days` : 'Standard' },
                ].map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3">
                    <span className="text-gray-400 text-sm">{spec.label}</span>
                    <span className="text-white text-sm font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ItemViewAllScreen({ onBack }: ScreenProps) {
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [selectedStore, setSelectedStore] = React.useState('All Stores');
  const [selectedSort, setSelectedSort] = React.useState('Popular');
  const [viewMode, setViewMode] = React.useState('grid'); // 'grid' or 'list'

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books'];
  const stores = ['All Stores', 'TechHub Electronics', 'Fashion Forward', 'Home Essentials', 'Beauty Box', 'SportZone', 'BookHaven'];
  const sortOptions = ['Popular', 'Price: Low to High', 'Price: High to Low', 'New Arrivals', 'Top Rated'];

  const products = [
    {
      id: '1',
      name: 'Wireless Earbuds Pro',
      price: 89.99,
      originalPrice: 129.99,
      image: '🎧',
      rating: 4.8,
      reviews: 2456,
      category: 'Electronics',
      discount: '31%',
      badge: 'Best Seller',
      store: 'TechHub Electronics',
      storeIcon: '🔌'
    },
    {
      id: '2',
      name: 'Smart Watch Series 5',
      price: 249.99,
      originalPrice: 349.99,
      image: '⌚',
      rating: 4.9,
      reviews: 1823,
      category: 'Electronics',
      discount: '29%',
      badge: 'Top Rated',
      store: 'TechHub Electronics',
      storeIcon: '🔌'
    },
    {
      id: '3',
      name: 'Designer Sunglasses',
      price: 159.99,
      originalPrice: 299.99,
      image: '🕶️',
      rating: 4.7,
      reviews: 892,
      category: 'Fashion',
      discount: '47%',
      badge: 'Hot Deal',
      store: 'Fashion Forward',
      storeIcon: '👗'
    },
    {
      id: '4',
      name: 'Leather Backpack',
      price: 79.99,
      originalPrice: 149.99,
      image: '🎒',
      rating: 4.6,
      reviews: 1234,
      category: 'Fashion',
      discount: '47%',
      badge: 'New',
      store: 'Fashion Forward',
      storeIcon: '👗'
    },
    {
      id: '5',
      name: 'Portable Speaker',
      price: 49.99,
      originalPrice: 89.99,
      image: '🔊',
      rating: 4.5,
      reviews: 567,
      category: 'Electronics',
      discount: '44%',
      badge: 'Sale',
      store: 'TechHub Electronics',
      storeIcon: '🔌'
    },
    {
      id: '6',
      name: 'Yoga Mat Premium',
      price: 39.99,
      originalPrice: 69.99,
      image: '🧘',
      rating: 4.4,
      reviews: 445,
      category: 'Sports',
      discount: '43%',
      badge: 'Deal',
      store: 'SportZone',
      storeIcon: '⚽'
    },
    {
      id: '7',
      name: 'LED Desk Lamp',
      price: 34.99,
      originalPrice: 59.99,
      image: '💡',
      rating: 4.3,
      reviews: 678,
      category: 'Home',
      discount: '42%',
      badge: 'Sale',
      store: 'Home Essentials',
      storeIcon: '🏠'
    },
    {
      id: '8',
      name: 'Skincare Set Deluxe',
      price: 129.99,
      originalPrice: 199.99,
      image: '💄',
      rating: 4.8,
      reviews: 1567,
      category: 'Beauty',
      discount: '35%',
      badge: 'Best Seller',
      store: 'Beauty Box',
      storeIcon: '💄'
    },
    {
      id: '9',
      name: 'Coffee Table Book',
      price: 24.99,
      originalPrice: 39.99,
      image: '📚',
      rating: 4.6,
      reviews: 234,
      category: 'Books',
      discount: '38%',
      badge: 'New',
      store: 'BookHaven',
      storeIcon: '📖'
    },
    {
      id: '10',
      name: 'Running Shoes Pro',
      price: 89.99,
      originalPrice: 149.99,
      image: '👟',
      rating: 4.7,
      reviews: 891,
      category: 'Sports',
      discount: '40%',
      badge: 'Hot Deal',
      store: 'SportZone',
      storeIcon: '⚽'
    }
  ];

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory;
    const storeMatch = selectedStore === 'All Stores' || product.store === selectedStore;
    return categoryMatch && storeMatch;
  });

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="View All Items" onBack={onBack} />

      <div className="px-5 -mt-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400/80" />
          <Input placeholder="Search products from all stores..." className="pl-10 bg-[#0a0a1a] border-slate-700/40 text-white" />
        </div>

        {/* Category Pills */}
        <div>
          <h3 className="text-white font-semibold text-xs mb-2">Categories</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === category
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-[#1a1a2e] text-gray-400 border border-slate-700/40 active:border-slate-600/40 active:text-white'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Store Filter - Horizontal Cards */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-white font-semibold text-sm">Filter by Store</h3>
            <span className="text-gray-400 text-xs">{stores.length} stores</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide -mx-5 px-5">
            {stores.map((store) => (
              <button
                key={store}
                onClick={() => setSelectedStore(store)}
                className="flex-shrink-0 w-20"
              >
                <Card className={`p-0 overflow-hidden transition-all ${selectedStore === store
                    ? 'bg-gradient-to-br from-purple-600 to-pink-500 border-0 shadow-lg shadow-purple-500/30'
                    : 'bg-[#1a1a2e] border-slate-700/40'
                  }`}>
                  <div className="p-3 text-center">
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-2xl flex items-center justify-center text-2xl ${selectedStore === store
                        ? 'bg-white/20 backdrop-blur-sm'
                        : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
                      }`}>
                      {store === 'All Stores' ? '🏬' :
                        store === 'TechHub Electronics' ? '🔌' :
                          store === 'Fashion Forward' ? '👗' :
                            store === 'Home Essentials' ? '🏠' :
                              store === 'Beauty Box' ? '💄' :
                                store === 'SportZone' ? '⚽' : '📖'}
                    </div>
                    <h4 className={`text-xs font-bold line-clamp-2 leading-tight h-4 ${selectedStore === store
                        ? 'text-white'
                        : 'text-gray-300'
                      }`}>
                      {store}
                    </h4>

                  </div>
                </Card>
              </button>
            ))}
          </div>
        </div>

        {/* Sort and View Toggle Bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-white font-semibold">{filteredProducts.length}</span>
            <span className="text-slate-400 text-sm">products</span>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#1a1a2e] border border-slate-700/40 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'
                  }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'
                  }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            {/* Sort Dropdown */}
            <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-[#1a1a2e] text-white text-sm px-3 py-2 rounded-lg border border-slate-700/40 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              {sortOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-2 gap-3 pb-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="p-0 bg-[#1a1a2e] border-slate-700/40 hover:bg-[#252540] hover:border-slate-600/40 transition-all cursor-pointer overflow-hidden">
                <div className="p-3">
                  {/* Product Image */}
                  <div className="relative mb-8">
                    <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-5xl">
                      {product.image}
                    </div>
                    {/* Badge - Top Left */}
                    {product.badge && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 text-[10px] p-1 font-semibold shadow-md">
                        {product.badge}
                      </Badge>
                    )}
                    {/* Discount - Top Right */}
                    {product.discount && (
                      <Badge className="absolute top-2 right-2 bg-green-500 text-white border-0 text-[10px] p-1 font-bold shadow-md">
                        -{product.discount}
                      </Badge>
                    )}
                    {/* Heart Button - Bottom Right */}
                    <button className="absolute bottom-3 right-2 w-7 h-7 mt-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <Heart className="w-4 h-4 text-slate-700" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="space-y-1 mt-7">
                    {/* Store Info */}
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px]">
                        {product.storeIcon}
                      </div>
                      <span className="text-gray-400 text-[10px] truncate">{product.store}</span>
                    </div>

                    <h4 className="text-white font-bold text-sm line-clamp-2 leading-snug h-9">
                      {product.name}
                    </h4>

                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      <span className="text-white text-xs font-bold">{product.rating}</span>
                      <span className="text-gray-400 text-[10px]">({product.reviews})</span>
                    </div>

                    <div className="flex items-baseline gap-1 pt-1">
                      <span className="text-white font-bold text-lg leading-none">${product.price}</span>
                      <span className="text-gray-500 text-xs line-through leading-none">${product.originalPrice}</span>
                    </div>

                    <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-1.5">
                      <ShoppingCart className="w-3 h-3" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Products List View */}
        {viewMode === 'list' && (
          <div className="space-y-3 pb-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="p-0 bg-[#1a1a2e] border-slate-700/40 hover:bg-[#252540] hover:border-slate-600/40 transition-all cursor-pointer overflow-hidden">
                <div className="p-3 flex gap-3">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl">
                      {product.image}
                    </div>
                    {product.badge && (
                      <div className="absolute top-1 left-1 bg-red-500 text-white text-[10px] px-2 py-1 rounded font-bold shadow-lg">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0 flex flex-col">
                    {/* Store Info */}
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px]">
                        {product.storeIcon}
                      </div>
                      <span className="text-gray-400 text-[10px] truncate">{product.store}</span>
                    </div>

                    <h4 className="text-white font-bold text-sm line-clamp-2 leading-snug mb-1">
                      {product.name}
                    </h4>

                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      <span className="text-white text-xs font-bold">{product.rating}</span>
                      <span className="text-gray-400 text-[10px]">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-white font-bold text-lg">${product.price}</span>
                        <span className="text-gray-500 text-[10px] line-through">${product.originalPrice}</span>
                        {product.discount && (
                          <span className="text-green-400 text-[10px] font-bold">-{product.discount}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button className=" bottom-3 right-2 w-7 h-7 cursor-pointer bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                          <Heart className="w-4 h-4 text-slate-700" />
                        </button>
                        <button className="w-full py-2 cursor-pointer bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-1.5">
                          <ShoppingCart className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


export function PopularItemScreen({ onBack }: ScreenProps) {
  const [selectedFilter, setSelectedFilter] = React.useState('All Time');
  const filters = ['All Time', 'This Week', 'This Month', 'Today'];

  const popularProducts = [
    {
      id: '1',
      name: 'Wireless Earbuds Pro Max',
      price: 89.99,
      originalPrice: 129.99,
      image: '🎧',
      rating: 4.9,
      reviews: 5234,
      discount: '31%',
      rank: 1,
      store: 'TechHub Electronics',
      storeIcon: '🔌',
      soldCount: '10k+',
      trendingScore: 98
    },
    {
      id: '2',
      name: 'Smart Watch Ultra',
      price: 249.99,
      originalPrice: 349.99,
      image: '⌚',
      rating: 4.8,
      reviews: 4567,
      discount: '29%',
      rank: 2,
      store: 'TechHub Electronics',
      storeIcon: '🔌',
      soldCount: '8k+',
      trendingScore: 95
    },
    {
      id: '3',
      name: 'Designer Sunglasses',
      price: 159.99,
      originalPrice: 299.99,
      image: '🕶️',
      rating: 4.8,
      reviews: 3892,
      discount: '47%',
      rank: 3,
      store: 'Fashion Forward',
      storeIcon: '👗',
      soldCount: '7k+',
      trendingScore: 92
    },
    {
      id: '4',
      name: 'Premium Leather Backpack',
      price: 79.99,
      originalPrice: 149.99,
      image: '🎒',
      rating: 4.7,
      reviews: 3234,
      discount: '47%',
      rank: 4,
      store: 'Fashion Forward',
      storeIcon: '👗',
      soldCount: '6.5k+',
      trendingScore: 89
    },
    {
      id: '5',
      name: 'Bluetooth Speaker Pro',
      price: 49.99,
      originalPrice: 89.99,
      image: '🔊',
      rating: 4.7,
      reviews: 2967,
      discount: '44%',
      rank: 5,
      store: 'TechHub Electronics',
      storeIcon: '🔌',
      soldCount: '6k+',
      trendingScore: 87
    },
    {
      id: '6',
      name: 'Yoga Mat Premium',
      price: 39.99,
      originalPrice: 69.99,
      image: '🧘',
      rating: 4.6,
      reviews: 2445,
      discount: '43%',
      rank: 6,
      store: 'SportZone',
      storeIcon: '⚽',
      soldCount: '5.5k+',
      trendingScore: 84
    }
  ];

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'from-yellow-500 to-orange-500';
    if (rank === 2) return 'from-gray-400 to-gray-500';
    if (rank === 3) return 'from-amber-600 to-yellow-700';
    return 'from-blue-500 to-purple-500';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '👑';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return '⭐';
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Popular Items" onBack={onBack} />

      <div className="px-5 mt-4 space-y-4">
        {/* Animated Header Banner */}
        <Card className="p-0 bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 border-0 overflow-hidden">
          <div className="p-5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-xl">Trending Now 🔥</h3>
                  <p className="text-white/80 text-xs">Most loved by customers</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Time Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${selectedFilter === filter
                  ? 'bg-gradient-to-r from-orange-600 to-red-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-[#1a1a2e] text-gray-400 border border-slate-700/40 active:text-white'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white font-bold text-sm">{popularProducts.length} Hot Items</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
            <span>Updated hourly</span>
          </div>
        </div>

        {/* Top 3 Podium Section */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {popularProducts.slice(0, 3).map((product) => (
            <div key={product.id} className="relative">
              <Card className={`p-0 border-0 overflow-hidden ${product.rank === 1 ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' :
                  product.rank === 2 ? 'bg-gradient-to-br from-gray-400/20 to-gray-500/20' :
                    'bg-gradient-to-br from-amber-600/20 to-yellow-700/20'
                }`}>
                <div className="p-3">
                  {/* Rank Badge */}
                  <div className={`absolute top-2 left-2 w-7 h-7 rounded-full bg-gradient-to-r ${getRankColor(product.rank)} flex items-center justify-center text-sm shadow-lg`}>
                    {getRankIcon(product.rank)}
                  </div>

                  {/* Product Image */}
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl mb-2 mt-2">
                    {product.image}
                  </div>

                  <h4 className="text-white font-bold text-[10px] line-clamp-2 leading-tight h-8 mb-1">
                    {product.name}
                  </h4>

                  <div className="flex items-center justify-center gap-0.5 mb-1">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-400 text-[10px] font-bold">{product.soldCount}</span>
                  </div>

                  <div className="text-center">
                    <span className="text-white font-bold text-sm">${product.price}</span>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Remaining Products Grid */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          {popularProducts.slice(3).map((product) => (
            <Card key={product.id} className="p-0 bg-[#1a1a2e] border-slate-700/40 hover:bg-[#252540] hover:border-slate-600/40 transition-all cursor-pointer overflow-hidden">
              <div className="p-3">
                {/* Product Image */}
                <div className="relative mb-2">
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-5xl">
                    {product.image}
                  </div>

                  {/* Rank Badge */}
                  <div className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                    <span className="text-white text-[10px] font-bold">#{product.rank}</span>
                  </div>

                  {/* Discount - Top Right */}
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 bg-green-500 text-white border-0 text-[10px] p-1 font-bold shadow-md">
                      -{product.discount}
                    </Badge>
                  )}
                  {/* Heart Button - Bottom Right */}
                  <button className="absolute bottom-3 right-2 w-7 h-7 mt-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-slate-700" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="space-y-1 mt-8">
                  {/* Store Info */}
                  <div className="flex items-center gap-1 mb-1">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px]">
                      {product.storeIcon}
                    </div>
                    <span className="text-gray-400 text-[10px] truncate">{product.store}</span>
                  </div>

                  <h4 className="text-white font-bold text-sm line-clamp-2 leading-snug h-9">
                    {product.name}
                  </h4>

                  {/* Rating and Trending Score */}
                  <div className="flex items-center justify-between gap-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                      <span className="text-white text-xs font-bold">{product.rating}</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <TrendingUp className="w-3 h-3 text-green-400" />
                      <span className="text-green-400 text-[10px] font-bold">{product.trendingScore}%</span>
                    </div>
                  </div>

                  {/* Sold Count */}
                  <div className="flex items-center gap-0.5">
                    <Flame className="w-3 h-3 text-orange-400" />
                    <span className="text-gray-400 text-[10px] font-semibold">{product.soldCount} sold</span>
                  </div>

                  <div className="flex items-baseline gap-1.5 pt-0.5">
                    <span className="text-white font-bold text-lg leading-none">${product.price}</span>
                    <span className="text-gray-500 text-[11px] line-through leading-none">${product.originalPrice}</span>
                  </div>

                  <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-1.5">
                    <ShoppingCart className="w-3 h-3" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ItemCampaignScreen({ onBack }: ScreenProps) {
  const [selectedCampaign, setSelectedCampaign] = React.useState('All');
  const campaigns = ['All', 'Flash Sale', 'Mega Deals', 'Clearance', 'Buy 1 Get 1'];

  const campaignProducts = [
    {
      id: '1',
      name: 'Wireless Earbuds Pro',
      price: 59.99,
      originalPrice: 129.99,
      image: '🎧',
      rating: 4.8,
      reviews: 2456,
      discount: '54%',
      campaign: 'Flash Sale',
      campaignColor: 'from-red-600 to-orange-500',
      store: 'TechHub Electronics',
      storeIcon: '🔌',
      timeLeft: '2h 45m',
      stock: 12,
      badge: 'Limited Stock'
    },
    {
      id: '2',
      name: 'Smart Watch Series 5',
      price: 179.99,
      originalPrice: 349.99,
      image: '⌚',
      rating: 4.9,
      reviews: 1823,
      discount: '49%',
      campaign: 'Mega Deals',
      campaignColor: 'from-purple-600 to-pink-500',
      store: 'TechHub Electronics',
      storeIcon: '🔌',
      timeLeft: '1d 5h',
      stock: 45,
      badge: 'Hot Deal'
    },
    {
      id: '3',
      name: 'Designer Sunglasses',
      price: 89.99,
      originalPrice: 299.99,
      image: '🕶️',
      rating: 4.7,
      reviews: 892,
      discount: '70%',
      campaign: 'Clearance',
      campaignColor: 'from-green-600 to-teal-500',
      store: 'Fashion Forward',
      storeIcon: '👗',
      timeLeft: '3d 12h',
      stock: 8,
      badge: 'Final Sale'
    },
    {
      id: '4',
      name: 'Premium Backpack',
      price: 49.99,
      originalPrice: 149.99,
      image: '🎒',
      rating: 4.6,
      reviews: 1234,
      discount: '67%',
      campaign: 'Clearance',
      campaignColor: 'from-green-600 to-teal-500',
      store: 'Fashion Forward',
      storeIcon: '👗',
      timeLeft: '3d 12h',
      stock: 23,
      badge: 'Last Chance'
    },
    {
      id: '5',
      name: 'Bluetooth Speaker',
      price: 29.99,
      originalPrice: 89.99,
      image: '🔊',
      rating: 4.5,
      reviews: 567,
      discount: '67%',
      campaign: 'Buy 1 Get 1',
      campaignColor: 'from-blue-600 to-cyan-500',
      store: 'TechHub Electronics',
      storeIcon: '🔌',
      timeLeft: '12h 30m',
      stock: 67,
      badge: 'BOGO'
    },
    {
      id: '6',
      name: 'Yoga Mat Set',
      price: 24.99,
      originalPrice: 69.99,
      image: '🧘',
      rating: 4.4,
      reviews: 445,
      discount: '64%',
      campaign: 'Flash Sale',
      campaignColor: 'from-red-600 to-orange-500',
      store: 'SportZone',
      storeIcon: '⚽',
      timeLeft: '4h 15m',
      stock: 19,
      badge: 'Flash Deal'
    }
  ];

  const filteredProducts = selectedCampaign === 'All'
    ? campaignProducts
    : campaignProducts.filter(product => product.campaign === selectedCampaign);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Campaign Items" onBack={onBack} />

      <div className="px-5 mt-4 space-y-4">
        {/* Campaign Hero Banner */}
        <Card className="p-0 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 border-0 overflow-hidden">
          <div className="p-5 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Zap className="w-6 h-6 text-yellow-300" />
                    <h3 className="text-white font-bold text-xl">Special Campaigns</h3>
                  </div>
                  <p className="text-white/90 text-sm">Limited time offers & exclusive deals</p>
                </div>
                <Badge className="bg-white/30 text-white border-0 backdrop-blur-sm px-3 py-1">
                  <Clock className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Campaign Filter Pills */}
        <div>
          <h3 className="text-white font-semibold text-xs mb-2">Campaign Types</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-5 px-5">
            {campaigns.map((campaign) => (
              <button
                key={campaign}
                onClick={() => setSelectedCampaign(campaign)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${selectedCampaign === campaign
                    ? 'bg-gradient-to-r from-red-600 to-pink-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-[#1a1a2e] text-gray-400 border border-slate-700/40 active:text-white'
                  }`}
              >
                {campaign}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-white font-bold text-sm">{filteredProducts.length} Active Deals</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Refresh daily</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-3 pb-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-0 bg-[#1a1a2e] border-slate-700/40 hover:bg-[#252540] hover:border-slate-600/40 transition-all cursor-pointer overflow-hidden">
              <div className="p-3">
                {/* Product Image */}
                <div className="relative mb-6">
                  <div className="w-full aspect-square rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-5xl">
                    {product.image}
                  </div>

                  {/* Campaign Badge - Top Left */}
                  {product.badge && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 text-[10px] p-1 font-semibold shadow-md">
                      {product.badge}
                    </Badge>
                  )}
                  {/* Discount - Top Right */}
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 bg-green-500 text-white border-0 text-[10px] p-1 font-bold shadow-md">
                      -{product.discount}
                    </Badge>
                  )}
                  {/* Heart Button - Bottom Right */}
                  <button className="absolute bottom-3 right-2 w-7 h-7 mt-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                    <Heart className="w-4 h-4 text-slate-700" />
                  </button>
                </div>

                {/* Product Info */}
                <div className="space-y-1 mt-8">
                  {/* Store Info */}
                  <div className="flex items-center gap-1 mb-1 mt-6">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-[10px]">
                      {product.storeIcon}
                    </div>
                    <span className="text-gray-400 text-[10px] truncate">{product.store}</span>
                  </div>

                  <h4 className="text-white font-bold text-sm line-clamp-2 leading-snug h-9">
                    {product.name}
                  </h4>

                  {/* Timer and Stock */}
                  <div className="flex items-center justify-between gap-1 py-1">
                    <div className="flex items-center gap-0.5">
                      <Clock className="w-3 h-3 text-orange-400" />
                      <span className="text-orange-400 text-[10px] font-bold">{product.timeLeft}</span>
                    </div>
                    <div className={`flex items-center gap-0.5 ${product.stock < 15 ? 'text-red-400' : 'text-gray-400'}`}>
                      <Package className="w-3 h-3" />
                      <span className="text-[10px] font-semibold">{product.stock} left</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                    <span className="text-white text-xs font-bold">{product.rating}</span>
                    <span className="text-gray-400 text-[10px]">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1.5 pt-0.5">
                    <span className="text-white font-bold text-lg leading-none">${product.price}</span>
                    <span className="text-gray-500 text-[11px] line-through leading-none">${product.originalPrice}</span>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full mt-2 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all flex items-center justify-center gap-1.5">
                    <ShoppingCart className="w-3 h-3" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CategoryScreen({ onBack }: ScreenProps) {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch categories from API
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const categoryData = await itemService.getLatestProducts?.() || [];
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to mock data if API fails
        setCategories([
          { id: 1, name: 'Electronics' },
          { id: 2, name: 'Home' },
          { id: 3, name: 'Fashion' },
          { id: 4, name: 'Design' },
          { id: 5, name: 'Development' },
          { id: 6, name: 'Marketing' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Categories" onBack={onBack} />
      <div className="px-5 -mt-4 grid grid-cols-3 gap-3">
        {categories.map((category) => (
          <Card key={category.id} className="p-3 bg-[#1a1a2e] border-slate-700/40 text-center">
            <p className="text-xs text-white">{category.name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CategoryItemScreen({ onBack }: ScreenProps) {
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch products from API
  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productData = await itemService.getLatestProducts();
        setProducts(productData);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data if API fails
        setProducts([
          ...Array(8).keys()].map(i => ({
            id: i + 1,
            name: `Item #${i + 1}`,
            category: 'Category'
          })));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Category Items" onBack={onBack} />
      <div className="px-5 -mt-4 grid grid-cols-2 gap-3">
        {products.map((product) => (
          <Card key={product.id} className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-white">{product.name}</p>
            <p className="text-xs text-slate-400">{product.category}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function GlobalSearchScreen({ onBack }: ScreenProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const results = await itemService.searchProducts(searchQuery);
      setSearchResults(results);
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger search when query changes (with debounce)
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Search" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400/80" />
          <Input
            placeholder="Search products, services, stores..."
            className="pl-10 bg-[#0a0a1a] border-slate-700/40 text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-4">
            <p className="text-slate-400">Searching...</p>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="space-y-3">
            {searchResults.map((item) => (
              <Card key={item.id} className="p-4 bg-[#1a1a2e] border-slate-700/40">
                <p className="text-sm text-white">{item.name}</p>
                <p className="text-xs text-slate-400">{item.category || 'Product'}</p>
              </Card>
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">No results found for "{searchQuery}"</p>
          </Card>
        ) : (
          <Card className="p-5 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Start typing to search for products, services, or stores</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export function FavouriteScreen({ onBack }: ScreenProps) {
  const [wishlistItems, setWishlistItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch wishlist items from API
  React.useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const wishlistData = await wishlistService.getWishlist();
        setWishlistItems(wishlistData);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
        // Fallback to mock data if API fails
        setWishlistItems([
          ...Array(5).keys()].map(i => ({
            id: i + 1,
            name: `Favourite Item #${i + 1}`
          })));
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Favourites" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-3">
        {wishlistItems.map((item) => (
          <Card key={item.id} className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-white">{item.name || item.item?.name}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function MyOrdersScreen({ onBack, onNavigate }: ScreenProps) {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch orders from API
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orderResponse = await orderService.getOrderHistory();
        
        if (orderResponse && orderResponse.orders) {
          setOrders(orderResponse.orders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewOrder = (orderId: number) => {
    localStorage.setItem('selectedOrderId', orderId.toString());
    onNavigate('order-details');
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="My Orders" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading orders...</p>
          </Card>
        ) : orders.length === 0 ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-slate-500 mx-auto mb-3" />
              <p className="text-sm text-slate-300 mb-1">No orders yet</p>
              <p className="text-xs text-slate-400">Your order history will appear here</p>
            </div>
          </Card>
        ) : (
          orders.map((order) => (
            <Card 
              key={order.id} 
              className="p-4 bg-[#1a1a2e] border-slate-700/40"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-sm font-semibold text-white">Order #{order.id}</span>
                  <p className="text-xs text-slate-400 mt-0.5">Placed on {formatDate(order.created_at)}</p>
                </div>
                <Badge className="bg-green-500/20 text-green-300 border-0 text-xs">
                  {order.order_status?.replace('_', ' ') || 'Confirmed'}
                </Badge>
              </div>

              {/* Order Items - Show first 2 items */}
              <div className="space-y-2 mb-3">
                {order.order_items && order.order_items.length > 0 ? (
                  order.order_items.slice(0, 2).map((item: any, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-2 bg-[#0f0f1a] rounded-lg">
                      {/* Item Image */}
                      <div className="w-16 h-16 rounded-lg bg-slate-700/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                        {item.item?.image ? (
                          <img
                            src={item.item.image}
                            alt={item.item?.name || item.item_details}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = '<div class="text-2xl">📦</div>';
                            }}
                          />
                        ) : (
                          <Package className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm text-white font-semibold mb-1">
                          {item.item?.name || item.item_details || 'Order Item'}
                        </h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-slate-400">Qty: {item.quantity || 1}</span>
                          <span className="text-sm text-white font-semibold">
                            ${(item.price || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400">No items found</p>
                )}
                
                {/* Show more items indicator */}
                {order.order_items && order.order_items.length > 2 && (
                  <p className="text-xs text-blue-400 pl-1">
                    +{order.order_items.length - 2} more item{order.order_items.length - 2 > 1 ? 's' : ''}
                  </p>
                )}
              </div>

              {/* Order Summary */}
              <div className="border-t border-slate-700/50 pt-3 space-y-2 mb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 font-medium">Total Items:</span>
                  <span className="text-sm text-white font-semibold">{order.order_items?.length || 0} items</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 font-medium">Order Total:</span>
                  <span className="text-lg text-white font-bold">
                    ${(order.order_amount || 0).toFixed(2)}
                  </span>
                </div>
                {order.id && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Tracking ID:</span>
                    <span className="text-xs text-blue-400 font-medium">#{order.id}</span>
                  </div>
                )}
              </div>

              {/* View Details Button */}
              <Button
                onClick={() => handleViewOrder(order.id)}
                variant="outline"
                size="sm"
                className="w-full bg-blue-600/10 border-blue-500/30 text-blue-400 hover:bg-blue-600/20 font-medium"
              >
                View Full Details
              </Button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}




export { OrderScreen, OrderDetailsScreen, OrderTrackingScreen, GuestTrackOrderScreen } from './OrderScreens';

export function RefundRequestScreen({ onBack, onNavigate }: ScreenProps) {
  const [orderId, setOrderId] = React.useState(() => localStorage.getItem('selectedOrderId') ?? '');
  const [refundReasons, setRefundReasons] = React.useState<any[]>([]);
  const [selectedReason, setSelectedReason] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [image, setImage] = React.useState<File | null>(null);
  const [loadingReasons, setLoadingReasons] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    const fetchReasons = async () => {
      try {
        setLoadingReasons(true);
        const reasons = await orderService.getRefundReasons();
        if (!cancelled) setRefundReasons(Array.isArray(reasons) ? reasons : []);
      } catch {
        if (!cancelled) setRefundReasons([]);
      } finally {
        if (!cancelled) setLoadingReasons(false);
      }
    };
    fetchReasons();
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async () => {
    const trimmedOrderId = orderId.trim();
    const reasonText = selectedReason.trim() || details.trim();
    if (!trimmedOrderId) {
      toast.error("Order ID is required");
      return;
    }
    if (!reasonText) {
      toast.error("Refund reason is required");
      return;
    }
    try {
      setSubmitting(true);
      const ok = await orderService.submitRefundRequest(trimmedOrderId, reasonText, image ?? undefined);
      if (!ok) {
        toast.error("Refund request failed");
        return;
      }
      toast.success("Refund request submitted");
      onNavigate('orders');
    } catch {
      toast.error("Refund request failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Refund Request" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
          <Input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID"
            className="bg-[#0a0a1a] border-slate-700/40 text-white"
          />

          <div className="space-y-2">
            <div className="text-xs text-slate-400">
              {loadingReasons ? 'Loading reasons…' : refundReasons.length > 0 ? 'Refund reason' : 'Refund reason'}
            </div>
            <Select value={selectedReason} onValueChange={setSelectedReason}>
              <SelectTrigger className="w-full bg-[#0a0a1a] border-slate-700/40 text-white">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-slate-700/40 text-white">
                {refundReasons.map((r: any) => (
                  <SelectItem
                    key={r?.id ?? r?.reason ?? r?.name}
                    value={String(r?.reason ?? r?.name ?? '')}
                    className="text-white focus:bg-blue-600/20 focus:text-white"
                  >
                    {String(r?.reason ?? r?.name ?? '')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-400">Details (optional)</div>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={3}
              placeholder="Add extra details for your request"
              className="w-full rounded-md bg-[#0a0a1a] border border-slate-700/40 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>

          <div className="rounded-lg border border-slate-700/40 bg-[#0a0a1a] p-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] ?? null)}
              className="w-full text-xs text-slate-300"
            />
            <div className="mt-2 text-xs text-slate-500">
              {image ? `Selected: ${image.name}` : 'Upload an image (optional).'}
            </div>
          </div>

          <Button onClick={submit} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit'}
          </Button>
        </Card>
      </div>
    </div>
  );
}

export function PaymentScreen({ onBack, onNavigate }: ScreenProps) {
  const [paymentMethod, setPaymentMethod] = React.useState<'wallet' | 'cash_on_delivery' | 'digital_payment' | 'offline_payment'>(() => {
    const stored = localStorage.getItem('paymentMethod');
    if (stored === 'wallet' || stored === 'cash_on_delivery' || stored === 'digital_payment' || stored === 'offline_payment') {
      return stored;
    }
    return 'wallet';
  });
  const [orderId, setOrderId] = React.useState(() => localStorage.getItem('selectedOrderId') ?? '');
  const [paymentUrl, setPaymentUrl] = React.useState(() => localStorage.getItem('paymentWebviewUrl') ?? '');
  const [order, setOrder] = React.useState<any>(null);
  const [loadingOrder, setLoadingOrder] = React.useState(false);

  React.useEffect(() => {
    const nextOrderId = (localStorage.getItem('selectedOrderId') ?? '').toString();
    if (nextOrderId && nextOrderId !== orderId) setOrderId(nextOrderId);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const fetchOrder = async () => {
      const trimmed = orderId.trim();
      if (!trimmed) {
        setOrder(null);
        return;
      }

      try {
        setLoadingOrder(true);
        try {
          const details = await orderService.getOrderDetails(trimmed);
          const first = Array.isArray(details) ? details[0] : (details as any);
          if (!cancelled) setOrder(first ?? null);
          if (!cancelled && paymentMethod === 'digital_payment' && !paymentUrl.trim()) {
            const maybeUrl = (first as any)?.payment_url ?? (first as any)?.paymentUrl ?? (first as any)?.payment_link;
            if (typeof maybeUrl === 'string' && maybeUrl.trim()) setPaymentUrl(maybeUrl.trim());
          }
          return;
        } catch {}

        const res = await orderService.getOrderHistory();
        const found = (res?.orders ?? []).find((o: any) => String(o?.id) === trimmed) ?? null;
        if (!cancelled) setOrder(found);
        if (!cancelled && paymentMethod === 'digital_payment' && !paymentUrl.trim()) {
          const maybeUrl = (found as any)?.payment_url ?? (found as any)?.paymentUrl ?? (found as any)?.payment_link;
          if (typeof maybeUrl === 'string' && maybeUrl.trim()) setPaymentUrl(maybeUrl.trim());
        }
      } catch {
        if (!cancelled) setOrder(null);
      } finally {
        if (!cancelled) setLoadingOrder(false);
      }
    };

    fetchOrder();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  React.useEffect(() => {
    if (paymentMethod !== 'digital_payment') return;
    if (paymentUrl.trim()) return;
    if (!order) return;
    const maybeUrl = (order as any)?.payment_url ?? (order as any)?.paymentUrl ?? (order as any)?.payment_link;
    if (typeof maybeUrl === 'string' && maybeUrl.trim()) setPaymentUrl(maybeUrl.trim());
  }, [order, paymentMethod, paymentUrl]);

  const persist = () => {
    try { localStorage.setItem('paymentMethod', paymentMethod); } catch {}
    try { localStorage.setItem('paymentWebviewUrl', paymentUrl); } catch {}
    try { localStorage.setItem('selectedOrderId', orderId.trim()); } catch {}
  };

  const proceed = () => {
    persist();
    if (paymentMethod === 'digital_payment') {
      const fallbackUrl =
        (order as any)?.payment_url ??
        (order as any)?.paymentUrl ??
        (order as any)?.payment_link ??
        '';
      const url = (paymentUrl.trim() || String(fallbackUrl ?? '').trim()).trim();
      if (!/^https?:\/\//i.test(url)) {
        toast.error("Enter a valid payment URL", { description: "URL must start with http:// or https://." });
        return;
      }
      try { localStorage.setItem('paymentWebviewUrl', url); } catch {}
      onNavigate('payment-webview');
      return;
    }
    if (paymentMethod === 'offline_payment') {
      onNavigate('offline-payment');
      return;
    }

    toast.success("Payment method selected", {
      description: paymentMethod === 'wallet' ? "Wallet payment will be used." : "Cash on delivery will be used."
    });
    onNavigate('orders');
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Payment" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <div className="flex-1">
              <p className="text-sm text-white font-semibold">Choose payment method</p>
              <p className="text-xs text-slate-400">Used for your next payment action.</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('wallet')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                paymentMethod === 'wallet'
                  ? 'border-blue-600 bg-blue-600/10'
                  : 'border-slate-700/40 bg-transparent hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'wallet' ? 'bg-blue-600' : 'bg-slate-700/50'}`}>
                    <Wallet className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-semibold">Wallet</p>
                    <p className="text-xs text-slate-400">Instant payment from wallet balance</p>
                  </div>
                </div>
                {paymentMethod === 'wallet' && <Check className="w-5 h-5 text-blue-400" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('cash_on_delivery')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                paymentMethod === 'cash_on_delivery'
                  ? 'border-blue-600 bg-blue-600/10'
                  : 'border-slate-700/40 bg-transparent hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'cash_on_delivery' ? 'bg-blue-600' : 'bg-slate-700/50'}`}>
                    <Truck className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-semibold">Cash on Delivery</p>
                    <p className="text-xs text-slate-400">Pay when the order arrives</p>
                  </div>
                </div>
                {paymentMethod === 'cash_on_delivery' && <Check className="w-5 h-5 text-blue-400" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('digital_payment')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                paymentMethod === 'digital_payment'
                  ? 'border-blue-600 bg-blue-600/10'
                  : 'border-slate-700/40 bg-transparent hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'digital_payment' ? 'bg-blue-600' : 'bg-slate-700/50'}`}>
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-semibold">Digital Payment</p>
                    <p className="text-xs text-slate-400">Pay via hosted payment page</p>
                  </div>
                </div>
                {paymentMethod === 'digital_payment' && <Check className="w-5 h-5 text-blue-400" />}
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('offline_payment')}
              className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                paymentMethod === 'offline_payment'
                  ? 'border-blue-600 bg-blue-600/10'
                  : 'border-slate-700/40 bg-transparent hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === 'offline_payment' ? 'bg-blue-600' : 'bg-slate-700/50'}`}>
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-white font-semibold">Offline Payment</p>
                    <p className="text-xs text-slate-400">Bank transfer / deposit with receipt</p>
                  </div>
                </div>
                {paymentMethod === 'offline_payment' && <Check className="w-5 h-5 text-blue-400" />}
              </div>
            </button>
          </div>
        </Card>

        <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white font-semibold">Payment context</p>
            {loadingOrder ? (
              <span className="text-xs text-slate-400">Loading…</span>
            ) : order ? (
              <span className="text-xs text-green-300">Order found</span>
            ) : orderId.trim() ? (
              <span className="text-xs text-yellow-300">Order not found</span>
            ) : (
              <span className="text-xs text-slate-400">Optional</span>
            )}
          </div>

          <div className="space-y-2">
            <Input
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="Order ID (optional)"
              className="bg-[#0a0a1a] border-slate-700/40 text-white"
            />

            {paymentMethod === 'digital_payment' && (
              <Input
                value={paymentUrl}
                onChange={(e) => setPaymentUrl(e.target.value)}
                placeholder="Payment URL (https://...)"
                className="bg-[#0a0a1a] border-slate-700/40 text-white"
              />
            )}
          </div>

          {order && (
            <div className="pt-3 border-t border-slate-700/40 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Order</span>
                <span className="text-white">#{order.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Total</span>
                <span className="text-white">${Number(order.order_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Status</span>
                <span className="text-white capitalize">{String(order.payment_status || 'unpaid').replace('_', ' ')}</span>
              </div>
            </div>
          )}

          <Button onClick={proceed} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Continue
          </Button>
        </Card>
      </div>
    </div>
  );
}

export function PaymentWebviewScreen({ onBack, onNavigate }: ScreenProps) {
  const [paymentUrl, setPaymentUrl] = React.useState(() => localStorage.getItem('paymentWebviewUrl') ?? '');
  const url = paymentUrl.trim();
  const isValidUrl = /^https?:\/\//i.test(url);

  React.useEffect(() => {
    try { localStorage.setItem('paymentWebviewUrl', paymentUrl); } catch {}
  }, [paymentUrl]);

  const openExternal = () => {
    if (!isValidUrl) {
      toast.error("Enter a valid payment URL", { description: "URL must start with http:// or https://." });
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const markComplete = () => {
    toast.success("Payment marked as complete", { description: "If applicable, your order will update after verification." });
    onNavigate('orders');
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Payment Webview" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
          <p className="text-sm text-white font-semibold">Hosted payment page</p>
          <Input
            value={paymentUrl}
            onChange={(e) => setPaymentUrl(e.target.value)}
            placeholder="Payment URL (https://...)"
            className="bg-[#0a0a1a] border-slate-700/40 text-white"
          />

          <div className="flex gap-2">
            <Button onClick={() => onNavigate('payment')} variant="outline" className="flex-1 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50">
              Back
            </Button>
            <Button onClick={openExternal} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
              Open
            </Button>
          </div>
        </Card>

        <Card className="p-3 bg-[#1a1a2e] border border-slate-700/40 overflow-hidden">
          {isValidUrl ? (
            <iframe
              src={url}
              title="Payment"
              className="w-full h-[520px] rounded-lg bg-[#0a0a1a]"
              sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          ) : (
            <div className="p-4 text-sm text-slate-300">
              Enter a valid payment URL to load the page here.
            </div>
          )}
        </Card>

        <Button onClick={markComplete} className="w-full bg-green-600 hover:bg-green-700 text-white">
          I Completed Payment
        </Button>
      </div>
    </div>
  );
}

export function OfflinePaymentScreen({ onBack, onNavigate }: ScreenProps) {
  const [orderId, setOrderId] = React.useState(() => localStorage.getItem('selectedOrderId') ?? '');
  const [reference, setReference] = React.useState('');
  const [note, setNote] = React.useState('');
  const [receipt, setReceipt] = React.useState<File | null>(null);

  const submit = () => {
    const trimmedRef = reference.trim();
    if (!trimmedRef) {
      toast.error("Reference is required", { description: "Add the transaction/reference number from your receipt." });
      return;
    }
    try { localStorage.setItem('selectedOrderId', orderId.trim()); } catch {}
    toast.success("Offline payment submitted", { description: "Your payment will be verified shortly." });
    onNavigate('orders');
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Offline Payment" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
          <p className="text-sm text-white font-semibold">Bank transfer / deposit details</p>
          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account name</span>
              <span className="text-white">Bery Marketplace</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Bank</span>
              <span className="text-white">Bery Bank</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account number</span>
              <button
                type="button"
                onClick={async () => {
                  try { await navigator.clipboard.writeText('000123456789'); } catch {}
                  toast.success("Copied account number");
                }}
                className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
              >
                000123456789 <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
          <p className="text-sm text-white font-semibold">Submit proof</p>
          <Input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID (optional)"
            className="bg-[#0a0a1a] border-slate-700/40 text-white"
          />
          <Input
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Transaction / Reference number"
            className="bg-[#0a0a1a] border-slate-700/40 text-white"
          />
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note (optional)"
            className="bg-[#0a0a1a] border-slate-700/40 text-white"
          />
          <div className="rounded-lg border border-slate-700/40 bg-[#0a0a1a] p-3">
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setReceipt(e.target.files?.[0] ?? null)}
              className="w-full text-xs text-slate-300"
            />
            <div className="mt-2 text-xs text-slate-500">
              {receipt ? `Selected: ${receipt.name}` : 'Upload a receipt screenshot or PDF (optional).'}
            </div>
          </div>

          <Button onClick={submit} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            Submit
          </Button>
        </Card>
      </div>
    </div>
  );
}

export function ProfileViewScreen({ onBack, onNavigate }: ScreenProps) {
  const [loading, setLoading] = React.useState(true);
  const [customer, setCustomer] = React.useState<any>(null);

  React.useEffect(() => {
    let cancelled = false;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const info = await customerService.getCustomerInfo();
        if (!cancelled) setCustomer(info);
      } catch {
        if (!cancelled) setCustomer(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  const fullName = customer ? `${customer.f_name ?? ''} ${customer.l_name ?? ''}`.trim() : 'Guest';

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Profile" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading profile...</p>
          </Card>
        ) : (
          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
                <User className="w-6 h-6 text-blue-300" />
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-base truncate">{fullName || 'Guest'}</p>
                <p className="text-xs text-slate-400 truncate">{customer?.email || 'No email'}</p>
                <p className="text-xs text-slate-400 truncate">{customer?.phone || 'No phone'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg bg-[#0a0a1a] border border-slate-700/40 p-3">
                <p className="text-slate-400">Orders</p>
                <p className="text-white font-semibold text-sm">{customer?.order_count ?? 0}</p>
              </div>
              <div className="rounded-lg bg-[#0a0a1a] border border-slate-700/40 p-3">
                <p className="text-slate-400">Loyalty Points</p>
                <p className="text-white font-semibold text-sm">{customer?.loyalty_point ?? 0}</p>
              </div>
              <div className="rounded-lg bg-[#0a0a1a] border border-slate-700/40 p-3">
                <p className="text-slate-400">Wallet Balance</p>
                <p className="text-white font-semibold text-sm">${Number(customer?.wallet_balance ?? 0).toFixed(2)}</p>
              </div>
              <div className="rounded-lg bg-[#0a0a1a] border border-slate-700/40 p-3">
                <p className="text-slate-400">Member Since</p>
                <p className="text-white font-semibold text-sm">{customer?.member_since || 'N/A'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onNavigate('update-profile')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Edit Profile
              </Button>
              <Button
                onClick={() => onNavigate('address-list')}
                variant="outline"
                className="flex-1 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
              >
                Addresses
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export function UpdateProfileScreen({ onBack, onNavigate }: ScreenProps) {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [image, setImage] = React.useState<File | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const info = await customerService.getCustomerInfo();
        if (cancelled) return;
        setFirstName(String(info?.f_name ?? ''));
        setLastName(String(info?.l_name ?? ''));
        setEmail(String(info?.email ?? ''));
      } catch {
        if (!cancelled) {
          setFirstName('');
          setLastName('');
          setEmail('');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const save = async () => {
    const f = firstName.trim();
    const l = lastName.trim();
    const e = email.trim();
    if (!f || !l) {
      toast.error("First and last name are required");
      return;
    }
    if (!e) {
      toast.error("Email is required");
      return;
    }
    try {
      setSaving(true);
      await customerService.updateProfile({ f_name: f, l_name: l, email: e, image: image ?? undefined });
      toast.success("Profile updated");
      onNavigate('profile-view');
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Update Profile" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-3">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading profile...</p>
          </Card>
        ) : (
          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First name"
              className="bg-[#0a0a1a] border-slate-700/40 text-white"
            />
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last name"
              className="bg-[#0a0a1a] border-slate-700/40 text-white"
            />
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-[#0a0a1a] border-slate-700/40 text-white"
            />

            <div className="rounded-lg border border-slate-700/40 bg-[#0a0a1a] p-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] ?? null)}
                className="w-full text-xs text-slate-300"
              />
              <div className="mt-2 text-xs text-slate-500">{image ? `Selected: ${image.name}` : 'Upload profile photo (optional).'}</div>
            </div>

            <Button onClick={save} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export function AddressScreen({ onBack, onNavigate }: ScreenProps) {
  const [addresses, setAddresses] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const refresh = React.useCallback(async () => {
    try {
      setLoading(true);
      const list = await customerService.getAddressList();
      setAddresses(Array.isArray(list) ? list : []);
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    refresh();
  }, []);

  const onAdd = () => {
    try { localStorage.removeItem('editingAddressId'); } catch {}
    onNavigate('add-address');
  };

  const onEdit = (id: number) => {
    try { localStorage.setItem('editingAddressId', String(id)); } catch {}
    onNavigate('add-address');
  };

  const onDelete = async (id: number) => {
    const ok = window.confirm('Delete this address?');
    if (!ok) return;
    try {
      await customerService.deleteAddress(id);
      toast.success("Address deleted");
      setAddresses((prev) => prev.filter((a: any) => Number(a?.id) !== id));
    } catch {
      toast.error("Failed to delete address");
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Addresses" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-3">
        <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40">
          <div className="flex items-center justify-between">
            <p className="text-sm text-white font-semibold">Saved addresses</p>
            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              className="bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </Card>

        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading addresses...</p>
          </Card>
        ) : addresses.length === 0 ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">No addresses found.</p>
          </Card>
        ) : (
          addresses.map((a: any) => (
            <Card key={a?.id} className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm text-white font-semibold capitalize">{String(a?.address_type ?? 'address')}</p>
                  <p className="text-xs text-slate-300 break-words">{String(a?.address ?? '')}</p>
                  <p className="text-xs text-slate-500">{String(a?.contact_person_name ?? '')} • {String(a?.contact_person_number ?? '')}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(Number(a?.id))}
                    className="bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(Number(a?.id))}
                    className="bg-transparent border-red-500/40 text-red-300 hover:bg-red-500/10"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}

        <Button onClick={onAdd} className="bg-blue-600 hover:bg-blue-700 text-white w-full">
          Add New Address
        </Button>
      </div>
    </div>
  );
}

export function AddAddressScreen({ onBack, onNavigate }: ScreenProps) {
  const [saving, setSaving] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [editingId, setEditingId] = React.useState<number | null>(() => {
    const stored = localStorage.getItem('editingAddressId');
    return stored && !Number.isNaN(Number(stored)) ? Number(stored) : null;
  });

  const [contactPersonName, setContactPersonName] = React.useState('');
  const [contactPersonNumber, setContactPersonNumber] = React.useState('');
  const [addressType, setAddressType] = React.useState('home');
  const [address, setAddress] = React.useState('');
  const [latitude, setLatitude] = React.useState('');
  const [longitude, setLongitude] = React.useState('');
  const [zoneId, setZoneId] = React.useState<number>(() => {
    const raw = localStorage.getItem('zoneId');
    if (!raw) return 1;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return Number(parsed[0]) || 1;
      return Number(parsed) || 1;
    } catch {
      return 1;
    }
  });

  React.useEffect(() => {
    let cancelled = false;
    const loadExisting = async (id: number) => {
      try {
        setLoading(true);
        const list = await customerService.getAddressList();
        const found = (Array.isArray(list) ? list : []).find((a: any) => Number(a?.id) === id);
        if (!found || cancelled) return;
        setContactPersonName(String(found.contact_person_name ?? ''));
        setContactPersonNumber(String(found.contact_person_number ?? ''));
        setAddressType(String(found.address_type ?? 'home'));
        setAddress(String(found.address ?? ''));
        setLatitude(String(found.latitude ?? ''));
        setLongitude(String(found.longitude ?? ''));
        setZoneId(Number(found.zone_id ?? zoneId) || zoneId);
      } catch {
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (editingId) loadExisting(editingId);
    return () => {
      cancelled = true;
    };
  }, [editingId]);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not available");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(String(pos.coords.latitude));
        setLongitude(String(pos.coords.longitude));
        toast.success("Location added");
      },
      () => {
        toast.error("Failed to get location");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const save = async () => {
    const name = contactPersonName.trim();
    const phone = contactPersonNumber.trim();
    const addr = address.trim();
    if (!name || !phone || !addr) {
      toast.error("Name, phone, and address are required");
      return;
    }
    const payload = {
      contact_person_name: name,
      contact_person_number: phone,
      address_type: addressType,
      address: addr,
      latitude: latitude.trim() || '0',
      longitude: longitude.trim() || '0',
      zone_id: Number(zoneId) || 1,
    };

    try {
      setSaving(true);
      if (editingId) {
        await customerService.updateAddress(editingId, payload);
        toast.success("Address updated");
      } else {
        await customerService.addAddress(payload);
        toast.success("Address added");
      }
      try { localStorage.removeItem('editingAddressId'); } catch {}
      onNavigate('address-list');
    } catch {
      toast.error(editingId ? "Failed to update address" : "Failed to add address");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title={editingId ? "Edit Address" : "Add Address"} onBack={onBack} />
      <div className="px-5 -mt-4 space-y-3">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading address...</p>
          </Card>
        ) : (
          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
            <Input
              value={contactPersonName}
              onChange={(e) => setContactPersonName(e.target.value)}
              placeholder="Contact person name"
              className="bg-[#0a0a1a] border-slate-700/40 text-white"
            />
            <Input
              value={contactPersonNumber}
              onChange={(e) => setContactPersonNumber(e.target.value)}
              placeholder="Contact person number"
              className="bg-[#0a0a1a] border-slate-700/40 text-white"
            />

            <div className="space-y-2">
              <div className="text-xs text-slate-400">Address type</div>
              <select
                value={addressType}
                onChange={(e) => setAddressType(e.target.value)}
                className="w-full rounded-md bg-[#0a0a1a] border border-slate-700/40 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
                <option value="other">Other</option>
              </select>
            </div>

            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              placeholder="Full address"
              className="w-full rounded-md bg-[#0a0a1a] border border-slate-700/40 text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />

            <div className="grid grid-cols-2 gap-2">
              <Input
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude"
                className="bg-[#0a0a1a] border-slate-700/40 text-white"
              />
              <Input
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude"
                className="bg-[#0a0a1a] border-slate-700/40 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Input
                value={String(zoneId)}
                onChange={(e) => setZoneId(Number(e.target.value) || 1)}
                placeholder="Zone ID"
                className="bg-[#0a0a1a] border-slate-700/40 text-white"
              />
              <Button
                type="button"
                variant="outline"
                onClick={useCurrentLocation}
                className="bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
              >
                Use GPS
              </Button>
            </div>

            <Button onClick={save} className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={saving}>
              {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Save Address'}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

export function RewardsScreen({ onBack, onNavigate }: ScreenProps) {
  const [loading, setLoading] = React.useState(true);
  const [customer, setCustomer] = React.useState<any>(null);

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const info = await customerService.getCustomerInfo();
        if (!cancelled) setCustomer(info);
      } catch {
        if (!cancelled) setCustomer(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Rewards" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading rewards...</p>
          </Card>
        ) : (
          <>
            <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-yellow-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <p className="text-white font-semibold text-base">Your loyalty points</p>
                  <p className="text-xs text-slate-400">Earn points from purchases and bonuses</p>
                </div>
              </div>

              <div className="rounded-xl bg-[#0a0a1a] border border-slate-700/40 p-4">
                <p className="text-xs text-slate-400">Points</p>
                <p className="text-2xl text-white font-bold">{customer?.loyalty_point ?? 0}</p>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => onNavigate('coupons')} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  View Offers
                </Button>
                <Button
                  onClick={() => onNavigate('referrals')}
                  variant="outline"
                  className="flex-1 bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
                >
                  Refer Friends
                </Button>
              </div>
            </Card>

            <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-2">
              <p className="text-sm text-white font-semibold">Wallet</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300">Balance</span>
                <span className="text-white font-semibold">${Number(customer?.wallet_balance ?? 0).toFixed(2)}</span>
              </div>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export function ReferralsScreen({ onBack }: ScreenProps) {
  const [loading, setLoading] = React.useState(true);
  const [refCode, setRefCode] = React.useState<string>('');

  React.useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        const profile = await authService.getProfile();
        if (cancelled) return;
        setRefCode(String((profile as any)?.ref_code ?? '').trim());
      } catch {
        if (!cancelled) setRefCode('');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const copy = async () => {
    if (!refCode) {
      toast.error("No referral code available");
      return;
    }
    try {
      await navigator.clipboard.writeText(refCode);
      toast.success("Referral code copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Referrals" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading referral code...</p>
          </Card>
        ) : (
          <Card className="p-4 bg-[#1a1a2e] border border-slate-700/40 space-y-3">
            <p className="text-sm text-white font-semibold">Invite friends</p>
            <p className="text-xs text-slate-400">Share your code. When friends sign up, you both can earn rewards.</p>

            <div className="rounded-xl bg-[#0a0a1a] border border-slate-700/40 p-4 flex items-center justify-between">
              <span className="text-white font-mono text-sm">{refCode || '—'}</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={copy}
                className="bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50"
                disabled={!refCode}
              >
                Copy
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
