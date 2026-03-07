import { MobilityModel } from "./model";

export abstract class ValidateService {
  static async validateData({
    body,
  }: {
    body: (typeof MobilityModel.InputUserBody)["static"];
  }) {
    // Frontend-Skala (1-5):
    // budget:       1 = Geringe Priorität,       5 = Hohe Kostenpriorisierung
    // comfort:      1 = Spartanisch,              5 = Maximaler Komfort
    // eco:          1 = Nebensächlich,             5 = Höchste Priorität
    // distance:     1 = Sehr kurz (<2km),         5 = Sehr weit (>150km)
    // availability: 1 = Keine ÖPNV-Anbindung,     5 = Hervorragend
    // flexibility:  1 = Planbare Abfahrtszeiten,  5 = Maximale zeitliche Unabhängigkeit
    // fuehrerschein: true/false

    const scores: { name: string; score: number; explanation: string }[] = [];

    // Auto: teuer, komfortabel, nicht öko, ideal für weite Strecken,
    //       aber dominiert unrealistisch - reduziert wenn ÖPNV verfügbar
    //       Führerschein erforderlich
    const carScore = body.fuehrerschein
      ? (6 - body.budget) * 1.8 +
        body.comfort * 2.3 -
        body.eco * 2.5 +
        body.distance * 2.2 +
        (6 - body.availability) * 1.2 +
        body.flexibility * 1.2
      : -100;

    scores.push({
      name: "Auto",
      score: carScore,
      explanation: this.carExplanation(body),
    });

    // ÖPNV: günstig, moderat komfortabel, öko, braucht SEHR gute Anbindung
    //        ist oft besser als Auto wenn Anbindung stimmt
    //        Fahrplan-gebunden: weniger Flexibilität
    const ptvScore =
      body.budget * 2.5 +
      body.comfort * 0.4 +
      body.eco * 2.5 +
      (body.availability >= 4 ? body.availability * 4 : body.availability * 0.3) +
      body.distance * 0.6 -
      body.flexibility * 1.2 +
      (body.availability <= 2 ? -20 : 0);

    scores.push({
      name: "ÖPNV",
      score: ptvScore,
      explanation: this.oepnvExplanation(body),
    });

    // Fahrrad: sehr günstig, wenig Komfort (körperliche Anstrengung),
    //          am nachhaltigsten, E-Bikes ermöglichen längere Strecken
    //          weniger Strafe für distance wegen E-Bike Realität
    const bikeScore =
      body.budget * 3 -
      body.comfort * 1.2 +
      body.eco * 3.2 -
      (body.distance >= 4 ? body.distance * 1.5 : body.distance * 0.8) +
      body.flexibility * 1.8;

    scores.push({
      name: "Fahrrad",
      score: bikeScore,
      explanation: this.fahrradExplanation(body),
    });

    // E-Scooter: moderate Kosten, wenig Komfort, relativ öko,
    //            NUR URBAN sinnvoll - wird ohne gute Verfügbarkeit bestraft
    //            Sehr flexibel in der Stadt
    const eScooterScore =
      body.budget * 1.8 -
      body.comfort * 0.3 +
      body.eco * 1.8 -
      (body.distance >= 3 ? body.distance * 2.5 : body.distance * 0.8) +
      body.flexibility * 2.2 +
      (body.availability >= 4 ? body.availability * 2.5 : body.availability * -2);

    scores.push({
      name: "E-Scooter",
      score: eScooterScore,
      explanation: this.escooterExplanation(body),
    });

    // Car Sharing: günstiger als eigenes Auto (~0.30€/km + Basis), Komfort eines Autos,
    //              moderat öko, mittlere Strecken, Führerschein erforderlich
    //              Guter Kompromiss zwischen Auto und Budget
    const carsharingScore = body.fuehrerschein
      ? body.budget * 2.3 +
        body.comfort * 1.8 -
        body.eco * 0.4 +
        body.distance * 1.8 +
        (6 - body.availability) * 1.3 +
        body.flexibility * 1.3
      : -100;

    scores.push({
      name: "Car Sharing",
      score: carsharingScore,
      explanation: this.carsharingExplanation(body),
    });

    // Uber: SEHR teuer (~2-3€/km), sehr komfortabel, kein Führerschein nötig,
    //        eher kurze Strecken, sehr flexibel
    //        MASSIV bestraft wenn Budget wichtig ist
    const uberScore =
      (6 - body.budget) * 2.5 +
      body.comfort * 2.8 -
      body.eco * 1.8 +
      (body.distance <= 2 ? body.distance * 1.2 : (body.distance <= 3 ? body.distance * 0.5 : -body.distance * 1.5)) +
      body.flexibility * 2.2 +
      body.availability * 0.3 +
      (!body.fuehrerschein ? 5 : 0);

    scores.push({
      name: "Uber",
      score: uberScore,
      explanation: this.uberExplanation(body),
    });

    scores.sort((a, b) => b.score - a.score);
    const best = scores[0]!;

    return {
      empfehlung: best.name,
      erklaerung: best.explanation,
    };
  }

