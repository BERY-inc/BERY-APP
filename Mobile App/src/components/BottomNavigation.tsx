import { Home, TrendingUpIcon, ShoppingBag, MessageCircle, User } from "lucide-react";
import { Haptics, NotificationType } from "@capacitor/haptics";

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  cartItemCount?: number;
}

export function BottomNavigation({ currentScreen, onNavigate, cartItemCount = 0 }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
      <div 
        className="mx-5 mb-6 rounded-full px-6 py-4 shadow-2xl"
        style={{ 
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          boxShadow: '0 10px 40px rgba(30, 58, 138, 0.3)'
        }}
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch {}; onNavigate('dashboard'); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentScreen === 'dashboard' 
                ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-600/40' 
                : 'hover:bg-blue-600/20'
            }`}
          >
            <Home className={`w-5 h-5 ${currentScreen === 'dashboard' ? 'text-white' : 'text-blue-200/70'}`} />
          </button>
          <button 
            onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch {}; onNavigate('investments'); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentScreen === 'investments' 
                ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-600/40' 
                : 'hover:bg-blue-600/20'
            }`}
          >
            <TrendingUpIcon className={`w-5 h-5 ${currentScreen === 'investments' ? 'text-white' : 'text-blue-200/70'}`} />
          </button>
          <button 
            onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch {}; onNavigate('marketplace'); }}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all relative ${
              currentScreen === 'marketplace' 
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-xl shadow-blue-500/50 scale-110' 
                : 'hover:bg-blue-600/20 hover:scale-105'
            }`}
          >
            <ShoppingBag className={`w-6 h-6 ${currentScreen === 'marketplace' ? 'text-white' : 'text-blue-200/70'}`} />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </button>
          <button 
            onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch {}; onNavigate('ai-chat'); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentScreen === 'ai-chat' 
                ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-600/40' 
                : 'hover:bg-blue-600/20'
            }`}
          >
            <MessageCircle className={`w-5 h-5 ${currentScreen === 'ai-chat' ? 'text-white' : 'text-blue-200/70'}`} />
          </button>
          <button 
            onClick={() => { try { Haptics.notification({ type: NotificationType.Success }); } catch {}; onNavigate('profile'); }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              currentScreen === 'profile' 
                ? 'bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-600/40' 
                : 'hover:bg-blue-600/20'
            }`}
          >
            <User className={`w-5 h-5 ${currentScreen === 'profile' ? 'text-white' : 'text-blue-200/70'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
