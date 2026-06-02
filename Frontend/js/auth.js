window.CAREPLUS_API = window.CAREPLUS_API || "http://localhost:5000/api";

function getApiBase() {
  return window.CAREPLUS_API;
}

function getInputValue(...ids) {
  for (const id of ids) {
    const el = document.getElementById(id);
    if (el) return el.value.trim();
  }
  return "";
}

function setFormMessage(message, type = "danger") {
  const target = document.getElementById("lerror") || document.getElementById("error") || document.getElementById("formMsg");
  if (!target) return;
  target.className = `mt-2 text-${type}`;
  target.innerText = message;
}

function setButtonLoading(form, loading) {
  const button = form?.querySelector("button[type='submit']");
  if (!button) return;
  button.disabled = loading;
  button.dataset.originalText = button.dataset.originalText || button.innerText;
  button.innerText = loading ? "Please wait..." : button.dataset.originalText;
}

function saveSession(result) {
  localStorage.setItem("token", result.token);
  localStorage.setItem("username", result.user.name);
  localStorage.setItem("userEmail", result.user.email);
  localStorage.setItem("userPhone", result.user.phone || "");
  localStorage.setItem("role", result.role);
}

async function registerCustomer(event) {
  if (event) event.preventDefault();
  setButtonLoading(event?.target, true);
  setFormMessage("", "muted");

  const data = {
    name: getInputValue("name"),
    email: getInputValue("email"),
    phone: getInputValue("mobile", "phone"),
    password: getInputValue("password")
  };

  try {
    const res = await fetch(`${getApiBase()}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.msg || "Registration failed");

    setFormMessage("Account created. Redirecting to login...", "success");
    setTimeout(() => { window.location.href = "customer-login.html"; }, 600);
  } catch (err) {
    setFormMessage(err.message);
  } finally {
    setButtonLoading(event?.target, false);
  }
}

async function loginCustomer(event) {
  if (event) event.preventDefault();
  setButtonLoading(event?.target, true);
  setFormMessage("", "muted");

  const data = {
    email: getInputValue("email", "lemail"),
    password: getInputValue("password", "lpass")
  };

  try {
    const res = await fetch(`${getApiBase()}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    if (!res.ok || !result.token) throw new Error(result.msg || "Login failed");

    saveSession(result);
    window.location.href = result.role === "admin" ? "admin-dashboard.html" : "customer-dashboard.html";
  } catch (err) {
    setFormMessage(err.message);
  } finally {
    setButtonLoading(event?.target, false);
  }
}

function registerUser(event) {
  return registerCustomer(event);
}

function loginUser(event) {
  return loginCustomer(event);
}

function updateNavbarState() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const loginLinks = document.getElementById("loginLinks");
  const registerLinks = document.getElementById("registerLinks");
  const userBox = document.getElementById("userBox");
  const logoutBtn = document.getElementById("logoutBtn");
  const uname = document.getElementById("uname");

  if (!loginLinks || !registerLinks || !userBox || !logoutBtn) return;

  loginLinks.classList.toggle("d-none", Boolean(token));
  registerLinks.classList.toggle("d-none", Boolean(token));
  userBox.classList.toggle("d-none", !token);
  logoutBtn.classList.toggle("d-none", !token);
  if (uname) uname.innerText = username || "User";
}

function customerLogout() {
  localStorage.clear();
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", updateNavbarState);
