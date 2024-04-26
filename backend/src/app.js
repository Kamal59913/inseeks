import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express()
/*Here we are configuring cors*/

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

/*Setting the Json limit*/
app.use(express.json({limit:"16kb"}))

/*Configuration for url spaces*/
app.use(express.urlencoded({extended: true, limit:"16kb"}))

/*To store in public assets, like images, fevicons etc.*/
app.use(express.static("public"))

/*Configuration for Cookie Parser*/
app.use(cookieParser())

//routes import
import userRouter from './routes/user.routes.js'
import createpostRouter from './routes/createpost.routes.js'
import followRouter from './routes/follow.routes.js'
import commentRouter from './routes/comment.routes.js'
import likeRouter from './routes/like.route.js'
import createEnvRouter from './routes/env.route.js'

//routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/createpost", createpostRouter)
app.use("/api/v1/follow", followRouter)
app.use("/api/v1/comment", commentRouter)
app.use("/api/v1/like", likeRouter)
app.use("/api/v1/env", createEnvRouter)

export {app}