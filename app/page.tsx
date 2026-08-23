"use client";

import { useState } from "react";

type Outcome = "AUTO_CHECK" | "MORE_DATA" | "EXPERT_REVIEW" | "OUT_OF_SCOPE";
type Answer = "Ja" | "Nein" | "Unbekannt";

const steps = [
  [1, "Dokument", "Demo-Upload"],
  [2, "Vertragsdaten", "Fact Extraction"],
  [3, "Rückfragen", "Fehlende Fakten"],
  [4, "Evidenz & MRG", "Routing"],
  [5, "Ergebnis", "Vorläufig"],
  [6, "Kanzlei-Akt", "Human Review"],
] as const;

const facts = [
  ["Mietobjekt", "Musterstraße 18, 8010 Graz", "Mietvertrag S. 1"],
  ["Wohnfläche", "72,4 m²", "Mietvertrag S. 2"],
  ["Netto-Hauptmietzins", "€ 850,00 / Monat", "Mietvertrag S. 3"],
  ["Betriebskosten", "€ 176,00 / Monat", "Mietvertrag S. 3"],
  ["Mietbeginn", "01.07.2024", "Mietvertrag S. 2"],
  ["Vertragsabschluss", "15.06.2024", "Mietvertrag S. 6"],
  ["Befristung", "5 Jahre · bis 30.06.2029", "Mietvertrag S. 2"],
  ["Mietverhältnis", "Hauptmiete", "Mietvertrag S. 1"],
  ["Vermieterseite", "Muster Immobilien GmbH", "Mietvertrag S. 1"],
] as const;

const evidence = [
  ["Wohnfläche", "72,4 m²", "CONFIRMED", "Unterzeichneter Mietvertrag, S. 2"],
  ["Befristung", "5 Jahre", "CONFIRMED", "Unterzeichneter Mietvertrag, S. 2"],
  ["Einlagezahl (EZ)", "EZ 1842, KG 63102", "CONFIRMED", "Grundbuchsauszug (Demo)"],
  ["Errichtungszeitraum", "vor 1945 plausibel", "CORROBORATED", "Vertrag + Gebäudekartierung"],
  ["ArcGIS-Aktenhinweis", "GZ A17-1234/1987", "HINT", "Graz GIS / AKTENZAHL1_DATUM"],
  ["Historische Förderung", "nicht ermittelt", "UNKNOWN", "Förderakt / GBV-Abfrage offen"],
  ["Baubewilligung Zubau", "Datumsangaben weichen ab", "CONFLICT", "GIS-Hinweis vs. Vertragsangabe"],
] as const;

const outcomes: Record<Outcome, { title: string; text: string; tone: string; symbol: string }> = {
  AUTO_CHECK: { title: "Automatische Vorprüfung möglich", text: "Genügend belastbare Fakten für eine vorläufige Berechnung. Weiterhin keine rechtsverbindliche Beurteilung.", tone: "green", symbol: "✓" },
  MORE_DATA: { title: "Weitere Unterlagen erforderlich", text: "Förderstatus und maßgebliche Baubewilligung sind nicht ausreichend bestätigt. Die MRG-Einordnung bleibt vorläufig.", tone: "amber", symbol: "?" },
  EXPERT_REVIEW: { title: "Juristische Prüfung empfohlen", text: "Mehrere Einordnungen sind möglich. Der strukturierte Fall wird mit offenen Punkten an die Kanzlei übergeben.", tone: "blue", symbol: "§" },
  OUT_OF_SCOPE: { title: "Außerhalb des Demo-Prüfbereichs", text: "Hinweise auf WGG, Untermiete oder einen ausgeschlossenen Sonderfall führen zur fachlichen Weiterleitung.", tone: "slate", symbol: "→" },
};

const pipeline = ["Fact Extraction", "External Resolution", "Evidence Store", "MRG Rule Engine", "Mietzins Engine", "Human Review"];

function Badge({ level }: { level: string }) {
  return <span className={`badge ${level.toLowerCase()}`}><i />{level}</span>;
}

function Intro({ number, kicker, title, children }: { number: string; kicker: string; title: string; children: React.ReactNode }) {
  return <div className="intro"><span>{number} · {kicker}</span><h2>{title}</h2><p>{children}</p></div>;
}

function Notice({ children, warning = false }: { children: React.ReactNode; warning?: boolean }) {
  return <div className={`notice ${warning ? "warning" : ""}`}><b>{warning ? "!" : "i"}</b><p>{children}</p></div>;
}

