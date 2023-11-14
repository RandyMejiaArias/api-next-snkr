import { Schema, model } from 'mongoose';

const preferredScoringModel = new Schema(
  {
    scoringCharacteristics: [
      {
        scoreCharacteristic: {
          type: Schema.Types.ObjectId,
          ref: 'ScoringCharactesistic',
          required: true
        },
        score: {
          type: Number,
          default: 0
        }
      }
    ],
    referencedUser: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model('PreferredScoring', preferredScoringModel)