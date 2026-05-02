export interface Notification {
  id: number;
  title: string;
  message: string;
  is_read: boolean;
  notification_type: "like" | "follow" | "comment" | "system" | string;
  reference_id: number;
  reference_type: string;
  profile_image: string | null;
  created_at: string;
}

export interface NotificationResponse {
  message: string;
  data: Notification[];
}