function EvidenceTable({ compact = false }: { compact?: boolean }) {
  return <div className={`evidence-table ${compact ? "compact" : ""}`}>
    <div className="evidence-row table-head"><span>Fakt</span><span>Wert</span><span>Evidenz</span><span>Quelle</span></div>
    {evidence.map(([fact, value, level, source]) => <div className="evidence-row" key={fact}><strong>{fact}</strong><span>{value}</span><Badge level={level}/><small>{source}</small></div>)}
  </div>;
}

export default function Home() {
  const [screen, setScreen] = useState(0);
  const [demoFile, setDemoFile] = useState(false);
  const [lift, setLift] = useState<Answer>("Unbekannt");
  const [keller, setKeller] = useState<Answer>("Ja");
  const [zustand, setZustand] = useState("Teilweise abgewohnt");
  const [outcome, setOutcome] = useState<Outcome>("MORE_DATA");

  const next = () => setScreen((value) => Math.min(6, value + 1));
  const back = () => setScreen((value) => Math.max(0, value - 1));

  return <main>
    <div className="demo-banner"><span>Demo-Prototyp</span>Nicht rechtsverbindliche Vorprüfung · keine Rechtsberatung</div>
    <header className="topbar">
      <button className="brand" onClick={() => setScreen(0)}><b>M</b><span>Mietrecht <strong>Agentur</strong></span></button>
      <div><small>Fiktiver Musterfall · Graz</small>{screen > 0 && <button className="case-link" onClick={() => setScreen(6)}>Kanzlei-Ansicht ↗</button>}</div>
    </header>

    {screen === 0 ? <Landing onStart={() => setScreen(1)} onCase={() => setScreen(6)} /> : <div className="app-shell">
      <aside className="sidebar">
        <div className="case-id"><small>Demo-Fall</small><strong>MA–GRAZ–001</strong><span>Musterstraße 18 · Graz</span></div>
        <nav>{steps.map(([id, name, detail]) => <button key={id} className={`${screen === id ? "active" : ""} ${screen > id ? "done" : ""}`} onClick={() => setScreen(id)}><i>{screen > id ? "✓" : id}</i><span><b>{name}</b><small>{detail}</small></span></button>)}</nav>
        <div className="fiction-note"><b>i</b>Alle Daten und Personen sind frei erfunden.</div>
      </aside>
      <section className="workspace">
        {screen === 1 && <Upload selected={demoFile} onSelect={() => setDemoFile(true)} />}
        {screen === 2 && <ExtractedFacts />}
        {screen === 3 && <Questions lift={lift} setLift={setLift} keller={keller} setKeller={setKeller} zustand={zustand} setZustand={setZustand} />}
        {screen === 4 && <Evidence />}
        {screen === 5 && <Result outcome={outcome} setOutcome={setOutcome} />}
        {screen === 6 && <CaseFile lift={lift} keller={keller} zustand={zustand} />}
        <footer><button className="back" onClick={back}>← Zurück</button><small>Schritt {screen} von 6</small>{screen < 6 ? <button className="primary" onClick={next}>{screen === 1 ? "Dokument analysieren" : screen === 5 ? "Digitalen Fallakt öffnen" : "Weiter"}<span>→</span></button> : <button className="primary" onClick={() => setScreen(0)}>Demo neu starten <span>↻</span></button>}</footer>
      </section>
    </div>}
  </main>;
}

function Landing({ onStart, onCase }: { onStart: () => void; onCase: () => void }) {
  return <>
    <section className="hero"><span className="eyebrow">Digitale Fallvorbereitung für Mietrecht</span><h1>Vom Mietvertrag zum<br/><em>prüfbaren Sachverhalt.</em></h1><p>Vertragsdaten strukturieren, externe Hinweise einordnen und offene Rechtsfragen sichtbar machen — bevor die juristische Prüfung beginnt.</p><div><button className="primary large" onClick={onStart}>Mietvertrag prüfen <span>→</span></button><button className="secondary" onClick={onCase}>Kanzlei-Ansicht ansehen</button></div><small>Geführte Demo · ca. 3 Minuten · fiktiver Musterfall</small></section>
    <section className="preview"><div className="preview-head"><span><i/>Fall MA–GRAZ–001<strong>Musterstraße 18, 8010 Graz</strong></span><Badge level="MORE_DATA" /></div><div className="metrics"><div><small>Wohnfläche</small><strong>72,4 m²</strong><span>✓ bestätigt</span></div><div><small>Netto-HMZ</small><strong>€ 850,00</strong><span>✓ extrahiert</span></div><div><small>Evidenz</small><strong>7 Fakten</strong><span>2 offen</span></div><div><small>Routing</small><strong>Mehr Daten</strong><span>Förderstatus offen</span></div></div></section>
    <section className="system"><div className="system-title"><span className="eyebrow">Systemprinzip</span><h2>Eine belegbare Kette — kein KI-Orakel.</h2><p>Jede Aussage bleibt mit Quelle, Evidenzstufe und Unsicherheit nachvollziehbar.</p></div><div className="pipeline">{pipeline.map((item, index) => <div key={item}><span>0{index + 1}</span><strong>{item}</strong><small>{index === 0 ? "Vertrag lesen" : index === 1 ? "GIS · BEV · GB · GBV · Bauakt" : index === 2 ? "Quellen bewerten" : index === 3 ? "Fall einordnen" : index === 4 ? "Nur wenn zulässig" : "Kanzlei entscheidet"}</small></div>)}</div></section>
  </>;
}

