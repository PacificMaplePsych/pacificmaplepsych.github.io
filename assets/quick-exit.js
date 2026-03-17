(function addFloatingQuickExit() {
  if (!document.body.classList.contains("abuse-page")) return;
  if (document.querySelector(".floating-quick-exit")) return;

  const QUICK_EXIT_URL = "https://www.google.com";
  const QUICK_EXIT_FLAG = "quickExitTriggered";

  function redirectIfReturningAfterQuickExit() {
    let navType = "";

    try {
      const navEntries = performance.getEntriesByType("navigation");
      if (navEntries && navEntries.length) {
        navType = navEntries[0].type;
      }
    } catch (err) {}

    const cameBackViaHistory =
      navType === "back_forward" ||
      (window.performance &&
        window.performance.navigation &&
        window.performance.navigation.type === 2);

    if (cameBackViaHistory && sessionStorage.getItem(QUICK_EXIT_FLAG) === "true") {
      window.location.replace(QUICK_EXIT_URL);
    }
  }

  function positionQuickExit() {
    const btn = document.querySelector(".floating-quick-exit");
    if (!btn) return;

    const header = document.querySelector(".navbar");
    if (!header) return;

    const rect = header.getBoundingClientRect();
    const topOffset = rect.bottom + 12;

    document.documentElement.style.setProperty(
      "--quick-exit-top",
      `${Math.max(topOffset, 12)}px`
    );
  }

  function createQuickExit() {
    if (document.querySelector(".floating-quick-exit")) return;

    const btn = document.createElement("div");
    btn.className = "floating-quick-exit";
    btn.innerHTML = `
      <a href="${QUICK_EXIT_URL}" aria-label="Quick exit from this page">
        Quick Exit
      </a>
    `;

    document.body.appendChild(btn);

    const link = btn.querySelector("a");
    if (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        try {
          sessionStorage.setItem(QUICK_EXIT_FLAG, "true");
        } catch (err) {}

        try {
          window.location.replace(QUICK_EXIT_URL);
        } catch (err) {
          window.location.href = QUICK_EXIT_URL;
        }
      });
    }

    positionQuickExit();

    requestAnimationFrame(() => {
      positionQuickExit();
      btn.classList.add("is-ready");
    });

    setTimeout(() => {
      positionQuickExit();
      btn.classList.add("is-ready");
    }, 100);
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

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  redirectIfReturningAfterQuickExit();

  window.addEventListener("pageshow", redirectIfReturningAfterQuickExit);
  window.addEventListener("resize", positionQuickExit);
  window.addEventListener("scroll", positionQuickExit, { passive: true });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForNavbarAndInit);
  } else {
    waitForNavbarAndInit();
  }
})();
