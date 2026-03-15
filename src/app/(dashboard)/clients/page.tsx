import { getClients } from "@/app/services/clients/clients";
import Link from "next/link";
import { Users, Plus, CalendarDays, ArrowRight, Mail, Calendar } from "lucide-react";
import Button from "@/components/CTA/Button";

async function ClientsPage() {
  const clients = await getClients();

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Klanten</h1>
          <p className="text-gray-400 text-sm mt-1">
            {clients.length} {clients.length === 1 ? "klant" : "klanten"} in je lijst
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button href="/meal-plans/new" label="Nieuw weekplan" icon={<CalendarDays size={14} />} />
          <Button href="/clients/new" label="Nieuwe klant" icon={<Plus size={14} />} />
        </div>
      </div>

      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clients.map((client) => (
            <Link
              key={client.id}
              href={`/clients/${client.id}`}
              className="group bg-white rounded-xl border border-gray-100 p-5 hover:border-green-200 hover:shadow-sm transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 bg-green-100 group-hover:bg-green-200 rounded-xl flex items-center justify-center text-green-700 font-bold text-lg shrink-0 transition-colors">
                  {client.full_name.charAt(0).toUpperCase()}
                </div>

                <div className="min-w-0">
                  <h2 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors truncate">{client.full_name}</h2>
                  <div className="flex flex-col gap-0.5 mt-1">
                    {client.email && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400 truncate">
                        <Mail size={10} />
                        {client.email}
                      </span>
                    )}
                    {client.birth_date && (
                      <span className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={10} />
                        {new Date(client.birth_date).toLocaleDateString("nl-BE", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                    )}
                    {client.goal && (
                      <span className="inline-flex mt-1 bg-green-50 text-green-700 text-xs font-medium px-2 py-0.5 rounded-full w-fit">
                        {client.goal}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ArrowRight
                size={16}
                className="text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all shrink-0 ml-2"
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-green-500" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Nog geen klanten</h3>
          <p className="text-gray-400 text-sm mb-6">Voeg je eerste klant toe om te beginnen.</p>
          <div className="flex items-center justify-center">
            <Button href="/clients/add" label="Eerste klant toevoegen" icon={<Plus size={14} />} width="max-w-[300px] w-auto" />
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientsPage;
