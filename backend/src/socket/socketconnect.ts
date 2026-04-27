import { Server } from "socket.io";

type DiscussionUser = {
  username?: string;
  avatar?: string;
};

type RoomUserMap = Map<string, DiscussionUser>;

let ioInstance: Server | null = null;
const roomParticipants = new Map<string, RoomUserMap>();

const getRoomName = (postId: string) => `discussion:${postId}`;

const getAllowedOrigins = () =>
  (process.env.CORS_ORIGIN || process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const emitPresence = (postId: string) => {
  if (!ioInstance) return;

  const roomName = getRoomName(postId);
  const participants = Array.from(roomParticipants.get(roomName)?.values() || []);

  ioInstance.to(roomName).emit("discussion:presence", {
    postId,
    participants,
  });
};

const leaveDiscussionRoom = (socket: any) => {
  const currentPostId = socket.data?.currentPostId;
  const currentUser = socket.data?.currentUser;

  if (!currentPostId) return;

  const roomName = getRoomName(currentPostId);
  const participants = roomParticipants.get(roomName);

  if (participants) {
    participants.delete(socket.id);
    if (participants.size === 0) {
      roomParticipants.delete(roomName);
    }
  }

  socket.leave(roomName);
  socket.to(roomName).emit("discussion:user-left", {
    postId: currentPostId,
    user: currentUser,
    leftAt: new Date().toISOString(),
  });
  emitPresence(currentPostId);
  socket.data.currentPostId = null;
};

export const getIO = () => ioInstance;

export const SocketConnect = (httpServer: any) => {
  ioInstance = new Server(httpServer, {
    cors: {
      origin: getAllowedOrigins(),
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  ioInstance.on("connection", (socket) => {
    socket.on("discussion:join", ({ postId, user }) => {
      if (!postId) return;

      leaveDiscussionRoom(socket);

      const roomName = getRoomName(postId);
      const normalizedUser: DiscussionUser = {
        username: user?.username || "Anonymous",
        avatar: user?.avatar,
      };

      socket.join(roomName);
      socket.data.currentPostId = postId;
      socket.data.currentUser = normalizedUser;

      const participants = roomParticipants.get(roomName) || new Map<string, DiscussionUser>();
      participants.set(socket.id, normalizedUser);
      roomParticipants.set(roomName, participants);

      socket.to(roomName).emit("discussion:user-joined", {
        postId,
        user: normalizedUser,
        joinedAt: new Date().toISOString(),
      });

      emitPresence(postId);
    });

    socket.on("discussion:leave", () => {
      leaveDiscussionRoom(socket);
    });

    socket.on("discussion:typing", ({ postId, user, isTyping }) => {
      if (!postId) return;

      socket.to(getRoomName(postId)).emit("discussion:typing", {
        postId,
        user: {
          username: user?.username || socket.data?.currentUser?.username || "Anonymous",
          avatar: user?.avatar || socket.data?.currentUser?.avatar,
        },
        isTyping: Boolean(isTyping),
      });
    });

    socket.on("disconnect", () => {
      leaveDiscussionRoom(socket);
    });
  });
};
