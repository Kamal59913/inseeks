// @ts-nocheck
import { ApiError } from "../../utils/response/ApiError";
import { asyncHandler } from "../../utils/response/asyncHandler";
import { BlogPost } from "../../model/blogpost.model.js";
import { VideoPost } from "../../model/videopost.model.js";
import { ImagePost } from "../../model/imagepost.model.js";
import { uploadOnCloudinary } from "../../utils/cloudinary.js";
import { ApiResponse } from "../../utils/response/ApiResponse";
import { User } from "../../model/user.model.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

const PUBLIC_DOCS_DIR = path.resolve(process.cwd(), "src/public/uploads/documents");
const COMMENT_COLLECTION = "commentposts";

const ensureDirectory = (directoryPath) => {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
};

const buildPublicFileUrl = (req, relativePath) => {
    const forwardedProto = req.headers["x-forwarded-proto"];
    const protocol = forwardedProto ? String(forwardedProto).split(",")[0] : req.protocol;
    const normalizedPath = relativePath.replace(/\\/g, "/").replace(/^\/+/, "");

    return `${protocol}://${req.get("host")}/${normalizedPath}`;
};

const persistDocumentLocally = (req, file) => {
    ensureDirectory(PUBLIC_DOCS_DIR);

    const extension = path.extname(file.originalname || file.filename || "");
    const baseName = path.basename(file.originalname || file.filename || "document", extension);
    const safeBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, "_");
    const finalFileName = `${Date.now()}-${safeBaseName}${extension || ""}`;
    const finalPath = path.join(PUBLIC_DOCS_DIR, finalFileName);

    fs.renameSync(file.path, finalPath);

    return {
        url: buildPublicFileUrl(req, path.join("uploads", "documents", finalFileName)),
        resourceType: "raw",
        mimeType: file.mimetype,
        originalName: file.originalname,
        bytes: file.size
    };
};

const discussionLookupStages = [
    {
        $lookup: {
            from: COMMENT_COLLECTION,
            let: {
                postIdString: { $toString: "$_id" }
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $eq: ["$PostId", "$$postIdString"]
                        }
                    }
                }
            ],
            as: "discussionEntries"
        }
    },
    {
        $addFields: {
            conversationCount: {
                $size: "$discussionEntries"
            }
        }
    },
    {
        $project: {
            discussionEntries: 0
        }
    }
];

const createPost = asyncHandler(async (req, res) => {
    const { title = "", description = "", envname } = req.body;
    const filesMap = Array.isArray(req.files) ? {} : (req.files || {});
    const uploadedFiles = [
        ...(filesMap.attachments || []),
        ...(filesMap.image || [])
    ];

    if(description.trim() === "") {
        throw new ApiError(400, "Adding a description is required")
    }

    if(title.trim() === "") {
        throw new ApiError(400, "Adding a title is required")
    }

    if(String(envname || "").trim() === "") {
        throw new ApiError(400, "Selecting a space is required")
    }

    const attachments = [];

    for (const file of uploadedFiles) {
        const mimeType = file.mimetype?.toLowerCase() || "";
        const isDocument = mimeType === "application/pdf" || mimeType.startsWith("application/");

        if (isDocument) {
            attachments.push(persistDocumentLocally(req, file));
            continue;
        }

        const uploadedAsset = await uploadOnCloudinary(file.path);

        if(!uploadedAsset?.url && !uploadedAsset?.secure_url) {
            throw new ApiError(400, "Error while uploading an attachment")
        }

        attachments.push({
            url: uploadedAsset.secure_url || uploadedAsset.url,
            resourceType: uploadedAsset.resource_type || file.mimetype?.split("/")[0],
            mimeType: file.mimetype,
            originalName: file.originalname,
            bytes: uploadedAsset.bytes || file.size
        });
    }

    const firstImageAttachment = attachments.find((attachment) => {
        const mimeType = attachment.mimeType?.toLowerCase() || "";
        const url = attachment.url?.toLowerCase() || "";

        if (mimeType === "application/pdf" || url.endsWith(".pdf")) {
            return false;
        }

        return mimeType.startsWith("image/") || attachment.resourceType === "image";
    });

    const postData = {
        title: title.trim(),
        description: description.trim(),
        PostAuthor: req.user._id,
        community: envname,
        attachments,
        image: firstImageAttachment?.url
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
    const {description, envname} = req.body;
    
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

    if(String(envname || "").trim() === "") {
        throw new ApiError(400, "Selecting a space is required")
    }

    const post = await VideoPost.create({       
            description,
            PostAuthor: req.user._id,
            video: video.url,
            community: envname
        
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
    const { title, envname } = req.body;
    const files = req.files;

    console.log(files)
    if(title === "") {
        throw new ApiError(400, "Adding a title is required")
    }

    if(String(envname || "").trim() === "") {
        throw new ApiError(400, "Selecting a space is required")
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
        images: imagesArray,
        community: envname
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
        },
        ...discussionLookupStages
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
