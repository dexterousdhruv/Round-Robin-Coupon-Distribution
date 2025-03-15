import React, { useState } from "react";
import axios from 'axios'

const Home = () => {
  const [redeemed, setRedeemed] = useState(false);
  const [message, setMessage] = useState("");
  const [couponCode, setCouponCode] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

  const handleClaimCoupon = async () => {
    setRedeemed(false)
    setMessage("")
    setCouponCode("")

    try {
      const res = await axios.get(`${API_URL}/claim-coupon`, {
        withCredentials: true
      })

      console.log(res)

      if (res.status === 200) {
        setRedeemed(res?.data?.canClaim)

        if (res?.data?.canClaim) {
          setCouponCode(res?.data?.couponCode)
        } else {
          setMessage(res?.data?.message)
        }
      }

    } catch(e) {
      console.log("Error in claiming coupon: ", e)
      alert("Internal server error! Please try again later.")
    } finally {
      setTimeout(() => {
        setRedeemed(false);
      }, 3000);
    }

  }


  return (
    <div className="relative grid place-content-center min-h-screen bg-[#fce762] p-4">
      <h1 className="mb-10 text-4xl md:text-5xl text-center font-grotesk text-white font-medium drop-shadow-md ">
        Round Robin Coupon Distribution{" " + API_URL}
      </h1>
      <div className="relative max-w-md w-full bg-white rounded-2xl shadow-lg mx-auto">
        {/* Top part of the ticket */}
        <div className="p-8 pb-4 ">
          <div className="flex justify-between items-start font-inter mb-6 ">
            <h2 className="text-[#ffc107] text-2xl tracking-wide text-center font-bold min-w-full">
              FREE COUPON GIVEAWAY
            </h2>
          </div>

          <div className="relative mt-4">
            {/* Card */}
            <div className="relative">
              <div className="w-24 h-12 border-2 border-[#e0e0e0] rounded-md flex items-center justify-center">
                <div className="space-y-1.5">
                  <div className="w-16 h-1.5 bg-[#4caf50] rounded-full"></div>
                  <div className="w-16 h-1.5 bg-[#e0e0e0] rounded-full"></div>
                </div>
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-[#e0e0e0] rounded-full"></div>
              </div>

              {/* Curvy line */}
              <svg
                className="absolute top-4 -right-4"
                width="120"
                height="80"
                viewBox="0 0 120 80"
                fill="none"
              >
                <path
                  d="M0,20 Q30,10 60,40 T120,30"
                  stroke="#bdbdbd"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 2"
                />
              </svg>

              <div className="absolute right-0 top-12">
                {/* Star */}
                <div className="absolute -top-2 -right-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M10,0 L12,8 L20,10 L12,12 L10,20 L8,12 L0,10 L8,8 Z"
                      fill="#ffd54f"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dotted line */}
        <div className="relative py-5">
          <div className="border-t-2 border-dashed border-gray-300"></div>
          <div className="absolute -left-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-[#fce762] rounded-full "></div>
          <div className="absolute -right-2.5 top-1/2 transform -translate-y-1/2 w-5 h-5 bg-[#fce762] rounded-full"></div>
        </div>

        {/* Bottom part of the ticket */}
        <div className="p-8 pt-4 flex flex-col gap-4 justify-center">
          <button
            onClick={handleClaimCoupon}
            // disabled={message}
            className={`w-full py-3 rounded-md text-white font-medium transition-all font-grotesk ${
              message
                ? "bg-green-500"
                : "bg-[#ff7043] hover:bg-[#ff5722]  tracking-wide active:scale-95"
            }`}
          >
            {redeemed && couponCode ? "COUPON CLAIMED SUCCESSFULLY!" : "CLAIM NOW"}
          </button>
          {redeemed && couponCode && (
            <div
              className={`w-full p-3 text-center rounded-md text-green-500 font-medium transition-all border-2 bg-zinc-100/80 border-emerald-600 font-grotesk tracking"
              `}
            >
              CLAIMED COUPON CODE: {couponCode}
            </div>
          )}
          {!redeemed && message  && (
            <div
              className={`w-full py-3 px-2 text-center rounded-md text-red-600 font-medium transition-all border-2 bg-red-100/80 border-red-600 font-grotesk tracking"
              `}
            >
              {message}
            </div>
          )}
        </div>
      </div>

      <div className="absolute left-1/2 text-center text-sm bottom-10 translate-x-[-50%] font-inter sm:text-nowrap text-[#ff5722] drop-shadow-sm ">
        Made with 🧡 by Dhruv Verma, &copy; All Rights Reserved {(new Date()).getFullYear()} 
      </div>
    </div>
  );
};

export default Home;
