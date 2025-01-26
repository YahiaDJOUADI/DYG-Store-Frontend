"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { setCart, clearCart } from "@/features/cartSlice";
import { useForm, Controller } from "react-hook-form";
import wilayas from "@/wilayas";

export default function CartPage() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const { user, isAuthenticated } = useSelector((state) => state.user); // Get user data from Redux store
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  // React Hook Form
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Pre-fill name and phone if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("name", user.userName || ""); // Use user.userName for the name
      setValue("phone", user.phone || ""); // Use user.phone for the phone
    }
  }, [isAuthenticated, user, setValue]);

  // Helper function to show SweetAlert messages
  const showAlert = (title, text, icon, confirmButtonColor) => {
    Swal.fire({ title, text, icon, confirmButtonColor });
  };

  // Fetch cart from localStorage
  useEffect(() => {
    setLoading(true);
    try {
      const cartData = JSON.parse(localStorage.getItem("cart")) || [];
      dispatch(setCart(cartData));
    } catch (err) {
      console.error("Error fetching cart from localStorage:", err);
      setError("Failed to fetch cart data.");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  // Handle removing one item from the cart
  const handleRemoveOne = (productId) => {
    try {
      const updatedCart = cart
        .map((item) => {
          if (item.productId === productId) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
        .filter((item) => item.quantity > 0); // Remove items with quantity <= 0

      localStorage.setItem("cart", JSON.stringify(updatedCart));
      dispatch(setCart(updatedCart));
    } catch (err) {
      console.error("Error removing one item:", err);
      showAlert("Error", "Failed to update the cart.", "error", "#0b3c5d");
    }
  };

  // Handle removing all of a product from the cart
  const handleRemoveProduct = (productId) => {
    try {
      const updatedCart = cart.filter((item) => item.productId !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      dispatch(setCart(updatedCart));
      showAlert("Success", "Item removed from cart.", "success", "#0b3c5d");
    } catch (err) {
      console.error("Error removing product:", err);
      showAlert(
        "Error",
        "Failed to remove the product from the cart.",
        "error",
        "#0b3c5d"
      );
    }
  };

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);

  // Handle checkout using Axios
  const onSubmit = async (data) => {
    // Validate cart
    if (cart.length === 0) {
      showAlert("Error", "Your cart is empty.", "error", "#0b3c5d");
      return;
    }

    // Validate totalPrice
    if (isNaN(totalPrice) || totalPrice <= 0) {
      showAlert("Error", "Invalid total price.", "error", "#0b3c5d");
      return;
    }

    // Prepare order data
    const orderData = {
      wilaya: data.wilaya,
      products: cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice,
      name: isAuthenticated && user ? user.userName : data.name, // Use user's name if authenticated
      phone: isAuthenticated && user ? user.phone : data.phone, // Use user's phone if authenticated
      address: data.address,
    };

    try {
      // Send order data to the backend using Axios
      const response = await axios.post(
        "http://localhost:3001/orders",
        orderData
      );

      if (response.status === 201) {
        // Clear the cart
        localStorage.removeItem("cart");
        dispatch(clearCart());

        // Show success message
        showAlert(
          "Order Placed!",
          `Thank you, ${orderData.name}! Your order will be delivered to ${orderData.address}, ${orderData.wilaya}. We will contact you at ${orderData.phone}.`,
          "success",
          "#0b3c5d"
        );

        // Close the checkout modal
        setIsCheckoutModalOpen(false);
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      showAlert(
        "Error",
        err.response?.data?.message ||
          "Failed to process your order. Please try again.",
        "error",
        "#0b3c5d"
      );
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b3c5d]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
        <p className="text-[#0b3c5d] text-lg">{error}</p>
      </div>
    );
  }

  // Empty cart state
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] text-[#1d2731] flex flex-col items-center justify-center p-6">
        <h1 className="text-4xl font-bold mb-4">Your Cart</h1>
        <p className="text-lg mb-6">
          Your cart is empty.{" "}
          <Link
            href="/shop"
            className="text-[#0b3c5d] font-semibold hover:underline transition duration-300"
          >
            Continue shopping
          </Link>
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-24 w-24 text-[#0b3c5d] mb-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#1d2731] p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div
            key={item.productId}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <img
                src={`http://localhost:3001/public/${item.image}`}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-gray-600">
                  <span className="text-[#0b3c5d]">{item.price}</span>{" "}
                  <span className="text-[#ffcb05]">DZD</span> x {item.quantity}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRemoveOne(item.productId)}
                className="px-4 py-2 bg-[#0b3c5d] text-white font-bold rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] hover:scale-105 transition-all duration-300 transform text-sm shadow-md"
              >
                Remove One
              </button>
              <button
                onClick={() => handleRemoveProduct(item.productId)}
                className="px-4 py-2 bg-[#ffcb05] text-[#0b3c5d] font-bold rounded-md hover:bg-[#0b3c5d] hover:text-white hover:scale-105 transition-all duration-300 transform text-sm shadow-md"
              >
                Remove All
              </button>
            </div>
          </div>
        ))}
        <div className="text-xl font-bold mt-6">
          Total:{" "}
          <span className="text-[#0b3c5d]">{totalPrice.toFixed(2)}</span>{" "}
          <span className="text-[#ffcb05]">DZD</span>
        </div>
        <button
          onClick={() => setIsCheckoutModalOpen(true)}
          className="px-6 py-2 bg-[#0b3c5d] text-white font-bold rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] hover:scale-105 transition-all duration-300 transform text-sm shadow-md"
        >
          Proceed to Checkout
        </button>
      </div>

      {isCheckoutModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
      <h2 className="text-2xl font-bold mb-4 text-[#1d2731]">Checkout</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-[#1d2731]">
            Name
          </label>
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]"
                placeholder="Enter your name"
                disabled={isAuthenticated}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-[#1d2731]">
            Phone Number
          </label>
          <Controller
            name="phone"
            control={control}
            defaultValue=""
            rules={{ required: "Phone is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="tel"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]"
                placeholder="Enter your phone number"
                disabled={isAuthenticated}
              />
            )}
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Wilaya Field */}
        <div>
          <label className="block text-sm font-medium text-[#1d2731]">
            Wilaya
          </label>
          <Controller
            name="wilaya"
            control={control}
            defaultValue=""
            rules={{ required: "Wilaya is required" }}
            render={({ field }) => (
              <select
                {...field}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]"
              >
                <option value="">Select a wilaya</option>
                {wilayas.map((wilaya) => (
                  <option key={wilaya.number} value={wilaya.number}>
                    {wilaya.number} - {wilaya.name}
                  </option>
                ))}
              </select>
            )}
          />
          {errors.wilaya && (
            <p className="text-red-500 text-sm mt-1">{errors.wilaya.message}</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-[#1d2731]">
            Address
          </label>
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: "Address is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]"
                placeholder="Enter your address"
              />
            )}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setIsCheckoutModalOpen(false)}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-all duration-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[#0b3c5d] text-white rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] hover:scale-105 transition-all duration-300 transform text-sm shadow-md"
          >
            Place Order
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
}