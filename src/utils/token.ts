import jwt from "jsonwebtoken";
import { 
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    ACCESS_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_EXPIRES_IN
} from "../env.js";

type JwtPayload = { sub?: string; [key: string]: any };

if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT_SECRET and JWT_REFRESH_SECRET must be set");
}

export const generateAccessToken = (
    payload: object,
    expiresIn?: jwt.SignOptions['expiresIn']
): string => {
    expiresIn = expiresIn ?? (ACCESS_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']) ?? "1h";
    return jwt.sign(payload, JWT_SECRET as jwt.Secret, { expiresIn });
};

export const generateRefreshToken = (
    payload: object,
    expiresIn?: jwt.SignOptions['expiresIn']
): string => {
    expiresIn = expiresIn ?? (REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions['expiresIn']) ?? "7d";
    return jwt.sign(payload, JWT_REFRESH_SECRET as jwt.Secret, { expiresIn });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_SECRET as jwt.Secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, JWT_REFRESH_SECRET as jwt.Secret) as JwtPayload;
};