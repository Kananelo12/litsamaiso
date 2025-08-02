import { Schema, model, models, Document } from "mongoose";

export interface IAccountList extends Document {
  fullnames?: string;
  contractNumber?: string;
  courseOfStudy?: string;
  bankName?: string;
  accountNumber?: string;
  confirmationDate?: string; // filled on confirmation
  studentId?: string; // filled on confirmation
  signature?: string; // optional digital signature
  status: "pending" | "confirmed" | "erroneous";
}

const AccountListSchema = new Schema<IAccountList>(
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
      enum: ["pending", "confirmed", "erroneous"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const AccountList =
  models.AccountList ||
  model<IAccountList>("AccountList", AccountListSchema);

export default AccountList;
