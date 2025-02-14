import { useState } from "react";
import { useDispatch } from "react-redux";
import { FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash, FaSpinner, FaUser, FaEnvelope, FaPhone, FaLock, FaCheckCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { login } from "@/features/userSlice";
import api from "@/features/api";
import { toast } from "sonner";

const PersonalInfo = ({ user }) => {
  const dispatch = useDispatch();
  const [editMode, setEditMode] = useState(null); // Track which field is being edited
  const [formData, setFormData] = useState({
    userName: user.userName || "",
    email: user.email || "",
    phone: user.phone || "",
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFieldEdit = (field) => {
    setEditMode(field); // Set the field being edited
  };

  const handleCancelEdit = () => {
    setEditMode(null); // Exit edit mode
    setFormData({
      userName: user.userName,
      email: user.email,
      phone: user.phone,
    });
  };

  const handleSaveField = async (field) => {
    try {
      const response = await api().put(`/users/${user._id}`, { [field]: formData[field] });
      dispatch(login(response.data));
      toast.success(`${field} updated successfully!`);
      setEditMode(null); // Exit edit mode after saving
    } catch (err) {
      console.error(`Error updating ${field}:`, err);
      toast.error(err.response?.data?.error || "An error occurred");
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      await api().post("/reset-password", {
        email: user.email,
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success("Password changed successfully!");
      setPasswordData({ oldPassword: "", newPassword: "" });
    } catch (err) {
      console.error("Error changing password:", err);
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen mx-auto p-6 bg-white rounded-xl shadow-2xl">
      {/* Profile Information Section */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-[#1d2731] flex items-center space-x-3">
          <FaUser className="text-[#235789] text-4xl" />
          <span>Profile Information</span>
        </h2>

        {/* Username Field */}
        <div className="bg-[#f5f7fa] p-6 rounded-xl shadow-sm">
          <label className="text-sm font-medium text-[#1d2731] flex items-center space-x-2 mb-3">
            <FaUser className="text-[#235789]" />
            <span>Username</span>
          </label>
          <div className="flex items-center space-x-4">
            {editMode === "userName" ? (
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#235789] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235789] transition-all"
              />
            ) : (
              <span className="text-lg text-[#1d2731] font-medium">{user?.userName}</span>
            )}
            {editMode === "userName" ? (
              <div className="flex space-x-2">
                <motion.button
                  type="button"
                  onClick={() => handleSaveField("userName")}
                  className="py-2 px-4 bg-[#235789] text-white rounded-lg font-semibold flex items-center space-x-2 hover:bg-[#0b3c5d] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave />
                  <span>Save</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-2 px-4 bg-[#ffcb05] text-[#1d2731] rounded-lg font-semibold flex items-center space-x-2 hover:bg-[#e6b800] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes />
                  <span>Cancel</span>
                </motion.button>
              </div>
            ) : (
              <FaEdit
                className="cursor-pointer text-[#235789] text-2xl hover:text-[#0b3c5d] transition-all"
                onClick={() => handleFieldEdit("userName")}
              />
            )}
          </div>
        </div>

        {/* Email Field */}
        <div className="bg-[#f5f7fa] p-6 rounded-xl shadow-sm">
          <label className="text-sm font-medium text-[#1d2731] flex items-center space-x-2 mb-3">
            <FaEnvelope className="text-[#235789]" />
            <span>Email</span>
          </label>
          <div className="flex items-center space-x-4">
            {editMode === "email" ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#235789] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235789] transition-all"
              />
            ) : (
              <span className="text-lg text-[#1d2731] font-medium">{user?.email}</span>
            )}
            {editMode === "email" ? (
              <div className="flex space-x-2">
                <motion.button
                  type="button"
                  onClick={() => handleSaveField("email")}
                  className="py-2 px-4 bg-[#235789] text-white rounded-lg font-semibold flex items-center space-x-2 hover:bg-[#0b3c5d] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave />
                  <span>Save</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-2 px-4 bg-[#ffcb05] text-[#1d2731] rounded-lg font-semibold flex items-center space-x-2 hover:bg-[#e6b800] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes />
                  <span>Cancel</span>
                </motion.button>
              </div>
            ) : (
              <FaEdit
                className="cursor-pointer text-[#235789] text-2xl hover:text-[#0b3c5d] transition-all"
                onClick={() => handleFieldEdit("email")}
              />
            )}
          </div>
        </div>

        {/* Phone Field */}
        <div className="bg-[#f5f7fa] p-6 rounded-xl shadow-sm">
          <label className="text-sm font-medium text-[#1d2731] flex items-center space-x-2 mb-3">
            <FaPhone className="text-[#235789]" />
            <span>Phone</span>
          </label>
          <div className="flex items-center space-x-4">
            {editMode === "phone" ? (
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[#235789] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235789] transition-all"
              />
            ) : (
              <span className="text-lg text-[#1d2731] font-medium">{user?.phone}</span>
            )}
            {editMode === "phone" ? (
              <div className="flex space-x-2">
                <motion.button
                  type="button"
                  onClick={() => handleSaveField("phone")}
                  className="py-2 px-4 bg-[#235789] text-white rounded-lg font-semibold flex items-center space-x-2 hover:bg-[#0b3c5d] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaSave />
                  <span>Save</span>
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancelEdit}
                  className="py-2 px-4 bg-[#ffcb05] text-[#1d2731] rounded-lg font-semibold flex items-center space-x-2 hover:bg-[#e6b800] transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FaTimes />
                  <span>Cancel</span>
                </motion.button>
              </div>
            ) : (
              <FaEdit
                className="cursor-pointer text-[#235789] text-2xl hover:text-[#0b3c5d] transition-all"
                onClick={() => handleFieldEdit("phone")}
              />
            )}
          </div>
        </div>
      </div>

      {/* Password Change Section */}
      <div className="mt-12">
        <h3 className="text-3xl font-bold text-[#1d2731] flex items-center space-x-3">
          <FaLock className="text-[#235789] text-4xl" />
          <span>Change Password</span>
        </h3>
        <form onSubmit={handlePasswordSubmit} className="space-y-6 mt-6">
          {/* Old Password Field */}
          <div className="bg-[#f5f7fa] p-6 rounded-xl shadow-sm">
            <label className="text-sm font-medium text-[#1d2731] flex items-center space-x-2 mb-3">
              <FaLock className="text-[#235789]" />
              <span>Old Password</span>
            </label>
            <div className="flex items-center space-x-4">
              <input
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                value={passwordData.oldPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-[#235789] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235789] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="text-2xl text-[#235789] hover:text-[#0b3c5d] transition-all"
              >
                {showOldPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* New Password Field */}
          <div className="bg-[#f5f7fa] p-6 rounded-xl shadow-sm">
            <label className="text-sm font-medium text-[#1d2731] flex items-center space-x-2 mb-3">
              <FaLock className="text-[#235789]" />
              <span>New Password</span>
            </label>
            <div className="flex items-center space-x-4">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 border border-[#235789] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#235789] transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-2xl text-[#235789] hover:text-[#0b3c5d] transition-all"
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Save Password Button */}
          {(passwordData.oldPassword || passwordData.newPassword) && (
            <div className="flex justify-end space-x-4 mt-6">
              <motion.button
                type="submit"
                className="py-3 px-6 bg-[#235789] text-white rounded-xl font-semibold flex items-center justify-center space-x-2 hover:bg-[#0b3c5d] transition-all"
                disabled={passwordLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {passwordLoading ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <>
                    <FaCheckCircle />
                    <span>Change Password</span>
                  </>
                )}
              </motion.button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PersonalInfo;