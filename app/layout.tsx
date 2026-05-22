import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rhythm Cluster 律动簇｜音频设计与后期制作",
  description:
    "Rhythm Cluster（律动簇）是专注于音频设计与后期制作的协作团队，提供音频技术咨询、混音与后期、游戏音频设计与项目制合作服务。",
  keywords: [
    "Rhythm Cluster",
    "律动簇",
    "音频设计",
    "混音",
    "后期制作",
    "游戏音频",
    "声音设计",
  ],
  openGraph: {
    title: "Rhythm Cluster 律动簇｜音频设计与后期制作",
    description: "用声音与技术叙事，为品牌与作品建立记忆点。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (theme === 'dark' || (!theme && systemDark)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
