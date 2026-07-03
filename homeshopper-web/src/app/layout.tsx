import type { Metadata } from "next";
import { Inter } from "next/font/google";
import GlobalNav from "@/components/ui/GlobalNav";
import { ToastProvider } from "@/components/ui/Toast";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "홈쇼퍼 — 부동산 거래, 중개부터 그 이후까지",
  description:
    "매물 탐색부터 임장, 권리분석, 계약, 이사·인테리어·대출까지 이어지는 부동산 풀서비스. 수수료는 법정 상한 요율의 절반, 정찰제로 안내해요.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={inter.variable}>
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/static/pretendard-dynamic-subset.css"
        />
      </head>
      <body className="antialiased">
        <div className="bg-blob bg-blob-blue" aria-hidden="true" />
        <div className="bg-blob bg-blob-purple" aria-hidden="true" />
        <AppProvider>
          <ToastProvider>
            <GlobalNav />
            <div className="pb-20 md:pb-0">{children}</div>
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}
