/**
 * Copies text to the clipboard with a fallback for non-secure contexts (HTTP)
 * and older browsers.
 *
 * @param text The text to copy
 * @param successMessage Optional success message for the toast
 */
export const copyToClipboard = async (
  text: string,
  successMessage: string = "Link copied to clipboard!",
) => {
  // Try using the modern Clipboard API first (requires HTTPS or localhost)
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage);
      return;
    } catch (error) {
      console.error("Modern clipboard copy failed, falling back...", error);
    }
  }

  // Fallback for HTTP or unsupported browsers
  fallbackCopy(text, successMessage);
};

const fallbackCopy = (text: string, successMessage: string) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;

  // Ensure it's not visible but still "renderable"
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";

  // Important for mobile: prevent keyboard from popping up
  textArea.readOnly = true;

  // Append to the active element's parent if available to handle focus traps in modals
  const activeElement = document.activeElement;
  const container = activeElement?.parentElement || document.body;
  container.appendChild(textArea);

  // Selection logic for multiple platforms
  const isiOS = !!navigator.userAgent.match(/ipad|iphone/i);

  if (isiOS) {
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
    textArea.setSelectionRange(0, 999999);
  } else {
    textArea.select();
  }

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      showToast(successMessage);
    } else {
      throw new Error("Copy failed");
    }
  } catch (err) {
    console.error("Fallback copy failed", err);
    showToast("Please copy the link manually", true);
  } finally {
    document.body.removeChild(textArea);
  }
};

/**
 * Simple DOM-based toast notification for copying
 */
const showToast = (message: string, isError: boolean = false) => {
  const toast = document.createElement("div");
  toast.innerText = message;
  toast.style.position = "fixed";
  toast.style.bottom = "20px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.backgroundColor = isError ? "#ef4444" : "#10b981"; // Red for error, emerald for success
  toast.style.color = "white";
  toast.style.padding = "10px 20px";
  toast.style.borderRadius = "8px";
  toast.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
  toast.style.zIndex = "9999";
  toast.style.fontSize = "14px";
  toast.style.fontFamily = "inherit";
  toast.style.transition = "opacity 0.3s ease";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 3000);
};