  private static carExplanation(
    b: (typeof MobilityModel.InputUserBody)["static"]
  ): string {
    if (!b.fuehrerschein) {
      return "Das Auto wäre eine Option, erfordert aber einen Führerschein.";
    }
    const reasons: string[] = [];
    if (b.comfort >= 4) reasons.push("Ihr hoher Komfortanspruch");
    if (b.distance >= 4) reasons.push("die weite Strecke");
    if (b.availability <= 2) reasons.push("die schwache ÖPNV-Anbindung");
    if (b.flexibility >= 4) reasons.push("Ihr Wunsch nach zeitlicher Flexibilität");
    if (reasons.length > 0) {
      return `Das Auto ist Ihre beste Wahl – ${reasons.join(", ")} ${reasons.length === 1 ? "spricht" : "sprechen"} klar dafür. Es bietet maximalen Komfort und volle Unabhängigkeit, besonders auf längeren Strecken.`;
    }
    return "Das Auto bietet Ihnen die beste Kombination aus Komfort, Reichweite und Flexibilität für Ihre Anforderungen.";
  }

  private static oepnvExplanation(
    b: (typeof MobilityModel.InputUserBody)["static"]
  ): string {
    const reasons: string[] = [];
    if (b.availability >= 4) reasons.push("Ihre hervorragende ÖPNV-Anbindung");
    if (b.budget >= 4) reasons.push("Ihr Fokus auf niedrige Kosten");
    if (b.eco >= 4) reasons.push("Ihr Umweltbewusstsein");
    if (b.flexibility <= 2) reasons.push("Ihre Bereitschaft, sich an Fahrpläne anzupassen");
    if (reasons.length > 0) {
      return `Der ÖPNV ist Ihre ideale Lösung – ${reasons.join(", ")} ${reasons.length === 1 ? "macht" : "machen"} ihn zur perfekten Wahl. Günstig, nachhaltig und stressfrei.`;
    }
    return "Der öffentliche Nahverkehr bietet Ihnen den besten Kompromiss aus Kosten, Nachhaltigkeit und Komfort.";
  }

  private static fahrradExplanation(
    b: (typeof MobilityModel.InputUserBody)["static"]
  ): string {
    const reasons: string[] = [];
    if (b.distance <= 2) reasons.push("Ihre kurze Strecke");
    if (b.budget >= 4) reasons.push("Ihr Wunsch nach minimalen Kosten");
    if (b.eco >= 4) reasons.push("Ihr starkes Umweltbewusstsein");
    if (b.flexibility >= 4) reasons.push("Ihr Bedürfnis nach voller Flexibilität");
    if (reasons.length > 0) {
      return `Das Fahrrad passt perfekt zu Ihnen – ${reasons.join(", ")} ${reasons.length === 1 ? "spricht" : "sprechen"} eindeutig dafür. Extrem günstig, maximal nachhaltig und gut für die Gesundheit.`;
    }
    return "Das Fahrrad bietet Ihnen die beste Kombination aus Kostenersparnis, Nachhaltigkeit und Flexibilität auf kurzen Strecken.";
  }

  private static escooterExplanation(
    b: (typeof MobilityModel.InputUserBody)["static"]
  ): string {
    const reasons: string[] = [];
    if (b.distance <= 2) reasons.push("Ihre kurze Strecke");
    if (b.flexibility >= 4) reasons.push("Ihr Wunsch nach maximaler Flexibilität");
    if (b.eco >= 3) reasons.push("Ihr Umweltbewusstsein");
    if (b.availability >= 3) reasons.push("die gute urbane Infrastruktur");
    if (reasons.length > 0) {
      return `Der E-Scooter ist ideal für Sie – ${reasons.join(", ")} ${reasons.length === 1 ? "passt" : "passen"} hervorragend dazu. Schnell, flexibel und modern im Stadtverkehr.`;
    }
    return "Der E-Scooter bietet Ihnen eine schnelle, flexible und umweltfreundliche Lösung für kurze urbane Wege.";
  }

  private static carsharingExplanation(
    b: (typeof MobilityModel.InputUserBody)["static"]
  ): string {
    if (!b.fuehrerschein) {
      return "Car Sharing erfordert einen Führerschein und kommt daher für Sie nicht in Frage.";
    }
    const reasons: string[] = [];
    if (b.budget >= 3) reasons.push("Ihre Kostenbewusstheit");
    if (b.comfort >= 3) reasons.push("Ihr Komfortbedarf");
    if (b.distance >= 3) reasons.push("die mittlere bis weite Strecke");
    if (b.availability <= 3) reasons.push("die eingeschränkte ÖPNV-Anbindung");
    if (reasons.length > 0) {
      return `Car Sharing ist ideal für Sie – ${reasons.join(", ")} ${reasons.length === 1 ? "spricht" : "sprechen"} dafür. Die Flexibilität eines Autos ohne die Kosten eines eigenen Fahrzeugs.`;
    }
    return "Car Sharing bietet Ihnen die Vorteile eines Autos ohne die laufenden Kosten eines eigenen Fahrzeugs.";
  }

  private static uberExplanation(
    b: (typeof MobilityModel.InputUserBody)["static"]
  ): string {
    const reasons: string[] = [];
    if (b.comfort >= 4) reasons.push("Ihr hoher Komfortanspruch");
    if (b.flexibility >= 4) reasons.push("Ihr Wunsch nach Flexibilität");
    if (!b.fuehrerschein) reasons.push("da kein Führerschein benötigt wird");
    if (b.distance <= 3) reasons.push("die überschaubare Strecke");
    if (reasons.length > 0) {
      return `Uber ist die perfekte Lösung für Sie – ${reasons.join(", ")} ${reasons.length === 1 ? "spricht" : "sprechen"} dafür. Bequemer Tür-zu-Tür-Transport per App.`;
    }
    return "Uber bietet Ihnen komfortablen Tür-zu-Tür-Transport ohne eigenes Fahrzeug – flexibel und per App buchbar.";
  }
}
