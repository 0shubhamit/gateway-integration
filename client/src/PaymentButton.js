import React, { useState } from "react";

export function PaymentButton() {
    const [amountData, setAmountData] = useState(0)
  const startPayment = async () => {
    const response = await fetch("http://localhost:5000/api/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: amountData }),
    });

    const order = await response.json();

    const options = {
      key: "YOUR_KEY_ID",
      amount: order.amount,
      currency: order.currency,
      name: "My Shop",
      description: "Test Transaction",
      order_id: order.id,
      handler: async function (response) {
        const verifyRes = await fetch("http://localhost:5000/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });

        const result = await verifyRes.json();
        alert(result.message);
      },
      prefill: {
        name: "Shubham Singh",
        email: "test@example.com",
        contact: "9876543210",
      },
      theme: { color: "#3399cc" },
    };

    const rzp1 = new window.Razorpay(options);
    rzp1.open();
  };

  const setAmountDataFunc = (e) => {
    console.log('e.target.value', e.target.value)
    setAmountData(e.target.value)
  }

  return (
    <>
    <input type="number" value={amountData} onChange={(e) => setAmountDataFunc(e)} />
    <button
      onClick={startPayment}
      style={{ padding: "10px 20px", background: "blue", color: "#fff" }}
    >
      Pay Now
    </button>
    </>
  );
};