function Upload({ selected, onSelect }: { selected: boolean; onSelect: () => void }) {
  return <div className="content narrow"><Intro number="01" kicker="Dokument" title="Mietvertrag bereitstellen">Für diese Demo ist ein fiktiver Grazer Muster-Mietvertrag hinterlegt. Es werden keine Dateien hochgeladen oder gespeichert.</Intro><button className={`upload ${selected ? "selected" : ""}`} onClick={onSelect}><span className="document"><i/><i/><i/></span><strong>{selected ? "Muster-Mietvertrag ausgewählt" : "Demo-Mietvertrag verwenden"}</strong><p>Muster-Mietvertrag_Graz.pdf · 6 Seiten · rein fiktiv</p><b>{selected ? "✓ Bereit zur Analyse" : "Musterfall auswählen"}</b></button><div className="or"><span>oder</span></div><div className="disabled"><strong>Eigene PDF hochladen</strong><small>In diesem Demo-Prototyp noch nicht verbunden</small></div><Notice>Später werden hier Dokumentenextraktion, Seitenreferenzen und eine sichere Dateiablage angeschlossen.</Notice></div>;
}

function ExtractedFacts() {
  return <div className="content wide"><Intro number="02" kicker="Fact Extraction" title="Erkannte Vertragsdaten">Strukturierte Fakten mit präzisem Quellenhinweis. Jeder Wert bleibt zur Kontrolle editierbar.</Intro><div className="success"><b>✓</b><span><strong>9 von 9 Vertragsfeldern erkannt</strong><small>Hohe technische Extraktionssicherheit · noch keine rechtliche Bewertung</small></span><em>96%<small>Extraktion</small></em></div><div className="facts">{facts.map(([label, value, source]) => <article key={label}><small>{label}</small><strong>{value}</strong><span>§ {source}</span><button>Bearbeiten</button></article>)}</div><Notice><strong>Wichtig:</strong> „Erkannt“ heißt nur, dass ein Wert aus dem Dokument übernommen wurde. Ob er rechtlich maßgeblich ist, entscheidet die Evidenz- und MRG-Prüfung.</Notice></div>;
}

function AnswerButtons({ value, setValue }: { value: Answer; setValue: (value: Answer) => void }) {
  return <div className="answers">{(["Ja", "Nein", "Unbekannt"] as Answer[]).map((item) => <button key={item} className={value === item ? "selected" : ""} onClick={() => setValue(item)}>{value === item && "✓ "}{item}</button>)}</div>;
}

function Questions({ lift, setLift, keller, setKeller, zustand, setZustand }: { lift: Answer; setLift: (v: Answer) => void; keller: Answer; setKeller: (v: Answer) => void; zustand: string; setZustand: (v: string) => void }) {
  return <div className="content narrow"><Intro number="03" kicker="Fehlende Fakten" title="Drei gezielte Rückfragen">Wir fragen nur Informationen ab, die im Vertrag fehlen und für die spätere Beurteilung relevant sein können.</Intro><div className="questions"><article><i>01</i><div><h3>Gibt es einen Lift im Gebäude?</h3><p>Der Vertrag enthält dazu keine Angabe.</p><AnswerButtons value={lift} setValue={setLift}/></div></article><article><i>02</i><div><h3>Ist ein Kellerabteil mitvermietet?</h3><p>Kann für Ausstattung und Nutzwert relevant sein.</p><AnswerButtons value={keller} setValue={setKeller}/></div></article><article><i>03</i><div><h3>Zustand der Wohnung bei Einzug</h3><p>Selbstauskunft; eine Dokumentation wäre stärker.</p><div className="condition">{["Erstbezug / saniert", "Guter Zustand", "Teilweise abgewohnt", "Stark abgewohnt"].map((item) => <button key={item} className={zustand === item ? "selected" : ""} onClick={() => setZustand(item)}>{zustand === item && "✓ "}{item}</button>)}</div></div></article></div><Notice>Nutzerangaben werden als eigene Quelle gespeichert und nicht automatisch als <strong>CONFIRMED</strong> behandelt.</Notice></div>;
}

