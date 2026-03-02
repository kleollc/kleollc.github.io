const overlay = document.getElementById("menuOverlay");
const openBtn = document.getElementById("openMenu");
const closeBtn = document.getElementById("closeMenu");
const yearEl = document.getElementById("year");

yearEl.textContent = new Date().getFullYear();

let lastFocused = null;

function openMenu() {
  lastFocused = document.activeElement;
  overlay.classList.add("open");
  openBtn.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";

  // focus the close button for accessibility
  closeBtn.focus();
}

function closeMenu() {
  overlay.classList.remove("open");
  openBtn.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";

  if (lastFocused) lastFocused.focus();
}

openBtn.addEventListener("click", openMenu);
closeBtn.addEventListener("click", closeMenu);

// close if click backdrop
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeMenu();
});

// close on Escape
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && overlay.classList.contains("open")) closeMenu();
});

// close when a menu link is clicked
overlay.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => closeMenu());
});

// simple focus trap while open
overlay.addEventListener("keydown", (e) => {
  if (!overlay.classList.contains("open") || e.key !== "Tab") return;

  const focusables = overlay.querySelectorAll(
    'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusables[0];
  const last = focusables[focusables.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".editorialList.editorialClamp").forEach((list) => {
    const items = list.querySelectorAll(":scope > .editorialItem");
    const btn = list.parentElement.querySelector(".listToggleBtn");

    if (!btn) return;

    // Hide the button if there's nothing beyond the first 3
    if (items.length <= 3) {
      btn.style.display = "none";
      return;
    }

    btn.textContent = "View all";
    btn.addEventListener("click", () => {
      const expanded = list.classList.toggle("expanded");
      btn.textContent = expanded ? "View less" : "View all";
    });
  });
});

(function setupStripCarousel() {
  const strip = document.getElementById("tStrip");
  if (!strip) return;

  const cards = Array.from(strip.querySelectorAll(".shot"));
  if (!cards.length) return;

  const btnPrev = document.querySelector("[data-strip-prev]");
  const btnNext = document.querySelector("[data-strip-next]");

  let index = 0;

  function scrollToIndex(i) {
    index = (i + cards.length) % cards.length; // wrap
    cards[index].scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
  }

  btnPrev?.addEventListener("click", () => scrollToIndex(index - 1));
  btnNext?.addEventListener("click", () => scrollToIndex(index + 1));

  // Keep index in sync when user scrolls manually (touchpad/swipe)
  let raf = null;
  strip.addEventListener("scroll", () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const stripLeft = strip.getBoundingClientRect().left;
      let best = 0;
      let bestDist = Infinity;

      cards.forEach((card, i) => {
        const left = card.getBoundingClientRect().left;
        const d = Math.abs(left - stripLeft);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });

      index = best;
    });
  }, { passive: true });

  // Keyboard support when strip is focused
  strip.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); scrollToIndex(index - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); scrollToIndex(index + 1); }
  });

  // Optional: start aligned to first card on load
  scrollToIndex(0);
})();