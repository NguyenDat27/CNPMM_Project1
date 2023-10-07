import mongoose, { trusted } from "mongoose";

const postSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    description:{
        type: String,
        require: true
    },
    url:{
        type: String,
        require: true
    },
    likes:{
        type: Number,
        require: true
    },
    post_by:{
        type: String,
        require: true
    }
})

export default mongoose.model("posts", postSchema);