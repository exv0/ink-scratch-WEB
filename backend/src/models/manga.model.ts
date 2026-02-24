import mongoose, { Document, Schema } from "mongoose";

export interface IChapterPage {
  index: number;
  imageUrl: string;
}

export interface IChapter extends Document {
  mangaId: mongoose.Types.ObjectId;
  chapterNumber: number;
  title?: string;
  pages: IChapterPage[];
  source: string;
  sourceId: string;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IManga extends Document {
  title: string;
  alternativeTitles: string[];
  author: string;
  artist: string;
  description: string;
  genre: string[];
  status: "Ongoing" | "Completed" | "Hiatus" | "Cancelled";
  coverImage: string;
  rating: number;
  year?: number;
  source: string;
  sourceId: string;
  totalChapters: number;
  lastImportedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterPageSchema = new Schema<IChapterPage>(
  {
    index:    { type: Number, required: true },
    imageUrl: { type: String, required: true },
  },
  { _id: false }
);

const ChapterSchema = new Schema<IChapter>(
  {
    mangaId:       { type: Schema.Types.ObjectId, ref: "Manga", required: true, index: true },
    chapterNumber: { type: Number, required: true },
    title:         { type: String },
    pages:         { type: [ChapterPageSchema], default: [] },
    source:        { type: String, required: true, default: "mangadex" },
    sourceId:      { type: String, required: true, unique: true },
    publishedAt:   { type: Date },
  },
  { timestamps: true }
);

const MangaSchema = new Schema<IManga>(
  {
    title:             { type: String, required: true, index: true },
    alternativeTitles: { type: [String], default: [] },
    author:            { type: String, default: "Unknown" },
    artist:            { type: String, default: "Unknown" },
    description:       { type: String, default: "" },
    genre:             { type: [String], default: [] },
    status:            { type: String, enum: ["Ongoing", "Completed", "Hiatus", "Cancelled"], default: "Ongoing" },
    coverImage:        { type: String, default: "" },
    rating:            { type: Number, default: 0, min: 0, max: 10 },
    year:              { type: Number },
    source:            { type: String, required: true, default: "mangadex" },
    sourceId:          { type: String, required: true, unique: true },
    totalChapters:     { type: Number, default: 0 },
    lastImportedAt:    { type: Date },
  },
  { timestamps: true }
);

export const MangaModel   = mongoose.model<IManga>("Manga", MangaSchema);
export const ChapterModel = mongoose.model<IChapter>("Chapter", ChapterSchema);