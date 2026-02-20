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

  // Toggle menu open/close
  function setMenuOpen(isOpen) {
    menu.classList.toggle("active", isOpen);
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");

    // When closing menu, also close any open mobile dropdowns
    if (!isOpen) {
      document.querySelectorAll(".dropdown-content.open").forEach((dc) => dc.classList.remove("open"));
      document.querySelectorAll(".dropdown-toggle[aria-expanded='true']").forEach((t) =>
        t.setAttribute("aria-expanded
