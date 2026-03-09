import { getClients } from "@/app/services/clients/clients";
// import { Client } from "@/types";
import Link from "next/link";

async function ClientsPage() {
  const { data: clients } = await getClients();

  if (!clients || clients.length === 0) {
    return <p>No clients found. Start by adding a new client!</p>;
  }

  return (
    <div className="text-black flex flex-col gap-4">
      <h1 className="text-3xl justify-center flex items-center">Clients</h1>
      <Link className="bg-green-500 p-2 rounded-md shadow w-fit hover:bg-green-600" href="/clients/add">
        Add New Client
      </Link>
      <div className="text-black flex flex-col-2 justify-center items-center gap-4">
        {clients?.map((client) => (
          <div key={client.id} className="border p-4 rounded-lg mb-4 flex justify-between items-center w-full shadow-md">
            <div className="flex justify-between space-x-4 items-center">
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium text-sm">
                {client.full_name.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-lg font-semibold">{client.full_name}</h2>
              <p className="text-sm text-gray-600">{client.email}</p>
              <p className="text-sm text-gray-600">{client.birth_date}</p>
              <p className="text-sm text-gray-600">{client.gender}</p>
            </div>
            <Link href={`/clients/${client.id}`} className="text-green-500 hover:underline">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClientsPage;
