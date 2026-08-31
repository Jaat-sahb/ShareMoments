import express from "express";
import { createPostController, getPostsByUserIdController, getPostByPostIdController, likePostController, removeLikeFromPostController, getLikesForPostController, getLikesCountForPostController, getLikedPostsByUserController } from "../controllers/post.controller.js";
import { authenticateUserMidelleware } from "../middlewares/auth.middleware.js";
import multer from "multer";

const upload = multer({
    storage: multer.memoryStorage()
});

const postRouter = express.Router();

/*
* 1. POST "/api/posts/create"
*/
postRouter.post('/create', authenticateUserMidelleware, upload.single("image_file"), createPostController);

/*
* 2. GET "/api/posts"
*/
postRouter.get('/', authenticateUserMidelleware, getPostsByUserIdController);

/**
* 3. GET "/api/posts/:postId"
*/
postRouter.get('/:postId', authenticateUserMidelleware, getPostByPostIdController);

/**
* 4. POST "/api/posts/like/:postId"
*/
postRouter.post('/like/:postId', authenticateUserMidelleware, likePostController);

/**
* 5. DELETE "/api/posts/remove-like/:postId"
*/
postRouter.delete('/remove-like/:postId', authenticateUserMidelleware, removeLikeFromPostController);

/**
* 6. GET "/api/posts/get-likes/:postId"
* - this endpoint will return the list of users who liked the post with the given postId to the user who owns the post with the given postId. This endpoint will not return the list of users who liked the post to any other user.
*/
postRouter.get('/get-likes/:postId', authenticateUserMidelleware, getLikesForPostController);

/**
 * 7. GET "/api/posts/get-likes-count/:postId"
 * - this endpoint will return the count of users who liked the post with the given postId.
 */
postRouter.get('/get-likes-count/:postId', authenticateUserMidelleware, getLikesCountForPostController);

/**
 * 8. GET "/api/posts/get-liked-posts"
 * - this endpoint will return the list of posts liked by the user who called this endpoint.
 */
postRouter.get('/get-liked-posts', authenticateUserMidelleware, getLikedPostsByUserController);

export default postRouter;