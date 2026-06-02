function selectService(serviceName, price) {
  localStorage.setItem("selectedService", serviceName);
  localStorage.setItem("selectedPrice", price);
  window.location.href = "index.html#appointment";
}
