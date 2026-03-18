import React from 'react'
import Link from "next/link";

function Button({ href, label, icon, width }: { href: string; label?: string; icon?: React.ReactNode; width?: string }) {
  return (
    <div>
      <Link
        href={href}
        className={`flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ${width || "w-full"}`}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {label}
      </Link>
    </div>
  );
}

export default Button
