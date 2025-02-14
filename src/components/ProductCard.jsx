"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaArrowRight,
  FaGamepad,
  FaHeadset,
  FaTicketAlt,
  FaHeart,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import api from "@/features/api";
import { toast } from "sonner"; // Import Sonner's toast

export default function ProductCard({ product }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token } = useSelector((state) => state.user);

  const handleViewDetailsClick = (productId) => {
    router.push(`/shop/${productId}`);
  };

  const handleAddToWishlist = async (productId) => {
    if (!isAuthenticated) {
      router.push("/signup");
      return;
    }

    setLoading(true);
    try {
      const response = await api().post("/wishlist/add", { productId });
      if (response.status === 201) {
        toast.success("Product added to wishlist"); // Replace alert with toast
      }
    } catch (error) {
      toast.error(error.response?.data.message || "Server error"); // Replace alert with toast
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Video Games":
        return (
          <FaGamepad className="text-[#ffcb05] group-hover:text-[#1d2731]" />
        );
      case "Gaming Gear":
        return (
          <FaHeadset className="text-[#ffcb05] group-hover:text-[#1d2731]" />
        );
      case "Subscriptions":
        return (
          <FaTicketAlt className="text-[#ffcb05] group-hover:text-[#1d2731]" />
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-[#0b3c5d]"
      whileHover={{ scale: 1.03 }}
    >
      <div className="relative">
        <img
          src={product.mainImage}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2 flex items-center gap-2">
          {product.stock > 0 ? (
            <span className="bg-green-600 text-[#f2f2f2] px-3 py-1 rounded-full text-xs">
              Available
            </span>
          ) : (
            <span className="bg-red-600 text-[#f2f2f2] px-3 py-1 rounded-full text-xs">
              Out of Stock
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#0b3c5d] text-[#f2f2f2] px-3 py-1 rounded-full transition-all duration-300 hover:bg-[#ffcb05] hover:text-[#1d2731] cursor-pointer group">
            {getCategoryIcon(product.category)}
            <span className="text-sm font-medium">{product.category}</span>
          </div>
          <button
            onClick={() => handleAddToWishlist(product.id)}
            className="p-2 bg-[#0b3c5d] text-[#f2f2f2] rounded-full hover:bg-[#ffcb05] hover:text-[#1d2731] transition-all"
            aria-label="Add to wishlist"
            disabled={loading}
          >
            <FaHeart className="text-sm" />
          </button>
        </div>

        <h2 className="text-xl font-bold text-[#1d2731] truncate">
          {product.name}
        </h2>

        <p className="text-sm text-[#1d2731] line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-2">
          <p className=" font-bold">
            <span className="text-lg text-[#0b3c5d]">{product.price}</span>{" "}
            <span className="text-[#ffcb05]">DZD</span>
          </p>
          <button
            onClick={() => handleViewDetailsClick(product.id)}
            className=" font-bold flex items-center gap-2 bg-[#ffcb05] hover:bg-[#0b3c5d] text-[#0b3c5d] hover:text-[#f2f2f2] py-2 px-4 rounded-lg transition-all"
            aria-label="View product details"
          >
            <span>BUY</span>
            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}