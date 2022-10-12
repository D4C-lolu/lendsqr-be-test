import { get } from "lodash";
import { ACCESS_TOKEN_TTL } from "../../config/constants";
import { Session } from "../models/session.model";
import { db } from "../utils";
import { signJWT, verifyJWT } from "../utils/jwt.utils";
import { findUser } from "./user.service";

//create new session record
export async function createSession(userId: number, userAgent: string) {
  const session_id = await db<Session>("sessions").insert({
    session_user: userId,
    user_agent: userAgent,
  });
  //   .returning("*")
  //   .then((result) => result[0]);

  return session_id;
}

//Get user session
export async function findSession({
  userId,
  valid,
}: {
  userId: number;
  valid: boolean;
}) {
  const session_id = await db("sessions").where({
    user_id: userId,
    valid,
  });
  const session = await db("sessions").where({ session_id }).first();
  return session;
}

export async function updateSession(query: object, update: object) {
  const session_id = await db("sessions").where(query).update(update);
  return session_id;
}

//create new access token if refresh token is valid
export async function reIssueAccessToken({
  refreshToken,
}: {
  refreshToken: string;
}) {
  const { decoded } = verifyJWT(refreshToken);
  if (!decoded || !get(decoded, "session_id")) {
    return false;
  }
  const session = await db("sessions")
    .where({ session_id: get(decoded, "session_id") })
    .first();

  if (!session || !session.valid) {
    return false;
  }
  const user = await findUser({ user_id: session.session_user });
  if (!user) return false;

  const accessToken = signJWT(
    { ...user, session_id: session },
    { expiresIn: ACCESS_TOKEN_TTL } // 15 minutes
  );

  return accessToken;
}
