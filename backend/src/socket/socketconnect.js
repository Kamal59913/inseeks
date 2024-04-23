import {Server} from "socket.io";

export const SocketConnect = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
          origin: process.env.CLIENT_URL, // Replace with the actual origin of your React app
          methods: ['GET', 'POST'],
          allowedHeaders: ['my-custom-header'],
          credentials: true,
        },
      });
    
    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
          console.log('user disconnected');
        });
    
        socket.on('chat message', async (msg) => {
            console.log('message: ', msg);
            io.emit('chat message', msg);
          });
      });
}

