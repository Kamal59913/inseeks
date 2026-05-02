import { ToastService } from "./toastService";

export const copyToClipboard = (
  text: string,
  successMessage: string = "Link copied to clipboard!",
) => {
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        ToastService.success(successMessage, "toast-service");
      })
      .catch(() => {
        fallbackCopy(text, successMessage);
      });
  } else {
    fallbackCopy(text, successMessage);
  }
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

  document.body.appendChild(textArea);

  // Selection logic for multiple platforms
  const isiOS = navigator.userAgent.match(/ipad|iphone/i);

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
      ToastService.success(successMessage, "copy-success");
    } else {
      throw new Error("Copy failed");
    }
  } catch (err) {
    console.error("Fallback copy failed", err);
    ToastService.error("Please copy the link manually", "copy-error");
  } finally {
    document.body.removeChild(textArea);
  }
};

