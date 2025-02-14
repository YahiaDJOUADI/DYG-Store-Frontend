"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCartPlus,
  FaGamepad,
  FaHeadset,
  FaShoppingCart,
  FaTicketAlt,
} from "react-icons/fa";
import { motion } from "framer-motion";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import api from "@/features/api";
import { useDispatch } from "react-redux";
import { addToCart } from "@/features/cartSlice";
import { toast } from "sonner";

const platformsOptions = ["PS5", "PS4", "Xbox Series X/S", "PC"];

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [platform, setPlatform] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useDispatch();

  // State for carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Combine mainImage and images into one array for the carousel
  const carouselImages = product ? [product.mainImage, ...product.images] : [];

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api().get(`/products/${id}`);
        setProduct(response.data);
        if (response.data.category === "Video Games" && response.data.platforms.length > 0) {
          setPlatform(response.data.platforms[0]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch related products
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (!product) return;

      try {
        const params = {
          category: product.category, // Filter by the same category
          limit: 5, 
          exclude: product.id, // Exclude the current product
        };

        const response = await api().get("/products", { params });

        console.log("API Response:", response.data); // Log the response for debugging

        if (response.data && response.data.products) {
          // Assuming the related products are in response.data.products
          const filteredRelatedProducts = response.data.products.filter(
            (p) => p.id !== product.id
          );
          setRelatedProducts(filteredRelatedProducts);
        } else {
          console.error("Error: response.data.products is not an array");
        }
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
    };

    fetchRelatedProducts();
  }, [product]);

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Video Games":
        return (
          <FaGamepad className="text-[#ffcb05] group-hover:text-[#1d2731]" />
        );
      case "Gaming Gear":
        return (
          <FaHeadset className="text-[#ffcb05] group-hover:text-[#1d2731]" />
        );
      case "Subscriptions":
        return (
          <FaTicketAlt className="text-[#ffcb05] group-hover:text-[#1d2731]" />
        );
      default:
        return null;
    }
  };

  // Function to handle next image
  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle previous image
  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#235789]"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
        <p className="text-[#ED3926] text-lg">{error}</p>
      </div>
    );
  }

  // Product not found state
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2]">
        <p className="text-[#1d2731] text-lg">Product not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAddingToCart) {
      setIsAddingToCart(true);
      dispatch(addToCart({ product, quantity, platform }));
      toast.success("Product added to cart!");
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    if (!isAddingToCart) {
      setIsAddingToCart(true);
      dispatch(addToCart({ product, quantity, platform }));
      toast.success("Product added to cart!");
      setIsAddingToCart(false);
      router.push("/cart");
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#1d2731]">
      {/* Product Details Section */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Product Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-[#0b3c5d]">
          {/* Back Button */}
          <div className="p-4 border-b border-[#0b3c5d]">
            <button
              className="flex items-center gap-2 text-[#1d2731] hover:text-[#ffcb05] transition-colors"
              onClick={() => router.back()}
            >
              <FaArrowLeft className="text-lg" />
              <span className="text-md font-semibold">Back to Shop</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Image Carousel */}
            <div className="flex flex-col items-center justify-center p-4">
              {/* Main Image with Navigation Arrows */}
              <div className="relative w-full">
                <motion.img
                  src={carouselImages[currentImageIndex]}
                  alt={`Image of ${product.name}`}
                  className="w-full h-auto max-h-[400px] object-contain rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                {/* Navigation Arrows */}
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-[#0b3c5d] text-white p-2 rounded-full hover:bg-[#ffcb05] hover:text-[#1d2731] transition-all"
                >
                  <FaArrowLeft className="text-xl" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#0b3c5d] text-white p-2 rounded-full hover:bg-[#ffcb05] hover:text-[#1d2731] transition-all"
                >
                  <FaArrowRight className="text-xl" />
                </button>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2 mt-4">
                {carouselImages.map((image, index) => (
                  <motion.div
                    key={index}
                    className={`relative overflow-hidden rounded-lg cursor-pointer border-2 ${
                      currentImageIndex === index
                        ? "border-[#ffcb05]"
                        : "border-transparent"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300"></div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-4 p-4">
              {/* Product Name */}
              <motion.h1
                className="text-4xl font-bold text-[#1d2731]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {product.name}
              </motion.h1>

              {/* Price */}
              <motion.div
                className="flex items-center gap-2 text-3xl font-bold text-[#0b3c5d]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <span>{product.price}</span>
                <span className="text-xl text-[#ffcb05]">DZD</span>
              </motion.div>

              {/* Brand */}
              <motion.div
                className="text-lg font-medium text-[#1d2731]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <span className="font-bold">Brand:</span> {product.brand}
              </motion.div>

              {/* Category Badge */}
              <motion.div
                className="flex items-center gap-2 bg-[#0b3c5d] text-[#f2f2f2] px-4 py-2 rounded-full w-fit transition-all duration-300 hover:bg-[#ffcb05] hover:text-[#1d2731] cursor-pointer group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {getCategoryIcon(product.category)}
                <span className="text-sm font-medium">{product.category}</span>
              </motion.div>

              {/* Product Description */}
              <motion.p
                className="text-[#1d2731] text-lg leading-relaxed"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                {product.description}
              </motion.p>

              {/* Quantity Selector */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <label className="text-[#1d2731] text-lg font-bold">
                  Quantity:
                </label>
                <div className="flex items-center border border-[#1d2731] rounded-md">
                  <button
                    onClick={() =>
                      setQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                    className="px-4 py-2 bg-[#f2f2f2] hover:bg-[#e0e0e0] transition-all"
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="px-4 py-2 bg-[#f2f2f2] hover:bg-[#e0e0e0] transition-all"
                  >
                    +
                  </button>
                </div>
              </motion.div>

              {/* Platform Selector */}
              {product.category === "Video Games" && (
                <motion.div
                  className="flex items-center gap-4"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.4 }}
                >
                  <label className="text-[#1d2731] text-lg font-bold">
                    Platform:
                  </label>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel><span>Platform</span></InputLabel>
                    <Select
                      value={platform}
                      onChange={(e) => setPlatform(e.target.value)}
                      label="Platform"
                      required
                    >
                      {platformsOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </motion.div>
              )}

              {/* Add to Cart and Buy Now Buttons */}
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.stock <= 0}
                  className={`flex items-center gap-2 px-6 py-2 bg-[#235789] text-white font-bold rounded-lg ${
                    product.stock > 0
                      ? "hover:bg-[#ffcb05] hover:text-[#0b3c5d] hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  } transition-all duration-300 transform shadow-lg`}
                >
                  {isAddingToCart ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <FaCartPlus /> Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isAddingToCart || product.stock <= 0} // Disable if out of stock
                  className={`flex items-center gap-2 px-6 py-2 bg-[#ffcb05] text-[#0b3c5d] font-bold rounded-lg ${
                    product.stock > 0
                      ? "hover:bg-[#235789] hover:text-white hover:scale-105"
                      : "opacity-50 cursor-not-allowed"
                  } transition-all duration-300 transform shadow-lg`}
                >
                  {isAddingToCart ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#1d2731]"></div>
                  ) : (
                    <>
                      <FaShoppingCart /> Buy Now
                    </>
                  )}
                </button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
        >
          <h2 className="text-2xl font-bold text-[#1d2731] mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-[#0b3c5d]"
                whileHover={{ scale: 1.03 }}
              >
                <div className="relative">
                  <img
                    src={relatedProduct.mainImage}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  {/* Stock Availability Badge */}
                  <div className="absolute top-2 right-2">
                    {relatedProduct.stock > 0 ? (
                      <span className="bg-green-600 text-[#f2f2f2] px-3 py-1 rounded-full text-xs">
                        Available
                      </span>
                    ) : (
                      <span className="bg-red-600 text-[#f2f2f2] px-3 py-1 rounded-full text-xs">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-3">
                  {/* Category Badge with Hover Effect */}
                  <div className="flex items-center gap-2 bg-[#0b3c5d] text-[#f2f2f2] px-3 py-1 rounded-full w-fit transition-all duration-300 hover:bg-[#ffcb05] hover:text-[#1d2731] cursor-pointer group">
                    {getCategoryIcon(relatedProduct.category)}
                    <span className="text-sm font-medium">
                      {relatedProduct.category}
                    </span>
                  </div>

                  {/* Product Name */}
                  <h2 className="text-xl font-bold text-[#1d2731] truncate">
                    {relatedProduct.name}
                  </h2>

                  {/* Product Description */}
                  <p className="text-sm text-[#1d2731] line-clamp-2">
                    {relatedProduct.description}
                  </p>

                  {/* Price and Button */}
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-lg font-bold">
                      <span className="text-[#0b3c5d]">
                        {relatedProduct.price}
                      </span>{" "}
                      <span className="text-[#ffcb05]">DZD</span>
                    </p>
                    <button
                      onClick={() => router.push(`/shop/${relatedProduct.id}`)}
                      className="font-bold flex items-center gap-2 bg-[#ffcb05] hover:bg-[#0b3c5d] text-[#0b3c5d] hover:text-[#f2f2f2] py-2 px-4 rounded-lg transition-all"
                      aria-label="View product details"
                    >
                      <span>BUY</span>
                      <FaArrowRight className="text-sm" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}