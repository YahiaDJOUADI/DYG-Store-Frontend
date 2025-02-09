"use client";
import React, { useState, useEffect } from "react";

import { toast } from "sonner";
import { FaBox, FaEdit, FaTrash } from "react-icons/fa";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
  TextField,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TablePagination,
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

  // Fetch products from the API
  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await api().get("/products", 
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
      toast.error("Failed to fetch products");
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
    const token = localStorage.getItem("token");
    try {
      await api().delete(`/products/${id}`, 
        
      );
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
      confirmButtonColor: "#235789",
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

  const filteredProducts = getFilteredAndSortedProducts();
  const paginatedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="bg-[#f2f2f2] p-6 rounded-lg shadow-md relative">
      <h2 className="text-2xl font-bold text-[#1d2731] mb-6 flex items-center">
        <FaBox className="mr-2 text-[#235789]" />
        Product Management
      </h2>

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
  type="submit"
  className="px-4 py-2 bg-[#0b3c5d] text-white rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] hover:scale-105 transition-all duration-300 transform text-sm shadow-md flex items-center justify-center"
  onClick={handleAddProduct}
>
  <FaBox className="mr-2 text-3xl" />
  Add Product
</button>
      </div>

      {/* Product Table */}
      <Paper className="shadow-md">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell className="font-bold text-[#235789]">Image</TableCell>
                <TableCell className="font-bold text-[#235789]">Name</TableCell>
                <TableCell className="font-bold text-[#235789]">Category</TableCell>
                <TableCell className="font-bold text-[#235789]">Price</TableCell>
                <TableCell className="font-bold text-[#235789]">Stock</TableCell>
                <TableCell className="font-bold text-[#235789]">Description</TableCell>
                <TableCell className="font-bold text-[#235789]">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}DZD</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {product.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEditProduct(product)}
                          style={{ color: "#235789" }}
                        >
                          <FaEdit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDeleteConfirmation(product.id)}
                          style={{ color: "#ffcb05" }}
                        >
                          <FaTrash />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[8, 16, 24]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* ProductForm Modal Overlay */}
      {isProductFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#f2f2f2] rounded-lg shadow-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <ProductForm
              product={selectedProduct}
              onSubmit={handleFormSubmit}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;