// src/app/(public)/terms/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Algemene Voorwaarden | CoachPlate",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Algemene Voorwaarden</h1>
        <p className="text-sm text-gray-500 mt-2">Versie 1.0 — 29 maart 2026</p>

        <div className="prose prose-sm max-w-none mt-6 text-gray-700">

          <p>Deze Algemene Voorwaarden zijn van toepassing op het gebruik van CoachPlate, aangeboden door Jarne De Meyer, Sint-Niklaas, België (hierna &quot;CoachPlate&quot;).</p>

          <h2>Artikel 1 — Definities</h2>
          <ul>
            <li><strong>CoachPlate:</strong> het online platform beschikbaar via coachplate.app</li>
            <li><strong>Gebruiker:</strong> elke coach, trainer of professional die een account aanmaakt</li>
            <li><strong>Klant:</strong> de eindgebruiker wiens gegevens door de coach worden beheerd</li>
            <li><strong>Dienst:</strong> alle functionaliteiten aangeboden via het platform</li>
          </ul>

          <h2>Artikel 2 — Toepasselijkheid</h2>
          <p>Door een account aan te maken en gebruik te maken van CoachPlate, aanvaard je deze Algemene Voorwaarden volledig. Als je niet akkoord gaat, kan je geen gebruik maken van de dienst.</p>

          <h2>Artikel 3 — Aanbod en abonnementen</h2>
          <h3>3.1 Plannen</h3>
          <ul>
            <li><strong>Starter:</strong> beperkt aantal klanten, basisfunctionaliteiten</li>
            <li><strong>Pro:</strong> onbeperkt klanten, AI-functies, volledige toegang</li>
            <li><strong>Studio:</strong> voor gyms en grotere organisaties, op aanvraag</li>
          </ul>
          <h3>3.2 Prijzen</h3>
          <p>De actuele prijzen zijn beschikbaar op de website. Prijzen kunnen worden aangepast. Bestaande klanten worden minstens 30 dagen op voorhand verwittigd van prijswijzigingen.</p>
          <h3>3.3 Betaling</h3>
          <p>Betalingen verlopen via Stripe. Abonnementen worden maandelijks automatisch verlengd. Bij mislukte betaling behoudt CoachPlate het recht om de toegang tijdelijk te beperken.</p>

          <h2>Artikel 4 — Gebruik van de dienst</h2>
          <h3>4.1 Toegestaan gebruik</h3>
          <p>De dienst mag uitsluitend worden gebruikt voor professionele begeleiding van klanten op het gebied van voeding en training.</p>
          <h3>4.2 Verboden gebruik</h3>
          <ul>
            <li>De dienst gebruiken voor illegale doeleinden</li>
            <li>Gegevens van anderen misbruiken of ongeoorloofd verwerken</li>
            <li>De beveiliging van het platform omzeilen of proberen te omzeilen</li>
            <li>Het platform gebruiken om spam of misleidende inhoud te verspreiden</li>
            <li>De dienst doorverkopen zonder uitdrukkelijke toestemming</li>
          </ul>

          <h2>Artikel 5 — Verplichtingen van de gebruiker</h2>
          <ul>
            <li>Het correct en rechtmatig verwerken van klantgegevens conform GDPR</li>
            <li>Het informeren van klanten over de verwerking van hun gegevens</li>
            <li>Het beveiligen van inloggegevens</li>
            <li>De juistheid van ingevoerde informatie garanderen</li>
            <li>Het naleven van toepasselijke wet- en regelgeving in de eigen sector</li>
          </ul>

          <h2>Artikel 6 — Intellectuele eigendom</h2>
          <p>Alle rechten op het platform, inclusief software, ontwerp, logo&apos;s en content, zijn eigendom van CoachPlate. De gegevens die gebruikers invoeren blijven eigendom van de gebruiker. CoachPlate heeft uitsluitend een licentie om deze te verwerken voor het leveren van de dienst.</p>

          <h2>Artikel 7 — Beschikbaarheid en onderhoud</h2>
          <p>Wij streven naar een beschikbaarheid van 99,5% maar kunnen geen absolute garantie bieden. Gepland onderhoud wordt vooraf gecommuniceerd.</p>

          <h2>Artikel 8 — Aansprakelijkheid</h2>
          <p>CoachPlate is niet aansprakelijk voor:</p>
          <ul>
            <li>Indirecte schade, gevolgschade of gederfde winst</li>
            <li>Schade door onjuist gebruik van het platform</li>
            <li>Verlies van gegevens door omstandigheden buiten onze controle</li>
            <li>Schade veroorzaakt door derden of sub-verwerkers</li>
          </ul>
          <p>Onze totale aansprakelijkheid is in alle gevallen beperkt tot het bedrag dat de gebruiker de voorbije 3 maanden heeft betaald voor de dienst.</p>

          <h2>Artikel 9 — Opzegging</h2>
          <h3>9.1 Door de gebruiker</h3>
          <p>Je kan je abonnement op elk moment opzeggen via de instellingenpagina. Je behoudt toegang tot het einde van de betaalde periode. Er is geen terugbetaling voor niet-gebruikte periodes.</p>
          <h3>9.2 Door CoachPlate</h3>
          <p>Wij kunnen een account opschorten of beëindigen bij ernstige schending van deze voorwaarden, na voorafgaande kennisgeving tenzij de schending een onmiddellijke reactie vereist.</p>

          <h2>Artikel 10 — Wijzigingen</h2>
          <p>Wij behouden het recht om deze voorwaarden te wijzigen. Gebruikers worden minstens 30 dagen op voorhand verwittigd via e-mail. Voortgezet gebruik na de ingangsdatum geldt als aanvaarding van de nieuwe voorwaarden.</p>

          <h2>Artikel 11 — Toepasselijk recht en bevoegde rechter</h2>
          <p>Op deze overeenkomst is het Belgisch recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechtbanken te Gent.</p>

          <h2>Artikel 12 — Contactgegevens</h2>
          <ul>
            <li>Naam: Jarne De Meyer</li>
            <li>E-mail:{" "}
              <a href="mailto:jarnedm@outlook.com" className="text-green-600 hover:underline">
                jarnedm@outlook.com
              </a>
            </li>
            <li>Locatie: Sint-Niklaas, België</li>
            <li>Website: coachplate.com</li>
          </ul>

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
