import React from 'react'
import Link from "next/link";

function ClientsPage() {
  return (
    <div className='text-black'>
      <h1>This is the clients page</h1>
      <Link href="/clients/add">Add New Client</Link>
    </div>
  );
}

export default ClientsPage
