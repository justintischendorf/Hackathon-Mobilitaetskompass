import { MobilityModel } from "./model";

export abstract class ValidateService {
  static async validateData({
    body,
  }: {
    body: (typeof MobilityModel.InputUserBody)["static"];
  }) {
    // Frontend-Skala (1-5):
    // budget:       1 = Preis egal,          5 = Sehr preisbewusst
    // comfort:      1 = Spartanisch,         5 = Maximaler Komfort
    // eco:          1 = Nebensächlich,        5 = Höchste Priorität
    // distance:     1 = Sehr kurz (<2km),    5 = Sehr weit (>30km)
    // availability: 1 = Keine ÖPNV-Anbindung, 5 = Hervorragend
    // flexibility:  1 = Feste Zeiten ok,     5 = Volle Flexibilität

    const scores: { name: string; score: number; explanation: string }[] = [];

    // Auto: teuer, komfortabel, nicht öko, ideal für weite Strecken,
    //       wichtig bei schlechter ÖPNV-Anbindung, flexibel
    const carScore =
      (6 - body.budget) * 2 +
      body.comfort * 2.5 -
      body.eco * 2 +
      body.distance * 2 +
      (6 - body.availability) * 1.5 +
      body.flexibility * 1;

    scores.push({
      name: "Auto",
      score: carScore,
      explanation: this.carExplanation(body),
    });

    // ÖPNV: günstig, moderat komfortabel, öko, braucht gute Anbindung,
    //        nicht flexibel (Fahrplan-gebunden)
    const ptvScore =
      body.budget * 1.5 +
      body.comfort * 0.5 +
      body.eco * 2 +
      body.distance * 0.5 +
      body.availability * 3 -
      body.flexibility * 1.5;

    scores.push({
      name: "ÖPNV",
      score: ptvScore,
      explanation: this.oepnvExplanation(body),
    });

    // Jobrad: sehr günstig, wenig Komfort (körperliche Anstrengung),
    //         am nachhaltigsten, nur kurze Strecken, sehr flexibel
    const bikeScore =
      body.budget * 2.5 -
      body.comfort * 1.5 +
      body.eco * 2.5 -
      body.distance * 3 +
      body.flexibility * 1.5;

    scores.push({
      name: "Jobrad",
      score: bikeScore,
      explanation: this.jobradExplanation(body),
    });

    // E-Scooter: moderate Kosten, wenig Komfort, relativ öko,
    //            nur kurze Strecken, sehr flexibel, urban
    const eScooterScore =
      body.budget * 1 -
      body.comfort * 0.5 +
      body.eco * 1.5 -
      body.distance * 3 +
      body.flexibility * 2 +
      body.availability * 0.5;

    scores.push({
      name: "E-Scooter",
      score: eScooterScore,
      explanation: this.escooterExplanation(body),
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

  private static jobradExplanation(
    b: (typeof MobilityModel.InputUserBody)["static"]
  ): string {
    const reasons: string[] = [];
    if (b.distance <= 2) reasons.push("Ihre kurze Strecke");
    if (b.budget >= 4) reasons.push("Ihr Wunsch nach minimalen Kosten");
    if (b.eco >= 4) reasons.push("Ihr starkes Umweltbewusstsein");
    if (b.flexibility >= 4) reasons.push("Ihr Bedürfnis nach voller Flexibilität");
    if (reasons.length > 0) {
      return `Das Jobrad passt perfekt zu Ihnen – ${reasons.join(", ")} ${reasons.length === 1 ? "spricht" : "sprechen"} eindeutig dafür. Extrem günstig, maximal nachhaltig und gut für die Gesundheit.`;
    }
    return "Das Jobrad bietet Ihnen die beste Kombination aus Kostenersparnis, Nachhaltigkeit und Flexibilität auf kurzen Strecken.";
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
}
