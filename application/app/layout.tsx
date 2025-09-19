import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { TRPCProvider } from "@/lib/client/trpc";
import AuthProvider from "@/components/AuthProvider";
import { Toaster } from "sonner";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "MyAirConsole - Console en ligne",
  description: "Nous vous proposons une gamme variée de jeux multijoueurs et solo, accessibles directement depuis votre navigateur et jouable depuis votre téléphone.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${montserrat.variable} antialiased font-sans`}
      >
        <AuthProvider>
          <TRPCProvider>
            {children}
            <Toaster />
          </TRPCProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
