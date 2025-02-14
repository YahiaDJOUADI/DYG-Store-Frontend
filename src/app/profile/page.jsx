"use client";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FaSpinner } from "react-icons/fa";
import api from "@/features/api";
import PersonalInfo from "@/components/profileComponents/Personalinfo";
import Wishlist from "@/components/Wishlist";
import OrderList from "@/components/profileComponents/OrderList";

const ProfilePage = () => {
  const { user } = useSelector((state) => state.user);
  const [wishlist, setWishlist] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("personalInfo");

  const defaultProfilePicture =
    user?.type === "admin"
      ? "/cute-angry-diver-gaming-cartoon-vector-icon-illustration-science-technology-icon-isolated-flat_138676-12437.avif"
      : "/cute-diver-playing-vr-game-with-controller-cartoon-vector-icon-illustration-science-technology-flat_138676-13994.avif";

  useEffect(() => {
    if (user) {
      const fetchDetails = async () => {
        try {
          const userDetailsResponse = await api().get(`/users/${user._id}/details`);
          const { user: userDetails, orders: userOrders } = userDetailsResponse.data;
          setOrders(userOrders);
        } catch (err) {
          console.error("Error fetching user details:", err);
          setError(err.response?.data?.error || "An error occurred");
        }
      };

      const fetchWishlist = async () => {
        try {
          const wishlistResponse = await api().get("/wishlist");
          setWishlist(wishlistResponse.data.wishlist.items);
        } catch (err) {
          console.error("Error fetching wishlist:", err);
          setError(err.response?.data?.error || "An error occurred");
        }
      };

      fetchDetails();
      fetchWishlist();
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [user]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "personalInfo":
        return <PersonalInfo user={user} />;
      case "wishlist":
        return <Wishlist wishlist={wishlist} setWishlist={setWishlist} />;
      case "orders":
        return <OrderList orders={orders} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#f2f2f2] to-[#e0e0e0]">
        <FaSpinner className="animate-spin text-4xl text-[#235789]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#f2f2f2] to-[#e0e0e0]">
        <p>User data not available. Please log in.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f2f2f2] to-[#e0e0e0] flex flex-col items-center py-8">
      <motion.div
        className="w-full max-w-4xl bg-white rounded-lg shadow-2xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header */}
        <div className="relative mb-8">
          <div className="h-32 bg-gradient-to-r from-[#235789] to-[#0b3c5d] rounded-t-lg"></div>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={user?.profilePicture || defaultProfilePicture}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-[#1d2731]">
            {user?.userName}
          </h2>
          <p className="text-md text-[#1d2731]">{user?.email}</p>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8">
          <div className="flex justify-center space-x-8">
            <button
              className={`py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "personalInfo"
                  ? "bg-[#235789] text-white shadow-md hover:bg-[#1a446b]"
                  : "bg-[#e0e0e0] text-[#1d2731] hover:bg-[#d0d0d0] hover:text-[#235789]"
              }`}
              onClick={() => setActiveTab("personalInfo")}
            >
              Personal Information
            </button>
            <button
              className={`py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "wishlist"
                  ? "bg-[#235789] text-white shadow-md hover:bg-[#1a446b]"
                  : "bg-[#e0e0e0] text-[#1d2731] hover:bg-[#d0d0d0] hover:text-[#235789]"
              }`}
              onClick={() => setActiveTab("wishlist")}
            >
              Wishlist
            </button>
            <button
              className={`py-2 px-4 rounded-lg font-semibold transition-all duration-300 ${
                activeTab === "orders"
                  ? "bg-[#235789] text-white shadow-md hover:bg-[#1a446b]"
                  : "bg-[#e0e0e0] text-[#1d2731] hover:bg-[#d0d0d0] hover:text-[#235789]"
              }`}
              onClick={() => setActiveTab("orders")}
            >
              Orders
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {renderTabContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;