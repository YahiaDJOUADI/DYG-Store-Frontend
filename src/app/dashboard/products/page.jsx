"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaBox, FaEdit, FaTrash } from "react-icons/fa";
import {
  CircularProgress,
  IconButton,
  TablePagination,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import Swal from "sweetalert2";
import Select from "react-select";
import ProductForm from "@/components/ProductForm";
import api from "@/features/api";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  // Category options
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "Video Games", label: "Video Games" },
    { value: "Gaming Gear", label: "Gaming Gear" },
    { value: "Subscriptions", label: "Subscriptions" },
  ];

  // Sorting options
  const sortOptions = [
    { value: "name-asc", label: "Name: A to Z" },
    { value: "name-desc", label: "Name: Z to A" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
  ];

  // Fetch products from the API with filters, sorting, and pagination
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1, // Backend expects 1-based indexing
        limit: rowsPerPage,
      };

      // Add category filter
      if (selectedCategory !== "all") {
        params.category = selectedCategory;
      }

      // Add search term filter
      if (searchTerm) {
        params.name = searchTerm;
      }

      // Add sorting
      if (sortBy) {
        const [sortField, sortDirection] = sortBy.split("-");
        params.sortBy = sortField;
        params.sortDirection = sortDirection === "asc" ? 1 : -1;
      }

      const response = await api().get("/products", { params });
      setProducts(response.data.products);
      setTotalProducts(response.data.totalProducts);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchTerm, sortBy, page, rowsPerPage]);

  // Handle delete product
  const handleDeleteProduct = async (id) => {
    try {
      await api().delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Delete confirmation dialog
  const handleDeleteConfirmation = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#0b3c5d",
      cancelButtonColor: "#ffcb05",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteProduct(id);
        Swal.fire("Deleted!", "The product has been deleted.", "success");
      }
    });
  };

  // Open product form for adding/editing
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setIsProductFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setIsProductFormOpen(true);
  };

  // Close product form and refresh data
  const handleFormSubmit = () => {
    setIsProductFormOpen(false);
    fetchProducts();
  };

  const handleCancel = () => {
    setIsProductFormOpen(false);
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-sm">
        <div className="p-3 bg-[#0b3c5d] rounded-lg text-white">
          <FaBox className="text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">{totalProducts} total products</p>
        </div>
      </div>

      {/* Filters and Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
  {/* Category Filter */}
  <div className="w-full md:w-1/4">
    <Select
      options={categoryOptions}
      placeholder="Select Category"
      value={categoryOptions.find((option) => option.value === selectedCategory)}
      onChange={(selectedOption) => setSelectedCategory(selectedOption.value)}
      styles={{
        control: (base) => ({
          ...base,
          border: "1px solid #0b3c5d",
          borderRadius: "8px", // Consistent border radius
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
      aria-label="Filter by category"
    />
  </div>

  {/* Search Input */}
  <div className="w-full md:w-1/4">
    <input
      type="text"
      placeholder="Search products"
      className="w-full px-4 py-2 rounded-lg border border-[#0b3c5d] focus:outline-none focus:ring-2 focus:ring-[#ffcb05] bg-white shadow-sm"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      aria-label="Search for products"
      style={{ height: "40px", borderRadius: "8px" }} // Consistent border radius
    />
  </div>

  {/* Sort Filter */}
  <div className="w-full md:w-1/4">
    <Select
      options={sortOptions}
      placeholder="Sort By"
      value={sortOptions.find((option) => option.value === sortBy)}
      onChange={(selectedOption) => setSortBy(selectedOption.value)}
      styles={{
        control: (base) => ({
          ...base,
          border: "1px solid #0b3c5d",
          borderRadius: "8px", // Consistent border radius
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
      aria-label="Sort by"
    />
  </div>

  {/* Add Product Button */}
  <div className="w-full md:w-1/4 flex justify-end">
    <button
      type="button"
      className="px-4 py-2 bg-[#0b3c5d] text-white rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] hover:scale-105 transition-all duration-300 transform text-sm shadow-md flex items-center justify-center"
      onClick={handleAddProduct}
      style={{ height: "40px", borderRadius: "8px" }} // Consistent border radius
    >
      <FaBox className="mr-2 text-3xl" />
      Add Product
    </button>
  </div>
</div>

     {/* Product Table */}
{loading ? (
  <div className="flex h-64 items-center justify-center">
    <CircularProgress style={{ color: "#0b3c5d" }} />
  </div>
) : (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    {/* Table Header */}
    <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gradient-to-r from-[#0b3c5d] to-[#235789] text-white font-semibold">
      <div>Image</div>
      <div>Name</div>
      <div>Category</div>
      <div>Price</div>
      <div>Stock</div>
      <div>Actions</div>
    </div>

    {/* Table Body */}
    <div className="divide-y divide-gray-100">
      {products.map((product) => (
        <div
          key={product.id}
          className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center" // Added `items-center` for vertical alignment
        >
          {/* Image */}
          <div className="flex items-center">
            <img
              src={product.mainImage}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />
          </div>

          {/* Name */}
          <div className="font-medium text-gray-900 truncate" title={product.name}> {/* Added `truncate` and `title` for overflow */}
            {product.name}
          </div>

          {/* Category */}
          <div className="text-gray-600 truncate" title={product.category}> {/* Added `truncate` and `title` for overflow */}
            {product.category}
          </div>

          {/* Price */}
          <div className="font-semibold text-[#0b3c5d]">{product.price} DZD</div>

          {/* Stock */}
          <div className="text-gray-600">{product.stock}</div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Tooltip title="Edit">
              <IconButton
                onClick={() => handleEditProduct(product)}
                className="text-[#235789]"
              >
                <FaEdit />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                onClick={() => handleDeleteConfirmation(product.id)}
                className="text-red-600"
              >
                <FaTrash />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      <TablePagination
        rowsPerPageOptions={[8, 16, 24]}
        component="div"
        count={totalProducts}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* ProductForm Modal */}
      <Dialog
        open={isProductFormOpen}
        onClose={handleCancel}
        maxWidth="md"
        fullWidth
        TransitionProps={{
          onEntering: () => setLoading(false),
          onExiting: () => setLoading(true),
        }}
      >
        <DialogTitle className="bg-gradient-to-r from-[#0b3c5d] to-[#235789] text-white py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {selectedProduct ? "Edit Product" : "Add Product"}
            </h2>
          </div>
        </DialogTitle>

        <DialogContent className=" space-y-6">
          <ProductForm
            product={selectedProduct}
            onSubmit={handleFormSubmit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;