declare global {
  var _mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type Any = any;

  interface TokenPayload {
    accessToken: string;
    refreshToken: string;
  }

  type FolderType = "videos" | "thumbnails" | "avatars" | "coverImages";

  type ImageType = "avatar" | "coverImage";
}

export {};
