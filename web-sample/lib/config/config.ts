export const AUTH_CONFIG = {
  TOKEN_NAME: process.env.NEXT_PUBLIC_TOKEN_NAME!,
  REFRESH_TOKEN_NAME: process.env.NEXT_PUBLIC_REFRESH_TOKEN_NAME!,
} as const;

export const COMMENT_DISPLAY_CONFIG = {
  COLLAPSE_BLANK_LINES_IN_LIST: true,
  MAX_BLANK_LINES_IN_LIST: 0,
} as const;

export const TEXT_RENDER_CONFIG = {
  AUTO_LINK_URLS: true,
  OPEN_LINKS_IN_NEW_TAB: true,
} as const;

export const COMPOSER_CONFIG = {
  SHOW_LINK_PREVIEW: true,
  SHOW_COMMENT_LINK_PREVIEW: true,
} as const;

export const PASSWORD_POLICY_CONFIG = {
  MAX_LENGTH: 128,
  INPUT_MAX_LENGTH: 129,
} as const;

export const SHORT_VIDEO_CARD_CONFIG = {
  // Video-card action rail, video controls, reaction picker, and desktop comments layout
  ACTION_ITEM_CLASS:
    "flex w-11 flex-col items-center justify-center gap-1 text-white hover:text-white [&_svg]:size-5!",
  ACTION_COUNT_CLASS: "text-sm font-semibold leading-none drop-shadow-md",
  TOP_CONTROL_BUTTON_CLASS:
    "h-11 w-11 rounded-full bg-black/45 text-white backdrop-blur-md transition-all hover:bg-black/60 border-none shadow-[0_8px_24px_rgba(0,0,0,0.28)]",
  PAUSED_OVERLAY_BUTTON_CLASS:
    "h-20 w-20 rounded-full bg-black/45 text-white backdrop-blur-md transition-all hover:scale-105 hover:bg-black/60 border border-white/10 shadow-[0_16px_45px_rgba(0,0,0,0.35)]",
  REACTION_ICON_CLASS: "!size-6",
  REACTION_ACTIVE_CLASS: "text-[1.5rem] leading-none",
  REACTION_PICKER_CLASS:
    "left-auto right-full mr-3 bottom-0 mb-0 p-1.5 space-x-1.5",
  REACTION_PICKER_BUTTON_CLASS: "w-8 h-8 text-lg",
  DESKTOP_COMMENTS_PANEL_TOP: 186,
  DESKTOP_COMMENTS_PANEL_LEFT: 1346,
  DESKTOP_COMMENTS_PANEL_WIDTH: 432,
  DESKTOP_COMMENTS_PANEL_HEIGHT: 707,
  DESKTOP_COMMENTS_PANEL_VIEWPORT_PADDING: 24,
  MOBILE_COMMENTS_SHEET_HEIGHT_RATIO: 0.78,
} as const;

export const POST_CREATION_CONFIG = {
  MAX_MEDIA_ATTACHMENTS: 20,
} as const;
