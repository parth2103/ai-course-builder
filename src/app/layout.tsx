import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Course Builder",
  description: "Generate comprehensive course outlines using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white",
          card: "bg-white dark:bg-gray-800 shadow-lg",
          headerTitle: "text-gray-900 dark:text-white font-semibold",
          headerSubtitle: "text-gray-600 dark:text-gray-300",
          formFieldLabel: "text-gray-700 dark:text-gray-200 font-medium",
          formFieldInput: "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400",
          formFieldInputShowPasswordButton: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200",
          dividerLine: "bg-gray-200 dark:bg-gray-600",
          dividerText: "text-gray-500 dark:text-gray-400",
          socialButtonsBlockButton: "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600",
          socialButtonsBlockButtonText: "text-gray-700 dark:text-gray-200",
          formResendCodeLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
          footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
          footerActionText: "text-gray-600 dark:text-gray-300",
          identityPreviewText: "text-gray-600 dark:text-gray-300",
          identityPreviewEditButton: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning={true}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}