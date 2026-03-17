(function addFloatingQuickExit() {
  if (!document.body.classList.contains("abuse-page")) return;
  if (document.querySelector(".floating-quick-exit")) return;

  function positionQuickExit() {
    const btn = document.querySelector(".floating-quick-exit");
    if (!btn) return;

    const header = document.querySelector(".navbar");
    if (!header) return;

    const rect = header.getBoundingClientRect();
    const topOffset = rect.bottom + 12;
    document.documentElement.style.setProperty("--quick-exit-top", `${Math.max(topOffset, 12)}px`);
  }

  function createQuickExit() {
    if (document.querySelector(".floating-quick-exit")) return;

    const btn = document.createElement("div");
    btn.className = "floating-quick-exit";
    btn.innerHTML = `
      <a href="https://www.google.com" aria-label="Quick exit from this page">
        Quick Exit
      </a>
    `;
    document.body.appendChild(btn);

    btn.querySelector("a").addEventListener("click", function (e) {
      e.preventDefault();
      try {
        window.location.replace("https://www.google.com");
      } catch (err) {
        window.location.href = "https://www.google.com";
      }
    });

    positionQuickExit();
    requestAnimationFrame(positionQuickExit);
    setTimeout(positionQuickExit, 100);
  }

  function waitForNavbarAndInit() {
    const header = document.querySelector(".navbar");

    if (header) {
      createQuickExit();
      return;
    }

    const observer = new MutationObserver(() => {
      const injectedHeader = document.querySelector(".navbar");
      if (injectedHeader) {
        observer.disconnect();
        createQuickExit();
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  window.addEventListener("resize", positionQuickExit);
  window.addEventListener("scroll", positionQuickExit, { passive: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForNavbarAndInit);
  } else {
    waitForNavbarAndInit();
  }
})();
