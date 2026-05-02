export const getFullProfileUrl = (profileUrl: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "emperabeauty.com";
  const baseUrlProtocol = process.env.NEXT_PUBLIC_CLIENT_PROTOCOL || "https";
  return `${baseUrlProtocol}://${baseUrl}/${profileUrl}`;
};

export const getFullWebLink = (webLink: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_CLIENT_URL || "emperabeauty.com";
  const baseUrlProtocol = process.env.NEXT_PUBLIC_CLIENT_PROTOCOL || "https";
  return `${baseUrlProtocol}://${baseUrl}/${webLink}`;
};

