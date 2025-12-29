import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PassaMeno - Dashboard Contatti",
  description: "Gestisci i tuoi contatti logistici in un unico posto",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className="light">
      <body className="font-display bg-background-light text-slate-800 min-h-screen relative overflow-x-hidden selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}

