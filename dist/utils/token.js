import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_REFRESH_SECRET, ACCESS_TOKEN_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN } from "../env.js";
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be set");
}
export const generateAccessToken = (payload, expiresIn) => {
    expiresIn = expiresIn ?? ACCESS_TOKEN_EXPIRES_IN ?? "1h";
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
};
export const generateRefreshToken = (payload, expiresIn) => {
    expiresIn = expiresIn ?? REFRESH_TOKEN_EXPIRES_IN ?? "7d";
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, JWT_REFRESH_SECRET);
};
//# sourceMappingURL=token.js.map