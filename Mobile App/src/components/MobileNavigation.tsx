import { Home, ArrowUpDown, Clock, User } from "lucide-react";
import { motion } from "motion/react";

type Screen = "dashboard" | "convert" | "history" | "profile";

interface MobileNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function MobileNavigation({ currentScreen, onNavigate }: MobileNavigationProps) {
  const navItems = [
    { id: "dashboard" as Screen, icon: Home, label: "Home" },
    { id: "convert" as Screen, icon: ArrowUpDown, label: "Convert" },
    { id: "history" as Screen, icon: Clock, label: "History" },
    { id: "profile" as Screen, icon: User, label: "Profile" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-50 rounded-xl mx-1"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <div className="relative z-10 flex flex-col items-center gap-1">
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? "text-[#2563eb]" : "text-muted-foreground"
                  }`}
                />
                <span 
                  className={`text-xs transition-colors ${
                    isActive ? "text-[#2563eb]" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
