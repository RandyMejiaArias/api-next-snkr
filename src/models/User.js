import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true
    },
    email: {
      type: String,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Role'
      }
    ],
    emailVerified: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String
    },
    preferredSize: {
      type: String
    },
    collectibles: [
      {
        size: {
          type: Schema.Types.ObjectId,
          ref: 'Size',
          required: true
        },
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        },
        score: {
          type: Number
        },
        evaluateConditions: [
          {
            scoreCharacteristic: {
              type: Schema.Types.ObjectId,
              ref: 'ScoringCharacteristic',
              required: true
            },
            value: {
              type: Schema.Types.Boolean
            }
          }
        ]
      }
    ]
  },
  {
    timestamps: true,
    versionKey: false
  }
);

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async (password, receivedPassword) => await bcrypt.compare(password, receivedPassword);

export default model('User', userSchema);
