import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
    following: { // Follow request to this user
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Following userId is Required"]
    },
    follower: { // Follow request by this user
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, "Follower userId is Required"]
    },
    status: {
        type: mongoose.Schema.Types.Enum,
        enum: {
            value: ["pending", "accepted", "rejected"],
            default: "pending",
            message: "Status must be either 'pending', 'accepted', or 'rejected'"
        }
    }
}, {timestamps: true});

const followModel = mongoose.model("follows", followSchema);

followModel.createIndexes({ follower: 1, following: 1 }, { unique: true }); // This ensures that a user can follow another specific user only once.
followModel.createIndexes({ follower : 1 }); // This index allows for efficient retrieval of all follow relationships initiated by a specific user.
followModel.createIndexes({ following : 1 }); // This index allows for efficient retrieval of all follow relationships targeting a specific user.

export default followModel;