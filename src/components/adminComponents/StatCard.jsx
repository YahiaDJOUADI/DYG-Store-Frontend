"use client";
import React from "react";

const StatCard = ({ icon, title, value, bgColor }) => {
  return (
    <div className={`${bgColor} p-4 rounded-lg shadow-md text-white hover:shadow-lg transition-shadow duration-300 transform hover:scale-105`}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-md font-semibold">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        {icon && <div className="text-4xl">{icon}</div>}
      </div>
    </div>
  );
};

export default StatCard;