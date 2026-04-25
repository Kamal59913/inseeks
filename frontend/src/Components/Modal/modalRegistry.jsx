import BlogPost from "../Pages/blogpost";
import ImagePost from "../Pages/imagepost";
import VideoPost from "../Pages/videopost";
import { CreateEnv } from "../CreatePost/createEnv";
import DeleteImage from "../CreatePost/deleteimage";
import { PostAnyThing } from "../CreatePost/postAnything";
import { PostImages } from "../CreatePost/postImage";
import { PostVideo } from "../CreatePost/postVideo";
import ReplaceImages from "../CreatePost/replaceprofileimage";

export const MODAL_REGISTRY = {
  "create-env": CreateEnv,
  "delete-avatar": DeleteImage,
  "post-anything": PostAnyThing,
  "post-image": PostImages,
  "post-video": PostVideo,
  "replace-avatar": ReplaceImages,
  "view-blog-post": BlogPost,
  "view-image-post": ImagePost,
  "view-video-post": VideoPost,
};
