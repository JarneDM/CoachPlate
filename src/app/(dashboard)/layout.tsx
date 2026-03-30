import { createClient } from "@/lib/supabase/server";
import { ensureCoachProfile } from "@/lib/supabase/ensureCoachProfile";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import { LayoutDashboard, NotepadText, Settings, Users, CalendarDays, Dumbbell } from "lucide-react";
import { NavItem } from "@/components/NavItem";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await ensureCoachProfile(supabase, user);

  const { data: coach } = await supabase.from("coaches").select("*").eq("id", user.id).single();

  return (
    <div className="min-h-screen bg-gray-50 flex z-50">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-green-600">CoachPlate</h1>
          <p className="text-xs text-gray-400 mt-0.5">Voor voedingscoaches</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard className="w-5 h-5" />} label="Dashboard" />
          <NavItem href="/clients" icon={<Users className="w-5 h-5" />} label="Klanten" />
          <NavItem href="/meal-plans" icon={<CalendarDays className="w-5 h-5" />} label="Weekplannen" />
          <NavItem href="/recipes" icon={<NotepadText className="w-5 h-5" />} label="Recepten" />
          <NavItem href="/training-plans" icon={<Dumbbell className="w-5 h-5" />} label="Trainingsschema's" />
          <NavItem href="/settings" icon={<Settings className="w-5 h-5" />} label="Instellingen" />
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

      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}


