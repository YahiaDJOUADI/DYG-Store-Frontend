import React from "react";
import { FaListAlt, FaCalendarAlt, FaTruck, FaMapMarkerAlt, FaPhoneAlt, FaBoxOpen, FaUser } from "react-icons/fa";

const OrderList = ({ orders }) => {
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
    <div className="min-h-screen mx-auto p-6 bg-white rounded-xl shadow-2xl">
      <h3 className="text-3xl font-bold text-[#1d2731] mb-6 flex items-center space-x-3">
        <FaListAlt className="text-[#235789] " />
        <span>Your Orders</span>
      </h3>

      <ul className="space-y-6">
        {orders.map((order) => {
          const progress = getProgress(order.status);

          return (
            <li
              key={order.id}
              className="border border-[#0b3c5d] p-6 rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
            >
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
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default OrderList;