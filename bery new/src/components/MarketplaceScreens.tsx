import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import * as React from "react";
import { ArrowLeft, Search, Store, Package, MapPin, CreditCard, Globe, Star, ShoppingCart, Heart, SlidersHorizontal, Zap, Clock, Shield, Crown, Share2, Grid3x3, List, Flame, TrendingUp, Sparkles } from "lucide-react";
import { storeService, itemService, wishlistService, orderService, metadataService } from '../services';

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
        // Fetch stores from the 6amMart API
        let storeData = await storeService.getPopularStores();
        if (!storeData || storeData.length === 0) {
          try {
            storeData = await storeService.getLatestStores({ limit: 20, offset: 0 });
          } catch {}
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
                      <button className="w-full py-2 bg-gradient-to-r cursor-pointer from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all" onClick={() => { try { localStorage.setItem('selectedStoreId', store.id); } catch {} ; onNavigate('marketplace'); }}>
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
        // Fetch all stores from the 6amMart API with safe pagination
        let storeData = await storeService.getStores('all', { limit: 20, offset: 0 });
        
        // Fallback to latest stores if get-stores returns empty
        if (!storeData || storeData.length === 0) {
          try {
            storeData = await storeService.getLatestStores({ limit: 20, offset: 0 });
          } catch {}
        }

        // Final fallback: set zone header to All Zones and retry
        if (!storeData || storeData.length === 0) {
          try {
            const zones = await metadataService.getZones();
            const allZoneIds = Array.isArray(zones) ? zones.map((z: any) => z.id) : [];
            if (allZoneIds.length) {
              try { localStorage.setItem('zoneId', JSON.stringify(allZoneIds)); } catch {}
              // Retry after setting all zones
              storeData = await storeService.getStores('all', { limit: 20, offset: 0 });
            }
          } catch {}
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
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedFilter === filter
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
                    <button className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all" onClick={() => { try { localStorage.setItem('selectedStoreId', store.id); } catch {} ; onNavigate('marketplace'); }}>
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
        // Fetch products from the 6amMart API
        const productData = await itemService.getLatestProducts();
        
        // Transform product data to match existing UI structure
        const transformedProducts = productData.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          price: product.price,
          originalPrice: product.price * 1.2, // Add original price for discount calculation
          image: product.image || '📦',
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
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === category
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

export function ItemDetailsScreen({ onBack }: ScreenProps) {
  const [selectedImage, setSelectedImage] = React.useState(0);
  const [quantity, setQuantity] = React.useState(1);
  const [selectedColor, setSelectedColor] = React.useState('Black');
  const [isFavorite, setIsFavorite] = React.useState(false);
  const [product, setProduct] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch product data from API
  React.useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would get the product ID from route params
        // For now, we'll fetch a sample product
        const productData = await itemService.getLatestProducts();
        if (productData && productData.length > 0) {
          setProduct(productData[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  const images = product?.images || ['📦', '📦', '📦', '📦'];
  const colors = product?.colors || ['Black', 'White', 'Blue', 'Red'];

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-20">
      <ScreenHeader title="Item Details" onBack={onBack} />

      <div className="space-y-4">
        {/* Product Image Section */}
        <div className="px-5 mt-4">
          <div className="relative">
            <div className="w-full aspect-square rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-9xl shadow-xl">
              {images[selectedImage]}
            </div>
            {/* Badges */}
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold shadow-lg">
              -31% OFF
            </div>
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
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 flex-shrink-0 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-3xl transition-all ${
                  selectedImage === idx ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0a0a1a]' : 'opacity-50'
                }`}
              >
                {img}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div className="px-5 space-y-4">
          {/* Title and Price */}
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h1 className="text-white font-bold text-2xl leading-tight flex-1">
                {product?.name || 'Wireless Earbuds Pro Max'}
              </h1>
              <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30 px-2 py-1 text-xs font-semibold">
                {product?.badge || 'Best Seller'}
              </Badge>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-white font-bold text-3xl">${product?.price || '89.99'}</span>
              <span className="text-gray-500 text-lg line-through">${product?.originalPrice || '129.99'}</span>
              <span className="text-green-400 text-sm font-semibold">Save ${product?.discountAmount || '40'}</span>
            </div>
            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-4 h-4 ${star <= (product?.rating || 4.8) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'}`} />
                ))}
              </div>
              <span className="text-white font-bold">{product?.rating || '4.8'}</span>
              <span className="text-gray-400 text-sm">({product?.reviews?.toLocaleString() || '2,456'} reviews)</span>
            </div>
          </div>
          {/* Seller Info */}
          <Card className="p-0 bg-[#1a1a2e] border-slate-700/40">
            <div className="p-4 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl">
                🏪
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold text-sm">TechHub Electronics</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs font-bold">4.8</span>
                  </div>
                  <span className="text-gray-400 text-xs">• 2.5k products</span>
                </div>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg active:bg-blue-700 transition-colors whitespace-nowrap">
                Visit Store
              </button>
            </div>
          </Card>
          {/* Color Selection */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Select Color</h3>
            <div className="flex gap-2 flex-wrap">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedColor === color
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1a1a2e] text-gray-400 border border-slate-700/40 active:bg-[#252540]'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
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
              <div className="flex-1 min-w-[120px]">
                <span className="text-gray-400 text-sm">Stock: </span>
                <span className="text-green-400 text-sm font-semibold">245 available</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Add to Cart & Buy Now */}
          <div className="flex gap-2 mb-6">
            <button className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl active:scale-98 transition-transform shadow-lg flex items-center justify-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm">Add to Cart</span>
            </button>
            <button className="flex-1 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white font-bold rounded-xl active:scale-98 transition-transform shadow-lg">
              <span className="text-sm">Buy Now</span>
            </button>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-white font-semibold text-base mb-2">Description</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {product?.description || 'Experience premium sound quality with our Wireless Earbuds Pro Max. Featuring active noise cancellation, 30-hour battery life, and IPX7 water resistance. Perfect for music lovers and fitness enthusiasts.'}
            </p>
          </div>
          {/* Features */}
          <div>
            <h3 className="text-white font-semibold text-base mb-3">Key Features</h3>
            <div className="space-y-2">
              {[
                { icon: '🔋', text: 'Up to 30 hours battery life' },
                { icon: '🎵', text: 'Active Noise Cancellation' },
                { icon: '💧', text: 'IPX7 Water Resistant' },
                { icon: '📱', text: 'Bluetooth 5.3 connectivity' },
                { icon: '🎤', text: 'Crystal clear call quality' },
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 text-gray-300 text-sm">
                  <span className="text-xl">{feature.icon}</span>
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Specifications */}
          <div>
            <h3 className="text-white font-semibold text-base mb-3">Specifications</h3>
            <Card className="p-0 bg-[#1a1a2e] border-slate-700/40">
              <div className="divide-y divide-slate-700/40">
                {[
                  { label: 'Brand', value: 'TechHub' },
                  { label: 'Model', value: 'TWS-Pro-Max' },
                  { label: 'Weight', value: '4.5g (each earbud)' },
                  { label: 'Bluetooth', value: 'Version 5.3' },
                  { label: 'Charging', value: 'USB-C Fast Charging' },
                ].map((spec, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3">
                    <span className="text-gray-400 text-sm">{spec.label}</span>
                    <span className="text-white text-sm font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          {/* Reviews Summary */}
          <div>
            <h3 className="text-white font-semibold text-base mb-3">Customer Reviews</h3>
            <Card className="p-0 bg-[#1a1a2e] border-slate-700/40">
              <div className="p-4">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-white font-bold text-4xl mb-1">4.8</div>
                    <div className="flex items-center gap-0.5 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <div className="text-gray-400 text-xs">2,456 reviews</div>
                  </div>
                  <div className="flex-1 space-y-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center gap-2">
                        <span className="text-yellow-400 text-xs w-3">{rating}</span>
                        <div className="flex-1 h-2 bg-[#0a0a1a] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${rating === 5 ? 75 : rating === 4 ? 15 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%`,
                              backgroundColor: '#f59e0b',
                              minWidth: '2px'
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full py-2 bg-[#252540] text-white text-sm font-semibold rounded-lg active:bg-[#2a2a50] transition-colors">
                  See All Reviews
                </button>
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
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCategory === category
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
                <Card className={`p-0 overflow-hidden transition-all ${
                  selectedStore === store
                    ? 'bg-gradient-to-br from-purple-600 to-pink-500 border-0 shadow-lg shadow-purple-500/30'
                    : 'bg-[#1a1a2e] border-slate-700/40'
                }`}>
                  <div className="p-3 text-center">
                    <div className={`w-10 h-10 mx-auto mb-2 rounded-2xl flex items-center justify-center text-2xl ${
                      selectedStore === store
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
                    <h4 className={`text-xs font-bold line-clamp-2 leading-tight h-4 ${
                      selectedStore === store
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
                className={`p-1 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400'
                }`}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400'
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
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                selectedFilter === filter
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
              <Card className={`p-0 border-0 overflow-hidden ${
                product.rank === 1 ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20' :
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
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCampaign === campaign
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
        const categoryData = await storeService.getCategories();
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

export function OrderScreen({ onBack, orders = [] as any[] }: ScreenProps & { orders?: any[] }) {
  const [orderData, setOrderData] = React.useState<any[]>(orders);
  const [loading, setLoading] = React.useState(!orders || orders.length === 0);

  // Fetch orders from API if none provided
  React.useEffect(() => {
    if (orders && orders.length > 0) return;
    
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const orderResponse = await orderService.getOrderHistory();
        setOrderData(orderResponse.orders || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrderData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [orders]);

  const displayOrders = orders && orders.length > 0 ? orders : orderData;

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Orders" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-3">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading orders...</p>
          </Card>
        ) : displayOrders.length === 0 ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">No orders yet.</p>
          </Card>
        ) : (
          displayOrders.map((o: any) => (
            <Card key={o.id} className="p-4 bg-[#1a1a2e] border-slate-700/40">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Order {o.id}</span>
                <Badge className="bg-green-500/20 text-green-300 border-0">{o.order_status || 'Confirmed'}</Badge>
              </div>
              <div className="mt-2 text-xs text-slate-400">Items: {o.order_items?.length || 0}</div>
              <div className="text-xs text-slate-400">Total: ${o.order_amount?.toFixed?.(2) || '0.00'}</div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export function OrderDetailsScreen({ onBack }: ScreenProps) {
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  // Fetch order details from API
  React.useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would get the order ID from route params
        // For now, we'll fetch a sample order
        const orderData = await orderService.getOrderHistory();
        if (orderData.orders && orderData.orders.length > 0) {
          setOrder(orderData.orders[0]);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, []);

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Order Details" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        {loading ? (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">Loading order details...</p>
          </Card>
        ) : order ? (
          <div className="space-y-4">
            <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
              <div className="flex items-center justify-between">
                <span className="text-sm text-white">Order #{order.id}</span>
                <Badge className="bg-blue-500/20 text-blue-300 border-0">{order.order_status || 'Confirmed'}</Badge>
              </div>
              <div className="mt-3 text-xs text-slate-400">
                <p>Placed on: {new Date(order.created_at).toLocaleDateString()}</p>
                <p>Total items: {order.order_items?.length || 0}</p>
                <p className="text-white font-semibold mt-1">Total: ${order.order_amount?.toFixed(2) || '0.00'}</p>
              </div>
            </Card>
            
            <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
              <h3 className="text-white font-semibold text-sm mb-2">Items</h3>
              <div className="space-y-2">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{item.item_details || 'Item'}</span>
                    <span className="text-white">${item.price?.toFixed(2) || '0.00'}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <p className="text-sm text-slate-300">No order details available</p>
          </Card>
        )}
      </div>
    </div>
  );
}

export function OrderTrackingScreen({ onBack }: ScreenProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Order Tracking" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Placeholder>
          <p className="text-sm text-slate-300 mt-3">Tracking timeline placeholder</p>
        </Placeholder>
      </div>
    </div>
  );
}

export function GuestTrackOrderScreen({ onBack }: ScreenProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Guest Track Order" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Input placeholder="Enter order ID" className="bg-[#0a0a1a] border-slate-700/40 text-white" />
        <Placeholder />
      </div>
    </div>
  );
}

export function RefundRequestScreen({ onBack }: ScreenProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Refund Request" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Input placeholder="Order ID" className="bg-[#0a0a1a] border-slate-700/40 text-white" />
        <Input placeholder="Reason" className="bg-[#0a0a1a] border-slate-700/40 text-white" />
        <Button className="bg-blue-600">Submit</Button>
      </div>
    </div>
  );
}

export function PaymentScreen({ onBack }: ScreenProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Payment" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Placeholder>
          <div className="flex items-center gap-2 mt-3">
            <CreditCard className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-white">Payment method selection</span>
          </div>
        </Placeholder>
      </div>
    </div>
  );
}

export function PaymentWebviewScreen({ onBack }: ScreenProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Payment Webview" onBack={onBack} />
      <div className="px-5 -mt-4">
        <Placeholder />
      </div>
    </div>
  );
}

export function OfflinePaymentScreen({ onBack }: ScreenProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Offline Payment" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-4">
        <Placeholder>
          <div className="flex items-center gap-2 mt-3">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-white">Cash on delivery, bank deposit info</span>
          </div>
        </Placeholder>
      </div>
    </div>
  );
}

export function ProfileViewScreen({ onBack }: ScreenProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Profile" onBack={onBack} />
      <div className="px-5 -mt-4">
        <Placeholder />
      </div>
    </div>
  );
}

export function UpdateProfileScreen({ onBack }: ScreenProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Update Profile" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-3">
        <Input placeholder="Name" className="bg-[#0a0a1a] border-slate-700/40 text-white" />
        <Input placeholder="Email" className="bg-[#0a0a1a] border-slate-700/40 text-white" />
        <Button className="bg-blue-600">Save</Button>
      </div>
    </div>
  );
}

export function AddressScreen({ onBack }: ScreenProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Addresses" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 bg-[#1a1a2e] border-slate-700/40">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Address #{i + 1}</span>
              <Button variant="outline" size="sm" className="bg-transparent border-slate-600/40 text-white hover:bg-slate-800/50">Edit</Button>
            </div>
          </Card>
        ))}
        <Button className="bg-blue-600">Add New Address</Button>
      </div>
    </div>
  );
}

export function AddAddressScreen({ onBack }: ScreenProps) {
  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-24">
      <ScreenHeader title="Add Address" onBack={onBack} />
      <div className="px-5 -mt-4 space-y-3">
        <Input placeholder="Street" className="bg-[#0a0a1a] border-slate-700/40 text-white" />
        <Input placeholder="City" className="bg-[#0a0a1a] border-slate-700/40 text-white" />
        <Input placeholder="Zip Code" className="bg-[#0a0a1a] border-slate-700/40 text-white" />
        <Button className="bg-blue-600">Save Address</Button>
      </div>
    </div>
  );
}