(function () {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "customer-login.html";
    return;
  }

  document.getElementById("cname").innerText = localStorage.getItem("username") || "-";
  document.getElementById("cmobile").innerText = localStorage.getItem("userPhone") || "-";
  document.getElementById("cemail").innerText = localStorage.getItem("userEmail") || "-";

  loadAppointments();
})();

function statusBadge(value) {
  const colors = {
    Paid: "success",
    Approved: "primary",
    Completed: "success",
    Cancelled: "secondary",
    Pending: "warning",
    Unpaid: "warning"
  };
  return `<span class="badge bg-${colors[value] || "secondary"}">${value}</span>`;
}

async function loadAppointments() {
  const token = localStorage.getItem("token");
  const tbody = document.getElementById("apptBody");
  tbody.innerHTML = "<tr><td colspan=\"5\" class=\"text-center text-muted\">Loading appointments...</td></tr>";

  const res = await fetch(`${window.CAREPLUS_API || "http://localhost:5000/api"}/appointments/my`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-danger">${data.msg || "Could not load appointments"}</td></tr>`;
    return;
  }

  let rows = "";
  data.forEach(a => {
    const canCancel = a.paymentStatus !== "Paid" && a.status !== "Cancelled";
    rows += `
    <tr>
      <td>${new Date(a.appointmentDate || a.createdAt).toLocaleDateString()}</td>
      <td>${a.serviceName}</td>
      <td>Rs. ${a.price}</td>
      <td>${statusBadge(a.status)} ${statusBadge(a.paymentStatus)}</td>
      <td>
        ${canCancel ? `<button class="btn btn-outline-danger btn-sm" onclick="cancelAppointment('${a._id}')">Cancel</button>` : ""}
      </td>
    </tr>`;
  });
  tbody.innerHTML = rows || "<tr><td colspan=\"5\" class=\"text-center text-muted\">No appointments yet</td></tr>";
}

async function cancelAppointment(id) {
  if (!confirm("Cancel this appointment?")) return;

  const token = localStorage.getItem("token");
  const res = await fetch(`${window.CAREPLUS_API || "http://localhost:5000/api"}/appointments/${id}/cancel`, {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` }
  });

  if (!res.ok) {
    const result = await res.json();
    alert(result.msg || "Could not cancel appointment");
  }
  loadAppointments();
}
