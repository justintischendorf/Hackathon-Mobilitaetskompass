import { MobilityModel } from "./model";

export abstract class ValidateService {
  static async validateData({
    body,
  }: {
    body: (typeof MobilityModel.InputUserBody)["static"];
  }) {
    let bestScore = -Infinity;
    let bestMatch = "";
    let explanation = "";

    const carScore =
      body.budget * 1.5 +
      body.comfort * 2 -
      body.eco * 2 +
      body.distance -
      body.availability +
      (6 - body.flexibility);

    if (carScore > bestScore) {
      bestScore = carScore;
      bestMatch = "Auto";
      explanation =
        "Aufgrund des gewünschten Komforts und der Distanz ist das Auto die beste Wahl, insbesondere wenn die Anbindung eher schwach ist.";
    }

    const ptvScore =
      6 -
      body.budget +
      body.eco * 1.5 +
      body.availability * 2 -
      (6 - body.flexibility) +
      body.distance * 0.5;

    if (ptvScore > bestScore) {
      bestScore = ptvScore;
      bestMatch = "ÖPNV";
      explanation =
        "Der öffentliche Nahverkehr bietet einen hervorragenden Kompromiss aus Nachhaltigkeit und Kosten, besonders da eine gute Anbindung vorliegt.";
    }

    const bikeScore =
      (6 - body.budget) * 2 -
      body.comfort +
      body.eco * 2.5 -
      body.distance * 2 +
      body.flexibility * 1.5;

    if (bikeScore > bestScore) {
      bestScore = bikeScore;
      bestMatch = "Jobrad";
      explanation =
        "Das Fahrrad ist unschlagbar günstig, extrem nachhaltig und bietet maximale Flexibilität auf kürzeren Strecken.";
    }

    const eScooterScore =
      6 -
      body.budget +
      body.comfort +
      body.eco * 1.5 -
      body.distance * 2 +
      body.flexibility +
      body.availability;

    if (eScooterScore > bestScore) {
      bestScore = eScooterScore;
      bestMatch = "E-Scooter";
      explanation =
        "Für kurze Distanzen in gut angebundenen Gebieten bietet der E-Scooter eine schnelle, flexible und relativ bequeme Lösung.";
    }

    return {
      empfehlung: bestMatch,
      erklaerung: explanation,
    };
  }
}
