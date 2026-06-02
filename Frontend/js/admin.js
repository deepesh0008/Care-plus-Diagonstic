async function login(e) {
  e.preventDefault();

  const res = await fetch(`${window.CAREPLUS_API || "http://localhost:5000/api"}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: username.value.trim(),
      password: password.value
    })
  });

  const result = await res.json();

  if (res.ok && result.role === "admin") {
    localStorage.setItem("token", result.token);
    localStorage.setItem("username", result.user.name);
    localStorage.setItem("userEmail", result.user.email);
    localStorage.setItem("userPhone", result.user.phone || "");
    localStorage.setItem("role", result.role);
    window.location.href = "admin-dashboard.html";
  } else {
    error.innerText = result.msg || "Invalid admin credentials";
  }
}

if (location.pathname.includes("admin.html")) {
  window.location.href = "admin-dashboard.html";
}

function logout() {
  localStorage.clear();
  window.location.href = "admin-login.html";
}
