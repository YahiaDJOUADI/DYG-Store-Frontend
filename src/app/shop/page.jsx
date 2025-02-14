"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaBox, FaTimes, FaSadTear, FaSearch } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Select from "react-select";
import ProductCard from "../../components/ProductCard";
import { useSelector } from "react-redux";
import { debounce } from "lodash";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [totalProducts, setTotalProducts] = useState(0);
  const [sortOption, setSortOption] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(9); // Products per page
  const router = useRouter();

  // Get user data from Redux store
  const user = useSelector((state) => state.user.user);
  const userType = user?.type;
  const userName = user?.userName;

  // Debounced search function
  const debouncedSearch = debounce(async (query) => {
    try {
      const params = { name: query };
      const response = await axios.get("http://localhost:3001/products", { params });
      setProducts(response.data.products);
      setTotalProducts(response.data.totalProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products. Please try again later.");
    }
  }, 300);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = {
          page: currentPage,
          limit: productsPerPage,
        };
  
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
  
        const response = await axios.get("http://localhost:3001/products", { params });
        setProducts(response.data.products);
        setTotalProducts(response.data.totalProducts);
  
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchProducts();
  }, [
    searchQuery,
    selectedCategory,
    sortOption,
    currentPage,
    productsPerPage
  ]);

  // Scroll to the top of the page when the currentPage changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle category selection change
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption.value);
  };

  // Handle sorting option change
  const handleSortChange = (selectedOption) => {
    setSortOption(selectedOption.value);
  };

  // Handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
    { value: "name-asc", label: "Alphabet: A to Z" },
    { value: "name-desc", label: "Alphabet: Z to A" }
  ];

  // Skeleton loading component
  const renderSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: productsPerPage }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg">
          <Skeleton height={200} />
          <div className="p-4">
            <Skeleton count={2} />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#1d2731]">
     {/* Admin and User Sections */}
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
            Manage your products and inventory in the{" "}
            <a
              href="/dashboard/products"
              className="text-[#ffcb05] underline hover:text-[#f2f2f2] transition-colors"
            >
              Products Dashboard
            </a>
            .
          </p>
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
              <div className="text-center">
                <h1 className="text-2xl font-bold text-[#0b3c5d] mb-2">
                  Welcome {userName} to the Ultimate Gaming Store!
                </h1>
                <p className="text-sm text-[#1d2731]">
                  Explore the latest games, consoles, and accessories—all at unbeatable prices and delivered fast!
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      ) : null}

      {/* Search Bar */}
      <div className="container mx-auto px-6 pt-4">
        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-full px-4 py-2.5 rounded-lg border border-[#0b3c5d] focus:outline-none focus:ring-2 focus:ring-[#ffcb05] pl-10 bg-white shadow-sm"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Search for products"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0b3c5d]" />
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
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-4 lg:flex lg:gap-6">
        {/* Filters Section */}
        <div className="lg:w-1/5 bg-white p-4 rounded-lg shadow-lg sticky top-4 h-fit lg:mb-0 mb-6">
          <h2 className="text-lg font-bold mb-4">Filters</h2>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Category</label>
            <Select
              options={categoryOptions}
              placeholder="Select Category"
              styles={{
                control: (base) => ({
                  ...base,
                  border: "1px solid #0b3c5d",
                  borderRadius: "0.5rem",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#0b3c5d" },
                  height: "40px",
                }),
                placeholder: (base) => ({
                  ...base,
                  color: "#0b3c5d",
                  fontSize: "14px",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#0b3c5d",
                  fontSize: "14px",
                }),
              }}
              onChange={handleCategoryChange}
              aria-label="Filter by category"
            />
          </div>

          {/* Sorting Dropdown */}
          <div>
            <label className="block text-lg font-bold mb-4">Sorting</label>
            <Select
              options={sortOptions}
              placeholder="Sort By"
              styles={{
                control: (base) => ({
                  ...base,
                  border: "1px solid #0b3c5d",
                  borderRadius: "0.5rem",
                  boxShadow: "none",
                  "&:hover": { borderColor: "#0b3c5d" },
                  height: "40px",
                }),
              }}
              onChange={handleSortChange}
              aria-label="Sort by"
            />
          </div>
        </div>

        {/* Product Grid Section */}
        <div className="lg:w-4/5">
          {/* Loading Spinner or Product Grid */}
          {isLoading ? (
            renderSkeleton()
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 mt-20">
              <FaSadTear className="text-6xl text-[#0b3c5d]" />
              <p className="text-2xl text-[#0b3c5d]">No products found</p>
              <p className="text-sm text-[#1d2731]">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.15)" }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center mt-8">
                {Array.from({ length: Math.ceil(totalProducts / productsPerPage) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => paginate(index + 1)}
                    className={`mx-1 px-4 py-2 rounded-lg ${
                      currentPage === index + 1
                        ? "bg-[#ffcb05] text-[#1d2731]"
                        : "bg-[#0b3c5d] text-[#f2f2f2]"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}