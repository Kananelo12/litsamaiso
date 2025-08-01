import {Schema, model, models, Document } from "mongoose";


export interface IConfirmation extends Document {
    studentId: string;
    bankName: string;
    accountNumber: string;
}

const ConfirmationSchema = new Schema<IConfirmation>(
  {
    studentId: { type: String, required: true, unique: true },
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
  },
  { timestamps: true }
);

const Confirmation = models.Confirmation || model<IConfirmation>('Confirmation', ConfirmationSchema);
export default Confirmation;