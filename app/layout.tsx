import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RZXXY Football Live",
  description: "Follow football scores, fixtures and authorized live streaming options.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
