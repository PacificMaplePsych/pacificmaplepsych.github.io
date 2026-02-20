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

  function setMenuOpen(isOpen) {
    menu.classList.toggle("active", isOpen);
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (!isOpen) {
      document.querySelectorAll(".dropdown-content.open").forEach((dc) => dc.classList.remove("open"));
      document.querySelectorAll(".dropdown-toggle[aria-expanded='true']").forEach((t) =>
        t.setAttribute("aria-expanded", "false")
      );
    }
  }

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.contains("active");
    setMenuOpen(!isOpen);
  });

  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const toggle = dropdown.querySelector(".dropdown-toggle");
    const content = dropdown.querySelector(".dropdown-content");
    if (!toggle || !content) return;

    toggle.addEventListener("click", (e) => {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const willOpen = !content.classList.contains("open");
        content.classList.toggle("open", willOpen);
        toggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
      }
    });
  });

  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;

    const isDropdownToggle = a.classList.contains("dropdown-toggle");
    if (window.innerWidth <= 900 && menu.classList.contains("active") && !isDropdownToggle) {
      setMenuOpen(false);
    }
  });

  let lastY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      if (window.innerWidth > 900) {
        burger.classList.remove("is-hidden");
        return;
      }

      if (menu.classList.contains("active")) {
        burger.classList.remove("is-hidden");
        lastY = window.scrollY;
        return;
      }

      const y = window.scrollY;

      if (y < 10) {
        burger.classList.remove("is-hidden");
        lastY = y;
        return;
      }

      const delta = y - lastY;

      if (delta > 6) {
        burger.classList.add("is-hidden");
      } else if (delta < -6) {
        burger.classList.remove("is-hidden");
      }

      lastY = y;
    },
    { passive: true }
  );

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) {
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
