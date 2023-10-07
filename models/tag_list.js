import mongoose from "mongoose";

const taglistSchema = new mongoose.Schema({
    post_id:[
        {
            type: mongoose.ObjectId,
            ref: "posts",
            require: true
        }
    ],
    tag: {
        type: String,
        require: true
    }
})

export default mongoose.model("tag_lists", taglistSchema);