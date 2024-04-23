import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "./app.js";
import { SocketConnect } from "./socket/socketconnect.js";

/*to set up the web socket*/
import {createServer} from "http";

const httpServer = createServer(app);

const port = process.env.PORT || 8000
dotenv.config({
    path:'./env'
})

connectDB()
.then(() =>  {
  httpServer.listen(port, ()=> {
    console.log(`Server is running at port : ${port}`)
  })  
})
.catch((err) => {
    console.log("MONGO db connection failed !!!", err)
})

SocketConnect(httpServer)
