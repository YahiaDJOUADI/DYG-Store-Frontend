"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "@/features/userSlice";
import { motion } from "framer-motion";
import {
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon,
  SparklesIcon,
  UserGroupIcon,
  GiftIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/features/api";
import { InfoIcon } from "lucide-react";

export default function SignUp({ openLoginModal }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    hasNumber: false,
    hasSymbol: false,
  });
  const [showPasswordStrength, setShowPasswordStrength] = useState(false);

  // Validate password strength
  const validatePassword = (password) => {
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLengthValid = password.length >= 6;

    setPasswordStrength({
      length: isLengthValid,
      hasNumber,
      hasSymbol,
    });
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (name === "password") {
      setShowPasswordStrength(true);
      validatePassword(value);
    }
  };

  // Validate all inputs before submission
  const validateInputs = () => {
    const { userName, email, phone, password } = formData;
    if (!userName || !email || !phone || !password) {
      setError("Please fill in all fields.");
      return false;
    }
    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions.");
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    setLoading(true);
    setError(null);

    try {
      const { userName, email, phone, password } = formData;
      const response = await api().post("/users", {
        userName,
        email,
        phone,
        password,
      });
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      dispatch(login(user));
      router.push("/");
    } catch (err) {
      setError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1d2731] to-[#0d1a26] p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col sm:flex-row bg-gradient-to-br from-[#ffffff] to-[#f2f2f2] rounded-xl shadow-2xl max-w-4xl w-full overflow-hidden"
      >
        {/* Left Section - Text and Logo */}
        <div className="w-full sm:w-1/2 bg-gradient-to-br from-[#1d2731] to-[#0d1a26] p-6 sm:p-10 flex flex-col justify-center items-center text-white">
          {/* Logo */}
          <img
            src="/bigLogo.png"
            alt="Logo"
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-6 mt-4"
          />
          {/* Welcome Text with Icon */}
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-4xl font-bold text-center mb-6 flex items-center"
          >
            <SparklesIcon className="w-6 h-6 sm:w-8 sm:h-8 mr-2" />
            Welcome to Our Gaming World
          </motion.h1>
          {/* Description with Icons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-sm sm:text-lg text-center"
          >
            <div className="flex items-center mb-3">
              <UserGroupIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <span>Connect with gamers worldwide</span>
            </div>
            <div className="flex items-center mb-3">
              <GiftIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <span>Explore exclusive deals and rewards</span>
            </div>
            <div className="flex items-center">
              <SparklesIcon className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
              <span>Level up your gaming experience</span>
            </div>
          </motion.div>
        </div>

        {/* Right Section - Form */}
        <div className="w-full sm:w-1/2 p-6 sm:p-10">
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-2xl sm:text-3xl font-bold text-center text-[#1d2731] mb-6 sm:mb-8"
          >
            Create Account
          </motion.h2>

          <form onSubmit={handleSubmit}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4 p-3 text-center text-sm text-[#1d2731] bg-red-100 border border-red-200 rounded-lg"
                role="alert"
              >
                {error}
              </motion.div>
            )}

            {/* Username Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mb-4 sm:mb-6"
            >
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-[#1d2731] mb-1"
              >
                Username
              </label>
              <div className="relative">
                <UserIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1d2731]" />
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  className="w-full pl-10 px-4 py-2 sm:py-3 border rounded-lg shadow-sm focus:ring-[#ffcb05] focus:border-[#ffcb05] border-[#235789] bg-white text-[#1d2731] transition-all duration-300"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  aria-label="Username"
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mb-4 sm:mb-6"
            >
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#1d2731] mb-1"
              >
                Email Address
              </label>
              <div className="relative">
                <EnvelopeIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1d2731]" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full pl-10 px-4 py-2 sm:py-3 border rounded-lg shadow-sm focus:ring-[#ffcb05] focus:border-[#ffcb05] border-[#235789] bg-white text-[#1d2731] transition-all duration-300"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                  aria-label="Email Address"
                  disabled={loading}
                />
              </div>
            </motion.div>

            {/* Phone Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="mb-4 sm:mb-6"
            >
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-[#1d2731] mb-1"
              >
                Phone Number
              </label>
              <div className="flex items-center">
                {/* Country Code Dropdown with Flag */}
                <div className="relative flex items-center border border-[#235789] rounded-lg shadow-sm focus:ring-[#ffcb05] focus:border-[#ffcb05] bg-white text-[#1d2731] transition-all duration-300">
                  {/* Algerian Flag Image */}
                  <img
                    src="/algeria.png"
                    alt="Algeria Flag"
                    className="w-5 h-5 ml-3"
                  />
                  <select
                    id="countryCode"
                    name="countryCode"
                    className="pl-2 pr-8 py-2 sm:py-3 appearance-none bg-transparent focus:outline-none"
                    defaultValue="+213"
                  >
                    <option value="+213">+213</option>
                  </select>
                </div>
                {/* Phone Number Input */}
                <div className="relative flex-1 ml-3">
                  <PhoneIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1d2731]" />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    className="w-full pl-10 px-4 py-2 sm:py-3 border rounded-lg shadow-sm focus:ring-[#ffcb05] focus:border-[#ffcb05] border-[#235789] bg-white text-[#1d2731] transition-all duration-300"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                    aria-label="Phone Number"
                    disabled={loading}
                  />
                </div>
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mb-4 sm:mb-6 relative"
            >
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#1d2731] mb-1"
              >
                Password
              </label>
              <div className="relative">
                <LockClosedIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1d2731]" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full pl-10 px-4 py-2 sm:py-3 border rounded-lg shadow-sm focus:ring-[#ffcb05] focus:border-[#ffcb05] border-[#235789] bg-white text-[#1d2731] pr-12 transition-all duration-300"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  aria-label="Password"
                  disabled={loading}
                  onFocus={() => setShowPasswordStrength(true)}
                  onBlur={() => setShowPasswordStrength(false)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-[#1d2731] hover:text-[#ffcb05] transition-all duration-300"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password Strength Feedback */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: showPasswordStrength ? 1 : 0, y: showPasswordStrength ? 0 : -10 }}
                transition={{ duration: 0.3 }}
                className={`absolute left-0 right-0 top-[-80px] p-2 rounded-md shadow-lg bg-white border border-gray-300 text-sm text-[#1d2731] transition-all duration-300 ${showPasswordStrength ? "visible" : "invisible"}`}
              >
                {/* Arrow */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white border-l border-t border-gray-300 rotate-45"></div>

                {/* At least 6 characters */}
                <p className={passwordStrength.length ? "text-green-500" : "text-red-500"}>
                  {passwordStrength.length ? (
                    <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 inline mr-1" />
                  )}
                  At least 6 characters
                </p>

                {/* Contains a number */}
                <p className={passwordStrength.hasNumber ? "text-green-500" : "text-red-500"}>
                  {passwordStrength.hasNumber ? (
                    <CheckCircleIcon className="w-4 h-4 inline mr-1" />
                  ) : (
                    <XCircleIcon className="w-4 h-4 inline mr-1" />
                  )}
                  Contains a number
                </p>

                {/* Contains a symbol (just advice) */}
                <p className="text-gray-500">
                  <InfoIcon className="w-4 h-4 inline mr-1" /> 
                  Consider adding a symbol for extra security
                </p>
              </motion.div>
            </motion.div>

            {/* Terms and Conditions Checkbox */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mb-4 sm:mb-6 flex items-center"
            >
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                className="w-4 h-4 text-[#ffcb05] border-[#235789] rounded focus:ring-[#ffcb05]"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                required
              />
              <label
                htmlFor="agreeToTerms"
                className="ml-2 text-sm text-[#1d2731]"
              >
                I agree to the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#235789] hover:text-[#ffcb05] transition-all duration-300"
                >
                  Terms and Conditions
                </a>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-[#ffcb05] text-[#1d2731] py-2 sm:py-3 rounded-lg shadow-lg hover:bg-[#235789] hover:text-[#f2f2f2] transition-all duration-300 font-semibold"
              disabled={loading}
              aria-label="Sign Up"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </motion.button>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="text-center mt-4 sm:mt-6"
          >
            <p className="text-sm text-[#1d2731]">
              Already have an account?{" "}
              <button
                onClick={openLoginModal}
                className="text-[#235789] hover:text-[#ffcb05] transition-all duration-300"
              >
                Log in
              </button>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}