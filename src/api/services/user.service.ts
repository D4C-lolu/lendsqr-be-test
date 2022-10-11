import argon2 from "argon2";
import { Knex } from "knex";
import { CreateUserInput } from "../schemas/user.schema";
import { db } from "../utils";
import { omit } from "lodash";

export class UserService {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async createUser(user: CreateUserInput["body"]) {
    const { name, email, password } = user;
    try {
      const hash = await this.hashPassword(password);
      const [user] = await this.knex("users")
        .insert({ name, email, password: hash })
        .returning("*");

      return JSON.stringify(omit(user, "password"));
    } catch (err: any) {
      throw new Error(err);
    }
  }

  async verifyUser({ email, password }: { email: string; password: string }) {
    const user = await this.knex("users").where({ email }).first();

    if (!user) {
      return false;
    }

    const isValid = await this.comparePassword(password, user.password);

    if (!isValid) {
      return false;
    }

    return omit(user, "password");
  }

  async findUser(query: object) {
    const user = await this.knex("users").where(query).first();
    return user;
  }

  async hashPassword(password: string) {
    const hash = await argon2.hash(password);
    return hash;
  }

  async comparePassword(password: string, hash: string) {
    const isVerified = await argon2.verify(hash, password);
    return isVerified;
  }
}

export default new UserService(db);
