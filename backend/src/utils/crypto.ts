import crypto from "crypto";

export const generatePublicId = () => {
  return crypto.randomBytes(8).toString("base64url");
};
