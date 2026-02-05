import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "You's Jerry ",
  description: "A Valentine's Day experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#0a0a0a]">{children}</body>
    </html>
  );
}
