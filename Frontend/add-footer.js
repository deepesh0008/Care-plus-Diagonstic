const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'html');
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

const footerCode = `
<footer class="bg-dark text-light pt-5 pb-3 mt-auto">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-4">
        <h5 class="fw-bold">CarePlus Diagnostic</h5>
        <p class="small text-muted">Trusted diagnostic center providing accurate reports, advanced testing facilities and expert medical guidance.</p>
      </div>
      <div class="col-md-2">
        <h6 class="fw-bold">Quick Links</h6>
        <ul class="list-unstyled small">
          <li><a href="index.html" class="text-decoration-none text-muted">Home</a></li>
          <li><a href="services.html" class="text-decoration-none text-muted">Services</a></li>
          <li><a href="staff.html" class="text-decoration-none text-muted">Doctors</a></li>
          <li><a href="faq.html" class="text-decoration-none text-muted">FAQ</a></li>
          <li><a href="contact.html" class="text-decoration-none text-muted">Contact</a></li>
        </ul>
      </div>
      <div class="col-md-3">
        <h6 class="fw-bold">Our Services</h6>
        <ul class="list-unstyled small text-muted">
          <li>Blood Tests</li>
          <li>MRI / CT Scan</li>
          <li>X-Ray and Ultrasound</li>
          <li>Diabetes Care</li>
          <li>Health Checkup Packages</li>
        </ul>
      </div>
      <div class="col-md-3">
        <h6 class="fw-bold">Contact Info</h6>
        <p class="small text-muted mb-1"><i class="bi bi-geo-alt-fill me-2"></i>Sector 62, Noida</p>
        <p class="small text-muted mb-1"><i class="bi bi-telephone-fill me-2"></i>+91 98765 43210</p>
        <p class="small text-muted mb-1"><i class="bi bi-envelope-fill me-2"></i>careplus@gmail.com</p>
        <p class="small text-muted"><i class="bi bi-clock-fill me-2"></i>Mon-Sat: 8 AM - 8 PM</p>
      </div>
    </div>
    <hr class="border-secondary mt-4">
    <div class="text-center small text-muted">© 2026 CarePlus Diagnostic Clinic | All Rights Reserved</div>
  </div>
</footer>
`;

files.forEach(file => {
  const filePath = path.join(htmlDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  if (!content.includes('<footer')) {
    // Add Flexbox wrapper to body to make footer stick to bottom professionally
    if (!content.includes('d-flex flex-column min-vh-100')) {
      content = content.replace('<body>', '<body class="d-flex flex-column min-vh-100">');
    }
    content = content.replace('</body>', footerCode + '\n</body>');
    fs.writeFileSync(filePath, content);
    console.log(`Added footer to ${file}`);
  } else {
    console.log(`Footer already exists in ${file}`);
  }
});
