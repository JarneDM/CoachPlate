// src/app/(public)/dpa/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Verwerkersovereenkomst | CoachPlate",
};

export default function DataProcessingAgreementPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Verwerkersovereenkomst</h1>
        <p className="text-sm text-gray-500 mt-2">Versie 1.0 — 29 maart 2026</p>

        <div className="prose prose-sm max-w-none mt-6 text-gray-700">
          <p>Deze verwerkersovereenkomst wordt gesloten tussen:</p>
          <ul>
            <li>
              <strong>Verwerkingsverantwoordelijke:</strong> de coach of professional die CoachPlate gebruikt
            </li>
            <li>
              <strong>Verwerker:</strong> Jarne De Meyer, Sint-Niklaas, België, info@coachplate.com, handelend onder de naam CoachPlate
            </li>
          </ul>
          <p>Door gebruik te maken van CoachPlate gaat de verwerkingsverantwoordelijke akkoord met deze overeenkomst.</p>

          <h2>Artikel 1 — Definities</h2>
          <ul>
            <li>
              <strong>Persoonsgegevens:</strong> alle informatie over een geïdentificeerde of identificeerbare natuurlijke persoon
            </li>
            <li>
              <strong>Bijzondere categorieën:</strong> gezondheidsdata, zoals gewicht, allergieën en voedingsgegevens
            </li>
            <li>
              <strong>Verwerking:</strong> elke bewerking van persoonsgegevens, zoals opslaan, raadplegen of wissen
            </li>
            <li>
              <strong>Betrokkene:</strong> de klant van de coach wiens persoonsgegevens worden verwerkt
            </li>
          </ul>

          <h2>Artikel 2 — Voorwerp en duur</h2>
          <p>
            De verwerker verwerkt persoonsgegevens uitsluitend in opdracht van de verwerkingsverantwoordelijke voor het leveren van de
            CoachPlate-diensten, waaronder het opslaan en verwerken van klantprofielen, voedings- en trainingsplannen.
          </p>
          <p>
            Deze overeenkomst is van kracht zolang de verwerkingsverantwoordelijke gebruik maakt van CoachPlate en eindigt automatisch bij
            opzegging van het account.
          </p>

          <h2>Artikel 3 — Verplichtingen van de verwerker</h2>
          <p>De verwerker verbindt zich ertoe:</p>
          <ul>
            <li>Persoonsgegevens uitsluitend te verwerken op gedocumenteerde instructies van de verwerkingsverantwoordelijke</li>
            <li>Vertrouwelijkheid te garanderen van alle verwerkte persoonsgegevens</li>
            <li>Passende technische en organisatorische beveiligingsmaatregelen te implementeren</li>
            <li>Sub-verwerkers alleen in te schakelen met passende contractuele garanties</li>
            <li>De verwerkingsverantwoordelijke te ondersteunen bij het beantwoorden van verzoeken van betrokkenen</li>
            <li>Gegevens te verwijderen na beëindiging van de overeenkomst</li>
          </ul>

          <h2>Artikel 4 — Sub-verwerkers</h2>
          <p>De verwerker maakt gebruik van de volgende sub-verwerkers:</p>
          <ul>
            <li>
              <strong>Supabase Inc.</strong> — database en authenticatie (EU-regio Frankfurt)
            </li>
            <li>
              <strong>Stripe Inc.</strong> — betalingsverwerking
            </li>
            <li>
              <strong>Anthropic PBC</strong> — AI-verwerking voor plangeneratie
            </li>
            <li>
              <strong>Vercel Inc.</strong> — hostinginfrastructuur
            </li>
          </ul>
          <p>De verwerker stelt de verwerkingsverantwoordelijke in kennis van eventuele wijzigingen in sub-verwerkers.</p>

          <h2>Artikel 5 — Beveiliging</h2>
          <ul>
            <li>Versleuteling van data in rust en in transit via HTTPS/TLS</li>
            <li>Row-level security: elke coach heeft enkel toegang tot zijn eigen klantdata</li>
            <li>Toegangscontrole en authenticatie via Supabase Auth</li>
            <li>Regelmatige back-ups van alle data</li>
            <li>Data wordt opgeslagen in de EU (Frankfurt)</li>
          </ul>

          <h2>Artikel 6 — Datalekken</h2>
          <p>Bij een inbreuk op de beveiliging zal de verwerker:</p>
          <ul>
            <li>De verwerkingsverantwoordelijke zonder onredelijke vertraging op de hoogte stellen</li>
            <li>Alle relevante informatie verstrekken om aan de meldplicht te voldoen</li>
            <li>Maatregelen nemen om de inbreuk te beperken en herhaling te voorkomen</li>
          </ul>
          <p>De verwerkingsverantwoordelijke is zelf verantwoordelijk voor het melden aan de GBA binnen 72 uur indien vereist.</p>

          <h2>Artikel 7 — Rechten van betrokkenen</h2>
          <p>
            De verwerkingsverantwoordelijke is primair verantwoordelijk voor het behandelen van verzoeken van betrokkenen. De verwerker
            biedt technische ondersteuning via info@coachplate.com voor inzage-, correctie-, verwijderings- en overdraagbaarheidsverzoeken.
          </p>

          <h2>Artikel 8 — Internationale doorgifte</h2>
          <p>
            Persoonsgegevens worden primair verwerkt binnen de EU. Bij gebruik van sub-verwerkers buiten de EU (zoals Anthropic) worden
            passende waarborgen getroffen conform GDPR hoofdstuk V.
          </p>

          <h2>Artikel 9 — Beëindiging</h2>
          <p>
            Na beëindiging van de overeenkomst worden alle persoonsgegevens binnen 30 dagen definitief verwijderd, tenzij wettelijke
            bewaarplicht anders vereist.
          </p>

          <h2>Artikel 10 — Toepasselijk recht</h2>
          <p>
            Op deze overeenkomst is het Belgisch recht van toepassing. Geschillen worden voorgelegd aan de bevoegde rechtbanken te Gent.
          </p>

          <h2>Contactgegevens verwerker</h2>
          <ul>
            <li>Naam: Jarne De Meyer</li>
            <li>E-mail: info@coachplate.com</li>
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
