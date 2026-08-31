import followModel from "../modles/follow.model.js";
import userModel from "../modles/user.modle.js";

export async function followUserController(req, res) {
    const currentUser_id = req.userId;
    const userToFollow_id = req.params.userId;

    // Check If both are same to avoid self Following
    if (currentUser_id === userToFollow_id) {
        return res.status(400).json({ msg: "Can not follow self" });
    }

    // Check if the requested user Exists
    const user = await userModel.findById(userToFollow_id);

    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }

    // Check if already Following
    const isFollowing = await followModel.findOne({
        follower: currentUser_id,
        following: userToFollow_id
    });

    if (isFollowing) {
        return res.status(409).json({ msg: "Already Following" });
    }

    // Now add this relation to follow collection
    const follow = await followModel.create({
        follower: currentUser_id,
        following: userToFollow_id
    });

    return res.status(201).json({ msg: "Followed successfully", follow });
}

export async function unfollowUserController(req, res) {
    const currentUser_id = req.userId;
    const userToUnFollow_id = req.params.userId;

    // if exist delete the document in follow collection with follower: currentUser_id, following: userToUnFollow_id;
    const follow = await followModel.findOneAndDelete({
        follower: currentUser_id,
        following: userToUnFollow_id
    })

    res.status(200).json({ msg: "Unfollowed successfully", follow });
}

export async function getFollowingListController(req, res) {
    const userId = req.userId;

    const followings = await followModel.find({ follower: userId }).populate("following", "username");

    res.status(200).json({ msg: "Followings fetched successfully", followings });
}

export async function getFollowersListController(req, res) {
    const userId = req.userId;

    const followers = await followModel.find({ following: userId }).populate("follower", "username");

    res.status(200).json({ msg: "Followers fetched successfully", followers });
}

export async function getFollowRequestsController(req, res) {
    const userId = req.userId;

    // get all the follow docs where "user" is "userId" and status is "pending"
    const followRequests = await followModel.find({ following: userId, status: "pending" }).populate("follower", "username");

    res.status(200).json({ msg: "Follow requests fetched successfully", followRequests });
}

export async function actionOnFollowRequestController(req, res) {
    const followId = req.params.followId;
    const userId = req.userId;
    const action = req.params.action;

    if (!["accept", "reject"].includes(action)) {
        return res.status(400).json({ msg: "Invalid action" });
    }

    // Check if this follow doc exist and have this user as "following" and status is "pending"
    const followDoc = await followModel.findById(followId);

    if(!followDoc){
        return res.status(404).json({ msg: "Follow request not found" });
    }

    if(followDoc.following.toString() !== userId.toString()){
        return res.status(403).json({ msg: "Unauthorized" });
    }

    if(followDoc.status !== "pending"){
        return res.status(400).json({ msg: "Follow request is not pending" });
    }

    // Update the status
    if(action === "reject"){
        followDoc.status = "rejected";
    } else{
        followDoc.status = "accepted";
    }

    await followDoc.save();
    
    res.status(200).json({ msg: "Follow request updated successfully", followDoc });
}