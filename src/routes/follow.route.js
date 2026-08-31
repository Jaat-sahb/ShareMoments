import express from "express";
import { authenticateUserMidelleware } from "../middlewares/auth.middleware.js";
import { followUserController, getFollowersListController, getFollowingListController, unfollowUserController } from "../controllers/follow.controller.js";

const followRouter = express.Router();
// Endpoints for Follow operations such as follow, unfollow, and getting followers/following lists can be defined here.

/**
 * 1. POST "/api/users/follow/:userId"
 * - to perform follow operation using userId of the user to be followed
 */
followRouter.post("/follow/:userId", authenticateUserMidelleware, followUserController);

/**
 * 2. DELETE "/api/users/unfollow/:userId"
 * - to perform unfollow operation using userId of the user to be unfollowed
 */
followRouter.delete("/unfollow/:userId", authenticateUserMidelleware, unfollowUserController);

/**
* 3. GET "/api/users/followings"
* - to get the list of users the user who called this endpoint follows
*/
followRouter.get("/followings", authenticateUserMidelleware, getFollowingListController);

/**
* 4. GET "/api/users/followers"
* - to get the list of users following the user who make call to this endpoint
*/
followRouter.get("/followers", authenticateUserMidelleware, getFollowersListController);

/**
 * 5. GET "/api/users/follow-requests"
 * - to get the list of follow docs of users whose status is "pending" sent by the user who called this endpoint
 */
followRouter.get("/follow-requests", authenticateUserMidelleware, getFollowRequestsController);

/**
 * 6. PATCH "/api/users/action-on-follow-request/:followId/:action"
 * - to accept or reject a follow request by its ID
 */
followRouter.patch("/action-on-follow-request/:followId/:action", authenticateUserMidelleware, actionOnFollowRequestController);

export default followRouter;