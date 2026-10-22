// Interaksi portofolio Nova

const menuToggle = document.querySelector("#menuToggle");
const navLinks = document.querySelector("#navLinks");
const navItems = document.querySelectorAll(".nav-link");
const header = document.querySelector(".site-header");
const currentYear = document.querySelector("#currentYear");
const themeToggle = document.querySelector("#themeToggle");
const themeIcon = document.querySelector("#themeIcon");
const themeText = document.querySelector("#themeText");
const root = document.documentElement;

// Terapkan tema yang tersimpan. Jika belum ada, gunakan mode gelap.
let savedTheme = "dark";
try {
  savedTheme = localStorage.getItem("nova-portfolio-theme") || "dark";
} catch (error) {
  // Website tetap berfungsi jika penyimpanan browser tidak tersedia.
}
setTheme(savedTheme);

function setTheme(theme) {
  const activeTheme = theme === "light" ? "light" : "dark";
  root.setAttribute("data-theme", activeTheme);
  const isDark = activeTheme === "dark";
  themeIcon.textContent = isDark ? "☼" : "☾";
  themeText.textContent = isDark ? "Mode terang" : "Mode gelap";
  themeToggle.setAttribute("aria-label", isDark ? "Ganti ke mode terang" : "Ganti ke mode gelap");
  themeToggle.setAttribute("aria-pressed", String(!isDark));
}

themeToggle.addEventListener("click", () => {
  const nextTheme = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  try {
    localStorage.setItem("nova-portfolio-theme", nextTheme);
  } catch (error) {
    // Tema tetap berubah untuk sesi halaman ini.
  }
});

// Buka/tutup menu pada layar kecil.
menuToggle.addEventListener("click", () => {
  const expanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!expanded));
  menuToggle.setAttribute("aria-label", expanded ? "Buka menu navigasi" : "Tutup menu navigasi");
  navLinks.classList.toggle("open", !expanded);
});

// Tutup menu setelah tautan dipilih.
navItems.forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka menu navigasi");
  });
});

// Garis header muncul ketika halaman digulir.
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 10);
});

// Tandai tautan navigasi untuk bagian yang sedang terlihat.
const sections = document.querySelectorAll("main section[id]");
if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navItems.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  sections.forEach((section) => observer.observe(section));
}

// Tahun otomatis pada footer.
currentYear.textContent = new Date().getFullYear();


// Ganti foto hanya di lingkaran profil, setiap 3 detik dan berulang.
(() => {
  const slides = Array.from(document.querySelectorAll('.profile-slide'));
  if (slides.length < 2) return;
  // Tunggu browser memeriksa file foto terlebih dahulu.
  window.setTimeout(() => {
    const usable = slides.filter(img => img.complete && img.naturalWidth > 0);
    if (!usable.length) return; // huruf A tetap terlihat jika foto belum dipasang
    slides.forEach(img => img.classList.remove('is-active'));
    let current = 0;
    usable[current].classList.add('is-active');
    window.setInterval(() => {
      usable[current].classList.remove('is-active');
      current = (current + 1) % usable.length;
      usable[current].classList.add('is-active');
    }, 3000);
  }, 500);
})();


// Slideshow foto profil: berganti setiap 3 detik dan berulang.
(() => {
  const box = document.getElementById("avatarSlideshow");
  if (!box) return;
  const photos = [...box.querySelectorAll(".avatar-photo")];

  function updateFallback() {
    const loaded = photos.some(img => img.complete && img.naturalWidth > 0);
    box.classList.toggle("has-photo", loaded);
  }

  photos.forEach(img => {
    img.addEventListener("load", updateFallback);
    img.addEventListener("error", () => {
      img.dataset.failed = "true";
      img.classList.remove("is-active");
      updateFallback();
    });
  });

  // Awali dari foto pertama yang berhasil dimuat.
  let active = 0;
  function showNext() {
    const valid = photos.filter(img => img.dataset.failed !== "true" && img.complete && img.naturalWidth > 0);
    if (!valid.length) { updateFallback(); return; }
    const current = valid.findIndex(img => img.classList.contains("is-active"));
    photos.forEach(img => img.classList.remove("is-active"));
    valid[(current + 1 + valid.length) % valid.length].classList.add("is-active");
    updateFallback();
  }
  photos.forEach((img, i) => { if (i > 0) img.classList.remove("is-active"); });
  updateFallback();
  window.setInterval(showNext, 3000);
})();
