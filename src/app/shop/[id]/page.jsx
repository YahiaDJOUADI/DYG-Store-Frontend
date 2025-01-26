"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  FaArrowLeft,
  FaCartPlus,
  FaShoppingCart,
  FaGamepad,
  FaHeadset,
  FaTicketAlt,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import axios from "axios";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/products/${id}`
        );
        setProduct(response.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Fetch all products
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3001/products");
        setAllProducts(response.data);
      } catch (err) {
        console.error("Error fetching all products:", err);
      }
    };

    fetchAllProducts();
  }, []);

  // Filter related products
  useEffect(() => {
    if (product && allProducts.length > 0) {
      const related = allProducts.filter(
        (p) => p.category === product.category && p._id !== product._id
      );
      setRelatedProducts(related.slice(0, 4));
    }
  }, [product, allProducts]);

  // Helper function to show SweetAlert messages
  const showAlert = (title, text, icon, confirmButtonColor) => {
    Swal.fire({
      title,
      text,
      icon,
      confirmButtonColor,
    });
  };

  // Handle adding product to cart 
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    try {
      // Get the current cart from localStorage
      const cart = JSON.parse(localStorage.getItem("cart")) || [];

      // Check if the product is already in the cart
      const existingProductIndex = cart.findIndex(
        (item) => item.productId === product._id
      );

      if (existingProductIndex !== -1) {
        // If the product exists, update its quantity
        cart[existingProductIndex].quantity += quantity;
      } else {
        // If the product doesn't exist, add it to the cart
        cart.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
        });
      }

      // Save the updated cart back to localStorage
      localStorage.setItem("cart", JSON.stringify(cart));

      // Show success message
      showAlert(
        "Added to Cart!",
        `${product.name} has been added to your cart.`,
        "success",
        "#235789"
      );
    } catch (err) {
      console.error("Error adding to cart:", err);
      showAlert(
        "Error",
        "Failed to add the product to the cart.",
        "error",
        "#ED3926"
      );
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Handle buying the product (redirect to cart page)
  const handleBuyNow = () => {
    setIsBuyingNow(true);
    try {
      // Add the product to the cart
      handleAddToCart();
      // Redirect to the cart page
      router.push("/cart");
    } catch (err) {
      console.error("Error during buy now:", err);
    } finally {
      setIsBuyingNow(false);
    }
  };

  // Helper function to get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Video Games":
        return <FaGamepad className="text-[#ffcb05] group-hover:text-[#1d2731]" />;
      case "Gaming Gear":
        return <FaHeadset className="text-[#ffcb05] group-hover:text-[#1d2731]" />;
      case "Subscriptions":
        return <FaTicketAlt className="text-[#ffcb05] group-hover:text-[#1d2731]" />;
      default:
        return null;
    }
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

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-[#1d2731]">
      {/* Product Details Section */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Product Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-[#0b3c5d] relative">
          {/* Back to Shop Button */}
          <motion.button
            onClick={() => router.push("/shop")}
            className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-[#ffcb05] text-[#1d2731] font-bold rounded-full hover:bg-[#e6b800] transition-all duration-300 shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaArrowLeft className="text-sm" />
          </motion.button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <motion.img
                src={`http://localhost:3001/public/${product.image}`}
                alt={`Image of ${product.name}`}
                className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              {/* Product Name */}
              <motion.h1
                className="text-4xl font-bold text-[#1d2731]"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {product.name}
              </motion.h1>

              {/* Category Badge */}
              <motion.div
                className="flex items-center gap-2 bg-[#0b3c5d] text-[#f2f2f2] px-4 py-2 rounded-full w-fit transition-all duration-300 hover:bg-[#ffcb05] hover:text-[#1d2731] cursor-pointer group"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {getCategoryIcon(product.category)}
                <span className="text-sm font-medium">{product.category}</span>
              </motion.div>

              {/* Product Description */}
              <motion.p
                className="text-[#1d2731] text-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {product.description}
              </motion.p>

              {/* Price */}
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <span className="text-3xl font-bold text-[#0b3c5d]">
                  {product.price}
                </span>
                <span className="text-2xl text-[#ffcb05]">DZD</span>
              </motion.div>

              {/* Quantity Selector */}
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
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

              {/* Buttons */}
              <motion.div
                className="flex gap-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart}
                  className="flex items-center gap-2 px-8 py-3 bg-[#235789] text-[#f2f2f2] font-bold rounded-md hover:bg-[#0b3c5d] transition-all duration-300"
                >
                  {isAddingToCart ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-[#f2f2f2]"></div>
                  ) : (
                    <>
                      <FaCartPlus /> Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isBuyingNow}
                  className="flex items-center gap-2 px-8 py-3 bg-[#ffcb05] text-[#1d2731] font-bold rounded-md hover:bg-[#e6b800] transition-all duration-300"
                >
                  {isBuyingNow ? (
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

        {/* Related Products */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.4 }}
        >
          <h2 className="text-2xl font-bold text-[#1d2731] mb-4">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-[#0b3c5d]"
                whileHover={{ scale: 1.03 }}
              >
                <div className="relative">
                  <img
                    src={`http://localhost:3001/public/${relatedProduct.image}`}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  {/* Stock Availability Badge */}
                  <div className="absolute top-2 right-2">
                    {relatedProduct.stock > 0 ? (
                      <span className="bg-[#0b3c5d] text-[#f2f2f2] px-3 py-1 rounded-full text-xs">
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
                      onClick={() => router.push(`/shop/${relatedProduct._id}`)}
                      className="flex items-center gap-2 bg-[#0b3c5d] hover:bg-[#ffcb05] text-[#f2f2f2] hover:text-[#1d2731] py-2 px-4 rounded-lg transition-all"
                      aria-label="View product details"
                    >
                      <span>View</span>
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