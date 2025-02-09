import { motion } from "framer-motion";
import { FaArrowRight, FaTrash, FaRegHeart, FaHeart, FaGamepad, FaHeadset, FaTicketAlt } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import api from "@/features/api";
import { useState } from "react";

const Wishlist = ({ wishlist, setWishlist }) => {
  const router = useRouter();

  const handleViewDetails = (itemId) => {
    router.push(`/shop/${itemId}`);
  };

  const showAlert = (title, text, icon, confirmButtonColor) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor,
    });
  };

  const handleRemoveFromWishlist = async (productId) => {
    try {
      await api().delete(`/wishlist/remove/${productId}`, {});
      setWishlist(wishlist.filter((item) => item._id !== productId));
      toast.success("Product removed from wishlist");
    } catch (err) {
      console.error("Error removing product from wishlist:", err);
      toast.error("Failed to remove product from wishlist");
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Video Games":
        return <FaGamepad className="text-[#ffcb05] group-hover:text-[#1d2731]" />;
      case "Gaming Gear":
        return <FaHeadset className="text-[#ffcb05] group-hover:text-[#1d2731]" />;
      case "Subscriptions":
        return <FaTicketAlt className="text-[#ffcb05] group-hover:text-[#1d2731]" />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-[#1d2731] mb-6 flex items-center space-x-3">
        <FaHeart className="text-[#ffcb05] w-6 h-6" />
        <span>My Wishlist</span>
      </h3>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <motion.div
              key={item._id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-[#0b3c5d]"
              whileHover={{ scale: 1.03 }}
            >
              <div className="relative">
                <img
                  src={`http://localhost:3001/${item.image}`}
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2">
                  <span className="bg-[#0b3c5d] text-[#f2f2f2] px-2 py-1 rounded-full text-xs">
                    {item.stock > 0 ? "Available" : "Out of Stock"}
                  </span>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2 bg-[#0b3c5d] text-[#f2f2f2] px-3 py-1 rounded-full w-fit">
                  {getCategoryIcon(item.category)}
                  <span className="text-sm font-medium">{item.category}</span>
                </div>

                <h2 className="text-xl font-bold text-[#1d2731] truncate">
                  {item.name}
                </h2>

                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-bold">
                    <span className="text-[#0b3c5d]">{item.price}</span>{" "}
                    <span className="text-[#ffcb05]">DZD</span>
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleViewDetails(item._id)}
                      className="p-2 bg-[#0b3c5d] hover:bg-[#ffcb05] text-[#f2f2f2] hover:text-[#1d2731] rounded-lg transition-all"
                      aria-label="View details"
                    >
                      <FaArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(item._id)}
                      className="p-2 bg-[#0b3c5d] hover:bg-[#ffcb05] text-[#f2f2f2] hover:text-[#1d2731] rounded-lg transition-all"
                      aria-label="Remove item"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border-2 border-dashed border-[#0b3c5d] rounded-lg">
          <FaRegHeart className="text-[#ffcb05] w-12 h-12 mx-auto mb-4" />
          <p className="text-xl text-[#1d2731] font-medium">
            Your wishlist is empty
          </p>
          <p className="text-[#235789] mt-1">Start adding your favorite games!</p>
        </div>
      )}
    </div>
  );
};

export default Wishlist;