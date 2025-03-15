# Round-Robin Coupon Distribution System

A full stack application that implements a fair coupon distribution system with abuse prevention mechanisms.

## Note 
Upon visiting the web application for the first time, wait at least for a minute while expecting the response from server. [Render](https://www.render.com) spins down its hosted servers due to inactivity, which may take upto a minute to spin up over again.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Features](#features)
4. [Pre-requisites](#pre-requisites)
5. [Installation](#installation)
6. [Project Structure](#project-structure)
7. [Setup and Installation](#setup-and-installation)
8. [API Documentation](#api-documentation)
9. [Database Schema](#database-schema)
10. [Contributing](#contributing)


## Project Overview

This is a live web application that distributes coupons to guest users in a 
round-robin manner, incorporating mechanisms to prevent users from exploiting page refreshes 
to claim multiple coupons within a restricted time frame. 

Maintained by: [@dexterousdhruv](https://github.com/dexterousdhruv)

The project is structured as a monorepo with two main directories:
- `client`: The frontend application built with React
- `server`: The backend API server built with Node.js and Express


## Technology Stack

- **Frontend**: React 18
- **Backend**: Node.js + Express.js 
- **State Management**: React Hooks
- **Styling**: Tailwind CSS


## Features

### 1. Coupon Distribution
- Maintains a list of available coupons. 
- Assign coupons sequentially to users while ensuring even and fair distribution . 
- Automatic tracking of coupon usage and limits
- Support for coupon expiration dates

### 2. Abuse Prevention
- IP-based tracking to prevent subsequent claims from the same IP using time-based restrictions.
- Browser session monitoring via cookies to 
- Rate-limiting by restricting claims within a set timeframe.


### 3. User Feedback and UI
- No login required for claiming coupons.
- Clear messages indicating successful coupon claims or inform users of 
the time remaining before they can claim another.
- Clean, minimal and responsive design. 
- Real-time coupon availability status.

## Effective Abuse Prevention Mechanisms 

| **Evasion Tactic**           | **Prevention Mechanism**                          |
|------------------------------|--------------------------------------------------|
| Refreshing the page          | Cookies & API response track claims.           |
| Opening in incognito mode    | IP tracking detects repeated claims.           |
| Changing network (VPN, mobile hotspot) | Cookie/session tracking still applies.  |
| Clearing cookies             | IP restriction still applies.                   |
| Using multiple devices       | Each device is still tracked by its IP.        |


## Pre-requisites
- Node.js 18.x or higher
- MongoDB Atlas account or local MongoDB instance


## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/dexterousdhruv/Round-Robin-Coupon-Distribution.git
   cd Round-Robin-Coupon-Distribution
   ```

2. Install dependencies for both packages:
   ```
   cd client
   npm install 

   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `client` directory
   - Create a `.env` file in the `api` directory
   - For the frontend (`client/.env`):
     ```env
     VITE_API_URL=http://localhost:3000 (Replace with hosted backend url)
     ```

   - For the backend (`api/.env`):
     ```env
     DB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/coupon-dist?retryWrites=true&w=majority

     CLIENT_URL=http://localhost:5173 (Replace with hosted frontend url)

     ```




4. Seed the database with initial coupons data:
   ```
    npm run seed
   ```

5. Start the development servers:
   - For the frontend:
     ```
     cd client
     npm run dev
     ```
   - For the backend:
     ```
     cd backend
     npm run dev
     ```


## Project Structure

```
├── README.md
├── client
    ├── .env
    ├── .gitignore
    ├── README.md
    ├── eslint.config.js
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── postcss.config.js
    ├── public
    │   └── vite.svg
    ├── src
    │   ├── App.jsx
    │   ├── components
    │   │   └── Home.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── tailwind.config.js
    └── vite.config.js
└── server
    ├── .gitignore
    ├── controllers
        └── coupon.controller.js
    ├── database
        ├── connect.js
        └── seedCoupons.js
    ├── index.js
    ├── models
        ├── claim.model.js
        └── coupon.model.js
    ├── package-lock.json
    ├── package.json
    ├── routes
        ├── admin.route.js
        └── coupon.route.js
    └── utils
        └── error.js
```

## API Documentation

### GET /api/claim-coupon
  Handles the request to claim a coupon by the user.

**Response:**
```json
{
  "message": "Success",
  "canClaim" : true
  "couponCode": "SNACKS5"
}
```

**Error Response:**
```json
{
  "message": "You can claim another coupon in 10 minutes.",
  "canClaim" : false
}
```

## Database Schema

### Coupon Model
```javascript
{
  code: String,          // Coupon code
  expiresAt: Date,       // Expiration date
  usageLimit: Number,    // Maximum number of claims
  usageCount: Number     // Current number of claims
}
```

### Claim Model
```javascript
{
  couponId: ObjectId,    // Reference to claimed coupon
  ipAddress: String,     // Claimer's IP address
  sessionId: String,     // Browser session ID
}
```


## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request.

