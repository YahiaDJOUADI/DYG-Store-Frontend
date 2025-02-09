"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { FaUserCircle, FaEdit, FaSave, FaTimes, FaSpinner, FaEye, FaEyeSlash, FaGamepad } from "react-icons/fa";
import { login } from "@/features/userSlice";
import api from "@/features/api";
import Wishlist from "@/components/Wishlist"; 

export default function MyAccount() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    phone: "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const defaultProfilePicture =
    user?.type === "admin"
      ? "/cute-angry-diver-gaming-cartoon-vector-icon-illustration-science-technology-icon-isolated-flat_138676-12437.avif"
      : "/cute-diver-playing-vr-game-with-controller-cartoon-vector-icon-illustration-science-technology-flat_138676-13994.avif";

  useEffect(() => {
    if (user) {
      setFormData({
        userName: user.userName || "",
        email: user.email || "",
        phone: user.phone || "",
      });

      const fetchWishlist = async () => {
        try {
          const wishlistResponse = await api().get("/wishlist");
          setWishlist(wishlistResponse.data.wishlist.items);
        } catch (err) {
          console.error("Error fetching wishlist:", err);
          setError(err.response?.data?.error || "An error occurred");
        } finally {
          setLoading(false);
        }
      };

      fetchWishlist();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.email) {
      toast.error("Username and email are required.");
      return;
    }

    try {
      const response = await api().put(`/users/${user._id}`, formData);

      const updatedUser = response.data.user;
      dispatch(login(updatedUser));
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating user data:", err);
      setError(err.response?.data?.error || "An error occurred");
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await api().post(
        "/reset-password",
        {
          email: formData.email,
          ...passwordData,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.message) {
        toast.success("Password changed successfully!");
        setPasswordData({ oldPassword: "", newPassword: "" });
      }
    } catch (err) {
      console.error("Error changing password:", err);
      setError(err.response?.data?.error || "An error occurred");
      toast.error("Failed to change password. Please try again.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleFieldEdit = (field) => {
    setEditMode(field);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setFormData({
      userName: user?.userName || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
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

        {/* Gamer Stats Section */}
        <div className="mt-8 bg-gradient-to-r from-[#235789] to-[#0b3c5d] p-6 rounded-lg text-white">
          <h3 className="text-2xl font-semibold mb-4 flex items-center space-x-2">
            <FaGamepad />
            <span>Gamer Stats</span>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-lg font-bold">{wishlist.length}</p>
              <p className="text-sm">Wishlist Items</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">5</p>
              <p className="text-sm">Orders Placed</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">3</p>
              <p className="text-sm">Achievements Unlocked</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">Level 10</p>
              <p className="text-sm">Gamer Level</p>
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-[#1d2731] mb-4 flex items-center space-x-2">
            <FaUserCircle />
            <span>Personal Information</span>
          </h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {/* Username Field */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-[#1d2731]">Username</label>
                {editMode === "userName" ? (
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#235789] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235789]"
                  />
                ) : (
                  <span className="block text-lg text-[#1d2731]">
                    {user?.userName}
                  </span>
                )}
              </div>
              <FaEdit
                className="cursor-pointer text-[#235789] text-xl hover:text-[#0b3c5d] transition-all"
                onClick={() => handleFieldEdit("userName")}
              />
            </div>
            {/* Email Field */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-[#1d2731]">Email</label>
                {editMode === "email" ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#235789] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235789]"
                  />
                ) : (
                  <span className="block text-lg text-[#1d2731]">
                    {user?.email}
                  </span>
                )}
              </div>
              <FaEdit
                className="cursor-pointer text-[#235789] text-xl hover:text-[#0b3c5d] transition-all"
                onClick={() => handleFieldEdit("email")}
              />
            </div>
            {/* Phone Field */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-[#1d2731]">Phone</label>
                {editMode === "phone" ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-[#235789] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235789]"
                  />
                ) : (
                  <span className="block text-lg text-[#1d2731]">
                    {user?.phone}
                  </span>
                )}
              </div>
              <FaEdit
                className="cursor-pointer text-[#235789] text-xl hover:text-[#0b3c5d] transition-all"
                onClick={() => handleFieldEdit("phone")}
              />
            </div>
            {/* Save and Cancel Buttons */}
            {editMode && (
              <div className="flex justify-end space-x-4 mt-6">
                <motion.button
                  type="submit"
                  className="py-2 px-4 bg-[#235789] text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-[#0b3c5d] transition-all"
                >
                  <FaSave />
                  <span>Save Changes</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-2 px-4 bg-[#ffcb05] text-[#1d2731] rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-[#e6b800] transition-all"
                >
                  <FaTimes />
                  <span>Cancel</span>
                </motion.button>
              </div>
            )}
          </form>
        </div>

        {/* Password Change Section */}
        <div className="mt-8">
          <h3 className="text-2xl font-semibold text-[#1d2731] mb-4 flex items-center space-x-2">
            <FaEye />
            <span>Change Password</span>
          </h3>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Old Password Field */}
            <div className="flex items-center space-x-4">
              <label className="block text-[#1d2731]">Old Password</label>
              <div className="flex-1">
                <input
                  type={showOldPassword ? "text" : "password"}
                  name="oldPassword"
                  value={passwordData.oldPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-[#235789] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235789]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="text-xl text-[#235789] hover:text-[#0b3c5d] transition-all"
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* New Password Field */}
            <div className="flex items-center space-x-4">
              <label className="block text-[#1d2731]">New Password</label>
              <div className="flex-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-[#235789] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235789]"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-xl text-[#235789] hover:text-[#0b3c5d] transition-all"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {/* Save Password Button */}
            <div className="flex justify-end space-x-4 mt-6">
              <motion.button
                type="submit"
                className="py-2 px-4 bg-[#235789] text-white rounded-lg font-semibold flex items-center justify-center space-x-2 hover:bg-[#0b3c5d] transition-all"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaSave />
                    <span>Change Password</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </div>

        {/* Wishlist Section */}
        <Wishlist wishlist={wishlist} setWishlist={setWishlist} />
      </motion.div>
    </div>
  );
}