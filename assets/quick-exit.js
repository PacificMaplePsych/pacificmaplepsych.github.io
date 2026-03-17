(function addFloatingQuickExit() {
  if (!document.body.classList.contains("abuse-page")) return;
  if (document.querySelector(".floating-quick-exit")) return;

  const btn = document.createElement("div");
  btn.className = "floating-quick-exit";
  btn.innerHTML = `
    <a href="https://www.google.com" aria-label="Quick exit from this page">
      Quick Exit
    </a>
  `;

  document.body.appendChild(btn);

  function positionQuickExit() {
    const header = document.querySelector(".navbar");
    const headerBottom = header ? header.getBoundingClientRect().bottom + window.scrollY : 70;
    const topOffset = headerBottom - window.scrollY + 12;
    document.documentElement.style.setProperty("--quick-exit-top", `${Math.max(topOffset, 12)}px`);
  }

  positionQuickExit();
  window.addEventListener("resize", positionQuickExit);
  window.addEventListener("scroll", positionQuickExit, { passive: true });

  btn.querySelector("a").addEventListener("click", function () {
    try {
      window.location.replace("https://www.google.com");
    } catch (e) {
      window.location.href = "https://www.google.com";
    }
  });
})();
