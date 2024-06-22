import type { Metadata } from "next"
import Footer from "./components/Footer";
import "./style.css"

export const metadata: Metadata = {
  title: "Dragon Tools by AquaLunae",
  description: "Some utilities for FlightRising.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        { children }
        <Footer />
      </body>
    </html>
  )
}
