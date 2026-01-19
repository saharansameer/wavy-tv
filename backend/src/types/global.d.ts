declare global {
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
