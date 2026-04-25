export const PERMISSIONS = {
  CATEGORY: {
    CREATE: "category:create",
    READ: "category:read",
    UPDATE: "category:update",
    DELETE: "category:delete",
  },
  BLOG: {
    CREATE: "blog:create",
    READ: "blog:read",
    UPDATE: "blog:update",
    DELETE: "blog:delete",
  },
  USER: {
    CREATE: "user:create",
    READ: "user:read",
    UPDATE: "user:update",
    DELETE: "user:delete",
  },
  ROLE: {
    CREATE: "role:create",
    READ: "role:read",
    UPDATE: "role:update",
    DELETE: "role:delete",
  },
  PERMISSION: {
    CREATE: "permission:create",
    READ: "permission:read",
    UPDATE: "permission:update",
    DELETE: "permission:delete",
  },
} as const;

export type Permission =
  | (typeof PERMISSIONS.CATEGORY)[keyof typeof PERMISSIONS.CATEGORY]
  | (typeof PERMISSIONS.BLOG)[keyof typeof PERMISSIONS.BLOG]
  | (typeof PERMISSIONS.USER)[keyof typeof PERMISSIONS.USER]
  | (typeof PERMISSIONS.ROLE)[keyof typeof PERMISSIONS.ROLE]
  | (typeof PERMISSIONS.PERMISSION)[keyof typeof PERMISSIONS.PERMISSION];

/*The above means this:
export type Permission = "category:create" | "category:read" | "category:update" | "category:delete"
  | "blog:create" | "blog:read" | "blog:update" | "blog:delete"
  | "user:create" | "user:read" | "user:update" | "user:delete";
*/
