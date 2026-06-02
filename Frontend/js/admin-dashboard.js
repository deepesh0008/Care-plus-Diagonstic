(function () {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "admin") {
    window.location.href = "admin-login.html";
    return;
  }

  loadAdminAppointments();
})();

async function loadAdminAppointments() {
  const token = localStorage.getItem("token");
  const tbody = document.getElementById("adminAppts");
  tbody.innerHTML = "<tr><td colspan=\"7\" class=\"text-center text-muted\">Loading appointments...</td></tr>";

  const res = await fetch(`${window.CAREPLUS_API || "http://localhost:5000/api"}/admin/appointments`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  const data = await res.json();

  if (!res.ok) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">${data.msg || "Could not load appointments"}</td></tr>`;
    return;
  }

  let rows = "";
  data.forEach(a => {
    rows += `
    <tr>
      <td>${a.userId?.name || a.name || "N/A"}<br><small class="text-muted">${a.email || a.userId?.email || ""}</small></td>
      <td>${a.phone || a.userId?.phone || "-"}</td>
      <td>${a.serviceName}<br><small class="text-muted">${new Date(a.appointmentDate || a.createdAt).toLocaleDateString()}</small></td>
      <td>Rs. ${a.price}</td>
      <td>${a.status}</td>
      <td>${a.paymentStatus}</td>
      <td>
        <select class="form-select form-select-sm" onchange="updateStatus('${a._id}', this.value)">
          ${["Pending", "Approved", "Completed", "Cancelled"].map(status => `<option value="${status}" ${a.status === status ? "selected" : ""}>${status}</option>`).join("")}
        </select>
      </td>
    </tr>`;
  });

  tbody.innerHTML = rows || "<tr><td colspan=\"7\" class=\"text-center text-muted\">No appointments found</td></tr>";
}

async function updateStatus(id, status) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${window.CAREPLUS_API || "http://localhost:5000/api"}/admin/appointment/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    const result = await res.json();
    alert(result.msg || "Could not update appointment");
  }
  loadAdminAppointments();
}

function logoutAdmin() {
  localStorage.clear();
  window.location.href = "admin-login.html";
}
