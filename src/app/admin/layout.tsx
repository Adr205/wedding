import type { ReactNode } from "react";
import { AdminNavbar } from "@/features/admin/components/AdminNavbar";
import { Toaster } from "sonner";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdminNavbar />
      {children}
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
