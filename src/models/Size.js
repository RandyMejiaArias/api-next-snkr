import { Schema, model } from 'mongoose';

const sizeSchema = new Schema(
  {
    number: {
      type: String,
      required: true
    },
    stockXPrice: {
      type: Number
    },
    goatPrice: {
      type: Number
    },
    referencedProduct: {
      type: Schema.Types.ObjectId,
      ref: 'Product'
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model('Size', sizeSchema);