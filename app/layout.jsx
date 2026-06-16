import "./globals.css";

export const metadata = {
  title: "BusUNS — Jadwal Bus Kampus UNS",
  description:
    "Sistem informasi jadwal dan rute bus kampus Universitas Sebelas Maret (UNS). Cek jadwal keberangkatan dari setiap halte dengan mudah.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
