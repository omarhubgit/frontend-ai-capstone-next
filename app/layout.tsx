import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Omar Abdullah Portfolio",
  description: "Junior Frontend Developer Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen">

      <nav className="border-b border-slate-700 p-5">

      <div className="max-w-6xl mx-auto flex flex-wrap gap-6">

      <Link href="/">Home</Link>

      <Link href="/about">About</Link>

      <Link href="/projects">Projects</Link>

      <Link href="/skills">Skills</Link>

      <Link href="/resume">Resume</Link>

      <Link href="/contact">Contact</Link>

      <Link href="/health">Health</Link>

      </div>

      </nav>

      <main className="max-w-6xl mx-auto p-8">

      {children}

      </main>

      </body>
    </html>
  );
}