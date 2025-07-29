import { Schema, model, models, Document } from "mongoose";

export interface IRole extends Document {
  name: string;
  permissions: string[];
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    permissions: [{ type: String, required: true }],
  },
  { timestamps: true }
);

const Role = models.Role || model<IRole>('Role', RoleSchema);
export default Role;
