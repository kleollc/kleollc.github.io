/* ======================================================
   KLEO — script.js
   ====================================================== */

document.addEventListener("DOMContentLoaded", () => {

  /* ======================================================
     0) COOKIE CONSENT
     ====================================================== */
  const cookieBanner  = document.getElementById("cookieBanner");
  const cookieAccept  = document.getElementById("cookieAccept");
  const cookieDecline = document.getElementById("cookieDecline");

  function dismissCookieBanner(value) {
    try { localStorage.setItem("kleoCookieConsent", value); } catch(e) {}
    if (cookieBanner) cookieBanner.style.display = "none";
  }

  if (cookieBanner) {
    let consented = false;
    try { consented = !!localStorage.getItem("kleoCookieConsent"); } catch(e) {}

    if (!consented) {
      cookieBanner.classList.add("is-visible");
    }

    cookieAccept?.addEventListener("click",  () => dismissCookieBanner("accepted"));
    cookieDecline?.addEventListener("click", () => dismissCookieBanner("declined"));
  }

  /* ======================================================
     0) YEAR
     ====================================================== */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ======================================================
     1) OVERLAY MENU (Hamburger)
     ====================================================== */
  const overlay = document.getElementById("menuOverlay");
  const openBtn = document.getElementById("openMenu");
  const closeBtn = document.getElementById("closeMenu");

  let lastFocused = null;

  function openMenu() {
    if (!overlay || !openBtn || !closeBtn) return;

    lastFocused = document.activeElement;

    overlay.classList.add("open");
    openBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";

    // focus close for accessibility
    closeBtn.focus();
  }

  function closeMenu() {
    if (!overlay || !openBtn) return;

    overlay.classList.remove("open");
    openBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";

    if (lastFocused && typeof lastFocused.focus === "function") {
      lastFocused.focus();
    }
  }

  // Click handlers
  openBtn?.addEventListener("click", openMenu);
  closeBtn?.addEventListener("click", closeMenu);

  // Close when clicking the dark backdrop (not the panel)
  overlay?.addEventListener("click", (e) => {
    if (e.target === overlay) closeMenu();
  });

  // Close on Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay?.classList.contains("open")) closeMenu();
  });

  // Close when any menu link is clicked
  overlay?.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => closeMenu());
  });

  // Simple focus trap while open
  overlay?.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open") || e.key !== "Tab") return;

    const focusables = overlay.querySelectorAll(
      'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });


  /* ======================================================
     2) TESTIMONIAL STRIP CAROUSEL
     ====================================================== */
  function setupStripCarousel() {
    const strip = document.getElementById("tStrip");
    if (!strip) return;

    const cards = Array.from(strip.querySelectorAll(".shot"));
    if (!cards.length) return;

    const btnPrev = document.querySelector("[data-strip-prev]");
    const btnNext = document.querySelector("[data-strip-next]");

    let index = 0;

    function scrollToIndex(i) {
      index = (i + cards.length) % cards.length;
      const card = cards[index];

      strip.scrollTo({
        left: card.offsetLeft - strip.offsetLeft,
        behavior: "smooth"
      });
    }

    btnPrev?.addEventListener("click", () => scrollToIndex(index - 1));
    btnNext?.addEventListener("click", () => scrollToIndex(index + 1));

    // Sync index when user scrolls manually
    let raf = null;
    strip.addEventListener("scroll", () => {
      if (raf) cancelAnimationFrame(raf);

      raf = requestAnimationFrame(() => {
        const stripLeft = strip.getBoundingClientRect().left;

        let best = 0;
        let bestDist = Infinity;

        cards.forEach((card, i) => {
          const left = card.getBoundingClientRect().left;
          const distance = Math.abs(left - stripLeft);

          if (distance < bestDist) {
            bestDist = distance;
            best = i;
          }
        });

        index = best;
      });
    }, { passive: true });

    // Keyboard support
    strip.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); scrollToIndex(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); scrollToIndex(index + 1); }
    });

    // Start aligned without moving the page
    strip.scrollLeft = 0;
    index = 0;
  }

  setupStripCarousel();


  /* ======================================================
     3) HEADER COLOR TRANSITION (Top → Coral → Blue)
     ====================================================== */
  const header = document.querySelector(".siteHeader");

  if (header) {
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollBottom = scrollTop + viewportHeight;

      // Near bottom threshold
      const nearBottom = scrollBottom > pageHeight * 0.92;

      if (scrollTop <= 10) {
        header.classList.remove("isScrolled", "isBlue");
      } else if (nearBottom) {
        header.classList.add("isBlue");
        header.classList.remove("isScrolled");
      } else {
        header.classList.add("isScrolled");
        header.classList.remove("isBlue");
      }
    });
  }

});