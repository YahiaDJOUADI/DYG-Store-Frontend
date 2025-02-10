"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGamepad, FaArrowRight } from "react-icons/fa";
import ReactPlayer from "react-player";
import { useState, useEffect } from "react";

import QuizGame from "../components/QuizGame";
import ProductCard from "../components/ProductCard";
import api from "@/features/api";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api().get("/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Toggle quiz modal
  const toggleQuiz = () => {
    setIsQuizOpen(!isQuizOpen);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="relative w-full h-screen flex items-center justify-center bg-[#1d2731]">
        {/* Video Background */}
        <ReactPlayer
          url="https://www.youtube.com/watch?v=oyZY_BiTmd8"
          playing={true}
          loop={true}
          muted={true}
          width="100%"
          height="100%"
          className="absolute top-0 left-0 object-cover w-full h-full opacity-50"
          style={{ position: 'absolute', top: 0, left: 0 }}
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-[#f2f2f2] p-6">
          <motion.h1
            className="text-5xl sm:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            BLACK OPS 6
          </motion.h1>

          <motion.p
            className="text-lg sm:text-2xl font-medium mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            Experience the next chapter of the legendary Call of Duty series. Immerse yourself in a world like no other.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Link href="/shop">
              <button className="bg-[#ffcb05] text-[#1d2731] px-8 py-3 sm:px-10 sm:py-4 text-lg font-semibold rounded-lg transform transition-all duration-300 hover:bg-[#235789] hover:text-[#f2f2f2] hover:scale-105">
                Pre-Order Now
              </button>
            </Link>

            <a
              href="https://www.youtube.com/watch?v=oyZY_BiTmd8"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="flex items-center px-8 py-3 sm:px-10 sm:py-4 bg-transparent border-2 border-[#ffcb05] text-[#ffcb05] font-bold rounded-lg hover:bg-[#ffcb05] hover:text-[#1d2731] hover:scale-105 transition-all duration-300">
                <FaArrowRight className="mr-2" /> Watch Trailer
              </button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Products Section */}
      <section className="py-14 bg-[#f2f2f2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-3xl sm:text-4xl font-bold text-center mb-7 text-[#1d2731]"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Featured Products
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {products.slice(0, 3).map((product, index) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-14 bg-[#1d2731]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Updated Title for E-Commerce Gaming Store */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Main Title */}
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f2f2f2] mb-3">
              Shop the <span className="text-[#ffcb05]">Best</span> in{" "}
              <span className="text-[#ffcb05]">Gaming Gear</span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#f2f2f2] opacity-90">
              From <span className="text-[#ffcb05]">consoles</span> to{" "}
              <span className="text-[#ffcb05]">accessories</span>, we’ve got everything
              you need to <span className="text-[#ffcb05]">level up</span>.
            </p>
          </motion.div>

          {/* Infinite Carousel with Always-Color Logos */}
          <div className="relative overflow-hidden">
            {/* Slider Track */}
            <motion.div
              className="flex gap-8"
              animate={{
                x: ["0%", "-100%"],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {[
                {
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/2560px-PlayStation_logo.svg.png",
                  name: "PlayStation",
                  description: "Leading the console gaming experience.",
                },
                {
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/800px-Xbox_one_logo.svg.png",
                  name: "Xbox",
                  description: "Home to exclusive titles and Game Pass.",
                },
                {
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Nintendo.svg/1280px-Nintendo.svg.png",
                  name: "Nintendo",
                  description: "Innovative gaming for all ages.",
                },
                {
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Electronic-Arts-Logo.svg/2048px-Electronic-Arts-Logo.svg.png",
                  name: "Electronic Arts",
                  description: "Creators of FIFA, Madden, and more.",
                },
                {
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Activision.svg/1280px-Activision.svg.png",
                  name: "Activision",
                  description: "Pioneers of Call of Duty and more.",
                },
                {
                  logo: "https://upload.wikimedia.org/wikipedia/commons/7/78/Ubisoft_logo.svg",
                  name: "Ubisoft",
                  description: "Makers of Assassin's Creed and Far Cry.",
                },
                {
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Bethesda_Game_Studios_logo.svg/2560px-Bethesda_Game_Studios_logo.svg.png",
                  name: "Bethesda",
                  description: "Creators of The Elder Scrolls and Fallout.",
                },
                {
                  logo: "https://download.logo.wine/logo/Square_Enix/Square_Enix-Logo.wine.png",
                  name: "Square Enix",
                  description: "Home to Final Fantasy and Kingdom Hearts.",
                },
                {
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Capcom_logo.svg/1200px-Capcom_logo.svg.png",
                  name: "Capcom",
                  description: "Makers of Resident Evil and Street Fighter.",
                },
                {
                  logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/1113px-Rockstar_Games_Logo.svg.png",
                  name: "Rockstar Games",
                  description: "Creators of Grand Theft Auto and Red Dead Redemption.",
                },
              ].map((brand, index) => (
                <motion.div
                  key={index}
                  className="group relative flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 p-6 rounded-lg flex items-center justify-center bg-[#2a3642] transform transition-all duration-300 hover:bg-[#3a4652] cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* Brand Logo (Always in Color) */}
                  <img
                    src={brand.logo}
                    alt={`${brand.name} logo`}
                    className="max-w-full h-12 sm:h-16 object-contain"
                  />

                  {/* Hover Overlay with Brand Info */}
                  <div className="absolute inset-0 bg-[#1d2731] bg-opacity-90 rounded-lg flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-lg sm:text-xl font-bold text-[#f2f2f2] mb-2">
                      {brand.name}
                    </h3>
                    <p className="text-sm sm:text-base text-[#f2f2f2] text-center px-4">
                      {brand.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Gradient Overlays */}
            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#1d2731] to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#1d2731] to-transparent z-10" />
          </div>
        </div>
      </section>

      {/* Enhanced Ratings Section */}
      <section className="relative py-14 bg-[#f2f2f2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#235789] to-[#0b3c5d] mb-4">
            Customer Reviews
          </h2>
          <p className="text-xl text-[#1d2731] max-w-2xl mx-auto">
            Discover what our satisfied gamers have to say about their experiences!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {[
            {
              name: "Fares Zait",
              rating: 5,
              platform: "PS5",
              hours: "215h",
              review: "Black Ops 6 has redefined the FPS genre for me. The campaign is intense, and the multiplayer maps are incredibly well-designed. Thanks to <strong style='color:#ffcb05;'>DYG Store</strong>, I got my copy instantly and started playing right away!",
              avatar: "/cute-diver-playing-vr-game-with-controller-cartoon-vector-icon-illustration-science-technology-flat_138676-13994.avif",
              game: "BlackOps 6",
              platformImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/1280px-PlayStation_logo.svg.png",
              gameImg: "/Call_of_Duty_Black_Ops_6_Key_Art.png",
              tagline: "Fast Delivery, Instant Fun!"
            },
            {
              name: "Adel Ramdani",
              rating: 5,
              platform: "Xbox X",
              hours: "180h",
              review: "EA FC 25 is the ultimate football simulation. The graphics are stunning, and the gameplay feels so real. <strong style='color:#ffcb05;'>DYG Store</strong> made the purchase seamless, and I was scoring goals in no time!",
              avatar: "/cute-diver-playing-vr-game-with-controller-cartoon-vector-icon-illustration-science-technology-flat_138676-13994.avif",
              game: "EAFc25",
              platformImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Xbox_one_logo.svg/2048px-Xbox_one_logo.svg.png",
              gameImg: "/fifa.jpg",
              tagline: "Smooth Purchase, Epic Gameplay!"
            },
            {
              name: "Younes Ait",
              rating: 4,
              platform: "Steam",
              hours: "92h",
              review: "Forza Horizon 5 is a visual masterpiece. The open-world racing experience is unmatched. Multiplayer could use some tweaks, but overall, it's fantastic. <strong style='color:#ffcb05;'>DYG Store</strong> delivered my game key instantly—no delays!",
              avatar: "/cute-diver-playing-vr-game-with-controller-cartoon-vector-icon-illustration-science-technology-flat_138676-13994.avif",
              game: "Forza Horizon 5",
              platformImg: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/1200px-Steam_icon_logo.svg.png",
              gameImg: "/images (1).jpg",
              tagline: "Instant Access, Endless Fun!"
            },
          ].map((testimonial, index) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 flex flex-col justify-between transform hover:scale-105"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {/* Platform Tag */}
              <div className="absolute top-4 right-4 bg-[#ffcb05] text-white px-3 py-1 rounded-full text-sm font-bold">
                {testimonial.platform}
              </div>

              {/* Gamer Profile */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full border-2 border-[#ffcb05] p-1">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 right-0 bg-[#ffcb05] text-xs px-2 rounded-full text-white">
                    {testimonial.hours}
                  </div>
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-[#1d2731]">{testimonial.name}</h3>
                  <p className="text-sm text-[#235789]">{testimonial.tagline}</p>
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xl ${i < testimonial.rating ? "text-[#ffcb05]" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>

              {/* Review Text */}
              <p className="text-[#1d2731] mb-4 relative flex-grow text-base">
                <span className="absolute -left-4 text-3xl text-[#0b3c5d]">“</span>
                <span dangerouslySetInnerHTML={{ __html: testimonial.review }} />
              </p>

              {/* Game Highlights */}
              <div className="flex items-center gap-2 mt-2">
                <img src={testimonial.platformImg} className="w-10 h-10 rounded-full" alt={testimonial.platform} />
                <img src={testimonial.gameImg} className="w-10 h-10 rounded-full" alt={testimonial.game} />
              </div>

              {/* Hover Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-[#ffcb0530] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
      {/* Mini-Game Button */}
      <button
        onClick={toggleQuiz}
        className="fixed bottom-20 right-6 bg-[#ffcb05] text-[#1d2731] p-3 rounded-full shadow-lg hover:bg-[#235789] hover:text-[#f2f2f2] transition duration-300 flex items-center justify-center z-50"
        style={{ width: "48px", height: "48px" }}
      >
        <FaGamepad className="text-2xl" />
      </button>

      {/* Mini-Game Modal */}
      {isQuizOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#f2f2f2] p-6 rounded-lg shadow-lg w-11/12 max-w-md">
            <QuizGame onClose={() => setIsQuizOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}