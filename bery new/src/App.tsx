import { useState, useEffect, Suspense, lazy } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// Screens (lazy-loaded below)
// Onboarding & main
const WelcomeSplash = lazy(() =>
  import("./components/WelcomeSplash").then((m) => ({ default: m.WelcomeSplash }))
);
const LoginScreen = lazy(() =>
  import("./components/LoginScreen").then((m) => ({ default: m.LoginScreen }))
);
const SignUpScreen = lazy(() =>
  import("./components/SignUpScreen").then((m) => ({ default: m.SignUpScreen }))
);
const OTPVerification = lazy(() =>
  import("./components/OTPVerification").then((m) => ({ default: m.OTPVerification }))
);
const ProfileSetup = lazy(() =>
  import("./components/ProfileSetup").then((m) => ({ default: m.ProfileSetup }))
);
const FeatureWalkthrough = lazy(() =>
  import("./components/FeatureWalkthrough").then((m) => ({ default: m.FeatureWalkthrough }))
);
const NewDashboard = lazy(() =>
  import("./components/NewDashboard").then((m) => ({ default: m.NewDashboard }))
);
const SendMoneyFlow = lazy(() =>
  import("./components/SendMoneyFlow").then((m) => ({ default: m.SendMoneyFlow }))
);
const ProfileSettings = lazy(() =>
  import("./components/ProfileSettings").then((m) => ({ default: m.ProfileSettings }))
);
const InvestmentConfirmation = lazy(() =>
  import("./components/InvestmentConfirmation").then((m) => ({ default: m.InvestmentConfirmation }))
);
import type { CartItem } from "./components/ShoppingCart";
const ShoppingCart = lazy(() =>
  import("./components/ShoppingCart").then((m) => ({ default: m.ShoppingCart }))
);
const ErrorScreen = lazy(() =>
  import("./components/ErrorScreen").then((m) => ({ default: m.ErrorScreen }))
);
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import authService from "./services/authService";
import orderService from "./services/orderService";
import itemService from "./services/itemService";
import { DevDebugPanel } from "./components/DevDebugPanel";
import {
  StoreScreen,
  AllStoreScreen,
  StoreItemSearchScreen,
  CampaignScreen,
  ItemDetailsScreen,
  ItemViewAllScreen,
  PopularItemScreen,
  ItemCampaignScreen,
  CategoryScreen,
  CategoryItemScreen,
  GlobalSearchScreen,
  FavouriteScreen,
  OrderScreen,
  OrderDetailsScreen,
  OrderTrackingScreen,
  GuestTrackOrderScreen,
  RefundRequestScreen,
  PaymentScreen,
  PaymentWebviewScreen,
  OfflinePaymentScreen,
  ProfileViewScreen,
  UpdateProfileScreen,
  AddressScreen,
  AddAddressScreen,
} from "./components/MarketplaceScreens";
import {
  GenericScreenSkeleton,
  MarketplaceSkeleton,
  InvestmentsSkeleton,
  ProductDetailSkeleton,
  TransactionHistorySkeleton,
  CartOrCheckoutSkeleton,
  WelcomeSkeleton,
  LoginSkeleton,
  SignUpSkeleton,
  OTPSkeleton,
  ProfileSetupSkeleton,
  FeatureWalkthroughSkeleton,
  ProfileSettingsSkeleton,
  DashboardSkeleton,
  SendMoneySkeleton,
  InvestmentConfirmationSkeleton,
  ErrorScreenSkeleton,
  QRPaymentSkeleton,
} from "./components/LoadingSkeletons";

// React.lazy mapping to named exports
const TransactionHistory = lazy(() =>
  import("./components/TransactionHistory").then((m) => ({ default: m.TransactionHistory }))
);
const Coupons = lazy(() =>
  import("./components/Coupons").then((m) => ({ default: m.Coupons }))
);
const CouponCampaigns = lazy(() =>
  import("./components/CouponCampaigns").then((m) => ({ default: m.CouponCampaigns }))
);
const CouponDetails = lazy(() =>
  import("./components/CouponDetails").then((m) => ({ default: m.CouponDetails }))
);
const CouponSuccess = lazy(() =>
  import("./components/CouponSuccess").then((m) => ({ default: m.CouponSuccess }))
);
const MyCoupons = lazy(() =>
  import("./components/MyCoupons").then((m) => ({ default: m.MyCoupons }))
);const InvestmentsPage = lazy(() =>
  import("./components/InvestmentsPage").then((m) => ({ default: m.InvestmentsPage }))
);
const InvestmentSuccess = lazy(() =>
  import("./components/InvestmentSuccess").then((m) => ({ default: m.InvestmentSuccess }))
);
const Marketplace = lazy(() =>
  import("./components/Marketplace").then((m) => ({ default: m.Marketplace }))
);
const ProductDetail = lazy(() =>
  import("./components/ProductDetail").then((m) => ({ default: m.ProductDetail }))
);
const CheckoutConfirmation = lazy(() =>
  import("./components/CheckoutConfirmation").then((m) => ({ default: m.CheckoutConfirmation }))
);
const CheckoutPage = lazy(() =>  // Added new checkout page import
  import("./components/CheckoutPage").then((m) => ({ default: m.CheckoutPage }))
);
const PurchaseSuccess = lazy(() =>
  import("./components/PurchaseSuccess").then((m) => ({ default: m.PurchaseSuccess }))
);
const AiChat = lazy(() =>
  import("./components/AiChat").then((m) => ({ default: m.AiChat }))
);
const QRPayment = lazy(() =>
  import("./components/QRPayment").then((m) => ({ default: m.QRPayment }))
);

