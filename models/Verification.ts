import { Schema, model, models, Document } from "mongoose";

export interface IVerification extends Document {
  fullnames?: string;
  contractNumber?: string;
  courseOfStudy?: string;
  bankName?: string;
  accountNumber?: string;
  confirmationDate?: string; // filled on confirmation
  studentId?: string; // filled on confirmation
  signature?: string; // optional digital signature
  status: "pending" | "correct" | "incorrect";
}

const VerificationSchema = new Schema<IVerification>(
  {
    fullnames: { type: String },
    contractNumber: { type: String, unique: true },
    courseOfStudy: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    confirmationDate: { type: String },
    studentId: { type: String },
    signature: { type: String },
    status: {
      type: String,
      enum: ["pending", "correct", "incorrect"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Verification =
  models.Verification ||
  model<IVerification>("Verification", VerificationSchema);

export default Verification;
