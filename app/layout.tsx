import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import QueryProvider from "@/lib/query-provider";
import "./globals.css";
import { Toaster } from "sonner";
import { uhbee } from "@/fonts/font";

export const metadata: Metadata = {
  title: "AllRecords",
  description: "AllRecords",
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
