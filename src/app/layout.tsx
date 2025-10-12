import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/QueryProvider";
import ConditionalHeader from "@/components/ConditionalHeader";
import RouteGuard from "@/components/RouteGuard";
import { UserStoreProvider } from "@/components/UserStoreProvider";

// Toastify
import { ToastContainer } from "react-toastify";


const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "TodoList App",
  description: "Aplicación de gestión de tareas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${poppins.variable} ${poppins.className} antialiased min-h-screen`}
      >
        <QueryProvider>
          <UserStoreProvider>
            <RouteGuard>
              <ConditionalHeader />
              <ToastContainer />
              <main className="container mx-auto p-4 ">{children}</main>
            </RouteGuard>
          </UserStoreProvider>
        </QueryProvider>
        
      </body>
    </html>
  );
}
