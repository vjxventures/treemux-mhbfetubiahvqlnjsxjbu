import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CodeMentor AI - Intelligent Pair Programming",
  description: "Real-time AI-powered code review and suggestions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
