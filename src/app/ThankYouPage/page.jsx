"use client";

import { useSearchParams } from "next/navigation";
import ThankYouPage from "@/components/ThankYouPage"; 

const ThankYouPagee = () => {
  const searchParams = useSearchParams();
  const orderData = searchParams.get("orderData");

  if (!orderData) {
    return <p>Loading...</p>;
  }

  const parsedOrderData = JSON.parse(decodeURIComponent(orderData));

  return <ThankYouPage orderData={parsedOrderData} />;
};

export default ThankYouPagee;