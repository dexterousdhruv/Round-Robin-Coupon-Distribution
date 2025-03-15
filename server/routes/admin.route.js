import { Router } from "express";
import { ClaimLog } from "../models/claim.model.js";
import { Coupon } from "../models/coupon.model.js";

const router = Router();

router.get("/claim-coupon", claimCoupon);

async function claimCoupon(req, res, next) {
  try {
    const { sessionID: sessionId, ip: ipAddress } = req;
    const COOLDOWN_TIME = 1 * 60 * 1000; // 1 hour
    const now = new Date();

    if (sessionId) {
      return next
    }

    // check for claim
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
            timeLeft > 1 && "s"
          }.`,
        });
      }
    }

    // check for availabilty
    const availableCoupon = await Coupon.findOne({
      $expr: { $lt: ["$usedCount", "$usageLimit"] },
      expiresAt: { $gt: new Date() },
    }).sort({ expiresAt: 1 });

    if (!availableCoupon) {
      return res.json({ canClaim: false, message: "No valid coupons left." });
    }

    // send coupon
    const [updatedUsage, addedClaim] = Promise.all([
      await Coupon.findByIdAndUpdate(
        { id: availableCoupon.id },
        {
          $inc: { usedCount: 1 },
        }
      ),
      await ClaimLog.create({
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
        coupon: availableCoupon.code,
      });
  } catch (e) {
    console.log("Error in claim coupon controller", e);
    return next(errorHandler(500, "Server error! Please try again later."));
  }
}

export default router;
