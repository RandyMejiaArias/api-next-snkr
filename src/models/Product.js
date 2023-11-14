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
    model: {
      type: String,
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    colorway: {
      type: String,
      required: true
    },
    mainImage: {
      public_id: {
        type: String,
        required: true
      },
      secure_url: {
        type: String,
        required: true
      }
    },
    images: [
      {
        public_id: {
          type: String
        },
        secure_url: {
          type: String
        }
      }
    ],
    releaseDate: {
      type: Date
    },
    isCollaboration: {
      type: Boolean 
    },
    retailPrice: {
      type: Number
    },
    stockXUrl: {
      type: String
    },
    goatUrl: {
      type: String
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
)

export default model('Product', productSchema);