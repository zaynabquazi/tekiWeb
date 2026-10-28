/* ==========================================================================
   Teki — shared behavior (progressive enhancement, no modules)
   Wires up [data-toggle='play'] controls. No-ops cleanly on pages that
   have none of these controls. Reduced-motion aware.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    var toggles = document.querySelectorAll("[data-toggle='play']");
    if (!toggles.length) {
      return; // Nothing to wire up on this page — exit cleanly.
    }

    Array.prototype.forEach.call(toggles, function (btn) {
      var targetId = btn.getAttribute("aria-controls");
      var target = targetId ? document.getElementById(targetId) : null;

      // Which class this control manages: captions vs. play/pause.
      var stateClass =
        btn.getAttribute("data-state-class") ||
        (btn.getAttribute("data-mode") === "captions"
          ? "captions-on"
          : "playing");

      // Optional label pair: data-label-on / data-label-off.
      var labelOn = btn.getAttribute("data-label-on");
      var labelOff = btn.getAttribute("data-label-off");

      // Establish an initial state. If reduced motion is requested, start
      // paused so no animation runs on load.
      var pressed = btn.getAttribute("aria-pressed") === "true";
      if (prefersReducedMotion && stateClass === "playing") {
        pressed = false;
      }
      applyState(btn, target, stateClass, pressed, labelOn, labelOff);

      btn.addEventListener("click", function () {
        var next = btn.getAttribute("aria-pressed") !== "true";
        applyState(btn, target, stateClass, next, labelOn, labelOff);
      });
    });
  });

  function applyState(btn, target, stateClass, pressed, labelOn, labelOff) {
    btn.setAttribute("aria-pressed", pressed ? "true" : "false");

    if (target) {
      target.classList.toggle(stateClass, pressed);
    }

    if (labelOn && labelOff) {
      btn.textContent = pressed ? labelOn : labelOff;
    }
  }
})();

/* ==========================================================================
   Teki — visual polish behavior (scroll-reveal + frosted-nav scrolled state)
   Separate self-contained IIFE so it is never skipped by the play-toggle
   early return above. Progressive enhancement, reduced-motion aware.
   ========================================================================== */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ---- Scroll reveal --------------------------------------------------
    // Only opt in (adding the `js-reveal` hook) when motion is welcome and
    // IntersectionObserver is available. Otherwise the CSS leaves every
    // `.reveal` element fully visible — safe for no-JS / unsupported too.
    var revealEls = document.querySelectorAll(".reveal");
    if (
      !prefersReducedMotion &&
      "IntersectionObserver" in window &&
      revealEls.length
    ) {
      document.documentElement.classList.add("js-reveal");

      var observer = new IntersectionObserver(
        function (entries, obs) {
          Array.prototype.forEach.call(entries, function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );

      Array.prototype.forEach.call(revealEls, function (el) {
        observer.observe(el);
      });
    }

    // ---- Frosted nav scrolled state ------------------------------------
    // Toggles a static shadow/border state (no motion), so it runs even
    // under reduced motion. No-ops cleanly if the header is absent.
    var header = document.querySelector(".site-header");
    if (header) {
      var ticking = false;

      var updateScrolled = function () {
        header.classList.toggle("scrolled", window.scrollY > 4);
        ticking = false;
      };

      var onScroll = function () {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateScrolled);
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      updateScrolled(); // set the initial state on load
    }
  });
})();
