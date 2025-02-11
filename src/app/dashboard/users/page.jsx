"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FaTrash, FaUsers, FaEye
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
            <div className="space-y-6">
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
                <h3 className="text-lg font-semibold text-gray-900">Orders</h3>
                <div className="space-y-4">
                  {selectedUser.orders.map((order) => (
                    <div key={order._id} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">Total Price: {order.totalPrice} DZD</h4>
                          <p className="text-gray-600">Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
                          <p className="text-gray-600">Last Updated: {new Date(order.updatedAt).toLocaleDateString()}</p>
                          <p className="text-gray-600">Wilaya: {order.wilaya}</p>
                          <p className="text-gray-600"><strong>Status:</strong> <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span></p>
                          <p className="text-gray-600"><strong>Customer Name:</strong> {order.name}</p>
                          <p className="text-gray-600"><strong>Customer Phone:</strong> {order.phone}</p>
                        </div>
                        <img
                          src={order.products[0]?.productId.image || "/default-product.png"}
                          alt="Product"
                          className="w-16 h-16 rounded-full"
                        />
                      </div>
                      <div className="mt-4">
                        {order.products.map((product) => (
                          <div key={product.productId.id} className="flex justify-between items-center">
                            <div>
                              <p className="text-gray-900">{product.productId.name}</p>
                              <p className="text-gray-600">Quantity: {product.quantity}</p>
                              {product.productId.category === "Video Games" && product.platform && (
                                <p className="text-gray-600">
                                  Platform: <span className="font-semibold text-gray-700">{product.platform}</span>
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
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