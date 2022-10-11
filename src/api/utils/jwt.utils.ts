import jwt from "jsonwebtoken";
import { PUBLIC_KEY, PRIVATE_KEY } from "../../config/constants";

export function signJWT(
  payload: Object,
  options?: jwt.SignOptions | undefined
) {
  return jwt.sign(payload, PRIVATE_KEY, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJWT(token: string) {
  try {
    const decoded = jwt.verify(token, PUBLIC_KEY);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (err: any) {
    return {
      valid: false,
      expired: err.message === "jwt expired",
      decoded: null,
    };
  }
}
