import "./globals.css";

export const metadata = {
  title: "BusUNS",
  description: "Sistem informasi jadwal dan rute bus kampus UNS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
