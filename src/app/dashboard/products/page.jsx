"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaBox, FaEdit, FaTrash } from "react-icons/fa";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  CircularProgress,
  IconButton,
  TablePagination,
  Dialog,
  DialogContent,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import Swal from "sweetalert2";
import ProductForm from "@/components/ProductForm";
import api from "@/features/api";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await api().get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter, sort, and paginate products
  const getFilteredAndSortedProducts = () => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    if (sortBy === "price") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }

    return filtered;
  };

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
    fetchProducts(); // Ensure products are refreshed when the form is closed
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredProducts = getFilteredAndSortedProducts();
  const paginatedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8 flex items-center space-x-4 bg-white p-6 rounded-2xl shadow-sm">
        <div className="p-3 bg-[#0b3c5d] rounded-lg text-white">
          <FaBox className="text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">{products.length} total products</p>
        </div>
      </div>

      {/* Filters and Add Product Button */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <FormControl className="w-full md:w-1/3">
          <InputLabel id="category-filter-label" style={{ color: "#1d2731" }}>
            Category
          </InputLabel>
          <Select
            labelId="category-filter-label"
            id="category-filter"
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ color: "#1d2731" }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            <MenuItem value="Video Games">Video Games</MenuItem>
            <MenuItem value="Gaming Gear">Gaming Gear</MenuItem>
            <MenuItem value="Subscriptions">Subscriptions</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search products"
          variant="outlined"
          className="w-full md:w-1/3 p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputLabelProps={{ style: { color: "#1d2731" } }}
        />
        <FormControl className="w-full md:w-1/3">
          <InputLabel id="sort-by-label" style={{ color: "#1d2731" }}>
            Sort By
          </InputLabel>
          <Select
            labelId="sort-by-label"
            id="sort-by"
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
            style={{ color: "#1d2731" }}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="price">Price</MenuItem>
          </Select>
        </FormControl>
        <button
          type="button"
          className="px-4 py-2 bg-[#0b3c5d] text-white rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] hover:scale-105 transition-all duration-300 transform text-sm shadow-md flex items-center justify-center"
          onClick={handleAddProduct}
        >
          <FaBox className="mr-2 text-3xl" />
          Add Product
        </button>
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
            {paginatedProducts.map((product) => (
              <div key={product.id} className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                {/* Image */}
                <div className="font-medium text-gray-900">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                </div>
                
                {/* Name */}
                <div className="font-medium text-gray-900">{product.name}</div>
                
                {/* Category */}
                <div className="text-gray-600">{product.category}</div>
                
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
        count={filteredProducts.length}
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