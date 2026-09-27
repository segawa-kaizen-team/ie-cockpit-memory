export const metadata = {
  title: "IE改善コックピット",
  description: "改善テーマをNeonへ保存するWebアプリ",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
