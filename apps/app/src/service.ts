import { MobilityModel } from "./model";

export abstract class MobilityService {
  static async validateData({
    body,
  }: {
    body: (typeof MobilityModel.InputUserBody)["static"];
  }) {
    // test
  }
}
