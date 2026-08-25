import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

export default function AppShell({ children }: Props) {
  return (
    <div className="app-shell">
      <Sidebar />

      <div className="content">
        <Header />

        <main className="main">{children}</main>
      </div>
    </div>
  );
}
