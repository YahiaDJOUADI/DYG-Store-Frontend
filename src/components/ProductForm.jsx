"use client";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { toast } from "sonner";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Checkbox,
  ListItemText,
  OutlinedInput,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { CloudUpload } from "@mui/icons-material";
import api from "@/features/api";

const platformsOptions = ["PS5", "PS4", "Xbox Series X/S", "PC"];

const ProductForm = ({ product, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      mainImage: null,
      images: [],
      price: product?.price || "",
      stock: product?.stock || "",
      description: product?.description || "",
      brand: product?.brand || "",
      platforms: product?.platforms || [],
    },
  });
  const [loading, setLoading] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState(
    product?.mainImage || null
  );
  const [imagesPreview, setImagesPreview] = useState(
    product?.images || []
  );

  const onDrop = (acceptedFiles, isMainImage = false) => {
    if (isMainImage) {
      const file = acceptedFiles[0];
      if (file) {
        setValue("mainImage", file);
        setMainImagePreview(URL.createObjectURL(file));
      }
    } else {
      setValue("images", acceptedFiles);
      setImagesPreview(acceptedFiles.map(file => URL.createObjectURL(file)));
    }
  };

  const { getRootProps: getMainImageRootProps, getInputProps: getMainImageInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, true),
    accept: "image/*",
    multiple: false,
  });

  const { getRootProps: getImagesRootProps, getInputProps: getImagesInputProps } = useDropzone({
    onDrop: (files) => onDrop(files, false),
    accept: "image/*",
    multiple: true,
  });

  const onSubmitHandler = async (data) => {
    if (!Array.isArray(data.platforms)) {
      data.platforms = [data.platforms];
    }

    if (!data.name || data.name.length < 3 || data.name.length > 50) {
      toast.error("Product name must be between 3 and 50 characters.");
      return;
    }
    if (!data.category) {
      toast.error("Please select a category.");
      return;
    }
    if (!data.mainImage && !product) {
      toast.error("Please upload a main image.");
      return;
    }
    if (!data.price || data.price <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }
    if (!data.stock || data.stock < 0) {
      toast.error("Stock must be a non-negative number.");
      return;
    }
    if (!data.description || data.description.length < 5 || data.description.length > 800) {
      toast.error("Description must be between 5 and 800 characters.");
      return;
    }
    if (!data.brand) {
      toast.error("Brand is required.");
      return;
    }

    setLoading(true);

    const dataToSend = new FormData();
    for (const key in data) {
      if (data[key] !== null && key !== "id") {
        if (key === "platforms") {
          data[key].forEach((platform) => dataToSend.append(key, platform));
        } else if (key === "images") {
          data[key].forEach((image) => dataToSend.append(key, image));
        } else {
          dataToSend.append(key, data[key]);
        }
      }
    }

    try {
      if (product) {
        await api().put(`/products/${product.id}`, dataToSend);
        toast.success("Product updated successfully!");
      } else {
        await api().post("/products", dataToSend);
        toast.success("Product added successfully!");
      }
      onSubmit();
    } catch (error) {
      console.error(error);
      toast.error(`Error ${product ? "updating" : "adding"} product. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 p-4" onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Product Name */}
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={<span>Product Name</span>}
              variant="outlined"
              fullWidth
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
              required
            />
          )}
        />

        {/* Category */}
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth variant="outlined" error={!!errors.category}>
              <InputLabel><span>Category</span></InputLabel>
              <Select {...field} label="Category" required>
                <MenuItem value="Video Games">Video Games</MenuItem>
                <MenuItem value="Gaming Gear">Gaming Gear</MenuItem>
                <MenuItem value="Subscriptions">Subscriptions</MenuItem>
              </Select>
            </FormControl>
          )}
        />

        {/* Price */}
        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={<span>Price</span>}
              type="number"
              variant="outlined"
              fullWidth
              error={!!errors.price}
              helperText={errors.price ? errors.price.message : ""}
              required
            />
          )}
        />

        {/* Stock */}
        <Controller
          name="stock"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={<span>Stock</span>}
              type="number"
              variant="outlined"
              fullWidth
              error={!!errors.stock}
              helperText={errors.stock ? errors.stock.message : ""}
              required
            />
          )}
        />

        {/* Brand */}
        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label={<span>Brand</span>}
              variant="outlined"
              fullWidth
              error={!!errors.brand}
              helperText={errors.brand ? errors.brand.message : ""}
              required
            />
          )}
        />

        {/* Platforms */}
        <Controller
          name="platforms"
          control={control}
          render={({ field }) => (
            <FormControl fullWidth variant="outlined" error={!!errors.platforms}>
              <InputLabel><span>Platforms</span></InputLabel>
              <Select
                {...field}
                multiple
                input={<OutlinedInput label="Platforms" />}
                renderValue={(selected) => selected.join(', ')}
              >
                {platformsOptions.map((platform) => (
                  <MenuItem key={platform} value={platform}>
                    <Checkbox checked={field.value.includes(platform)} />
                    <ListItemText primary={platform} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        />
      </div>

      {/* Main Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Main Image</label>
        <div {...getMainImageRootProps()} className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer hover:border-gray-600">
          <input {...getMainImageInputProps()} />
          {mainImagePreview ? (
            <img src={mainImagePreview} alt="Main Preview" className="max-h-40 mx-auto rounded-lg shadow-md" />
          ) : (
            <div className="flex flex-col items-center">
              <CloudUpload className="text-gray-500 text-4xl" />
              <p className="text-gray-600 mt-2">Drag & drop the main image here, or click to select one</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Images Upload */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Additional Images</label>
        <div {...getImagesRootProps()} className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center cursor-pointer hover:border-gray-600">
          <input {...getImagesInputProps()} />
          {imagesPreview.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imagesPreview.map((src, index) => (
                <img key={index} src={src} alt={`Preview ${index}`} className="max-h-40 mx-auto rounded-lg shadow-md" />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <CloudUpload className="text-gray-500 text-4xl" />
              <p className="text-gray-600 mt-2">Drag & drop additional images here, or click to select them</p>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label={<span>Description</span>}
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            error={!!errors.description}
            helperText={errors.description ? errors.description.message : ""}
            required
          />
        )}
      />

      {/* Submit Button */}
      <button
        className="w-full py-4 bg-[#0b3c5d] text-white rounded-md hover:bg-[#ffcb05] hover:text-[#0b3c5d] transition-all duration-300"
        type="submit"
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : (product ? "Update Product" : "Add Product")}
      </button>
    </form>
  );
};

export default ProductForm;