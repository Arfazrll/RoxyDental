import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProfileProvider } from "@/contexts/ProfileContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "POLABDC - Dental Clinic Management",
  description: "Professional Dental Clinic Management System",

  icons: {
    icon: "/images/pink.png",                 
    shortcut: "/images/pink.png",
    apple: "/images/pink.png",               
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProfileProvider>    
            {children}
          </ProfileProvider>
        </AuthProvider>
      </body>
    </html>
  );
}