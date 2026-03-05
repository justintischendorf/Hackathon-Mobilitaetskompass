# Request Flow – Mobilitätskompass

## Architektur-Übersicht

```
┌──────────────┐   POST /api/analyse   ┌──────────────┐    GET key    ┌──────────┐
│   Angular    │ ────────────────────►  │    Elysia    │ ───────────► │  Redis   │
│   Client     │  { budget, comfort,   │   REST API   │              │  Cache   │
│  (Port 4200) │    eco, distance,     │  (Bun:3000)  │ ◄─────────── │ (:6379)  │
│              │    availability,      │              │  cached result│          │
│              │    flexibility }      │              │    or null   │          │
└──────┬───────┘                       └──────┬───────┘              └──────────┘
       ▲                                      │
       │                                 ┌────▼──────┐
       │                                 │ Cache HIT?│
       │                                 └────┬──────┘
       │                                      │
       │                            ┌─────────┴─────────┐
       │                            │                   │
       │                       JA:  │              NEIN: │
       │                    Return  │           Compute  │
       │                    cached  │           Scoring  │
       │                            │                    │
       │                            │           Store in │
       │                            │           Redis    │
       │                            │           (TTL 24h)│
       │                            │                    │
       │                            └─────────┬──────────┘
       │                                      │
       └──────────────────────────────────────┘
                   JSON Response
            { empfehlung, erklaerung }
```

## Ablauf Schritt für Schritt

### 1. Client → API

Der Angular-Client sendet einen `POST /api/analyse` Request mit den 6 Bewertungen (jeweils 1–5):

| Feld           | Bedeutung                        | Skala                         |
|----------------|----------------------------------|-------------------------------|
| `budget`       | Wie wichtig ist niedriger Preis? | 1 = Preis egal → 5 = Sehr preisbewusst |
| `comfort`      | Wie wichtig ist Bequemlichkeit?  | 1 = Spartanisch → 5 = Max. Komfort     |
| `eco`          | Wie wichtig ist Nachhaltigkeit?  | 1 = Nebensächlich → 5 = Höchste Prio   |
| `distance`     | Wie weit ist der Arbeitsweg?     | 1 = Sehr kurz → 5 = Sehr weit          |
| `availability` | Wie gut ist die ÖPNV-Anbindung?  | 1 = Keine → 5 = Hervorragend           |
| `flexibility`  | Wie wichtig ist Unabhängigkeit?  | 1 = Feste Zeiten ok → 5 = Volle Flex.  |

### 2. API – Validierung

Elysia prüft, ob alle Werte zwischen 1 und 5 liegen. Bei Fehler → `400 Bad Request`.

### 3. API → Redis – Cache Check

Cache-Key: `mobility:{budget}:{comfort}:{eco}:{distance}:{availability}:{flexibility}`

Beispiel: `mobility:5:2:4:1:3:5`

- **Cache HIT** → Ergebnis sofort zurückgeben (keine Berechnung)
- **Cache MISS** → Weiter zu Schritt 4

### 4. API – Scoring-Berechnung

Für jede Mobilitätsoption wird ein gewichteter Score berechnet:

- **Auto**: Profitiert von hohem Komfort, weiter Distanz, schlechter ÖPNV-Anbindung
- **ÖPNV**: Profitiert von guter Anbindung, Preisbewusstsein, Eco-Fokus
- **Jobrad**: Profitiert von kurzer Distanz, Preisbewusstsein, Eco-Fokus, Flexibilität
- **E-Scooter**: Profitiert von kurzer Distanz, Flexibilität, urbanem Umfeld

Die Option mit dem höchsten Score gewinnt.

### 5. API → Redis – Cache Write

Das Ergebnis wird mit 24h TTL in Redis gespeichert (5⁶ = 15.625 mögliche Kombinationen).

### 6. API → Client – Response

```json
{
  "empfehlung": "Jobrad",
  "erklaerung": "Das Jobrad passt perfekt zu Ihnen – Ihre kurze Strecke und Ihr starkes Umweltbewusstsein sprechen eindeutig dafür."
}
```

### 7. Client – Darstellung

Die Ergebnis-Komponente zeigt Icon + Empfehlung + Erklärungstext an.

## Graceful Degradation

Falls Redis nicht erreichbar ist, rechnet die API ganz normal weiter – nur ohne Cache. Kein Ausfall, keine Fehlermeldung an den Benutzer.

## UML-Diagramm

Das PlantUML-Sequenzdiagramm befindet sich in [`request-flow.puml`](request-flow.puml) und kann z.B. auf [plantuml.com](https://www.plantuml.com/plantuml/uml/) gerendert werden.
