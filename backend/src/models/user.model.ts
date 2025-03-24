import mongoose, { Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "../config/env.js";

interface UserObject extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  avatarPublicId?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  refreshToken: string;
  searchHistory: string[];
  isSearchHistorySaved: boolean;
  watchHistory: Schema.Types.ObjectId[];
  isWatchHistorySaved: boolean;
  savedPlaylists: Schema.Types.ObjectId[];
  createrMode: boolean;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already exists"],
      lowercase: true,
      trim: true,
      match: [
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        "Please enter a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [8, "Password length should be atleast 8 or greater"],
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
        "Password should contain alteast one uppercase, one lowercase, one digit and one special character (e.g. Pass@123)",
      ],
    },
    avatar: {
      type: String,
    },
    avatarPublicId: {
      type: String,
    },
    coverImage: {
      type: String,
    },
    coverImagePublicId: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    searchHistory: {
      type: [String],
      default: [],
    },
    isSearchHistorySaved: {
      type: Boolean,
      default: true,
    },
    watchHistory: {
      type: [Schema.Types.ObjectId],
      ref: "Video",
      default: [],
    },
    isWatchHistorySaved: {
      type: Boolean,
      default: true,
    },
    savedPlaylists: {
      type: [Schema.Types.ObjectId],
      ref: "Playlist",
    },
    createrMode: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre<UserObject>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password! = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.methods = {
  isPasswordCorrect: async function (this: UserObject, password: string) {
    return bcrypt.compare(password, this.password);
  },

  generateAccessToken: function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: ACCESS_TOKEN_EXPIRY,
      }
    );
  },

  generateRefreshToken: function () {
    return jwt.sign(
      {
        _id: this._id,
      },
      REFRESH_TOKEN_SECRET,
      {
        REFRESH_TOKEN_EXPIRY,
      }
    );
  },
};

export const User = mongoose.model<UserObject>("User", userSchema);
