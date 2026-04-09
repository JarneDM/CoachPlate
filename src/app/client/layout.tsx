import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, CalendarDays, Dumbbell, Settings } from "lucide-react";
import { NavItem } from "@/components/NavItem";
import LogoutButton from "@/components/LogoutButton";
import MobileClientMenu from "@/components/MobileClientMenu";
import Image from "next/image";

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/join");

  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: client } = await admin
    .from("clients")
    .select("id, full_name, email")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!client) redirect("/join");

  const navItems = [
    { href: "/client/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/client/public-recipes", label: "Publieke recepten", icon: <CalendarDays className="h-5 w-5" /> },
    { href: "/client/settings", label: "Instellingen", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-1500 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-bold text-green-600">
            CoachPlate
          </Link>
          <MobileClientMenu clientName={client.full_name} clientEmail={client.email} />
        </div>
      </header>

      <div className="mx-auto flex w-full">
        <aside className="hidden h-screen w-72 flex-col border-r border-gray-100 bg-white lg:sticky lg:top-0 lg:z-30 lg:flex">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Image src="/image.png" alt="CoachPlate" width={40} height={40} />
              <Link href="/">
                <h1 className="text-xl font-bold text-green-600">CoachPlate</h1>
              </Link>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Jouw plannen</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                {client.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{client.full_name}</p>
                <p className="text-xs text-gray-400 truncate">{client.email}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </aside>

        <main className="relative w-full flex-1 px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
          {children}
        </main>
      </div>
    </div>
  );
}
