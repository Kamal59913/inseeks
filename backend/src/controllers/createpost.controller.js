import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { BlogPost } from "../models/blogpost.model.js";
import { VideoPost } from "../models/videopost.model.js";
import { ImagePost } from "../models/imagepost.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import mongoose from "mongoose";

const createPost = asyncHandler(async (req, res) => {
    const {title, description} = req.body;
    const imagePath = req.file?.path;

    console.log(title, description, imagePath)

    let image;
    if(imagePath) {
        image = await uploadOnCloudinary(imagePath)
        if(!image.url) {
            throw new ApiError(400, "Error while uploading on avatar")
        }
    }

    if(title === "") {
        throw new ApiError(400, "Adding a title is required")
    }

    const postData = {
        title,
        description,
        PostAuthor: req.user._id
    }
    if(image) {
        postData.image = image.url;
    }

    const post = await BlogPost.create(postData)

    const UserAggregate = await BlogPost.aggregate([
        {
            $match: {
                _id: post._id
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'PostAuthor',
                foreignField: '_id',
                as: 'author',
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                        
                    }
                ]
            }
        }
        
    ])
     
    return res
    .status(201)
    .json(
        new ApiResponse(200, UserAggregate, "The post has been successfully created")
    )
})

const createVideoPost = asyncHandler(async (req, res) => {
    const {description} = req.body;
    
    const videoPath = req.file?.path;
    console.log(videoPath,"videoPath")
    let video;
    if(videoPath) {
        video = await uploadOnCloudinary(videoPath)
        console.log(video)
        if(!video.url) {
            throw new ApiError(400, "Error while uploading on video")
        }
    }

    if(description === "") {
        throw new ApiError(400, "Adding a description is required")
    }

    const post = await VideoPost.create({       
            description,
            PostAuthor: req.user._id,
            video: video.url
        
    })

    const UserAggregate = await VideoPost.aggregate([
        {
            $match: {
                _id: post._id
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'PostAuthor',
                foreignField: '_id',
                as: 'author',
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                        
                    }
                ]
            }
        }
        
    ])

    return res
    .status(201)
    .json(
        new ApiResponse(200, UserAggregate, "The Video has been successfully uploaded")
    )
})

const createImagePost = asyncHandler(async (req, res) => {
    const { title } = req.body;
    const files = req.files;

    console.log(files)
    if(title === "") {
        throw new ApiError(400, "Adding a title is required")
    }

    let imagePath;
    let uploadedImage;
    let imagesArray = [];

    const imageUpload = async (files) => {
        // const imagesArray = [];
        for(const element of files)  {
            imagePath = element.path
            uploadedImage = await uploadOnCloudinary(imagePath)
            console.log(uploadedImage)
            if(uploadedImage) {
                imagesArray.push(uploadedImage.url)
            }
        }
    }

    await imageUpload(files)
  
    const postImages = {
        title,
        PostAuthor: req.user._id,
        images: imagesArray
    }; 
   const post = await ImagePost.create(postImages);


    const UserAggregate = await ImagePost.aggregate([
        {
            $match: {
                _id: post._id
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'PostAuthor',
                foreignField: '_id',
                as: 'author',
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username: 1,
                            avatar: 1
                        }
                        
                    }
                ]
            }
        }
        
    ])
    
    return res.status(201).json(
        new ApiResponse(200, UserAggregate, "Images Uploaded successfully")
    )
})

const homePagePostsDisplay = asyncHandler(async (req, res) => {

    const blogPosts = await BlogPost.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "blogpost",
                as: "likes"
            }
        }, 
        {
            $addFields: {
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                },
                likesCount: {
                    $size: "$likes"
                }
            }
        }
    ]);

    const imagePosts = await ImagePost.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "image",
                as: "likes"
            }
        }, 
        {
            $addFields: {
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                },
                likesCount: {
                    $size: "$likes"
                }
            }
        }
    ]);
    const videoPosts = await VideoPost.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "video",
                as: "likes"
            }
        }, 
        {
            $addFields: {
                isLiked: {
                    $cond: {
                        if: {$in: [req.user?._id, "$likes.likedBy"]},
                        then: true,
                        else: false
                    }
                },
                likesCount: {
                    $size: "$likes"
                }
            }
        }
    ]);
    //combining the posts
    const allPosts = [...blogPosts, ...imagePosts, ...videoPosts];

    allPosts.sort((a, b) => b.createdAt - a.createdAt);

    
    res
    .status(201)
    .json({"done":allPosts})
})

