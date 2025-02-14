import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaArrowUp } from "react-icons/fa";
import { useState } from "react";

const Footer = () => {
  return (
    <footer className="bg-[#1d2731] text-[#f2f2f2] py-12 relative">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Logo and Slogan */}
        <div className="flex flex-col items-center md:items-start">
          <img
            src="/DYG Logo - BigCommerce Store Logo.png"
            alt="DYG Store Logo"
            className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300"
          />
          <p className="mt-2 text-sm text-[#f2f2f2] text-center md:text-left">
            Power Up Your Playtime!
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-4 text-[#f2f2f2]">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm text-[#f2f2f2]">
            <Link href="/" className="hover:text-[#ffcb05] transition duration-300 hover:translate-x-1">
              Home
            </Link>
            <Link href="/shop" className="hover:text-[#ffcb05] transition duration-300 hover:translate-x-1">
              Shop
            </Link>
            <Link href="/about" className="hover:text-[#ffcb05] transition duration-300 hover:translate-x-1">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#ffcb05] transition duration-300 hover:translate-x-1">
              Contact
            </Link>
          </div>
        </div>

        {/* Legal Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-4 text-[#f2f2f2]">Legal</h3>
          <div className="flex flex-col gap-2 text-sm text-[#f2f2f2]">
            <Link href="/privacy-policy" className="hover:text-[#ffcb05] transition duration-300 hover:translate-x-1">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-[#ffcb05] transition duration-300 hover:translate-x-1">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="hover:text-[#ffcb05] transition duration-300 hover:translate-x-1">
              Cookie Policy
            </Link>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-lg font-semibold mb-4 text-[#f2f2f2]">Follow Us</h3>
          <div className="flex gap-6 text-2xl">
            <Link
              href="https://www.facebook.com"
              target="_blank"
              aria-label="Facebook"
              className="hover:scale-110 transition-transform duration-300"
            >
              <FaFacebook className="text-[#ffcb05] hover:text-[#0b3c5d]" />
            </Link>
            <Link
              href="https://www.twitter.com"
              target="_blank"
              aria-label="Twitter"
              className="hover:scale-110 transition-transform duration-300"
            >
              <FaTwitter className="text-[#ffcb05] hover:text-[#0b3c5d]" />
            </Link>
            <Link
              href="https://www.instagram.com"
              target="_blank"
              aria-label="Instagram"
              className="hover:scale-110 transition-transform duration-300"
            >
              <FaInstagram className="text-[#ffcb05] hover:text-[#0b3c5d]" />
            </Link>
            <Link
              href="https://www.linkedin.com"
              target="_blank"
              aria-label="LinkedIn"
              className="hover:scale-110 transition-transform duration-300"
            >
              <FaLinkedin className="text-[#ffcb05] hover:text-[#0b3c5d]" />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright and Contact Email */}
      <div className="max-w-screen-xl mx-auto px-6 mt-8 border-t border-[#0b3c5d] pt-8 text-center">
        <p className="text-sm text-[#f2f2f2]">
          &copy; 2024 DYG Store. All Rights Reserved.
        </p>
        <p className="mt-2 text-sm text-[#f2f2f2]">
          Contact us:{" "}
          <a
            href="mailto:yahiadjouadi7@gmail.com"
            className="text-[#ffcb05] hover:underline"
          >
            yahiadjouadi7@gmail.com
          </a>
        </p>
      </div>

      {/* Back-to-Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 bg-[#ffcb05] text-[#1d2731] p-3 rounded-full shadow-lg hover:bg-[#0b3c5d] hover:text-[#f2f2f2] transition duration-300 flex items-center justify-center z-50"
        style={{ width: "48px", height: "48px" }}
        aria-label="Back to top"
      >
        <FaArrowUp className="w-6 h-6" />
      </button>
    </footer>
  );
};

export default Footer;