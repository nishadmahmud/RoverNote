import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "RoverNote - Your Travel Journal",
  description: "A cozy travel journaling app to document your adventures and memories.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-cream-50">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