// Backward-compatible generic fallback (kept for any screen without a dedicated skeleton)
function LoadingFallback() {
  return <GenericScreenSkeleton />;
}

type Screen =
  | "splash"
  | "login"
  | "signup"
  | "otp-verification"
  | "profile-setup"
  | "feature-walkthrough"
  | "dashboard"
  | "send-money"
  | "history"
  | "profile"
  | "investments"
  | "investment-confirmation"
  | "investment-success"
  | "marketplace"
  | "product-detail"
  | "shopping-cart"
  | "checkout"
  | "checkout-page"  // Added new checkout page
  | "purchase-success"
  | "ai-chat"
  | "error"
  | "store"
  | "stores"
  | "store-item-search"
  | "campaigns"
  | "item-details-new"
  | "items-view-all"
  | "popular-items"
  | "campaign-items"
  | "categories"
  | "category-items"
  | "search"
  | "favourite"
  | "orders"
  | "order-details"
  | "order-tracking"
  | "guest-track-order"
  | "refund-request"
  | "payment"
  | "payment-webview"
  | "offline-payment"
  | "profile-view"
  | "update-profile"
  | "address-list"
  | "add-address"
  | "qr-payment"
  | "offers"
  | "rewards"
  | "referrals"
  | "coupons"
  | "coupon-campaigns"
  | "coupon-details"
  | "coupon-success"
  | "my-coupons";
interface UserData {
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  image?: string;
}

interface InvestmentData {
  name: string;
  icon: any;
  color: string;
  amount: number;
  apy: number;
  lockPeriod: string;
  riskLevel: string;
  estimatedReturn: number;
}

interface ActiveInvestment {
  id: number;
  name: string;
  type: string;
  amount: number;
  return: number;
  period: string;
  earnings: number;
  status: string;
  icon: any;
  color: string;
  startDate: number;
}

