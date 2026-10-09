const CARD_URL = "https://card.ronnysphotography.com";

const overlay = document.getElementById("modalOverlay"),
      modal = document.getElementById("modal"),
      closeBtn = document.getElementById("close"),
      copyView = document.getElementById("copyView"),
      copyURL = document.getElementById("copyURL"),
      qrView = document.getElementById("qrView"),
      qr = document.getElementById("qr"),
      shareBtn = document.getElementById("share"),
      showQRBtn = document.getElementById("showQR"),
      stickyBar = document.getElementById("stickyBar");

function openModal() {
  overlay.classList.add("open");
  modal.classList.add("open");
}

function closeModal() {
  overlay.classList.remove("open");
  modal.classList.remove("open");
}

function show(el) { el.style.display = "flex"; }
function hide(el) { el.style.display = "none"; }

window.addEventListener("load", () => {
  try {
    qr.innerHTML = new QRCode({
      content: CARD_URL,
      container: "svg-viewbox",
      join: true,
      ecl: "L",
      padding: 0
    }).svg();
  } catch (err) {
    qr.innerHTML = "<p>QR not available</p>";
  }
});

if (navigator.canShare) {
  shareBtn.addEventListener("click", () => {
    navigator.share({
      title: "Ronny's Photography Digital Card",
      text: "You can view my Digital Business Card here:",
      url: CARD_URL
    }).catch(() => {/* silent fail */});
  });
} else {
  shareBtn.addEventListener("click", () => { show(copyView); hide(qrView); openModal(); });
}

showQRBtn.addEventListener("click", () => { show(qrView); hide(copyView); openModal(); });

closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

copyURL.addEventListener("click", async () => {
  const label = copyURL.querySelector(".action");
  try {
    await navigator.clipboard.writeText(CARD_URL);
    if (label) { label.textContent = "Copied"; setTimeout(() => { label.textContent = "Copy URL"; }, 1000); }
  } catch (err) {
    if (label) { label.textContent = "Copy failed"; setTimeout(() => { label.textContent = "Copy URL"; }, 1000); }
  }
});

// Reveal-on-scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// Sticky mobile CTA bar: show once the hero has scrolled out of view
const heroEl = document.querySelector(".hero");
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    stickyBar.classList.toggle("visible", !entry.isIntersecting);
  });
}, { threshold: 0 });
heroObserver.observe(heroEl);
