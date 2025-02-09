"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaGamepad,
  FaHeadset,
  FaUser,
  FaTimes,
  FaBox,
  FaTicketAlt,
} from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Select from "react-select";
import ProductCard from "../../components/ProductCard";
import { useSelector } from "react-redux";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const router = useRouter();

  // Get user data from Redux store
  const user = useSelector((state) => state.user.user);
  const userType = user?.type;
  const userName = user?.userName;

  // Fetch products with filters and sorting
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {};

        // Add search query to params
        if (searchQuery) {
          params.name = searchQuery;
        }

        if (selectedCategory !== "all") {
          params.category = selectedCategory;
        }

        if (sortOption !== "default") {
          const [sortBy, sortDirection] = sortOption.split("-");
          params.sortBy = sortBy;
          params.sortDirection = sortDirection === "asc" ? 1 : -1;
        }

        const response = await axios.get("http://localhost:3001/products", {
          params,
        });
        setProducts(response.data);
        setTotalProducts(response.data.length);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategory, sortOption]);

  // Category options
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Video Games", label: "Video Games" },
    { value: "Gaming Gear", label: "Gaming Gear" },
    { value: "Subscriptions", label: "Subscriptions" },
  ];

  // Sorting options
  const sortOptions = [
    { value: "default", label: "Default" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle category selection change
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
  };

  // Handle sorting option change
  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption.value);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#1d2731]">
      {/* New First Section for Admin and User */}
      {userType === "admin" ? (
        <div className="py-8 bg-[#0b3c5d] text-[#f2f2f2] border-b border-[#ffcb05]">
          <div className="container mx-auto px-6">
            <motion.div
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h1 className="text-2xl font-bold text-[#ffcb05]">
                  Welcome Back, {userName}
                </h1>
                <p className="text-sm text-[#f2f2f2]">
                  Manage your store with ease.
                </p>
              </div>
              <div className="flex items-center gap-4">
                {/* Products Badge */}
                <div className="bg-[#1d2731] p-3 rounded-lg flex items-center gap-2 transition-all duration-300 hover:bg-[#ffcb05] hover:text-[#1d2731] cursor-pointer group">
                  <FaBox className="text-xl text-[#ffcb05] group-hover:text-[#1d2731]" />
                  <span>{totalProducts} Products</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : userType === "user" ? (
        <div className="py-8 bg-[#f2f2f2] text-[#1d2731] border-b border-[#ffcb05]">
          <div className="container mx-auto px-6">
            <motion.div
              className="flex flex-col items-center justify-center gap-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Welcome Text - Compact and Centered */}
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#0b3c5d] mb-2">
                  Welcome, {userName} {/* Display the user's name */}
                </h1>
                <p className="text-sm text-[#1d2731]">
                  Explore the latest in gaming with our curated selection.
                </p>
              </div>

              {/* Badges - Compact and Minimal */}
              <div className="flex flex-wrap justify-center gap-4">
                {/* Video Games Badge */}
                <motion.div
                  className="bg-white p-3 rounded-lg flex items-center gap-2 text-[#0b3c5d] border border-[#0b3c5d] shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <FaGamepad className="text-xl text-[#ffcb05]" />
                  <span className="font-medium">Video Games</span>
                </motion.div>

                {/* Gaming Gear Badge */}
                <motion.div
                  className="bg-white p-3 rounded-lg flex items-center gap-2 text-[#0b3c5d] border border-[#0b3c5d] shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <FaHeadset className="text-xl text-[#ffcb05]" />
                  <span className="font-medium">Gaming Gear</span>
                </motion.div>

                {/* Subscriptions Badge */}
                <motion.div
                  className="bg-white p-3 rounded-lg flex items-center gap-2 text-[#0b3c5d] border border-[#0b3c5d] shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <FaTicketAlt className="text-xl text-[#ffcb05]" />
                  <span className="font-medium">Subscriptions</span>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}

      {/* Product Grid Section with Search Bar */}
      <div className="container mx-auto p-6">
        {/* Search Bar with react-select */}
        <motion.div
          className="w-full mb-8"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#0b3c5d] focus:outline-none focus:ring-2 focus:ring-[#ffcb05]"
                value={searchQuery}
                onChange={handleSearchChange}
                aria-label="Search for products"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0b3c5d] hover:text-[#ffcb05]"
                  aria-label="Clear search"
                >
                  <FaTimes />
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div>
              <Select
                options={categoryOptions}
                placeholder="Category"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #0b3c5d",
                    borderRadius: "0.5rem",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#0b3c5d" },
                    height: "44px",
                  }),
                }}
                onChange={handleCategoryChange}
                aria-label="Filter by category"
              />
            </div>

            {/* Sorting Dropdown */}
            <div>
              <Select
                options={sortOptions}
                placeholder="Sort by"
                styles={{
                  control: (base) => ({
                    ...base,
                    border: "1px solid #0b3c5d",
                    borderRadius: "0.5rem",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#0b3c5d" },
                    height: "44px",
                  }),
                }}
                onChange={handleSortChange}
                aria-label="Sort by"
              />
            </div>

            {/* Search Button */}
            <button
              className="w-full bg-[#ffcb05] text-[#1d2731] px-6 py-2.5 rounded-lg hover:bg-[#0b3c5d] hover:text-[#f2f2f2] transition-all"
              aria-label="Search"
            >
              Search
            </button>
          </div>
        </motion.div>

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffcb05]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}