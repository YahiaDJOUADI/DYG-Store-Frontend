"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaShoppingCart,
  FaSignOutAlt,
  FaEnvelope,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import LoginModal from "./LoginModal";
import Swal from "sweetalert2";
import api from "@/features/api";
import { login, logout } from "@/features/userSlice";
import { setItems } from "@/features/cartSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  

  // State management
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const cartLength = useSelector((state) => state.cart.products.length);

  
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const userType = user?.type;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api().get("/account").then((response) => {
        dispatch(login(response.data));
      });
    }
    const items = localStorage.getItem("items");
    if (items) {
      dispatch(setItems(JSON.parse(items)));
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0b3c5d",
      cancelButtonColor: "#ffcb05",
      confirmButtonText: "Yes, log out!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(logout());
        localStorage.removeItem("token");
        localStorage.removeItem("items")
        router.push("/");
      }
    });
  };

  // Modal and menu handlers
  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-[#f2f2f2] text-[#1d2731] shadow-md sticky top-0 z-50 h-16">
      {/* Wrapper for consistent width */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo as Home Link */}
        <Link href="/" className="flex items-center flex-shrink-0 group">
          <img
            src="/DYG Logo - BigCommerce Store Logo.png"
            alt="DYG Store Logo"
            className="h-10 w-auto object-contain transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-active:scale-95 group-active:rotate-0"
          />
        </Link>

        {/* Hamburger Menu Icon (Mobile Only) */}
        <div className="lg:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-[#0b3c5d] hover:text-[#ffcb05] focus:outline-none"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-6 text-base font-semibold ml-auto">
          <NavLink href="/shop" icon={<FaShoppingCart />} label="Shop" />
          <NavLink href="/about" icon={<FaInfoCircle />} label="About" />
          <NavLink href="/contact" icon={<FaEnvelope />} label="Contact" />


          {!isAuthenticated ? (
            <div className="flex items-center gap-4">
              <button
                onClick={openLoginModal}
                className="px-6 py-2 bg-[#0b3c5d] text-white font-bold rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] hover:scale-105 transition-all duration-300 transform text-sm shadow-md"
                aria-label="Log In"
              >
                Log In
              </button>
              <NavLink
                href="/signup"
                label="Sign Up"
                isButton
                className="px-6 py-2 bg-[#ffcb05] text-[#0b3c5d] font-bold rounded-md hover:bg-[#0b3c5d] hover:text-white hover:scale-105 transition-all duration-300 transform text-sm shadow-md"
              />
            </div>
          ) : (
            <UserDropdown
              userType={userType}
              dropdownRef={dropdownRef}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              handleLogout={handleLogout}
            />
          )}

          <CartLink cartItemCount={cartLength} />
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <MobileMenu
            mobileMenuRef={mobileMenuRef}
            isAuthenticated={isAuthenticated}
            userType={userType}
            openLoginModal={openLoginModal}
            toggleMobileMenu={toggleMobileMenu}
            handleLogout={handleLogout}
          />
        )}

        {/* Login Modal */}
        {isLoginModalOpen && (
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={closeLoginModal}
          />
        )}
      </div>
    </nav>
  );
};

// Reusable NavLink Component
const NavLink = ({
  href,
  icon,
  label,
  isButton = false,
  className,
  onClick,
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center ${
        isActive ? "text-[#ffcb05]" : "text-[#0b3c5d]"
      } hover:text-[#ffcb05] hover:scale-105 transition-all duration-200 ${
        isButton ? className : ""
      }`}
      onClick={onClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Link>
  );
};

// User Dropdown Component
const UserDropdown = ({
  userType,
  dropdownRef,
  isDropdownOpen,
  setIsDropdownOpen,
  handleLogout,
}) => (
  <div className="relative" ref={dropdownRef}>
    <button
      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      className="flex items-center space-x-2 text-[#0b3c5d] hover:text-[#ffcb05] transition-all duration-200"
      title={userType || "User"}
      aria-label="User menu"
    >
      <div className="w-8 h-8 bg-[#ffcb05] rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110 overflow-hidden">
        <img
          src={
            userType === "admin"
              ? "/cute-angry-diver-gaming-cartoon-vector-icon-illustration-science-technology-icon-isolated-flat_138676-12437.avif"
              : "/cute-diver-playing-vr-game-with-controller-cartoon-vector-icon-illustration-science-technology-flat_138676-13994.avif"
          }
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>
    </button>

    {isDropdownOpen && (
      <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-lg w-48 text-[#1d2731] z-10">
        <Link
          href="/profile"
          className="block px-4 py-2 text-sm hover:bg-[#ffcb05] hover:text-white"
        >
          Profile
        </Link>
        {userType === "admin" && (
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-sm hover:bg-[#ffcb05] hover:text-white"
          >
            Admin Dashboard
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="block w-full px-4 py-2 text-sm text-left hover:bg-[#ffcb05] hover:text-white"
        >
          <FaSignOutAlt className="mr-2 inline" /> Log Out
        </button>
      </div>
    )}
  </div>
);

// Cart Link Component
const CartLink = ({ cartItemCount }) => (
  <Link
    href="/cart"
    className="flex items-center text-[#0b3c5d] hover:text-[#ffcb05] transition duration-200 relative"
  >
    <FaShoppingCart className="h-5 w-5" />
    {cartItemCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-[#ffcb05] text-white text-xs rounded-full px-2 py-1">
        {cartItemCount}
      </span>
    )}
  </Link>
);

// Mobile Menu Component
const MobileMenu = ({
  mobileMenuRef,
  isAuthenticated,
  userType,
  openLoginModal,
  toggleMobileMenu,
  handleLogout,
}) => (
  <div
    ref={mobileMenuRef}
    className="lg:hidden absolute top-16 right-0 bg-white shadow-lg rounded-lg w-48 text-[#1d2731] z-10 p-4"
  >
    <NavLink href="/shop" label="Shop" onClick={toggleMobileMenu} />
    <NavLink href="/about" label="About" onClick={toggleMobileMenu} />
    <NavLink href="/contact" label="Contact" onClick={toggleMobileMenu} />
    {!isAuthenticated ? (
      <>
        <button
          onClick={() => {
            openLoginModal();
            toggleMobileMenu();
          }}
          className="block w-full px-4 py-2 text-sm text-left hover:bg-[#ffcb05] hover:text-white"
        >
          Log In
        </button>
        <NavLink href="/signup" label="Sign Up" onClick={toggleMobileMenu} />
      </>
    ) : (
      <>
        <NavLink href="/profile" label="Profile" onClick={toggleMobileMenu} />
        {userType === "admin" && (
          <NavLink href="/dashboard" label="Admin Dashboard" onClick={toggleMobileMenu} />
        )}
        <button
          onClick={handleLogout}
          className="block w-full px-4 py-2 text-sm text-left hover:bg-[#ffcb05] hover:text-white"
        >
          Log Out
        </button>
      </>
    )}
  </div>
);

export default Navbar;