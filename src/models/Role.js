import { Schema, model } from 'mongoose';

export const Role = ['user', 'administrator'];

const roleSchema = new Schema(
  {
    name: String
  },
  {
    versionKey: false
  }
);

export default model('Role', roleSchema);
