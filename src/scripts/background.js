let shiftPressed = false;
let enabled = true;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.set({ enabled: true });
});

chrome.storage.local.get("enabled", data => {
  enabled = data.enabled;
});

chrome.storage.onChanged.addListener(changes => {
  if (changes.enabled) {
    enabled = changes.enabled.newValue;
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "toggle") {
    enabled = message.enabled;
    chrome.storage.local.set({ enabled });
    sendResponse({ status: "success" });
  } else if (message.type === "keydown" && message.key === "Shift") {
    shiftPressed = true;
    sendResponse({ status: "success" });
  } else if (message.type === "keyup" && message.key === "Shift") {
    shiftPressed = false;
    sendResponse({ status: "success" });
  } else if (message.type === "wheel" && shiftPressed && enabled) {
    const direction = message.deltaY < 0 ? -1 : 1;
    chrome.tabs.query({ currentWindow: true }, tabs => {
      chrome.tabs.query({ active: true, currentWindow: true }, activeTabs => {
        let currentIndex = activeTabs[0].index;
        let newIndex = (currentIndex + direction + tabs.length) % tabs.length;
        chrome.tabs.update(tabs[newIndex].id, { active: true }, () => {
          sendResponse({ status: "success" });
        });
      });
    });
    return true;
  } else {
    sendResponse({ status: "unknown message type" });
  }
});
