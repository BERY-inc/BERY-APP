import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  ArrowLeft,
  Edit,
  Shield,
  Bell,
  Moon,
  Sun,
  Lock,
  Smartphone,
  CheckCircle2,
  LogOut
} from "lucide-react";
import { motion } from "motion/react";
import { BottomNavigation } from "./BottomNavigation";

interface UserData {
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  memberSince?: string;
  image?: string;
}

interface ProfileSettingsProps {
  onBack: () => void;
  onNavigate: (screen: string) => void;
  onLogout?: () => void;
  cartItemCount?: number;
  userData?: UserData;
}

export function ProfileSettings({ onBack, onNavigate, onLogout, cartItemCount = 0, userData }: ProfileSettingsProps) {
  const [notifications, setNotifications] = useState({
    transactions: true,
    marketing: false,
    security: true,
  });
  const [darkMode, setDarkMode] = useState(false);
  const [biometric, setBiometric] = useState(true);

  // Derived display values
  const displayName = userData?.firstName || userData?.lastName
    ? `${userData.firstName || ''} ${userData.lastName || ''}`.trim()
    : (userData?.email ? userData.email.split('@')[0] : (userData?.phone || "Guest User"));
  const displayEmail = userData?.email || "No email provided";
  const displayPhone = userData?.phone || "No phone linked";
  const memberSince = userData?.memberSince || "Jan 2024";
  const initials = displayName !== "Guest User"
    ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : "GU";
  const displayImage = userData?.image;

  return (
    <div className="h-screen overflow-y-auto pb-32 bg-[#0a0a1a]">
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
          <h1 className="text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Profile & Settings</h1>
        </div>
        <p className="text-blue-200/80 text-sm">Manage your account</p>
      </div>

      {/* Content */}
      <div className="px-5 -mt-6 py-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-5 mb-5">
            <div className="flex items-start gap-4 mb-5">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  {displayImage && <AvatarImage src={displayImage} />}
                  <AvatarFallback className="bg-gradient-to-br from-[#2563eb] to-[#7c3aed] text-white text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-1 -right-1 rounded-full w-8 h-8 bg-white text-[#2563eb] hover:bg-white/90 shadow-lg border-2 border-background"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1">
                <h2 className="text-base mb-1">{displayName}</h2>
                <p className="text-xs text-muted-foreground mb-2">{displayEmail}</p>
                <div className="flex items-center gap-2">
                  <Badge className="bg-[#14b8a6] hover:bg-[#14b8a6] text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                  <Badge variant="outline" className="text-xs">Premium</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-xs text-muted-foreground">Phone</Label>
                <p className="mt-1 text-xs">{displayPhone}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Member Since</Label>
                <p className="mt-1 text-xs">{memberSince}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* KYC Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="p-4 mb-5 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm">KYC Verification</h3>
                  <Badge className="bg-green-600 hover:bg-green-600 text-xs">Complete</Badge>
                </div>
                <p className="text-xs text-muted-foreground mb-2">
                  Your identity has been verified
                </p>
                <div className="flex gap-2 text-xs">
                  <Badge variant="outline" className="bg-white text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                    ID
                  </Badge>
                  <Badge variant="outline" className="bg-white text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-green-600" />
                    Address
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card className="p-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-[#2563eb]" />
              <h3 className="text-base">Security</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Smartphone className="w-5 h-5 text-[#2563eb]" />
                  </div>
                  <div>
                    <p className="text-sm">Biometric Auth</p>
                    <p className="text-xs text-muted-foreground">Face ID or fingerprint</p>
                  </div>
                </div>
                <Switch checked={biometric} onCheckedChange={setBiometric} />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm">Change PIN</p>
                  <p className="text-xs text-muted-foreground">Update security PIN</p>
                </div>
                <Button variant="outline" size="sm" className="h-9 text-xs">Change</Button>
              </div>

              <Separator />

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm">Password</p>
                  <p className="text-xs text-muted-foreground">Update password</p>
                </div>
                <Button variant="outline" size="sm" className="h-9 text-xs">Change</Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="p-5 mb-5">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-[#2563eb]" />
              <h3 className="text-base">Notifications</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm">Transaction Alerts</p>
                  <p className="text-xs text-muted-foreground">All transactions</p>
                </div>
                <Switch
                  checked={notifications.transactions}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, transactions: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm">Security Alerts</p>
                  <p className="text-xs text-muted-foreground">Security updates</p>
                </div>
                <Switch
                  checked={notifications.security}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, security: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm">Marketing</p>
                  <p className="text-xs text-muted-foreground">Offers & promotions</p>
                </div>
                <Switch
                  checked={notifications.marketing}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, marketing: checked }))}
                />
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Appearance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="p-5 mb-5">
            <h3 className="mb-4 text-base">Appearance</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm">Dark Mode</p>
                  <p className="text-xs text-muted-foreground">Toggle dark theme</p>
                </div>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Card className="p-5 mb-5">
            <Button
              variant="outline"
              className="w-full border-slate-600/40 text-slate-300 hover:bg-slate-800/50 h-11 text-sm justify-center"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </Card>
        </motion.div>

        {/* Danger Zone */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Card className="p-5 border-red-200">
            <h3 className="text-red-600 mb-3 text-base">Danger Zone</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 h-11 text-sm">
                Deactivate Account
              </Button>
              <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50 h-11 text-sm">
                Delete Account
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      <BottomNavigation currentScreen="profile" onNavigate={onNavigate} cartItemCount={cartItemCount} />
    </div>
  );
}