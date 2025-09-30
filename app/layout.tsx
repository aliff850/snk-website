import type { Metadata } from "next";
import { ToastContainer, Bounce } from "react-toastify";
import { Onest, Poppins } from "next/font/google";
import { Navigation } from "./components/navigation";
import { Footer } from "./components/footer";
import ScrollToTop from "./components/ui/ScrollToTop";
import "./globals.css";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100","200","300","400","500","600","700","800","900"],
  subsets: ["latin"],

});

export const metadata: Metadata = {
  title: "SNK Market Data Research",
  description: "Prototype website for SNK MDR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  <ScrollToTop/>

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${onest.variable} ${poppins.variable} antialiased snap-y snap-mandatory overflow-y-scroll`}
      >
        <Navigation />
        {children}
        <Footer />
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
          <ToastContainer />
      </body>
    </html>
  );
}
