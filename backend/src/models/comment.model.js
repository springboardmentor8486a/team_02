import mongoose ,{ Schema } from "mongoose";

let commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        reuired: true
    },
    content: {
        type: String,
        requred: true,
    },
    
    createdAt: {
        type: Date,
        default: new Date(Date.now())
    },

    updatedAt: {
        type: Date,
        default: new Date(Date.now())
    },
});

export const Comment = mongoose.model("Comment", commentSchema);
 