"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function Filter({clients}: {clients: {id: string, full_name: string}[]}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mealType = searchParams.get("client") || "all";

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("client");
    } else {
      params.set("client", value);
    }
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(url, { scroll: false });
  };
  return (
    <div className="w-full">
      <Select name="client" value={mealType} onValueChange={handleChange}>
        <SelectTrigger className="w-36">
          <SelectValue placeholder="Filter op klant" />
        </SelectTrigger>
        <SelectContent position="popper">
          <SelectGroup className="w-full">
            <SelectLabel>Klanten</SelectLabel>
            <SelectItem value="all">Alle klanten</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.full_name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default Filter;
