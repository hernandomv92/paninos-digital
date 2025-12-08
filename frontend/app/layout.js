import "./globals.css";

export const metadata = {
  title: "Restobar - Menú Digital",
  description: "Sistema de pedidos digital integrado con Loggro Restobar POS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
