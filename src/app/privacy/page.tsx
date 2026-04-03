// src/app/(public)/privacy/page.tsx
import Link from "next/link";

export const metadata = {
  title: "Privacybeleid | CoachPlate",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl p-6 md:p-8">
        <h1 className="text-2xl font-bold text-gray-900">Privacybeleid</h1>
        <p className="text-sm text-gray-500 mt-2">Laatst bijgewerkt: 29 maart 2026</p>

        <div className="prose prose-sm max-w-none mt-6 text-gray-700">
          <h2>1. Wie zijn wij?</h2>
          <p>
            CoachPlate is een softwareplatform voor voedingscoaches en personal trainers, ontwikkeld door Jarne De Meyer, gevestigd te
            Sint-Niklaas, België. Je kan ons bereiken via info@coachplate.com of via coachplate.app.
          </p>

          <h2>2. Welke persoonsgegevens verzamelen wij?</h2>
          <h3>2.1 Gegevens van coaches (gebruikers)</h3>
          <ul>
            <li>Naam en e-mailadres bij registratie</li>
            <li>Betalingsgegevens via Stripe (wij slaan geen kaartgegevens op)</li>
            <li>Gebruiksdata van het platform (inlogmomenten, aangemaakte plannen)</li>
          </ul>
          <h3>2.2 Gegevens van klanten van coaches</h3>
          <p>
            Coaches voeren gegevens in over hun klanten. Dit zijn persoonsgegevens waarvoor de coach verwerkingsverantwoordelijke is en wij
            verwerker. Deze gegevens omvatten:
          </p>
          <ul>
            <li>Naam, e-mailadres en geboortedatum</li>
            <li>Gewicht, lengte en lichaamsmetingen</li>
            <li>Voedings- en trainingsdoelen</li>
            <li>Allergieën en voedingsvoorkeuren</li>
          </ul>
          <p>
            Gezondheidsdata valt onder de bijzondere categorieën van persoonsgegevens (GDPR artikel 9) en wordt met de hoogste graad van
            beveiliging behandeld.
          </p>

          <h2>3. Waarom verwerken wij persoonsgegevens?</h2>
          <ul>
            <li>Om de dienst te leveren en te verbeteren</li>
            <li>Om coaches in staat te stellen hun klanten te begeleiden</li>
            <li>Om betalingen te verwerken via Stripe</li>
            <li>Om technische ondersteuning te bieden</li>
            <li>Om te voldoen aan wettelijke verplichtingen</li>
          </ul>
          <p>Wij verwerken nooit persoonsgegevens voor advertentiedoeleinden en verkopen deze nooit aan derden.</p>

          <h2>4. Hoe lang bewaren wij gegevens?</h2>
          <ul>
            <li>Accountgegevens: zolang het account actief is</li>
            <li>Klantgegevens: zolang de coach een actief account heeft</li>
            <li>Na opzegging: gegevens worden 30 dagen bewaard en daarna definitief verwijderd</li>
            <li>Betalingsgegevens: 7 jaar conform wettelijke bewaarplicht</li>
          </ul>

          <h2>5. Met wie delen wij gegevens?</h2>
          <p>Wij delen persoonsgegevens alleen met vertrouwde verwerkers die noodzakelijk zijn voor de werking van het platform:</p>
          <ul>
            <li>Supabase — database en authenticatie (EU-regio)</li>
            <li>Stripe — betalingsverwerking</li>
            <li>Anthropic — AI-verwerking voor menu- en plangeneratie</li>
            <li>Vercel — hostinginfrastructuur</li>
          </ul>

          <h2>6. Jouw rechten</h2>
          <ul>
            <li>
              <strong>Inzage:</strong> opvragen welke gegevens wij over jou bewaren
            </li>
            <li>
              <strong>Correctie:</strong> foutieve gegevens laten aanpassen
            </li>
            <li>
              <strong>Verwijdering:</strong> je gegevens laten wissen
            </li>
            <li>
              <strong>Overdraagbaarheid:</strong> je gegevens in een leesbaar formaat opvragen
            </li>
            <li>
              <strong>Bezwaar:</strong> bezwaar maken tegen bepaalde verwerkingen
            </li>
          </ul>
          <p>
            Om een van deze rechten uit te oefenen, stuur een e-mail naar info@coachplate.com. Wij behandelen je verzoek binnen 30 dagen.
          </p>

          <h2>7. Beveiliging</h2>
          <ul>
            <li>Alle data wordt versleuteld opgeslagen en verstuurd via HTTPS</li>
            <li>Row-level security zodat gebruikers nooit elkaars data kunnen zien</li>
            <li>Data wordt opgeslagen in de EU (Frankfurt)</li>
            <li>Bij een datalek melden wij dit binnen 72 uur aan de GBA</li>
          </ul>

          <h2>8. Klachten</h2>
          <p>
            Als je niet tevreden bent, kan je een klacht indienen bij de{" "}
            <a
              href="https://www.gegevensbeschermingsautoriteit.be"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              Gegevensbeschermingsautoriteit (GBA)
            </a>
            .
          </p>

          <h2>9. Contact</h2>
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
