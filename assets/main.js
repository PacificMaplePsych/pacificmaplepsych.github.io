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

// ===== Footer year =====
function setFooterYear() {
  const y = document.getElementById("footerYear");
  if (y) y.textContent = String(new Date().getFullYear());
}

// ===== Navbar behavior (mobile menu + mobile dropdowns + collapse opened menu on scroll) =====
function bindNavbarInteractions() {
  const menu = document.querySelector(".navbar-links");
  const burger = document.querySelector(".hamburger");
  if (!menu || !burger) return;

  const navBreakPx = 1050;

  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-content.open").forEach((dc) => dc.classList.remove("open"));
    document.querySelectorAll(".dropdown-toggle[aria-expanded='true']").forEach((t) =>
      t.setAttribute("aria-expanded", "false")
    );
  }

  function setMenuOpen(isOpen) {
    menu.classList.toggle("active", isOpen);
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    if (!isOpen) closeAllDropdowns();
  }

  // Hamburger click
  burger.addEventListener("click", () => {
    setMenuOpen(!menu.classList.contains("active"));
  });

  // Mobile dropdown toggle: only one open at a time
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const content = dropdown.querySelector(".dropdown-content");
    if (!toggle || !content) return;

    toggle.addEventListener("click", (e) => {
      if (window.innerWidth <= navBreakPx) {
        e.preventDefault();

        const willOpen = !content.classList.contains("open");
        closeAllDropdowns();

        if (willOpen) {
          content.classList.add("open");
          toggle.setAttribute("aria-expanded", "true");
        } else {
          content.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  });

  // Close menu when clicking a normal link on mobile
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    const isToggle = a.classList.contains("dropdown-toggle");
    if (window.innerWidth <= navBreakPx && menu.classList.contains("active") && !isToggle) {
      setMenuOpen(false);
    }
  });

  // Mobile: if menu is open and user scrolls, collapse it
  let lastY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      if (window.innerWidth > navBreakPx) return;

      const yNow = window.scrollY;

      // If menu is open, collapse it when user scrolls (but keep hamburger visible/clickable)
      if (menu.classList.contains("active")) {
        if (Math.abs(yNow - lastY) > 6) setMenuOpen(false);
      }

      lastY = yNow;
    },
    { passive: true }
  );

  // On resize, close the mobile menu to prevent weird states
  window.addEventListener("resize", () => {
    if (window.innerWidth > navBreakPx) {
      setMenuOpen(false);
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await injectPartial("site-header", "/assets/header.html");
  await injectPartial("site-footer", "/assets/footer.html");

  setFooterYear();
  bindNavbarInteractions();
});
