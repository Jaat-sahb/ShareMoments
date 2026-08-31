import mongoose from "mongoose";


const postSchema = new mongoose.Schema({
    caption: String,
    img_url: {
        type: String,
        required: [true, "image URL is required!"]
    },
    thumbnail_url: {
        type: String,
        required: [true, "Thumbnail URL is required!"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required!"]
    }
});

const postModel = mongoose.model("post", postSchema);

export default postModel;