import { Schema, model } from 'mongoose';

const resetPasswordRequestSchema = new Schema(
  {
    referencedEmail: {
      type: String
    },
    done: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export default model('ResetPasswordRequest', resetPasswordRequestSchema);
