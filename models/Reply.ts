import { Schema, model, models } from "mongoose";

const replySchema = new Schema({
  text: { type: String, required: true },
  repliedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  announcement: { type: Schema.Types.ObjectId, ref: "Announcement", required: true },
  date: { type: Date, default: Date.now },
});

const Reply = models.Reply || model("Reply", replySchema);
export default Reply;