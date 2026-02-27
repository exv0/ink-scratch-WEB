// backend/src/models/user.model.ts

import mongoose, { Document, Schema } from "mongoose";

// ── Library entry (embedded in user document) ─────────────────────────────────
const LibraryEntrySchema = new Schema({
  mangaId:    { type: String, required: true },
  title:      { type: String, required: true },
  author:     { type: String, default: "" },
  coverImage: { type: String, default: "" },
  status:     { type: String, default: "" },
  genre:      { type: [String], default: [] },
  rating:     { type: Number, default: 0 },
  year:       { type: Number },
  description:{ type: String, default: "" },
  addedAt:    { type: Date, default: Date.now },
}, { _id: false });

const UserSchema: Schema = new Schema(
  {
    email:          { type: String, required: true, unique: true },
    password:       { type: String, required: true },
    username:       { type: String, required: true, unique: true },
    fullName:       { type: String },
    phoneNumber:    { type: String },
    gender:         { type: String, enum: ["male", "female", "other"] },
    profilePicture: { type: String },
    bio:            { type: String, maxLength: 160 },
    role:           { type: String, enum: ["user", "admin"], default: "user" },
    theme:          { type: String, enum: ["light", "dark", "system"], default: "system" },
    // ✅ Library — array of saved manga
    library:        { type: [LibraryEntrySchema], default: [] },
    // Password reset
    resetPasswordToken:   { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export interface ILibraryEntry {
  mangaId:     string;
  title:       string;
  author:      string;
  coverImage?: string;
  status:      string;
  genre:       string[];
  rating:      number;
  year?:       number;
  description?: string;
  addedAt:     Date;
}

export interface IUser extends Document {
  _id:              mongoose.Types.ObjectId;
  email:            string;
  password:         string;
  username:         string;
  fullName?:        string;
  phoneNumber?:     string;
  gender:           "male" | "female" | "other";
  profilePicture?:  string;
  bio?:             string;
  role:             "user" | "admin";
  theme:            "light" | "dark" | "system";
  library:          ILibraryEntry[];
  resetPasswordToken?:   string;
  resetPasswordExpires?: Date;
  createdAt:        Date;
  updatedAt:        Date;
}

export const UserModel = mongoose.model<IUser>("User", UserSchema);