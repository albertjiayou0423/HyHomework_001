import { Navbar } from "./Navbar";
import Link from "next/link";

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">
      <Navbar />
      <main>
        {children}
      </main>
      <footer className="mt-12 py-8 border-t border-[#30363d] px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#7d8590] gap-4">
        <div className="flex items-center gap-4">
          <span>&copy; 2024 GitClass, Inc.</span>
          <Link href="/about" className="text-[#58a6ff] hover:underline">About</Link>
          <span className="hover:text-[#58a6ff] cursor-pointer">Terms</span>
          <span className="hover:text-[#58a6ff] cursor-pointer">Privacy</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Inspired by <Link href="https://github.com" className="text-[#58a6ff] hover:underline">GitHub</Link></span>
        </div>
      </footer>
    </div>
  );
}