const videosDisplay = asyncHandler(async (req, res) => {
    const videoPosts = await VideoPost.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ]);
    //combining the posts
    const allPosts = [...videoPosts];

    allPosts.sort((a, b) => b.createdAt - a.createdAt);

    
    res
    .status(201)
    .json({"done":allPosts})
})

const blogsDisplay = asyncHandler(async (req, res) => {

    const blogPosts = await BlogPost.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ]);

    //combining the posts
    const allPosts = [...blogPosts];

    allPosts.sort((a, b) => b.createdAt - a.createdAt);

    res
    .status(201)
    .json({"done":allPosts})
})

const imagesDisplay = asyncHandler(async (req, res) => {
    const imagePosts = await ImagePost.aggregate([
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ]);

    //combining the posts
    const allPosts = [...imagePosts];

    allPosts.sort((a, b) => b.createdAt - a.createdAt);
    res
    .status(201)
    .json({"done":allPosts})
})

/*user profile display of posts*/
const getUsersPosts = asyncHandler(async (req, res) => {

    const { username } = req.params

    const user = await User.findOne({
        username: username
    })

    const blogPosts = await BlogPost.aggregate([
        {
            $match: {
                PostAuthor: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ]);

    const imagePosts = await ImagePost.aggregate([
        {
            $match: {
                PostAuthor: user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ]);
    const videoPosts = await VideoPost.aggregate([
        {
            $match: {
                PostAuthor: user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ]);
    //combining the posts
    const allPosts = [...blogPosts, ...imagePosts, ...videoPosts];

    allPosts.sort((a, b) => b.createdAt - a.createdAt);
    
    res
    .status(201)
    .json({"done":allPosts})
})
/*user profile display of image only*/
const getUserimagesDisplay = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({
        username: username
    })
    
    const imagePosts = await ImagePost.aggregate([
        {
            $match: {
                PostAuthor: user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ]);

    //combining the posts
    const allPosts = [...imagePosts];

    allPosts.sort((a, b) => b.createdAt - a.createdAt);
    res
    .status(201)
    .json({"done":allPosts})
})
/*user profile display of video only*/
const getUserVideosDisplay = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({
        username: username
    })
    const videoPosts = await VideoPost.aggregate([
        {
            $match: {
                PostAuthor: user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ]);
    //combining the posts
    const allPosts = [...videoPosts];

    allPosts.sort((a, b) => b.createdAt - a.createdAt);

    
    res
    .status(201)
    .json({"done":allPosts})
})
/*user profile display of blogs only*/
const getUserblogsDisplay = asyncHandler(async (req, res) => {
    const { username } = req.params

    const user = await User.findOne({
        username: username
    })

    const blogPosts = await BlogPost.aggregate([
        {
            $match: {
                PostAuthor: user._id
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "PostAuthor",
                foreignField: "_id",
                as: "author",
                pipeline: [
                    {
                        $project: {
                            fullname: 1,
                            username:1,
                            avatar: 1
                        }
                    }
                ]
            }
        }
    ]);

    //combining the posts
    const allPosts = [...blogPosts];

    allPosts.sort((a, b) => b.createdAt - a.createdAt);

    res
    .status(201)
    .json({"done":allPosts})
})

export {
    createPost,
    createVideoPost,
    createImagePost,
    homePagePostsDisplay,
    videosDisplay,
    blogsDisplay,
    imagesDisplay,
    getUsersPosts,
    getUserimagesDisplay,
    getUserVideosDisplay,
    getUserblogsDisplay
}