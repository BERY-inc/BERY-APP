import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { motion } from "motion/react";
import { Camera, User, Calendar, MapPin } from "lucide-react";

interface ProfileSetupProps {
  onComplete: (profileData: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    country: string;
  }) => void;
}

export function ProfileSetup({ onComplete }: ProfileSetupProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    country: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    country: "",
  });

  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "India",
    "Brazil",
    "Japan",
    "Other"
  ];

  const validateForm = () => {
    const newErrors = { firstName: "", lastName: "", dateOfBirth: "", country: "" };
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
      isValid = false;
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const age = (new Date().getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
        isValid = false;
      }
    }

    if (!formData.country) {
      newErrors.country = "Country is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onComplete(formData);
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0a1a] pb-12">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e3a8a] px-5 pt-14 pb-12">
        <div className="text-center">
          <h1 className="text-2xl text-white mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            Complete Your Profile
          </h1>
          <p className="text-sm text-blue-200/80">
            Just a few more details to get started
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-8 max-w-md mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Picture */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-[#0a0a1a]">
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white text-2xl">
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-[#0a0a1a] hover:bg-blue-500 transition-colors">
                <Camera className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* First Name */}
            <div>
              <Label htmlFor="firstName" className="text-sm text-slate-300 mb-2 block flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                className="bg-[#1a1a2e] border-slate-700/40 text-white h-12 rounded-xl"
              />
              {errors.firstName && (
                <p className="text-xs text-red-400 mt-1">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <Label htmlFor="lastName" className="text-sm text-slate-300 mb-2 block flex items-center gap-2">
                <User className="w-4 h-4" />
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Doe"
                className="bg-[#1a1a2e] border-slate-700/40 text-white h-12 rounded-xl"
              />
              {errors.lastName && (
                <p className="text-xs text-red-400 mt-1">{errors.lastName}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dob" className="text-sm text-slate-300 mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
                className="bg-[#1a1a2e] border-slate-700/40 text-white h-12 rounded-xl"
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-red-400 mt-1">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Country */}
            <div>
              <Label htmlFor="country" className="text-sm text-slate-300 mb-2 block flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Country
              </Label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-[#1a1a2e] border border-slate-700/40 text-white h-12 rounded-xl px-4 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="" className="bg-[#1a1a2e]">Select your country</option>
                {countries.map((country) => (
                  <option key={country} value={country} className="bg-[#1a1a2e]">
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-xs text-red-400 mt-1">{errors.country}</p>
              )}
            </div>

            {/* Info Box */}
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
              <p className="text-xs text-blue-200/80">
                This information is required for compliance and security purposes. Your data is encrypted and secure.
              </p>
            </div>

            {/* Continue Button */}
            <Button
              onClick={handleSubmit}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-base rounded-xl mt-6"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              Continue
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