function Evidence() {
  return <div className="content full"><Intro number="04" kicker="Evidence Store + MRG Rule Engine" title="Welche Aussage ist wie gut belegt?">Nicht jede gefundene Information ist ein Beweis. Die Engine trennt bestätigte Fakten, Indizien, Lücken und Widersprüche.</Intro><div className="evidence-layout"><div><div className="legend">{[["CONFIRMED","Primärquelle"],["CORROBORATED","Mehrfach gestützt"],["HINT","Recherchehinweis"],["UNKNOWN","Offen"],["CONFLICT","Widerspruch"]].map(([level, label]) => <span key={level}><Badge level={level}/><small>{label}</small></span>)}</div><EvidenceTable/></div><aside className="resolver"><small>Research Resolver · Graz</small><h3>ArcGIS findet den Weg zum Akt — nicht die Rechtsantwort.</h3><div><span>Graz GIS</span>→<span>Aktenhinweis</span>→<span>Bauakt prüfen</span></div><p>Das Feld <code>AKTENZAHL1_DATUM</code> kann auf einen Vorgang hinweisen. Es darf <strong>nicht automatisch als Baubewilligungsdatum</strong> übernommen werden.</p><ul><li>Adresse und Grundstück auflösen</li><li>EZ und Aktenhinweise finden</li><li>Originalquelle gezielt anfordern</li></ul></aside></div><div className="route"><b>⇄</b><span><small>Vorläufiges MRG-Routing</small><strong>Einordnung noch nicht belastbar</strong></span><Badge level="MORE_DATA"/><p>Förderstatus offen · Baubewilligung nicht bestätigt</p></div></div>;
}

function Result({ outcome, setOutcome }: { outcome: Outcome; setOutcome: (v: Outcome) => void }) {
  const current = outcomes[outcome];
  return <div className="content wide"><Intro number="05" kicker="Routing-Ergebnis" title="Der nächste sinnvolle Schritt">Für den Musterfall ist MORE_DATA ausgewählt. Der Umschalter zeigt die vier möglichen Demo-Ergebnisse.</Intro><div className="outcomes">{(Object.keys(outcomes) as Outcome[]).map((item) => <button key={item} className={outcome === item ? "selected" : ""} onClick={() => setOutcome(item)}><i className={outcomes[item].tone}/>{item}</button>)}</div><section className={`result ${current.tone}`}><b>{current.symbol}</b><div><small>{outcome === "MORE_DATA" ? "Ergebnis im Musterfall" : "Alternative Demo-Ansicht"}</small><h3>{current.title}</h3><p>{current.text}</p></div><Badge level={outcome}/></section>{outcome === "MORE_DATA" ? <div className="result-grid"><section className="open-items"><h3>Noch benötigte Evidenz</h3>{[["01","Historischen Förderstatus klären","Förderakt, GBV-Abfrage oder Bestätigung"],["02","Maßgebliche Baubewilligung beiziehen","Originaldokument statt GIS-Hinweis"],["03","Widerspruch zum Zubau auflösen","Datumsangaben im Bauakt vergleichen"]].map(([n,t,d]) => <div key={n}><i>{n}</i><p><strong>{t}</strong><small>{d}</small></p><em>Offen</em></div>)}</section><section className="range"><span>Hypothetisches Rechenbeispiel</span><h3>Vorläufige Mietzinsbandbreite</h3><div><strong>€ 560</strong><i>bis</i><strong>€ 720</strong><small>/ Monat netto</small></div><b><i/></b><p>Nur illustrative Bandbreite auf Basis unbestätigter Annahmen. <strong>Keine Aussage über die zulässige Miete.</strong></p></section></div> : <Notice>Diese Ansicht demonstriert nur den Zustand <strong>{outcome}</strong>. Der Musterfall bleibt inhaltlich auf <strong>MORE_DATA</strong>.</Notice>}<Notice warning><strong>Nicht rechtsverbindliche Vorprüfung.</strong> Die App behauptet weder die Anwendbarkeit eines Mietzinsregimes noch eine Überzahlung. Verbindliche Beurteilungen erfolgen durch qualifizierte Rechtsberatung.</Notice></div>;
}

