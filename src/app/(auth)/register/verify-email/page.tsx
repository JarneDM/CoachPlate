import Link from "next/link";

export default function VerifyEmailPage() {
  return (
    <div className="text-center">
      <div className="text-5xl mb-4">📬</div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Check je e-mail</h2>
      <p className="text-gray-500 text-sm mb-6">We hebben een verificatielink gestuurd. Klik op de link om je account te activeren.</p>
      <p className="text-xs text-gray-400">
        Geen e-mail ontvangen?{" "}
        <Link href="/register" className="text-green-600 hover:underline">
          Probeer opnieuw
        </Link>
      </p>
    </div>
  );
}
