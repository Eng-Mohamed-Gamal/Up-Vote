import commentModel from "../../../DB/models/comment.model.js"
import likesModel from "../../../DB/models/likes.model.js"
import productModel from "../../../DB/models/product.model.js"
import replyModel from "../../../DB/models/reply.model.js"


//========================= get user likes history =======================//
export const getUserLikesHistory = async (req, res, next) => {
    const { _id } = req.authUser
    // generate object to assgin the filter object to it then send it to find method
    let queryFilter = {}
    if (req.query.onModel) queryFilter.onModel = req.query.onModel  // if there is onModel in query so didn't consider it as condition
    queryFilter.likedBy = _id
    const likes = await likesModel.find(queryFilter).populate([
        {
            path: 'likeDoneOnId',
            populate: {
                path: 'addedBy',
                select: 'username'
            } // nested populate
        }
    ])

    res.status(200).json({ message: 'done', likes })
}



export const likeOrUnlike = async (req, res, next) => {

    const { likeDoneOnId } = req.params  // productId or commentId or replyId
    const { _id } = req.authUser
    const { onModel } = req.body

    let dbModel = ''
    if (onModel === 'Product') dbModel = productModel
    else if (onModel == 'Comment') dbModel = commentModel
    else if (onModel == 'Reply') dbModel = replyModel
    //check productId  
    const document = await dbModel.findById(likeDoneOnId)
    if (!document) return next(new Error(` ${onModel} is not found'`, { cause: 404 }))


    const isAlreadyLiked = await likesModel.findOne({ likedBy: _id, likeDoneOnId }) 
    if (isAlreadyLiked) {
        // delete like document from likes collection
        await likesModel.findByIdAndDelete(isAlreadyLiked._id)
        // decrement numberOfLikes in product document by 1
        document.numberOfLikes -= 1
        await document.save()
        return res.status(200).json({ message: 'unLike Done', count: document.numberOfLikes })

    }
    // create like
    // create like document in likes collection
    const like = await likesModel.create({ onModel, likedBy: _id, likeDoneOnId })
    // increment numberOfLikes in product document by 1
    document.numberOfLikes += 1
    await document.save()

    res.status(200).json({ message: 'Like Done', like, count: document.numberOfLikes })
}