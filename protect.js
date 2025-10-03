// protect.js

// Disable right-click
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
  alert("🚫 Right-click is disabled on this page.");
});

// Disable DevTools shortcuts
document.addEventListener("keydown", function (e) {
  // F12
  if (e.key === "F12") {
    e.preventDefault();
    alert("🚫 Developer tools are disabled.");
  }

  // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C
  if (e.ctrlKey && e.shiftKey && ["I", "J", "C"].includes(e.key)) {
    e.preventDefault();
    alert("🚫 Developer tools are disabled.");
  }

  // Ctrl+U (View Source)
  if (e.ctrlKey && e.key.toLowerCase() === "u") {
    e.preventDefault();
    alert("🚫 Viewing source is disabled.");
  }
});
