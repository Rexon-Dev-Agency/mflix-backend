export declare const saveRefreshTokenRecord: (userId: string, hash: string, expiresAt?: number) => Promise<void>;
export declare const findRefreshTokenRecord: (hash: string) => Promise<{
    userId: string;
    hash: string;
    revoked: boolean;
    createdAt: number;
    expiresAt?: number | undefined;
    id: string;
} | null>;
export declare const revokeRefreshTokenRecord: (id: string) => Promise<void>;
export declare const revokeAllUserTokens: (userId: string) => Promise<void>;
//# sourceMappingURL=refreshTokenService.d.ts.map