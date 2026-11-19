// Main UI Interactions: Toast notifications & Homepage Tabs
function showToast(message) {
  const toast = document.getElementById("toastBanner");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll("[data-tab-target]");
  const tabPanels = document.querySelectorAll("[data-tab-panel]");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-tab-target");
      tabButtons.forEach((b) => {
        b.classList.remove("btn-primary");
        b.classList.add("btn-outline");
      });
      btn.classList.remove("btn-outline");
      btn.classList.add("btn-primary");

      tabPanels.forEach((panel) => {
        panel.style.display =
          panel.getAttribute("data-tab-panel") === target ? "grid" : "none";
      });
    });
  });
});
