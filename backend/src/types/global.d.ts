declare global {
  interface TokenPayload {
    accessToken: string;
    refreshToken: string;
  }
}

export {};
