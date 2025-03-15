import mongoose from "mongoose";
import { Coupon } from "../models/coupon.model.js";
import { connectDB } from "./connect.js";

const DB_URL = process.env.DB_URL;
const couponList = [
  // Food Coupons
  "PIZZA10",
  "BURGER20",
  "SNACKS5",
  "CAKE15",
  "COFFEE30",
  "FRIES25",
  "DESSERT50",

  // Apparel Coupons
  "SALE10",
  "DISCOUNT20",
  "WINTER15",
  "SUMMER5",
  "SHOES25",
  "BAGS30",
  "FASHION50"
];

async function seedCoupons() {
  try {
    // await mongoose.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

    connectDB(DB_URL)
    const generateCouponCode = () => {
      const randomIdx = Math.floor(Math.random() * couponList.length)
      const coupon = couponList.splice(randomIdx, 1)[0]
      return coupon
    };

    const expiresAt = new Date("2025-12-31T23:59:59.999Z");

    // Create 7 coupon objects
    const coupons = Array.from({ length: 7 }, () => ({
      code: generateCouponCode(),
      usageLimit: 10,
      usedCount: 0,
      expiresAt,
    }));

    // Insert coupons into the database
    await Coupon.insertMany(coupons);

    console.log("Successfully seeded coupons:", coupons);
  } catch (e) {
    console.log("Error seeding coupons:", e);
  } finally {
    mongoose.connection.close();
  }
}

seedCoupons()
