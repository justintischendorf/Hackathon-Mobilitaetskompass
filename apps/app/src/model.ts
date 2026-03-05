import { t } from "elysia";

export namespace MobilityModel {
  export const InputUserBody = t.Object({
    budget: t.Number(),
    comfort: t.Number(),
    eco: t.Number(),
    distance: t.Number(),
    availability: t.Number(),
    flexibility: t.Number(),
  });
}
