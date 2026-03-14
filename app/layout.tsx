import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { Providers } from './providers';

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });



export const metadata: Metadata = {
  title: "EduSpark",
  description: "Plateforme éducative",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={jakarta.className}
      >
          <AuthProvider><Providers>{children}        </Providers>
         </AuthProvider>
          <Toaster  richColors/>
      </body>
    </html>
  );
}
