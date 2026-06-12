/* Instituto Multicare — comportamento da casca compartilhada */
(function () {
  "use strict";

  /* ---- Navbar: estado ao rolar ---- */
  const nav = document.querySelector("[data-nav]");
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Navbar: menu mobile ---- */
  const toggle = document.querySelector("[data-nav-toggle]");
  const panel = document.querySelector("[data-nav-panel]");
  if (toggle && panel) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-open", open);
      if (nav) nav.classList.toggle("is-menu-open", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    panel.querySelectorAll("a").forEach((link) =>
      link.addEventListener("click", () => setOpen(false))
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---- Acordeão (um aberto por vez) ---- */
  const setItemOpen = (trigger, open) => {
    const panelEl = document.getElementById(
      trigger.getAttribute("aria-controls")
    );
    trigger.setAttribute("aria-expanded", String(open));
    if (panelEl) panelEl.classList.toggle("is-open", open);
  };
  document.querySelectorAll("[data-accordion]").forEach((trigger) => {
    if (!document.getElementById(trigger.getAttribute("aria-controls"))) return;
    trigger.addEventListener("click", () => {
      const willOpen = trigger.getAttribute("aria-expanded") !== "true";
      // Ao abrir um item, fecha os demais do mesmo acordeão.
      if (willOpen) {
        const group = trigger.closest(".accordion");
        if (group) {
          group.querySelectorAll("[data-accordion]").forEach((other) => {
            if (other !== trigger && other.getAttribute("aria-expanded") === "true") {
              setItemOpen(other, false);
            }
          });
        }
      }
      setItemOpen(trigger, willOpen);
    });
  });

  /* ---- Revelação suave ao entrar na viewport (load + scroll) ---- */
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length) {
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
      );
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("is-visible"));
    }
  }

  /* ---- Ano no rodapé ---- */
  const yearEl = document.querySelector("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
