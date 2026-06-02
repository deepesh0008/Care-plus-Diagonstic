document.addEventListener("DOMContentLoaded", () => {
  const issue = document.getElementById("issue");
  const price = document.getElementById("price");
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const date = document.getElementById("appointmentDate");

  if (issue && localStorage.getItem("selectedService")) issue.value = localStorage.getItem("selectedService");
  if (price && localStorage.getItem("selectedPrice")) price.value = localStorage.getItem("selectedPrice");
  if (name && localStorage.getItem("username")) name.value = localStorage.getItem("username");
  if (email && localStorage.getItem("userEmail")) email.value = localStorage.getItem("userEmail");
  if (phone && localStorage.getItem("userPhone")) phone.value = localStorage.getItem("userPhone");
  if (date) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    date.min = new Date().toISOString().split("T")[0];
    date.value = tomorrow.toISOString().split("T")[0];
  }
});

function showBookingMessage(message, type = "danger") {
  const msg = document.getElementById("msg");
  if (!msg) return;
  msg.className = `text-center mt-3 text-${type}`;
  msg.innerText = message;
}

async function bookAppointment(event) {
  if (event) event.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    localStorage.setItem("returnTo", "index.html#appointment");
    window.location.href = "customer-login.html";
    return;
  }

  const priceValue = document.getElementById("price")?.value || localStorage.getItem("selectedPrice") || "0";
  const amount = Number(String(priceValue).replace(/[^\d.]/g, ""));
  const serviceName = document.getElementById("issue")?.value || localStorage.getItem("selectedService");

  const data = {
    name: document.getElementById("name")?.value,
    email: document.getElementById("email")?.value,
    phone: document.getElementById("phone")?.value,
    serviceName,
    price: amount,
    issue: serviceName,
    appointmentDate: document.getElementById("appointmentDate")?.value,
    address: document.getElementById("address")?.value,
    notes: document.getElementById("notes")?.value
  };

  try {
    showBookingMessage("Booking appointment...", "muted");
    const res = await fetch(`${window.CAREPLUS_API || "http://localhost:5000/api"}/appointments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Appointment booking failed");

    localStorage.setItem("appointmentId", result._id);
    localStorage.setItem("selectedPrice", result.price);
    window.location.href = "payment.html";
  } catch (err) {
    showBookingMessage(err.message);
  }
}

function saveAppointment(event) {
  return bookAppointment(event);
}
