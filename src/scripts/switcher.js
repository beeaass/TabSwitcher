document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggle-switch");

  chrome.storage.local.get("enabled", data => {
    toggleSwitch.checked = data.enabled;
  });

  toggleSwitch.addEventListener("change", () => {
    const enabled = toggleSwitch.checked;
    chrome.runtime.sendMessage({ type: "toggle", enabled }, response => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError.message);
      } else if (response.status !== "success") {
        console.error("Failed to toggle extension:", response.status);
      }
    });
  });
});
