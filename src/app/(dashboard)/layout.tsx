import { createClient } from "@/lib/supabase/server";
import { ensureCoachProfile } from "@/lib/supabase/ensureCoachProfile";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, NotepadText, Settings, Users, CalendarDays, Dumbbell } from "lucide-react";
import { NavItem } from "@/components/NavItem";
import Link from "next/link";
import MobileDashboardMenu from "@/components/MobileDashboardMenu";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await ensureCoachProfile(supabase, user);

  const { data: coach } = await supabase.from("coaches").select("*").eq("id", user.id).single();

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/clients", label: "Klanten", icon: <Users className="h-5 w-5" /> },
    { href: "/meal-plans", label: "Weekplannen", icon: <CalendarDays className="h-5 w-5" /> },
    { href: "/recipes", label: "Recepten", icon: <NotepadText className="h-5 w-5" /> },
    { href: "/training-plans", label: "Schema's", icon: <Dumbbell className="h-5 w-5" /> },
    { href: "/settings", label: "Instellingen", icon: <Settings className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-1500 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-lg font-bold text-green-600">
            CoachPlate
          </Link>
          <MobileDashboardMenu coachName={coach?.full_name} coachEmail={coach?.email} />
        </div>
      </header>

      <div className="mx-auto flex w-full">
        <aside className="hidden h-screen w-72 flex-col border-r border-gray-100 bg-white lg:sticky lg:top-0 lg:z-30 lg:flex">
          <div className="p-6 border-b border-gray-100">
            <Link href={"/"}>
              <h1 className="text-xl font-bold text-green-600">CoachPlate</h1>
            </Link>
            <p className="text-xs text-gray-400 mt-0.5">Voor coaches</p>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <NavItem key={item.href} href={item.href} icon={item.icon} label={item.label} />
            ))}
          </nav>

          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                {coach?.full_name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{coach?.full_name}</p>
                <p className="text-xs text-gray-400 truncate">{coach?.email}</p>
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


