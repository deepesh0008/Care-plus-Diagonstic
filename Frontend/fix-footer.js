const fs = require('fs');
const path = require('path');

const htmlDir = path.join(__dirname, 'html');
const files = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));

const correctFooter = `
<footer class="bg-dark text-light pt-5 pb-3 mt-5">
  <div class="container">
    <div class="row g-4">
      <div class="col-md-4"><h5 class="fw-bold">CarePlus Diagnostic</h5><p class="small">Trusted diagnostic center providing accurate reports, advanced testing facilities and expert medical guidance.</p></div>
      <div class="col-md-2"><h6 class="fw-bold">Quick Links</h6><ul class="list-unstyled"><li><a href="index.html" class="footer-link">Home</a></li><li><a href="services.html" class="footer-link">Services</a></li><li><a href="staff.html" class="footer-link">Doctors</a></li><li><a href="faq.html" class="footer-link">FAQ</a></li><li><a href="contact.html" class="footer-link">Contact</a></li></ul></div>
      <div class="col-md-3"><h6 class="fw-bold">Our Services</h6><ul class="list-unstyled small"><li>Blood Tests</li><li>MRI / CT Scan</li><li>X-Ray and Ultrasound</li><li>Diabetes Care</li><li>Health Checkup Packages</li></ul></div>
      <div class="col-md-3"><h6 class="fw-bold">Contact Info</h6><p class="small mb-1">Sector 62, Noida</p><p class="small mb-1">+91 98765 43210</p><p class="small mb-1">careplus@gmail.com</p><p class="small">Mon-Sat: 8 AM - 8 PM</p></div>
    </div>
    <hr class="border-secondary mt-4">
    <div class="text-center small">© 2025 CarePlus Diagnostic Clinic | Designed for Academic and Demo Purpose</div>
  </div>
</footer>
`;

files.forEach(file => {
  const filePath = path.join(htmlDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace anything between <footer and </footer> with the correctFooter
  // Regex to match the footer block (including newlines)
  const footerRegex = /<footer[\s\S]*?<\/footer>/i;
  
  if (footerRegex.test(content)) {
    content = content.replace(footerRegex, correctFooter.trim());
    fs.writeFileSync(filePath, content);
    console.log(`Replaced footer in ${file}`);
  } else {
    // If no footer exists, just append it before </body>
    content = content.replace('</body>', correctFooter.trim() + '\n</body>');
    fs.writeFileSync(filePath, content);
    console.log(`Added footer to ${file}`);
  }
});
