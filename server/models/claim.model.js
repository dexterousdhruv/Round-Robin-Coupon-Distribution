import { model, Schema } from "mongoose"

const ClaimSchema = new Schema({
  couponId: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  sessionId: {
    type: String,
    required: true,
  },
}, { timestamps: true, versionKey: false });


export const ClaimLog = model('Claims', ClaimSchema)