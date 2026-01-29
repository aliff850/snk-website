import type { Metadata } from "next";
import { ToastContainer, Bounce } from "react-toastify";
import { Onest, Poppins } from "next/font/google";
import { Navigation } from "./components/navigation";
import { Footer } from "./components/footer";
import ScrollToTop from "./components/ui/ScrollToTop";
import ScrollToTopButton from "./components/ui/ScrollToTopButton";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "SNK Market Data Research",
    template: '%s | SNK Market Data Research'
  },
  description: "25 years of expertise in the insurtech industry",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${onest.variable} ${poppins.variable} antialiased snap-y snap-mandatory overflow-y-scroll`}
      >
        <AuthProvider>
          <ScrollToTop />
          <Navigation />
          {children}
          <Footer />
          <ScrollToTopButton />
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
