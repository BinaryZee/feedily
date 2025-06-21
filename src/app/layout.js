import { Open_Sans } from "next/font/google";

import "./globals.css";
import {
  ClerkProvider,
} from '@clerk/nextjs'

const openSans = Open_Sans({
  subsets: ['latin'],
})

export const metadata = {
  title: "Feedily",
  description: "Feedback app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" className={openSans.className}>
      <body>
        {children}
      </body>
    </html>
    </ClerkProvider>
    
  );
}
