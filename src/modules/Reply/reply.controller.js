import commentModel from "../../../DB/models/comment.model.js"
import replyModel from "../../../DB/models/reply.model.js"

//====================== add reply===========================//
export const addReply = async (req, res, next) => {
    const { content, onModel } = req.body
    const { _id } = req.authUser
    const { replyOnId } = req.params   // comment id , reply id

    if (onModel == 'Comment') {
        // check commentId
        const comment = await commentModel.findById(replyOnId)
        if (!comment) return next(new Error('comment not found', { cause: 404 }))
    } else if (onModel == 'Reply') {
        // check replyId
        const reply = await replyModel.findById(replyOnId)
        if (!reply) return next(new Error('reply not found', { cause: 404 }))
    }

    // create reply
    const reply = await replyModel.create({ content, addedBy: _id, onModel, replyOnId })
    res.status(201).json({ message: 'reply added successfully', reply })
}


//========================== like reply ======================//
export const likeOrUnlikeReply = async (req, res, next) => {
    /* 
     * step 4
     * step 5
     * step 6 
     * logic of likeOrUnlike
     */
    const { replyId } = req.params
    const { onModel } = req.body
    const { accesstoken } = req.headers

    axios({
        method: 'post',
        url: `http://localhost:3000/like/${replyId}`,
        data: {
            onModel
        },
        headers: {
            accesstoken
        }
    }).then((response) => {
        // console.log(response.data);
        res.status(200).json({ response: response.data })
    }).catch((err) => {
        // console.log(err);
        res.status(500).json({ catch: err.data })
    })
}
