// index.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(helmet());              // secure headers
app.use(cors());                // CORS enabled for all origins (lock down later if needed)
app.use(express.json());        // parse JSON body
app.use(morgan("combined"));    // HTTP request logging

// ─── SUPABASE SETUP (TO DO) ────────────────────────────────────────────────────
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(
//   process.env.SUPABASE_URL,            // set in Render Dashboard → Environment
//   process.env.SUPABASE_SERVICE_KEY     // or anon key, whichever you prefer
// );

// ─── HEALTHCHECK / TEST ENDPOINT ──────────────────────────────────────────────
app.get("/test", (req, res) => {
  res.json({ message: "Server is working" });
});

// ─── YOUR API ENDPOINTS (TO DO) ───────────────────────────────────────────────
// Example: fetch customer by phone
// app.get("/customer/:phone", async (req, res, next) => {
//   try {
//     const { phone } = req.params;
//     // const { data, error } = await supabase
//     //   .from("customers")
//     //   .select("*")
//     //   .eq("phone_number", phone)
//     //   .single();
//     // if (error) throw error;
//     // res.json({ customer: data });
//   } catch (err) {
//     next(err);
//   }
// });

// ─── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── START SERVER ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
