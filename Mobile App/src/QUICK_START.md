# 🚀 Quick Start Guide - Bery Onboarding & Investment Flows

## ⚡ Instant Testing

### Test the Complete New User Flow (2 minutes)

1. **App loads on WelcomeSplash** ✅ Already set as default
2. Click **"Create Account"**
3. Fill the form:
   - Email: `test@bery.com`
   - Phone: `+1 (555) 123-4567`
   - Password: `Test1234`
   - Confirm: `Test1234`
   - ✅ Check "I agree to terms"
4. Click **"Create Account"**
5. Enter OTP: `123456` (any 6 digits work)
6. Fill Profile:
   - First Name: `Alex`
   - Last Name: `Richards`
   - Date of Birth: `01/15/1995` (must be 18+)
   - Country: `United States`
7. Click **"Continue"**
8. Go through Feature Walkthrough (or click **"Skip"**)
9. **Welcome to Dashboard!** 🎉

### Test the Login Flow (30 seconds)

1. From WelcomeSplash, click **"Sign In"**
2. Enter any credentials:
   - Email: `alex@bery.com`
   - Password: `anything`
3. Click **"Sign In"**
4. **Directly to Dashboard!** 🎉

### Test Investment Flow (1 minute)

1. From Dashboard, click **"View"** on Investment Returns banner
   - OR tap 📊 **Investments** in bottom navigation
2. Scroll to "New Opportunities"
3. Click **"Invest Now"** on any opportunity (e.g., Venture Capital Pool)
4. Enter amount: `10000` (must meet minimum)
5. ✅ Check "I understand the risks"
6. Click **"Invest $10,000"**
7. Review confirmation screen
8. Click **"Confirm & Invest $10,000"**
9. See success screen with transaction ID
10. Click **"View My Investments"** or **"Back to Home"**

---

## 🎯 What to Look For

### Animations
- ✨ Floating orbs on splash screen
- 🔄 Smooth page transitions
- 📊 Success checkmark animation
- ⚡ Staggered list animations

### Form Validation
- ❌ Try invalid email → See error
- ❌ Try weak password → See error
- ❌ Try age under 18 → See error
- ✅ Green checkmarks when valid

### User Feedback
- 🔔 Toast notifications (bottom right)
- ⏳ Loading spinners
- 💬 Helpful error messages
- 🎨 Color-coded states

---

## 🔧 Quick Toggles

### Start at Different Screens

Edit line 56 in `/App.tsx`:

```typescript
const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
```

**Options:**
- `"splash"` - Welcome screen (DEFAULT)
- `"login"` - Login screen
- `"signup"` - Sign up screen
- `"dashboard"` - Main dashboard (skip onboarding)
- `"investments"` - Investment page
- `"marketplace"` - Marketplace

---

## 📱 Screen Navigation Map

```
splash
├─ signup ──→ otp-verification ──→ profile-setup ──→ feature-walkthrough ──→ dashboard
└─ login ────→ dashboard

dashboard
├─ send-money
├─ history
├─ profile
├─ investments
│  ├─ investment-management (existing investments)
│  └─ investment-opportunity ──→ investment-confirmation ──→ investment-success
├─ marketplace
└─ ai-chat
```

---

## ⚙️ Common Test Scenarios

### ✅ Happy Path - New User
1. Splash → Create Account
2. Valid email/phone/password
3. Verify OTP (123456)
4. Complete profile (valid data)
5. View walkthrough or skip
6. Land on dashboard
7. Make an investment
8. See success confirmation

### ❌ Error Paths to Test

**Signup Errors:**
- Invalid email format
- Phone with less than 10 digits
- Password less than 8 characters
- Password without uppercase/number
- Mismatched password confirmation
- Unchecked terms checkbox

**Profile Errors:**
- Empty first/last name
- Date of birth making user under 18
- No country selected

**Investment Errors:**
- Amount below minimum
- Unchecked risk acknowledgment

### 🔄 Navigation Tests
- Back button from each screen
- Bottom navigation persistence
- Direct screen switching

---

## 🎨 Visual Features

### Color Meanings
- 🔵 **Blue** - Primary actions (Confirm, Sign In)
- 🟢 **Green** - Success, earnings, positive
- 🟡 **Yellow** - Warnings, notices
- 🔴 **Red** - Errors, risks
- ⚪ **White** - Text, backgrounds

### Key UI Elements
- **Gradient Backgrounds** - Trust and premium feel
- **Rounded Cards** - Modern, friendly
- **Icons** - Clear action indicators
- **Badges** - Highlight important info (APY rates)

---

## 🐛 Troubleshooting

### Issue: OTP Won't Accept Code
- **Solution**: Use exactly 6 digits (e.g., `123456`)
- Works with any 6-digit combination

### Issue: Can't Submit Profile
- **Solution**: Check age is 18+ and all fields filled
- Use date format: MM/DD/YYYY

### Issue: Investment Button Disabled
- **Solution**: 
  1. Enter amount ≥ minimum
  2. Check "I understand the risks"

### Issue: Screen Not Updating
- **Solution**: Check console for errors
- Refresh page and try again

---

## 📊 Demo Data

### Test User Profiles
```javascript
// New User
email: "alex@bery.com"
phone: "+1 (555) 123-4567"
firstName: "Alex"
lastName: "Richards"
dob: "01/15/1995"
country: "United States"

// Existing User
email: "sarah@bery.com"
password: "Test1234"
```

### Investment Opportunities
| Name | Min Amount | APY | Lock Period |
|------|-----------|-----|-------------|
| Fixed Deposit | $100 | 6% | 12 months |
| Lending Pool | $500 | 10% | 6 months |
| Equity Pool | $1,000 | 15% | 3 months |
| Venture Capital | $5,000 | 30% | 24 months |
| Real Estate | $1,000 | 12% | 12 months |

---

## 🎬 30-Second Demo Script

> "Let me show you Bery's onboarding. I'll create an account with email and phone, verify with a code, complete my profile, and I'm in. Now I can invest - let's put $10,000 in the Venture Capital pool at 30% APY. Review the details, confirm, and done! I now have an investment receipt with my transaction ID."

**Total Time**: 30-45 seconds
**Screens Shown**: 8
**Value Demonstrated**: Complete user journey

---

## 💡 Pro Tips

1. **Skip Walkthrough**: Click "Skip" to get to dashboard faster during testing
2. **Copy-Paste OTP**: Paste `123456` into OTP field - auto-fills all boxes
3. **Toast History**: Toasts auto-dismiss after 4-5 seconds
4. **Form Autocomplete**: Browser may remember test data
5. **Transaction IDs**: Auto-generated, unique each time

---

## 📞 Need Help?

1. Check `/ONBOARDING_AND_INVESTMENT_FLOWS.md` for detailed docs
2. Check `/IMPLEMENTATION_SUMMARY.md` for technical details
3. Review inline code comments in components
4. Check browser console for errors
5. Use React DevTools to inspect state

---

## ✨ Key Features Showcase

When demoing to stakeholders, highlight:

1. **🎨 Beautiful Animations** - Smooth, professional transitions
2. **✅ Smart Validation** - Real-time feedback, helpful errors
3. **🔒 Security First** - OTP verification, risk acknowledgment
4. **💰 Investment Flow** - Clear path from interest to confirmation
5. **📱 Mobile-First** - Perfect on phone screens
6. **🌙 Dark Theme** - Easy on the eyes, premium feel
7. **🎯 User Guidance** - Walkthrough educates users
8. **⚡ Fast Loading** - Optimized animations and code

---

**Ready to test?** Just load the app and click "Create Account"! 🚀

_Last Updated: November 3, 2025_
