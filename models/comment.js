import mongoose, { isObjectIdOrHexString } from "mongoose";

const commentSchema = new mongoose.Schema({
    post_id:[
        {
            type: mongoose.ObjectId,
            ref: "posts",
            required: true
        }
    ],
    by_user:{
        type: String,
        require: true
    },
    message:{
        type: String,
        require: true
    },
    date_time:{
        type: String,
        require: true
    },
    likes:{
        type: Number,
        require: true
    }
})

export default mongoose.model("comments", commentSchema);