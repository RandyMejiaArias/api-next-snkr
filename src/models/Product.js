import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    type: {
      type: String
    },
    sku: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    model: {
      type: String,
      required: true
    },
    colorway: {
      type: String,
      required: true
    },
    mainImage: {
      type: String,
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    releaseDate: {
      type: Date
    },
    retailPrice: {
      type: Number
    },
    stockX: {
      id: {
        type: String
      },
      baseUrl: {
        type: String
      },
      endpoint: {
        type: String
      }
    },
    goat: {
      id: {
        type: String
      },
      baseUrl: {
        type: String
      },
      endpoint: {
        type: String
      }
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model('Product', productSchema);