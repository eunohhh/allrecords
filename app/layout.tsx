import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import QueryProvider from "@/lib/query-provider";
import "./globals.css";
import { Toaster } from "sonner";
import { uhbee } from "@/fonts/font";

export const metadata: Metadata = {
  title: {
    default: "AllRecords",
    template: "%s | AllRecords",
  },
  description: "AllRecords는 Misun의 모든 기록을 저장하는 공간입니다.",
  keywords: ["블로그", "만화", "고양이"],
  authors: [{ name: "YiiiMisun", url: "https://allrecords.me" }],
  creator: "YiiiMisun",
  publisher: "EunOh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${uhbee.className} antialiased`}>
        <QueryProvider>
          <NuqsAdapter>{children}</NuqsAdapter>
        </QueryProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
