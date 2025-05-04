declare global {
  interface TokenPayload {
    accessToken: string;
    refreshToken: string;
  }

  type FolderType = "videos" | "thumbnails" | "avatars" | "coverImages";

  type ImageType = "avatar" | "coverImage";
}

export {};
