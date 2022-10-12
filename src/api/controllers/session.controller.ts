import {
  findSession,
  createSession,
  updateSession,
} from "../services/session.service";
import { Request, Response } from "express";
import { verifyUser } from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import { signJWT } from "../utils/jwt.utils";
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "../../config/constants";
import { CreateSessionInput } from "../schemas/session.schema";

class SessionController {
  async getUserSession(req: Request, res: Response) {
    const userId = res.locals.user.user_id;
    const session = findSession({ userId, valid: true });
    return res.json(session);
  }

  async createUserSession(
    req: Request<{}, {}, CreateSessionInput["body"]>,
    res: Response
  ) {
    //validate user's password
    const user = await verifyUser(req.body);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("Invalid username or password");
    }
    //create a session
    const session = await createSession(
      user.user_id,
      req.get("user-agent") || ""
    );
    //create an access token
    const accessToken = signJWT(
      { ...user, session_id: session },
      { expiresIn: ACCESS_TOKEN_TTL } // 15 minutes
    );

    //create a refresh token
    const refreshToken = signJWT(
      { session_id: session },
      { expiresIn: REFRESH_TOKEN_TTL } // 1 year
    );

    //return access and refresh tokens

    return res.send({ accessToken, refreshToken });
  }

  async deleteUserSession(res: Response, req: Request) {
    const sessionId = res.locals.user.session_id;

    await updateSession({ session_id: sessionId }, { valid: false });

    return res.send({
      accessToken: null,
      refreshToken: null,
    });
  }
}

export default new SessionController();
