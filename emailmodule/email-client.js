// =============================================================================
// UNIVERSAL EMAIL CLIENT HELPER (email-client.js)
// • Drop this script on any static website page
// • Automatically binds to any form with: <form data-email-module>
// • No custom JavaScript code required per form!
// =============================================================================

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll("form[data-email-module]");

    forms.forEach(function (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();

        // 1. Find submit button & alert container
        const submitBtn = form.querySelector('[type="submit"]') || form.querySelector("button");
        const originalBtnText = submitBtn ? submitBtn.innerHTML : "Submit";

        let alertBox = form.querySelector(".email-module-alert");
        if (!alertBox) {
          alertBox = document.createElement("div");
          alertBox.className = "email-module-alert";
          alertBox.style.marginTop = "14px";
          alertBox.style.padding = "10px 14px";
          alertBox.style.borderRadius = "6px";
          alertBox.style.fontSize = "14px";
          alertBox.style.display = "none";
          form.appendChild(alertBox);
        }

        // 2. Loading state
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = submitBtn.getAttribute("data-loading-text") || "Sending...";
        }
        alertBox.style.display = "none";
        alertBox.innerText = "";

        // 3. Resolve endpoint (defaults to /emailmodule/send-email.ashx or form action)
        const endpoint = form.getAttribute("action") || "/emailmodule/send-email.ashx";

        try {
          const formData = new FormData(form);
          const response = await fetch(endpoint, {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

          alertBox.style.display = "block";
          if (result.success) {
            alertBox.style.background = "#dcfce7";
            alertBox.style.color = "#15803d";
            alertBox.style.border = "1px solid #bbf7d0";
            alertBox.innerText = result.message || "Thank you! Your message has been sent successfully.";
            form.reset();
          } else {
            alertBox.style.background = "#fee2e2";
            alertBox.style.color = "#b91c1c";
            alertBox.style.border = "1px solid #fecaca";
            alertBox.innerText = result.error || result.message || "Unable to send message. Please try again.";
          }
        } catch (err) {
          alertBox.style.display = "block";
          alertBox.style.background = "#fee2e2";
          alertBox.style.color = "#b91c1c";
          alertBox.style.border = "1px solid #fecaca";
          alertBox.innerText = "Network connection error. Please try again.";
        } finally {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        }
      });
    });
  });
})();

