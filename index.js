// index.js
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(helmet());           // secure headers
app.use(cors());             // enable CORS for all origins
app.use(express.json());     // parse JSON bodies
app.use(morgan("combined")); // HTTP request logging

// ─── SUPABASE CLIENT SETUP ─────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// ─── HEALTHCHECK / TEST ENDPOINT ──────────────────────────────────────────────
app.get("/test", (req, res) => {
  res.json({ message: "Server is working" });
});

// ─── LOOKUP ENDPOINT ───────────────────────────────────────────────────────────
app.post("/lookup", async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: "Missing phone" });

    // 1) Fetch the customer record by phone
    const { data: customer, error: custErr } = await supabase
      .from("customers")
      .select("*")
      .eq("phone_number", phone)
      .single();
    if (custErr || !customer) {
      return res
        .status(404)
        .json({ success: false, error: "Customer not found" });
    }

    // 2) Fetch all watercraft for that customer
    const { data: watercraft, error: craftErr } = await supabase
      .from("watercraft")
      .select("*")
      .eq("customer_id", customer.id);
    if (craftErr) throw craftErr;

    // 3) Return combined result
    res.json({ success: true, customer, watercraft });
  } catch (err) {
    next(err);
  }
});

// ─── GLOBAL ERROR HANDLER ──────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// ─── START SERVER ──────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
