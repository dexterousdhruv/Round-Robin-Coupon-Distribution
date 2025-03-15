import { Router } from "express";
import { ClaimLog } from "../models/claim.model.js";
import { Coupon } from "../models/coupon.model.js";
import { errorHandler } from "../utils/error.js";

const router = Router();

router.get("/claim-coupon", claimCoupon);

async function claimCoupon(req, res, next) {
  try {
    const COOLDOWN_TIME = 60 * 60 * 1000; // 1 hour
    const ipAddress = req.ip;
    let sessionId = req.sessionID
    const now = new Date();

    console.log(req?.ip)
    console.log(req?.sessionID)
    
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      return next(errorHandler(400, "No session id detected!"))
    }

    // check for last claim time
    const lastClaim = await ClaimLog.findOne({
      $or: [{ ipAddress }, { sessionId }],
    }).sort({ createdAt: -1 });

    if (lastClaim) {
      let lastClaimAt = new Date(lastClaim.createdAt);
      const timeElapsed = now.valueOf() - lastClaimAt.valueOf();

      if (timeElapsed < COOLDOWN_TIME) {
        const timeLeft = Math.ceil((COOLDOWN_TIME - timeElapsed) / 60000);

        return res.json({
          canClaim: false,
          message: `You can claim another coupon in ${timeLeft} minute${
            timeLeft > 1 ? "s" : ""
          }.`,
        });
      }
    }

    // check for coupon availabilty
    const availableCoupon = await Coupon.findOne({
      $expr: { $lt: ["$usedCount", "$usageLimit"] },
      expiresAt: { $gt: new Date() },
    }).sort({ expiresAt: 1 });

    if (!availableCoupon) {
      return res.json({ canClaim: false, message: "No valid coupons left." });
    }

    // send coupon
    const [updatedUsage, addedClaim] = await Promise.all([
      Coupon.findByIdAndUpdate(
        availableCoupon._id,
        {
          $inc: { usedCount: 1 },
        }
      ),

      ClaimLog.create({
        couponId: availableCoupon.id,
        ipAddress,
        sessionId,
        claimedAt: new Date(),
      }),
    ]);

    if (updatedUsage && addedClaim)
      return res.json({
        message: "success",
        canClaim: true,
        couponCode: availableCoupon.code,
      });
  } catch (e) {
    console.log("Error in claim coupon controller", e);
    return next(errorHandler(500, "Server error! Please try again later."));
  }
}

export default router;
