import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "react-hot-toast";
import { StarsBackground } from "@/components/stars-background";
import "./globals.css";

export const metadata: Metadata = {
  title: "Night Shift - Ship While You Sleep",
  description: "Your AI engineering team works while you sleep. Describe requests in plain English, wake up to shipped code.",
  keywords: ["AI", "development", "automation", "night shift", "ship code", "AI agents"],
  openGraph: {
    title: "Night Shift - Ship While You Sleep",
    description: "Your AI engineering team works while you sleep",
    type: "website",
  },
};

// Check if Clerk is configured
const isClerkConfigured = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && 
  !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('pk_test_dmFsaWQ');

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = (
    <>
      <StarsBackground />
      <div className="relative z-10">
        {children}
      </div>
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: 'glass text-zinc-100 border-neon-purple/20',
          success: {
            iconTheme: {
              primary: '#22d3ee',
              secondary: '#0a0a0f',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#0a0a0f',
            },
          },
        }}
      />
    </>
  );

  // Wrap with ClerkProvider only if configured
  if (isClerkConfigured) {
    const { ClerkProvider } = require('@clerk/nextjs');
    return (
      <ClerkProvider>
        <html lang="en" className="dark">
          <body
            className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-night-900`}
          >
            {content}
          </body>
        </html>
      </ClerkProvider>
    );
  }

  // No Clerk - render without provider
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased bg-night-900`}
      >
        {content}
      </body>
    </html>
  );
}