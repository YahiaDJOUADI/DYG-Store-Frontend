"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  ComposedChart,
  Bar,
  Area,
  PieChart,
  Pie,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import api from "@/features/api";

const DashboardHome = () => {
  const [chartData, setChartData] = useState({
    userData: [],
    orderData: [],
    productData: [],
    messageData: [],
  });

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await api().get("/dashboard/charts");
        console.log("API Response:", response.data); // Debugging
        setChartData(response.data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };
    fetchChartData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Line Chart for User Growth */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#0b3c5d] mb-4">User Growth</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={Array.isArray(chartData.userData) ? chartData.userData : []}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="newUsers" stroke="#0b3c5d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Composed Chart for Order Trends */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#0b3c5d] mb-4">Order Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            data={Array.isArray(chartData.orderData) ? chartData.orderData : []}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="totalRevenue" fill="#8884d8" stroke="#8884d8" />
            <Bar dataKey="pending" barSize={20} fill="#ff6347" />
            <Bar dataKey="confirmed" barSize={20} fill="#ffa500" />
            <Bar dataKey="shipped" barSize={20} fill="#1e90ff" />
            <Bar dataKey="delivered" barSize={20} fill="#32cd32" />
            <Bar dataKey="cancelled" barSize={20} fill="#d3d3d3" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart for Product Creation */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#0b3c5d] mb-4">Product Creation</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={Array.isArray(chartData.productData) ? chartData.productData : []}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="productsCreated" stroke="#ffcb05" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart for Message Activity */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-[#0b3c5d] mb-4">Message Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
            <Pie
              data={Array.isArray(chartData.messageData) ? chartData.messageData : []}
              dataKey="value"
              nameKey="label"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#ffcb05"
              label
            >
              {chartData.messageData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#ffcb05" : "#0b3c5d"} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardHome;