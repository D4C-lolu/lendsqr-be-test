import { Knex } from "knex";
import { get } from "lodash";
import { ACCESS_TOKEN_TTL } from "../../config/constants";
import { Session } from "../models/session.model";
import { db } from "../utils";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import userService from "./user.service";

export class SessionService {
  knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  async createSession(userId: number, userAgent: string) {
    const [session_id] = await this.knex<Session>("session").insert({
      session_user: userId,
      user_agent: userAgent,
    });
    //   .returning("*")
    //   .then((result) => result[0]);

    return session_id;
  }

  async findSession({ userId, valid }: { userId: number; valid: boolean }) {
    const sessions = await this.knex("session").where({
      user_id: userId,
      valid,
    });
    return sessions;
  }

  async updateSession(query: object, update: object) {
    const sessions = await this.knex("session").where(query).update(update);
    return sessions;
  }

  async reIssueAccessToken({ refreshToken }: { refreshToken: string }) {
    const { decoded } = verifyJWT(refreshToken);
    if (!decoded || !get(decoded, "session_id")) {
      return false;
    }
    const session = await this.knex("session")
      .where({ session_id: get(decoded, "session_id") })
      .first();

    if (!session || !session.valid) {
      return false;
    }
    const user = await userService.findUser({ user_id: session.session_user });
    if (!user) return false;

    const accessToken = signJWT(
      { ...user, session_id: session },
      { expiresIn: ACCESS_TOKEN_TTL } // 15 minutes
    );

    return accessToken;
  }
}

export default new SessionService(db);
