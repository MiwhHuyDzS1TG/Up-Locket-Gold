import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-be-vietnam",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Locket Gold | Hướng dẫn cài đặt cho iPhone",
  description:
    "Hướng dẫn cài đặt Locket Gold theo ba bước rõ ràng, tối ưu cho iPhone.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#11110f",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body className={beVietnamPro.variable}>{children}</body>
    </html>
  );
}
