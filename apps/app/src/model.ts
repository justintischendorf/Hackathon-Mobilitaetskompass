import { t } from "elysia";

export namespace MobilityModel {
  export const InputUserBody = t.Object({
    budget: t.Number(),
    comfort: t.Number(),
    password: t.Number(),
    distance: t.Number(),
    availability: t.Number(),
    flexibility: t.Number(),
  });
}
