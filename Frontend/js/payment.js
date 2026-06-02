document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("appointmentLabel").innerText = localStorage.getItem("appointmentId") || "-";
  document.getElementById("amountLabel").innerText = localStorage.getItem("selectedPrice") || "0";
});

function showPaymentMessage(message, type = "danger") {
  const target = document.getElementById("paymentMsg");
  target.className = `mt-3 mb-0 text-${type}`;
  target.innerText = message;
}

async function payNow() {
  const appointmentId = localStorage.getItem("appointmentId");
  const token = localStorage.getItem("token");

  if (!appointmentId || !token) {
    showPaymentMessage("Please book an appointment before payment.");
    window.location.href = "services.html";
    return;
  }

  const data = {
    appointmentId,
    amount: localStorage.getItem("selectedPrice"),
    method: document.getElementById("method").value
  };

  showPaymentMessage("Processing payment...", "muted");

  try {
    const res = await fetch(`${window.CAREPLUS_API || "http://localhost:5000/api"}/payment/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Payment failed");

    showPaymentMessage(`${result.msg || "Payment successful"} Redirecting...`, "success");
    setTimeout(() => { window.location.href = "customer-dashboard.html"; }, 700);
  } catch (err) {
    showPaymentMessage(err.message);
  }
}
