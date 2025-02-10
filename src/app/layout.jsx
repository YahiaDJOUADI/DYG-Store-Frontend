"use client";
import { Provider } from "react-redux";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import store from "@/store";
import { usePathname } from "next/navigation";
import "./globals.css";

const toasterConfig = {
  position: "bottom-right",
  toastOptions: {
    style: {
      backgroundColor: "#235789",
      color: "#f2f2f2",
      fontFamily: "sans-serif",
      borderRadius: "8px",
      boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
      padding: "12px 16px",
    },
  },
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/DYG Logo - Favicon - 32x32.png"
          type="image/vnd.microsoft.icon"
        />
      </head>
      <body className="font-sans bg-[#f2f2f2] text-[#1d2731]">
        <Provider store={store}>
          {!isDashboard && <Navbar />}
          <main className={`min-h-screen flex flex-col ${!isDashboard ? "justify-between" : ""}`}>
            {children}
          </main>
          {!isDashboard && <Footer />}
          <Toaster {...toasterConfig} />
        </Provider>
      </body>
    </html>
  );
}