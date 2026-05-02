// ─── Modal data payloads ────────────────────────────────────────────────────

export interface CreateEnvData {
  envName?: string;
  EnvDescription?: string;
  envCoverImage?: File;
}

export interface ViewPostData {
  postId: string;
}

/**
 * Map of modal type keys → their expected data payloads.
 * Add new entries here whenever you add a new modal to the registry.
 */
export interface ModalDataMap {
  'create-env': CreateEnvData;
  'delete-avatar': undefined;
  'post-anything': undefined;
  'post-image': undefined;
  'post-video': undefined;
  'replace-avatar': undefined;
  'view-blog-post': ViewPostData;
  'view-image-post': ViewPostData;
  'view-video-post': ViewPostData;
  'log-out': { title: string; action: () => void };
}

export type ModalName = keyof ModalDataMap;

export interface ModalEntry {
  id: string;
  type: ModalName;
  data?: any; // kept as any for internal store; strictly typed at the call site
}

/** Props injected into every modal component by ModalContainer */
export interface ModalComponentProps<T = any> {
  modalId: string;
  data?: T;
}
