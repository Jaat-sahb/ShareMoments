import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        required: true
    }
}, { timestamps: true });

const likeModel = mongoose.model("Like", likeSchema);

likeModel.createIndexes({ user: 1, post: 1 }, { unique: true }); // This ensures that a user can like a specific post only once.
likeModel.createIndexes({ user: 1 }); // This index allows for efficient retrieval of all likes made by a specific user.
likeModel.createIndexes({ post: 1 }); // This index allows for efficient retrieval of all likes on a specific post.

export default likeModel;