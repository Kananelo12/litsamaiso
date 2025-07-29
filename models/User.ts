import { Schema, model, models, Document, Types } from "mongoose";
import Role, { IRole } from "./Role";
// Define a TypeScript interface for User documents
// Extending Document gives us Mongoose-specific fields like _id
export interface IUser extends Document {
  name: string;
  email: string;
  studentId: string;
  password: string;
  studentCardUrl: string;
  role: Types.ObjectId | IRole; // Reference to Role document
  createdAt: Date;
  updatedAt: Date;
}

// Create a Mongoose schema corresponding to the IUser interface
const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    studentCardUrl: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: Role, required: true },
  },
  { timestamps: true }
);

// If the model has already been compiled, use that; otherwise compile a new one
// This prevents errors in environments like Next.js where modules can be reloaded
const User = models.User || model<IUser>("User", UserSchema);
export default User;
