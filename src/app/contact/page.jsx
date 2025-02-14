"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaComment,
  FaPaperPlane,
  FaGamepad,
  FaHeadset,
  FaDice,
  FaChess,
  FaPuzzlePiece,
  FaMobile,
  FaLaptop,
  FaKeyboard,
  FaMouse,
  FaMicrophone,
  FaDesktop,
  FaServer,
  FaCode,
  FaRobot,
  FaGlobe,
  FaCloud,
  FaDatabase,
  FaVideo,
  FaMusic,
  FaFilm,
} from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import api from "@/features/api";

const Contact = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const router = useRouter();
  const { user, isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated) {
      setValue("name", user.userName);
      setValue("email", user.email);
    }
  }, [isAuthenticated, setValue, user]);

  const onSubmit = async (data) => {
    try {
      const response = await api().post("/messages", data);
      toast.success("Message sent successfully!");
      reset();
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error sending message:", error);
      if (error.response) {
        console.error("Server response:", error.response.data);
      }
      toast.error("Failed to send message. Please try again.");
    }
  };

  // List of icons to display in the background
  const icons = [
    FaGamepad,
    FaHeadset,
    FaDice,
    FaChess,
    FaPuzzlePiece,
    FaMobile,
    FaLaptop,
    FaKeyboard,
    FaMouse,
    FaMicrophone,
    FaDesktop,
    FaServer,
    FaCode,
    FaRobot,
    FaGlobe,
    FaCloud,
    FaDatabase,
    FaVideo,
    FaMusic,
    FaFilm,
  ];

  // Reduce the number of icons to 20
  const repeatedIcons = Array(20).fill(icons).flat();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-[#f2f2f2] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Animated Icons in the Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {repeatedIcons.map((Icon, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: Math.random() * 3 + 2, // Random duration between 2 and 5 seconds
              repeat: Infinity,
              repeatType: "reverse", // Fade in and out
              ease: "easeInOut",
              delay: Math.random() * 2, // Random delay to stagger animations
            }}
            className="absolute text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: index % 2 === 0 ? "#235789" : "#ffcb05",
              opacity: 0.2,
            }}
          >
            <Icon />
          </motion.div>
        ))}
      </div>

      {/* Contact Form */}
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg border border-gray-100 relative z-10">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-4"
          >
            <img
              src="/Logo.png"
              alt="Logo"
              className="mx-auto h-20 w-20"
            />
          </motion.div>
          <h2 className="text-3xl font-bold text-[#0b3c5d]">Contact Us</h2>
          <p className="mt-2 text-[#1d2731]">
          We’re here to help! Reach out with any questions, and our team will get back to you as soon as possible.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="flex items-center border border-gray-300 rounded-t-md p-3">
              <FaUser className="text-[#235789] mr-2" />
              <input
                id="name"
                {...register("name", { required: "Name is required" })}
                type="text"
                className="flex-1 focus:outline-none text-[#1d2731]"
                placeholder="Your Name"
              />
            </div>
            {errors.name && (
              <p className="text-[#ED3926] text-sm mt-1">
                {errors.name.message}
              </p>
            )}
            <div className="flex items-center border border-gray-300 p-3">
              <FaEnvelope className="text-[#235789] mr-2" />
              <input
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="flex-1 focus:outline-none text-[#1d2731]"
                placeholder="Your Email"
              />
            </div>
            {errors.email && (
              <p className="text-[#ED3926] text-sm mt-1">
                {errors.email.message}
              </p>
            )}
            <div className="flex items-center border border-gray-300 rounded-b-md p-3">
              <FaComment className="text-[#235789] mr-2 self-start mt-2" />
              <textarea
                id="message"
                {...register("message", { required: "Message is required" })}
                className="flex-1 focus:outline-none text-[#1d2731] placeholder-gray-400 resize-none"
                placeholder="Your Message"
                rows="4"
              />
            </div>
            {errors.message && (
              <p className="text-[#ED3926] text-sm mt-1">
                {errors.message.message}
              </p>
            )}
          </div>

          <div>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}
              whileTap={{ scale: 0.95 }}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#235789] hover:bg-[#ffcb05] hover:text-[#1d2731] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#235789] transition-all duration-300"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                <FaPaperPlane className="h-5 w-5 text-white group-hover:text-[#1d2731] transition-colors duration-300" />
              </span>
              Send Message
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Contact;