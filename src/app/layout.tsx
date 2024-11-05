import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import TopBar from "./components/TopBar";
import Footer from "./components/Footer";
import { UserProvider } from "./context/UserContext";

export const metadata: Metadata = {
  title: "Rentaplace",
  description: "Rent your place!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased flex flex-col min-h-screen">
        <UserProvider>
          <TopBar />
          <main className="flex-grow flex items-center justify-center w-full">{children}</main>
          <Footer />
        </UserProvider>
      </body>
    </html>
  );
}
