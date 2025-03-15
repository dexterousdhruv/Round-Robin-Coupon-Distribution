import { model, Schema } from "mongoose"

const CouponSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true, 
    trim: true,
  },
  usageLimit: {
    type: Number,
    required: true,
    default: 10, 
  },
  usedCount: {
    type: Number,
    default: 0, 
  },
  expiresAt: {
    type: Date,
    required: true, 
  }
}, { timestamps: true, versionKey: false });



export const Coupon = model("Coupon", CouponSchema);

