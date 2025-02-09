"use client";
import React, { useEffect, useState } from "react";
import { FaBox, FaEnvelope, FaShoppingCart, FaUserCog, FaUsers, FaBars, FaTimes } from "react-icons/fa";
import StatCard from "@/components/adminComponents/StatCard";
import api from "@/features/api";
import Link from "next/link";

const AdminLayout = ({ children, activeSection, setActiveSection }) => {
  const [dataCounts, setDataCounts] = useState({
    userCount: 0,
    orderCount: 0,
    productCount: 0,
    messageCount: 0,
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar is open by default

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api().get("/dashboard");
        setDataCounts(response.data);
      } catch (error) {
        console.error("Failed to fetch data counts:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen h-screen bg-[#f2f2f2] flex">
      {/* Sidebar */}
      <div
        className={`h-full bg-[#1d2731] text-[#f2f2f2] p-4 transition-all duration-300 ${
          isSidebarOpen ? "w-56" : "w-16"
        }`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="w-full flex items-center justify-center p-2 mb-4 bg-[#235789] rounded-lg hover:bg-[#ffcb05] hover:text-[#1d2731] transition-all duration-300"
        >
          {isSidebarOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
        </button>

        {/* Sidebar Links */}
        <ul className="space-y-3">
          <li>
            <Link href="/dashboard/users">
              <div
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg ${
                  activeSection === "Users"
                    ? "bg-[#ffcb05] text-[#1d2731]"
                    : "hover:bg-[#ffcb05] hover:text-[#1d2731]"
                }`}
              >
                <FaUsers className="text-xl" />
                {isSidebarOpen && <span className="text-sm">Users</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/messages">
              <div
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg ${
                  activeSection === "Messages"
                    ? "bg-[#ffcb05] text-[#1d2731]"
                    : "hover:bg-[#ffcb05] hover:text-[#1d2731]"
                }`}
              >
                <FaEnvelope className="text-xl" />
                {isSidebarOpen && <span className="text-sm">Messages</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/products">
              <div
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg ${
                  activeSection === "Products"
                    ? "bg-[#ffcb05] text-[#1d2731]"
                    : "hover:bg-[#ffcb05] hover:text-[#1d2731]"
                }`}
              >
                <FaBox className="text-xl" />
                {isSidebarOpen && <span className="text-sm">Products</span>}
              </div>
            </Link>
          </li>
          <li>
            <Link href="/dashboard/orders">
              <div
                className={`flex items-center space-x-3 cursor-pointer p-2 rounded-lg ${
                  activeSection === "Orders"
                    ? "bg-[#ffcb05] text-[#1d2731]"
                    : "hover:bg-[#ffcb05] hover:text-[#1d2731]"
                }`}
              >
                <FaShoppingCart className="text-xl" />
                {isSidebarOpen && <span className="text-sm">Orders</span>}
              </div>
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold text-[#1d2731] mb-8 flex items-center">
          <FaUserCog className="mr-2 text-[#235789]" /> Admin Dashboard
        </h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<FaUsers />}
            title="Users"
            value={dataCounts.userCount}
            bgColor="bg-yellow-500"
          />
          <StatCard
            icon={<FaShoppingCart />}
            title="Orders"
            value={dataCounts.orderCount}
            bgColor="bg-yellow-500"
          />
          <StatCard
            icon={<FaBox />}
            title="Products"
            value={dataCounts.productCount}
            bgColor="bg-yellow-500"
          />
          <StatCard
            icon={<FaEnvelope />}
            title="Messages"
            value={dataCounts.messageCount}
            bgColor="bg-yellow-500"
          />
        </div>

        {/* Main Content Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-xl flex-grow">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;