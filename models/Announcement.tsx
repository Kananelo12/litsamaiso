import { Schema, model, models, Document, Types } from "mongoose";
import { IUser } from "./User";

// Define interface for Announcement document
export interface IAnnouncement extends Document {
  title: string;
  content: string;
  date: Date;
  postedBy: Types.ObjectId | IUser;
  header: string;
  likes: Types.ObjectId[];
  comments: Array<{
    user: Types.ObjectId | IUser;
    text: string;
    date: Date;
    replies: Array<{
      user: Types.ObjectId | IUser;
      text: string;
      date: Date;
    }>;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Create schema
const AnnouncementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    header: { type: String, required: true },
    date: {
      type: Date,
      default: Date.now,
      validate: {
        validator: function (value: Date) {
          return value >= new Date(new Date().setHours(0, 0, 0, 0)); // today or future
        },
        message: "Date cannot be in the past.",
      },
    },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        text: { type: String, required: true },
        date: { type: Date, default: Date.now },
        replies: [
          {
            user: { type: Schema.Types.ObjectId, ref: "User", required: true },
            text: { type: String, required: true },
            date: { type: Date, default: Date.now },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

const Announcement = models.Announcement || model<IAnnouncement>("Announcement", AnnouncementSchema);
export default Announcement;