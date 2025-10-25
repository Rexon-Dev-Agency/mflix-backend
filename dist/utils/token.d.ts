import jwt from "jsonwebtoken";
type JwtPayload = {
    sub?: string;
    [key: string]: any;
};
export declare const generateAccessToken: (payload: object, expiresIn?: jwt.SignOptions["expiresIn"]) => string;
export declare const generateRefreshToken: (payload: object, expiresIn?: jwt.SignOptions["expiresIn"]) => string;
export declare const verifyAccessToken: (token: string) => JwtPayload;
export declare const verifyRefreshToken: (token: string) => JwtPayload;
export {};
//# sourceMappingURL=token.d.ts.map