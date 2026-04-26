import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "AllRecords — Personal records app for iPhone",
	description:
		"AllRecords is a personal records iOS app. With your permission, it connects to Google Calendar to view, create, update, and delete events you own.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
				<footer className="border-zinc-200 border-t py-6 text-center text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
					<a
						href="/support"
						className="hover:text-zinc-700 dark:hover:text-zinc-300"
					>
						Support
					</a>
					<span className="mx-2">·</span>
					<a
						href="/privacy-policy"
						className="hover:text-zinc-700 dark:hover:text-zinc-300"
					>
						Privacy Policy
					</a>
				</footer>
				<Toaster richColors position="top-right" />
			</body>
		</html>
	);
}
