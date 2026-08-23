# Mietrecht Agentur — Demo-MVP

Klickbarer Gesprächsprototyp für Termine mit österreichischen Mietrechtskanzleien. Die App spielt einen vollständig fiktiven Grazer Musterfall vom Mietvertrag bis zum digitalen Kanzlei-Akt durch.

> **Wichtig:** Der Prototyp bietet keine Rechtsberatung und führt keine rechtsverbindliche Prüfung durch. Sämtliche Personen, Adressen, Aktenzeichen und Dokumentdaten sind frei erfunden.

## Lokal starten

Voraussetzung: Node.js 22.13 oder neuer.

```bash
npm install
npm run dev
```

Danach `http://localhost:3000` öffnen. Falls dieser Port belegt ist, zeigt das Terminal automatisch eine andere Adresse an, beispielsweise `http://localhost:3001`.

Build und Test:

```bash
npm run build
npm test
```

## Demo-Ablauf

1. Simulierter Upload eines fiktiven Muster-Mietvertrags
2. Extrahierte Vertragsdaten mit Seitenquellen
3. Rückfragen zu Lift, Keller und Zustand
4. Evidence Store, ArcGIS-Einordnung und MRG-Routing
5. Ergebnis `MORE_DATA` mit klar als hypothetisch markierter Bandbreite
6. Digital Case File für die Kanzlei

Im Ergebnis-Screen lassen sich außerdem `AUTO_CHECK`, `EXPERT_REVIEW` und `OUT_OF_SCOPE` als alternative Demo-Zustände ansehen.

## Was derzeit simuliert ist

Die Daten liegen statisch in `app/page.tsx`. Noch nicht verbunden sind:

- sichere PDF-Ablage, OCR und LLM-/Dokumentenextraktion
- Graz GIS/ArcGIS als Research Resolver
- BEV, Grundbuch, GBV-/Förderdaten und Bauakt-Workflows
- persistenter Evidence Store
- anwaltlich validierte MRG-Regeln und Mietzinsberechnung
- Rollen, Datenschutz, Löschfristen und Audit-Protokoll
- Human-Review-Workflow für Kanzleien

## Projektstruktur

- `app/page.tsx` — Demo-Daten, Screens und Interaktionen
- `app/globals.css` — Design und responsive Darstellung
- `app/layout.tsx` — Seitentitel und Metadaten
- `tests/rendered-html.test.mjs` — Render-Smoke-Test

Das Projekt ist absichtlich als kompakte Single-Page-Demo gebaut, damit Erkenntnisse aus Anwaltsgesprächen schnell eingearbeitet werden können.
