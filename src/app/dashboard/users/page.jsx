"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FaTrash, FaUsers, FaEye, FaListAlt, FaCalendarAlt, FaTruck, FaMapMarkerAlt, FaPhoneAlt, FaBoxOpen, FaUser 
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "@/features/api";
import {
  CircularProgress, IconButton, Tooltip, Dialog, DialogTitle, DialogContent
} from "@mui/material";

const UserManagement = () => {
  // State management
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);

  // Fetch users from the API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api().get("/users");
      setUserList(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details and orders by ID
  const fetchUserDetails = async (id) => {
    try {
      const response = await api().get(`/users/${id}/details`);
      setSelectedUser(response.data);
      setShowUserModal(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user with confirmation
  const handleDeleteConfirmation = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0b3c5d",
      cancelButtonColor: "#ffcb05",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api().delete(`/users/${id}`);
          toast.success("User deleted successfully");
          fetchUsers();
        } catch (error) {
          console.error("Error deleting user:", error);
          toast.error("Failed to delete user");
        }
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-[#0b3c5d] text-white";
      case "pending":
        return "bg-[#f2f2f2] text-[#1d2731] border border-[#0b3c5d]";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getProgress = (status) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return { width: "100%", color: "bg-green-500" };
      case "shipped":
        return { width: "66%", color: "bg-[#0b3c5d]" };
      default:
        return { width: "33%", color: "bg-[#235789]" };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-sm">
        <div className="p-3 bg-[#0b3c5d] rounded-lg text-white">
          <FaUsers className="text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">{userList.length} total users</p>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <CircularProgress style={{ color: "#0b3c5d" }} />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gradient-to-r from-[#0b3c5d] to-[#235789] text-white font-semibold">
            <div className="col-span-3">User</div>
            <div className="col-span-4">Email</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-3">Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {userList.map((user) => (
              <div key={user._id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* User */}
                <div className="col-span-3 font-medium text-gray-900 flex items-center">
                  <img
                    src="/cute-diver-playing-vr-game-with-controller-cartoon-vector-icon-illustration-science-technology-flat_138676-13994.avif"
                    alt="Profile"
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  {user.userName}
                </div>
                
                {/* Email */}
                <div className="col-span-4 text-gray-600">{user.email}</div>
                
                {/* Type */}
                <div className="col-span-2 text-gray-600">{user.type}</div>
                
                {/* Actions */}
                <div className="col-span-3 flex space-x-2">
                  <Tooltip title="View Details">
                    <IconButton
                      onClick={() => fetchUserDetails(user._id)}
                      className="text-[#0b3c5d] hover:text-[#0b3c5d]/80 p-1"
                    >
                      <FaEye />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete User">
                    <IconButton
                      onClick={() => handleDeleteConfirmation(user._id)}
                      className="text-red-600 hover:text-red-500 p-1"
                    >
                      <FaTrash />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Details Modal */}
      <Dialog open={showUserModal} onClose={() => setShowUserModal(false)} maxWidth="md" fullWidth>
        <DialogTitle className="bg-gradient-to-r from-[#0b3c5d] to-[#235789] text-white">
          User Details
        </DialogTitle>
        <DialogContent className="p-6">
          {selectedUser && (
            <div className="space-y-6 py-3">
              <div className="flex items-center space-x-4">
                <img
                  src="/cute-diver-playing-vr-game-with-controller-cartoon-vector-icon-illustration-science-technology-flat_138676-13994.avif"
                  alt="Profile"
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedUser.user.userName}</h2>
                  <p className="text-gray-600"><strong>Email:</strong> {selectedUser.user.email}</p>
                  <p className="text-gray-600"><strong>Phone:</strong> {selectedUser.user.phone}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Orders ({selectedUser.orders.length})
                </h3>
                <div className="space-y-4">
                  {selectedUser.orders.map((order) => {
                    const progress = getProgress(order.status);

                    return (
                      <div key={order._id} className="border border-[#0b3c5d] p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
                        {/* Order Header */}
                        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                          <div className="space-y-2">
                            {/* Customer Name */}
                            <p className="text-sm text-[#235789] flex items-center">
                              <FaUser className="mr-2 text-[#0b3c5d]" />
                              <span>Customer: {order.name}</span>
                            </p>
                            <p className="text-sm text-[#235789] flex items-center">
                              <FaCalendarAlt className="mr-2 text-[#0b3c5d]" />
                              <span>Date: {new Date(order.orderDate).toLocaleDateString()}</span>
                            </p>
                            <p className="text-sm text-[#235789] flex items-center">
                              <FaBoxOpen className="mr-2 text-[#0b3c5d]" />
                              <span>Total: {order.totalPrice} DZD</span>
                            </p>
                          </div>

                          {/* Status Badge */}
                          <div className="space-y-2">
                            <p className="text-sm text-[#235789] flex items-center">
                              <FaTruck className="mr-2 text-[#0b3c5d]" />
                              <span>Status: </span>
                              <span className={`ml-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {order.status}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 mb-6">
                          <div className="w-full bg-[#e0e0e0] rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${progress.color} transition-all duration-500`}
                              style={{ width: progress.width }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-[#235789] mt-2">
                            <span>Ordered</span>
                            <span>Shipped</span>
                            <span>Delivered</span>
                          </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center text-sm text-[#235789]">
                            <FaMapMarkerAlt className="mr-2 text-[#0b3c5d] flex-shrink-0" />
                            <span>{order.address}, {order.wilaya}</span>
                          </div>
                          <div className="flex items-center text-sm text-[#235789]">
                            <FaPhoneAlt className="mr-2 text-[#0b3c5d] flex-shrink-0" />
                            <span>{order.phone}</span>
                          </div>
                        </div>

                        {/* Products List */}
                        <div>
                          <strong className="block mb-4 text-[#1d2731]">Products:</strong>
                          <ul className="space-y-4">
                            {order.products.map((product) => (
                              <li
                                key={product.productId.id}
                                className="flex space-x-4 items-center p-4 rounded-lg bg-[#f2f2f2] hover:bg-[#e0e0e0] transition-colors duration-300"
                              >
                                <img
                                  src={product.productId.mainImage}
                                  alt={product.productId.name}
                                  className="w-16 h-16 object-cover rounded-lg shadow-sm"
                                />
                                <div className="flex-1">
                                  <p className="font-semibold text-[#1d2731]">{product.productId.name}</p>
                                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                    <span className="text-[#235789]">Quantity: {product.quantity}</span>
                                    <span className="text-[#0b3c5d]">Platform: {product.platform}</span>
                                    <span className="text-[#235789]">Price: {product.productId.price} DZD</span>
                                    <span className="text-[#0b3c5d]">Total: {product.quantity * product.productId.price} DZD</span>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Order Timestamps */}
                        <div className="mt-6 text-[#1d2731] text-sm space-y-2">
                          <p>
                            <strong>Order Created At:</strong> {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Last Updated At:</strong> {new Date(order.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;