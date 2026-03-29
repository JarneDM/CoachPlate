// src/app/(public)/cookies/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Cookiebeleid | CoachPlate",
};

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Cookiebeleid</h1>
        <p className="text-sm text-gray-500 mt-2">Laatst bijgewerkt: 29 maart 2026</p>

        <div className="prose prose-sm max-w-none mt-6 text-gray-700">
          <h2>1. Wat zijn cookies?</h2>
          <p>
            Cookies zijn kleine tekstbestanden die op je apparaat worden opgeslagen wanneer je onze website bezoekt. Ze helpen ons de
            website correct te laten werken en je gebruikerservaring te verbeteren.
          </p>

          <h2>2. Welke cookies gebruiken wij?</h2>

          <h3>2.1 Strikt noodzakelijke cookies</h3>
          <p>Deze cookies zijn essentieel voor de werking van het platform en kunnen niet worden uitgeschakeld.</p>
          <ul>
            <li>Sessiecookies voor authenticatie (Supabase Auth)</li>
            <li>CSRF-beschermingscookies</li>
            <li>Veiligheidsrelevante cookies</li>
          </ul>

          <h3>2.2 Functionele cookies</h3>
          <p>Deze cookies onthouden je voorkeuren en instellingen.</p>
          <ul>
            <li>Taalvoorkeur</li>
            <li>Inlogstatus</li>
          </ul>

          <h3>2.3 Analytische cookies</h3>
          <p>Wij gebruiken momenteel geen analytische cookies van derden zoals Google Analytics.</p>

          <h3>2.4 Marketing cookies</h3>
          <p>Wij gebruiken geen marketing- of trackingcookies. CoachPlate bevat geen advertenties.</p>

          <h2>3. Cookies van derden</h2>
          <p>
            Onze betalingsprovider Stripe plaatst cookies voor fraudepreventie en betalingsverwerking. Deze cookies zijn strikt noodzakelijk
            voor het verwerken van betalingen. Meer info:{" "}
            <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
              stripe.com/privacy
            </a>
            .
          </p>

          <h2>4. Cookiebeheer</h2>
          <p>
            Je kan cookies beheren via de instellingen van je browser. Let op: het uitschakelen van noodzakelijke cookies kan de werking van
            het platform verstoren.
          </p>
          <ul>
            <li>Chrome: Instellingen &gt; Privacy en beveiliging &gt; Cookies</li>
            <li>Firefox: Instellingen &gt; Privacy en beveiliging</li>
            <li>Safari: Voorkeuren &gt; Privacy</li>
            <li>Edge: Instellingen &gt; Privacy, zoeken en services</li>
          </ul>

          <h2>5. Bewaartermijn</h2>
          <ul>
            <li>Sessiecookies: worden verwijderd bij het sluiten van je browser</li>
            <li>Persistente cookies: maximaal 1 jaar</li>
          </ul>

          <h2>6. Wijzigingen</h2>
          <p>Wij kunnen dit cookiebeleid op elk moment aanpassen. De meest recente versie is altijd beschikbaar op onze website.</p>

          <h2>7. Contact</h2>
          <p>
            Voor vragen over ons cookiebeleid:{" "}
            <a href="mailto:jarnedm@outlook.com" className="text-green-600 hover:underline">
              jarnedm@outlook.com
            </a>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-sm">
          <Link href="/dashboard" className="text-green-600 hover:underline">
            ← Terug
          </Link>
        </div>
      </div>
    </main>
  );
}
