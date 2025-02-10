"use client";
import React, { useEffect, useState } from "react";
import { FaBox, FaEnvelope, FaShoppingCart, FaUserCog, FaUsers, FaHome, FaArrowUp, FaArrowDown, FaSearch } from "react-icons/fa";
import api from "@/features/api";
import Link from "next/link";

const AdminLayout = ({ children }) => {
  const [dataCounts, setDataCounts] = useState({
    userCount: 0,
    orderCount: 0,
    productCount: 0,
    messageCount: 0,
  });

  const [isHovered, setIsHovered] = useState(false);

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
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Floating Sidebar with Enhanced Transitions */}
      <div
        className="h-screen bg-[#0b3c5d] shadow-2xl z-20 fixed transition-all duration-200 w-20 hover:w-64 group/sidebar"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
          willChange: 'width, transform'
        }}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-center mb-8 h-16 overflow-hidden">
            <div className="relative min-w-[32px]">
              <div className={`absolute transition-opacity duration-200 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
                <div className="w-8 h-8 bg-[#ffcb05] rounded-full flex items-center justify-center">
                  <span className="text-[#0b3c5d] font-bold">AP</span>
                </div>
              </div>
              <h2 className={`text-xl font-bold text-[#ffcb05] absolute transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                Admin Portal
              </h2>
            </div>
          </div>

          <nav className="flex-1 space-y-2">
            <Link href="/" className="group flex items-center p-3 rounded-xl hover:bg-[#235789] transition-colors relative">
              <FaHome className="text-[#ffcb05] mr-3 min-w-[20px]" size={20} />
              <span className={`text-[#f2f2f2] text-sm transition-all duration-200 ${isHovered ? 'opacity-100 ml-0' : 'opacity-0 -ml-4'}`}>
                Back to Home
              </span>
            </Link>

            {[
              { icon: <FaUsers />, label: "Users", href: "/dashboard/users" },
              { icon: <FaEnvelope />, label: "Messages", href: "/dashboard/messages" },
              { icon: <FaBox />, label: "Products", href: "/dashboard/products" },
              { icon: <FaShoppingCart />, label: "Orders", href: "/dashboard/orders" },
            ].map((link, index) => (
              <Link key={link.label} href={link.href}>
                <div className="group flex items-center p-3 rounded-xl hover:bg-[#235789] text-[#f2f2f2] transition-colors relative">
                  {React.cloneElement(link.icon, { 
                    className: "text-[#ffcb05] mr-3 min-w-[20px] transition-transform duration-200 group-hover:scale-110", 
                    size: 20 
                  })}
                  <span className={`text-sm transition-all duration-200 delay-[${index * 50}ms] ${isHovered ? 'opacity-100 ml-0' : 'opacity-0 -ml-4'}`}>
                    {link.label}
                  </span>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content  */}
      <div className="flex-1 ml-20">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold text-[#0b3c5d] flex items-center space-x-3">
                <div className="p-3 bg-[#ffcb05] rounded-xl transition-transform hover:scale-105 duration-200">
                  <FaUserCog className="text-[#0b3c5d]" size={24} />
                </div>
                <span>Dashboard Overview</span>
              </h1>
              
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { 
                title: "Active Users",
                value: dataCounts.userCount,
                trend: 12.3,
                icon: <FaUsers className="w-6 h-6" />,
                gradient: "from-[#ffcb05] to-[#ffdd77]"
              },
              { 
                title: "Pending Orders",
                value: dataCounts.orderCount,
                trend: 8.1,
                icon: <FaShoppingCart className="w-6 h-6" />,
                gradient: "from-[#235789] to-[#2b6b9c]"
              },
              { 
                title: "New Products",
                value: dataCounts.productCount,
                trend: -3.2,
                icon: <FaBox className="w-6 h-6" />,
                gradient: "from-[#0b3c5d] to-[#1a506f]"
              },
              { 
                title: "Unread Messages",
                value: dataCounts.messageCount,
                trend: 24.5,
                icon: <FaEnvelope className="w-6 h-6" />,
                gradient: "from-[#1d2731] to-[#2d3844]"
              },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.gradient} rounded-xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-light mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm transition-transform hover:scale-110 duration-200">
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-4 flex items-center">
                  <span className={`text-sm font-medium ${stat.trend > 0 ? 'text-green-200' : 'text-red-200'}`}>
                    {stat.trend > 0 ? <FaArrowUp className="inline mr-1" /> : <FaArrowDown className="inline mr-1" />}
                    {Math.abs(stat.trend)}%
                  </span>
                  <span className="text-sm text-white/80 ml-2">vs last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#ffcb05]/20 transition-all duration-300 hover:shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;