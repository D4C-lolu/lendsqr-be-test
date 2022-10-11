import sessionService, { SessionService } from "../services/session.service";
import { Request, Response } from "express";
import userService, { UserService } from "../services/user.service";
import { StatusCodes } from "http-status-codes";
import { signJWT } from "../utils/jwt.utils";
import { ACCESS_TOKEN_TTL, REFRESH_TOKEN_TTL } from "../../config/constants";

class SessionController {
  sessionService: SessionService;
  userService: UserService;

  constructor(sessionService: SessionService, userService: UserService) {
    this.sessionService = sessionService;
    this.userService = userService;
  }

  async getUserSession(req: Request, res: Response) {
    const userId = res.locals.user.user_id;
    const sessions = await sessionService.findSession({ userId, valid: true });
    return res.json(sessions);
  }

  async createUserSession(req: Request, res: Response) {
    //validate user's password
    const user = await this.userService.verifyUser(req.body);
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .send("Invalid username or password");
    }
    //create a session
    const session = await this.sessionService.createSession(
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

    await this.sessionService.updateSession(
      { session_id: sessionId },
      { valid: false }
    );

    return res.send({
      accessToken: null,
      refreshToken: null,
    });
    //delete session
    //delete refresh token
  }
}

export default new SessionController(sessionService, userService);