interface Order {
  id: string;
  items: CartItem[];
  totalUSD: number;
  totalBery: number;
  date: number;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [userData, setUserData] = useState<UserData>({ email: "", phone: "" });
  const [pendingInvestment, setPendingInvestment] = useState<InvestmentData | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0); // USD balance

  const [transactions, setTransactions] = useState<any[]>([]);
  const [counterpartyInfo, setCounterpartyInfo] = useState<Record<string, { name: string; image?: string; phone?: string }>>({});
  const [preSelectedRecipient, setPreSelectedRecipient] = useState<string | undefined>(undefined);

  // Persist session: Fetch profile on mount if token exists
  // Persist session: Fetch profile on mount if token exists
  const refreshDashboardData = async () => {
    try {
      const profile = await authService.getProfile();

      if (profile.wallet_balance !== undefined) {
        setWalletBalance(profile.wallet_balance);
      }

      let imageUrl = profile.image;
      if (imageUrl && !imageUrl.startsWith('http')) {
        imageUrl = `https://market.bery.in/storage/app/public/profile/${imageUrl}`;
      }

      setUserData({
        email: profile.email,
        phone: profile.phone,
        firstName: profile.f_name,
        lastName: profile.l_name,
        image: imageUrl
      });

      // Fetch transactions
      try {
        const txResponse = await authService.getWalletTransactions();
        const txList = Array.isArray(txResponse) ? txResponse : (txResponse?.data || []);
        setTransactions(txList);

        const refs = Array.from(new Set(
          txList
            .filter((t: any) => (t.transaction_type === 'fund_transfer' || t.transaction_type === 'fund_transfer_received') && t.reference)
            .map((t: any) => t.reference)
        ));

        if (refs.length > 0) {
          const results = await Promise.all(
            refs.map(async (r) => {
              try {
                const u = await authService.checkUser(r);
                return { r, u };
              } catch {
                return { r, u: null };
              }
            })
          );

          const map: Record<string, { name: string; image?: string; phone?: string }> = {};
          for (const { r, u } of results) {
            const fullName = (u?.name) || `${u?.f_name || ''} ${u?.l_name || ''}`.trim() || r;
            map[r] = { name: fullName, image: u?.image, phone: u?.phone };
          }
          setCounterpartyInfo(map);
        } else {
          setCounterpartyInfo({});
        }
      } catch (txError) {
        console.warn("Failed to fetch transactions:", txError);
      }
      return true;
    } catch (error) {
      console.error("Session restore failed:", error);
      // Token might be invalid
      localStorage.removeItem('authToken');
      return false;
    }
  };

  useEffect(() => {
    if (authService.isAuthenticated()) {
      refreshDashboardData().then((success) => {
        // Redirect to dashboard if on splash/login and auth successful
        if (success && (currentScreen === 'splash' || currentScreen === 'login')) {
          setCurrentScreen('dashboard');
        }
      });
    }
  }, []); // Run once on mount

  const [orders, setOrders] = useState<Order[]>([]);

  // Shopping Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isServiceDetail, setIsServiceDetail] = useState(false);

  // Navigation History
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>(["splash"]);

  // Error State
  const [errorType, setErrorType] = useState<"network" | "transaction" | "general" | "not-found">("general");

  // State for purchase success data
  const [purchaseSuccessData, setPurchaseSuccessData] = useState<{
    items: CartItem[];
    totalAmount: number;
    itemCount: number;
  } | null>(null);

  // Onboarding Flow Handlers
  const handleGetStarted = () => {
    setCurrentScreen("signup");
  };

  const handleBackToSplash = () => {
    setCurrentScreen("splash");
  };

  const handleGoToSignUp = () => {
    setCurrentScreen("signup");
  };

  const handleGoToLogin = () => {
    setCurrentScreen("login");
  };


  const handleSignUp = async (name: string, email: string, phone: string, password: string) => {
    try {
      // toast.loading("Creating account..."); // UI handles loading now
      const response = await authService.register({
        name,
        email,
        phone,
        password
      });
      console.log("Registration success:", response);

      setUserData({ email, phone, firstName: name.split(" ")[0], lastName: name.split(" ")[1] || "" });

      toast.success("Account created successfully!", {
        description: "Welcome to Bery Market!",
      });
      // Backend returns a token, so we can consider them logged in.
      // Skipping OTP verification as per user request to go straight to home.
      setCurrentScreen("dashboard");
    } catch (error: any) {
      console.error("Registration failed:", error);
      // Re-throw to be handled by the form
      throw error;
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      // toast.loading("Logging in..."); // UI handles loading now
      const isEmail = /\S+@\S+\.\S+/.test(email);
      const response = await authService.login({
        email_or_phone: email,
        password: password,
        login_type: 'manual',
        field_type: isEmail ? 'email' : 'phone'
      });

      console.log("Login success:", response);

      // Fetch full profile details
      try {
        const profile = await authService.getProfile();
        console.log("Profile fetched:", profile);

        // Update wallet balance from profile
        if (profile.wallet_balance !== undefined) {
          setWalletBalance(profile.wallet_balance);
        }

        let imageUrl = profile.image;
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://market.bery.in/storage/app/public/profile/${imageUrl}`;
        }

        setUserData({
          email: profile.email,
          phone: profile.phone,
          firstName: profile.f_name,
          lastName: profile.l_name,
          image: imageUrl
        });
      } catch (profileError) {
        console.warn("Could not fetch detailed profile:", profileError);
        // Fallback to basic info if profile fetch fails
        setUserData({
          email: isEmail ? email : "",
          phone: !isEmail ? email : "",
        });
      }

      toast.success("Welcome back!", {
        description: "You've successfully logged in.",
      });

      setCurrentScreen("dashboard");
    } catch (error: any) {
      console.error("Login failed:", error);
      // Re-throw to be handled by the form
      throw error;
    }
  };

  const handleForgotPassword = () => {
    toast.info("Password Reset", {
      description: "A reset link has been sent to your email.",
    });
  };

  const handleOTPVerify = async (otp: string) => { // Added async here
    // In production, verify OTP with backend
    // Assuming a response object from an OTP verification service
    const response = { token: "mock_token_123" }; // Mock response for demonstration

    if (response.token) {
      // Fetch profile to get name/details
      try {
        const profile = await authService.getProfile();
        console.log("Verified Profile fetched:", profile);

        // Update wallet balance from profile
        if (profile.wallet_balance !== undefined) {
          setWalletBalance(profile.wallet_balance);
        }

        let imageUrl = profile.image;
        if (imageUrl && !imageUrl.startsWith('http')) {
          imageUrl = `https://market.bery.in/storage/app/public/profile/${imageUrl}`;
        }

        setUserData({
          email: profile.email,
          phone: profile.phone,
          firstName: profile.f_name,
          lastName: profile.l_name,
          image: imageUrl
        });

        if (profile.f_name) { // Check profile.f_name instead of userData.firstName as userData might not be updated yet
          // User has profile
          toast.success("Verified!", { description: "Welcome back to Bery." });
          setCurrentScreen("dashboard");
        } else {
          // New user/incomplete profile
          setCurrentScreen("profile-setup");
          toast.success("Verified!", {
            description: "Let's complete your profile.",
          });
        }
      } catch (e) {
        console.error("Profile fetch failed after verify:", e);
        toast.success("Verified!", { description: "Welcome to Bery." });
        setCurrentScreen("dashboard");
      }
    } else {
      // New user, go to profile setup (if OTP verification itself failed or no token)
      setCurrentScreen("profile-setup");
      toast.success("Verification Failed!", {
        description: "Please try again.",
      });
    }
  };

  const handleProfileSetup = (profileData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    country: string;
  }) => {
    setUserData({ ...userData, ...profileData });
    setCurrentScreen("feature-walkthrough");
  };

  const handleFeatureWalkthroughComplete = () => {
    setCurrentScreen("dashboard");
    toast.success("Welcome to Bery!", {
      description: "Your account is ready to use.",
    });
  };

  const handleSkipWalkthrough = () => {
    setCurrentScreen("dashboard");
  };

  // Investment Flow Handlers
  const handleInvestmentConfirm = (investmentData: InvestmentData) => {
    // Check if user has sufficient funds
    if (investmentData.amount > walletBalance) {
      toast.error("Insufficient Funds", {
        description: `You need $${investmentData.amount.toLocaleString()} but only have $${walletBalance.toLocaleString()}`,
        duration: 4000,
      });
      return;
    }
    setPendingInvestment(investmentData);
    setCurrentScreen("investment-confirmation");
  };

  const handleInvestmentFinalConfirm = () => {
    // Generate transaction ID
    const txId = `TX${Date.now().toString(36).toUpperCase()}`;
    setTransactionId(txId);

    // Add the investment to active investments and deduct from wallet
    if (pendingInvestment) {
      // Deduct amount from wallet
      setWalletBalance((prev: number) => prev - pendingInvestment.amount);

      const newInvestment: ActiveInvestment = {
        id: Date.now(),
        name: pendingInvestment.name,
        type: pendingInvestment.riskLevel,
        amount: pendingInvestment.amount,
        return: pendingInvestment.apy,
        period: pendingInvestment.lockPeriod,
        earnings: 0, // Will grow over time
        status: "active",
        icon: pendingInvestment.icon,
        color: pendingInvestment.color,
        startDate: Date.now(),
      };
      setActiveInvestments([...activeInvestments, newInvestment]);
    }

    setCurrentScreen("investment-success");
    toast.success("Investment Confirmed!", {
      description: `Transaction ID: ${txId}`,
      duration: 5000,
    });
  };

  const handleInvestmentSuccessDone = () => {
    setPendingInvestment(null);
    setCurrentScreen("dashboard");
  };

  const handleViewInvestments = () => {
    setPendingInvestment(null);
    setCurrentScreen("investments");
  };

  const handleWithdrawInvestment = (investmentId: number) => {
    // Find the investment being withdrawn
    const investment = activeInvestments.find((inv: ActiveInvestment) => inv.id === investmentId);
    if (investment) {
      // Add principal + earnings back to wallet
      const totalAmount = investment.amount + investment.earnings;
      setWalletBalance((prev: number) => prev + totalAmount);

      toast.success("Investment Withdrawn", {
        description: `$${totalAmount.toLocaleString()} transferred to your wallet (Principal: $${investment.amount.toLocaleString()} + Earnings: $${investment.earnings.toLocaleString()})`,
        duration: 5000,
      });
    }

    setActiveInvestments(activeInvestments.filter((inv: ActiveInvestment) => inv.id !== investmentId));
  };

  const handleLogout = () => {
    // Reset all state
    setUserData({ email: "", phone: "" });
    setActiveInvestments([]);
    setCartItems([]);
    setPendingInvestment(null);
    setNavigationHistory(["splash"]);
    setWalletBalance(13400); // Reset to default
    setCurrentScreen("splash");
    toast.success("Logged Out", {
      description: "You've been successfully logged out.",
    });
  };

  // Simulate earnings growth over time
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInvestments((prev: ActiveInvestment[]) => prev.map((inv: ActiveInvestment) => {
        // Calculate time elapsed in milliseconds
        const timeElapsed = Date.now() - inv.startDate;
        // Convert to years (for APY calculation) - using seconds for faster demo
        const yearsElapsed = timeElapsed / (1000 * 10); // 10 seconds = 1 year for demo purposes

        // Calculate earnings based on APY and time elapsed
        const newEarnings = Math.floor(inv.amount * (inv.return / 100) * yearsElapsed);

        return {
          ...inv,
          earnings: newEarnings > 0 ? newEarnings : 0
        };
      }));
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [activeInvestments.length]); // Re-create interval when investments change

  // General Navigation Handlers
  const handleSendMoney = () => {
    setCurrentScreen("send-money");
  };

  const handleSendComplete = () => {
    toast.success("Money Sent Successfully!", {
      description: "Your transaction has been processed.",
      duration: 4000,
    });
    refreshDashboardData(); // <--- Refresh balance and history
    setCurrentScreen("dashboard");
  };

  const handleBackToDashboard = () => {
    setCurrentScreen("dashboard");
  };

  const handleNavigate = (screen: string) => {
    setNavigationHistory([...navigationHistory, screen as Screen]);
    setCurrentScreen(screen as Screen);
    // Sync to URL for deep linkable screens
    switch (screen) {
      case "marketplace":
        navigate("/marketplace");
        break;
      case "product-detail":
        navigate(`/product-detail${selectedProduct ? `?id=${selectedProduct.id}` : ""}`);
        break;
      case "shopping-cart":
        navigate("/shopping-cart");
        break;
      case "checkout":
        navigate("/checkout");
        break;
      case "purchase-success":
        navigate("/purchase-success");
        break;
      case "orders":
        navigate("/orders");
        break;
      case "order-details":
        navigate(`/order-details${transactionId ? `/${transactionId}` : ""}`);
        break;
      default:
        // Leave other screens state-driven for now
        break;
    }
  };

  const handleGoBack = () => {
    if (navigationHistory.length > 1) {
      const newHistory = [...navigationHistory];
      newHistory.pop();
      const previousScreen = newHistory[newHistory.length - 1];
      setNavigationHistory(newHistory);
      setCurrentScreen(previousScreen);
    }
  };

  // Marketplace & Shopping Cart Handlers
  const handleProductClick = (product: any, isService: boolean) => {
    setSelectedProduct(product);
    setIsServiceDetail(isService);
    // Navigate to product detail with query
    navigate(`/product-detail?id=${product.id}`);
    setNavigationHistory([...navigationHistory, "product-detail"]);
    setCurrentScreen("product-detail");
  };

  const handleAddToCart = (product: any, quantity: number) => {
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      setCartItems(
        cartItems.map((item: CartItem) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        usdPrice: product.usdPrice,
        seller: product.seller,
        image: product.image,
        icon: product.icon,
        quantity: quantity,
        type: isServiceDetail ? "service" : "product",
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const handleBuyNow = (product: any, quantity: number) => {
    handleAddToCart(product, quantity);
    handleNavigate("checkout-page");  // Changed to navigate to checkout page directly
  };

  const handleUpdateCartQuantity = (id: number, quantity: number) => {
    setCartItems(
      cartItems.map((item: CartItem) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(cartItems.filter((item: CartItem) => item.id !== id));
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is empty");
      return;
    }
    handleNavigate("checkout");
  };

  const handleConfirmPurchase = async (paymentMethod: "bery", amount: number) => {
    // Deduct from wallet balance
    setWalletBalance((prev: number) => prev - amount);

    const txId = `TX${Date.now().toString(36).toUpperCase()}`;
    setTransactionId(txId);
    
    // Calculate purchase data before placing order
    const totalBery = cartItems.reduce((sum: number, item: CartItem) => {
      const price = parseFloat(item.price.replace("₿", "").replace("From", "").trim());
      return sum + price * item.quantity;
    }, 0) * 1.1; // Including 10% tax
    
    const itemCount = cartItems.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    
    // Store purchase data for success screen
    setPurchaseSuccessData({
      items: [...cartItems],
      totalAmount: totalBery,
      itemCount
    });
    
    // Place order on backend
    try {
      // Get real cart items from backend
      const realCartItems = await itemService.getCartItems();
      console.log("Real cart items:", realCartItems);
      
      // Calculate total from real cart items
      const cartTotal = realCartItems.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      console.log("Cart total:", cartTotal);
      
      // Use first cart item's store_id as placeholder
      const storeId = realCartItems.length > 0 ? realCartItems[0].item.store_id : 1;
      console.log("Store ID:", storeId);
      
      // Get user data for contact information
      const userProfile = await authService.getProfile();
      console.log("User profile:", userProfile);
            // Get user address information if available
      let address = "123 Main St";
      let longitude = -73.9857;
      let latitude = 40.7484;
      
      // Try to get actual user address from profile if available
      if (userProfile.address) {
        address = userProfile.address;
      }
      
      const orderData = {
        payment_method: "wallet",
        order_type: "delivery",
        store_id: storeId,
        distance: 5.5, // Placeholder - would be calculated
        address: address,
        longitude: longitude,
        latitude: latitude,
        order_amount: cartTotal,
        cutlery: false,
        contact_person_name: (userProfile.f_name || '') + ' ' + (userProfile.l_name || ''),
        contact_person_number: userProfile.phone || '',
        contact_person_email: userProfile.email || '',
      };
      
      console.log("Order data being sent:", orderData);
      const orderResponse = await orderService.placeOrder(orderData);
      console.log("Order placed response:", orderResponse);
      
      // Refresh orders to ensure the new order appears in "My Orders"
      await refreshOrders();
      
      toast.success("Order confirmed!", {
        description: "Your payment has been processed successfully.",
      });
    } catch (error: any) {
      console.error("Error placing order:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error headers:", error.response?.headers);
      
      toast.error("Order placement failed", {
        description: "There was an issue placing your order. Please try again.",
      });
    }    
    handleNavigate("purchase-success");

    // Record order in local state
    const totalUSD = cartItems.reduce((sum: number, item: CartItem) => {
      const price = parseFloat(item.price.replace("₿", "").replace("From", "").trim());
      return sum + price * item.quantity * 8.9;
    }, 0) * 1.1;
    const totalBeryLocal = cartItems.reduce((sum: number, item: CartItem) => {
      const price = parseFloat(item.price.replace("₿", "").replace("From", "").trim());
      return sum + price * item.quantity;
    }, 0) * 1.1;
    setOrders((prev) => [
      {
        id: txId,
        items: cartItems,
        totalUSD,
        totalBery: totalBeryLocal,
        date: Date.now(),
      },
      ...prev,
    ]);

    // Clear cart after purchase
    setTimeout(() => {
      setCartItems([]);
    }, 1000);
  };
  const handlePurchaseDone = () => {
    setCurrentScreen("dashboard");
  };

  const handleViewOrders = () => {
    setCurrentScreen("orders");
    navigate("/orders");
  };

  // Error Handlers
  const handleShowError = (type: "network" | "transaction" | "general" | "not-found" = "general") => {
    setErrorType(type);
    setCurrentScreen("error");
  };

  const handleRetryFromError = () => {
    setCurrentScreen("dashboard");
  };

  // Refresh orders from backend
  const refreshOrders = async () => {
    try {
      const orderResponse = await orderService.getOrderHistory();
      // Update the local orders state with fresh data from backend
      setOrders(orderResponse.orders || []);
    } catch (error) {
      console.error('Error refreshing orders:', error);
    }
  };

  return (
    <div className="min-h-screen max-w-md mx-auto relative bg-background">
      {/* Mobile viewport container */}
      <div className="h-screen overflow-hidden">
        {/* Onboarding & Authentication Screens */}
        {currentScreen === "splash" && (
          <Suspense fallback={<WelcomeSkeleton />}>
            <WelcomeSplash
              onGetStarted={handleGetStarted}
              onLogin={handleGoToLogin}
            />
          </Suspense>
        )}

        {currentScreen === "login" && (
          <Suspense fallback={<LoginSkeleton />}>
            <LoginScreen
              onBack={handleBackToSplash}
              onLogin={handleLogin}
              onForgotPassword={handleForgotPassword}
              onSignUp={handleGoToSignUp}
            />
          </Suspense>
        )}

        {currentScreen === "signup" && (
          <Suspense fallback={<SignUpSkeleton />}>
            <SignUpScreen
              onBack={handleBackToSplash}
              onSignUp={handleSignUp}
              onLogin={handleGoToLogin}
            />
          </Suspense>
        )}

        {currentScreen === "otp-verification" && (
          <Suspense fallback={<OTPSkeleton />}>
            <OTPVerification
              onBack={() => setCurrentScreen(userData.firstName ? "login" : "signup")}
              onVerify={handleOTPVerify}
              phoneOrEmail={userData.phone || userData.email}
              type={userData.phone ? "phone" : "email"}
            />
          </Suspense>
        )}

        {currentScreen === "profile-setup" && (
          <Suspense fallback={<ProfileSetupSkeleton />}>
            <ProfileSetup onComplete={handleProfileSetup} />
          </Suspense>
        )}

        {currentScreen === "feature-walkthrough" && (
          <Suspense fallback={<FeatureWalkthroughSkeleton />}>
            <FeatureWalkthrough
              onComplete={handleFeatureWalkthroughComplete}
              onSkip={handleSkipWalkthrough}
            />
          </Suspense>
        )}

        {/* Main App Screens */}
        {currentScreen === "dashboard" && (
          <Suspense fallback={<DashboardSkeleton />}>
            <NewDashboard
              onMenuClick={() => { }}
              onSendMoney={(recipient) => {
                const value = typeof recipient === 'string' ? recipient : undefined;
                setPreSelectedRecipient(value);
                handleNavigate("send-money");
              }}
              onInvestments={() => handleNavigate("investments")}
              onMarketplace={() => handleNavigate("marketplace")}
              onHistory={() => handleNavigate("history")}
              onAiChat={() => handleNavigate("ai-chat")}
              onProfile={() => handleNavigate("profile")}
              // onNavigate={handleNavigate}
              onNavigate={(screen) => handleNavigate(screen)}
              cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              walletBalance={walletBalance}
              activeInvestments={activeInvestments}
              userName={
                userData.firstName || userData.lastName
                  ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
                  : userData.email.split('@')[0] || userData.phone || "Guest"
              }
              userImage={userData.image}
              transactions={transactions}
              counterpartyInfo={counterpartyInfo}
            />
          </Suspense>
        )}

        {currentScreen === "send-money" && (
          <Suspense fallback={<SendMoneySkeleton />}>
            <SendMoneyFlow
              onBack={handleBackToDashboard}
              onComplete={handleSendComplete}
              initialRecipient={preSelectedRecipient}
              autoVerify={Boolean(preSelectedRecipient)}
            />
          </Suspense>
        )}

        {currentScreen === "history" && (
          <Suspense fallback={<TransactionHistorySkeleton />}>
            <TransactionHistory
              onBack={handleBackToDashboard}
              onNavigate={handleNavigate}
              cartItemCount={cartItems.length}
              transactions={transactions}
              counterpartyInfo={counterpartyInfo}
            />
          </Suspense>
        )}

        {currentScreen === "profile" && (
          <Suspense fallback={<ProfileSettingsSkeleton />}>
            <ProfileSettings
              onBack={handleBackToDashboard}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
              cartItemCount={cartItems.length}
              userData={userData}
            />
          </Suspense>
        )}

        {currentScreen === "investments" && (
          <Suspense fallback={<InvestmentsSkeleton />}>
            <InvestmentsPage
              onBack={handleBackToDashboard}
              onNavigate={handleNavigate}
              onInvestmentConfirm={handleInvestmentConfirm}
              onWithdrawInvestment={handleWithdrawInvestment}
              activeInvestments={activeInvestments}
              cartItemCount={cartItems.length}
              walletBalance={walletBalance}
            />
          </Suspense>
        )}

        {currentScreen === "investment-confirmation" && pendingInvestment && (
          <Suspense fallback={<InvestmentConfirmationSkeleton />}>
            <InvestmentConfirmation
              investment={pendingInvestment}
              onBack={() => setCurrentScreen("investments")}
              onConfirm={handleInvestmentFinalConfirm}

            />
          </Suspense>
        )}

        {currentScreen === "investment-success" && pendingInvestment && (
          <Suspense fallback={<GenericScreenSkeleton />}>
            <InvestmentSuccess
              investment={pendingInvestment}
              transactionId={transactionId}
              onDone={handleInvestmentSuccessDone}
              onViewInvestments={handleViewInvestments}
            />
          </Suspense>
        )}

        {currentScreen === "marketplace" && (
          <Suspense fallback={<MarketplaceSkeleton />}>
            <Marketplace
              onBack={handleBackToDashboard}
              onNavigate={handleNavigate}
              onProductClick={handleProductClick}
              cartItemCount={cartItems.length}
            />
          </Suspense>
        )}

        {currentScreen === "product-detail" && selectedProduct && (
          <Suspense fallback={<ProductDetailSkeleton />}>
            <ItemDetailsScreen
              product={selectedProduct}
              onBack={handleGoBack}
              onNavigate={handleNavigate}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </Suspense>
        )}

        {currentScreen === "shopping-cart" && (
          <Suspense fallback={<CartOrCheckoutSkeleton />}>
            <ShoppingCart
              cartItems={cartItems}
              onBack={handleGoBack}
              onNavigate={handleNavigate}
              onUpdateQuantity={handleUpdateCartQuantity}
              onRemoveItem={handleRemoveFromCart}
              onCheckout={handleCheckout}
              cartItemCount={cartItems.length}
            />
          </Suspense>
        )}

        {currentScreen === "checkout" && (
          <Suspense fallback={<CartOrCheckoutSkeleton />}>
            <CheckoutConfirmation
              cartItems={cartItems}
              totalBery={cartItems.reduce((sum: number, item: CartItem) => {
                const price = parseFloat(item.price.replace("₿", "").replace("From", "").trim());
                return sum + (price * item.quantity);
              }, 0) * 1.1}
              totalUSD={cartItems.reduce((sum: number, item: CartItem) => {
                const price = parseFloat(item.price.replace("₿", "").replace("From", "").trim());
                return sum + (price * item.quantity);
              }, 0) * 1.1 / 8.9}
              onBack={handleGoBack}
              onConfirmPurchase={handleConfirmPurchase}
              walletBalance={walletBalance}
            />
          </Suspense>
        )}

        {/* New Checkout Page */}
        {currentScreen === "checkout-page" && (
          <Suspense fallback={<CartOrCheckoutSkeleton />}>
            <CheckoutPage
              cartItems={cartItems}
              totalBery={cartItems.reduce((sum: number, item: CartItem) => {
                const price = parseFloat(item.price.replace("₿", "").replace("From", "").trim());
                return sum + (price * item.quantity);
              }, 0) * 1.1}
              totalUSD={cartItems.reduce((sum: number, item: CartItem) => {
                const price = parseFloat(item.price.replace("₿", "").replace("From", "").trim());
                return sum + (price * item.quantity);
              }, 0) * 1.1 / 8.9}
              onBack={handleGoBack}
              onConfirmPurchase={handleConfirmPurchase}
              walletBalance={walletBalance}
            />
          </Suspense>
        )}

        {currentScreen === "purchase-success" && (
          <Suspense fallback={<GenericScreenSkeleton />}>
            <PurchaseSuccess
              transactionId={transactionId}
              totalAmount={`₿ ${purchaseSuccessData?.totalAmount.toFixed(1) || '0.0'}`}
              itemCount={purchaseSuccessData?.itemCount || 0}
              onDone={handlePurchaseDone}
              onViewOrders={handleViewOrders}
            />
          </Suspense>
        )}

        {currentScreen === "ai-chat" && (
          <Suspense fallback={<GenericScreenSkeleton />}>
            <AiChat
              onBack={handleBackToDashboard}
              onNavigate={handleNavigate}
              cartItemCount={cartItems.length}
            />
          </Suspense>
        )}

        {currentScreen === "error" && (
          <Suspense fallback={<ErrorScreenSkeleton />}>
            <ErrorScreen
              type={errorType}
              onRetry={handleRetryFromError}
              onGoHome={handleBackToDashboard}
            />
          </Suspense>
        )}

        {/* Marketplace Extended Screens */}
        {currentScreen === "store" && (
          <StoreScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "stores" && (
          <AllStoreScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "store-item-search" && (
          <StoreItemSearchScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "campaigns" && (
          <CampaignScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "item-details-new" && (
          <ItemDetailsScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "items-view-all" && (
          <ItemViewAllScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "popular-items" && (
          <PopularItemScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "campaign-items" && (
          <ItemCampaignScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "categories" && (
          <CategoryScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "category-items" && (
          <CategoryItemScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "search" && (
          <GlobalSearchScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "favourite" && (
          <FavouriteScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "orders" && (
          <OrderScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} orders={orders} />
        )}
        {currentScreen === "order-details" && (
          <OrderDetailsScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "order-tracking" && (
          <OrderTrackingScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "guest-track-order" && (
          <GuestTrackOrderScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "refund-request" && (
          <RefundRequestScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "payment" && (
          <PaymentScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "payment-webview" && (
          <PaymentWebviewScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "offline-payment" && (
          <OfflinePaymentScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "profile-view" && (
          <ProfileViewScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "update-profile" && (
          <UpdateProfileScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "address-list" && (
          <AddressScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        {currentScreen === "add-address" && (
          <AddAddressScreen onBack={handleBackToDashboard} onNavigate={handleNavigate} />
        )}
        
        {currentScreen === "qr-payment" && (
          <Suspense fallback={<QRPaymentSkeleton />}>
            <QRPayment 
              onBack={handleBackToDashboard}
              userName={
                userData.firstName || userData.lastName
                  ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
                  : userData.email.split('@')[0] || userData.phone || "Guest"
              }
              userImage={userData.image}
              walletBalance={walletBalance}
              transactions={transactions}
              counterpartyInfo={counterpartyInfo}
            />
          </Suspense>
        )}

        {/* Pauket Coupon Screens */}
        {currentScreen === "coupons" && (
          <Suspense fallback={<GenericScreenSkeleton />}>
            <Coupons
              onBack={handleBackToDashboard}
              onNavigate={handleNavigate}
              userId={userData.email || userData.phone}
              userName={
                userData.firstName || userData.lastName
                  ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
                  : userData.email.split('@')[0] || userData.phone || "Guest"
              }
              userImage={userData.image}
            />
          </Suspense>
        )}

        {currentScreen === "coupon-campaigns" && (
          <Suspense fallback={<GenericScreenSkeleton />}>
            <CouponCampaigns
              onBack={handleBackToDashboard}
              onNavigate={handleNavigate}
              userId={userData.email || userData.phone}
            />
          </Suspense>
        )}

        {currentScreen === "coupon-details" && (
          <Suspense fallback={<GenericScreenSkeleton />}>
            <CouponDetails
              onBack={handleBackToDashboard}
              onNavigate={handleNavigate}
              userId={userData.email || userData.phone}
            />
          </Suspense>
        )}

        {currentScreen === "coupon-success" && (
          <Suspense fallback={<GenericScreenSkeleton />}>
            <CouponSuccess
              onBack={handleBackToDashboard}
              onNavigate={handleNavigate}
              userId={userData.email || userData.phone}
            />
          </Suspense>
        )}

        {currentScreen === "my-coupons" && (
          <Suspense fallback={<GenericScreenSkeleton />}>
            <MyCoupons
              onBack={handleBackToDashboard}
              onNavigate={handleNavigate}
              userId={userData.email || userData.phone}
              userName={
                userData.firstName || userData.lastName
                  ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
                  : userData.email.split('@')[0] || userData.phone || "Guest"
              }
              userImage={userData.image}
            />
          </Suspense>
        )}
      </div>
      <Toaster />
      <DevDebugPanel currentScreen={currentScreen} onNavigate={handleNavigate} />
    </div>
  );
}
