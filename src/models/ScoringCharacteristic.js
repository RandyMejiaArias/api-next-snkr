import { Schema, model } from 'mongoose';

const scoringCharacteristicSchema = new Schema(
  {
    name: {
      type: String,
      unique: true
    }
  },
  {
    versionKey: false,
    timestamp: true
  }
);

export default model('ScoringCharacteristic', scoringCharacteristicSchema);
