declare module "jsonwebtoken";

declare global {
  interface TokenPayload {
    accessToken: string;
    refreshToken: string;
  }
}

export {};
