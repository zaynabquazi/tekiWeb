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
