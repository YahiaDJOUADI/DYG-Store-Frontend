"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FaCheckCircle,
  FaTrash,
  FaClipboardList,
  FaTruck,
  FaBoxOpen,
  FaInfoCircle,
  FaRegClock,
  FaEye,
  FaEdit,
  FaBan
} from "react-icons/fa";
import Swal from "sweetalert2";
import api from "@/features/api";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";

const OrderManagement = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const { data } = await api().get("/orders");
      setOrders(data.orders || data);
    } catch (error) {
      toast.error("Failed to fetch orders");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch order details
  const fetchOrderDetails = async (orderId) => {
    try {
      const { data } = await api().get(`/orders/${orderId}`);
      setSelectedOrder(data);
      setShowOrderModal(true);
    } catch (error) {
      toast.error("Failed to load order details");
      console.error("Details error:", error);
    }
  };

  // Status update handler
  const handleStatusUpdate = async (newStatus) => {
    try {
      await api().patch(`/orders/${selectedOrderId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setOrders(prev => prev.map(order => 
        order.id === selectedOrderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      toast.error("Status update failed");
      console.error("Update error:", error);
    } finally {
      handleStatusMenuClose();
    }
  };

  // Delete order handler
  const handleDeleteOrder = async (orderId) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0b3c5d",
      cancelButtonColor: "#ffcb05",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api().delete(`/orders/${orderId}`);
          toast.success("Order deleted");
          fetchOrders();
        } catch (error) {
          toast.error("Deletion failed");
          console.error("Delete error:", error);
        }
      }
    });
  };

  // Menu handlers
  const handleStatusMenuOpen = (event, orderId) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrderId(orderId);
  };

  const handleStatusMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrderId(null);
  };

  useEffect(() => { fetchOrders() }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-sm">
        <div className="p-3 bg-[#0b3c5d] rounded-lg text-white">
          <FaClipboardList className="text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600">{orders.length} total orders</p>
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
          <div className="grid grid-cols-7 gap-4 px-6 py-4 bg-gradient-to-r from-[#0b3c5d] to-[#235789] text-white font-semibold">
            <div>Customer</div>
            <div>Wilaya</div>
            <div>Total</div>
            <div>Status</div>
            <div>Order Date</div>
            <div>Actions</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.id} className="grid grid-cols-7 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Customer */}
                <div className="font-medium text-gray-900">{order.name}</div>
                
                {/* Wilaya */}
                <div className="text-gray-600">({order.wilaya})</div>
                
                {/* Total */}
                <div className="font-semibold text-[#0b3c5d]">{order.totalPrice} DZD</div>
                
                {/* Status */}
                <div>
                  <Chip
                    label={order.status}
                    className={`capitalize text-sm ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-amber-100 text-amber-800'
                    }`}
                  />
                </div>
                
                {/* Order Date */}
                <div className="text-gray-500 text-sm">
                  {new Date(order.orderDate).toLocaleDateString()}
                </div>
                
                {/* Actions */}
                <div className="flex  space-x-2">
                  <Tooltip title="View Details">
                    <IconButton
                      onClick={() => fetchOrderDetails(order.id)}
                      className="text-[#0b3c5d] hover:bg-[#0b3c5d]/10"
                    >
                      <FaEye />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Update Status">
                    <IconButton
                      onClick={(e) => handleStatusMenuOpen(e, order.id)}
                      className="text-[#235789] hover:bg-[#235789]/10"
                    >
                      <FaEdit />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Delete Order">
                    <IconButton
                      onClick={() => handleDeleteOrder(order.id)}
                      className="text-red-600 hover:bg-[#ffcb05]/10"
                    >
                      <FaBan />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <Dialog open={showOrderModal} onClose={() => setShowOrderModal(false)} maxWidth="lg" fullWidth>
        <DialogTitle className="bg-gradient-to-r from-[#0b3c5d] to-[#235789] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FaBoxOpen className="text-xl" />
              <h2 className="text-xl font-semibold">
                Order #{selectedOrder?.id.slice(-8).toUpperCase()}
              </h2>
            </div>
            {selectedOrder && (
              <Chip
                label={selectedOrder.status}
                className={`capitalize ${
                  selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  selectedOrder.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-amber-100 text-amber-800'
                }`}
              />
            )}
          </div>
        </DialogTitle>

        <DialogContent className="p-6 space-y-6">
          {/* Timeline */}
          {selectedOrder && (
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex justify-between items-center relative">
                {/* Timeline Progress Bar */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2"></div>
                <div 
                  className="absolute top-1/2 h-1 bg-[#0b3c5d] transition-all duration-500 ease-out"
                  style={{
                    width: `${selectedOrder.status === 'pending' ? '0%' :
                      selectedOrder.status === 'confirmed' ? '25%' :
                      selectedOrder.status === 'shipped' ? '50%' :
                      selectedOrder.status === 'delivered' ? '100%' : '0%'}`
                  }}
                ></div>

                {/* Timeline Steps */}
                {['pending', 'confirmed', 'shipped', 'delivered'].map((status, index) => (
                  <div key={status} className="relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center 
                      ${selectedOrder.status === status ? 'bg-[#0b3c5d] text-white' :
                      index <= ['pending', 'confirmed', 'shipped', 'delivered'].indexOf(selectedOrder.status) ? 
                      'bg-[#0b3c5d] text-white' : 'bg-white border-2 border-gray-300'}`}
                    >
                      {index === 0 && <FaRegClock />}
                      {index === 1 && <FaClipboardList />}
                      {index === 2 && <FaTruck />}
                      {index === 3 && <FaCheckCircle />}
                    </div>
                    <span className="absolute top-12 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-600 capitalize">
                      {status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Details Grid */}
          {selectedOrder && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Card */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[#0b3c5d] mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <DetailItem label="Name" value={selectedOrder.name} />
                  <DetailItem label="Phone" value={selectedOrder.phone} />
                  <DetailItem label="Wilaya" value={selectedOrder.wilaya} />
                  <DetailItem label="Address" value={selectedOrder.address} />
                </div>
              </div>

              {/* Order Summary Card */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-[#0b3c5d] mb-4">Order Summary</h3>
                <div className="space-y-3">
                  <DetailItem label="Order Date" 
                    value={new Date(selectedOrder.orderDate).toLocaleDateString()} />
                  <DetailItem label="Last Updated" 
                    value={new Date(selectedOrder.updatedAt).toLocaleDateString()} />
                  {selectedOrder.deliveryDate && (
                    <DetailItem label="Delivery Date" 
                      value={new Date(selectedOrder.deliveryDate).toLocaleDateString()} />
                  )}
                  <div className="pt-3 border-t">
                    <DetailItem 
                      label="Total Price" 
                      value={`${selectedOrder.totalPrice} DZD`}
                      valueClass="text-xl font-bold text-[#0b3c5d]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products List */}
          {selectedOrder && (
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-[#0b3c5d] mb-4">Order Items</h3>
              <div className="space-y-4">
                {selectedOrder.products.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                        {item.productId.image ? (
                          <img
                            src={item.productId.image}
                            alt={item.productId.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/placeholder-product.png';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <FaBoxOpen className="text-2xl" />
                          </div>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{item.productId.name}</h4>
                        <p className="text-sm text-gray-500">{item.productId.category}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            Stock: {item.productId.stock}
                          </span>
                          <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                            Price: {item.productId.price} DZD
                          </span>
                        </div>
                        {item.productId.category === "Video Games" && item.platform && (
                          <p className="text-sm text-gray-500 mt-1">
                            Platform: <span className="font-semibold text-gray-700">{item.platform}</span>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {item.quantity} × {item.productId.price} DZD
                      </p>
                      <p className="text-lg font-semibold text-[#0b3c5d]">
                        {item.quantity * item.productId.price} DZD
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 text-[#0b3c5d] border border-[#0b3c5d] rounded-lg hover:bg-[#0b3c5d]/10 transition-all"
            >
              Print Invoice
            </button>
            <button
              onClick={() => setShowOrderModal(false)}
              className="px-5 py-2.5 bg-[#0b3c5d] text-white rounded-lg hover:bg-[#0b3c5d]/90 transition-all"
            >
              Close Order
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleStatusMenuClose}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handleStatusUpdate('pending')} className="text-sm">
          <FaClipboardList className="mr-2 text-gray-600" />
          Mark as Pending
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('confirmed')} className="text-sm">
          <FaCheckCircle className="mr-2 text-blue-500" />
          Confirm Order
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('shipped')} className="text-sm">
          <FaTruck className="mr-2 text-amber-500" />
          Mark Shipped
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate('delivered')} className="text-sm">
          <FaBoxOpen className="mr-2 text-green-500" />
          Mark Delivered
        </MenuItem>
        <div className="border-t my-1"></div>
        <MenuItem 
          onClick={() => handleStatusUpdate('cancelled')} 
          className="text-sm text-red-600"
        >
          <FaTrash className="mr-2" />
          Cancel Order
        </MenuItem>
      </Menu>
    </div>
  );
};

// Reusable detail component
const DetailItem = ({ label, value, valueClass = "" }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}:</span>
    <span className={`font-medium ${valueClass}`}>{value}</span>
  </div>
);

export default OrderManagement;