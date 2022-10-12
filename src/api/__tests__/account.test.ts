import supertest from "supertest";
import { createServer } from "../utils";
import { connectToDatabase } from ".";

const app = createServer();

describe("account", () => {
  describe("get account details route", () => {
    describe("given is not logged in", () => {
      it("should return a 401", async () => {
        expect(true).toBe(true);
        await connectToDatabase();
        await supertest(app).get("/api/v1/accounts/details").expect(401);
      });
    });
  });
});
