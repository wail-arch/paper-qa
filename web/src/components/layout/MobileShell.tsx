import { ReactNode } from "react";
import BottomNav from "./BottomNav";

export default function MobileShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      <header className="px-4 pt-6 pb-4">
        <h1 className="text-xl font-semibold">{title}</h1>
      </header>
      <main className="px-4 space-y-4">{children}</main>
      <BottomNav />
    </div>
  );
}
