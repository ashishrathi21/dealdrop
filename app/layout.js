
import "./globals.css";

export const metadata = {
  title: "DealDrop",
  description: "Find the best deals and discounts on your favorite products.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
    >
      <body>{children}</body>
    </html>
  );
}
