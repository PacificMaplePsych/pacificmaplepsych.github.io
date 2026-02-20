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

// ===== Navbar behavior (mobile menu + mobile dropdowns + hide hamburger on scroll) =====
function bindNavbarInteractions() {
  const nav = document.querySelector(".navbar");
  const menu = document.querySelector(".navbar-links");
  const burger = document.querySelector(".hamburger");
  if (!nav || !menu || !burger) return;

  const navBreakPx = 1050; // must match CSS --nav-break

  function closeAllDropdowns() {
    document.querySelectorAll(".dropdown-content.open").forEach((dc) => dc.classList.remove("open"));
    document.querySelectorAll(".dropdown-toggle[aria-expanded='true']").forEach((t) =>
      t.setAttribute("aria-expanded", "false")
    );
  }

  function setMenuOpen(isOpen) {
    menu.classList.toggle("active", isOpen);
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (!isOpen) {
      closeAllDropdowns();
    }
  }

  // Toggle hamburger menu open/close
  burger.addEventListener("click", () => {
    const isOpen = menu.classList.contains("active");
    setMenuOpen(!isOpen);
  });

  // (4) Mobile: only one dropdown open at a time
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const content = dropdown.querySelector(".dropdown-content");
    if (!toggle || !content) return;

    toggle.addEventListener("click", (e) => {
      if (window.innerWidth <= navBreakPx) {
        e.preventDefault();

        const willOpen = !content.classList.contains("open");

        // close others first
        closeAllDropdowns();

        // then open this one if requested
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

  // Close menu when clicking a normal link (not dropdown toggles) on mobile
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    const isDropdownToggle = a.classList.contains("dropdown-toggle");
    if (window.innerWidth <= navBreakPx && menu.classList.contains("active") && !isDropdownToggle) {
      setMenuOpen(false);
    }
  });

  // (5) Mobile: if user scrolls while menu is open, collapse it.
  // Also hide ONLY hamburger on scroll when menu is closed.
  let lastY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      if (window.innerWidth > navBreakPx) {
        burger.classList.remove("is-hidden");
        return;
      }

      // If menu is open, collapse it on any meaningful scroll
      if (menu.classList.contains("active")) {
        const yNow = window.scrollY;
        if (Math.abs(yNow - lastY) > 6) {
          setMenuOpen(false);
        }
        lastY = yNow;
        burger.classList.remove("is-hidden");
        return;
      }

      const y = window.scrollY;
      const goingDown = y > lastY + 2;
      const goingUp = y < lastY - 2;

      if (goingDown) burger.classList.add("is-hidden");
      if (goingUp) burger.classList.remove("is-hidden");

      lastY = y;
    },
    { passive: true }
  );

  // On resize, close the mobile menu to prevent weird states
  window.addEventListener("resize", () => {
    if (window.innerWidth > navBreakPx) {
      setMenuOpen(false);
      burger.classList.remove("is-hidden");
    }
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  await injectPartial("site-header", "/assets/header.html");
  await injectPartial("site-footer", "/assets/footer.html");

  setFooterYear();
  bindNavbarInteractions();
});
