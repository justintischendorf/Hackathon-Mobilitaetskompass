import { Elysia } from "elysia";
import { MobilityModel } from "./model";
import { ValidateService } from "./service";

const app = new Elysia({ prefix: "/api" })

  .post(
    "/analyse",
    async ({ set, body }) => {
      try {
        if (!body) {
          set.status = 400;
          return { error: "Missing request body." };
        }
        if (
          body.budget < 1 ||
          body.budget > 5 ||
          body.comfort < 1 ||
          body.comfort > 5 ||
          body.eco < 1 ||
          body.eco > 5 ||
          body.distance < 1 ||
          body.distance > 5 ||
          body.availability < 1 ||
          body.availability > 5 ||
          body.flexibility < 1 ||
          body.flexibility > 5
        ) {
          set.status = 400;
          return { error: "All values must be between 1 and 5." };
        }
        console.log("Received input:", body);
        set.status = 200;
        return await ValidateService.validateData({ body });
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
