import { UAParser } from "ua-parser-js";

export const getUserAgentDetails = () => {
  if (typeof window === "undefined") return null;

  const parser = new UAParser();
  return {
    browser: parser.getBrowser(),
    engine: parser.getEngine(),
    os: parser.getOS(),
    device: parser.getDevice(),
    cpu: parser.getCPU(),
  };
};

export function shouldShowApplePay(): boolean {
  if (typeof window === "undefined") return false;

  const parser = new UAParser();
  const result = parser.getResult();

  const osName = result.os.name;
  const browserName = result.browser.name;
  const deviceModel = result.device.model;

  // Check for iPhone or iPad
  const isIPhone =
    deviceModel?.toLowerCase().includes("iphone") ||
    deviceModel?.toLowerCase().includes("ipad") ||
    osName === "iOS";
  // Check for Mac with Safari
  const isMacSafari =
    (osName === "Mac OS" || osName === "macOS") && browserName === "Safari";
  return isIPhone || isMacSafari;
}

