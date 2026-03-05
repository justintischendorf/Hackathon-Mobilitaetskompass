import { Elysia } from "elysia";
import { MobilityModel } from "./model";
import { MobilityService } from "./service";

const app = new Elysia({ prefix: "/api" })

  .post(
    "/analyse",
    async ({ set, body }) => {
      try {
        set.status = 200;
        return await MobilityService.validateData({ body });
      } catch (e) {
        set.status = 500;
        return { error: "Something went wrong. Please try later again." };
      }
    },
    {
      body: MobilityModel.InputUserBody,
    },
  )

  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
