import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ARKAF EDGE — Growth Should Leave Something Good Behind",
  description:
    "ARKAF Edge is a growth and creative partner for ambitious businesses building what comes next. Strategy, marketing, creativity, performance and technology connected.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="bg-[#050b09] text-white antialiased selection:bg-[#14f884] selection:text-[#050b09] overflow-x-clip">
        {children}
      </body>
    </html>
  );
}
