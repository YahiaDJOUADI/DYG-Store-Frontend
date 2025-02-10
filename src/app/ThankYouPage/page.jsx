"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { wilayaCoordinates } from "@/wilayaCoordinates";
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import api from "@/features/api";

const ThankYouPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details
  useEffect(() => {
    if (orderId) {
      const fetchOrderDetails = async () => {
        try {
          const response = await api().get(`/orders/${orderId}`);
          setOrderData(response.data);
          setLoading(false);
        } catch (err) {
          setError(err.response?.data?.message || "Failed to fetch order details.");
          setLoading(false);
        }
      };

      fetchOrderDetails();
    }
  }, [orderId]);

  // Extract wilaya number from the order data
  const wilayaNumber = orderData?.wilaya ? parseInt(orderData.wilaya.split(" - ")[0], 10) : null;
  // Get the selected wilaya coordinates
  const selectedWilaya = wilayaNumber ? wilayaCoordinates[wilayaNumber] : { lat: 36.7525, lng: 3.04197 }; // Default to Algiers if not found

  // Initialize the map
  useEffect(() => {
    if (orderData) {
      const map = L.map("map").setView([selectedWilaya.lat, selectedWilaya.lng], 10);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([selectedWilaya.lat, selectedWilaya.lng])
        .addTo(map)
        .bindPopup(`Delivery to ${orderData?.wilaya || "Algiers"}`)
        .openPopup();

      return () => map.remove();
    }
  }, [selectedWilaya, orderData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0b3c5d]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
        <p className="text-[#0b3c5d] text-lg">{error}</p>
      </div>
    );
  }

  if (!orderData || !orderData.wilaya) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
        <p className="text-[#0b3c5d] text-lg">Loading or invalid order data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#1d2731] p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-[#0b3c5d] mb-6">Thank You, {orderData.name}!</h1>
        <p className="text-lg mb-6">
          Your order has been successfully placed. We will deliver it to{" "}
          <span className="font-semibold">{orderData.address}, {orderData.wilaya}</span>.
        </p>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0b3c5d] mb-4">Order Summary</h2>
          <div className="space-y-4">
            {orderData.products.map(({ productId, quantity, platform }, index) => (
              <div key={productId.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <img
                    src={productId.image}
                    alt={productId.name}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => console.error(`Failed to load image: ${productId.image}`)}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{productId.name}</h3>
                    <p className="text-gray-600">
                      <span className="text-[#0b3c5d]">{productId.price}</span>{" "}
                      <span className="text-[#ffcb05]">DZD</span> x {quantity}
                    </p>
                    {productId.category === "Video Games" && platform && (
                      <p className="text-gray-600">
                        Platform: <span className="text-[#0b3c5d]">{platform}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-xl font-bold mt-6">
            Total:{" "}
            <span className="text-[#0b3c5d]">{orderData.totalPrice.toFixed(2)}</span>{" "}
            <span className="text-[#ffcb05]">DZD</span>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0b3c5d] mb-4">Delivery Location</h2>
          <div id="map" style={{ height: "400px", width: "100%", borderRadius: "8px" }} />
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="px-6 py-2 bg-[#0b3c5d] text-white font-bold rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] transition-all duration-300"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;