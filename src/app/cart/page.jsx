"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { emptyCart, removeFromCart } from "@/features/cartSlice";
import { useForm, Controller } from "react-hook-form";
import wilayas from "@/wilayas";
import api from "@/features/api";
import { useRouter } from "next/navigation";
import * as Tooltip from "@radix-ui/react-tooltip";
import { toast } from "sonner"; // Import Sonner for toasts
import { Trash2, Share, ArrowLeft } from "lucide-react"; // Icons for actions

export default function CartPage() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.products);
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  // Track abandoned carts
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (items.length > 0) {
        api().post("/track-abandoned-cart", { items, userId: user?._id });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [items, user]);

  // Set default form values if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("name", user.userName || "");
      setValue("phone", user.phone || "");
    }
  }, [isAuthenticated, user, setValue]);

  // Remove one item from the cart
  const handleRemoveOne = (productId) => {
    const index = items.findIndex((item) => item.product.id === productId);
    if (index !== -1) {
      dispatch(removeFromCart(index));
      toast.success("One item removed from cart.");
    }
  };

  // Remove all instances of a product from the cart
  const handleRemoveProduct = (productId) => {
    const index = items.findIndex((item) => item.product.id === productId);
    if (index !== -1) {
      while (items[index].quantity > 1) {
        dispatch(removeFromCart(index));
      }
      dispatch(removeFromCart(index));
      toast.success("All items removed from cart.");
    }
  };

  // Clear the entire cart
  const handleClearCart = () => {
    dispatch(emptyCart());
    toast.success("Cart cleared successfully.");
  };

  // Share cart via link
  const handleShareCart = () => {
    const cartLink = `${window.location.origin}/cart?shared=true`;
    navigator.clipboard.writeText(cartLink).then(() => {
      toast.success("Cart link copied to clipboard!");
    });
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const selectedWilaya = wilayas.find((wilaya) => wilaya.number === data.wilaya);
    const formattedWilaya = selectedWilaya ? `${selectedWilaya.number} - ${selectedWilaya.name}` : "";

    const orderData = {
      wilaya: formattedWilaya,
      products: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        platform: item.product.category === "Video Games" ? item.platform : undefined,
      })),
      name: data.name,
      phone: data.phone.startsWith("+213") ? data.phone : `+213${data.phone}`,
      address: data.address,
      userId: isAuthenticated && user ? user._id : null,
    };

    try {
      const endpoint = isAuthenticated ? "/orders/user" : "/orders/guest";
      const response = await api().post(endpoint, orderData);

      if (response.status === 201) {
        const orderId = response.data.order.id;
        localStorage.removeItem("items");
        dispatch(emptyCart());
        router.push(`/ThankYouPage?orderId=${orderId}`);
        setIsCheckoutModalOpen(false);
      }
    } catch (err) {
      console.error("Error during checkout:", err);
      toast.error(err.response?.data?.message || "Failed to process your order. Please try again.");
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
  if (items.length === 0) {
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
      

{/* Header with icons */}
<div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold">Your Cart</h1>
  <div className="flex gap-4">
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={handleClearCart}
            className="p-2 text-gray-600 hover:text-red-500 transition-all duration-300"
            aria-label="Clear Cart"
          >
            <Trash2 size={24} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="bg-gray-800 text-white text-sm rounded px-2 py-1 shadow-lg"
          side="bottom"
          sideOffset={5}
        >
          Clear Cart
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            onClick={handleShareCart}
            className="p-2 text-gray-600 hover:text-blue-500 transition-all duration-300"
            aria-label="Share Cart"
          >
            <Share size={24} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="bg-gray-800 text-white text-sm rounded px-2 py-1 shadow-lg"
          side="bottom"
          sideOffset={5}
        >
          Share Cart
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Link
            href="/shop"
            className="p-2 text-gray-600 hover:text-[#ffcb05] transition-all duration-300"
            aria-label="Continue Shopping"
          >
            <ArrowLeft size={24} />
          </Link>
        </Tooltip.Trigger>
        <Tooltip.Content
          className="bg-gray-800 text-white text-sm rounded px-2 py-1 shadow-lg"
          side="bottom"
          sideOffset={5}
        >
          Continue Shopping
          <Tooltip.Arrow className="fill-gray-800" />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  </div>
</div>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
            <img
                src={item.product.mainImage}
                alt={item.product.name}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{item.product.name}</h2>
                <p className="text-gray-600">
                  <span className="text-[#0b3c5d]">{item.product.price}</span>{" "}
                  <span className="text-[#ffcb05]">DZD</span> x {item.quantity}
                </p>
                {item.product.category === "Video Games" && (
                  <p className="text-gray-600">
                    Platform: <span className="text-[#0b3c5d]">{item.platform}</span>
                  </p>
                )}
                {item.product.stock < 5 && (
                  <p className="text-red-500 text-sm">Low stock!</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleRemoveOne(item.product.id)}
                className="px-4 py-2 bg-[#0b3c5d] text-white font-bold rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] hover:scale-105 transition-all duration-300 transform text-sm shadow-md"
              >
                Remove One
              </button>
              <button
                onClick={() => handleRemoveProduct(item.product.id)}
                className="px-4 py-2 bg-[#ffcb05] text-[#0b3c5d] font-bold rounded-md hover:bg-[#0b3c5d] hover:text-white hover:scale-105 transition-all duration-300 transform text-sm shadow-md"
              >
                Remove All
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Total and Checkout Button */}
      <div className="mt-6">
        <div className="text-xl font-bold">
          Total:{" "}
          <span className="text-[#0b3c5d]">{totalPrice.toFixed(2)}</span>{" "}
          <span className="text-[#ffcb05]">DZD</span>
        </div>
        <button
          onClick={() => setIsCheckoutModalOpen(true)}
          className="mt-4 px-6 py-2 bg-[#0b3c5d] text-white font-bold rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] hover:scale-105 transition-all duration-300 transform text-sm shadow-md"
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-2xl font-bold mb-4 text-[#1d2731]">Checkout</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Form fields for name, phone, wilaya, address */}
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
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1d2731]">
                  Phone Number
                </label>
                <div className="flex items-center">
                  <div className="flex items-center bg-gray-100 p-2 border border-gray-300 rounded-l-md">
                    <img
                      src="/algeria.png"
                      alt="Algeria Flag"
                      className="w-5 h-5 mr-2"
                    />
                    <span className="text-gray-700">+213</span>
                  </div>
                  <Controller
                    name="phone"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Phone is required" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        className="flex-1 p-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#0b3c5d]"
                        placeholder="Enter your phone number"
                      />
                    )}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.wilaya.message}
                  </p>
                )}
              </div>

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
                  <p className="text-red-500 text-sm mt-1">
                    {errors.address.message}
                  </p>
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
