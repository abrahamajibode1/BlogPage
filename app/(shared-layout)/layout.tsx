import { Navbar } from "@/components/web/navbar";
import { ReactNode } from "react";

export default function SharedLayout({ 
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  )
}