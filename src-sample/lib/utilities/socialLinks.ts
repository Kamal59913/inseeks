import { ToastService } from "./toastService";

/**
 * Opens the Empera Instagram profile in a new tab.
 * Uses NEXT_PUBLIC_EMPERA_INSTAGRAM_ID environment variable.
 */
export const handleInstagramOpen = () => {
  const instagramUrl = process.env.NEXT_PUBLIC_EMPERA_INSTAGRAM_ID;

  if (!instagramUrl) {
    ToastService.error(
      "Instagram URL not configured",
      "instagram_url_not_found"
    );
    return;
  }

  window.open(instagramUrl, "_blank", "noopener,noreferrer");
};

/**
 * Opens Empera WhatsApp contact in a new tab.
 * Uses NEXT_PUBLIC_EMPERA_WHATSAPP_ID environment variable.
 */
export const handleWhatsappOpen = () => {
  const whatsappId = process.env.NEXT_PUBLIC_EMPERA_WHATSAPP_ID;

  if (!whatsappId) {
    ToastService.error(
      "WhatsApp contact not configured",
      "whatsapp_url_not_found"
    );
    return;
  }

  // Handle both full URLs and phone numbers/IDs
  const url = whatsappId.startsWith("http")
    ? whatsappId
    : `https://wa.me/${whatsappId}`;

  window.open(url, "_blank", "noopener,noreferrer");
};

/**
 * Shares a message via WhatsApp.
 * Uses wa.me link with encoded text.
 */
export const shareViaWhatsApp = (message: string) => {
  if (!message) {
    ToastService.error("Message is empty", "message_empty");
    return;
  }

  // Use wa.me for universal compatibility (web + mobile)
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};

export const LinkOpener = (link: string) => {
  if (!link) {
    ToastService.error("Link not found", "link_not_found");
    return;
  }

  window.open(link, "_blank", "noopener,noreferrer");
};

