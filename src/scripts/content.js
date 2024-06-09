function sendMessageSafe(message) {
  try {
    if (chrome.runtime && chrome.runtime.sendMessage) {
      chrome.runtime.sendMessage(message, response => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        } else if (response.status !== "success") {
          console.error("Failed to handle message:", response.status);
        }
      });
    }
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

document.addEventListener("keydown", event => {
  if (
    event.key === "Shift" &&
    event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT
  ) {
    sendMessageSafe({ type: "keydown", key: "Shift" });
  }
});

document.addEventListener("keyup", event => {
  if (
    event.key === "Shift" &&
    event.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT
  ) {
    sendMessageSafe({ type: "keyup", key: "Shift" });
  }
});

document.addEventListener(
  "wheel",
  event => {
    sendMessageSafe({
      type: "wheel",
      deltaY: event.deltaY
    });
  },
  { passive: false }
);
