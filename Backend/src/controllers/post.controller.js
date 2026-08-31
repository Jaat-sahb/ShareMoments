import likeModel from "../modles/like.model.js";
import postModel from "../modles/post.model.js";
import { uploadPostImage } from "../services/storage.service.js";


export async function createPostController(req, res) {

    const caption = req.body.caption;
    const userId = req.userId;

    // upload image to imageKit and fetch URL
    const { url,thumbnailUrl } = await uploadPostImage(req.file);

    // Upload everything to DB post in DB
    const post = await postModel.create({
        img_url: url,
        thumbnail_url: thumbnailUrl,
        caption,
        user: userId,
    })

    // send response to client with necessary data only
    res.status(201).json({
        message: "Post created successfully",
        post
    })
}

export async function getPostsByUserIdController(req, res) {
    const posts = await postModel.find({
        user: req.userId
    }).populate("user", "-password -email"); // populate user data in post but not password and email
    res.status(200).json({
        message: "Posts fetched successfully",
        posts
    })
}

export async function getPostByPostIdController(req, res) {
    const postId = req.params.postId;
    const userId = req.userId;

    // Fetch the post only if it belongs to the current user.
    const post = await postModel.findOne({
        _id: postId,
        user: userId
    }).populate("user", "-password -email");
    if(!post){
        return res.status(404).json({
            message: "Post not found"
        })
    }

    res.status(200).json({
        message: "Post fetched successfully",
        post
    })
}

export async function likePostController(req, res) {
    const postId = req.params.postId;
    const userId = req.userId;

    // get Post data from postModel and check if its exist or not
    const post = await postModel.findById(postId);

    if (!post) {
        return res.status(404).json({ msg: "Post does not exist" });
    }

    // check if user already liked the Post
    const alreadyLiked = await likeModel.findOne({
        user: userId,
        post: postId
    });

    if (alreadyLiked) {
        return res.status(409).json({ msg: "Already liked the post" });
    }

    // create new like doc
    const like = await likeModel.create({
        user: userId,
        post: postId
    });

    return res.status(201).json({
        msg: "Liked post successfully",
        like
    });
}

export async function removeLikeFromPostController(req, res) {
    const postId = req.params.postId;
    const userId = req.userId;

    // get Post data from postModel and check if its exist or not
    const post = await postModel.findById(postId);

    if (!post) {
        return res.status(404).json({ msg: "Post does not exist" });
    }

    // check if user liked the Post
    const liked = await likeModel.findOne({
        user: userId,
        post: postId
    });

    if (!liked) {
        return res.status(404).json({ msg: "You have not liked this post" });
    }

    // delete the like from post
    const likeDeleted = await likeModel.findByIdAndDelete(liked._id);

    return res.status(200).json({
        msg: "Deleted like successfully",
        likeDeleted
    });
}

export async function getLikesForPostController(req, res) {
    const postId = req.params.postId;
    const userId = req.userId;

    // Check if this post exist and belongs to the user
    const post = await postModel.findById(postId);

    if (!post) {
        return res.status(404).json({
            msg: "Post does not exist"
        });
    }

    if (post.user.toString() !== userId.toString()) {
        return res.status(403).json({ msg: "Unauthorized" });
    }

    // Get all the likes to this post
    const likes = await likeModel.find({ post: postId }).populate("user", "username");

    return res.status(200).json({
        msg: "Likes fetched successfully",
        likes
    });
}

export async function getLikesCountForPostController(req, res) {
    const postId = req.params.postId;

    // check is Post Exists
    const post = await postModel.findById(postId);

    if (!post) {
        return res.status(404).json({ msg: "Post does not exist" });
    }

    // Get the likes count
    const likesCount = await likeModel.countDocuments({ post: postId });

    return res.status(200).json({
        msg: "Likes count calculated successfully",
        likesCount
    });
}

export async function getLikedPostsByUserController(req, res) {
    const userId = req.userId;

    // get the posts that user Liked
    const likedPosts = await likeModel.find({ user: userId }).populate("post");

    return res.status(200).json({
        msg: "Liked posts fetched successfully",
        likedPosts
    });
}