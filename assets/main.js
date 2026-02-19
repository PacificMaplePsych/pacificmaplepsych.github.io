
// ===== Inject header and footer so you do not copy/paste per page =====
async function injectPartial(targetId, partialPath) {
  const el = document.getElementById(targetId);
  if (!el) return;

  try {
    const res = await fetch(partialPath, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${partialPath}: ${res.status}`);
    el.innerHTML = await res.text();
  } catch (err) {
    console.error(err);
  }
}

// ===== Navbar behavior (scroll hide/show, hamburger, mobile dropdowns) =====
let lastScrollTop = 0;
let isScrollingMenu = false;

function updateNavbarLinksPosition() {
  const navbar = document.querySelector(".navbar");
  const navbarLinks = document.querySelector(".navbar-links");

  if (window.innerWidth <= 900 && navbar && navbarLinks) {
    const navbarHeight = navbar.offsetHeight;
    navbarLinks.style.top = navbarHeight + "px";
  } else if (navbarLinks) {
    navbarLinks.style.top = "";
  }
}

function bindNavbarInteractions() {
  const navbar = document.querySelector(".navbar");
  const navbarLinks = document.querySelector(".navbar-links");
  const hamburger = document.querySelector(".hamburger");

  if (!navbar || !navbarLinks) return;

  // Track scroll inside mobile menu so we do not collapse the menu while user scrolls menu
  navbarLinks.addEventListener("scroll", () => {
    isScrollingMenu = true;
    clearTimeout(navbarLinks.scrollTimeout);
    navbarLinks.scrollTimeout = setTimeout(() => {
      isScrollingMenu = false;
    }, 150);
  });

  // Hide navbar on scroll down, show on scroll up
  window.addEventListener(
    "scroll",
    function () {
      const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      const navbarHeight = navbar.offsetHeight;

      // If mobile menu open and user is scrolling inside it, do nothing
      if (window.innerWidth <= 900 && navbarLinks.classList.contains("active") && isScrollingMenu) {
        return;
      }

      if (currentScroll > lastScrollTop) {
        navbar.style.top = `-${navbarHeight}px`;

        // Close mobile menu on actual page scroll
        if (window.innerWidth <= 900 && navbarLinks.classList.contains("active")) {
          navbarLinks.classList.remove("active");
          if (hamburger) hamburger.setAttribute("aria-expanded", "false");
        }
      } else {
        navbar.style.top = "0";
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    },
    false
  );

  // Close mobile menu when a link is clicked
  document.querySelectorAll(".navbar-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 900 && navbarLinks.classList.contains("active")) {
        navbarLinks.classList.remove("active");
        if (hamburger) hamburger.setAttribute("aria-expanded", "false");
      }
    });
  });

  // Mobile dropdown toggle
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const title = dropdown.querySelector(".dropdown-title");
    const content = dropdown.querySelector(".dropdown-content");
    if (!title || !content) return;

    title.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        content.classList.toggle("mobile-active");
      }
    });
  });

  updateNavbarLinksPosition();
  window.addEventListener("resize", updateNavbarLinksPosition);
}

// Called by inline onclick in header.html
function toggleMenu() {
  const navbarLinks = document.querySelector(".navbar-links");
  const hamburger = document.querySelector(".hamburger");
  if (!navbarLinks) return;

  navbarLinks.classList.toggle("active");
  updateNavbarLinksPosition();

  if (hamburger) {
    const isOpen = navbarLinks.classList.contains("active");
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
}

// Make toggleMenu globally available
window.toggleMenu = toggleMenu;

document.addEventListener("DOMContentLoaded", async () => {
  // If you have placeholders, inject header/footer
  await injectPartial("site-header", "/assets/header.html");
  await injectPartial("site-footer", "/assets/footer.html");

  // Bind interactions after injection (or if header is already in the page)
  bindNavbarInteractions();
});
