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
    <html lang="it" suppressHydrationWarning className="transition-colors duration-300">
      <body className="font-display bg-background-light dark:bg-background-dark text-slate-800 dark:text-slate-200 min-h-screen relative overflow-x-hidden selection:bg-primary/30 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
