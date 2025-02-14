"use client";
import { motion } from "framer-motion";
import { FaGamepad, FaUsers, FaLightbulb, FaHeart, FaChevronDown, FaLinkedin, FaGithub, FaShippingFast, FaCheckCircle, FaLock } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

export default function About() {
  return (
    <div className="bg-[#f2f2f2]">

      {/* About Section */}
      <motion.section
        className="relative w-full py-16 px-6 bg-[#f2f2f2] overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Section */}
          <motion.div
            className="text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h2 className="text-4xl font-bold text-[#235789] mb-4">
              About DYG Store
            </h2>
            <p className="text-lg text-[#1d2731] mb-4">
              At DYG Store, we are passionate gamers committed to delivering the best gaming experience across Algeria. Founded in 2025, we are proud to offer a wide range of games, consoles, and accessories for all types of players.
            </p>
            <p className="text-lg text-[#1d2731] mb-4">
              Our mission is simple: to bring the latest and greatest in gaming right to your doorstep, with fast, reliable delivery to all 58 wilayas. Whether you're in Algiers, Oran, or anywhere in between, we've got you covered.
            </p>
            <p className="text-lg text-[#1d2731]">
              We don’t just sell products—we live and breathe gaming, and we’re dedicated to helping you level up your collection.
            </p>
          </motion.div>

          {/* Image Section */}
          <motion.div
            className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/cute-diver-playing-vr-game-with-controller-cartoon-vector-icon-illustration-science-technology-flat_138676-13994.avif" // Replace with your image path
              alt="Gaming Setup"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Horizontal Rule */}
      <hr className="border-t-2 border-[#235789] my-4 mx-auto w-3/4" />

      {/* New Second Section: Why Choose Us? */}
      <motion.section
        id="why-choose-us"
        className="relative py-16 px-6 bg-[#f2f2f2] overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            className="text-4xl font-bold text-[#235789] mb-4"
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Us?
          </motion.h2>
          <motion.p
            className="text-xl text-[#1d2731] mb-12"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            More than just products—we’re here to deliver an exceptional gaming experience for every player in Algeria.
          </motion.p>

          {/* Interactive Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {[
              {
                icon: <FaShippingFast className="text-6xl text-[#ffcb05] mx-auto" />,
                title: "Fast Delivery Across All 58 Wilayas",
                description: "No matter where you are, we ensure quick and secure delivery straight to your door.",
                hoverText: "Fast, reliable, and hassle-free.",
              },
              {
                icon: <FaGamepad className="text-6xl text-[#ffcb05] mx-auto" />,
                title: "Gamers at Heart",
                description: "We understand gamers because we are gamers. Our team is passionate about delivering the best, just like you.",
                hoverText: "Your passion is our motivation.",
              },
              {
                icon: <FaCheckCircle className="text-6xl text-[#ffcb05] mx-auto" />,
                title: "Top-Quality Products",
                description: "We offer only the best consoles, games, and accessories from trusted brands—your gaming satisfaction is our priority.",
                hoverText: "Quality you can trust.",
              },
              {
                icon: <FaLock className="text-6xl text-[#ffcb05] mx-auto" />,
                title: "Secure Shopping Experience",
                description: "Shop with confidence knowing your orders are handled with the utmost care and security.",
                hoverText: "Your safety is our priority.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="p-8 rounded-lg shadow-lg bg-[#235789] text-white text-center hover:bg-[#1d2731] transition-all duration-300 transform hover:scale-105 cursor-pointer group relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="mb-6">{item.icon}</div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-lg">{item.description}</p>
                <div className="absolute inset-0 bg-[#ffcb05] text-[#1d2731] p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-lg font-bold">{item.hoverText}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

     {/* Team Section */}
<motion.section
  className="py-16 px-6 bg-[#235789] text-[#f2f2f2]"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  transition={{ duration: 1 }}
>
  <div className="max-w-6xl mx-auto text-center">
    <motion.h2
      className="text-4xl font-bold"
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      Meet the Creator
    </motion.h2>
    <motion.p
      className="mt-4 text-lg"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
    >
      Behind DYG Store is a passionate developer and visionary, Yahia Djouadi. Get to know the mind behind the magic.
    </motion.p>
    <motion.div
      className="mt-12 flex flex-col md:flex-row items-center justify-center gap-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.3,
          },
        },
      }}
    >
      {/* Profile Picture */}
      <motion.div
        className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-[#ffcb05] shadow-lg"
        initial={{ scale: 0.8, rotateY: 45 }}
        whileInView={{ scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.1, rotate: 5, transition: { duration: 0.4 } }}
      >
        <Image
          src="/cute-angry-diver-gaming-cartoon-vector-icon-illustration-science-technology-icon-isolated-flat_138676-12437.avif" // Replace with your image
          alt="Yahia Djouadi"
          width={256}
          height={256}
          className="object-cover"
        />
      </motion.div>

    {/* Profile Details */}
<motion.div
  className="text-left"
  initial={{ opacity: 0, x: -50 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
  <h3 className="text-3xl font-bold text-[#ffcb05]">Yahia Djouadi</h3>
  <p className="mt-2 text-lg">Project Owner & Full-Stack Developer</p>
  <p className="mt-4 max-w-md">
    Yahia is the creator of <strong className="text-[#ffcb05]">DYG Store</strong>, a gaming store designed to provide gamers with a seamless and enjoyable shopping experience. With a focus on quality and innovation, the store offers a wide range of gaming products, from hardware to accessories, all curated to meet the needs of modern gamers. Yahia's vision is to make it the go-to destination for gamers worldwide.
  </p>
  <div className="mt-6 flex gap-4">
    <motion.a
      href="https://linkedin.com/in/yahia-djouadi"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.2, rotate: 10 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <FaLinkedin className="text-3xl text-[#ffcb05] hover:text-[#0a66c2] transition-colors" />
    </motion.a>
    <motion.a
      href="https://github.com/yahia-djouadi"
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.2, rotate: -10 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <FaGithub className="text-3xl text-[#ffcb05] hover:text-[#333] transition-colors" />
    </motion.a>
  </div>
</motion.div>
    </motion.div>
  </div>
</motion.section>

      {/* Call to Action Section */}
      <motion.section
        className="py-16 text-center bg-[#ffcb05] text-[#1d2731] overflow-hidden"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h2
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Ready to Play? Let’s Get Started!
        </motion.h2>
        <motion.p
          className="mt-4 text-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          Find your next favorite game or console and get it delivered fast!
        </motion.p>
        <Link href="/shop">
          <motion.div
            className="relative inline-block mt-8"
            initial={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {/* Glowing Background */}
            <div className="absolute inset-0 bg-[#235789] rounded-lg blur-lg opacity-75 animate-pulse"></div>
            <button className="relative px-8 py-4 bg-[#235789] text-[#f2f2f2] font-bold rounded-lg shadow-lg transition-transform duration-300 hover:shadow-2xl">
              Shop Now
            </button>
          </motion.div>
        </Link>
      </motion.section>

    </div>
  );
}
