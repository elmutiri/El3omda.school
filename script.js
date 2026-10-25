
/* ==========================================
   ELMUTIRI | School Interactive Website
   Complete JavaScript
========================================== */

// 1. Current year
const yearElement = document.getElementById("currentYear");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// 2. Mobile navigation
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

function closeMenu() {
  if (!menuToggle || !mainNav) return;

  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "فتح القائمة");
  menuToggle.textContent = "☰";
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "إغلاق القائمة" : "فتح القائمة"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    if (
      !mainNav.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}

// 3. Reveal animations
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -20px 0px"
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

// 4. Image lightbox
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxClose = document.getElementById("lightboxClose");

let previousFocus = null;

function closeLightbox() {
  if (!lightbox || !lightbox.classList.contains("active")) return;

  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";

  if (lightboxImage) {
    lightboxImage.removeAttribute("src");
  }

  previousFocus?.focus();
}

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    const img = item.querySelector("img");

    if (
      !lightbox ||
      !lightboxImage ||
      !img ||
      !img.complete ||
      !img.naturalWidth
    ) {
      return;
    }

    previousFocus = item;

    lightboxImage.src = item.dataset.image || img.currentSrc || img.src;
    lightboxImage.alt =
      item.dataset.caption || "صورة من المدرسة";

    if (lightboxCaption) {
      lightboxCaption.textContent = item.dataset.caption || "";
    }

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";

    lightboxClose?.focus();
  });
});

lightboxClose?.addEventListener("click", closeLightbox);

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

// 5. Smooth navigation
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");

    if (!id || id === "#") return;

    const target = document.getElementById(id.slice(1));

    if (target) {
      event.preventDefault();

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start"
      });

      history.replaceState(null, "", id);
    }
  });
});

// 6. Dark / Light theme
(() => {
  const button = document.getElementById("themeToggle");
  const icon = document.getElementById("themeIcon");

  if (!button || !icon) return;

  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("elmutiri-theme");
  } catch (error) {
    console.warn("Theme storage unavailable.");
  }

  function applyTheme(dark) {
    document.body.classList.toggle("dark-mode", dark);

    icon.textContent = dark ? "☀" : "☾";

    button.setAttribute("aria-pressed", String(dark));

    button.setAttribute(
      "aria-label",
      dark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"
    );

    document.documentElement.style.colorScheme =
      dark ? "dark" : "light";
  }

  applyTheme(savedTheme === "dark");

  button.addEventListener("click", () => {
    const dark = !document.body.classList.contains("dark-mode");

    applyTheme(dark);

    try {
      localStorage.setItem(
        "elmutiri-theme",
        dark ? "dark" : "light"
      );
    } catch (error) {
      console.warn("Could not save theme.");
    }
  });
})();

// 7. Interactive mouse spotlight
const interactiveCards = document.querySelectorAll(
  ".stat-card, .panel, .card, .feature-card, .gallery-item"
);

interactiveCards.forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  });

  card.addEventListener("pointerleave", () => {
    card.style.removeProperty("--mouse-x");
    card.style.removeProperty("--mouse-y");
  });
});

console.log("ELmutiri | School website ready");

/* =========================================
   ELMUTIRI | GLOBAL INTERACTION ENGINE
========================================= */

(() => {
  const interactiveSelector = [
    ".card",
    ".stat-card",
    ".panel",
    ".feature-card",
    ".gallery-item",
    ".info-card",
    ".news-card",
    ".activity-card",
    ".image-card"
  ].join(", ");

  const elements = document.querySelectorAll(interactiveSelector);

  elements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;

      const rect = element.getBoundingClientRect();

      element.style.setProperty(
        "--mouse-x",
        `${event.clientX - rect.left}px`
      );

      element.style.setProperty(
        "--mouse-y",
        `${event.clientY - rect.top}px`
      );
    });

    element.addEventListener("pointerleave", () => {
      element.style.removeProperty("--mouse-x");
      element.style.removeProperty("--mouse-y");
    });
  });

  console.log(
    `ELmutiri | Interactive engine active on ${elements.length} elements`
  );
})();
