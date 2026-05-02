// @ts-nocheck
import { asyncHandler } from "../../utils/response/asyncHandler";
import { ApiResponse } from "../../utils/response/ApiResponse";
import { User } from "../../model/user.model";
import { Env } from "../../model/env.model";
import { BlogPost } from "../../model/blogpost.model";
import { ImagePost } from "../../model/imagepost.model";
import { VideoPost } from "../../model/videopost.model";
import { Follow } from "../../model/follow.model";
import { Joins } from "../../model/joins.model";

const SEARCH_SCOPES = ["all", "people", "spaces", "posts"];

const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toLimit = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, 1), 20);
};

const toOffset = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.max(parsed, 0);
};

const buildPagination = (totalCount, limit, offset) => {
  const hasMore = offset + limit < totalCount;

  return {
    limit,
    offset,
    nextOffset: hasMore ? offset + limit : null,
    hasMore,
  };
};

const normalizePost = (post, type) => ({
  _id: post._id,
  type,
  title: post.title || "",
  description: post.description || "",
  image: post.image || post.images?.[0] || "",
  video: post.video || "",
  community: post.community || "",
  createdAt: post.createdAt,
  author: post.PostAuthor
    ? {
        _id: post.PostAuthor._id,
        username: post.PostAuthor.username,
        fullname: post.PostAuthor.fullname,
        avatar: post.PostAuthor.avatar,
      }
    : null,
});

const searchResources = asyncHandler(async (req, res) => {
  const query = `${req.query.q || ""}`.trim();
  const scope = SEARCH_SCOPES.includes(req.query.scope) ? req.query.scope : "all";
  const limit = toLimit(req.query.limit, 6);
  const offset = toOffset(req.query.offset);

  if (!query) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          query,
          scope,
          people: [],
          spaces: [],
          posts: [],
          pagination: buildPagination(0, limit, offset),
        },
        "Search results fetched successfully",
      ),
    );
  }

  const regex = new RegExp(escapeRegex(query), "i");

  const shouldSearchPeople = scope === "all" || scope === "people";
  const shouldSearchSpaces = scope === "all" || scope === "spaces";
  const shouldSearchPosts = scope === "all" || scope === "posts";

  const peoplePromise = shouldSearchPeople
    ? User.find(
        {
          _id: { $ne: req.user?._id },
          $or: [{ username: regex }, { fullname: regex }, { about: regex }],
        },
        "fullname username avatar about",
      )
        .sort({ createdAt: -1 })
        .lean()
    : Promise.resolve([]);

  const spacesPromise = shouldSearchSpaces
    ? Env.find(
        {
          $or: [{ name: regex }, { description: regex }],
        },
        "name description envAvatar",
      )
        .sort({ createdAt: -1 })
        .lean()
    : Promise.resolve([]);

  const postPopulate = { path: "PostAuthor", select: "username fullname avatar" };

  const postsPromise = shouldSearchPosts
    ? Promise.all([
        BlogPost.find(
          {
            isPublished: true,
            $or: [{ title: regex }, { description: regex }, { community: regex }],
          },
          "title description image attachments community createdAt type PostAuthor",
        )
          .populate(postPopulate)
          .sort({ createdAt: -1 })
          .lean(),
        ImagePost.find(
          {
            isPublished: true,
            $or: [{ title: regex }, { community: regex }],
          },
          "title images community createdAt type PostAuthor",
        )
          .populate(postPopulate)
          .sort({ createdAt: -1 })
          .lean(),
        VideoPost.find(
          {
            isPublished: true,
            $or: [{ description: regex }, { community: regex }],
          },
          "description video community createdAt type PostAuthor",
        )
          .populate(postPopulate)
          .sort({ createdAt: -1 })
          .lean(),
      ]).then(([blogPosts, imagePosts, videoPosts]) =>
        [...blogPosts.map((post) => normalizePost(post, "blogpost"))]
          .concat(imagePosts.map((post) => normalizePost(post, "image")))
          .concat(videoPosts.map((post) => normalizePost(post, "video")))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      )
    : Promise.resolve([]);

  const [people, spaces, posts] = await Promise.all([
    peoplePromise,
    spacesPromise,
    postsPromise,
  ]);

  const paginatedPeople = people.slice(offset, offset + limit);
  const paginatedSpaces = spaces.slice(offset, offset + limit);
  const paginatedPosts = posts.slice(offset, offset + limit);

  const followedChannels = paginatedPeople.length
    ? await Follow.find(
        {
          subscriber: req.user?._id,
          channel: { $in: paginatedPeople.map((person) => person._id) },
        },
        "channel",
      ).lean()
    : [];

  const joinedCommunities = paginatedSpaces.length
    ? await Joins.find(
        {
          JoinedBy: req.user?._id,
          community: { $in: paginatedSpaces.map((space) => space.name) },
        },
        "community",
      ).lean()
    : [];

  const followedIds = new Set(followedChannels.map((item) => String(item.channel)));
  const joinedNames = new Set(joinedCommunities.map((item) => item.community));
  const totalCount = Math.max(
    shouldSearchPeople ? people.length : 0,
    shouldSearchSpaces ? spaces.length : 0,
    shouldSearchPosts ? posts.length : 0,
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        query,
        scope,
        people: paginatedPeople.map((person) => ({
          ...person,
          isFollowing: followedIds.has(String(person._id)),
        })),
        spaces: paginatedSpaces.map((space) => ({
          ...space,
          isJoined: joinedNames.has(space.name),
        })),
        posts: paginatedPosts,
        pagination: buildPagination(totalCount, limit, offset),
      },
      "Search results fetched successfully",
    ),
  );
});

export { searchResources };
