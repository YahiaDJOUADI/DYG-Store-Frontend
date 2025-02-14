// app/layout.js
import ClientLayout from "./client-layout";

export const metadata = {
  title: "DYG Store",
  description:
    "Your ultimate destination for all gaming gear and accessories. Explore the latest gaming equipment, consoles, peripherals, and more at DYG Store – where gamers level up!",
  author: "Yahia Djouadi",
};

export default function RootLayout({ children }) {
  return <ClientLayout>{children}</ClientLayout>;
}