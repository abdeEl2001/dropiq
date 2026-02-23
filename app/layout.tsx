import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DROPIQ — Dropshipping Intelligence Suite",
  description: "AI-powered product research, ad spy, and copy generator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ background: "#080C12", color: "#E8EDF5", margin: 0 }}>
        {children}
      </body>
    </html>
  );
}
