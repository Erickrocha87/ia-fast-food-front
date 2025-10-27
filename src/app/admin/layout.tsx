import { SidebarAdmin } from "@/components/SidebarAdmin";

export const metadata = {
  title: "ServeAI Admin",
  description: "Restaurant Management Hub",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen flex bg-gray-50 text-gray-800">
      <SidebarAdmin />
      <section className="flex-1 p-10">{children}</section>
    </main>
  );
}
