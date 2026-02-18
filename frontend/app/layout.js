
import { Oswald, Roboto, Lora } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  display: "swap",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
  style: ["italic", "normal"],
});

export const metadata = {
  title: "Paninos - Menú Digital",
  description: "Los mejores sándwiches con la mejor salsa de ajo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${oswald.variable} ${roboto.variable} ${lora.variable} font-sans antialiased bg-[#121212] text-white`}>
        {children}
      </body>
    </html>
  );
}
