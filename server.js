import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "YOUR_KEY_ID",       // 👉 replace with your Test Mode Key ID
  key_secret: "YOUR_KEY_SECRET" // 👉 replace with your Test Mode Secret
});

// ✅ Create order API
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,   // amount in paise (₹500 → 50000)
      currency: "INR",
      receipt: "receipt#1"
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).send("Error creating order");
  }
});

// ✅ Verify payment API
app.post("/api/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const hmac = crypto.createHmac("sha256", "YOUR_KEY_SECRET"); // same secret
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully!" });
    } else {
      res.json({ success: false, message: "Payment verification failed!" });
    }
  } catch (err) {
    console.error("Error verifying payment:", err);
    res.status(500).send("Error verifying payment");
  }
});

// ✅ Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
