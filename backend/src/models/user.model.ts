import mongoose, { AggregatePaginateModel, Document, Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY,
} from "../config/env.js";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { PublishStatus, Category } from "./video.model.js";

interface Social {
  socialName: string;
  socialHandle: string;
  socialLink: string;
}

interface LastModified {
  fullName?: Date;
  username?: Date;
  email?: Date;
  password?: Date;
  about?: Date;
  avatar?: Date;
  coverImage?: Date;
}

enum ThemeType {
  LIGHT = "light",
  DARK = "dark",
  SYSTEM = "system",
}

enum NsfwType {
  SHOW = "SHOW",
  HIDE = "HIDE",
  BLUR = "BLUR",
}

interface UserPreferences {
  theme: ThemeType;
  nsfwContent: NsfwType;
  publishStatus: PublishStatus;
  category: Category;
  saveSearchHistory: boolean;
  saveWatchHistory: boolean;
}

interface UserDocument extends Document {
  fullName: string;
  username: string;
  email: string;
  password: string;
  about: string;
  socials: Social[];
  avatar?: string;
  avatarPublicId?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  refreshToken: string;
  searchHistory: string[];
  savedPlaylists: Schema.Types.ObjectId[];
  watchLater: Schema.Types.ObjectId;
  favourites: Schema.Types.ObjectId;
  creatorMode: boolean;
  nsfwProfile: boolean;
  tags: string[];
  lastModified: LastModified;
  preferences: UserPreferences;
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const socialSubSchema = new Schema({
  socialName: {
    type: String,
    required: true,
  },
  socialHandle: {
    type: String,
    required: true,
  },
  socialLink: {
    type: String,
    required: true,
  },
});

const lastModifiedSubSchema = new Schema({
  fullName: Date,
  username: Date,
  email: Date,
  password: Date,
  about: Date,
  avatar: Date,
  coverImage: Date,
});

const preferenceSubSchema = new Schema({
  theme: {
    type: String,
    enum: Object.values(ThemeType),
  },
  nsfwContent: {
    type: String,
    enum: Object.values(NsfwType),
  },
  publishStatus: {
    type: String,
    enum: Object.values(PublishStatus),
  },
  category: {
    type: String,
    enum: Object.values(Category),
  },
  saveSearchHistory: {
    type: Boolean,
  },
  saveWatchHistory: {
    type: Boolean,
  },
});

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full Name is required"],
      index: true,
      minlength: [1, "Full Name can not be empty"],
      maxlength: [20, "Full Name should not exceed 20 characters"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: [true, "Username already exists"],
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[a-zA-Z0-9]+$/,
        "Special characters (e.g. !@#$%^&*()_-=+) are not allowed in username",
      ],
      minlength: [3, "Username should be at least 3 characters long"],
      maxlength: [20, "Username should not exceed 20 characters"],
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
      maxlength: [128, "Password should not exceed 128 characters"],
      match: [
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
        "Password should contain alteast one uppercase, one lowercase, one digit and one special character (e.g. Pass@123)",
      ],
    },
    about: {
      type: String,
      default: "",
      maxlength: [200, "User About should not exceed 200 characters"],
    },
    socials: {
      type: [socialSubSchema],
      default: [],
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
    savedPlaylists: {
      type: [Schema.Types.ObjectId],
      ref: "Playlist",
    },
    watchLater: {
      type: Schema.Types.ObjectId,
      ref: "Playlist",
    },
    favourites: {
      type: Schema.Types.ObjectId,
      ref: "Playlist",
    },
    creatorMode: {
      type: Boolean,
      default: true,
    },
    nsfwProfile: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      index: true,
    },
    lastModified: {
      type: lastModifiedSubSchema,
      default: {
        fullName: null,
        username: null,
        email: null,
        password: null,
        about: null,
        avatar: null,
        coverImage: null,
      },
    },
    preferences: {
      type: preferenceSubSchema,
      default: {
        theme: ThemeType.SYSTEM,
        nsfwContent: NsfwType.BLUR,
        publishStatus: PublishStatus.PUBLIC,
        category: Category.GENERAL,
        saveSearchHistory: true,
        saveWatchHistory: true,
      },
    },
  },
  { timestamps: true }
);

userSchema.pre<UserDocument>("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password! = await bcrypt.hash(this.password, 10);
  return next();
});

userSchema.pre<UserDocument>("save", function (next) {
  this.tags = [this.fullName, this.username];
  return next();
});

userSchema.pre<UserDocument>("save", function (next) {
  const now = new Date();

  this.lastModified.username = now;
  this.lastModified.fullName = now;
  this.lastModified.email = now;
  this.lastModified.password = now;

  return next();
});

userSchema.methods = {
  isPasswordCorrect: async function (this: UserDocument, password: string) {
    return bcrypt.compare(password, this.password);
  },

  generateAccessToken: function () {
    return jwt.sign(
      {
        _id: this._id,
        preferences: {
          theme: this.preferences.theme,
          nsfwContent: this.preferences.nsfwContent,
        },
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
        preferences: {
          theme: this.preferences.theme,
          nsfwContent: this.preferences.nsfwContent,
        },
      },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: REFRESH_TOKEN_EXPIRY,
      }
    );
  },
};

// Enable full-text search on the user fullname
userSchema.index({ fullName: "text", username: "text", tags: "text" });

// Aggregate Paginate v2
userSchema.plugin(mongooseAggregatePaginate);

export const User = mongoose.model<
  UserDocument,
  AggregatePaginateModel<UserDocument>
>("User", userSchema);
