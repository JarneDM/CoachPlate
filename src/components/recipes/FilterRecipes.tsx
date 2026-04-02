"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function FilterRecipes() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const mealType = searchParams.get("mealtype") || "all";

  const handleChange = (value: string) => {
    
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete("mealtype");
    } else {
      params.set("mealtype", value);
    }
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(url, { scroll: false });
      
  }
  return (
    <div className='w-full'>
      <Select name="meal-type" value={mealType} onValueChange={handleChange} >
        <SelectTrigger className='w-36'>
          <SelectValue placeholder="Filter op maaltijdtype" />
        </SelectTrigger>
        <SelectContent position='popper'>
          <SelectGroup className='w-full'>
            <SelectLabel>Maaltijdtype</SelectLabel>
            <SelectItem value="all">Alle</SelectItem>
            <SelectItem value="ontbijt">Ontbijt</SelectItem>
            <SelectItem value="lunch">Lunch</SelectItem>
            <SelectItem value="avondeten">Avondeten</SelectItem>
            <SelectItem value="snack">Snack</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

export default FilterRecipes