function CaseFile({ lift, keller, zustand }: { lift: Answer; keller: Answer; zustand: string }) {
  return <div className="content full case-file"><div className="file-heading"><div><span className="eyebrow">06 · Digital Case File</span><h2>Kanzlei-Akt · MA–GRAZ–001</h2><p>Strukturierte Übergabe aus dem fiktiven Demo-Musterfall</p></div><div><button>Drucken</button><button>PDF-Export ↓</button></div></div><div className="file-status"><span><i/><small>Routing</small><strong>MORE_DATA</strong></span><span><small>Bearbeitungsstand</small><strong>Vorprüfung abgeschlossen</strong></span><span><small>Rechtsstatus</small><strong>Nicht rechtsverbindlich</strong></span></div><div className="file-grid"><section className="file-card summary"><h3><i>01</i>Sachverhalt</h3><p>Fiktive Hauptmiete einer 72,4 m² großen Wohnung in Graz. Vertragsbeginn 01.07.2024, fünf Jahre befristet. Netto-Hauptmietzins € 850,00 zuzüglich € 176,00 Betriebskosten. Die maßgebliche Gebäudekategorie ist noch nicht abschließend belegt.</p><div><span><small>Nutzung</small><strong>Wohnen · Hauptmiete</strong></span><span><small>Vertrag</small><strong>15.06.2024</strong></span><span><small>Laufzeit</small><strong>5 Jahre befristet</strong></span><span><small>Nutzerdaten</small><strong>Lift: {lift} · Keller: {keller}</strong></span></div></section><section className="file-card"><h3><i>02</i>Mietzins</h3><div className="rent-total"><small>Monatliche Vorschreibung</small><strong>€ 1.026,00</strong></div><p className="rent-line"><span>Netto-Hauptmietzins</span><strong>€ 850,00</strong></p><p className="rent-line"><span>Betriebskosten</span><strong>€ 176,00</strong></p><p className="rent-line muted"><span>Hypothetische Bandbreite</span><strong>€ 560–720*</strong></p><small>* Illustrativ, nicht final.</small></section><section className="file-card"><h3><i>03</i>MRG-Einordnung</h3><div className="mrg"><span>Vertrag</span>→<span>Gebäudefakten</span>→<span>Offen</span></div><div className="assessment"><small>Vorläufige Einschätzung</small><strong>Regime nicht sicher klassifizierbar</strong><p>Förderung und Baubewilligung fehlen. Keine finale Mietzinsberechnung.</p></div></section><section className="file-card"><h3><i>04</i>Nutzerangaben</h3><div className="user-facts"><p><span>Lift vorhanden</span><strong>{lift}</strong><small>Selbstauskunft</small></p><p><span>Keller mitvermietet</span><strong>{keller}</strong><small>Selbstauskunft</small></p><p><span>Zustand bei Einzug</span><strong>{zustand}</strong><small>Selbstauskunft</small></p></div></section></div><section className="file-card evidence-file"><h3><i>05</i>Evidence Register <small>7 Einträge</small></h3><EvidenceTable compact/></section><section className="human"><div><b>§</b><span><small>Human Review</small><h3>Was die Kanzlei noch prüfen muss</h3></span></div><div className="checklist">{[["1","Anwendungsbereich des MRG","Voll-, Teil- oder Nichtanwendung anhand belegter Gebäudefakten."],["2","Förder- und Eigentumshistorie","Relevante Akten und Abfragen beiziehen."],["3","Baubewilligung und Zubau","Originalakten prüfen; GIS-Datum nicht als Beweis verwenden."],["4","Mietzinsberechnung freigeben","Erst nach gesicherter Regimeentscheidung."]].map(([n,t,d]) => <article key={n}><i>{n}</i><p><strong>{t}</strong><small>{d}</small></p></article>)}</div></section><div className="inline-pipeline"><span>Verarbeitungskette</span>{pipeline.map((item,index) => <b key={item}><i>0{index+1}</i>{item}{index < 5 && <em>→</em>}</b>)}</div><p className="disclaimer">Fiktiver Demo-Fall · Keine echten personenbezogenen Daten · Keine Rechtsberatung</p></div>;
}
